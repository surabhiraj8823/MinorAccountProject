import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerComponent } from './customer.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerComponent],
      providers: [
        provideRouter([]),           // ✅ modern router provider for testing
        provideHttpClient()          // ✅ modern HttpClient provider for testing
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
