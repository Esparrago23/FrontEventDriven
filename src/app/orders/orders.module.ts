import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersDashboardComponent } from './orders-dashboard/orders-dashboard.component';



@NgModule({
  declarations: [
    OrdersDashboardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OrdersDashboardComponent,
  ]
})
export class OrdersModule { }
