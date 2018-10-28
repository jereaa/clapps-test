import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TaskListFormComponent } from './task-list-form/task-list-form.component';
import { ApiService } from 'src/app/core/api.service';
import { TaskListModel } from 'src/app/core/models/task-list.model';
import { TaskModel, ITaskStatusStrings, TASK_STATUS_STRINGS } from 'src/app/core/models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  @ViewChild(TaskListFormComponent)
  private taskForm: TaskListFormComponent;

  loading: boolean;
  error: boolean;

  routeSub: Subscription;
  id: string;
  taskList: TaskListModel;

  deletingId: string;
  deleteSub: Subscription;

  statusStrings: ITaskStatusStrings = TASK_STATUS_STRINGS;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.params
      .subscribe(params => {
        this.id = params['id'];
        this._getTaskList();
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

  onSubmittedTask(e): void {
    if (!e.isEdit) {
      if (!this.taskList.tasks) {
        this.taskList.tasks = [];
      }
      this.taskList.tasks.push(e.task);
    } else {
      const index = this.taskList.tasks.findIndex(elem => elem._id === e.task._id);
      this.taskList.tasks.splice(index, 1, e.task);
    }
  }

  formatText(unformatted: string): string {
    return unformatted.replace(/\n/g, '<br>');
  }

  editTask(task: TaskModel): void {
    this.taskForm.editTask(new TaskModel(
      task.title,
      task.description,
      task.status,
      task.order,
      task._id
    ));
  }

  deleteTask(task: TaskModel): void {
    const index = this.taskList.tasks.indexOf(task);

    this.deletingId = task._id;
    this.deleteSub = this.api
      .deleteTask(this.taskList._id, task._id)
      .subscribe(
        () => {
          this.taskList.tasks.splice(index, 1);
        },
        (error: Error) => {
          console.error('Error deleting list: ', error.message);
        },
        () => {
          this.deletingId = null;
        }
      );
  }

  private _getTaskList(): void {
    this.loading = true;
    this.api.getList(this.id).subscribe(
      (list: TaskListModel) => {
        this.taskList = list;
        this.title.setTitle(list.title);
      },
      (error: Error) => {
        this.error = true;
      },
      () => {
        this.loading = false;
      }
    );
  }

}
