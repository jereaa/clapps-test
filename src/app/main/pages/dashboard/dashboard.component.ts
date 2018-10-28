import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { ApiService } from 'src/app/core/api.service';
import { TaskListModel } from 'src/app/core/models/task-list.model';
import { DashboardFormComponent } from './dashboard-form/dashboard-form.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild(DashboardFormComponent)
  private formComponent: DashboardFormComponent;

  pageTitle = 'Dashboard';
  loading: boolean;
  error: boolean;
  deletingId: string;
  taskLists: TaskListModel[];

  deleteSub: Subscription;

  constructor(
    private title: Title,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.loading = true;

    this.api.getLists().subscribe(
      lists => {
        this.taskLists = lists;
        this.loading = false;
      },
      error => {
        this.error = true;
        this.loading = false;
        console.error('Error in front-end: ', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

  tasksNum(list: TaskListModel): number {
    return list.tasks ? list.tasks.length : 0;
  }

  onSubmittedList(e): void {
    if (!e.isEdit) {
      this.taskLists.push(e.list);
    } else {
      const index = this.taskLists.findIndex(elem => elem._id === e.list._id);
      this.taskLists.splice(index, 1, e.list);
    }
  }

  editList(taskList: TaskListModel): void {
    this.formComponent.editList(new TaskListModel(
      taskList.title,
      taskList.description,
      taskList.userIds.slice(),
      null,   // There's no need to send the tasks since the server won't touch them
      taskList._id
    ));
  }

  deleteList(taskList: TaskListModel): void {
    const index = this.taskLists.indexOf(taskList);

    this.deletingId = taskList._id;
    this.deleteSub = this.api
      .deleteList(taskList._id)
      .subscribe(
        () => {
          this.taskLists.splice(index, 1);
        },
        (error: Error) => {
          console.error('Error deleting list: ', error.message);
        },
        () => {
          this.deletingId = null;
        }
      );
  }

}
