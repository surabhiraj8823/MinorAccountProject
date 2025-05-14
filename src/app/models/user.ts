export interface User {
    form_id: string;
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    address?: {
      phone_number?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      country?: string;
      pin_code?: string;
    };
  }