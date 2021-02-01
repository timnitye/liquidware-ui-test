import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionCriteriaBarComponent } from './selection-criteria-bar.component';

describe('SelectionCriteriaBarComponent', () => {
  let component: SelectionCriteriaBarComponent;
  let fixture: ComponentFixture<SelectionCriteriaBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionCriteriaBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionCriteriaBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
