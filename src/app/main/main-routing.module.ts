import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';

import { MainComponent } from './main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TaskListComponent } from './pages/task-list/task-list.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'lists/:id', component: TaskListComponent},
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
