import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface QuestionCategory {
  name: string;
  icon: string;
  questions: string[];
  completed: boolean;
}

@Component({
  selector: 'app-interview-header',
  templateUrl: './interview-header.component.html',
  styleUrl: './interview-header.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class InterviewHeaderComponent {
  private _jobTitle: string = '';
  private _companyName: string = '';
  
  @Input()
  get jobTitle(): string {
    return this._jobTitle;
  }
  set jobTitle(value: string) {
    this._jobTitle = value;
    this.jobTitleChange.emit(value);
  }
  
  @Input()
  get companyName(): string {
    return this._companyName;
  }
  set companyName(value: string) {
    this._companyName = value;
    this.companyNameChange.emit(value);
  }
  
  // Propriétés existantes
  @Input() currentQuestion: number = 0;
  @Input() totalQuestions: number = 0;
  
  // Nouvelles propriétés pour les catégories
  @Input() currentCategory: string = '';
  @Input() currentCategoryIcon: string = '';
  @Input() completedCategories: number = 0;
  @Input() totalCategories: number = 0;
  @Input() currentQuestionInCategory: number = 0;
  @Input() totalQuestionsInCategory: number = 0;
  @Input() categories: QuestionCategory[] = [];
  
  @Output() jobTitleChange = new EventEmitter<string>();
  @Output() companyNameChange = new EventEmitter<string>();
  
  getProgressPercentage(): number {
    return this.totalQuestions > 0 
      ? Math.round((this.currentQuestion / this.totalQuestions) * 100)
      : 0;
  }
  
  getCategoryProgressPercentage(): number {
    return this.totalCategories > 0 
      ? Math.round((this.completedCategories / this.totalCategories) * 100)
      : 0;
  }
  
  getCurrentCategoryProgressPercentage(): number {
    return this.totalQuestionsInCategory > 0 
      ? Math.round((this.currentQuestionInCategory / this.totalQuestionsInCategory) * 100)
      : 0;
  }
  
  getSteps(): number[] {
    return Array.from({ length: this.totalQuestions }, (_, i) => i);
  }
  
  getCategorySteps(): number[] {
    return Array.from({ length: this.totalCategories }, (_, i) => i);
  }
}