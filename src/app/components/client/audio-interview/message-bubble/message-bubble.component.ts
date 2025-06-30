import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { InterviewMessage } from '../audio-interview.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../../../app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ClientImports } from '../../client-imports';
import AudioRecorderService from '../../../../core/services/audio-recorder.service';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule
    ]
})
export class MessageBubbleComponent implements OnDestroy,OnInit {
  @Input() message!: InterviewMessage;
  @Output() playAudio = new EventEmitter<string>();
  @Input() isRecording = false;
  
  isPlaying = false;
  progress = 0;
  duration = 0;
  currentTime = 0;
   durationLoaded = false; 
  private audio: HTMLAudioElement | null = null;
  private progressInterval: any;
  private static currentlyPlaying: MessageBubbleComponent | null = null; 
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  private audioRecorder: AudioRecorderService, private cdRef: ChangeDetectorRef) {
    if (isPlatformBrowser(this.platformId)) {
      this.audio = new Audio();
      this.audio.onloadedmetadata = () => {
        if (this.audio) {
          this.duration = this.audio.duration;
        }
      };
      
    }
  }
  togglePlay() {
    if (this.isRecording) return;
    
    if (this.isPlaying) {
      this.pause();
      
    } else {
      this.audioRecorder.notifyAudioPlaybackStarted();
      if (MessageBubbleComponent.currentlyPlaying && 
          MessageBubbleComponent.currentlyPlaying !== this) {
             MessageBubbleComponent.currentlyPlaying.reset(); 
        MessageBubbleComponent.currentlyPlaying.pause();
      }
      this.play();
    }
  }

  play(): void {
    if (!this.audio || !this.message.audioUrl) return;
    
    if (this.audio.src !== this.message.audioUrl) {
      this.audio.src = this.message.audioUrl;
    }
    
    this.audio.play().then(() => {
      this.isPlaying = true;
      MessageBubbleComponent.currentlyPlaying = this;
      this.startProgressTracking();
    }).catch(error => {
      console.error('Erreur de lecture:', error);
    });
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();
    
    this.progressInterval = setInterval(() => {
      if (this.audio) {
        this.currentTime = this.audio.currentTime;
        this.progress = (this.currentTime / this.duration) * 100;
        
        if (this.audio.ended) {
          this.reset();
          this.audioRecorder.notifyAudioPlaybackStopped(); 
        }
      }
    }, 100);
     if (this.audio) {
    this.audio.onended = () => {
      this.reset();
      this.audioRecorder.notifyAudioPlaybackStopped();
    };
  }
  }

  pause(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.audioRecorder.notifyAudioPlaybackStopped();
    
    if (MessageBubbleComponent.currentlyPlaying === this) {
      MessageBubbleComponent.currentlyPlaying = null;
    }
    this.stopProgressTracking();
  }

  private stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private reset(): void {
     if (!this.audio) return;
    this.stopProgressTracking();
    this.isPlaying = false;
    
    this.progress = 0;
    this.currentTime = 0;
    if (MessageBubbleComponent.currentlyPlaying === this) {
      MessageBubbleComponent.currentlyPlaying = null;
    }
if (this.audio) {
    this.audio.onended = null;
  }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  seekAudio(event: MouseEvent): void {
      if (this.isRecording) return;
    if (!this.audio || !this.message.audioUrl) return;

    const progressContainer = event.currentTarget as HTMLElement;
    const clickPosition = event.clientX - progressContainer.getBoundingClientRect().left;
    const containerWidth = progressContainer.offsetWidth;
    const seekPercentage = clickPosition / containerWidth;
    
    this.audio.currentTime = this.duration * seekPercentage;
    this.currentTime = this.audio.currentTime;
    this.progress = seekPercentage * 100;

    if (!this.isPlaying) {
     
      if (MessageBubbleComponent.currentlyPlaying && 
          MessageBubbleComponent.currentlyPlaying !== this) {
        MessageBubbleComponent.currentlyPlaying.pause();
      }
      this.audio.play().then(() => {
        this.isPlaying = true;
        MessageBubbleComponent.currentlyPlaying = this;
        this.startProgressTracking();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
       this.audio.onended = null; 
    }
    if (MessageBubbleComponent.currentlyPlaying === this) {
      MessageBubbleComponent.currentlyPlaying = null;
    }
    this.stopProgressTracking();
  }
  ngOnInit() {
    if (this.message.audioUrl) {
      this.loadAudioDuration();
    }
  }
  
private loadAudioDuration() {
  if (!this.audio || !this.message.audioUrl) return;
  
  // Sauvegarde l'état actuel
  const wasPlaying = this.isPlaying;
  const currentTime = this.audio.currentTime;
  
  if (wasPlaying) {
    this.audio.pause();
  }
  
  this.audio.src = this.message.audioUrl;
  this.audio.currentTime = 0;
  
  this.audio.onloadedmetadata = () => {
    this.duration = this.audio!.duration;
    this.durationLoaded = true;
    this.cdRef.detectChanges();
    
    // Restaure l'état précédent
    if (wasPlaying) {
      this.audio!.src = this.message.audioUrl!;
      this.audio!.currentTime = currentTime;
      this.audio!.play();
    }
  };
  
  this.audio.load();
}

}