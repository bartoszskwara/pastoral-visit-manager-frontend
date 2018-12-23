import { Component, OnInit } from '@angular/core';
import {SimpleAddress} from "../home/model/SimpleAddress";
import {AddressService} from "../address/service/address.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Chunk} from "../shared/model/Chunk";

export interface Filter {
  name: string;
}

@Component({
  selector: 'addresses-list',
  templateUrl: './addresses-list.component.html',
  styleUrls: ['./addresses-list.component.scss']
})
export class AddressesListComponent implements OnInit {

  private readonly INITIAL_LIMIT: number = 20;
  limit: number;
  offset: number;
  addresses: SimpleAddress[] = [];
  loading: boolean;
  displayedColumns: string[] = ['no.', 'address', 'apartmentCount', 'addressEdit'];
  filter: Filter;

  constructor(private addressService: AddressService, private router: Router, private route: ActivatedRoute) {
    this.addresses = [];
    this.loading = false;
    this.offset = 0;
    this.limit = 5;
    this.filter = {
      name: ''
    };
  }

  ngOnInit() {
    this.getAddresses(this.offset, this.INITIAL_LIMIT, this.filter);
    this.offset = this.INITIAL_LIMIT;
  }

  getChunk(): void {
    this.offset = this.addresses.length;
    this.getAddresses(this.offset, this.limit, this.filter);
  }

  applyFilter(): void {
    if(this.filter.name.length == 1 || this.filter.name.length == 2) {
      return;
    }
    this.loading = true;
    this.offset = 0;
    this.addresses = [];
    this.getAddresses(this.offset, this.INITIAL_LIMIT, this.filter);
  }

  private getAddresses(offset: number, limit: number, filter: Filter): void {
    this.loading = true;
    this.addressService.fetchAddresses(offset, limit, filter.name)
      .subscribe(
        response => {
          if(response.content) {
            this.joinAddresses(response.content);
          }
        },
        error => {
          console.log('error', error);
          this.addresses = [];
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  private joinAddresses(response: SimpleAddress[]): void {
    let ids = this.addresses.map(a => a.id);
    let addr = [];
    response.forEach(a => {
      if(ids.includes(a.id)) {
        let index = ids.indexOf(a.id);
        this.addresses[index] = a;
      } else {
        addr.push(a);
      }
    });
    this.addresses = this.addresses.concat(addr);
  }

  selectAddress(address: SimpleAddress) {
    this.router.navigate(['../address', address.id], { relativeTo: this.route });
  }

  goToAddressEdit(address: SimpleAddress): void {
    this.router.navigate(['../address', address.id, 'edit'], { relativeTo: this.route });
  }
}
