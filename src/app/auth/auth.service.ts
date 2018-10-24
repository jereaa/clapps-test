import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { retry, catchError, map, delay } from 'rxjs/operators';

import { ENV } from '../core/env.config';

import { UserModel } from '../core/models/user.model';

export enum AuthErrorType {
  WRONG_USERNAME,
  NETWORK_ERROR
}

export class AuthError implements Error {
  name = 'AuthError';
  message = 'There was an error when trying to authenticate.';
  type: AuthErrorType;

  constructor(type: AuthErrorType) {
    this.type = type;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  loggedUser: string;

  constructor(private http: HttpClient) { }

  login(username: string): Observable<UserModel> {
    return this.http.post<UserModel>(`${ENV.BASE_API}login`, { username: username })
      .pipe(
        // retry(3),
        delay(2000),
        map(user => {
          if (user) {
            this.isLoggedIn = true;
            this.loggedUser = user.username;
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          return user;
        }),
        catchError(this._errorHandler)
      );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.loggedUser = undefined;
    localStorage.removeItem('currentUser');
  }

  private _errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side network error occurred
      console.error('An error occurred:', error.error.message);
      return throwError(new AuthError(AuthErrorType.NETWORK_ERROR));
    } else {
      // Backend didn't return status 200
      console.error(`Backend returned code ${error.status}, body was ${error.error}`);
      return throwError(new AuthError(AuthErrorType.WRONG_USERNAME));
    }
  }
}
