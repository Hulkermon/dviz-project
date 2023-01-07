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

  private _updateSticky(res: scrollama.CallbackResponse) {
    if (res.element.dataset['template']) {
      const templateId = res.element.dataset['template'].toString();
      const templateElement = select(`.sticky-templates #${templateId}`);
      select('figure').html(templateElement.html());
    }
  }

  ngOnInit(): void {

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    this.handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    this.scroller
      .setup({
        step: '#scrolly article .step',
        progress: true,
      })
      .onStepEnter((res) => { this.handleStepEnter(res) })
      .onStepExit((res) => { this.handleStepExit(res) })
      .onStepProgress((res) => { this.handleStepProgress(res) });
  }

  // generic window resize listener event
  handleResize() {
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

  handleStepEnter(res: scrollama.CallbackResponse) {
    // add color to current step only
    selectAll('.step').classed('is-active', (d: any, i: number) => {
      return i === res.index;
    });

    this._updateSticky(res);
  }

  handleStepExit(res: scrollama.CallbackResponse) {

  }

  handleStepProgress(res: scrollama.ProgressCallbackResponse) {
    switch (res.index) {
      // Title
      case 1:
        const elements = selectAll('.fade-in-out');
        elements.style('transform', `translateY(-${res.progress * 20}vh)`)
        if (res.progress < 0.25) {
          elements.style('opacity', res.progress * 4);
        } else if (res.progress > 0.75) {
          elements.style('opacity', 4 - res.progress * 4);
        } else {
          elements.style('opacity', 1);
        }
        break;
    
      default:
        break;
    }
  }
}
