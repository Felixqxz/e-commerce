import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHis) { }

  ngOnInit(): void {
  }

}
