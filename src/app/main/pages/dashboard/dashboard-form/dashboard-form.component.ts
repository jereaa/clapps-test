import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TaskListModel } from 'src/app/core/models/task-list.model';

@Component({
  selector: 'app-dashboard-form',
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.scss']
})
export class DashboardFormComponent implements OnInit {
  isEdit: boolean;

  // Form and model
  taskListForm: FormGroup;
  taskList: TaskListModel;

  // Form validation and errors
  // formErrors: any;
  formChangeSub: Subscription;

  // Form submission
  submitTaskListSub: Subscription;
  error: boolean;
  submitting: boolean;
  submitBtnText: string;

  // Form min/max characters
  titleMin = 4;
  titleMax = 30;
  descMin = 10;
  descMax = 140;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.submitBtnText = this.isEdit ? 'Update list' : 'Create list';
    this.isEdit = !!this.taskList;
    this.taskList = this._setFormData();
    this._buildForm();
  }

  private _setFormData(): TaskListModel {
    if (!this.isEdit) {
      return new TaskListModel(null, null, null, null);
    } else {
      return new TaskListModel(
        this.taskList.title,
        this.taskList.description,
        this.taskList.users,
        this.taskList.tasks,
        this.taskList ? this.taskList._id : null
      );
    }
  }

  private _buildForm() {
    this.taskListForm = this.fb.group({
      title: [this.taskList.title, [
        Validators.required,
        Validators.minLength(this.titleMin),
        Validators.maxLength(this.titleMax)
      ]],
      description: [this.taskList.description, [
        Validators.required,
        Validators.minLength(this.descMin),
        Validators.maxLength(this.descMax)
      ]]
    });

    // Subscribe to form value changes
    this.formChangeSub = this.taskListForm.valueChanges.subscribe((data) => this._onValueChanged(data));

    // In case we are editing a list,
    // trigger immediate validation by marking
    // fields as dirty in case field is no longer valid
    if (this.isEdit) {
      for (const key in this.taskListForm.controls) {
        if (this.taskListForm.controls.hasOwnProperty(key)) {
          this.taskListForm.controls[key].markAsDirty();
        }
      }
    }

    this._onValueChanged();
  }

  private _onValueChanged(data?: any): void {
    if (!this.taskListForm) {
      return;
    }
  }

}
