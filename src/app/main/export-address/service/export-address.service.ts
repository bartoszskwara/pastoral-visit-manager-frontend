import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable, of} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {SelectedAddressDto} from "../model/SelectedAddressDto";
import {BaseService} from "../../shared/message/base.service";
import {MatSnackBar} from "@angular/material";
import {catchError} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class ExportAddressService extends BaseService {

  private exportUrl = `${environment.server.url}` + "/export";

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar);
  }

  exportToCsv(addressId: number): Observable<Blob> {
    return this.downloadFile(`${this.exportUrl}/address/${addressId}/format/csv`, this.getResponseTypeBlobOptions());
  }

  exportBulkCsv(data: SelectedAddressDto[]) {
    return this.http.post(`${this.exportUrl}/address/bulk/format/csv`, data, this.getResponseTypeBlobOptions())
      .pipe(
        catchError(this.handleError<Blob>("export addresses", new Blob()))
      );
  }

  exportBulkPdf(data: SelectedAddressDto[]) {
    return this.http.post(`${this.exportUrl}/address/bulk/format/pdf`, data, this.getResponseTypeBlobOptions())
      .pipe(
        catchError(this.handleError<Blob>("export addresses", new Blob()))
      );
  }

  downloadFile(url: string, options: object): Observable<Blob> {
    return this.http.get<Blob>(url, options)
      .pipe(
        catchError(this.handleError<Blob>("export addresses", new Blob()))
      );
  }

  private getResponseTypeBlobOptions(): object {
    return {
      responseType: 'blob'
    };
  }
}
