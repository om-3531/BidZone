import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionHistory } from './auction-history';

describe('AuctionHistory', () => {
  let component: AuctionHistory;
  let fixture: ComponentFixture<AuctionHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
