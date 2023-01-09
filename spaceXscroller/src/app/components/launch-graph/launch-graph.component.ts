import { ChangeDetectionStrategy, Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import * as Plotly from 'plotly.js-dist-min';
import { TimelineService } from 'src/app/services/timeline/timeline.service';

@Component({
  selector: 'launch-graph',
  templateUrl: './launch-graph.component.html',
  styleUrls: ['./launch-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchGraphComponent implements OnInit, OnChanges {
  @Input() step = 0;
  timeline = new TimelineService();

  primaryColor = '#cfc9a6';
  secondaryColor = '#b8a6cf';
  gridColor = '#b8a6cf40';
  highlightColor = '#e24444';
  plotColors = [this.primaryColor, this.secondaryColor];
  successColor = '#7ba870';

  data = [{}];
  layout = {
    autosize: true,
    title: {
      text: 'Global Rocket Launches per Month',
      font: { size: 30, color: this.primaryColor },
    },
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
      range: ['1955', '2023'],
      gridcolor: this.gridColor,
    },
    yaxis: {
      range: [0, 30],
      gridcolor: this.gridColor,
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
   * ===== Moon Landing =====
   */

  moonLandingAnnotation = {
    text: 'First moon landing',
    font: { size: 20 },
    x: this.timeline.firstMoonLanding.getTime(),
    yref: 'paper',
    y: 1.16,
    showarrow: false,
  }
  moonLandingLine = {
    type: 'line',
    xref: 'x',
    x0: this.timeline.firstMoonLanding.getTime(),
    x1: this.timeline.firstMoonLanding.getTime(),
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
   * ===== After Space Race =====
   */

  afterSpaceRaceAnnotation = {
    text: `post Space Race decline<br>${this.timeline.firstMoonLanding.getFullYear()} - ${this.timeline.endOfLaunchDecline.getFullYear()}`,
    font: { color: this.secondaryColor, size: 17 },
    x: (this.timeline.firstMoonLanding.getTime() + this.timeline.endOfLaunchDecline.getTime()) / 2,
    yref: 'paper',
    y: -0.25,
    showarrow: false,
  };
  afterSpaceRaceRect = {
    type: 'rect',
    xref: 'x',
    x0: this.timeline.firstMoonLanding.getTime(),
    x1: this.timeline.endOfLaunchDecline.getTime(),
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




  constructor(
    private http: HttpClient,
  ) {
    this.layout.annotations.splice(0);
    this.layout.shapes.splice(0);
  }

  ngOnInit(): void {
    this.http.get<{
      year_month: any,
      new: any
    }>('./assets/launchesPerMonth.json').subscribe({
      next: (data) => {
        this.dataSubject$.next([{
          x: Object.values(data.year_month).map(epoch => new Date(epoch as string)),
          y: Object.values(data.new),
          type: 'scatter',
          mode: 'markers',
          marker: { size: 4 },
        }]);
      },
      error: () => console.error,
    });
  }

  ngOnChanges(): void {
    switch (this.step) {
      case 2:
        this.layout.annotations = [this.spaceRaceAnnotation];
        this.layout.shapes = [this.spaceRaceRect];
        this.layoutSubject$.next(this.layout);
        break;

      case 3:
        this.layout.annotations = [this.spaceRaceAnnotation, this.moonLandingAnnotation];
        this.layout.shapes = [this.spaceRaceRect, this.moonLandingLine];
        this.layoutSubject$.next(this.layout);
        break;

      case 4:
        this.layout.annotations = [this.moonLandingAnnotation, this.afterSpaceRaceAnnotation];
        this.layout.shapes = [this.moonLandingLine, this.afterSpaceRaceRect];
        this.layoutSubject$.next(this.layout);
        break;

      case 5:
        this.layout.annotations = [this.afterSpaceRaceAnnotation, this.spaceXFoundingAnnotation];
        this.layout.shapes = [this.afterSpaceRaceRect, this.spaceXFoundingLine];
        this.layoutSubject$.next(this.layout);
        break;

      case 6:
        this.layout.annotations = [this.afterSpaceRaceAnnotation, this.spaceXFirstLaunchAnnotation];
        this.layout.shapes = [this.afterSpaceRaceRect, this.spaceXFirstLaunchLine];
        this.layoutSubject$.next(this.layout);
        break;

      default:
        break;
    }
  }
}
