import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyColumnNameComponent } from './empty-column-name.component';

describe('EmptyColumnNameComponent', () => {
  let component: EmptyColumnNameComponent;
  let fixture: ComponentFixture<EmptyColumnNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyColumnNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyColumnNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
