import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { TaskListModel } from './models/task-list.model';
import { ENV } from './env.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  getLists(): Observable<TaskListModel[]> {
    return this.http.get<TaskListModel[]>(`${ENV.BASE_API}lists/${this.auth.userId}`)
      .pipe(
        delay(2000),
        catchError(this._errorHandler)
      );
  }

  private _errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error has accurred: ', error.error.message);
      return throwError('Can\'t retrieve task lists. Check internet connection.');
    }
    console.error(`Backend returned code ${error.status}, body was ${error.error}`);
    return throwError('Oops. Seems something went wrong...');
  }
}
