import {Injectable} from '@angular/core';
import {Season} from "../../model/Season";
import {environment} from "../../../../../environments/environment";
import {catchError} from "rxjs/internal/operators";
import {Observable, of} from "rxjs/index";
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../../message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class SeasonService extends BaseService {

  private seasonUrl = `${environment.server.url}` + "/season";

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar);
  }

  fetchSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this.seasonUrl)
      .pipe(
        catchError(this.handleError<Season[]>("fetching seasons", []))
      );
  }
}
