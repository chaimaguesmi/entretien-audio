import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  public audioStopped$ = new Subject<string>();
  public audioPaused$ = new Subject<string>();

  play(audioUrl: string): void {
    if (this.currentAudio) {
      this.stopCurrentAudio();
    }
    this.currentAudio = new Audio(audioUrl);
    this.currentAudioUrl = audioUrl;

    this.currentAudio.onended = () => {
      this.audioStopped$.next(audioUrl);
      this.cleanUp();
    };

    this.currentAudio.play().catch(e => {
      console.error('Erreur de lecture', e);
      this.cleanUp();
    });
  }

  pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.audioPaused$.next(this.currentAudioUrl!);
    }
  }

  stopCurrentAudio(): void {
    if (this.currentAudio) {
      const stoppedUrl = this.currentAudioUrl;
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
      this.audioStopped$.next(stoppedUrl!);
      this.cleanUp();
    }
  }
   get isPlaying(): boolean {
    return !!this.currentAudio;
  }

  private cleanUp(): void {
    if (this.currentAudio) {
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    this.currentAudioUrl = null;
  }
}