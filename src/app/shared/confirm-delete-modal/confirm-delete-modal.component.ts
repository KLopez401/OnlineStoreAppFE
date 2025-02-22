import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal
} from '@angular/core';
import { PrimengExportsModule } from '../primeng-exports/primeng-exports.module';
import { CustomersStore } from '../../store/customers.store';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SpinnerComponent } from '../spinner/spinner.component';
import { EventStateService } from '../../core/services/event-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { FeaturesEnum } from '../../core/enums/features.enum';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [PrimengExportsModule, SpinnerComponent],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrl: './confirm-delete-modal.component.scss'
})
export class ConfirmDeleteModalComponent implements OnInit {
  dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private eventStateService = inject(EventStateService);
  private destroyRef = inject(DestroyRef);

  dialogData = signal(this.dialogConfig.data);

  isDisabled = computed(() => {
    switch (this.dialogData().feature) {
      case FeaturesEnum.CUSTOMERS:
        return this.dialogData().store.isCustomerDeleting();
      case FeaturesEnum.PRODUCTS:
        return this.dialogData().store.isProductDeleting();
      default:
        break;
    }
  });

  ngOnInit(): void {
    this.closetOnDeleteDone();
  }

  closetOnDeleteDone() {
    this.eventStateService.isItemDeleted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  onConfirm() {
    console.log(this.dialogConfig.data);
    const { id, feature, store } = this.dialogData();
    switch (feature) {
      case FeaturesEnum.CUSTOMERS:
        store.deleteCustomer({ id: id });
        break;
      case FeaturesEnum.PRODUCTS:
        store.deleteProduct({ id: id });
        break;

      default:
        break;
    }
  }
}
