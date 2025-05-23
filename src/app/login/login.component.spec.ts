import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should have email field invalid without @', () => {
    component.loginForm.controls['email'].setValue('invalidemail.com');
    expect(component.loginForm.controls['email'].valid).toBeFalse();
  });

  it('should have valid email when format is correct', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    expect(component.loginForm.controls['email'].valid).toBeTrue();
  });

  it('should invalidate password shorter than 10 characters', () => {
    component.loginForm.controls['password'].setValue('short');
    expect(component.loginForm.controls['password'].valid).toBeFalse();
  });

  it('should validate password of at least 10 characters', () => {
    component.loginForm.controls['password'].setValue('longenough10');
    expect(component.loginForm.controls['password'].valid).toBeTrue();
  });

  it('should disable submit button if form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button.submit')).nativeElement;
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable submit button when form is valid', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'longenough10'
    });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button.submit')).nativeElement;
    expect(submitButton.disabled).toBeFalse();
  });

  it('should call loginhandler on Sign In button click', () => {
    spyOn(component, 'loginhandler');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'longenough10'
    });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button.submit'));
    submitButton.triggerEventHandler('click', null);

    expect(component.loginhandler).toHaveBeenCalled();
  });

  it('should call cancle on Cancel button click', () => {
    spyOn(component, 'cancle');

    const cancelButton = fixture.debugElement.query(By.css('button.cancle'));
    cancelButton.triggerEventHandler('click', null);

    expect(component.cancle).toHaveBeenCalled();
  });

  it('should reset the form when cancle() is called', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'longenough10'
    });

    component.cancle();
    expect(component.loginForm.value).toEqual({
      email: null,
      password: null
    });
  });
});
