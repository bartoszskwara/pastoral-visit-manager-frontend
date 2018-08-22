import {Component, Input, OnInit} from '@angular/core';
import {ExportAddressService} from "./service/export-address.service";

@Component({
  selector: 'export-address',
  templateUrl: './export-address.component.html',
  styleUrls: ['./export-address.component.scss']
})
export class ExportAddressComponent implements OnInit {

  @Input() addressId: number;

  constructor(private exportService: ExportAddressService) { }

  ngOnInit() {
  }

  exportToCsv(): void {
    this.exportService.exportToCsv(this.addressId)
      .subscribe(res => {
        let blob = new Blob([res], { type: 'text/csv' });
        let url= window.URL.createObjectURL(blob);
        window.open(url);
      }, error => {
        console.log('download error', error);
      }, () => {
      });
  }

}
