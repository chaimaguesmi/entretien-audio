import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  public recording$ = new Subject<boolean>();
  public audioBlob$ = new Subject<Blob>();
    private isAudioPlaying = new BehaviorSubject<boolean>(false);
  async startRecording() {
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioBlob$.next(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      this.mediaRecorder.start();
      this.recording$.next(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.recording$.next(false); 
    }
  }  // Méthodes pour gérer l'état audio
  notifyAudioPlaybackStarted() {
    if (this.mediaRecorder?.state === 'recording') {
      this.stopRecording();
    }
    this.isAudioPlaying.next(true);
  }

  notifyAudioPlaybackStopped() {
    this.isAudioPlaying.next(false);
  }

  getAudioPlayingState() {
    return this.isAudioPlaying.asObservable();
  }

}
export default AudioRecorderService;