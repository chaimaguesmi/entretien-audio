import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioInterviewComponent } from './audio-interview/audio-interview.component';
import { ConversationComponent } from './audio-interview/components/conversation/conversation.component';
import { MessageBubbleComponent } from './audio-interview/components/message-bubble/message-bubble.component';
import { AudioControlsComponent } from './audio-interview/components/audio-controls/audio-controls.component';
import { InterviewHeaderComponent } from './audio-interview/components/interview-header/interview-header.component';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    AudioInterviewComponent,
    ConversationComponent,
    MessageBubbleComponent,
    AudioControlsComponent,
    InterviewHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule, 
    MatButtonModule,
    FormsModule

  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
