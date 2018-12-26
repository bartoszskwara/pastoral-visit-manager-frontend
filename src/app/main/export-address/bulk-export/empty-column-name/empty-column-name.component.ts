import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleAddress} from "../../../home/model/SimpleAddress";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";
import {EmptyColumn} from "../../model/EmptyColumn";

@Component({
  selector: 'empty-column-name',
  templateUrl: './empty-column-name.component.html',
  styleUrls: ['./empty-column-name.component.scss']
})
export class EmptyColumnNameComponent implements OnInit {

  @Input() address: SimpleAddress;
  @Output() nameChanged = new EventEmitter<EmptyColumn>();
  @Output() removed = new EventEmitter<EmptyColumn>();
  _clearEmptyColumns: boolean;


  emptyColumns: EmptyColumn[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() {
  }

  ngOnInit() {
  }

  fireEvent(emptyColumn: EmptyColumn) {
    this.nameChanged.emit(emptyColumn);
  }

  addEmptyColumn(event: MatChipInputEvent) {
    if(this.isEventValueEmpty(event)) {
      event.input.value = null;
      return;
    }
    let emptyColumn = {
      id: this.emptyColumns.length + 1,
      addressId: this.address.id,
      name: event.value.trim()
    };
    this.emptyColumns.push(emptyColumn);
    if(event.input) {
      event.input.value = null;
    }
    this.fireEvent(emptyColumn);
  }

  removeEmptyColumn(column: EmptyColumn) {
    let emptyColumn = this.emptyColumns.filter(c => c.id == column.id)[0];
    let index = this.emptyColumns.indexOf(emptyColumn);
    this.emptyColumns.splice(index, 1);
    this.removed.emit(column);
  }

  isEventValueEmpty(event: MatChipInputEvent) {
    return !event || !event.value || (event.value && !event.value.trim());
  }

  get clearEmptyColumns(): boolean {
    return this._clearEmptyColumns;
  }

  @Input('clearEmptyColumns')
  set clearEmptyColumns(value: boolean) {
    this._clearEmptyColumns = value;
    if(value) {
      this.emptyColumns = [];
    }
  }
}
