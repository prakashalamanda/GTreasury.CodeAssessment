import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NpvCalculatorDashboardComponent } from "./components/npv-calculator-dashboard/npv-calculator-dashboard.component";

const routes: Routes = [
  { path: 'dashboard', component: NpvCalculatorDashboardComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NpvRoutingModule { }