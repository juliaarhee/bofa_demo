import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the footer content', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content__footer')).toBeTruthy();
  });

  it('should display copyright text', () => {
    const compiled = fixture.nativeElement;
    const footerText = compiled.querySelector('#license-footer').textContent;
    expect(footerText).toContain('NgxAdmin ©2018');
  });

  it('should display MIT License link', () => {
    const compiled = fixture.nativeElement;
    const footerText = compiled.querySelector('#license-footer').textContent;
    expect(footerText).toContain('MIT License');
  });

  it('should have a link to license page', () => {
    const compiled = fixture.nativeElement;
    const link = compiled.querySelector('#license-footer a');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('./license');
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
