import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RegisterService } from '../register.service';
import { Customer } from '../customer';
import { Address } from '../address';
import { AddressProof } from '../addressproof';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
resetForm() {
throw new Error('Method not implemented.');
}
  registerForm: FormGroup;
  private customerId: string;
  private formId: number;

  constructor(private fb: FormBuilder, private registerService: RegisterService) {
    this.customerId = this.generateCustomerId(); // Generate a unique customer ID
    this.formId = this.generateFormId(); // Generate unique Form ID

    this.registerForm = this.fb.group({
      form_id: [this.formId],  // Now dynamically generated
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
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
        aadhar_number: [''],
        pan_number: ['']
      })
    });
  }

  generateCustomerId(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateFormId(): number {
    return Math.floor(1000 + Math.random() * 9000); 
  }

  submitForm() {
    if (this.registerForm.valid) {
      const customerId = this.customerId; 
      const formId = this.formId; 

      const customerData: Customer = {
        form_id: formId.toString(),
        customer_id: customerId,
        first_name: this.registerForm.value.first_name,
        middle_name: this.registerForm.value.middle_name,
        last_name: this.registerForm.value.last_name,
        email_id: this.registerForm.value.email_id
      };

      const addressData: Address = {
        customer_id: customerId,
        ...this.registerForm.value.address
      };

      const addressProofData: AddressProof = {
        customer_id: customerId,
        ...this.registerForm.value.addressProof
      };

      console.log("Sending Customer Data:", customerData);
      console.log("Sending Address Data:", addressData);
      console.log("Sending Address Proof Data:", addressProofData);

      forkJoin({
        customer: this.registerService.addCustomerDetails(customerData),
        address: this.registerService.addAddress(addressData),
        addressProof: this.registerService.addAddressProof(addressProofData)
      }).subscribe(response => {
        console.log("Data saved successfully:", response);
      });
    }
  }
}