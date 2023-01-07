import { ChangeDetectionStrategy, Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'launch-graph',
  templateUrl: './launch-graph.component.html',
  styleUrls: ['./launch-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchGraphComponent implements OnInit, OnChanges {
  @Input() step = 0;

  primaryColor = '#cfc9a6';
  secondaryColor = '#b8a6cf';
  highlightColor = '#e24444';
  plotColors = [this.primaryColor];
  successColor = '#9ce68a';

  spaceRaceStartEpoch = new Date(1957, 8, 21).getTime();
  moonLandingEpoch = -14259600000;



  spaceRaceRect = {
    type: 'rect',
    xref: 'x',
    x0: this.spaceRaceStartEpoch,
    x1: this.moonLandingEpoch,
    yref: 'paper',
    y0: -0.3,
    y1: 1,
    line_width: 0,
    fillcolor: this.secondaryColor,
    opacity: 0.1,
  };
  spaceRaceAnnotation = {
    text: 'Space Race<br>1957 - 1969',
    font: { color: this.secondaryColor, size: 17 },
    x: (this.spaceRaceStartEpoch + this.moonLandingEpoch) / 2,
    yref: 'paper',
    y: -0.25,
    showarrow: false,
  };
  
  moonLandingAnnotation = {
    text: 'First moon landing',
    font: { color: this.highlightColor, size: 20 },
    x: this.moonLandingEpoch,
    yref: 'paper',
    y: 1.16,
    showarrow: false,
  }
  moonLandingLine = {
    type: 'line',
    xref: 'x',
    x0: this.moonLandingEpoch,
    x1: this.moonLandingEpoch,
    yref: 'paper',
    y0: 0,
    y1: 1.08,
    line: {
      color: this.highlightColor,
      dash: 'dash',
      width: 4,
    }
  };

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
      gridcolor: this.secondaryColor,
    },
    yaxis: {
      range: [0, 30],
      gridcolor: this.secondaryColor,
    },
    annotations: [{}],
    shapes: [{}],
  };

  dataSubject$: Subject<any> = new BehaviorSubject<any>(this.data);
  layoutSubject$: Subject<any> = new BehaviorSubject<any>(this.layout);





  constructor(
    private http: HttpClient,
  ) {
    console.log('splicing')
    this.layout.shapes.splice(0);
  }

  ngOnInit(): void {
    this.http.get<any>('./assets/launchesPerMonth.json').subscribe({
      next: (data) => {
        this.dataSubject$.next([{
          x: Object.values(data['year_month']).map((v) => new Date(v as string)),
          y: Object.values(data['new']),
          type: 'scatter',
        }]);
      },
      error: () => console.error,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    switch (this.step) {
      case 2:
        this.layout.annotations = [this.spaceRaceAnnotation, this.moonLandingAnnotation];
        this.layout.shapes = [this.spaceRaceRect, this.moonLandingLine];
        this.layoutSubject$.next(this.layout);
        break;
      case 3:
        this.layout.annotations = [this.spaceRaceAnnotation, this.moonLandingAnnotation];
        this.layout.shapes = [this.spaceRaceRect, this.moonLandingLine];
        this.layoutSubject$.next(this.layout);
        break;

      default:
        break;
    }
  }

  public showSpaceRaceRect() {
    this.layout.shapes.filter(o => o === this.spaceRaceRect);
    const exists = this.layout.shapes.find(o => o === this.spaceRaceRect);
    if (!exists) {
      console.log('dun exists')
      this.layout.shapes.push(this.spaceRaceRect);
    }
  }
}
