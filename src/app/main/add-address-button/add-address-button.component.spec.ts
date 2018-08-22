import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressButtonComponent } from './add-address-button.component';

describe('AddAddressButtonComponent', () => {
  let component: AddAddressButtonComponent;
  let fixture: ComponentFixture<AddAddressButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAddressButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
