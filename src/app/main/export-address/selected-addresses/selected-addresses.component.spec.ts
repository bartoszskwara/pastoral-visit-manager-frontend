import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedAddressesComponent } from './selected-addresses.component';

describe('SelectedAddressesComponent', () => {
  let component: SelectedAddressesComponent;
  let fixture: ComponentFixture<SelectedAddressesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedAddressesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
