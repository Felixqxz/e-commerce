import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity : Subject<number> = new Subject<number>();

  constructor() { }

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
}
