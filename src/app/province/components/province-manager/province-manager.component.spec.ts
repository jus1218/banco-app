import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinceManagerComponent } from './province-manager.component';

describe('ProvinceManagerComponent', () => {
  let component: ProvinceManagerComponent;
  let fixture: ComponentFixture<ProvinceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvinceManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProvinceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
