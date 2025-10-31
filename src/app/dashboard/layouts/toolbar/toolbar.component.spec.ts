import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';

import { ToolbarComponent } from './toolbar.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { FakeAuthenticationService } from '../../../../test/fakes.spec';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ],
      imports: [
        RouterTestingModule,
        MatMenuModule,
      ],
      providers: [
        { provide: AuthService, useClass: FakeAuthenticationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sidenavToggle event when onToggeleSidenav is called', () => {
    spyOn(component.sidenavToggle, 'emit');
    
    component.onToggeleSidenav();
    
    expect(component.sidenavToggle.emit).toHaveBeenCalled();
  });

  it('should call authService.logout when onLogout is called', () => {
    spyOn(authService, 'logout');
    spyOn(router, 'navigate');
    
    component.onLogout();
    
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should navigate to auth/login when onLogout is called', () => {
    spyOn(authService, 'logout');
    spyOn(router, 'navigate');
    
    component.onLogout();
    
    expect(router.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should attempt to request fullscreen when onFullscreenToggle is called', () => {
    const mockElement = {
      requestFullscreen: jasmine.createSpy('requestFullscreen')
    };
    spyOn(document, 'querySelector').and.returnValue(mockElement as any);
    
    component.onFullscreenToggle();
    
    expect(mockElement.requestFullscreen).toHaveBeenCalled();
  });

  it('should handle webkit fullscreen when onFullscreenToggle is called', () => {
    const mockElement = {
      webkitRequestFullScreen: jasmine.createSpy('webkitRequestFullScreen')
    };
    spyOn(document, 'querySelector').and.returnValue(mockElement as any);
    
    component.onFullscreenToggle();
    
    expect(mockElement.webkitRequestFullScreen).toHaveBeenCalled();
  });
});
