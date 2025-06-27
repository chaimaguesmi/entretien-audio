import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../../../app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ClientImports } from '../../client-imports';

@Component({
  selector: 'app-interview-header',
  templateUrl: './interview-header.component.html',
  styleUrl: './interview-header.component.css',
  standalone: true,
  imports: []
})
export class InterviewHeaderComponent {
  private _jobTitle: string = '';
  private _companyName: string = '';

  @Input()
  get jobTitle(): string {
    return this._jobTitle;
  }
  set jobTitle(value: string) {
    this._jobTitle = value;
    this.jobTitleChange.emit(value);
  }

  @Input()
  get companyName(): string {
    return this._companyName;
  }
  set companyName(value: string) {
    this._companyName = value;
    this.companyNameChange.emit(value);
  }

  @Output() jobTitleChange = new EventEmitter<string>();
  @Output() companyNameChange = new EventEmitter<string>();
}
