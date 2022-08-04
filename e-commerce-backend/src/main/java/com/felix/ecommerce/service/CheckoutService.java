package com.felix.ecommerce.service;

import com.felix.ecommerce.dto.Purchase;
import com.felix.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

}
