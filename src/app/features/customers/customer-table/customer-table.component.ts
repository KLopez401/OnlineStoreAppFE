import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { PrimengExportsModule } from '../../../shared/primeng-exports/primeng-exports.module';
import { CUSTOMERS_TABLE_COLUMNS } from '../../../core/constants/table-columns.const';
import { CustomersStore } from '../../../store/customers.store';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerDetail } from '../../../store/customers.model';
import { EventStateService } from '../../../core/services/event-state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { FeaturesEnum } from '../../../core/enums/features.enum';

@Component({
  selector: 'app-customer-table',
  standalone: true,
  imports: [PrimengExportsModule, RouterLink, FormsModule],
  templateUrl: './customer-table.component.html',
  styleUrl: './customer-table.component.scss'
})
export class CustomerTableComponent implements OnInit, OnDestroy {
  store = inject(CustomersStore);
  activatedRoute = inject(ActivatedRoute);
  private eventStateService = inject(EventStateService);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DialogService);

  columns = signal(CUSTOMERS_TABLE_COLUMNS);
  rowData = computed(() => this.store.customerList());
  totalCount = computed(() => this.store.customerList().length);
  // filterOptions = computed(() => {
  //   const repMap = new Map();
  //   this.rowData().forEach((row) => {
  //     const rep = row;
  //     if (!repMap.has(rep.firstName)) {
  //       repMap.set(rep.firstName, rep);
  //     }
  //   });
  //   return Array.from(repMap.values());
  // });

  // selectedFilterValue = signal<any[]>([]);

  ngOnInit(): void {
    this.store.getCustomerList();
    this.listenToTableRefresh();
  }

  ngOnDestroy(): void {
    this.store.clearCustomers();
  }

  listenToTableRefresh() {
    this.eventStateService.refreshTable$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.store.getCustomerList();
    });
  }

  // getFilterOptions(field: string) {
  //   const customerDetailsField = field as keyof CustomerDetail;
  //   const uniqueSet = new Set(this.rowData().map((row) => row[customerDetailsField]));

  //   return Array.from(uniqueSet).map((value) => ({ [field]: value }));
  // }

  onDelete(rowData: CustomerDetail) {
    const customerName = `${rowData.firstName} ${rowData.lastName}`;
    this.dialogService.open(ConfirmDeleteModalComponent, {
      header: `Delete customer "${customerName}"`,
      data: { id: rowData.id, feature: FeaturesEnum.CUSTOMERS, store: this.store },
      /** PrimeNG dialog bug workaround - focusOnShow set to false */
      focusOnShow: false,
      closable: true,
      dismissableMask: true
    });
  }
}
