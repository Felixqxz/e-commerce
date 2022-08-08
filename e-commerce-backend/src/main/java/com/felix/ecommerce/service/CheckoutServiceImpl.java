package com.felix.ecommerce.service;

import com.felix.ecommerce.dao.CustomerRepository;
import com.felix.ecommerce.dto.PaymentInfo;
import com.felix.ecommerce.dto.Purchase;
import com.felix.ecommerce.dto.PurchaseResponse;
import com.felix.ecommerce.entity.Customer;
import com.felix.ecommerce.entity.Order;
import com.felix.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    public CheckoutServiceImpl(CustomerRepository customerRepository, @Value("${stripe.key.secret}") String secretKey) {
        this.customerRepository = customerRepository;
        Stripe.apiKey = secretKey;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        Order order = purchase.getOrder();

        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        Customer customer = purchase.getCustomer();
        String email = customer.getEmail();

        Customer customerFromDB = customerRepository.findByEmail(email);

        if (customerFromDB != null) {
            customer = customerFromDB;
        }

        customer.add(order);

        customerRepository.save(customer);

        return new PurchaseResponse(orderTrackingNumber);

    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "Shop Purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());

        return PaymentIntent.create(params);
    }

    private String generateOrderTrackingNumber() {

        // generate random UUID
        return UUID.randomUUID().toString();
    }
}
