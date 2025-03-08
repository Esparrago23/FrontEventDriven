import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  private clientId: string;
  private messagesSubject: Subject<any> = new Subject<any>();  

  constructor() {
    this.clientId = uuidv4();
    this.socket = new WebSocket(environment.wsUrl); 
    
    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      this.sendMessage({ type: 'register', clientId: this.clientId });  
    };

    
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.clientId === this.clientId) {
        console.log('Message received for this client:', message);
        this.messagesSubject.next(message);  
      }
    };

   
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    
    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };
  }

  
  sendMessage(message: any) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  
  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  
  getClientId(): string {
    return this.clientId;
  }
}
