import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InterviewMessage } from '../../audio-interview.component';
@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
 styleUrls: ['./message-bubble.component.css']
})
export class MessageBubbleComponent {
  @Input() message!: InterviewMessage;

  @Output() playAudio = new EventEmitter<string>();
}
