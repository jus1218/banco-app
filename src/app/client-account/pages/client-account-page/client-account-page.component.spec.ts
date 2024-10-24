import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAccountPageComponent } from './client-account-page.component';

describe('ClientAccountPageComponent', () => {
  let component: ClientAccountPageComponent;
  let fixture: ComponentFixture<ClientAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientAccountPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
