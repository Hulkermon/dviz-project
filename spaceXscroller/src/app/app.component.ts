import { Component, OnInit } from '@angular/core';
import * as scrollama from 'scrollama';
import { select, selectAll } from 'd3';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  scroller = scrollama();
  currentStep = 0;

  ngOnInit(): void {

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    this._handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    this.scroller
      .setup({
        step: '#scrolly article .step',
        progress: true,
      })
      .onStepEnter((res) => { this._handleStepEnter(res) })
      .onStepExit((res) => { this._handleStepExit(res) })
      .onStepProgress((res) => { this._handleStepProgress(res) });
  }

  // generic window resize listener event
  private _handleResize() {
    // 1. update height of step elements
    // const stepH = Math.floor(window.innerHeight * 0.75);
    // selectAll('.step').style('height', stepH + 'px');

    const figureHeight = window.innerHeight / 2;
    const figureMarginTop = (window.innerHeight - figureHeight) / 2;

    select('figure')
      .style('height', figureHeight + 'px')
      .style('top', figureMarginTop + 'px');

    // 3. tell scrollama to update new element dimensions
    this.scroller.resize();
  }

  private _updateSticky(res: scrollama.CallbackResponse) {
    if (res.element.dataset['template']) {
      const templateId = res.element.dataset['template'].toString();
      const templateElement = select(`.sticky-templates #${templateId}`);
      select('figure').html(templateElement.html());
    }
  }

  private _handleStepEnter(res: scrollama.CallbackResponse) {

    this._updateSticky(res);
  }

  private _handleStepExit(res: scrollama.CallbackResponse) {
    if (res.direction === 'down') {
      this.currentStep = res.index + 1;
    } else {
      this.currentStep = res.index - 1
    }
  }

  private _handleStepProgress(res: scrollama.ProgressCallbackResponse) {
    const fadeElements = selectAll('.fade');
    let threshold;
    let elementHeight;

    switch (res.index) {
      case 1:
        fadeElements.style('transform', `translateY(${-res.progress * 20}vh)`)
        if (res.progress < 0.25) {
          fadeElements.style('opacity', res.progress * 4);
        } else if (res.progress > 0.75) {
          fadeElements.style('opacity', 4 - res.progress * 4);
        } else {
          fadeElements.style('opacity', 1);
        }
        break;

      case 2:
        if (res.progress < 0.25) {
          fadeElements.style('opacity', res.progress * 4);
        } else {
          fadeElements.style('opacity', 1);
        }
        break;

      case 3:
      case 4:
      case 5:
        fadeElements.style('opacity', 1);
        break;

      case 6:
        threshold = 0.4;
        elementHeight = 70;
        if (res.progress > threshold) {
          select('.launch-plot-container').style('transform', `translateY(-${(res.progress * elementHeight) - (elementHeight * threshold)}vh)`)
        } else {
          select('.launch-plot-container').style('transform', `none`)
        }

        fadeElements.style('opacity', 2 - res.progress * 2);
        select('#chapter-1-4').style('opacity', 2 - res.progress * 2);
        break;

      case 8:
      case 13:
        if (res.progress < 0.25) {
          fadeElements.style('opacity', res.progress * 4);
        } else {
          fadeElements.style('opacity', 1);
        }
        break;

      case 10:
      case 14:
        threshold = 0.4;
        elementHeight = 70;
        if (res.progress > threshold) {
          select('.agency-plot-container').style('transform', `translateY(-${(res.progress * elementHeight) - (elementHeight * threshold)}vh)`)
        } else {
          select('.agency-plot-container').style('transform', `none`)
        }

        fadeElements.style('opacity', 2 - res.progress * 2);
        select('#chapter-2-2').style('opacity', 2 - res.progress * 2);
        break;

      // First Booster Landing Title
      case 12:
        fadeElements.style('transform', `translateY(${5 - (res.progress) * 30}vh)`)
        if (res.progress < 0.25) {
          fadeElements.style('opacity', res.progress * 2);
        } else {
          fadeElements.style('opacity', 4 - res.progress * 4);
        }
        break;

      default:
        break;
    }
  }
}
