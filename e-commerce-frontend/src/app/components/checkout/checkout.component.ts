import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  constructor(private formBuilder: FormBuilder, 
              private shopFormService: ShopFormService, 
              private cartService: CartService, 
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    this.reviewCartDetails();
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                [
                                  Validators.required, 
                                  Validators.minLength(2), 
                                  ShopValidators.notOnlyWhiteSpace
                                ]),
        lastName: new FormControl('', 
                                [
                                  Validators.required, 
                                  Validators.minLength(2),
                                  ShopValidators.notOnlyWhiteSpace
                                ]),
        email: new FormControl('', 
                                [
                                  Validators.required, 
                                  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
                                ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                  [
                                    Validators.required, 
                                    Validators.minLength(2),
                                    ShopValidators.notOnlyWhiteSpace
                                  ]),
        city: new FormControl('', 
                                [
                                  Validators.required, 
                                  Validators.minLength(2),
                                  ShopValidators.notOnlyWhiteSpace
                                ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', 
                                    [
                                      Validators.required, 
                                      Validators.minLength(2),
                                      ShopValidators.notOnlyWhiteSpace
                                    ])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                  [
                                    Validators.required, 
                                    Validators.minLength(2),
                                    ShopValidators.notOnlyWhiteSpace
                                  ]),
        city: new FormControl('', 
                                [
                                  Validators.required, 
                                  Validators.minLength(2),
                                  ShopValidators.notOnlyWhiteSpace
                                ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', 
                                    [
                                      Validators.required, 
                                      Validators.minLength(2),
                                      ShopValidators.notOnlyWhiteSpace
                                    ])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', 
                                      [
                                        Validators.required, 
                                        Validators.minLength(2),
                                        ShopValidators.notOnlyWhiteSpace
                                      ]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expireMonth: [''],
        expireYear: ['']
      })
    });

    const startMonth: number = new Date().getMonth() + 1;
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      res => this.creditCardMonths = res
    );

    this.shopFormService.getCreditCardYears().subscribe(
      res => this.creditCardYears = res
    );

    this.shopFormService.getCountries().subscribe(
      res => this.countries = res
    );

    
  }
  
  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order: Order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    let purchase: Purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: State = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: State = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    
    purchase.order = order;
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: res => {
          alert(`Your order has been received. \n Order tracking number: ${res.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    )
    
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(
      res => this.totalPrice = res
    );

    this.cartService.totalQuantity.subscribe(
      res => this.totalQuantity = res
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() { return this.checkoutFormGroup.get('customer.lastName');}
  get email() { return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType');}
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode');}

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectYear: number = Number(creditCardFormGroup?.value.expireYear);

    let startMonth: number;
    if (currentYear === selectYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      res => this.creditCardMonths = res
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    
    this.shopFormService.getStates(countryCode).subscribe(
      res => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = res;
        } else {
          this.billingAddressStates = res;
        }

        formGroup?.get('state')?.setValue(res[0]);
      }
    )
  }
}
