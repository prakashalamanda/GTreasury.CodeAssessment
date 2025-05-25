import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpvChartResultComponent } from './npv-chart-result.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { NpvResponse } from '../../../../core/models/npv-response.model';

describe('NpvChartResultComponent', () => {
  let component: NpvChartResultComponent;
  let fixture: ComponentFixture<NpvChartResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpvChartResultComponent],
      imports: [BaseChartDirective, FormsModule],
      providers: [provideCharts(withDefaultRegisterables())]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NpvChartResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update chart data on results input change', () => {
    const results: NpvResponse[] = [
      { discountRate: 1, netPresentValue: 100 },
      { discountRate: 2, netPresentValue: 200 }
    ];

    component.results = results;
    component.ngOnChanges({
      results: {
        currentValue: results,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.chartData.labels).toEqual(['1.00', '2.00']);
    expect(component.chartData.datasets[0].data).toEqual([100, 200]);
  });

  it('should update chart data for bar type', () => {
    component.chartType = 'bar';

    const results: NpvResponse[] = [
      { discountRate: 1, netPresentValue: 100 },
      { discountRate: 2, netPresentValue: 200 }
    ];

    component.results = results;
    component.updateChartData();

    expect(component.chartData.datasets[0].backgroundColor).toBe('rgba(54,162,235,0.6)');
    expect(component.chartData.datasets[0].data).toEqual([100, 200]);
  });

  it('should update chart data for line type (default)', () => {
    component.chartType = 'line';

    const results: NpvResponse[] = [
      { discountRate: 1, netPresentValue: 100 },
      { discountRate: 2, netPresentValue: 200 }
    ];

    component.results = results;
    component.updateChartData();

    expect(component.chartData.datasets[0].borderColor).toBe('rgba(75,192,192,1)');
    expect(component.chartData.datasets[0].data).toEqual([100, 200]);
  });

  it('should call updateChartData on onChartTypeChange()', () => {
    spyOn(component, 'updateChartData');
    component.onChartTypeChange();
    expect(component.updateChartData).toHaveBeenCalled();
  });

  it('should clear chart data if results is empty', () => {
    component.results = [];
    component.updateChartData();
    expect(component.chartData.datasets.length).toBe(0);
  });
});
