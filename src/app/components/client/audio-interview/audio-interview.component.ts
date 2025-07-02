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

export interface QuestionCategory {
  name: string;
  icon: string;
  questions: string[];
  completed: boolean;
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
  isReadyToStart = false;
  interviewPhase: 'welcome' | 'confirmation' | 'questions' | 'finished' = 'welcome';
  
  // Gestion des catégories
  currentCategoryIndex = 0;
  currentQuestionInCategory = 0;
  isCurrentlyRecording = false;
  isAudioPlaying = false;

  // Structure des questions par catégories
  questionCategories: QuestionCategory[] = [
    {
      name: 'Hard Skills',
      icon: '🔧',
      completed: false,
      questions: [
        "Quelles sont vos principales compétences techniques en lien avec ce poste ?",
        "Pouvez-vous décrire un projet technique complexe que vous avez réalisé ?",
        "Comment restez-vous à jour avec les nouvelles technologies dans votre domaine ?"
      ]
    },
    {
      name: 'Soft Skills',
      icon: '💬',
      completed: false,
      questions: [
        "Comment gérez-vous le travail en équipe et la communication avec vos collègues ?",
        "Pouvez-vous décrire une situation professionnelle difficile et comment vous l'avez gérée ?"
      ]
    },
    {
      name: 'Langues',
      icon: '🌍',
      completed: false,
      questions: [
        "Veuillez lire ce texte à haute voix : 'Technology is rapidly evolving, and staying current with new developments is essential for professional growth.'",
        "Can you briefly describe your professional experience in English?"
      ]
    },
    {
      name: 'Mission',
      icon: '🎯',
      completed: false,
      questions: [
        "Qu'est-ce qui vous motive à postuler pour ce poste spécifiquement ?"
      ]
    },
    {
      name: 'Conclusion',
      icon: '🏁',
      completed: false,
      questions: [
        "Avez-vous des questions à partager avec le recruteur ?"
      ]
    }
  ];

  constructor(
    private audioRecorder: AudioRecorderService,
    private cdRef: ChangeDetectorRef
  ) {}

  onRecordingStateChanged(isRecording: boolean) {
    this.isCurrentlyRecording = isRecording;
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.showWelcomeMessage();
    this.setupAudioRecorder();
    this.setupAudioPlaybackListener();
  }

  private setupAudioPlaybackListener() {
    this.audioRecorder.getAudioPlayingState().subscribe(isPlaying => {
      this.isAudioPlaying = isPlaying;
      this.cdRef.detectChanges();
    });
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
    await this.addBotMessageWithDelay("Cet entretien se compose de 5 catégories : Hard Skills, Soft Skills, Langues, Mission et Conclusion.", false, 1500);
    await this.addBotMessageWithDelay("Vous êtes prêt pour l'entretien ?", true);
    this.interviewPhase = 'confirmation';
    this.isReadyToStart = true; 
  }

  startInterview() {
    this.interviewStarted = true;
    this.interviewPhase = 'questions';
    this.currentCategoryIndex = 0;
    this.currentQuestionInCategory = 0;
    this.startCategory();
  }

  private async startCategory() {
    const currentCategory = this.questionCategories[this.currentCategoryIndex];
    await this.addBotMessage(
      `${currentCategory.icon} Nous commençons maintenant la section "${currentCategory.name}".`,
      false,
      1500
    );
    await this.addBotMessage(
      currentCategory.questions[this.currentQuestionInCategory],
      true,
      1000
    );
  }

  toggleRecording() {
    if (this.isRecording) {
      this.audioRecorder.stopRecording();
    } else {
      if (this.isAudioPlaying) {
        return;
      }
      this.audioRecorder.startRecording();
    }
  }

  private addUserMessage() {
    if (!this.audioUrl) return;
    
    this.conversation = [...this.conversation, {
      sender: 'user',
      content: '',
      audioUrl: this.audioUrl,
      timestamp: new Date()
    }];
    
    this.cdRef.detectChanges();
  }

  private async addBotMessage(content: string, isQuestion = false, delayMs = 1000) {
    this.isWaitingResponse = true;
    this.cdRef.detectChanges();
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    this.conversation = [...this.conversation, {
      sender: 'bot',
      content,
      isQuestion,
      timestamp: new Date()
    }];
    
    this.isWaitingResponse = false;
    this.cdRef.detectChanges();
  }

  private addBotMessageWithDelay(content: string, isQuestion = false, delayMs = 1000) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.conversation.push({
          sender: 'bot',
          content,
          isQuestion,
          timestamp: new Date()
        });
        this.cdRef.detectChanges();
        resolve();
      }, delayMs);
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
    const currentCategory = this.questionCategories[this.currentCategoryIndex];
    this.currentQuestionInCategory++;
    this.audioUrl = null;
    if (this.currentQuestionInCategory < currentCategory.questions.length) {
      await this.addBotMessage(
        currentCategory.questions[this.currentQuestionInCategory],
        true
      );
    } else {
      await this.completeCategoryAndMoveNext();
    }
  }

  private async completeCategoryAndMoveNext() {
    const currentCategory = this.questionCategories[this.currentCategoryIndex];
    currentCategory.completed = true;
    await this.addBotMessage(
      `✅ Section "${currentCategory.name}" terminée ! Bien joué !`,
      false,
      1500
    );
    this.currentCategoryIndex++;
    this.currentQuestionInCategory = 0;
    
    if (this.currentCategoryIndex < this.questionCategories.length) {
      await this.delay(1000);
      await this.startCategory();
    } else {
      await this.finishInterview();
    }
  }

  private async finishInterview() {
    this.interviewPhase = 'finished';
    await this.addBotMessage(
      "🎉 Félicitations ! Vous avez terminé toutes les sections de l'entretien.",
      false,
      2000
    );
    await this.addBotMessage(
      "Merci pour votre participation. Nous vous recontacterons bientôt !",
      false,
      1500
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  getCurrentCategoryName(): string {
    return this.questionCategories[this.currentCategoryIndex]?.name || '';
  }

  getCurrentCategoryIcon(): string {
    return this.questionCategories[this.currentCategoryIndex]?.icon || '';
  }

  getCompletedCategoriesCount(): number {
    return this.questionCategories.filter(cat => cat.completed).length;
  }

  getTotalCategoriesCount(): number {
    return this.questionCategories.length;
  }

  getCurrentQuestionInCategory(): number {
    return this.currentQuestionInCategory ;
  }

  getTotalQuestionsInCategory(): number {
    return this.questionCategories[this.currentCategoryIndex]?.questions.length || 0;
  }
  get currentQuestionIndex(): number {
    let totalQuestions = 0;
    for (let i = 0; i < this.currentCategoryIndex; i++) {
      totalQuestions += this.questionCategories[i].questions.length;
    }
    return totalQuestions + this.currentQuestionInCategory + 1;
  }

  get questions(): string[] {
    return this.questionCategories.flatMap(cat => cat.questions);
  }
  get isRecordingAllowed(): boolean {
  const lastMessage = this.conversation[this.conversation.length - 1];
  return this.interviewPhase === 'questions' &&
         lastMessage?.sender === 'bot' &&
         !!lastMessage?.isQuestion &&
         !this.isWaitingResponse;
}
}