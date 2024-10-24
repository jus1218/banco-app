import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonePageComponent } from './phone-page.component';

describe('PhonePageComponent', () => {
  let component: PhonePageComponent;
  let fixture: ComponentFixture<PhonePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhonePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhonePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
