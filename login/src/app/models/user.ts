export class Address {
    type: string = '';
    line1: string = '';
    line2: string = '';
    line3: string = '';
    city: string = '';
    state: string = '';
    country: string = '';
    pin_code: string = '';
    phone_number: string = '';
  }
  
  export class AddressProof {
    type: string = '';
    document_number: string = '';
    aadhar_number: string = '';
    pan_number: string = '';
  }
  
  export class User {
    id: string = '';            
    form_id: number = 0;        
    customer_id: string = '';
    first_name: string = '';
    middle_name: string = '';
    last_name: string = '';
    email_id: string = '';
    password: string = '';
  
    address: Address = new Address();
    addressProof: AddressProof = new AddressProof();
  }
  