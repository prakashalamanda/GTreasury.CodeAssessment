import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NpvResponse } from '../../../../core/models/npv-response.model';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-npv-chart-result',
  standalone: false,
  templateUrl: './npv-chart-result.component.html',
  styleUrl: './npv-chart-result.component.scss'
})

export class NpvChartResultComponent implements OnChanges {
  @Input() results: NpvResponse[] | null = null;

  chartType: ChartType = 'line';

  chartData: ChartData<ChartType> = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartOptions<ChartType> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Discount Rate (%)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'NPV'
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['results'] && this.results) {
      this.updateChartData();
    }
  }

  onChartTypeChange() {
    this.updateChartData();
  }

  updateChartData() {
    if (!this.results || this.results.length === 0) {
      this.chartData = { datasets: [] };
      return;
    }

    switch (this.chartType) {
      case 'bar':
        this.chartData = {
          labels: this.results.map(r => r.discountRate.toFixed(2)),
          datasets: [{
            label: 'NPV',
            data: this.results.map(r => r.netPresentValue),
            backgroundColor: 'rgba(54,162,235,0.6)',
            borderColor: 'rgba(54,162,235,1)',
            borderWidth: 1
          }]
        };
        break;

      case 'line':
      default:
        this.chartData = {
          labels: this.results.map(r => r.discountRate.toFixed(2)),
          datasets: [{
            label: 'NPV',
            data: this.results.map(r => r.netPresentValue),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1
          }]
        };
        break;
    }
  }
}