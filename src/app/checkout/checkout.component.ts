import { Component, OnInit } from '@angular/core';
import { CheckoutService } from './checkout.service';
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

// Fake AdyenCheckout, to prevent compile error
declare const AdyenCheckout;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  methods = [];
  private checkout: any;
  private dropin: any;
  private adyenConfig: {};
  public cartValue = 10;
  public errorMsg: string;

  constructor(private checkoutService: CheckoutService, private route: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.loadScript()
  }

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get("reason")
    if (reason) {
      this.startPayment()
      this.msgHandler(reason)
    }
  }

  showSnackBar(msg) {
    this._snackBar.open(msg, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  msgHandler(reason, extraInfo = null) {
    let msg: string;
    switch (reason) {
      case 'refused':
        msg = "Payment refused, please try again"
        break
      case 'cancelled':
        msg = "Payment was cancelled, please try again"
        break
      case 'error':
        msg = "Something went wrong!"
        break
      default:
        msg = "Something went wrong!"
        break
    }
    this.errorMsg = msg
    if(extraInfo)
      this.errorMsg += `<br>${extraInfo}`
    this.showSnackBar(msg)

  }

  public loadScript() {
    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.13.0/adyen.js';
    script.async = true;
    // script.defer = true;
    // script.integrity='sha384-43SJm/Fc8D/N/UL7GYd+lUawkh0xQgdepGgkMMaoWKl0shiuU4yQrz6xYRMJvVI1'
    script.crossOrigin = 'anonymous'
    body.appendChild(script);
  }

  makePayment(data): Promise<any> {
    console.log('[func] makePayment');
    this.checkoutService.makePaymentRequest(data, this.cartValue).subscribe(
      res => {
        console.log("Post Request is successful ", res);
        if (res['action']) {
          // Drop-in handles the action object from the /payments response
          this.dropin.handleAction(res['action']);
        } else {
          // Your function to show the final result to the shopper
          switch (res['resultCode']) {
            case 'Authorised':
              console.log('authorised');
              window.location.href = "/success";
              break;
            case "Pending":
              console.log('pending');
              this.msgHandler('pending')
              // window.location.href = "/pending";
              break;
            case "Refused":
              console.log('payment refused');
              this.msgHandler('refused', res['refusalReason'])
              break;
            default:
              console.log('default');
              this.msgHandler('error')
              // window.location.href = "/error";
              break;
          }
        }
      },
      error => {
        console.log("error", error);
      }
    );
    console.log('[func] makePayment finished');
    return
  }

  makeDetailsCall(data): Promise<any> {
    console.log(data);
    return
  }

  showFinalResult(data): Promise<any> {
    console.log(data);
    return
  }

  loadAdyenConfig() {
    console.log(this.methods);
    this.adyenConfig = {
      paymentMethodsResponse: this.methods, // The `/paymentMethods` response from the server.
      clientKey: "test_CIXAPNBW2JERLEJ6GYYC3WBLVMO2HIZ3", // Web Drop-in versions before 3.10.1 use originKey instead of clientKey.
      locale: "en-US",
      environment: "test",
      amount: {
        value: this.cartValue,
        currency: "EUR"
      },
      onSubmit: (state, dropin) => {
        console.log('onSubmit');
        console.log(state);
        // Your function calling your server to make the `/payments` request
        this.makePayment(state.data)
          .then(response => {
            if (response['action']) {
              // Drop-in handles the action object from the /payments response
              dropin.handleAction(response['action']);
            } else {
              // Your function to show the final result to the shopper
              this.showFinalResult(response);
            }
          })
          .catch(error => {
            throw Error(error);
          });
      },
      onAdditionalDetails: (state, dropin) => {
        // Your function calling your server to make a `/payments/details` request
        this.makeDetailsCall(state.data)
          .then(response => {
            console.log(response);
            if (response['action']) {
              // Drop-in handles the action object from the /payments response
              dropin.handleAction(response['action']);
            } else {
              // Your function to show the final result to the shopper
              this.showFinalResult(response);
            }
          })
          .catch(error => {
            throw Error(error);
          });
      },
      paymentMethodsConfiguration: {
        card: { // Example optional configuration for Cards
          hasHolderName: true,
          holderNameRequired: true,
          enableStoreDetails: true,
          hideCVC: false, // Change this to true to hide the CVC field for stored cards
          name: 'Credit or debit card',
          billingAddressRequired: true
        }
      }
    };

  }

  startPayment(status = null) {
    console.log('start payment');
    // this.loadAdyenConfig()
    this.checkoutService.sendGetRequest(this.cartValue).subscribe((data: any[]) => {
      this.methods = data;
      this.loadAdyenConfig()
      this.checkout = new AdyenCheckout(this.adyenConfig);
      this.dropin = this.checkout.create('dropin').mount('#dropin-container');
    })
  }
}
