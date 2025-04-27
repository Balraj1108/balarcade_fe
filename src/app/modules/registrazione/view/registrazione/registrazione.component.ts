import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {RegistrazioneDto} from '../../dto/registrazione.dto';
import {RegistrazioneService} from '../../service/registrazione.service';
import {GenericDialogComponent} from '../../../../shared/dialog/generic-dialog/generic-dialog.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-registrazione',
  imports: [CommonModule, ReactiveFormsModule, Card, InputText, ButtonDirective],
  templateUrl: './registrazione.component.html',
  styleUrl: './registrazione.component.css',
  standalone: true
})
export class RegistrazioneComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  private ref: DynamicDialogRef | undefined;

  constructor(private formBuilder: FormBuilder, private registrazioneService: RegistrazioneService,
              private dialogService: DialogService, private router: Router) {
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }
    const {email, password, nome, cognome} = this.registrationForm.value;
    const registrazioneDto: RegistrazioneDto = {
      email: email,
      password: password,
      nome: nome,
      cognome: cognome
    };
    this.registrazioneService.registraUtente(registrazioneDto).subscribe(
      {
        next: res => {
          this.showSuccessDialog("success", "Successo" , 'Registrazione completata', 'Ora puoi effettuare il login');
          this.registrationForm.reset();
          this.submitted = false;
          this.router.navigate(['/login']);

        },
        error: (err) => {
          this.showSuccessDialog("error", "Errore", "", err.error.error);
          console.log(err.error);
        }
      }
    )

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
