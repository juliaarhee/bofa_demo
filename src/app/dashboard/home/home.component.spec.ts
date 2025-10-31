import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the home heading', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3')).toBeTruthy();
  });

  it('should display HOME text', () => {
    const compiled = fixture.nativeElement;
    const heading = compiled.querySelector('h3');
    expect(heading.textContent).toBe('HOME');
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should initialize component on ngOnInit', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
});
