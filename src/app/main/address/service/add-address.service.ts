import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable, of} from "rxjs/index";
import {Address} from "../../shared/model/Address";
import {catchError} from "rxjs/internal/operators";
import {AddressDto} from "../../shared/model/AddressDto";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class AddAddressService extends BaseService {

  private addressUrl = `${environment.server.url}/address`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar)
  }

  public save(address: AddressDto): Observable<Address> {
    return this.http.post<Address>(this.addressUrl, address, AddAddressService.getApplicationJsonHeaders())
      .pipe(
        catchError(this.handleError<Address>("saving new address", new Address()))
      );
  }

  private static getApplicationJsonHeaders(): object {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }
}
