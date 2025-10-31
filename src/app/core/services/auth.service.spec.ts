import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpApi } from '../http/http-api';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should send a POST request to register endpoint with user data', () => {
      const userRequest = {
        codigo: '12345',
        email: 'test@example.com',
        password: 'password123'
      };
      const mockResponse = { success: true };

      service.register(userRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(HttpApi.userRegister);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        code: '12345',
        email: 'test@example.com',
        password: 'password123'
      });
      req.flush(mockResponse);
    });

    it('should transform codigo to code in the request body', () => {
      const userRequest = {
        codigo: 'ABC123',
        email: 'user@test.com',
        password: 'pass'
      };

      service.register(userRequest).subscribe();

      const req = httpMock.expectOne(HttpApi.userRegister);
      expect(req.request.body.code).toBe('ABC123');
      expect(req.request.body.codigo).toBeUndefined();
      req.flush({});
    });
  });

  describe('loginWithUserCredentials', () => {
    it('should send a POST request to OAuth login endpoint', () => {
      const username = 'test@example.com';
      const password = 'password123';
      const mockResponse = { access_token: 'token123', refresh_token: 'refresh123' };

      service.loginWithUserCredentials(username, password).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should set Content-Type header to application/x-www-form-urlencoded', () => {
      const username = 'test@example.com';
      const password = 'password123';

      service.loginWithUserCredentials(username, password).subscribe();

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
      req.flush({});
    });

    it('should send OAuth credentials in the request body', () => {
      const username = 'test@example.com';
      const password = 'password123';

      service.loginWithUserCredentials(username, password).subscribe();

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      const body = req.request.body;
      expect(body).toContain('grant_type=password');
      expect(body).toContain(`client_id=${environment.oauth.client_id}`);
      expect(body).toContain(`client_secret=${environment.oauth.client_secret}`);
      expect(body).toContain(`username=${encodeURIComponent(username)}`);
      expect(body).toContain(`password=${encodeURIComponent(password)}`);
      expect(body).toContain(`scope=${encodeURIComponent(environment.oauth.scope)}`);
      req.flush({});
    });

    it('should store the response in localStorage as session', () => {
      const username = 'test@example.com';
      const password = 'password123';
      const mockResponse = { access_token: 'token123', refresh_token: 'refresh123' };

      service.loginWithUserCredentials(username, password).subscribe();

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      req.flush(mockResponse);

      const storedSession = localStorage.getItem('session');
      expect(storedSession).toBeTruthy();
      expect(JSON.parse(storedSession!)).toEqual(mockResponse);
    });
  });

  describe('loginWithRefreshToken', () => {
    beforeEach(() => {
      const session = { access_token: 'old_token', refresh_token: 'refresh123' };
      localStorage.setItem('session', JSON.stringify(session));
    });

    it('should send a POST request to OAuth login endpoint with refresh token', () => {
      const mockResponse = { access_token: 'new_token', refresh_token: 'new_refresh' };

      service.loginWithRefreshToken().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should set Content-Type header to application/x-www-form-urlencoded', () => {
      service.loginWithRefreshToken().subscribe();

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
      req.flush({});
    });

    it('should send refresh token grant type in the request body', () => {
      service.loginWithRefreshToken().subscribe();

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      const body = req.request.body;
      expect(body).toContain('grant_type=refresh_token');
      expect(body).toContain(`client_id=${environment.oauth.client_id}`);
      expect(body).toContain(`client_secret=${environment.oauth.client_secret}`);
      expect(body).toContain('refresh_token=refresh123');
      expect(body).toContain(`scope=${encodeURIComponent(environment.oauth.scope)}`);
      req.flush({});
    });

    it('should update the session in localStorage with new tokens', () => {
      const mockResponse = { access_token: 'new_token', refresh_token: 'new_refresh' };

      service.loginWithRefreshToken().subscribe();

      const req = httpMock.expectOne(HttpApi.oauthLogin);
      req.flush(mockResponse);

      const storedSession = localStorage.getItem('session');
      expect(storedSession).toBeTruthy();
      expect(JSON.parse(storedSession!)).toEqual(mockResponse);
    });
  });

  describe('isLogged', () => {
    it('should return true when session exists in localStorage', () => {
      localStorage.setItem('session', JSON.stringify({ access_token: 'token' }));

      expect(service.isLogged()).toBe(true);
    });

    it('should return false when session does not exist in localStorage', () => {
      expect(service.isLogged()).toBe(false);
    });

    it('should return false after logout', () => {
      localStorage.setItem('session', JSON.stringify({ access_token: 'token' }));
      service.logout();

      expect(service.isLogged()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear localStorage', () => {
      localStorage.setItem('session', JSON.stringify({ access_token: 'token' }));
      localStorage.setItem('other_data', 'some_value');

      service.logout();

      expect(localStorage.getItem('session')).toBeNull();
      expect(localStorage.getItem('other_data')).toBeNull();
      expect(localStorage.length).toBe(0);
    });
  });

  describe('accessToken getter', () => {
    it('should return access token from localStorage session', () => {
      const session = { access_token: 'my_access_token', refresh_token: 'my_refresh' };
      localStorage.setItem('session', JSON.stringify(session));

      expect(service.accessToken).toBe('my_access_token');
    });

    it('should return null when session does not exist', () => {
      expect(service.accessToken).toBeNull();
    });

    it('should return null after logout', () => {
      localStorage.setItem('session', JSON.stringify({ access_token: 'token' }));
      service.logout();

      expect(service.accessToken).toBeNull();
    });
  });

  describe('refreshToken getter', () => {
    it('should return refresh token from localStorage session', () => {
      const session = { access_token: 'my_access', refresh_token: 'my_refresh_token' };
      localStorage.setItem('session', JSON.stringify(session));

      expect(service.refreshToken).toBe('my_refresh_token');
    });

    it('should return null when session does not exist', () => {
      expect(service.refreshToken).toBeNull();
    });

    it('should return null after logout', () => {
      localStorage.setItem('session', JSON.stringify({ refresh_token: 'token' }));
      service.logout();

      expect(service.refreshToken).toBeNull();
    });
  });
});
