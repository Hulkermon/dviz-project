import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchByAgencyComponent } from './launch-by-agency.component';

describe('LaunchByAgencyComponent', () => {
  let component: LaunchByAgencyComponent;
  let fixture: ComponentFixture<LaunchByAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchByAgencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchByAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
