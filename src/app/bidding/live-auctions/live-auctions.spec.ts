import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveAuctions } from './live-auctions';

describe('LiveAuctions', () => {
  let component: LiveAuctions;
  let fixture: ComponentFixture<LiveAuctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveAuctions],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveAuctions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
