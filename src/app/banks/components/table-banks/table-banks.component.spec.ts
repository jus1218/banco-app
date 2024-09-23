import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBanksComponent } from './table-banks.component';

describe('TableBanksComponent', () => {
  let component: TableBanksComponent;
  let fixture: ComponentFixture<TableBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableBanksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
