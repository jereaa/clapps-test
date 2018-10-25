import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { MainMaterialModule } from './main-material.module';
import { DashboardFormComponent } from './pages/dashboard/dashboard-form/dashboard-form.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    MainMaterialModule
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    DashboardComponent,
    DashboardFormComponent
  ]
})
export class MainModule { }
