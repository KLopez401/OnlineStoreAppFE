import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EventStateService } from '../../../core/services/event-state.service';
import { ProductsStore } from '../../../store/products.store';
import { PRODUCTS_TABLE_COLUMNS } from '../../../core/constants/table-columns.const';
import { PrimengExportsModule } from '../../../shared/primeng-exports/primeng-exports.module';
import { ProductDetail } from '../../../store/products.model';
import { ConfirmDeleteModalComponent } from '../../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeaturesEnum } from '../../../core/enums/features.enum';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [PrimengExportsModule, RouterLink],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent implements OnInit, OnDestroy {
  store = inject(ProductsStore);
  activatedRoute = inject(ActivatedRoute);
  private eventStateService = inject(EventStateService);
  private destroyRef = inject(DestroyRef);
  private dialogService = inject(DialogService);

  columns = signal(PRODUCTS_TABLE_COLUMNS);
  rowData = computed(() => this.store.productList());
  totalCount = computed(() => this.store.productList().length);

  ngOnInit(): void {
    this.store.getProductList();
    this.listenToTableRefresh();
  }

  ngOnDestroy(): void {
    this.store.clearProducts();
  }

  listenToTableRefresh() {
    this.eventStateService.refreshTable$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.store.getProductList();
    });
  }

  onDelete(rowData: ProductDetail) {
    this.dialogService.open(ConfirmDeleteModalComponent, {
      header: `Delete product "${rowData.name}"`,
      data: { id: rowData.id, feature: FeaturesEnum.PRODUCTS, store: this.store },
      /** PrimeNG dialog bug workaround - focusOnShow set to false */
      focusOnShow: false,
      closable: true,
      dismissableMask: true
    });
  }
}
