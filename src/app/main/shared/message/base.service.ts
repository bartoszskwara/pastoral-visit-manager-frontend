import {MatSnackBar} from "@angular/material";
import {Observable, of} from "rxjs/index";

export class BaseService {

  constructor(public snackBar: MatSnackBar) {}

  showMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if(error.status == 0) {
        this.showMessage('Connection error', 'Cancel');
      } else if(error.status == 500) {
        this.showMessage('Internal server error', 'Cancel');
      } else if(error.status == 400) {
        this.showMessage('Bad request', 'Cancel');
      } else if(error.status == 404) {
        this.showMessage('Not found', 'Cancel');
      }

      let message = error.message ? error.message : 'Unexpected error';
      return of(result as T);
    };
  }
}
