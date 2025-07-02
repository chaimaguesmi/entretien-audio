import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() isAudioPlaying = false;
  @Input() isRecordingAllowed = false; 
  @Output() toggleRecording = new EventEmitter<void>();
  @Output() startInterview = new EventEmitter<void>();
  @Input() isReadyToStart = false;
  @Output() recordingStateChanged = new EventEmitter<boolean>(); 
  confettiPieces = Array(9).fill(0);
  getRandomHeight(index: number): number {
    return 10 + (index % 2) * 10 + Math.random() * 10;
  }
  onToggleRecording() {
  if (!this.isRecordingAllowed) return;
  this.toggleRecording.emit();
  this.recordingStateChanged.emit(!this.isRecording);
}
  
}
