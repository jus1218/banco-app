import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProvinciesComponent } from './table-provincies.component';

describe('TableProvinciesComponent', () => {
  let component: TableProvinciesComponent;
  let fixture: ComponentFixture<TableProvinciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableProvinciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableProvinciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
