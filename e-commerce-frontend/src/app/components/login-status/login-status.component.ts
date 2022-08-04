import { Component, OnInit } from '@angular/core';
import { OktaAuth } from "@okta/okta-auth-js";

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;

  constructor(private oktaAuth: OktaAuth) { }

  ngOnInit(): void {

  }

}
