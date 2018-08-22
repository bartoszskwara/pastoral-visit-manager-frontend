import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AddressDto} from "../../shared/model/AddressDto";
import {FileChangeEvent} from "@angular/compiler-cli/src/perform_watch";

@Component({
  selector: 'drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {

  @Output() uploaded = new EventEmitter<File>();
  file: File = null;
  acceptedFormats: string[] = ['csv'];

  constructor() { }

  ngOnInit() {
  }

  emit(file: File) {
    if(file != null) {
      this.uploaded.emit(file);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer.items && event.dataTransfer.items.length == 1) {
      if (event.dataTransfer.items[0].kind === 'file') {
        let file = event.dataTransfer.items[0].getAsFile();
        this.emit(file);
        this.file = file;
      }
    } else if(event.dataTransfer.files.length == 1) {
      let file = event.dataTransfer.files[0];
      this.emit(file);
      this.file = file;
    } else {
      this.emit(null);
    }

    this.removeDragData(event)
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private removeDragData(event: DragEvent) {
    if (event.dataTransfer.items) {
      event.dataTransfer.items.clear();
    } else {
      event.dataTransfer.clearData();
    }
  }

  fileSelected(event: any) {
    if(event != null && event.target.files.length == 1) {
      let file = event.target.files[0];
      if(this.isAcceptedFormat(file.name)) {
        this.emit(file);
        this.file = file;
      }
    }
  }

  removeFile() {
    this.file = null;
  }

  isAcceptedFormat(filename: string): boolean {
    let format = filename.split(".").pop();
    for(let f of this.acceptedFormats) {
      if(format == f) {
        return true;
      }
    }
    return false;
  }

  resetFile(): void {
    this.file = null;
  }
}
