import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TaskListModel } from 'src/app/core/models/task-list.model';
import { ApiService } from 'src/app/core/api.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard-form',
  templateUrl: './dashboard-form.component.html',
  styleUrls: ['./dashboard-form.component.scss']
})
export class DashboardFormComponent implements OnInit, OnDestroy {
  @Output() submittedList = new EventEmitter();
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
  titleMax = 20;
  descMin = 10;
  descMax = 140;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.submitBtnText = this.isEdit ? 'Update list' : 'Create list';
    this.isEdit = !!this.taskList;
    this.taskList = this._setFormData();
    this._buildForm();
  }

  ngOnDestroy() {
    this.submitTaskListSub.unsubscribe();
  }

  private _setFormData(): TaskListModel {
    if (!this.isEdit) {
      return new TaskListModel(null, null, null);
    } else {
      return new TaskListModel(
        this.taskList.title,
        this.taskList.description,
        this.taskList.userIds,
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

  resetForm(): void {
    this.taskListForm.reset();
    this.isEdit = false;
    this.taskList = new TaskListModel(null, null, null);
  }

  private _onValueChanged(data?: any): void {
    if (!this.taskListForm) {
      return;
    }
  }

  get f() {
    return this.taskListForm.controls;
  }

  submitForm(formDirective: FormGroupDirective): void {
    if (this.taskListForm.invalid) {
      return;
    }

    this.taskList.title = this.taskListForm.controls.title.value;
    this.taskList.description = this .taskListForm.controls.description.value;
    this.taskList.userIds = this.isEdit ? this.taskList.userIds : [this.auth.userId];

    this.submitting = true;
    if (!this.isEdit) {
      this.submitTaskListSub = this.apiService
        .createList(this.taskList)
        .subscribe(
          data => this._handleSuccess(data, formDirective),
          error => this._handleError(error)
       );
    } else {
      this.submitTaskListSub = this.apiService
        .editList(this.taskList._id, this.taskList)
        .subscribe(
          data => this._handleSuccess(data, formDirective),
          error => this._handleError(error)
        );
    }
  }

  private _handleSuccess(data: TaskListModel, formDirective: FormGroupDirective) {
    this.submitting = false;
    this.error = false;
    this.submittedList.emit({
      isEdit: this.isEdit,
      list: data
    });
    formDirective.resetForm();
    this.resetForm();
  }

  private _handleError(error: Error) {
    this.submitting = false;
    this.error = true;
  }

}
