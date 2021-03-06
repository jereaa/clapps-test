import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { TaskListModel } from './models/task-list.model';
import { ENV } from './env.config';
import { TaskModel } from './models/task.model';

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
        catchError(this._errorHandler)
      );
  }

  createList(taskList: TaskListModel): Observable<TaskListModel> {
    return this.http.post<TaskListModel>(`${ENV.BASE_API}lists/${this.auth.userId}`, taskList)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  getList(id: string): Observable<TaskListModel> {
    return this.http.get<TaskListModel>(`${ENV.BASE_API}lists/${this.auth.userId}/${id}`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  editList(id: string, taskList: TaskListModel): Observable<TaskListModel> {
    return this.http.put<TaskListModel>(`${ENV.BASE_API}lists/${this.auth.userId}/${id}`, taskList)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  deleteList(id: string): Observable<any> {
    return this.http.delete(`${ENV.BASE_API}lists/${this.auth.userId}/${id}`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  createTask(listId: string, task: TaskModel): Observable<TaskModel> {
    return this.http.post<TaskModel>(`${ENV.BASE_API}lists/${this.auth.userId}/${listId}/newTask`, task)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  editTask(listId: string, taskId: string, task: TaskModel): Observable<TaskModel> {
    return this.http.put<TaskModel>(`${ENV.BASE_API}lists/${this.auth.userId}/${listId}/${taskId}`, task)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  deleteTask(listId: string, taskId: string): Observable<any> {
    return this.http.delete(`${ENV.BASE_API}lists/${this.auth.userId}/${listId}/${taskId}`)
      .pipe(
        catchError(this._errorHandler)
      );
  }

  private _errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error has accurred: ', error.error.message);
      return throwError('Can\'t retrieve task lists. Check internet connection.');
    }
    console.error(`Backend returned code ${error.status}, body was ${error.error.message}`);
    return throwError('Oops. Seems something went wrong...');
  }
}
