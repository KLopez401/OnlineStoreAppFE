import { Component, input } from '@angular/core';
import { PrimengExportsModule } from '../primeng-exports/primeng-exports.module';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [PrimengExportsModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  strokeWidth = input<string>('8');
  style = input({ width: '2rem', height: '2rem' });
  animationDuration = input<string>('.5s');
  fill = input<string>('transparent');
}
