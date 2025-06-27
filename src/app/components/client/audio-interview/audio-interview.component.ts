import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ClientImports } from '../client-imports';
import { ConversationComponent } from './conversation/conversation.component';
import { AudioControlsComponent } from './audio-controls/audio-controls.component';
import AudioRecorderService from '../../../core/services/audio-recorder.service';
import { InterviewHeaderComponent } from './interview-header/interview-header.component';

export interface InterviewMessage {
  sender: 'bot' | 'user';
  content: string;
  audioUrl?: string | null;
  isQuestion?: boolean;
  timestamp: Date; 
}

@Component({
  selector: 'app-audio-interview',
  standalone: true,
  templateUrl: './audio-interview.component.html',
  styleUrls: ['./audio-interview.component.css'],
  imports: [
    ...ClientImports,
    ConversationComponent,
    AudioControlsComponent,
    InterviewHeaderComponent
  ]
})
export class AudioInterviewComponent implements OnInit {
  isRecording = false;
  audioUrl: string | null = null;
  conversation: InterviewMessage[] = [];
  interviewStarted = false;
  isWaitingResponse = false;
  currentJobTitle = 'Développeur Frontend';
  currentCompanyName = 'Facebook';
  interviewPhase: 'welcome' | 'confirmation' | 'questions' | 'finished' = 'welcome';
  currentQuestionIndex = 0;
  isCurrentlyRecording = false;

onRecordingStateChanged(isRecording: boolean) {
  this.isCurrentlyRecording = isRecording;
  this.cdRef.detectChanges();
}
  
  questions = [
    "Pourriez-vous vous présenter brièvement ?",
    "Qu'est-ce qui vous motive à postuler pour ce poste ?",
    "Quelles sont vos principales compétences en lien avec ce poste ?",
    "Pouvez-vous décrire une situation professionnelle difficile et comment vous l'avez gérée ?"
  ];

  constructor(private audioRecorder: AudioRecorderService,private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.showWelcomeMessage();
    this.setupAudioRecorder();
  }

  private setupAudioRecorder() {
    this.audioRecorder.recording$.subscribe(recording => {
      this.isRecording = recording;
      if (!recording) {
        this.processUserResponse();
      }
    });

    this.audioRecorder.audioBlob$.subscribe(blob => {
      this.audioUrl = URL.createObjectURL(blob);
      this.addUserMessage();
    });
  }

  private async showWelcomeMessage() {
    await this.addBotMessageWithDelay(`Bonjour ! Bienvenue chez ${this.currentCompanyName}. Vous postulez pour le poste de ${this.currentJobTitle}.`);
    await this.addBotMessageWithDelay("Vous êtes prêt pour l'entretien ?", true);
    this.interviewPhase = 'confirmation';
  }

  startInterview() {
    this.interviewStarted = true;
    this.interviewPhase = 'questions';
    this.currentQuestionIndex = 0;
    this.addBotMessage(this.questions[0], true);
  }

  toggleRecording() {
    if (this.isRecording) {
      this.audioRecorder.stopRecording();
    } else {
      this.audioRecorder.startRecording();
    }
  }

  private addUserMessage() {
    if (!this.audioUrl) return;
    
    this.conversation.push({
      sender: 'user',
      content:'',
      audioUrl: this.audioUrl,
      timestamp: new Date()
    });
  }

  private async addBotMessage(content: string, isQuestion = false, delayMs = 1000) {
    this.isWaitingResponse = true;
    await new Promise(resolve => setTimeout(resolve, delayMs));
    this.conversation.push({
      sender: 'bot',
      content,
      isQuestion,
       timestamp: new Date()
    });
    this.isWaitingResponse = false;
  }

  private addBotMessageWithDelay(content: string, isQuestion = false) {
    this.conversation.push({
      sender: 'bot',
      content,
      isQuestion,
       timestamp: new Date()
    });
  }

  private async processUserResponse() {
    
    this.addUserMessage();
    

    await this.delay(500); 
    switch (this.interviewPhase) {
      case 'confirmation':
        this.startInterview();
        break;
        
      case 'questions':
        await this.moveToNextQuestion(); 
        break;
    }
  }

   private async moveToNextQuestion() {
    this.currentQuestionIndex++;
    this.audioUrl = null; 
    
    if (this.currentQuestionIndex < this.questions.length) {
     
      
      this.addBotMessage(this.questions[this.currentQuestionIndex], true);
    } else {
      
      
      this.interviewPhase = 'finished';
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 


}