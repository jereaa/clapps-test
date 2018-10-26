import { Component, OnInit, Input } from '@angular/core';

import { TaskListModel } from 'src/app/core/models/task-list.model';

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss']
})
export class TaskListItemComponent implements OnInit {
  @Input() taskList: TaskListModel;

  constructor() { }

  ngOnInit() {
  }

}
