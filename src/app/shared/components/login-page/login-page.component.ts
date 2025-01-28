import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {StyleClass} from 'primeng/styleclass';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-login-page',
  imports: [
    ButtonDirective, CommonModule, InputText, ReactiveFormsModule, StyleClass, Card
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  standalone: true
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Login con:', email, password);
    }
  }
}
