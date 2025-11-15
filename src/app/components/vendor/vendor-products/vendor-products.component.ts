import { Component, OnInit } from '@angular/core';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { Vendor } from 'src/app/models/vendor.model';
import { ProductService } from 'src/app/services/product.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-products',
  templateUrl: './vendor-products.component.html',
  styleUrls: ['./vendor-products.component.css']
})
export class VendorProductsComponent implements OnInit {
  products: ProductResponseDTO[] = [];
  vendor: Vendor | null = null;
  loading = true;
  searchTerm = '';
  statusFilter = 'ALL';

  constructor(
    private productService: ProductService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.loadVendorProducts();
  }

  loadVendorProducts(): void {
    this.loading = true;
    
    this.vendorService.getCurrentVendor().subscribe({
      next: (vendor) => {
        this.vendor = vendor;
        if (vendor.id) {
          this.productService.getVendorProducts(vendor.id).subscribe({
            next: (products) => {
              this.products = products;
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading products:', error);
              this.loading = false;
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading vendor:', error);
        this.loading = false;
      }
    });
  }

  get filteredProducts(): ProductResponseDTO[] {
    let filtered = this.products;

    if (this.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(product => product.status === this.statusFilter);
    }

    return filtered;
  }

  deleteProduct(productId: number): void {
    if (!this.vendor?.id) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId, this.vendor.id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== productId);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }

  updateProductStatus(productId: number, newStatus: string): void {
    // Implement status update logic
    console.log('Update product status:', productId, newStatus);
  }

  getStockStatus(stock: number): { text: string, class: string } {
    if (stock > 10) return { text: 'In Stock', class: 'text-green-600 bg-green-100' };
    if (stock > 0) return { text: 'Low Stock', class: 'text-orange-600 bg-orange-100' };
    return { text: 'Out of Stock', class: 'text-red-600 bg-red-100' };
  }
}
