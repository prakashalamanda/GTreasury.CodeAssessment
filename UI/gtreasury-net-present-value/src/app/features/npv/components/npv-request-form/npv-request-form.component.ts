import { Component } from '@angular/core';
import { NpvRequest } from '../../../../core/models/npv-request.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NpvCommunicationService } from '../../../../core/services/npv-communication.service';

@Component({
  selector: 'app-npv-request-form',
  standalone: false,
  templateUrl: './npv-request-form.component.html',
  styleUrl: './npv-request-form.component.scss'
})
export class NpvRequestFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commService: NpvCommunicationService) {
    this.form = this.fb.group({
      cashFlows: this.fb.array([], Validators.required),
      lowerBoundRate: [0.00, [Validators.required, Validators.min(0.01), Validators.max(100)]],
      upperBoundRate: [0.00, [Validators.required, Validators.min(0.01), Validators.max(100)]],
      incrementRate: [0.00, [Validators.required, Validators.min(0.01), Validators.max(100)]],
      newCashFlow: [null]
    });
  }

  get cashFlowsArray(): FormArray {
    return this.form.get('cashFlows') as FormArray;
  }

  addCashFlow() {
    const amount = this.form.get('newCashFlow')?.value;
    if (amount !== null && !isNaN(amount)) {
      this.cashFlowsArray.push(this.fb.control(amount, Validators.required));
      this.form.get('newCashFlow')?.reset();
    }
  }

  removeCashFlow(index: number) {
    this.cashFlowsArray.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      const request: NpvRequest = {
        cashFlows: this.cashFlowsArray.value.map((val: number) => val),
        lowerBoundRate: this.form.value.lowerBoundRate,
        upperBoundRate: this.form.value.upperBoundRate,
        incrementRate: this.form.value.incrementRate
      };

      this.commService.sendCalculateRequest(request);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    while (this.cashFlowsArray.length !== 0) {
      this.cashFlowsArray.removeAt(0);
    }

    this.form.reset({
      discountRate: 0,
      cashflowsArray: [0]
    });

    this.commService.sendResetEvent();
  }
}
