import {Injectable} from '@angular/core';
import {catchError} from "rxjs/internal/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {Priest} from "../../model/Priest";
import {Observable, of} from "rxjs/index";
import {BaseService} from "../../message/base.service";
import {MatSnackBar} from "@angular/material";

@Injectable({
  providedIn: 'root'
})
export class PriestService extends BaseService {

  private priestUrl = `${environment.server.url}` + "/priest";

  constructor(public snackBar: MatSnackBar, private http: HttpClient) {
    super(snackBar);
  }

  fetchPriests(): Observable<Priest[]> {
    return this.http.get<Priest[]>(this.priestUrl)
      .pipe(
        catchError(this.handleError<Priest[]>("fetching priests", []))
      );
  }
}
