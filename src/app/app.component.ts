import { HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  styleUrl: './app.component.css',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  title = 'carriere';
}
