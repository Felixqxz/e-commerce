package com.felix.ecommerce.dto;

import com.felix.ecommerce.entity.Address;
import com.felix.ecommerce.entity.Customer;
import com.felix.ecommerce.entity.Order;
import com.felix.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
