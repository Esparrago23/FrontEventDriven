import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrders } from '../iorders';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = (`${environment.apiUrl}/orders`);  

  constructor(private http: HttpClient) { }


  getOrders(): Observable<IOrders[]> {
    return this.http.get<IOrders[]>(`${this.apiUrl}/`);
  }
  payOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${orderId}/pay`, {});
  }
  updateOrder(order: IOrders): Observable<any> {
    return this.http.put(`${this.apiUrl}/${order.order_id}`, order);
  }
  getOrderById(orderId: number): Observable<IOrders> {
    return this.http.get<IOrders>(`${this.apiUrl}/${orderId}`);
  }
  
}
