import { Component, OnDestroy, OnInit } from '@angular/core';
import { NpvResponse } from '../../../../core/models/npv-response.model';
import { NpvCalculatorService } from '../../../../core/services/npv-calculator.service';
import { NpvRequest } from '../../../../core/models/npv-request.model';
import { NpvCommunicationService } from '../../../../core/services/npv-communication.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface DashboardViewModel {
  npvResults: NpvResponse[];
  isLoading: boolean;
  error: string | null;
  activeView: 'none' | 'table' | 'chart';
}

@Component({
  selector: 'app-npv-calculator-dashboard',
  standalone: false,
  templateUrl: './npv-calculator-dashboard.component.html',
  styleUrl: './npv-calculator-dashboard.component.scss'
})

export class NpvCalculatorDashboardComponent implements OnInit, OnDestroy {
  viewModel: DashboardViewModel = {
    npvResults: [],
    isLoading: false,
    error: null,
    activeView: 'none'
  };

  private subscriptions: Subscription[] = [];

  constructor(private commService: NpvCommunicationService, private service: NpvCalculatorService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.commService.calculate$.subscribe(request => {
        if (request) {
          this.calculateNpv(request);
        }
      })
    );

    this.subscriptions.push(
      this.commService.reset$.subscribe(reset => {
        if (reset) {
          this.resetDashboard();
          this.commService.clearResetEvent();
        }
      })
    );
  }

  showTable(): void {
    this.viewModel.activeView = 'table';
  }

  showChart(): void {
    this.viewModel.activeView = 'chart';
  }

  getActiveMode(mode: string): boolean {
    return this.viewModel.activeView === mode;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private calculateNpv(request: NpvRequest) {
    this.setLoading(true);
    this.resetResults();

    this.service.calculateNpv(request).subscribe({
      next: (results) => this.handleSuccess(results),
      error: (err) => this.handleError(err)
    });
  }

  private resetDashboard() {
    this.resetResults();
  }

  private setLoading(value: boolean): void {
    this.viewModel.isLoading = value;
  }

  private resetResults(): void {
    this.viewModel = {
      npvResults: [],
      isLoading: false,
      error: null,
      activeView: 'none'
    };
  }

  private handleSuccess(results: NpvResponse[]): void {
    this.viewModel.npvResults = results;
    this.viewModel.activeView = 'table';
    this.setLoading(false);
  }

  private handleError(error: HttpErrorResponse): void {
    const message = error.error?.details ?? error.message ?? 'Unknown error';
    this.viewModel.error = `Error calculating NPV. Details: ${message}`;
    this.setLoading(false);
  }
}
