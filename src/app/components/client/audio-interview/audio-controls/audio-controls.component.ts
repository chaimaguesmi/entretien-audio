import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../../../app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ClientImports } from '../../client-imports';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  templateUrl: './audio-controls.component.html',
  styleUrl: './audio-controls.component.css',
  imports: [ClientImports
    ]
})
export class AudioControlsComponent {
 @Input() isRecording = false;
  @Input() interviewStarted = false;
  @Input() isInterviewComplete = false;
  @Input() isWaitingResponse = false;
  
  @Output() toggleRecording = new EventEmitter<void>();
  @Output() startInterview = new EventEmitter<void>();
  @Output() recordingStateChanged = new EventEmitter<boolean>(); 

  onToggleRecording() {
    this.toggleRecording.emit();
    this.recordingStateChanged.emit(!this.isRecording); 
  }
}
