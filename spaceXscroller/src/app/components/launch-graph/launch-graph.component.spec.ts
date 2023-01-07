import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchGraphComponent } from './launch-graph.component';

describe('LaunchGraphComponent', () => {
  let component: LaunchGraphComponent;
  let fixture: ComponentFixture<LaunchGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
