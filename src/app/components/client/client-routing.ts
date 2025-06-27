
import { Routes } from "@angular/router"

export const ClientRouting: Routes = [
   { 
    path: 'chat', 
    loadComponent: () => import('./audio-interview/audio-interview.component')
      .then(c => c.AudioInterviewComponent)
  }
]