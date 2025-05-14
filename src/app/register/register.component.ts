import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { LoginService } from '../services/login.service';
import { Address } from '../models/address';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  countries: { name: string; states: { name: string; cities: string[] }[] }[] = [];
  states: { name: string; cities: string[] }[] = [];
  cities: string[] = [];

  showPassword: boolean = false;
  registerForm: FormGroup;
  public customerId: string;
  public formId: number;

  constructor(public fb: FormBuilder, public loginService: LoginService) {
    this.customerId = this.generateCustomerId();
    this.formId = this.generateFormId();

    this.registerForm = this.fb.group({
      form_id: [this.formId],
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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

  generateCustomerId(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateFormId(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  loadCountries() {
    this.loginService.getCountries().subscribe((data: any) => {
      this.countries = data;
    });
  }

  onCountryChange(event: any) {
    const selectedCountry = event.target.value;
    const country = this.countries.find(c => c.name === selectedCountry);
    this.states = country ? country.states : [];
    this.cities = []; // Reset cities when country changes
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
      const customerId = this.customerId;
      const formId = this.formId;

      const customerData = {
        form_id: formId.toString(),
        customer_id: customerId,
        ...this.registerForm.value
      };

      forkJoin({
        customer: this.loginService.addUserdetails(customerData),
        address: this.loginService.addAddress(customerData.address),
        addressProof: this.loginService.addAddressproof(customerData.addressProof)
      }).subscribe(response => {
        console.log("Data saved successfully:", response);
        alert("User registered successfully!");
        this.resetForm();
      });
    }
  }

  resetForm(): void {
    this.registerForm.reset();
  }
}