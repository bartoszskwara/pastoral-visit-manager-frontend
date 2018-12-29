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
    address.seasons.sort((s1, s2) => s1.id - s2.id).forEach(s => message.push(s.name));
    address.emptyColumns.forEach(c => message.push(c.name));
    return message.join(', ');
  }

  removeSelectedAddress(address: SelectedAddress) {
    this.removed.emit(address);
  }
}
