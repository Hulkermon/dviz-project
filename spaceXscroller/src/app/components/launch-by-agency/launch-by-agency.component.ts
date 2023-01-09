import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimelineService } from 'src/app/services/timeline/timeline.service';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'launch-by-agency-graph',
  templateUrl: './launch-by-agency.component.html',
  styleUrls: ['./launch-by-agency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchByAgencyComponent implements OnInit, OnChanges {
  @Input() step = 0;
  timeline = new TimelineService();

  primaryColor = '#cfc9a6';
  secondaryColor = '#c8b3e2';
  tertieryColor = '#ae4949';
  gridColor = '#b8a6cf40';
  plotColors = ['#896fa9', this.primaryColor, this.tertieryColor];
  successColor = '#7ba870';

  data = [{}];
  trace: any;

  layout = {
    autosize: true,
    title: {
      text: 'Launches over time by Space Agency Type',
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
      range: [0, 30],
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
   * ===== SpaceX first Launch to Orbit =====
   */

  spaceXFirstLaunchAnnotation = {
    text: 'First Successful Launch to Orbit',
    font: { size: 20 },
    x: this.timeline.spaceXFirstLaunch.getTime(),
    yref: 'paper',
    y: 1.16,
    showarrow: false,
  };
  spaceXFirstLaunchLine = {
    type: 'line',
    xref: 'x',
    x0: this.timeline.spaceXFirstLaunch.getTime(),
    x1: this.timeline.spaceXFirstLaunch.getTime(),
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
   * ===== SpaceX First Landing =====
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
    this.layout.annotations = [this.spaceXFirstLaunchAnnotation, this.spaceXFirstLandingAnnotation];
    this.layout.shapes = [this.spaceXFirstLaunchLine, this.spaceXFirstLandingLine]
  }

  ngOnInit(): void {
    this.http.get<any>('./assets/launchesPerMonthByAgency.json').subscribe({
      next: res => {
        this.trace = {
          x: Object.values(res.year_month).map(epoch => new Date(epoch as string)),
          y: Object.values(res.new),
          type: 'scatter',
          mode: 'markers',
          marker: { size: 4 },
          transforms: [{
            type: 'groupby',
            groups: Object.values(res.agency_type).map(at => (at as string) === 'Multinational' ? 'Government' : (at as string) === 'Private' ? 'Commercial' : at),
          }]
        }
        this.data = [this.trace];
        this.dataSubject$.next(this.data);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
}
