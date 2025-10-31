import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../core/services/auth.service';
import { FakeAuthenticationService } from 'src/test/fakes.spec';
import { DashboardComponent } from './dashboard.component';
import { SidenavComponent } from './layouts/sidenav/sidenav.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatMenuModule,
      ],
      declarations: [DashboardComponent],
      providers: [
        { provide: AuthService, useClass: FakeAuthenticationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a static path method that returns dashboard route', () => {
    const path = DashboardComponent.path();
    expect(path).toEqual(['dashboard']);
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should have appSidenavComponent ViewChild reference', () => {
    expect(component.appSidenavComponent).toBeDefined();
  });

  it('should call toggle on appSidenavComponent when onSidenavToggle is called', () => {
    component.appSidenavComponent = {
      toggle: jasmine.createSpy('toggle')
    } as any;
    
    component.onSidenavToggle();
    
    expect(component.appSidenavComponent.toggle).toHaveBeenCalled();
  });

  it('should render the dashboard wrapper', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.dashboard')).toBeTruthy();
  });

  it('should render the content wrapper', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.wrapper')).toBeTruthy();
  });

  it('should render the content body', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content__body')).toBeTruthy();
  });

  it('should have router-outlet for dynamic content', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
