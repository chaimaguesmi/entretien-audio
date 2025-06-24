import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-interview-header',
  templateUrl: './interview-header.component.html',
  styleUrl: './interview-header.component.css'
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
