import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { TimelineService } from 'src/app/services/timeline/timeline.service';

type ItotalsByYear = {
  year: any,
  total_government: any,
  total_commercial: any,
  total_private: any,
}

@Component({
  selector: 'agency-graph',
  templateUrl: './agency-graph.component.html',
  styleUrls: ['./agency-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgencyGraphComponent implements OnInit, OnChanges {
  @Input() step = 0;
  timeline = new TimelineService();

  primaryColor = '#cfc9a6';
  secondaryColor = '#c8b3e2';
  tertieryColor = '#ae4949';
  gridColor = '#b8a6cf40';
  plotColors = ['#896fa9', this.primaryColor, this.tertieryColor];
  successColor = '#7ba870';

  data = [{}];
  traceGovernment: any;
  traceCommercial: any;
  tracePrivate: any;
  traceLaunches: any;

  layout = {
    autosize: true,
    title: {
      text: 'Number of existing Space Agencies',
      font: { size: 30, color: this.primaryColor },
    },
    showlegend: true,
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    colorway: this.plotColors,
    height: 600,
    width: 900,
    margin: { t: 175, b: 100 },
    font: {
      color: this.secondaryColor,
      family: 'Helvetica Neue',
      size: 15,
    },
    xaxis: {
      range: ['1945', '2022'],
      gridcolor: this.gridColor,
    },
    yaxis: {
      gridcolor: this.gridColor,
      range: [0, 45],
    },
    yaxis2: {
      gridcolor: '#fff0',
      title: 'Launches',
      side: 'right',
      range: [0, 30]
    },
    annotations: [{}],
    shapes: [{}],
  };

  dataSubject$: Subject<any> = new BehaviorSubject<any>(this.data);
  layoutSubject$: Subject<any> = new BehaviorSubject<any>(this.layout);



  /**
   * ===== Space Race =====
   */

  spaceRaceAnnotation = {
    text: 'Space Race<br>1957 - 1969',
    font: { color: this.secondaryColor, size: 17 },
    x: (this.timeline.spaceRaceStart.getTime() + this.timeline.firstMoonLanding.getTime()) / 2,
    yref: 'paper',
    y: -0.25,
    showarrow: false,
  };
  spaceRaceRect = {
    type: 'rect',
    xref: 'x',
    x0: this.timeline.spaceRaceStart.getTime(),
    x1: this.timeline.firstMoonLanding.getTime(),
    yref: 'paper',
    y0: -0.3,
    y1: 1,
    line_width: 0,
    fillcolor: this.secondaryColor,
    opacity: 0.1,
  };


  /**
   * ===== SpaceX Founding =====
   */

  spaceXFoundingAnnotation = {
    text: 'SpaceX Founding',
    font: { size: 20 },
    x: this.timeline.spaceXFounding.getTime(),
    yref: 'paper',
    y: 1.16,
    showarrow: false,
  };
  spaceXFoundingLine = {
    type: 'line',
    xref: 'x',
    x0: this.timeline.spaceXFounding.getTime(),
    x1: this.timeline.spaceXFounding.getTime(),
    yref: 'paper',
    y0: 0,
    y1: 1.08,
    line: {
      color: this.secondaryColor,
      dash: 'longdash',
      width: 3,
    }
  };


  /**
   * ===== SpaceX First Landing Test =====
   */

  spaceXFirstTestAnnotation = {
    text: 'Booster Landing Tests begin',
    font: { size: 20 },
    x: this.timeline.spaceXFirstTestLanding.getTime(),
    yref: 'paper',
    y: 1.16,
    showarrow: false,
  };
  spaceXFirstTestLine = {
    type: 'line',
    xref: 'x',
    x0: this.timeline.spaceXFirstTestLanding.getTime(),
    x1: this.timeline.spaceXFirstTestLanding.getTime(),
    yref: 'paper',
    y0: 0,
    y1: 1.08,
    line: {
      color: this.secondaryColor,
      dash: 'longdash',
      width: 3,
    }
  };


  /**
   * ===== SpaceX First Landing Test =====
   */

  spaceXFirstLandingAnnotation = {
    text: 'First Booster Landing',
    font: { color: this.successColor, size: 20 },
    x: this.timeline.spaceXFirstLanding.getTime(),
    yref: 'paper',
    y: -0.22,
    showarrow: false,
  };
  spaceXFirstLandingLine = {
    type: 'line',
    xref: 'x',
    x0: this.timeline.spaceXFirstLanding.getTime(),
    x1: this.timeline.spaceXFirstLanding.getTime(),
    yref: 'paper',
    y0: -0.12,
    y1: 1,
    line: {
      color: this.successColor,
      dash: 'longdash',
      width: 3,
    }
  };

  constructor(
    private http: HttpClient,
  ) {
    this.layout.annotations.splice(0);
    this.layout.shapes.splice(0);
  }

  ngOnInit(): void {
    this.http.get<ItotalsByYear>('./assets/agenciesPerYear.json').subscribe({
      next: (data) => {
        this.traceGovernment = {
          x: Object.values(data.year).map(year => new Date(year as number, 1)),
          y: Object.values(data.total_government),
          type: 'line',
          name: 'Government',
          color: this.plotColors[1],
        };
        this.traceCommercial = {
          x: Object.values(data.year).map(year => new Date(year as number, 1)),
          y: Object.values(data.total_commercial),
          type: 'line',
          name: 'Commercial',
          color: this.plotColors[0],
        };
        this.tracePrivate = {
          x: Object.values(data.year).map(year => new Date(year as number, 1)),
          y: Object.values(data.total_private),
          type: 'line',
          name: 'Private',
        };
      }
    });

    this.http.get<{
      year_month: any,
      new: any
    }>('./assets/launchesPerMonth.json').subscribe({
      next: (data) => {
        this.traceLaunches = {
          x: Object.values(data.year_month).map(epoch => new Date(epoch as string)),
          y: Object.values(data.new),
          type: 'scatter',
          mode: 'markers',
          marker: { size: 4 },
          name: 'Launches',
          yaxis: 'y2',
        }
      },
      error: () => console.error,
    });
  }

  ngOnChanges(): void {
    switch (this.step) {
      case 8:
        this.data = [this.traceGovernment];
        this.dataSubject$.next(this.data);
        this.layout.annotations = [];
        this.layout.shapes = [];
        this.layoutSubject$.next(this.layout);
        break;

      case 9:
        this.data = [this.traceGovernment, this.traceCommercial];
        this.dataSubject$.next(this.data);
        this.layout.annotations = [this.spaceRaceAnnotation];
        this.layout.shapes = [this.spaceRaceRect];
        this.layoutSubject$.next(this.layout);
        break;

      case 10:
        this.data = [this.traceGovernment, this.traceCommercial];
        this.dataSubject$.next(this.data);
        this.layout.annotations = [this.spaceXFoundingAnnotation];
        this.layout.shapes = [this.spaceXFoundingLine];
        this.layoutSubject$.next(this.layout);
        break;

      case 13:
        this.data = [this.traceGovernment, this.traceCommercial, this.tracePrivate];
        this.dataSubject$.next(this.data);
        this.layout.annotations = [this.spaceXFirstTestAnnotation, this.spaceXFirstLandingAnnotation];
        this.layout.shapes = [this.spaceXFirstTestLine, this.spaceXFirstLandingLine];
        this.layoutSubject$.next(this.layout);
        break;

      case 14:
        this.data = [this.traceLaunches, this.traceCommercial];
        this.dataSubject$.next(this.data);
        this.layout.annotations = [];
        this.layout.shapes = [];
        this.layoutSubject$.next(this.layout);
        break;

      default:
        break;
    }
  }
}
