import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { ApiService } from 'src/app/core/api.service';
import { TaskListModel } from 'src/app/core/models/task-list.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  loading: boolean;
  error: boolean;

  routeSub: Subscription;
  id: string;
  taskList: TaskListModel;

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
  }

  onSubmittedTask(e): void {
    if (!e.isEdit) {
      this.taskList.tasks.push(e.task);
    } else {
      const index = this.taskList.tasks.findIndex(elem => elem._id === e.task._id);
      this.taskList.tasks.splice(index, 1, e.task);
    }
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
