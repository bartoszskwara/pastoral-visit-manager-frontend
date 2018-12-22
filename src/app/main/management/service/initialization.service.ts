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
  public initialize(): Observable<String> {
    return this.http.get<String>(this.addressUrl)
      .pipe(
        catchError(this.handleError<String>("initialization error", ""))
      );
  }
}
