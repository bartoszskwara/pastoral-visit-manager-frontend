import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError} from "rxjs/internal/operators";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs/index";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";
import {SelectedAddressDto} from "../../export-address/model/SelectedAddressDto";

@Injectable({
  providedIn: 'root'
})
export class ImportService extends BaseService {

  private addressUrl = `${environment.server.url}/import/address`;
  private templateUrl = `${environment.server.url}/import/template`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar);
  }

  bulkImport(data: object) : Observable<String> {
    return this.http.post<String>(this.addressUrl, data)
      .pipe(
        catchError(this.handleError<String>("import addresses", ""))
      );
  }

  downloadTemplate() : Observable<Blob> {
    return this.http.get<Blob>(this.templateUrl, this.getResponseTypeBlobOptions())
      .pipe(
        catchError(this.handleError<Blob>("download template", new Blob()))
      );
  }

  private getResponseTypeBlobOptions(): object {
    return {
      responseType: 'blob'
    };
  }
}
