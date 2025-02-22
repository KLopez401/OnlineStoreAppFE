import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PrimengExportsModule } from './shared/primeng-exports/primeng-exports.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrimengExportsModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'darzin-software-developer-assessment';
}
