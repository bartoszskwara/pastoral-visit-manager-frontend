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

  private readonly INITIAL_SIZE: number = 20;
  addresses: SimpleAddress[] = [];
  loading: boolean;
  page: number;
  size: number;
  displayedColumns: string[] = ['select', 'address', 'season', 'add-empty-column'];
  filter: Filter;
  selection = new SelectionModel<SimpleAddress>(true, []);
  selectedAddresses: SelectedAddress[] = [];
  seasons: Season[];

  constructor(private addressService: AddressService, private seasonService: SeasonService, private exportService: ExportAddressService,
              private router: Router, private route: ActivatedRoute) {
    this.addresses = [];
    this.loading = false;
    this.page = 0;
    this.size = 5;
    this.filter = {
      name: ''
    };
  }

  ngOnInit() {
    this.getAddresses(this.page, this.INITIAL_SIZE, this.filter);
    this.getSeasons();
    this.page = this.INITIAL_SIZE / this.size;
  }

  private getChunk(): void {
    this.page = this.page + 1;
    this.getAddresses(this.page, this.size, this.filter);
  }

  private getAddresses(page: number, size: number, filter: Filter): void {
    this.loading = true;
    this.addressService.fetchAddresses(page, size, filter.name)
      .subscribe(
        response => {
          if(response.content) {
            this.addresses = this.addresses.concat(response.content);
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

  applyFilter(): void {
    this.loading = true;
    this.addressService.fetchAddresses(0, this.INITIAL_SIZE, this.filter.name)
      .subscribe(
        response => {
          this.addresses = response.content;
        },
        error => {
          console.log('error', error);
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }

  exportCsv(): void {
    this.exportService.exportBulkCsv(this.prepareSelectedAddresses())
      .subscribe(res => {
        let blob = new Blob([res], { type: 'application/zip' });
        let url= window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        console.log('download error:', error);
      }, () => {
      });
  }

  exportPdf(): void {
    this.exportService.exportBulkPdf(this.prepareSelectedAddresses())
      .subscribe(res => {
        let blob = new Blob([res], { type: 'application/zip' });
        let url= window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        console.log('download error:', error);
      }, () => {
      });
  }

  updateAllSelection(): void {
    this.selection.clear();
    this.selectedAddresses.forEach(a => this.selection.select(a.address));
  }

  select(event: MatCheckboxChange, address: SimpleAddress) {
    let checked = event ? event.checked : false;
    this.markSelected(checked, address, this.seasons.slice(0));
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
}
