import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NpvCalculatorDashboardComponent } from "./components/npv-calculator-dashboard/npv-calculator-dashboard.component";
import { NpvChartResultComponent } from "./components/npv-chart-result/npv-chart-result.component";
import { NpvRequestFormComponent } from "./components/npv-request-form/npv-request-form.component";
import { NpvTableResultComponent } from "./components/npv-table-result/npv-table-result.component";
import { NpvRoutingModule } from "./npv-routing.module";
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from "ng2-charts";

@NgModule({
  declarations: [
    NpvCalculatorDashboardComponent,
    NpvRequestFormComponent,
    NpvTableResultComponent,
    NpvChartResultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NpvRoutingModule,
    BaseChartDirective
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  exports: [NpvChartResultComponent]
})
export class NpvModule { }