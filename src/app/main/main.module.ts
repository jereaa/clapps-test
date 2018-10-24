import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { MainMaterialModule } from './main-material.module';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    MainMaterialModule
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    DashboardComponent
  ]
})
export class MainModule { }
