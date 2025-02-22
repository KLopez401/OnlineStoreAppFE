import { Component } from '@angular/core';
import { PrimengExportsModule } from '../../shared/primeng-exports/primeng-exports.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterOutlet, PrimengExportsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {}
