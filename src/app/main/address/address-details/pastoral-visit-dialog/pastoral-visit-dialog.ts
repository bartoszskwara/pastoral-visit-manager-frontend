import {Component, Inject} from "@angular/core";
import {MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Moment} from "moment";
import {Priest} from "../../../shared/model/Priest";

export interface DialogData {
  priestId: number;
  date: string;
  startDate: Moment;
  availablePriests: Priest[];
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm',
    monthYearLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'pastoral-visit-dialog',
  templateUrl: 'pastoral-visit-dialog.html',
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PastoralVisitDialog {

  constructor(
    public dialogRef: MatDialogRef<PastoralVisitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
