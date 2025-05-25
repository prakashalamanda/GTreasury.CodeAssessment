import { TestBed } from '@angular/core/testing';
import { NpvCalculatorService } from './npv-calculator.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NpvRequest } from '../models/npv-request.model';
import { NpvResponse } from '../models/npv-response.model';
import { environment } from '../environments/environment';

describe('NpvCalculatorService', () => {
  let service: NpvCalculatorService;
  let httpMock: HttpTestingController;

  const mockRequest: NpvRequest = {
    cashFlows: [100, 200, 300],
    lowerBoundRate: 1,
    upperBoundRate: 5,
    incrementRate: 1
  };

  const mockResponse: NpvResponse[] = [
    { discountRate: 1, netPresentValue: 580 },
    { discountRate: 2, netPresentValue: 570 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NpvCalculatorService]
    });

    service = TestBed.inject(NpvCalculatorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST and return NPV response array', () => {
    service.calculateNpv(mockRequest).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/npv/calculate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
