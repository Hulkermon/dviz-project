import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyGraphComponent } from './agency-graph.component';

describe('AgencyGraphComponent', () => {
  let component: AgencyGraphComponent;
  let fixture: ComponentFixture<AgencyGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
