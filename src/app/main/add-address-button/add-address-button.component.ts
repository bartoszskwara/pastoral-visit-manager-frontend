import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'add-address-button',
  templateUrl: './add-address-button.component.html',
  styleUrls: ['./add-address-button.component.scss']
})
export class AddAddressButtonComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  goToAddAddress() {
    this.router.navigate(['../address', 'add'], { relativeTo: this.route });
  }
}
