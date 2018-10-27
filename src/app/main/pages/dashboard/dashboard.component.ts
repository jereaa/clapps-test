import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ApiService } from 'src/app/core/api.service';
import { TaskListModel } from 'src/app/core/models/task-list.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pageTitle = 'Dashboard';
  loading: boolean;
  error: boolean;
  taskLists: TaskListModel[];

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

  onSubmittedList(e): void {
    if (!e.isEdit) {
      this.taskLists.push(e.list);
    } else {
      const index = this.taskLists.findIndex(elem => elem._id === e.list._id);
      this.taskLists.splice(index, 1);
    }
  }

}
