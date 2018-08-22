import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportAddressComponent} from './export-address.component';

describe('ExportAddressComponent', () => {
  let component: ExportAddressComponent;
  let fixture: ComponentFixture<ExportAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
