
import { Routes } from "@angular/router"
import { AudioInterviewComponent } from "./audio-interview/audio-interview.component"

export const ClientRouting: Routes = [
   { 
    path: 'chat', 
    loadComponent: () => import('./audio-interview/audio-interview.component')
      .then(c => c.AudioInterviewComponent)
  }
]