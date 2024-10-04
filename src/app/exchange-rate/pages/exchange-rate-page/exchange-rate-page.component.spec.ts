import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRatePageComponent } from './exchange-rate-page.component';

describe('ExchangeRatePageComponent', () => {
  let component: ExchangeRatePageComponent;
  let fixture: ComponentFixture<ExchangeRatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExchangeRatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeRatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
