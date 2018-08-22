import {Injectable} from '@angular/core';
import {environment} from "../../../../../environments/environment";

export class PastoralVisitStatus {
  completed: string;
  refused: string;
  absent: string;
  individually: string;
  not_requested: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() { }

  pastoralVisitStatus(): PastoralVisitStatus {
    return environment.pastoralVisit.status;
  }

  dateFormat(): string {
    return environment.dateFormat;
  }

  serverUrl(): string {
    return environment.server.url;
  }
}
