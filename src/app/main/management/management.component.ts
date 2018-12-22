import { Component, OnInit } from '@angular/core';
import {InitializationService} from './service/initialization.service';


@Component({
  selector: 'management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {

   loading: {
     initialize: boolean
   };

   response: String = '';

  constructor(private initializationService: InitializationService) { }

  ngOnInit() {
      this.loading = {
        initialize: false
      }
  }

  private initialize() : void {
    this.loading.initialize = true;
    this.initializationService.initialize()
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

}
