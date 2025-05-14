import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginForm: FormGroup;
constructor(private fb: FormBuilder, public us: LoginService, private router: Router) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(6), Validators.max(15)]]
  });
}

loginhandler() {
  if(this.us.validate(this.loginForm.value.email,this.loginForm.value.password))
    {
      localStorage.setItem('status','loggedIn')
      localStorage.setItem('email',this.loginForm.value.email)
      this.router.navigate(['dashboard'])
      alert('logged In')
    }
    else{
      localStorage.setItem('status',' notlogged')
      alert('Please check the email or password')
    }
}

cancle() {
  this.loginForm.reset();
}

}
