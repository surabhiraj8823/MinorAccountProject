import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { Addressproof } from '../models/addressproof';


@Injectable({
  providedIn: 'root'
})


export class LoginService {
  public customerUrl = 'http://localhost:3000/userdetails';  
  public addressUrl = 'http://localhost:3000/address';           
  public addressProofUrl = 'http://localhost:3000/addressproof';
  public countriesUrl = 'http://localhost:3000/countries';
  result?:User;
  constructor(public client:HttpClient) {}
  validate(email:String,password:string){
    this.client.get<Array<User>>('http://localhost:3000/userdetails')
    .subscribe(data=>{
      this.result=data.filter((u=>u.email==email && u.password==password))[0];
      console.log('result'+JSON.stringify(this.result));
    });
    if(this.result!==null && this.result!==undefined)
      return true;
    else
    return false;
  }
    
  addUserdetails(customer: User): Observable<any> {
    return this.client.post(this.customerUrl, customer);
  }

  addAddress(address: Address): Observable<any> {
    return this.client.post(this.addressUrl, address);
  }

  addAddressproof(addressProof: Addressproof): Observable<any> {
    return this.client.post(this.addressProofUrl, addressProof);
  }  
  
  getCountries(): Observable<any> {
    return this.client.get(this.countriesUrl);
  }

  getUserDetails(): Observable<User[]> {
    return this.client.get<User[]>(this.customerUrl); 
  }

  getAddressproof(): Observable<Addressproof[]> {
    return this.client.get<Addressproof[]>(this.addressProofUrl);
  }
}