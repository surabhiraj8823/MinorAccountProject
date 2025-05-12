import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from './customer';
import { AddressProof } from './addressproof';
import { Address } from './address';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private customerUrl = 'http://localhost:3000/customerdetails';  
  private addressUrl = 'http://localhost:3000/address';           
  private addressProofUrl = 'http://localhost:3000/addressproof'; 

  constructor(private http: HttpClient) {}  

  // Add Customer Details
  addCustomerDetails(customer: Customer): Observable<any> {
    return this.http.post(this.customerUrl, customer);
  }

  // Add Address
  addAddress(address: Address): Observable<any> {
    return this.http.post(this.addressUrl, address);
  }

  // Add Address Proof
  addAddressProof(addressProof: AddressProof): Observable<any> {
    return this.http.post(this.addressProofUrl, addressProof);
  }
}