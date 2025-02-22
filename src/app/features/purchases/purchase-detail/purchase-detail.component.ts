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
import { ProductsStore } from '../../../store/products.store';
import { CustomersStore } from '../../../store/customers.store';
import { PrimengExportsModule } from '../../../shared/primeng-exports/primeng-exports.module';
import { ProductDetail } from '../../../store/products.model';
import { FormsModule } from '@angular/forms';
import { BackPageButtonComponent } from '../../../shared/back-page-button/back-page-button.component';
import { PurchasesStore } from '../../../store/purchases.store';
import { ModesEnum } from '../../../core/enums/modes.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CustomerDetail } from '../../../store/customers.model';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { PRODUCTS_TABLE_COLUMNS } from '../../../core/constants/table-columns.const';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [PrimengExportsModule, FormsModule, BackPageButtonComponent, SpinnerComponent],
  templateUrl: './purchase-detail.component.html',
  styleUrl: './purchase-detail.component.scss'
})
export class PurchaseDetailComponent implements OnInit, OnDestroy {
  productsStore = inject(ProductsStore);
  customersStore = inject(CustomersStore);
  purchasesStore = inject(PurchasesStore);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  mode = signal<ModesEnum>(ModesEnum.ADD);
  modes = signal(ModesEnum);
  headerLabel = signal<string>('');
  purchaseId = signal<string | null>(null);
  totalPrice = signal<number>(0);
  actionLabel = signal<string>('');
  _selectedProducts = signal<ProductDetail[]>([]);
  customerOptions = computed(() =>
    this.customersStore
      .customerList()
      .map((customer) => ({ ...customer, fullName: `${customer.firstName} ${customer.lastName}` }))
  );

  productColumns = computed(() =>
    PRODUCTS_TABLE_COLUMNS.filter((column) => column.field !== 'action').map((column) => ({
      ...column,
      field: column.field as keyof ProductDetail
    }))
  );

  isActionDisabled = computed(() => {
    return (
      this.purchasesStore.isPurchaseAdding() ||
      !this.selectedCustomer ||
      !this.selectedProducts.length
    );
  });

  get selectedProducts() {
    return this._selectedProducts();
  }

  set selectedProducts(value: ProductDetail[]) {
    this._selectedProducts.set(value);

    let total = 0;
    value.forEach(product => {
      total += Number(product.price);
    });

    this.totalPrice.set(total);
  }

  _selectedCustomer = signal<CustomerDetail | null>(null);

  get selectedCustomer() {
    return this._selectedCustomer()!;
  }

  set selectedCustomer(value: CustomerDetail) {
    this._selectedCustomer.set(value);
  }

  constructor() {
    effect(() => {
      if (this.purchasesStore.purchaseDetail()) {
        queueMicrotask(() => {
          this.selectedCustomer = this.purchasesStore.purchaseDetail()!.customer;
          this.selectedProducts = this.purchasesStore.purchaseDetail()!.products;
        });
      }
    });
  }

  ngOnInit(): void {
    this.initializeRouteQueryParams();
    this.initializeProductsAndCustomers();
  }

  ngOnDestroy(): void {
    this.purchasesStore.clearPurchaseDetail();
  }

  initializeProductsAndCustomers() {
    this.productsStore.getProductList();
    this.customersStore.getCustomerList();
  }

  initializeRouteQueryParams() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.purchaseId.set(params.get('id'));
      if (this.purchaseId()) {
        this.purchasesStore.getPurchase({ id: this.purchaseId()! });
      }
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: any) => {
      switch (params?.mode) {
        case ModesEnum.VIEW:
          this.headerLabel.set('Purchase Details');
          this.mode.set(ModesEnum.VIEW);
          break;
        default:
          this.headerLabel.set('Add New Purchase');
          this.mode.set(ModesEnum.ADD);
          this.actionLabel.set('Save New Purchase');
          break;
      }
    });

    this.route.url.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((segments) => {
      const fullPath = segments.map((segment) => segment.path).join('/');
      if (fullPath.includes('add')) {
      }
    });
  }

  onActionClicked() {
    this.purchasesStore.addPurchase({
      payload: {
        customerId: this.selectedCustomer.id,
        products: this.selectedProducts,
        total: this.selectedProducts.length
      }
    });
  }

  test() {
    console.log('test', this.selectedProducts);
    console.log('test columns', this.productColumns());
  }
}
