import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  ls = localStorage;
 constructor(private router:Router){}

 registerHandler(){
    this.router.navigate(['register']);
 }

 logoutHandler(){
  localStorage.clear();
  this.router.navigate(['login']);
 }

}
