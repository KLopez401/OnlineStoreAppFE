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
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModesEnum } from '../../../core/enums/modes.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PrimengExportsModule } from '../../../shared/primeng-exports/primeng-exports.module';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { BackPageButtonComponent } from '../../../shared/back-page-button/back-page-button.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [PrimengExportsModule, SpinnerComponent, BackPageButtonComponent, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  store = inject(ProductsStore);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  modes = signal(ModesEnum);
  mode = signal<ModesEnum>(ModesEnum.ADD);
  header = signal<string>('');
  actionLabel = signal<string>('');
  productId = signal<string | null>(null);
  isActionLoading = computed(() => this.store.isProductAdding() || this.store.isProductUpdating());

  productFormGroup!: FormGroup;

  constructor() {
    effect(() => {
      if (this.store.productDetail()) {
        this.assignFormValues();
      }
    });
  }

  ngOnInit(): void {
    this.initializeRouteQueryParams();
    this.initializeProductFormGroup();
  }

  ngOnDestroy(): void {
    this.store.clearProductDetail();
  }

  initializeRouteQueryParams() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.productId.set(params.get('id'));
      if (this.productId()) {
        this.store.getProduct({ id: this.productId()! });
      }
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: any) => {
      switch (params?.mode) {
        case ModesEnum.VIEW:
          this.header.set('Product Details');
          this.mode.set(ModesEnum.VIEW);
          break;
        case ModesEnum.EDIT:
          this.header.set('Edit Product Details');
          this.mode.set(ModesEnum.EDIT);
          this.actionLabel.set('Update Product Details');
          break;
        default:
          this.header.set('Add New Product');
          this.mode.set(ModesEnum.ADD);
          this.actionLabel.set('Save New Product');
          break;
      }
    });

    this.route.url.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((segments) => {
      const fullPath = segments.map((segment) => segment.path).join('/');
      if (fullPath.includes('add')) {
      }
    });
  }

  initializeProductFormGroup() {
    const disableFields = this.mode() === ModesEnum.VIEW;
    this.productFormGroup = this.formBuilder.group({
      name: [{ value: '', disabled: disableFields }, [Validators.required]],
      description: [{ value: '', disabled: disableFields }, [Validators.required]],
      price: [{ value: '', disabled: disableFields }, [Validators.required]]
    });
  }

  assignFormValues() {
    const { name, description, price } = this.store.productDetail()!;
    this.productFormGroup.setValue({
      name: name,
      description: description,
      price: price
    });
  }

  onActionClicked() {
    switch (this.mode()) {
      case ModesEnum.ADD:
        this.store.addProduct({ payload: this.productFormGroup.value });
        break;
      case ModesEnum.EDIT:
        this.store.updateProduct({
          payload: {
            id: this.productId()!,
            product: this.productFormGroup.value
          }
        });
        break;
      default:
        break;
    }
  }
}
