import {Component, OnInit, ViewChild} from '@angular/core';
import {ImportService} from "./import-service/import-service.service";
import {Priest} from "../shared/model/Priest";
import {FormControl, Validators} from "@angular/forms";
import {AddressFormComponent} from "../address/address-form/address-form.component";
import {PriestService} from "../shared/service/priest/priest.service";
import {AddressService} from "../address/service/address.service";
import {Observable, of} from "rxjs/index";
import {map, startWith, tap} from "rxjs/internal/operators";
import {SimpleAddress} from "../home/model/SimpleAddress";
import {DragAndDropComponent} from "./drag-and-drop/drag-and-drop.component";

export class ImportRequestFormControl {
  prefix: FormControl;
  streetName: FormControl;
  blockNumber: FormControl;
  priestId: number;
}

export interface FilteredOptions {
  streetName: Observable<string[]>,
  blockNumber: Observable<string[]>
}

@Component({
  selector: 'bulk-import',
  templateUrl: './bulk-import.component.html',
  styleUrls: ['./bulk-import.component.scss']
})
export class BulkImportComponent implements OnInit {

  private importRequestFile: File = null;
  loading: boolean = false;
  streetNames: string[] = [];
  blockNumbers: string[] = [];
  filteredOptions: FilteredOptions = {
    streetName: of([]),
    blockNumber: of([])
  };
  private addresses: SimpleAddress[] = [];
  @ViewChild(DragAndDropComponent) dragAndDrop;

  importRequestFormControl: ImportRequestFormControl = {
    prefix: new FormControl('', [Validators.required]),
    streetName: new FormControl('', [Validators.required]),
    blockNumber: new FormControl('', [Validators.required]),
    priestId: this.getCurrentLoggedPriestId()
  };

  priests: Priest[] = [];

  constructor(private importService: ImportService, private addressService: AddressService, private priestService: PriestService) { }

  ngOnInit() {
    this.getAvailablePriests();
    this.getAddresses();
    this.filteredOptions.streetName = this.importRequestFormControl.streetName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterStreetName(value)),
        tap(() => this.updateBlockNumbers()),
        tap(() => this.updatePrefix())
      );
    this.filteredOptions.blockNumber = this.importRequestFormControl.blockNumber.valueChanges
      .pipe(
        tap(() => this.updateBlockNumbers()),
        startWith(''),
        map(value => this._filterBlockNumber(value))
      );
  }

  send(): void {
    if(!this.isImportRequestValid()) {
      return;
    }
    let data = this.prepareData();
    this.loading = true;
    this.importService.bulkImport(data)
      .subscribe(
        response => {
        },
        error => {
          this.loading = false;
          console.log('error', error);
        },
        () => {
          this.loading = false;
          this.resetAll();
        });
  }

  private getAddresses(): void {
    this.addressService.fetchAllAddresses()
      .subscribe(
        response => {
          this.addresses = response;
        },
        error => {
          console.log('error', error);
        },
        () => {
          this.streetNames = this.getStreetNames();
        });
  }

  private getStreetNames(): string[] {
    let names = this.addresses.map(a => a.streetName);
    return Array.from(new Set(names));
  }

  private prepareData(): FormData {
    const data: FormData = new FormData();
    data.append('file', this.importRequestFile);
    data.append('prefix', this.importRequestFormControl.prefix.value);
    data.append('streetName', this.importRequestFormControl.streetName.value);
    data.append('blockNumber', this.importRequestFormControl.blockNumber.value);
    data.append('priestId', String(this.importRequestFormControl.priestId));
    return data;
  }

  fileUploaded(file: File) {
    this.importRequestFile = file;
  }

  getAvailablePriests(): void {
    this.priestService.fetchPriests()
      .subscribe(priests => {
          this.priests = priests;
        },
        error => {
          console.log('error', error);
        },
        () => {}
      );
  }

  private getCurrentLoggedPriestId(): number {
    //TODO
    return 3;
  }

  getStreetNameErrorMessage(): string {
    return BulkImportComponent.getRequiredErrorMessage(this.importRequestFormControl.streetName);
  }
  getBlockNumberErrorMessage(): string {
    return BulkImportComponent.getRequiredErrorMessage(this.importRequestFormControl.blockNumber);
  }
  private static getRequiredErrorMessage(control: FormControl): string {
    return control.hasError('required') ? 'You must enter a value' : '';
  }

  private resetAll(): void {
    this.importRequestFormControl.prefix.reset();
    this.importRequestFormControl.streetName.reset();
    this.importRequestFormControl.blockNumber.reset();
    this.importRequestFormControl.priestId = this.getCurrentLoggedPriestId();
    this.importRequestFile = null;
    this.dragAndDrop.resetFile();
  }

  private _filterStreetName(value: string): string[] {
    if(value == null) {
      return this.streetNames;
    }
    const filterValue = value.toLowerCase();
    return this.streetNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterBlockNumber(value: string): string[] {
    if(value == null) {
      return this.blockNumbers;
    }
    const filterValue = value.toLowerCase();
    return this.blockNumbers.filter(option => option.toLowerCase().includes(filterValue));
  }

  updateBlockNumbers(): void {
    let streetName = this.importRequestFormControl.streetName.value;
    this.blockNumbers = this.addresses.filter(a => a.streetName == streetName).map(a => a.blockNumber);
  }

  updatePrefix(): void {
    let streetName = this.importRequestFormControl.streetName.value;
    let prefixes = this.addresses.filter(a => a.streetName == streetName).map(a => a.prefix);
    if(prefixes.length > 0) {
      let prefix = prefixes[0];
      this.importRequestFormControl.prefix.setValue(prefix);
    }
  }

  private isImportRequestValid(): boolean {
    return this.importRequestFormControl.streetName.valid
    && this.importRequestFormControl.blockNumber.valid
    && this.importRequestFormControl.priestId >= 0
    && this.importRequestFile != null;
  }
}
