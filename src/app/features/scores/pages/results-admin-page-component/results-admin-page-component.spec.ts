import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsAdminPageComponent } from './results-admin-page-component';

describe('ResultsAdminPageComponent', () => {
  let component: ResultsAdminPageComponent;
  let fixture: ComponentFixture<ResultsAdminPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsAdminPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsAdminPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
