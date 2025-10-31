import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { FakeAuthenticationService } from '../../../test/fakes.spec';
import { LoginComponent } from './login.component';

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

  it('should make the email control required', () => {
    const control = component.form.get('email');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const control = component.form.get('email');
    control?.setValue('invalid-email');
    expect(control?.valid).toBeFalsy();
    control?.setValue('valid@email.com');
    expect(control?.valid).toBeTruthy();
  });

  it('should make the password control required', () => {
    const control = component.form.get('password');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should call the server to login when loginUser is called', () => {
    const spy = spyOn(authService, 'loginWithUserCredentials').and.returnValue(EMPTY);
    
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.loginUser();

    expect(spy).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should set loginLoading to true when login starts', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(EMPTY);
    
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(component.loginLoading).toBeFalsy();
    component.loginUser();
    expect(component.loginLoading).toBeTruthy();
  });

  it('should set loginLoading to false when login completes successfully', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(EMPTY);
    spyOn(router, 'navigate');
    
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.loginUser();
    expect(component.loginLoading).toBeFalsy();
  });

  it('should set loginLoading to false when login fails', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(
      throwError({ message: 'Login failed' })
    );
    
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.loginUser();
    expect(component.loginLoading).toBeFalsy();
  });

  it('should navigate to dashboard on successful login', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(EMPTY);
    const navigateSpy = spyOn(router, 'navigate');
    
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.loginUser();

    expect(navigateSpy).toHaveBeenCalledWith(['dashboard']);
  });

  it('should display an error message if server returns an error when logging in', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(
      throwError({ message: 'Invalid credentials' })
    );
    spyOn(component.snackBar, 'open');

    component.form.setValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.loginUser();

    expect(component.snackBar.open).toHaveBeenCalledWith(
      'Contraseña o usuario incorrecto',
      '',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      }
    );
  });

  it('should NOT navigate to dashboard if login fails', () => {
    spyOn(authService, 'loginWithUserCredentials').and.returnValue(
      throwError({ message: 'Invalid credentials' })
    );
    const navigateSpy = spyOn(router, 'navigate');

    component.form.setValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.loginUser();

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
