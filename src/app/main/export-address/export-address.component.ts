import {Component, Input, OnInit} from '@angular/core';
import {ExportAddressService} from "./service/export-address.service";
import {SelectedAddressDto} from "./model/SelectedAddressDto";
import {Season} from "../shared/model/Season";
import {SeasonService} from "../shared/service/season/season.service";

@Component({
  selector: 'export-address',
  templateUrl: './export-address.component.html',
  styleUrls: ['./export-address.component.scss']
})
export class ExportAddressComponent implements OnInit {

  @Input() addressId: number;
  @Input() seasons: Season[];

  constructor(private exportService: ExportAddressService) { }

  ngOnInit() {
  }

  exportToCsv(): void {
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

  exportToPdf(): void {
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

  prepareSelectedAddresses(): SelectedAddressDto[] {
    return [{
        addressId: this.addressId,
        seasons: this.seasons.map(s => s.id),
        emptyColumns: []
      }];
  }
}
