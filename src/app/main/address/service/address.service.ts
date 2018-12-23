import { Injectable } from '@angular/core';
import {catchError, tap} from "rxjs/internal/operators";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Address} from "../../shared/model/Address";
import {environment} from "../../../../environments/environment";
import {Observable, of} from "rxjs/index";
import {SimpleAddress} from "../../home/model/SimpleAddress";
import {Page} from "../../shared/model/Page";
import {Chunk} from "../../shared/model/Chunk";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class AddressService extends BaseService {

  private addressUrl = `${environment.server.url}/address`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar);
  }

  fetchAddresses(offset: number, limit: number, name: string) : Observable<Chunk<SimpleAddress>> {
    let params = new HttpParams()
      .append('offset', offset ? offset.toString() : '0')
      .append('limit', limit ? limit.toString() : '0')
      .append('name', name);
    return this.http.get<Chunk<SimpleAddress>>(`${this.addressUrl}/chunk`, {params: params})
      .pipe(
        catchError(this.handleError<Chunk<SimpleAddress>>("get addresses chunk", new Chunk()))
      );
  }

  fetchAllAddresses() : Observable<SimpleAddress[]> {
    return this.http.get<SimpleAddress[]>(this.addressUrl)
      .pipe(
        catchError(this.handleError<SimpleAddress[]>("get addresses", []))
      );
  }
}
