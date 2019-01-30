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
import {EmptyColumn} from "../model/EmptyColumn";
import {animate, state, style, transition, trigger} from '@angular/animations';

export interface Filter {
  name: string;
}

export class SelectedAddress {
  address: SimpleAddress;
  seasons: Season[];
  emptyColumns: EmptyColumn[];
}

@Component({
  selector: 'bulk-export',
  templateUrl: './bulk-export.component.html',
  styleUrls: ['./bulk-export.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BulkExportComponent implements OnInit {

  private readonly INITIAL_LIMIT: number = 20;
  addresses: SimpleAddress[] = [];
  loading: boolean;
  limit: number;
  offset: number;
  displayedColumns: string[] = ['select', 'address', 'season'];
  filter: Filter;
  selection = new SelectionModel<SimpleAddress>(true, []);
  selectedAddresses: SelectedAddress[] = [];
  seasons: Season[];
  expandedAddress: SimpleAddress = null;

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
    this.loading = true;
    this.exportService.exportBulkCsv(this.prepareSelectedAddresses())
      .subscribe(res => {
        let blob = new Blob([res], { type: 'application/zip' });
        let url= window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        this.loading = false;
        console.log('download error:', error);
      }, () => {
        this.loading = false;
      });
  }

  exportPdf(): void {
    this.loading = true;
    this.exportService.exportBulkPdf(this.prepareSelectedAddresses())
      .subscribe(res => {
        let blob = new Blob([res], { type: 'application/zip' });
        let url= window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        this.loading = false;
        console.log('download error:', error);
      }, () => {
        this.loading = false;
      });
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
  }

  static createSelectedAddress(address: SimpleAddress, seasons: Season[]): SelectedAddress {
    return {
      address: address,
      seasons: seasons,
      emptyColumns: []
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

  toggleCurrentFetched() {
    if(this.isAllSelected()) {
      this.selection.clear();
      this.selectedAddresses = [];
    } else {
      this.addresses.forEach(a => {
        let seasons = this.getNotCurrentSeasons();
        let selectedAddress = this.selectedAddresses.filter(sa => sa.address.id == a.id);
        if(selectedAddress && selectedAddress.length > 0) {
          let currentSeason = selectedAddress[0].seasons.filter(s => s.current);
          if(currentSeason && currentSeason.length > 0) {
            seasons.push(currentSeason[0]);
          }
        }
        this.markSelected(true, a, seasons);
      });
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
    if(selectedAddress.seasons.length == 0 && selectedAddress.emptyColumns.length == 0) {
      this.markSelected(false, address, []);
    }
  }

  prepareSelectedAddresses(): SelectedAddressDto[] {
    let result: SelectedAddressDto[] = [];
    this.selectedAddresses.forEach(a => {
      result.push({
        addressId: a.address.id,
        seasons: a.seasons.map(s => s.id),
        emptyColumns: a.emptyColumns
      });
    });
    return result;
  }

  removeEmptyColumn(address: SimpleAddress, column: EmptyColumn) {
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(address.id);
    if (index > -1) {
      let columnIndex = this.selectedAddresses[index].emptyColumns.map(c => c.id).indexOf(column.id);
      this.selectedAddresses[index].emptyColumns.splice(columnIndex, 1);
      if(this.selectedAddresses[index].emptyColumns.length == 0 && this.selectedAddresses[index].seasons.length == 0) {
        this.markSelected(false, address, []);
      }
    }
  }

  countEmptyColumns(address: SimpleAddress): number {
    if(this.selectedAddresses == null || address == null) {
      return 0;
    }
    let selectedAddress = this.selectedAddresses.filter(a => a.address.id == address.id);
    if(selectedAddress != null && selectedAddress.length > 0 && selectedAddress[0].emptyColumns != null) {
      return selectedAddress[0].emptyColumns.length;
    } else {
      return 0;
    }
  }

  removeSelectedAddress(selectedAddress: SelectedAddress): void {
    this.markSelected(false, selectedAddress.address, this.seasons.slice(0));
  }

  public toggleExpandedAddress(address: SimpleAddress): void {
    if(this.expandedAddress != null && this.expandedAddress.id == address.id) {
      this.expandedAddress = null;
    } else {
      this.expandedAddress = address;
    }
  }

  public emptyColumnNameChanged(address: SimpleAddress, column: EmptyColumn): void {
    let index = this.selectedAddresses.map(a => a.address.id).indexOf(column.addressId);
    if(index < 0) {
      this.markSelected(true, address, []);
    }
    let selectedAddress = this.selectedAddresses.filter(sa => sa.address.id == address.id)[0];
    let emptyColumnsById = selectedAddress.emptyColumns.filter(c => c.id == column.id);
    if(emptyColumnsById == null || emptyColumnsById.length == 0) {
      selectedAddress.emptyColumns.push(column);
    } else {
      emptyColumnsById[0] = column;
    }
  }

  public emptyColumnNamesByAddress(address: SimpleAddress): string {
    let message: string[] = [];
    let selectedAddress = this.selectedAddresses.filter(a => a.address.id == address.id);
    if(selectedAddress && selectedAddress.length > 0) {
      selectedAddress[0].emptyColumns.forEach(c => message.push(c.name));
      return message.join(', ');
    }
    return null;
  }

  public isSeasonCheckedInAllSelectedAddresses(season: Season): boolean {
    if(!this.selectedAddresses || this.selectedAddresses.length == 0) {
      return false;
    }

    let addressesWithoutSeason = this.selectedAddresses.filter(a => {
      if(!a.seasons || a.seasons.length == 0) {
        return true;
      } else {
        return a.seasons.filter(s => s.id == season.id).length <= 0;
      }
    });
    return addressesWithoutSeason.length == 0 && (this.addresses && this.selectedAddresses.length == this.addresses.length);
  }

  public isSeasonCheckedInSomeSelectedAddresses(season: Season): boolean {
    if(!this.selectedAddresses || this.selectedAddresses.length == 0) {
      return false;
    }

    let addressesWithSeason = this.selectedAddresses.filter(a => {
      if(!a.seasons || a.seasons.length == 0) {
        return false;
      } else {
        return a.seasons.filter(s => s.id == season.id).length > 0;
      }
    });
    return addressesWithSeason.length > 0 && (this.addresses && addressesWithSeason.length < this.addresses.length);
  }

  public selectSeasonForAllAddresses(season: Season, event: MatButtonToggleChange) {
    if(!event || !event.source) {
      return;
    }
    this.addresses.forEach(a => {
      let seasons: Season[] = [season];
      let selectedAddress = this.selectedAddresses.filter(sa => sa.address.id == a.id);
      if(selectedAddress && selectedAddress.length > 0) {
        if(event.source.checked) {
          seasons = Array.from(new Set(seasons.concat(selectedAddress[0].seasons)));
        } else {
          let containsSeason = selectedAddress[0].seasons.map(s => s.id).includes(season.id);
          if(containsSeason) {
            let index = selectedAddress[0].seasons.indexOf(season);
            selectedAddress[0].seasons.splice(index, 1);
            seasons = selectedAddress[0].seasons;
            this.removeSelectedAddress(selectedAddress[0]);
          }
        }
      }
      if(seasons && seasons.length > 0) {
        this.markSelected(true, a, seasons);
      }
    });
  }

  private sorted(addresses: SelectedAddress[]): SelectedAddress[] {
    return addresses.sort((a1, a2) => {
      let name1 = a1.address.prefix + a1.address.streetName;
      let name2 = a2.address.prefix + a2.address.streetName;
      let result = name1.localeCompare(name2);
      if(result != 0) {
        return result;
      }
      let num1 = parseInt(a1.address.blockNumber.replace( /\D+/g, ''));
      let num2 = parseInt(a2.address.blockNumber.replace( /\D+/g, ''));
      if(num1 - num2 != 0) {
        return num1 - num2;
      }
      let letter1 = a1.address.blockNumber.replace( /\d+/g, '');
      let letter2 = a2.address.blockNumber.replace( /\d+/g, '');
      return letter1.localeCompare(letter2);
    })
  }
}
