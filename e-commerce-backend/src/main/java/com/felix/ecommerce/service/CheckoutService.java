package com.felix.ecommerce.service;

import com.felix.ecommerce.dto.PaymentInfo;
import com.felix.ecommerce.dto.Purchase;
import com.felix.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;

}
