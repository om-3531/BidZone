import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WinnerSelection } from './winner-selection';

describe('WinnerSelection', () => {
  let component: WinnerSelection;
  let fixture: ComponentFixture<WinnerSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinnerSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(WinnerSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
