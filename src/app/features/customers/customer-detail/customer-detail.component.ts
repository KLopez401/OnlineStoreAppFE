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
import { BackPageButtonComponent } from '../../../shared/back-page-button/back-page-button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersStore } from '../../../store/customers.store';
import { patchState } from '@ngrx/signals';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { ModesEnum } from '../../../core/enums/modes.enum';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [PrimengExportsModule, BackPageButtonComponent, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit, OnDestroy {
  store = inject(CustomersStore);
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  modes = signal(ModesEnum);
  mode = signal<ModesEnum>(ModesEnum.ADD);
  header = signal<string>('');
  actionLabel = signal<string>('');
  customerId = signal<string | null>(null);
  isActionLoading = computed(
    () => this.store.isCustomerAdding() || this.store.isCustomerUpdating()
  );

  customerFormGroup!: FormGroup;

  constructor() {
    effect(() => {
      if (this.store.customerDetail()) {
        this.assignFormValues();
      }
    });
  }

  ngOnInit(): void {
    this.initializeRouteQueryParams();
    this.initializeCustomerFormGroup();
  }

  ngOnDestroy(): void {
    this.store.clearCustomerDetail();
  }

  initializeRouteQueryParams() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.customerId.set(params.get('id'));
      if (this.customerId()) {
        this.store.getCustomer({ id: this.customerId()! });
      }
    });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: any) => {
      switch (params?.mode) {
        case ModesEnum.VIEW:
          this.header.set('Customer Details');
          this.mode.set(ModesEnum.VIEW);
          break;
        case ModesEnum.EDIT:
          this.header.set('Edit Customer Details');
          this.mode.set(ModesEnum.EDIT);
          this.actionLabel.set('Update Customer Details');
          break;
        default:
          this.header.set('Add New Customer');
          this.mode.set(ModesEnum.ADD);
          this.actionLabel.set('Save New Customer');
          break;
      }
    });

    this.route.url.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((segments) => {
      const fullPath = segments.map((segment) => segment.path).join('/');
      if (fullPath.includes('add')) {
      }
    });
  }

  initializeCustomerFormGroup() {
    const disableFields = this.mode() === ModesEnum.VIEW;
    this.customerFormGroup = this.formBuilder.group({
      firstName: [{ value: '', disabled: disableFields }, [Validators.required]],
      lastName: [{ value: '', disabled: disableFields }, [Validators.required]],
      email: [{ value: '', disabled: disableFields }, [Validators.required, Validators.email]],
      phone: [{ value: '', disabled: disableFields }, [Validators.required]]
    });
  }

  assignFormValues() {
    const { firstName, lastName, email, phone } = this.store.customerDetail()!;
    this.customerFormGroup.setValue({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone
    });
  }

  onActionClicked() {
    switch (this.mode()) {
      case ModesEnum.ADD:
        this.store.addCustomer({ payload: this.customerFormGroup.value });
        break;
      case ModesEnum.EDIT:
        this.store.updateCustomer({
          payload: {
            id: this.customerId()!,
            customer: this.customerFormGroup.value
          }
        });
        break;
      default:
        break;
    }
  }
}
