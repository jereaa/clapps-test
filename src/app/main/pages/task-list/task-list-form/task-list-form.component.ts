import { Component, OnInit, Output, OnDestroy, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TaskModel, TaskStatus, ITaskStatusStrings } from 'src/app/core/models/task.model';
import { ApiService } from 'src/app/core/api.service';

const keys = Object.keys(TaskStatus).filter(k => typeof TaskStatus[k as any] === 'number');
const values = keys.map(k => TaskStatus[k as any]);

@Component({
  selector: 'app-task-list-form',
  templateUrl: './task-list-form.component.html',
  styleUrls: ['./task-list-form.component.scss']
})
export class TaskListFormComponent implements OnInit, OnDestroy {
  @Input() listId: string;
  @Output() submittedTask = new EventEmitter();
  isEdit: boolean;

  // Form and model
  task: TaskModel;
  taskForm: FormGroup;

  // Form submission
  submitting: boolean;
  error: boolean;
  submitBtnText: string;
  submitTaskSub: Subscription;

  // Form min/max characters
  titleMin = 4;
  titleMax = 20;
  descMin = 10;
  descMax = 140;

  taskStatusKeys = keys;
  taskStatusValues = values;
  taskStatusStrings: ITaskStatusStrings = {};

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.taskStatusStrings[TaskStatus.PENDING] = 'Pending';
    this.taskStatusStrings[TaskStatus.STARTED] = 'Started';
    this.taskStatusStrings[TaskStatus.COMPLETED] = 'Completed';
    this._setFormData();
    this._buildForm();
  }

  ngOnDestroy(): void {
    if (this.submitTaskSub) {
      this.submitTaskSub.unsubscribe();
    }
  }

  private _setFormData(isEdit = false): void {
    this.isEdit = isEdit;
    this.submitBtnText = this.isEdit ? 'Update task' : 'Create task';
    if (!this.isEdit) {
      this.task = new TaskModel(null, null);
    } else {
      this.taskForm.controls.title.setValue(this.task.title);
      this.taskForm.controls.description.setValue(this.task.description);
      this.taskForm.controls.status.setValue(this.task.status);

      // In case we are editing a list,
      // trigger immediate validation by marking
      // fields as dirty in case field is no longer valid
      for (const key in this.taskForm.controls) {
        if (this.taskForm.controls.hasOwnProperty(key)) {
          this.taskForm.controls[key].markAsDirty();
        }
      }
    }
  }

  private _buildForm(): void {
    this.taskForm = this.fb.group({
      title: [this.task.title, [
        Validators.required,
        Validators.minLength(this.titleMin),
        Validators.maxLength(this.titleMax)
      ]],
      description: [this.task.description, [
        Validators.required,
        Validators.minLength(this.descMin),
        Validators.maxLength(this.descMax)
      ]],
      status: [this.task.status]
    });
  }

  editTask(editTask: TaskModel): void {
    this.task = editTask;
    this._setFormData(true);
  }

  resetForm(): void {
    this.taskForm.reset();
    this._setFormData();
  }

  submitForm(formDirective: FormGroupDirective): void {
    if (this.taskForm.invalid) {
      return;
    }

    this.task.title = this.taskForm.controls.title.value;
    this.task.description = this.taskForm.controls.description.value;
    this.task.status = this.taskForm.controls.status.value;

    this.submitting = true;

    if (!this.isEdit) {
      this.submitTaskSub = this.api
        .createTask(this.listId, this.task)
        .subscribe(
          data => this._handleSuccess(data, formDirective),
          error => this._handleError(error),
          () => this.submitting = false
        );
    } else {
      this.submitTaskSub = this.api
        .editTask(this.listId, this.task._id, this.task)
        .subscribe(
          data => this._handleSuccess(data, formDirective),
          error => this._handleError(error),
          () => this.submitting = false
        );
    }
    console.log('Submitting: ', JSON.stringify(this.task));
  }

  private _handleSuccess(submittedTask: TaskModel, formDirective: FormGroupDirective): void {
    this.error = false;
    this.submittedTask.emit({
      isEdit: this.isEdit,
      task: submittedTask
    });
    formDirective.resetForm();
    this.resetForm();
  }

  private _handleError(error: Error): void {
    this.error = true;
  }

}
