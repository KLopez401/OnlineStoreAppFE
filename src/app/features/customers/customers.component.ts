import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimengExportsModule } from '../../shared/primeng-exports/primeng-exports.module';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [RouterOutlet, PrimengExportsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {}
