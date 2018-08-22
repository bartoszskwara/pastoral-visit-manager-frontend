import { Injectable } from '@angular/core';
import {Address} from "../../shared/model/Address";
import {catchError} from "rxjs/internal/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs/index";
import {environment} from "../../../../environments/environment";
import {AddressDto} from "../../shared/model/AddressDto";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class EditAddressService extends BaseService {

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

  public save(addressId: number, address: AddressDto): Observable<Address> {
    return this.http.put<Address>(`${this.addressUrl}/${addressId}`, address, EditAddressService.getApplicationJsonHeaders())
      .pipe(
        catchError(this.handleError<Address>("editing address", new Address()))
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
