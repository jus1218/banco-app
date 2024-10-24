import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantonPageComponent } from './canton-page.component';

describe('CantonPageComponent', () => {
  let component: CantonPageComponent;
  let fixture: ComponentFixture<CantonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CantonPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
