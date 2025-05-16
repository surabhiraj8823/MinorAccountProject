import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, public us: LoginService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    });
  }

  loginhandler() {
    if (this.us.validate(this.loginForm.value.email, this.loginForm.value.password)) {
      localStorage.setItem('status', 'loggedIn');
      localStorage.setItem('email_id', this.loginForm.value.email_id);
      this.router.navigate(['dashboard']);
      alert('Logged In');
    } else {
      localStorage.setItem('status', 'notlogged');
      alert('Please check the email or password');
    }
  }

  cancle(){
    this.loginForm.reset();
  }
}