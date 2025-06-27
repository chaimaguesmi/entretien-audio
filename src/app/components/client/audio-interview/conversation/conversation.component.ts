import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewChecked } from '@angular/core';
import { InterviewMessage } from '../audio-interview.component';
import { CommonModule } from '@angular/common';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';

@Component({
  selector: 'app-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
  imports: [CommonModule, MessageBubbleComponent]
})
export class ConversationComponent implements AfterViewChecked {
  @Input() messages: InterviewMessage[] = [];
  @Input() isWaitingResponse = false;
  @Input() isCurrentlyRecording = false;
  @Output() playAudio = new EventEmitter<string>();
  
  @ViewChild('conversationContainer') private container!: ElementRef;
  private scrollThreshold = 100; 
  private isNearBottom = true;

  ngAfterViewChecked() {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      const element = this.container.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  onScroll() {
    const element = this.container.nativeElement;
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    this.isNearBottom = distanceFromBottom < this.scrollThreshold;
  }

  handlePlayAudio(audioUrl: string) {
    this.playAudio.emit(audioUrl);
  }
}