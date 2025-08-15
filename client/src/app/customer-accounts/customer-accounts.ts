import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../services/customer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-accounts',
  imports: [CommonModule],
  templateUrl: './customer-accounts.html',
  styleUrl: './customer-accounts.css'
})
export class CustomerAccountsComponent implements OnInit {
  customerId!: string;
  customer!: Customer;
  copySuccess: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.customer = this.router.getCurrentNavigation()?.extras.state as Customer;
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.params['id'];
  }

  copyJson(): void {
    const jsonString = JSON.stringify(this.customer, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
}