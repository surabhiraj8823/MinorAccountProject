import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component'; // Ensure this path is correct
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/register', pathMatch: 'full' }, // Optional: Redirect to 'register' by default
  { path: 'login', component:LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Optional: Redirect to 'login' by default
];