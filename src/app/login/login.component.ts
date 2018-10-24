import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService, AuthError, AuthErrorType } from '../auth/auth.service';
import { UserModel } from '../core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  pageTitle = 'Login';
  usernameFormControl = new FormControl('', [
    Validators.required
  ]);
  submitting: boolean;

  constructor(
    private title: Title,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
  }

  login(): void {
    this.usernameFormControl.updateValueAndValidity();
    if (this.usernameFormControl.errors !== null) {
      return;
    }

    this.submitting = true;
    this.authService.login(this.usernameFormControl.value).subscribe(
      (data: UserModel) => {
        this.usernameFormControl.setErrors(null);
        this.router.navigate(['/']);
      },
      (error: AuthError) => {
        const wrongUsername = error.type === AuthErrorType.WRONG_USERNAME;
        this.usernameFormControl.setErrors({ invalid: wrongUsername });
        this.submitting = false;
      }
    );
  }

}
