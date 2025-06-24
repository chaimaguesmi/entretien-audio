import { Component, Input } from '@angular/core';
import { InterviewMessage } from '../../audio-interview.component';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent {
@Input() messages: InterviewMessage[] = [];
  @Input() isWaitingResponse = false;
 // Ajoutez cette méthode
handlePlayAudio(url: string) {
  const audio = new Audio(url);
  audio.play().catch(e => console.error("Erreur de lecture", e));
}

}
