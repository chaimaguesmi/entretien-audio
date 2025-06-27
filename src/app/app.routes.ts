import { Routes } from '@angular/router';
import { AudioInterviewComponent } from './components/client/audio-interview/audio-interview.component';
import { ClientRouting } from './components/client/client-routing';

export const routes: Routes = [
  {
    path: 'client',
    children: ClientRouting,

  }
];