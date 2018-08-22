import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {AddressFormControl} from "./model/AddressFormControl";
import {MatChipInputEvent} from "@angular/material";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {Address} from "../../shared/model/Address";
import {AddressDto} from "../../shared/model/AddressDto";

@Component({
  selector: 'address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {

  @Input() address: Address;
  @Output() save = new EventEmitter<AddressDto>();

  defaultPrefix: string = 'ul.';
  separatorKeyCodes = [ENTER, COMMA, SPACE];
  addressData: AddressFormControl;

  constructor() { }

  ngOnInit() {
    if(this.address == null) {
      this.address = new Address();
    }
    let apartments = this.splitApartments();
    this.addressData = {
      prefix: {
        control: new FormControl(this.address.prefix, [Validators.required])
      },
      streetName: {
        control: new FormControl(this.address.streetName, [Validators.required])
      },
      blockNumber: {
        control: new FormControl(this.address.blockNumber, [Validators.required])
      },
      apartments: {
        range: parseInt(apartments.regular[apartments.regular.length - 1])
      },
      included: {
        control: new FormControl(''),
        chips: apartments.included
      },
      excluded: {
        control: new FormControl(''),
        chips: apartments.excluded
      }
    };
  }

  createChip(event: MatChipInputEvent, data: {control: FormControl; chips: string[]}): void {
    let value = (event.value || '').trim();
    if(value) {
      data.chips.push(value);
    }

    if (event.input) {
      event.input.value = '';
    }
  }

  removeChip(chip: string, chips: string[] ) {
    let i = chips.indexOf(chip);
    chips.splice(i, 1);
  }

  saveButtonClicked(addressData: AddressFormControl) {
    if(addressData.prefix.control.invalid || addressData.streetName.control.invalid || addressData.blockNumber.control.invalid
      || addressData.included.control.invalid || addressData.excluded.control.invalid) {
      return;
    }
    let data = AddressFormComponent.mapNewAddressDto(addressData);
    this.save.emit(data);
  }

  private static mapNewAddressDto(newAddress: AddressFormControl): AddressDto {
    let apartments = Array.from(Array(newAddress.apartments.range).keys()).map(i => (i+1).toString());
    for(let included of newAddress.included.chips) {
      apartments.push(included);
    }
    for(let excluded of newAddress.excluded.chips) {
      apartments.splice(apartments.indexOf(excluded), 1);
    }

    return {
      prefix: newAddress.prefix.control.value,
      streetName: newAddress.streetName.control.value,
      blockNumber: newAddress.blockNumber.control.value,
      apartments: apartments
    }
  }

  getStreetNameErrorMessage(): string {
    return AddressFormComponent.getRequiredErrorMessage(this.addressData.streetName.control);
  }
  getBlockNumberErrorMessage(): string {
    return AddressFormComponent.getRequiredErrorMessage(this.addressData.blockNumber.control);
  }
  private static getRequiredErrorMessage(control: FormControl): string {
    return control.hasError('required') ? 'You must enter a value' : '';
  }

  splitApartments(): {regular: string[], included: string[], excluded: string[]} {
    let regularApartemnts = [];
    let included = [];
    if(this.address.apartments == null) {
      return {regular: [], included: [], excluded: []}
    }
    for(let apartment of this.address.apartments) {
      if(AddressFormComponent.isRegularNumber(apartment.number)) {
        regularApartemnts.push(apartment.number);
      }
      else {
        included.push(apartment.number);
      }
    }
    let excluded = AddressFormComponent.getExcludedApartments(regularApartemnts);

    return {
      regular: regularApartemnts,
      included: included,
      excluded: excluded
    };
  }

  static isRegularNumber(value: string): boolean {
    let n = Math.floor(Number(value));
    return n !== Infinity && String(n) === value && n >= 0;
  }

  static getExcludedApartments(apartments: string[]): string[] {
    if(apartments == null || apartments.length == 0) {
      return [];
    }
    let apartmentNumbers: number[];
    apartmentNumbers = apartments.map(Number).sort((a,b) => a-b);

    let excluded = [];
    for(let i = 1; i < apartmentNumbers[0]; i++) {
      excluded.push(i);
    }
    for(let i = apartmentNumbers[0]; i <= apartmentNumbers[apartmentNumbers.length - 1]; i++) {
      if(!apartmentNumbers.includes(i)) {
        excluded.push(i);
      }
    }
    return excluded.map(i => i.toString());
  }
}
