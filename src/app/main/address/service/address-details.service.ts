import {Injectable} from '@angular/core';
import {catchError} from "rxjs/internal/operators";
import {Observable, of} from "rxjs/index";
import {Address} from "../../shared/model/Address";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class AddressDetailsService extends BaseService {

  private addressUrl = `${environment.server.url}/address`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar)
  }

  fetchAddress(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.addressUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Address>("get address details", new Address()))
      );
  }
}
