import { Component, OnInit } from '@angular/core';
import { CategoryResponseDTO } from 'src/app/models/category.model';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { ProductStatus } from 'src/app/models/productStatus.model';
import { Vendor } from 'src/app/models/vendor.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: ProductResponseDTO[] = [];
  filteredProducts: ProductResponseDTO[] = [];
  categories: CategoryResponseDTO[] = [];
  vendors: Vendor[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = 'ALL';
  selectedVendor: string = 'ALL';
  selectedStatus: string = 'ALL';
  
  isLoading = false;
  showProductModal = false;
  selectedProduct: ProductResponseDTO | null = null;

  statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load products
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });

    // Load categories
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });

    // Load vendors
    this.vendorService.getAllVendors().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
      },
      error: (error) => {
        console.error('Error loading vendors:', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = this.selectedCategory === 'ALL' || 
        product.categoryName === this.selectedCategory;
      
      const matchesVendor = this.selectedVendor === 'ALL' || 
        product.vendorId?.toString() === this.selectedVendor;
      
      const matchesStatus = this.selectedStatus === 'ALL' || 
        product.status === this.selectedStatus;
      
      return matchesSearch && matchesCategory && matchesVendor && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  viewProductDetails(product: ProductResponseDTO): void {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  updateProductStatus(product: ProductResponseDTO, newStatus: ProductStatus): void {
    this.productService.changeProductStatus(product.id, newStatus).subscribe({
      next: (updatedProduct) => {
        // Update the product in the list
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating product status:', error);
        alert('Error updating product status');
      }
    });
  }

  getStatusBadgeClass(status: ProductStatus): string {
    switch (status) {
      case ProductStatus.ACTIVE: return 'bg-green-100 text-green-800';
      case ProductStatus.INACTIVE: return 'bg-gray-100 text-gray-800';
      case ProductStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case ProductStatus.REJECTED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  }
}
