import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EMPTY, throwError, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { FakeAuthenticationService } from '../../../test/fakes.spec';
import { LoginComponent } from './login.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: AuthService, useClass: FakeAuthenticationService },
      ],
      declarations: [LoginComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  it('should create a form with email and password controls', () => {
    expect(component.form.contains('email')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should make the password control required', () => {
    const control = component.form.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should call the auth service to login when user submits the form', () => {
    const spy = spyOn(authService, 'loginWithUserCredentials').and.returnValue(EMPTY);

    component.loginUser();

    expect(spy).toHaveBeenCalled();
  });

  it('should pass email and password to auth service when logging in', () => {
    const spy = spyOn(authService, 'loginWithUserCredentials').and.returnValue(EMPTY);
    component.form.patchValue({
      email: 'test@example.com',
      password: 'testpassword'
    });

    component.loginUser();

    expect(spy).toHaveBeenCalledWith('test@example.com', 'testpassword');
  });

  it('should set loginLoading to true when login starts', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(EMPTY);

    component.loginUser();

    expect(component.loginLoading).toBe(true);
  });

  it('should set loginLoading to false when login completes successfully', (done) => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(of({ access_token: 'token' }));
    spyOn(router, 'navigate');

    component.loginUser();

    setTimeout(() => {
      expect(component.loginLoading).toBe(false);
      done();
    }, 100);
  });

  it('should set loginLoading to false when login fails', (done) => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(throwError({ error: 'Invalid credentials' }));

    component.loginUser();

    setTimeout(() => {
      expect(component.loginLoading).toBe(false);
      done();
    }, 100);
  });

  it('should navigate to dashboard after successful login', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(of({ access_token: 'token' }));
    const spy = spyOn(router, 'navigate');

    component.loginUser();

    expect(spy).toHaveBeenCalledWith(DashboardComponent.path());
  });

  it('should display error message when login fails', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(throwError({ error: 'Invalid credentials' }));
    // @ts-ignore
    spyOn(component.snackBar, 'open');

    component.loginUser();

    // @ts-ignore
    expect(component.snackBar.open).toHaveBeenCalledWith('Contraseña o usuario incorrecto', '', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
  });

  it('should NOT navigate to dashboard when login fails', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(throwError({ error: 'Invalid credentials' }));
    const spy = spyOn(router, 'navigate');

    component.loginUser();

    expect(spy).not.toHaveBeenCalled();
  });
});
