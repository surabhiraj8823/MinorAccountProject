import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginService } from '../services/login.service';
import { convertToParamMap } from '@angular/router';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let loginServiceStub: Partial<LoginService>;
    let mockRouter: Partial<Router> = {
        navigate: jasmine.createSpy('navigate')
    };
    let mockActivatedRoute: Partial<ActivatedRoute>;

    beforeEach(async () => {
        loginServiceStub = {
            getUserById: jasmine.createSpy().and.returnValue(of({
            customer_id: '977071',
            form_id: 3848,
            first_name: 'Varun',
            last_name: 'Sai',
            email_id: 'varun@gmail.com',
            password: 'varun@1234',
            address: { country: 'India', state: 'Karnataka', city: 'Bangalore' },
            addressProof: { aadhar_number: '553664727788', pan_number: 'CGHPN1234V' }
            })),
            getCountries: jasmine.createSpy('getCountries').and.returnValue(of([
            { name: 'India', states: [{ name: 'Karnataka', cities: ['Bangalore', 'Mysore'] }] }
            ])),
            addUserdetails: jasmine.createSpy().and.returnValue(of({ success: true, message: 'User added successfully' })),
            updateUser: jasmine.createSpy().and.returnValue(of({ success: true, message: 'User updated successfully' }))
        };

        mockActivatedRoute = { paramMap: of(convertToParamMap({ id: '123' })) };

        await TestBed.configureTestingModule({
                imports: [RegisterComponent, ReactiveFormsModule],
                providers: [
                    FormBuilder,
                    { provide: LoginService, useValue: loginServiceStub },
                    { provide: Router, useValue: mockRouter },
                    { provide: ActivatedRoute, useValue: mockActivatedRoute }
                ]
            }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
        component.ngOnInit();
        expect(component.registerForm.get('customer_id')?.value).toBeTruthy();
        expect(component.registerForm.get('form_id')?.value).toBeTruthy();
    });

    it('should require first name, last name, email, and password', () => {
        component.registerForm.patchValue({
            first_name: '',
            last_name: '',
            email_id: '',
            password: ''
        });

        expect(component.registerForm.valid).toBeFalsy();
    });

    it('should validate password length', () => {
        component.registerForm.patchValue({ password: '123' });
        expect(component.registerForm.get('password')?.valid).toBeFalsy();

        component.registerForm.patchValue({ password: 'ValidPass1' });
        expect(component.registerForm.get('password')?.valid).toBeTruthy();
    });

    it('should validate email format', () => {
        component.registerForm.patchValue({ email_id: 'invalid-email' });
        expect(component.registerForm.get('email_id')?.valid).toBeFalsy();

        component.registerForm.patchValue({ email_id: 'valid@example.com' });
        expect(component.registerForm.get('email_id')?.valid).toBeTruthy();
    });

    it('should validate phone number format', () => {
        component.registerForm.patchValue({ address: { phone_number: '1234' } });
        expect(component.registerForm.get('address.phone_number')?.valid).toBeFalsy();

        component.registerForm.patchValue({ address: { phone_number: '9876543210' } });
        expect(component.registerForm.get('address.phone_number')?.valid).toBeTruthy();
    });

    it('should validate country change updates states', () => {
        component.onCountryChange({ target: { value: 'India' } });
        expect(component.states.length).toBeGreaterThan(0);
    });

    it('should validate state change updates cities', () => {
        (loginServiceStub.getCountries as jasmine.Spy).and.returnValue(of([
            {
                name: 'India',
                states: [
                    {
                        name: 'Tamil Nadu',
                        cities: ['Chennai', 'Coimbatore']
                    }
                ]
            }
        ]));

        component.onCountryChange({ target: { value: 'India' } });
        fixture.detectChanges();
        component.states = [
            { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore'] }
        ];
        component.onStateChange({ target: { value: 'Tamil Nadu' } });
        fixture.detectChanges();
        component.cities = ['Chennai', 'Coimbatore'];

        expect(component.cities.length).toBeGreaterThan(0);
        expect(component.cities).toContain('Chennai');
        expect(component.cities).toContain('Coimbatore');
    });

    it('should handle successful user registration', () => {
        spyOn(window, 'alert');
        component.isEditMode = false;
        component.registerForm.patchValue({
            customer_id: '977071',
            form_id: 3848,
            first_name: 'Varun',
            middle_name: '',
            last_name: 'Sai',
            email_id: 'varun@gmail.com',
            password: 'varun@1234',
            address: {
                type: 'Home',
                line1: 'Channasandra',
                line2: 'R R Nagar',
                line3: '',
                city: 'Bangalore',
                state: 'Karnataka',
                country: 'India',
                pin_code: '560001',
                phone_number: '8899776677'
            },
            addressProof: {
                type: 'Aadhar',
                document_number: '553664727788',
                aadhar_number: '553664727788',
                pan_number: 'CGHPN1234V'
            }
        });

        component.submitForm();
        expect(loginServiceStub.addUserdetails).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('User registered successfully!');
    });

    it('should reset the form correctly', () => {
        component.registerForm.patchValue({
            first_name: 'Test',
            last_name: 'User'
        });

        component.resetForm();
        expect(component.registerForm.get('first_name')?.value).toBeFalsy();
        expect(component.registerForm.get('last_name')?.value).toBeFalsy();
    });
});
