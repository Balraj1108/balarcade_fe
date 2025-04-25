import {Component, OnInit} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {StyleClass} from 'primeng/styleclass';
import {Card} from 'primeng/card';
import {LoginDto} from '../../../auth/dto/login.dto';
import {AuthService} from '../../../auth/service/auth.service';
import {Router} from '@angular/router';
import {GenericDialogComponent} from '../../dialog/generic-dialog/generic-dialog.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';

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
  private ref: DynamicDialogRef | undefined;


  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private dialogService: DialogService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const {email, password} = this.loginForm.value;
      const loginDto: LoginDto = {
        username: email,
        password: password,
      };
      this.authService.loginService(loginDto).subscribe({
        next: (loginResult) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.showSuccessDialog("error", "Errore", "Credenziali non valide", "Riprova");
          console.log(error);
        }
      });
    }
  }

  showSuccessDialog(type: string, header: string, title: string, message: string) {
    this.ref = this.dialogService.open(GenericDialogComponent, {
      header: header,
      width: '400px',
      data: {
        type: type,
        title: title,
        message: message,
      },
      dismissableMask: true,
    });
  }
}
