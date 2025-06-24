import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-audio-controls',
  templateUrl: './audio-controls.component.html',
  styleUrl: './audio-controls.component.css'
})
export class AudioControlsComponent {
 @Input() isRecording = false;
  @Input() interviewStarted = false;
  @Input() isInterviewComplete = false;
  @Input() isWaitingResponse = false;
  
  @Output() toggleRecording = new EventEmitter<void>();
  @Output() startInterview = new EventEmitter<void>();
}
