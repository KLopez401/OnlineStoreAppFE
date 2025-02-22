import { Component, input } from '@angular/core';
import { PrimengExportsModule } from '../primeng-exports/primeng-exports.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-page-button',
  standalone: true,
  imports: [PrimengExportsModule, RouterLink],
  templateUrl: './back-page-button.component.html',
  styleUrl: './back-page-button.component.scss'
})
export class BackPageButtonComponent {
  disabled = input<boolean>(false);
  route = input<string>('');
}
