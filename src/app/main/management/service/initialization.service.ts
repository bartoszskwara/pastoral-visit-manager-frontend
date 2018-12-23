import { Injectable } from '@angular/core';
import {catchError} from "rxjs/internal/operators";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {environment} from "../../../../environments/environment";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class InitializationService extends BaseService {

  private addressUrl = `${environment.server.url}/initialize`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar)
  }
  public basicCall(endpoint: string = ''): Observable<any> {
    return this.http.get<any>(`${this.addressUrl}${endpoint}`)
      .pipe(
        catchError(this.handleError<any>("initialization error", ""))
      );
  }
}
