import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';

@Component({
  selector: 'app-conversation',
  standalone: true,
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
  imports: [CommonModule, MessageBubbleComponent],
})
export class ConversationComponent implements AfterViewInit {
  @Input() messages: any[] = [];
  @Input() isWaitingResponse = false;
  @Input() isCurrentlyRecording = false;
  @Output() playAudio = new EventEmitter<string>();

  @ViewChild('conversationContainer') private container!: ElementRef;
  private userScrolledUp = false;
  private lastMessageCount = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }
  ngOnChanges(changes: any) {
    if (
      (changes.messages && changes.messages.currentValue) ||
      changes.isWaitingResponse
    ) {
      if (!this.userScrolledUp || this.messages.length > this.lastMessageCount) {
        this.scrollToBottom();
        this.lastMessageCount = this.messages.length;
      }
    }
  }

  onScroll() {
    const element = this.container?.nativeElement;
    if (!element) return;
    const distanceFromBottom =
    element.scrollHeight - element.scrollTop - element.clientHeight;
    this.userScrolledUp = distanceFromBottom > 100;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const element = this.container?.nativeElement;
      if (element) {
        element.scroll({
          top: element.scrollHeight,
          behavior: 'smooth',
        });
      }
      
    }, 0);
  }

  handlePlayAudio(audioUrl: string) {
    this.playAudio.emit(audioUrl);
  }
  
}