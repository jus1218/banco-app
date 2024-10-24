import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagerAccoutPageComponent } from './leager-accout-page.component';

describe('LeagerAccoutPageComponent', () => {
  let component: LeagerAccoutPageComponent;
  let fixture: ComponentFixture<LeagerAccoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeagerAccoutPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeagerAccoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
