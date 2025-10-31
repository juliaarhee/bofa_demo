import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FakeAuthenticationService } from 'src/test/fakes.spec';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: AuthService, useClass: FakeAuthenticationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with email, password, and passwordConfirmation controls', () => {
    expect(component.form.contains('email')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
    expect(component.form.contains('passwordConfirmation')).toBeTruthy();
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

  it('should validate password contains at least one digit', () => {
    const control = component.form.get('password');
    control?.setValue('NoDigit!A');
    expect(control?.hasError('at-least-one-digit')).toBeTruthy();
    control?.setValue('HasDigit1!A');
    expect(control?.hasError('at-least-one-digit')).toBeFalsy();
  });

  it('should validate password contains at least one lowercase letter', () => {
    const control = component.form.get('password');
    control?.setValue('NOLOWER1!');
    expect(control?.hasError('at-least-one-lowercase')).toBeTruthy();
    control?.setValue('HasLower1!A');
    expect(control?.hasError('at-least-one-lowercase')).toBeFalsy();
  });

  it('should validate password contains at least one uppercase letter', () => {
    const control = component.form.get('password');
    control?.setValue('noupper1!');
    expect(control?.hasError('at-least-one-uppercase')).toBeTruthy();
    control?.setValue('HasUpper1!a');
    expect(control?.hasError('at-least-one-uppercase')).toBeFalsy();
  });

  it('should validate password contains at least one special character', () => {
    const control = component.form.get('password');
    control?.setValue('NoSpecial1A');
    expect(control?.hasError('at-least-one-special-character')).toBeTruthy();
    control?.setValue('HasSpecial1!A');
    expect(control?.hasError('at-least-one-special-character')).toBeFalsy();
  });

  it('should validate password is at least 8 characters long', () => {
    const control = component.form.get('password');
    control?.setValue('Short1!');
    expect(control?.hasError('at-least-eight-characters')).toBeTruthy();
    control?.setValue('LongEnough1!A');
    expect(control?.hasError('at-least-eight-characters')).toBeFalsy();
  });

  it('should make the passwordConfirmation control required', () => {
    const control = component.form.get('passwordConfirmation');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should validate that password and passwordConfirmation match', () => {
    const passwordControl = component.form.get('password');
    const confirmControl = component.form.get('passwordConfirmation');
    
    passwordControl?.setValue('Password1!');
    confirmControl?.setValue('Password1!');
    expect(component.form.hasError('notSame')).toBeFalsy();
    
    confirmControl?.setValue('DifferentPassword1!');
    expect(component.form.hasError('notSame')).toBeTruthy();
  });

  it('should call the server to register the user when registerUser is called', () => {
    const spy = spyOn(authService, 'register').and.returnValue(EMPTY);
    
    component.form.setValue({
      email: 'test@example.com',
      password: 'Password1!',
      passwordConfirmation: 'Password1!'
    });

    component.registerUser();

    expect(spy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password1!',
      passwordConfirmation: 'Password1!'
    });
  });

  it('should display a success message if server returns success', () => {
    spyOn(authService, 'register').and.returnValue(EMPTY);
    spyOn(component.snackBar, 'open');

    component.form.setValue({
      email: 'test@example.com',
      password: 'Password1!',
      passwordConfirmation: 'Password1!'
    });

    component.registerUser();

    expect(component.snackBar.open).toHaveBeenCalledWith(
      'User Registered! Now, you can login',
      '',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      }
    );
  });

  it('should display an error message if server returns an error when registering', () => {
    const errorMessage = 'Registration failed';
    spyOn(authService, 'register').and.returnValue(
      throwError({ message: errorMessage })
    );
    spyOn(component.snackBar, 'open');

    component.form.setValue({
      email: 'test@example.com',
      password: 'Password1!',
      passwordConfirmation: 'Password1!'
    });

    component.registerUser();

    expect(component.snackBar.open).toHaveBeenCalledWith(
      errorMessage,
      '',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      }
    );
  });
});
