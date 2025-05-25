import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpvRequestFormComponent } from './npv-request-form.component';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NpvCommunicationService } from '../../../../core/services/npv-communication.service';

describe('NpvRequestFormComponent', () => {
  let component: NpvRequestFormComponent;
  let fixture: ComponentFixture<NpvRequestFormComponent>;
  let commServiceSpy: jasmine.SpyObj<NpvCommunicationService>;
  let fb: FormBuilder;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('NpvCommunicationService', ['sendCalculateRequest', 'sendResetEvent']);
    fb = new FormBuilder();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [NpvRequestFormComponent],
      providers: [{ provide: NpvCommunicationService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(NpvRequestFormComponent);
    component = fixture.componentInstance;
    commServiceSpy = TestBed.inject(NpvCommunicationService) as jasmine.SpyObj<NpvCommunicationService>;

    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.cashFlowsArray.length).toBe(0);
  });

  it('should add a cash flow when addCashFlow is called with valid number', () => {
    component.form.get('newCashFlow')?.setValue(100);
    component.addCashFlow();
    expect(component.cashFlowsArray.length).toBe(1);
    expect(component.cashFlowsArray.at(0)?.value).toBe(100);
    expect(component.form.get('newCashFlow')?.value).toBeNull();
  });

  it('should remove cash flow at specified index', () => {
    component.cashFlowsArray.push(fb.control(50));
    component.cashFlowsArray.push(fb.control(150));
    expect(component.cashFlowsArray.length).toBe(2);

    component.removeCashFlow(0);
    expect(component.cashFlowsArray.length).toBe(1);
    expect(component.cashFlowsArray.at(0)?.value).toBe(150);
  });

  it('should send calculate request with correct data on valid form submission', () => {
    component.form.patchValue({
      lowerBoundRate: 1,
      upperBoundRate: 5,
      incrementRate: 1
    });
    component.cashFlowsArray.push(fb.control(200));
    component.cashFlowsArray.push(fb.control(300));

    component.onSubmit();

    expect(commServiceSpy.sendCalculateRequest).toHaveBeenCalledWith({
      cashFlows: [200, 300],
      lowerBoundRate: 1,
      upperBoundRate: 5,
      incrementRate: 1
    });
  });

  it('should mark all as touched if form is invalid on submit', () => {
    spyOn(component.form, 'markAllAsTouched');

    component.form.patchValue({
      lowerBoundRate: 0,
      upperBoundRate: 0,
      incrementRate: 0
    });

    component.onSubmit();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
    expect(commServiceSpy.sendCalculateRequest).not.toHaveBeenCalled();
  });

  it('should reset form and send reset event on onReset', () => {
    component.cashFlowsArray.push(fb.control(100));
    component.form.patchValue({
      lowerBoundRate: 2,
      upperBoundRate: 10,
      incrementRate: 1
    });

    component.onReset();

    expect(component.cashFlowsArray.length).toBe(0);
    expect(component.form.value.lowerBoundRate).toBeNull();
    expect(component.form.value.upperBoundRate).toBeNull();
    expect(component.form.value.incrementRate).toBeNull();
    expect(commServiceSpy.sendResetEvent).toHaveBeenCalled();
  });
});
