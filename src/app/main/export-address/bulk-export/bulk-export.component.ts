import { Component, OnInit } from '@angular/core';
import {AddressService} from "../../address/service/address.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SimpleAddress} from "../../home/model/SimpleAddress";
import {SelectionModel} from "@angular/cdk/collections";
import {MatButtonToggleChange, MatCheckboxChange} from "@angular/material";
import {SeasonService} from "../../shared/service/season/season.service";
import {Season} from "../../shared/model/Season";
import {ExportAddressService} from "../service/export-address.service";
import {SelectedAddressDto} from "../model/SelectedAddressDto";

export interface Filter {
  name: string;
}
export class SelectedAddress {
  address: SimpleAddress;
  seasons: Season[];
  emptyColumnsCount: number;
}

@Component({
  selector: 'bulk-export',
  templateUrl: './bulk-export.component.html',
  styleUrls: ['./bulk-export.component.scss']
})
export class BulkExportComponent implements OnInit {

  private readonly INITIAL_LIMIT: number = 20;
  addresses: SimpleAddress[] = [];
  loading: boolean;
  limit: number;
  offset: number;
  displayedColumns: string[] = ['select', 'address', 'season', 'add-empty-column'];
  filter: Filter;
  selection = new SelectionModel<SimpleAddress>(true, []);
  selectedAddresses: SelectedAddress[] = [];
  seasons: Season[];

  constructor(private addressService: AddressService, private seasonService: SeasonService, private exportService: ExportAddressService,
              private router: Router, private route: ActivatedRoute) {
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
    this.getSeasons();
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

  private getAddresses(page: number, size: number, filter: Filter): void {
    this.loading = true;
    this.addressService.fetchAddresses(page, size, filter.name)
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
          this.updateAllSelection();
        });
  }

  private getSeasons() {
    this.seasonService.fetchSeasons()
      .subscribe(
        seasons => {
          this.seasons = seasons;
        },
        error => {
          console.log('error', error);
        },
        () => {
        }
      );
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

  exportCsv(): void {
    this.exportService.exportBulkCsv(this.prepareSelectedAddresses())
      .subscribe(res => {
        let blob = new Blob([res], { type: 'application/zip' });
        let url= window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        console.log('download error:', error);
      }, () => {});
  }

  exportPdf(): void {
    this.exportService.exportBulkPdf(this.prepareSelectedAddresses())
      .subscribe(res => {
        let blob = new Blob([res], { type: 'application/zip' });
        let url= window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        console.log('download error:', error);
      }, () => {});
  }

  updateAllSelection(): void {
    this.selection.clear();
    this.selectedAddresses.forEach(a => this.selection.select(a.address));
  }

  select(event: MatCheckboxChange, address: SimpleAddress) {
    let checked = event ? event.checked : false;
    let seasonsToCheck = this.getNotCurrentSeasons();
    this.markSelected(checked, address, seasonsToCheck);
  }

  private getNotCurrentSeasons(): Season[] {
    return this.seasons.filter(s => !s.current);
  }

  markSelected(selected: boolean, address: SimpleAddress, seasons: Season[]) {
    this.updateSelection(selected, address);
    this.updateSelectedAddresses(selected, address, seasons);
  }

  updateSelection(selected: boolean, address: SimpleAddress) {
    if(selected) {
      this.selection.select(address);
    } else {
      this.selection.deselect(address);
    }
  }

  updateSelectedAddresses(selected: boolean, address: SimpleAddress, seasons: Season[]) {
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    if(selected) {
      if (index < 0) {
        this.selectedAddresses.push(BulkExportComponent.createSelectedAddress(address, seasons));
      } else {
        this.selectedAddresses[index].seasons = seasons;
      }
    } else {
      if (index > -1) {
        this.selectedAddresses.splice(index, 1);
      }
    }
    this.sortAddresses();
  }

  static createSelectedAddress(address: SimpleAddress, seasons: Season[]): SelectedAddress {
    return {
      address: address,
      seasons: seasons,
      emptyColumnsCount: 0
    }
  }

  isSeasonChecked(address: SimpleAddress, season: Season): boolean {
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    if(index < 0) {
      return false;
    }
    let selectedAddress = this.selectedAddresses[index];
    return selectedAddress.seasons.map(s => s.id).includes(season.id);
  }

  masterToggle() {
    if(this.isAllSelected()) {
      this.selection.clear();
      this.selectedAddresses = [];
    } else {
      this.addresses.forEach(a => this.markSelected(true, a, this.seasons.slice(0)));
    }
  }

  isAllSelected(): boolean {
    for(let a of this.addresses) {
      let index = this.selectedAddresses.map(a => a.address.id).indexOf(a.id);
      if(index < 0) {
        return false;
      }
    }
    return true;
  }

  isSelected(address: SimpleAddress): boolean {
    return this.selectedAddresses.map(a => a.address.id).includes(address.id);
  }

  selectSeason(address: SimpleAddress, season: Season, event: MatButtonToggleChange) {
    let checked = event && event.source ? event.source.checked : false;
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    let selectedAddress = this.selectedAddresses[index];
    if(checked) {
      if(index < 0) {
        this.markSelected(true, address, [season]);
      } else {
        selectedAddress.seasons.push(season);
      }
    } else {
      if(index > -1 ) {
        let i = selectedAddress.seasons.map(s => s.id).indexOf(season.id);
        selectedAddress.seasons.splice(i, 1);
      }
    }
    index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    selectedAddress = this.selectedAddresses[index];
    if(selectedAddress.seasons.length == 0 && selectedAddress.emptyColumnsCount == 0) {
      this.markSelected(false, address, []);
    }
  }

  prepareSelectedAddresses(): SelectedAddressDto[] {
    let result = [];
    this.selectedAddresses.forEach(a => {
      let dto = {
        addressId: a.address.id,
        seasons: a.seasons.map(s => s.id),
        emptyColumnsCount: a.emptyColumnsCount
      };
      result.push(dto);
    });
    return result;
  }

  addEmptyColumn(address: SimpleAddress) {
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    if(index > -1) {
      this.selectedAddresses[index].emptyColumnsCount++;
    }
    else {
      this.markSelected(true, address, []);
      let i = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
      this.selectedAddresses[i].emptyColumnsCount++;
    }
  }

  removeEmptyColumn(address: SimpleAddress) {
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    if(index > -1) {
      this.selectedAddresses[index].emptyColumnsCount--;
    }
  }

  mapNumberOfEmptyColumnsToCollection(address: SimpleAddress): number[] {
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    if(index > -1) {
      return Array(this.selectedAddresses[index].emptyColumnsCount).fill(1);
    }
    return [];
  }

  removeSelectedAddress(selectedAddress: SelectedAddress): void {
    this.markSelected(false, selectedAddress.address, this.seasons.slice(0));
  }

  private sortAddresses(): void {
    this.selectedAddresses = this.selectedAddresses.sort((a1, a2) => {
      let name1 = a1.address.prefix + ' ' + a1.address.streetName;
      let name2 = a2.address.prefix + ' ' + a2.address.streetName;

      if(name1.localeCompare(name2) == 0) {
        let num1 = parseInt(a1.address.blockNumber);
        let num2 = parseInt(a2.address.blockNumber);

        if(num1 > num2) return 1;
        if(num1 == num2) return 0;
        if(num1 < num2) return -1;
      }
      return name1.localeCompare(name2);
    })
  }
}
