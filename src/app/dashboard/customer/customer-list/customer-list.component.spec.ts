import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { EMPTY, of, throwError } from 'rxjs';

import { CustomerListComponent } from './customer-list.component';
import { CustomerService } from '../customer.service';
import { FakeCustomerService } from '../../../../test/fakes.spec';
import { Customer } from '../customer';
import { LoadingBackdropService } from '../../../core/services/loading-backdrop.service';

describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let customerService: CustomerService;
  let loadingBackdropService: LoadingBackdropService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatTableModule
      ],
      providers: [
        { provide: CustomerService, useClass: FakeCustomerService },
        LoadingBackdropService,
      ],
      declarations: [CustomerListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    customerService = TestBed.get(CustomerService);
    loadingBackdropService = TestBed.get(LoadingBackdropService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set customers table with the list returned from the server', () => {
    spyOn(customerService, 'list').and.callFake(() => {
      return of([]);
    });

    component.ngOnInit();
    expect(component.dataSource.data.length).toBeGreaterThanOrEqual(0);
  });

  it('should call the server to load customers on init', () => {
    const spy = spyOn(customerService, 'list').and.returnValue(of([]));

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });

  it('should populate dataSource with customer data from the server', () => {
    const mockCustomers: Customer[] = [
      new Customer('1', 'DNI', '12345678', 'John Doe' as any, '555-1234', 'john@example.com', '123 Main St'),
      new Customer('2', 'DNI', '87654321', 'Jane Smith' as any, '555-5678', 'jane@example.com', '456 Oak Ave'),
    ];
    spyOn(customerService, 'list').and.returnValue(of(mockCustomers));

    component.loadCustomers();

    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data).toEqual(mockCustomers);
  });

  it('should show loading backdrop when loading customers', () => {
    spyOn(customerService, 'list').and.returnValue(of([]));
    const spy = spyOn(loadingBackdropService, 'show');

    component.loadCustomers();

    expect(spy).toHaveBeenCalled();
  });

  it('should hide loading backdrop after customers are loaded', () => {
    spyOn(customerService, 'list').and.returnValue(of([]));
    const spy = spyOn(loadingBackdropService, 'hide');

    component.loadCustomers();

    expect(spy).toHaveBeenCalled();
  });

  it('should hide loading backdrop even if loading customers fails', () => {
    spyOn(customerService, 'list').and.returnValue(EMPTY);
    const spy = spyOn(loadingBackdropService, 'hide');

    component.loadCustomers();

    expect(spy).toHaveBeenCalled();
  });

  it('should initialize MatSort on ngOnInit', () => {
    spyOn(customerService, 'list').and.returnValue(of([]));

    component.ngOnInit();

    expect(component.dataSource.sort).toBe(component.sort);
  });

  it('should initialize MatPaginator on ngOnInit', () => {
    spyOn(customerService, 'list').and.returnValue(of([]));

    component.ngOnInit();

    expect(component.dataSource.paginator).toBe(component.paginator);
  });

  it('should navigate to new customer page when onCustomerAddNavigate is called', () => {
    const spy = spyOn(router, 'navigate');

    component.onCustomerAddNavigate();

    expect(spy).toHaveBeenCalledWith(['new'], { relativeTo: route });
  });

  it('should navigate to customer detail page when onCustomerDetailNavigate is called', () => {
    const mockCustomer = new Customer('123', 'DNI', '12345678', 'John Doe' as any, '555-1234', 'john@example.com', '123 Main St');
    const spy = spyOn(router, 'navigate');

    component.onCustomerDetailNavigate(mockCustomer);

    expect(spy).toHaveBeenCalledWith(['123'], { relativeTo: route });
  });

  it('should display correct columns in the table', () => {
    expect(component.displayedColumns).toEqual([
      'documentType',
      'name',
      'phoneNumber',
      'email',
      'address'
    ]);
  });

  it('should handle empty customer list from server', () => {
    spyOn(customerService, 'list').and.returnValue(of([]));

    component.loadCustomers();

    expect(component.dataSource.data.length).toBe(0);
  });

  it('should handle large customer list from server', () => {
    const mockCustomers: Customer[] = [];
    for (let i = 0; i < 100; i++) {
      mockCustomers.push(
        new Customer(`${i}`, 'DNI', `1234567${i}`, `Customer ${i}` as any, '555-0000', `customer${i}@example.com`, `${i} Street`)
      );
    }
    spyOn(customerService, 'list').and.returnValue(of(mockCustomers));

    component.loadCustomers();

    expect(component.dataSource.data.length).toBe(100);
  });
});
