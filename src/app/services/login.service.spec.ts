import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing'; // Optional, for mocking requests

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),          // ✅ Required to resolve HttpClient
        provideHttpClientTesting()    // ✅ Optional, if you plan to test HTTP calls
      ]
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
