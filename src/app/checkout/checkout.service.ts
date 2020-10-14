import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private BASE_URL = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(cartValue){
    return this.httpClient.get(`${this.BASE_URL}/api/payment/methods?value=${cartValue}`);
  }

  public makePaymentRequest(data, cartValue){
    const payload = {
      data:data,
      cartValue:cartValue
    }
    return this.httpClient.post(this.BASE_URL+'/api/payment/request',payload)
  }
}
