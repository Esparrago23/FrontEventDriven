import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { IOrders } from '../iorders';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrl: './orders-dashboard.component.css'
})
export class OrdersDashboardComponent implements OnInit {

  orders: IOrders[] = [];

  constructor(private ordersService: OrdersService, private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.listenWebSocketMessages(); 
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }

  
  payOrder(orderId: number): void {
    this.ordersService.payOrder(orderId).subscribe(
      (response) => {
        const clientId = this.webSocketService.getClientId(); 
        this.webSocketService.sendMessage({ 
          type: 'payOrder', 
          clientId: clientId,  
          orderId: orderId 
        });
      },
      (error) => {
        console.error('Error procesando el pago', error);
      }
    );
  }
  listenWebSocketMessages(): void {
    this.webSocketService.getMessages().subscribe((message) => {
      console.log("Mensaje recibido:", message);
  
      if (message.type === 'orderUpdate') {
        const updatedOrder = message.order;
         console.log(message.order)
       
        if (!updatedOrder || !updatedOrder.order_id) {
          console.error("Error: El mensaje recibido no tiene un order válido", message);
          return;  
        }
  
        this.updateOrderStatus(updatedOrder);
        alert(`Orden ${updatedOrder.order_id} actualizada a estado ${updatedOrder.status}`);
      }
    });
  }

  updateOrderStatus(updatedOrder: IOrders): void {
    
    this.ordersService.getOrderById(updatedOrder.order_id).subscribe(
      (order) => {
        console.log("Orden obtenida:", order);
  
        
        const updatedOrderData: IOrders = { ...order, ...updatedOrder };
  
        
        this.ordersService.updateOrder(updatedOrderData).subscribe(
          (response) => {
            console.log("Orden actualizada en el backend:", response);
  
            
            const index = this.orders.findIndex(o => o.order_id === updatedOrderData.order_id);
            if (index !== -1) {
              this.orders[index] = updatedOrderData;
            }
          },
          (error) => {
            console.error("Error al actualizar la orden en el backend:", error);
          }
        );
      },
      (error) => {
        console.error("Error al obtener la orden desde la API:", error);
      }
    );
  }
  
}