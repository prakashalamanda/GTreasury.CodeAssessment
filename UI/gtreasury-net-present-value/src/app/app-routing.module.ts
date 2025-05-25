import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'npv',
    loadChildren: () => import('./features/npv/npv.module').then(m => m.NpvModule)
  },
  { path: '', redirectTo: 'npv', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
