import {Component, OnInit} from '@angular/core';
import {AddAddressService} from "../service/add-address.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AddressDto} from "../../shared/model/AddressDto";

@Component({
  selector: 'add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {

  constructor(private addAddressService: AddAddressService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  addNewAddress(newAddress: AddressDto) {
    this.addAddressService.save(newAddress)
      .subscribe(
        address => {
          this.router.navigate(['../', address.id], {relativeTo: this.route});
        },
        error => {
          console.log('error', error);
        },
        () => {
        }
      );

  }
}
