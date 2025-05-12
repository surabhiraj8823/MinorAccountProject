import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, RecaptchaModule], // ✅ Required Modules
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // ✅ Enables Web Component Support
})
export class LoginComponent {
  loginForm: FormGroup;
  captchaToken: string = '';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      captcha: ['', Validators.required]  // ✅ Captcha response field
    });
  }
  

  /** ✅ Email Validation */
  validateEmail() {
    const emailControl = this.loginForm.controls['email'];
    if (emailControl.valid) {
      alert('✅ Valid Email!');
    } else {
      alert('❌ Invalid Email Format!');
    }
  }

  /** ✅ Captcha Resolver */
  resolved(token: string | null) {
    this.captchaToken = token ?? ''; // ✅ If null, assign an empty string
  }
  /** ✅ Login Handler */
  onLogin() {
    if (this.loginForm.valid && this.captchaToken) {
      alert('🚀 Login Successful!');
    } else {
      alert('⚠️ Please fill all fields and verify CAPTCHA.');
    }
  }

  /** ✅ Reset Confirmation */
  confirmReset() {
    if (confirm('🛑 Are you sure you want to reset the form?')) {
      this.loginForm.reset();
    }
  }
}