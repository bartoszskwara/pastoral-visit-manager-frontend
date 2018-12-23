import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {SimpleAddress} from "../../home/model/SimpleAddress";
import {SelectedAddress} from "../bulk-export/bulk-export.component";

@Component({
  selector: 'selected-addresses',
  templateUrl: './selected-addresses.component.html',
  styleUrls: ['./selected-addresses.component.scss']
})
export class SelectedAddressesComponent implements OnInit {

  @Input() selectedAddresses: SelectedAddress[];
  @Output() removed = new EventEmitter<SelectedAddress>();

  constructor() { }

  ngOnInit() { }

  tooltipMessage(address: SelectedAddress) {
    let message: string[] = [];
    address.seasons.forEach(s => message.push(s.name));
    let result = message.join(', ');
    return address.emptyColumnsCount > 0 ? result.concat(' + ').concat(`${address.emptyColumnsCount}`) : result;
  }

  removeSelectedAddress(address: SelectedAddress) {
    this.removed.emit(address);
  }
}
