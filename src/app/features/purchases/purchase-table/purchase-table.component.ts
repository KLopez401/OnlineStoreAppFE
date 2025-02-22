import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PurchasesStore } from '../../../store/purchases.store';
import { PURCHASES_TABLE_COLUMNS } from '../../../core/constants/table-columns.const';
import { PrimengExportsModule } from '../../../shared/primeng-exports/primeng-exports.module';

@Component({
  selector: 'app-purchase-table',
  standalone: true,
  imports: [PrimengExportsModule, RouterLink],
  templateUrl: './purchase-table.component.html',
  styleUrl: './purchase-table.component.scss'
})
export class PurchaseTableComponent implements OnInit, OnDestroy {
  store = inject(PurchasesStore);
  activatedRoute = inject(ActivatedRoute);

  columns = signal(PURCHASES_TABLE_COLUMNS);
  rowData = computed(() => this.store.purchaseList());
  totalCount = computed(() => this.store.purchaseList().length);

  ngOnInit(): void {
    this.store.getPurchaseList();
  }

  ngOnDestroy(): void {
    this.store.clearPurchases();
  }
}
