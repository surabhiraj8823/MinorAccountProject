import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  countries: { name: string; states: { name: string; cities: string[] }[] }[] = [];
  states: { name: string; cities: string[] }[] = [];
  cities: string[] = [];

  showPassword = false;
  registerForm: FormGroup;

  public customerId: string;
  public formId: number;

  public isEditMode = false;
  private editUserId: string | null = null; // <== Use string IDs

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.customerId = this.generateCustomerId();
    this.formId = this.generateFormId();

    this.registerForm = this.fb.group({
      customer_id: [this.customerId], // Add customer_id to form
      form_id: [this.formId],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      address: this.fb.group({
        type: ['', Validators.required],
        line1: ['', Validators.required],
        line2: ['', Validators.required],
        line3: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pin_code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        phone_number: ['', [Validators.required, Validators.pattern('\\d{10}')]]
      }),
      addressProof: this.fb.group({
        type: [''],
        document_number: [''],
        aadhar_number: ['', [Validators.pattern('\\d{12}')]],
        pan_number: ['', [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]]
      })
    });

    this.loadCountries();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditMode = true;
        this.editUserId = idParam; // use string
        this.loadUserData(this.editUserId);
      } else {
        this.isEditMode = false;
        this.editUserId = null;
      }
    });
  }

  loadUserData(id: string): void {
    this.loginService.getUserById(id).subscribe(
      user => {
        this.registerForm.patchValue({
          customer_id: user.customer_id,
          form_id: user.form_id,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          email_id: user.email_id,
          password: user.password,
          address: user.address || {},
          addressProof: user.addressProof || {}
        });

        this.onCountryChange({ target: { value: user.address?.country } });
        this.onStateChange({ target: { value: user.address?.state } });
      },
      () => {
        alert('Failed to load customer data');
        this.router.navigate(['/customer']);
      }
    );
  }

  generateCustomerId(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateFormId(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  loadCountries() {
    this.loginService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  onCountryChange(event: any) {
    const selectedCountry = event.target.value;
    const country = this.countries.find(c => c.name === selectedCountry);
    this.states = country ? country.states : [];
    this.cities = [];
    this.registerForm.get('address.state')?.reset();
    this.registerForm.get('address.city')?.reset();
  }

  onStateChange(event: any) {
    const selectedState = event.target.value;
    const state = this.states.find(s => s.name === selectedState);
    this.cities = state ? state.cities : [];
    this.registerForm.get('address.city')?.reset();
  }

  submitForm() {
    if (this.registerForm.valid) {
      const customerData = this.registerForm.value;

      if (this.isEditMode && this.editUserId) {
        this.loginService.updateUser(this.editUserId, customerData).subscribe(
          () => {
            alert('Customer updated successfully!');
            this.router.navigate(['/customer']);
          },
          () => alert('Failed to update customer, please try again.')
        );
      } else {
        this.loginService.addUserdetails(customerData).subscribe(() => {
          alert('User registered successfully!');
          this.resetForm();
        }, () => alert('Failed to register user'));
      }
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  resetForm(): void {
    this.registerForm.reset();
  }
}
