import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonTicketComponent } from './season-ticket-component';

describe('SeasonTicketComponent', () => {
  let component: SeasonTicketComponent;
  let fixture: ComponentFixture<SeasonTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonTicketComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonTicketComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
