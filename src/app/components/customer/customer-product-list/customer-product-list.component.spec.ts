import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProductListComponent } from './customer-product-list.component';

describe('CustomerProductListComponent', () => {
  let component: CustomerProductListComponent;
  let fixture: ComponentFixture<CustomerProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
