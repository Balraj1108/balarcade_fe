import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-generic-dialog',
  imports: [
    Button,
    NgClass
  ],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.css'
})
export class GenericDialogComponent {

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  closeDialog() {
    this.ref.close();
  }
}
