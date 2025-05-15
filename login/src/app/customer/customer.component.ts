import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    console.log('Fetching users...');
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loginService.getUsers().subscribe(
      (users: User[]) => {
        console.log('Fetched users:', users);
        this.allUsers = users;
        this.totalPages = Math.ceil(this.allUsers.length / this.pageSize);
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again later.');
      }
    );
  }

  applyFilters(): void {
    let users = this.allUsers;
    if (this.searchTerm.trim()) {
      users = users.filter(user =>
        user.first_name && user.first_name.toLowerCase().includes(this.searchTerm.trim().toLowerCase())
      );
    }

    this.filteredUsers = users.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    console.log('Filtered users assigned:', this.filteredUsers);
  }

  sortByName(): void {
    this.filteredUsers.sort((a, b) => {
      const fullNameA = `${a.first_name} ${a.middle_name || ''} ${a.last_name}`.toLowerCase();
      const fullNameB = `${b.first_name} ${b.middle_name || ''} ${b.last_name}`.toLowerCase();
      return fullNameA.localeCompare(fullNameB);
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }

  editUser(id: string): void {
    console.log('Navigating to edit user with ID:', id);
    this.router.navigate(['/register', id]);
  }
  
  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.loginService.deleteUser(id).subscribe(
        () => {
          alert('User deleted successfully');
          this.fetchUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again later.');
        }
      );
    }
  }
}  