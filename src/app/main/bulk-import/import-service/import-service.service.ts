import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/internal/operators";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs/index";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class ImportService extends BaseService {

  private addressUrl = `${environment.server.url}/import/address`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar);
  }

  bulkImport(data: object) : Observable<String> {
    return this.http.post<String>(this.addressUrl, data)
      .pipe(
        catchError(this.handleError<String>("import addresses", ""))
      );
  }
}
