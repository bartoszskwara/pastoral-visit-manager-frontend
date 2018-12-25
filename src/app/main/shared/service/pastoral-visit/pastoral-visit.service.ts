import {Injectable} from '@angular/core';
import {catchError} from "rxjs/internal/operators";
import {Observable, of} from "rxjs/index";
import {PastoralVisit} from "../../model/PastoralVisit";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {BaseService} from "../../message/base.service";
import {MatSnackBar} from "@angular/material";
import {CountResponse} from "../../model/CountResponse";

@Injectable({
  providedIn: 'root'
})
export class PastoralVisitService extends BaseService {

  private pastoralVisitUrl = `${environment.server.url}/pastoral-visit`;

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar)
  }

  savePastoralVisit(data: PastoralVisit): Observable<PastoralVisit> {
    return this.http.post<PastoralVisit>(this.pastoralVisitUrl, data, this.getApplicationJsonHeaders())
      .pipe(
        catchError(this.handleError<PastoralVisit>("saving pastoral visit", new PastoralVisit()))
      );
  }

  countCompletedPastoralVisitsInLastSeason(addressId: number): Observable<CountResponse> {
    return this.http.get<CountResponse>(`${this.pastoralVisitUrl}/address/${addressId}/season/last/completed`, this.getApplicationJsonHeaders())
      .pipe(
        catchError(this.handleError<CountResponse>("counting completed visits in last season", new CountResponse()))
      );
  }

  private getApplicationJsonHeaders(): object {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }
}
