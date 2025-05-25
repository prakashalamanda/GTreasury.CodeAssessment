import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NpvCalculatorDashboardComponent } from './npv-calculator-dashboard.component';
import { NpvCommunicationService } from '../../../../core/services/npv-communication.service';
import { NpvCalculatorService } from '../../../../core/services/npv-calculator.service';
import { of, Subject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NpvRequest } from '../../../../core/models/npv-request.model';
import { NpvRequestFormComponent } from '../npv-request-form/npv-request-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('NpvCalculatorDashboardComponent', () => {
  let component: NpvCalculatorDashboardComponent;
  let fixture: ComponentFixture<NpvCalculatorDashboardComponent>;

  let calculateSubject: Subject<NpvRequest>;
  let resetSubject: Subject<boolean>;

  // Use Partial & jasmine.SpyObj for mocks with typed observables
  let mockCommService: jasmine.SpyObj<NpvCommunicationService> & {
    calculate$: Subject<NpvRequest>;
    reset$: Subject<boolean>;
  };
  let mockCalcService: jasmine.SpyObj<NpvCalculatorService>;

  beforeEach(async () => {
    calculateSubject = new Subject<NpvRequest>();
    resetSubject = new Subject<boolean>();

    mockCommService = jasmine.createSpyObj('NpvCommunicationService', [
      'sendCalculateRequest',
      'sendResetEvent',
      'clearResetEvent'
    ]) as jasmine.SpyObj<NpvCommunicationService> & {
      calculate$: Subject<NpvRequest>;
      reset$: Subject<boolean>;
    };

    // Assign Subjects directly to strongly typed properties
    mockCommService.calculate$ = calculateSubject;
    mockCommService.reset$ = resetSubject;

    mockCalcService = jasmine.createSpyObj('NpvCalculatorService', ['calculateNpv']);

    await TestBed.configureTestingModule({
      declarations: [NpvCalculatorDashboardComponent, NpvRequestFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: NpvCommunicationService, useValue: mockCommService },
        { provide: NpvCalculatorService, useValue: mockCalcService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpvCalculatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component and initialize with empty viewModel', () => {
    expect(component).toBeTruthy();
    expect(component.viewModel.npvResults.length).toBe(0);
    expect(component.viewModel.isLoading).toBeFalse();
    expect(component.viewModel.error).toBeNull();
    expect(component.viewModel.activeView).toBe('none');
  });

  it('should subscribe and call calculateNpv on event', () => {
    const npvRequest: NpvRequest = {
      incrementRate: 5,
      cashFlows: [1000],
      lowerBoundRate: 1,
      upperBoundRate: 5
    };

    mockCalcService.calculateNpv.and.returnValue(of([{ discountRate: 5, netPresentValue: 1000 }]));

    calculateSubject.next(npvRequest);

    expect(mockCalcService.calculateNpv).toHaveBeenCalledWith(npvRequest);
  });

  it('should subscribe and reset dashboard on event', () => {
    resetSubject.next(true);

    expect(component.viewModel.npvResults.length).toBe(0);
    expect(component.viewModel.activeView).toBe('none');
    expect(mockCommService.clearResetEvent).toHaveBeenCalled();
  });

  it('should set loading true on calculate start and false after success', () => {
    const npvRequest: NpvRequest = {
      incrementRate: 5,
      cashFlows: [1000],
      lowerBoundRate: 1,
      upperBoundRate: 5
    };
    const npvResult = [{ discountRate: 5, netPresentValue: 1000 }];

    mockCalcService.calculateNpv.and.returnValue(of(npvResult));

    component['calculateNpv'](npvRequest);

    expect(component.viewModel.isLoading).toBeFalse();
    expect(component.viewModel.npvResults).toEqual(npvResult);
    expect(component.viewModel.activeView).toBe('table');
    expect(component.viewModel.error).toBeNull();
  });

  it('should handle errors properly', () => {
    const npvRequest: NpvRequest = {
      incrementRate: 5,
      cashFlows: [1000],
      lowerBoundRate: 1,
      upperBoundRate: 5
    };
    const errorResponse = new HttpErrorResponse({
      error: { details: 'Invalid input' },
      status: 400,
      statusText: 'Bad Request'
    });

    mockCalcService.calculateNpv.and.returnValue(throwError(() => errorResponse));

    component['calculateNpv'](npvRequest);

    expect(component.viewModel.isLoading).toBeFalse();
    expect(component.viewModel.error).toContain('Invalid input');
    expect(component.viewModel.activeView).toBe('none');
  });

  it('should reset results properly', () => {
    component.viewModel.npvResults = [{ discountRate: 5, netPresentValue: 1000 }];
    component.viewModel.isLoading = true;
    component.viewModel.error = 'Some error';
    component.viewModel.activeView = 'table';

    component['resetDashboard']();

    expect(component.viewModel.npvResults.length).toBe(0);
    expect(component.viewModel.isLoading).toBeFalse();
    expect(component.viewModel.error).toBeNull();
    expect(component.viewModel.activeView).toBe('none');
  });

  it('should return true if active view matches mode', () => {
    component.viewModel.activeView = 'chart';
    expect(component.getActiveMode('chart')).toBeTrue();
    expect(component.getActiveMode('table')).toBeFalse();
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    component['subscriptions'].forEach(sub => spyOn(sub, 'unsubscribe').and.callThrough());

    component.ngOnDestroy();

    component['subscriptions'].forEach(sub => {
      expect(sub.closed).toBeTrue();
    });
  });
});
