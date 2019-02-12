import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSkuListingComponent } from './product-sku-listing.component';

describe('ProductSkuListingComponent', () => {
  let component: ProductSkuListingComponent;
  let fixture: ComponentFixture<ProductSkuListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSkuListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSkuListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
