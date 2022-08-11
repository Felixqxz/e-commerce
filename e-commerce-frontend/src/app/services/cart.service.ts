import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = localStorage;

  constructor() {

    let data = JSON.parse(this.storage.getItem('items')!);

    if (data != null) {
      this.cartItems = data;

      this.computeCartTotals();
    }
   }

  addToCart(cartItem: CartItem) {
    let alreadyExistedInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === cartItem.id);

      alreadyExistedInCart = existingCartItem != undefined;
    }

    if (existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPrice += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantity += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);

    this.persistCartItems();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    
    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotals();
    }
  }
  remove(cartItem: CartItem) {
    const index = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    if (index > -1) {
      this.cartItems.splice(index, 1);

      this.computeCartTotals();
    }
  }

  persistCartItems() {
    console.log(this.cartItems);
    this.storage.setItem('items', JSON.stringify(this.cartItems));
  }
}
