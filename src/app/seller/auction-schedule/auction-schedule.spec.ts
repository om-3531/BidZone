import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionSchedule } from './auction-schedule';

describe('AuctionSchedule', () => {
  let component: AuctionSchedule;
  let fixture: ComponentFixture<AuctionSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
