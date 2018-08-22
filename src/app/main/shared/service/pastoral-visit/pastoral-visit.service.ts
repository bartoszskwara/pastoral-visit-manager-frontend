import {Injectable} from '@angular/core';
import {catchError} from "rxjs/internal/operators";
import {Observable, of} from "rxjs/index";
import {PastoralVisit} from "../../model/PastoralVisit";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {BaseService} from "../../message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class PastoralVisitService extends BaseService {

  private pastoralVisitUrl = `${environment.server.url}/pastoral-visit`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar)
  }

  savePastoralVisit(data: PastoralVisit, httpOptions: object): Observable<PastoralVisit> {
    return this.http.post<PastoralVisit>(this.pastoralVisitUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError<PastoralVisit>("saving pastoral visit", new PastoralVisit()))
      );
  }
}
