import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseFlowchartComponent } from './course-flowchart.component';

describe('CourseFlowchartComponent', () => {
  let component: CourseFlowchartComponent;
  let fixture: ComponentFixture<CourseFlowchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseFlowchartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseFlowchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
