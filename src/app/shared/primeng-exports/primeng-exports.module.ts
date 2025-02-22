import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';

const PRIMENG_MODULES = [
  CardModule,
  ToolbarModule,
  ButtonModule,
  TableModule,
  IconFieldModule,
  InputIconModule,
  InputTextModule,
  MultiSelectModule,
  IftaLabelModule,
  ProgressSpinnerModule,
  TooltipModule,
  ConfirmDialogModule,
  ToastModule,
  SelectModule
];

@NgModule({
  declarations: [],
  imports: [...PRIMENG_MODULES],
  exports: [...PRIMENG_MODULES]
})
export class PrimengExportsModule {}
