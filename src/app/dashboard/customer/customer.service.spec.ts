import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EMPTY } from 'rxjs';

import { CustomerService } from './customer.service';
import { Customer } from './customer';
import { HttpApi } from '../../core/http/http-api';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should call the correct API endpoint to get customer list', () => {
      service.list().subscribe();

      const req = httpMock.expectOne(HttpApi.customerList);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return an array of customers from the server', () => {
      const mockCustomers = [
        {
          id: '1',
          documentType: 'DNI',
          documentNumber: '12345678',
          name: 'John Doe',
          phoneNumber: '555-1234',
          email: 'john@example.com',
          address: '123 Main St'
        },
        {
          id: '2',
          documentType: 'DNI',
          documentNumber: '87654321',
          name: 'Jane Smith',
          phoneNumber: '555-5678',
          email: 'jane@example.com',
          address: '456 Oak Ave'
        }
      ];

      service.list().subscribe((customers) => {
        expect(customers.length).toBe(2);
        expect(customers).toEqual(mockCustomers);
      });

      const req = httpMock.expectOne(HttpApi.customerList);
      req.flush(mockCustomers);
    });

    it('should return empty observable on error', (done) => {
      service.list().subscribe({
        next: () => fail('should have errored'),
        error: () => fail('should not error'),
        complete: () => done()
      });

      const req = httpMock.expectOne(HttpApi.customerList);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle empty customer list from server', () => {
      service.list().subscribe((customers) => {
        expect(customers.length).toBe(0);
        expect(customers).toEqual([]);
      });

      const req = httpMock.expectOne(HttpApi.customerList);
      req.flush([]);
    });
  });

  describe('get', () => {
    it('should call the correct API endpoint to get a single customer', () => {
      const customerId = '123';

      service.get(customerId).subscribe();

      const req = httpMock.expectOne(`${HttpApi.getCustomer}/${customerId}`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should return a Customer object from the server', () => {
      const customerId = '123';
      const mockCustomerData = {
        id: '123',
        documentType: 'DNI',
        documentNumber: '12345678',
        name: 'John Doe',
        phoneNumber: '555-1234',
        email: 'john@example.com',
        address: '123 Main St'
      };

      service.get(customerId).subscribe((customer) => {
        expect(customer).toBeInstanceOf(Customer);
        expect(customer.id).toBe('123');
        expect(customer.name).toBe('John Doe' as any);
        expect(customer.email).toBe('john@example.com');
      });

      const req = httpMock.expectOne(`${HttpApi.getCustomer}/${customerId}`);
      req.flush(mockCustomerData);
    });

    it('should map server response to Customer model correctly', () => {
      const customerId = '456';
      const mockCustomerData = {
        id: '456',
        documentType: 'Passport',
        documentNumber: 'AB123456',
        name: 'Jane Smith',
        phoneNumber: '555-9999',
        email: 'jane@test.com',
        address: '789 Elm St'
      };

      service.get(customerId).subscribe((customer) => {
        expect(customer.id).toBe(mockCustomerData.id);
        expect(customer.documentType).toBe(mockCustomerData.documentType);
        expect(customer.documentNumber).toBe(mockCustomerData.documentNumber);
        expect(customer.name).toBe(mockCustomerData.name as any);
        expect(customer.phoneNumber).toBe(mockCustomerData.phoneNumber);
        expect(customer.email).toBe(mockCustomerData.email);
        expect(customer.address).toBe(mockCustomerData.address);
      });

      const req = httpMock.expectOne(`${HttpApi.getCustomer}/${customerId}`);
      req.flush(mockCustomerData);
    });

    it('should return empty observable on error', (done) => {
      const customerId = '999';

      service.get(customerId).subscribe({
        next: () => fail('should have errored'),
        error: () => fail('should not error'),
        complete: () => done()
      });

      const req = httpMock.expectOne(`${HttpApi.getCustomer}/${customerId}`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('add', () => {
    it('should call the correct API endpoint to add a customer', () => {
      const newCustomer = new Customer(
        '1',
        'DNI',
        '12345678',
        'John Doe' as any,
        '555-1234',
        'john@example.com',
        '123 Main St'
      );

      service.add(newCustomer).subscribe();

      const req = httpMock.expectOne(HttpApi.addCustomer);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newCustomer);
      req.flush({});
    });

    it('should send customer data in the request body', () => {
      const newCustomer = new Customer(
        '2',
        'Passport',
        'AB123456',
        'Jane Smith' as any,
        '555-5678',
        'jane@example.com',
        '456 Oak Ave'
      );

      service.add(newCustomer).subscribe();

      const req = httpMock.expectOne(HttpApi.addCustomer);
      expect(req.request.body).toEqual(newCustomer);
      req.flush({ success: true });
    });

    it('should return the server response', () => {
      const newCustomer = new Customer(
        '3',
        'DNI',
        '99999999',
        'Test User' as any,
        '555-0000',
        'test@example.com',
        '789 Test St'
      );
      const mockResponse = { id: '3', success: true };

      service.add(newCustomer).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(HttpApi.addCustomer);
      req.flush(mockResponse);
    });

    it('should return empty observable on error', (done) => {
      const newCustomer = new Customer(
        '4',
        'DNI',
        '11111111',
        'Error User' as any,
        '555-1111',
        'error@example.com',
        '111 Error St'
      );

      service.add(newCustomer).subscribe({
        next: () => fail('should have errored'),
        error: () => fail('should not error'),
        complete: () => done()
      });

      const req = httpMock.expectOne(HttpApi.addCustomer);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('update', () => {
    it('should call the correct API endpoint to update a customer', () => {
      const updatedCustomer = new Customer(
        '1',
        'DNI',
        '12345678',
        'John Doe Updated' as any,
        '555-1234',
        'john.updated@example.com',
        '123 Main St'
      );

      service.update(updatedCustomer).subscribe();

      const req = httpMock.expectOne(HttpApi.updateCustomer);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedCustomer);
      req.flush({});
    });

    it('should send updated customer data in the request body', () => {
      const updatedCustomer = new Customer(
        '2',
        'Passport',
        'AB123456',
        'Jane Smith Updated' as any,
        '555-9999',
        'jane.updated@example.com',
        '456 Oak Ave Updated'
      );

      service.update(updatedCustomer).subscribe();

      const req = httpMock.expectOne(HttpApi.updateCustomer);
      expect(req.request.body).toEqual(updatedCustomer);
      req.flush({ success: true });
    });

    it('should return the server response', () => {
      const updatedCustomer = new Customer(
        '3',
        'DNI',
        '99999999',
        'Test User Updated' as any,
        '555-0000',
        'test.updated@example.com',
        '789 Test St'
      );
      const mockResponse = { id: '3', success: true, updated: true };

      service.update(updatedCustomer).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(HttpApi.updateCustomer);
      req.flush(mockResponse);
    });

    it('should return empty observable on error', (done) => {
      const updatedCustomer = new Customer(
        '4',
        'DNI',
        '11111111',
        'Error User' as any,
        '555-1111',
        'error@example.com',
        '111 Error St'
      );

      service.update(updatedCustomer).subscribe({
        next: () => fail('should have errored'),
        error: () => fail('should not error'),
        complete: () => done()
      });

      const req = httpMock.expectOne(HttpApi.updateCustomer);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('delete', () => {
    it('should call the correct API endpoint to delete a customer', () => {
      const customerId = '123';

      service.delete(customerId).subscribe();

      const req = httpMock.expectOne(`${HttpApi.deleteCustomer}/${customerId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should include customer ID in the URL', () => {
      const customerId = '456';

      service.delete(customerId).subscribe();

      const req = httpMock.expectOne(`${HttpApi.deleteCustomer}/${customerId}`);
      expect(req.request.url).toContain(customerId);
      req.flush({ success: true });
    });

    it('should return the server response', () => {
      const customerId = '789';
      const mockResponse = { success: true, deleted: true };

      service.delete(customerId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${HttpApi.deleteCustomer}/${customerId}`);
      req.flush(mockResponse);
    });

    it('should return empty observable on error', (done) => {
      const customerId = '999';

      service.delete(customerId).subscribe({
        next: () => fail('should have errored'),
        error: () => fail('should not error'),
        complete: () => done()
      });

      const req = httpMock.expectOne(`${HttpApi.deleteCustomer}/${customerId}`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle deletion of non-existent customer', (done) => {
      const customerId = 'non-existent';

      service.delete(customerId).subscribe({
        next: () => fail('should have errored'),
        error: () => fail('should not error'),
        complete: () => done()
      });

      const req = httpMock.expectOne(`${HttpApi.deleteCustomer}/${customerId}`);
      req.error(new ErrorEvent('Not found'));
    });
  });
});
