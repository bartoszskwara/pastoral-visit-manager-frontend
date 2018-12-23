import { Component, OnInit } from '@angular/core';
import {InitializationService} from './service/initialization.service';


@Component({
  selector: 'management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {

   loading: {
     initialize: boolean,
     alejaPokoju: boolean
   };

   response: String = '';

  constructor(private initializationService: InitializationService) { }

  ngOnInit() {
      this.loading = {
        initialize: false,
        alejaPokoju: false
      }
  }

  private initialize() : void {
    this.loading.initialize = true;
    this.initializationService.basicCall()
      .subscribe(
        response => {
          this.response = response;
        },
        error => {
          this.loading.initialize = false;
          console.log('error', error);
        },
        () => {
          this.loading.initialize = false;
        });
  }

  private fixAlejaPokoju() : void {
    this.loading.alejaPokoju = true;
    this.initializationService.basicCall('/temp/aleja')
      .subscribe(
        response => {
          this.response = response.content;
        },
        error => {
          this.loading.alejaPokoju = false;
          console.log('error', error);
        },
        () => {
          this.loading.alejaPokoju = false;
        });
  }

}
