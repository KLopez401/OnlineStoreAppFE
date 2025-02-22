import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackPageButtonComponent } from './back-page-button.component';

describe('BackPageButtonComponent', () => {
  let component: BackPageButtonComponent;
  let fixture: ComponentFixture<BackPageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackPageButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackPageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
