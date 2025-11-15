import { Component, OnInit } from '@angular/core';
import { CategoryResponseDTO } from 'src/app/models/category.model';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService, ProductFilter } from 'src/app/services/product.service';

@Component({
  selector: 'app-customer-product-list',
  templateUrl: './customer-product-list.component.html',
  styleUrls: ['./customer-product-list.component.css']
})
export class CustomerProductListComponent implements OnInit {
 // Main products
  products: ProductResponseDTO[] = [];
  categories: CategoryResponseDTO[] = [];
  filteredProducts: ProductResponseDTO[] = [];
  
  // Featured sections
  trendingProducts: ProductResponseDTO[] = [];
  bestSellingProducts: ProductResponseDTO[] = [];
  featuredProducts: ProductResponseDTO[] = [];
  newArrivals: ProductResponseDTO[] = [];
  
  // Loading states
  loading = true;
  featuredLoading = true;
  
  // Search and filter
  searchTerm = '';
  selectedCategory: number | null = null;
  priceRange = { min: 0, max: 1000 };
  sortBy = 'name';
  sortDirection = 'asc';
  activeSection = 'all'; // 'all', 'trending', 'bestsellers', 'featured', 'new'

  // Pagination
  currentPage = 0;
  pageSize = 12;
  totalProducts = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.loadFeaturedProducts();
  }

  loadProducts(): void {
    this.loading = true;
    
    const filter: ProductFilter = {
      categoryId: this.selectedCategory || undefined,
      minPrice: this.priceRange.min,
      maxPrice: this.priceRange.max,
      page: this.currentPage,
      size: this.pageSize,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    this.productService.filterProducts(filter).subscribe({
      next: (response) => {
        this.products = response.content || response;
        this.filteredProducts = [...this.products];
        this.totalProducts = response.totalElements || this.products.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadFeaturedProducts(): void {
    this.featuredLoading = true;

    // Load trending products
    this.productService.getTrendingProducts(8).subscribe({
      next: (products) => {
        this.trendingProducts = products;
      },
      error: (error) => {
        console.error('Error loading trending products:', error);
      }
    });

    // Load best selling products
    this.productService.getBestSellingProducts(8).subscribe({
      next: (products) => {
        this.bestSellingProducts = products;
      },
      error: (error) => {
        console.error('Error loading best selling products:', error);
      }
    });

    // Load featured products
    this.productService.getFeaturedProducts(8).subscribe({
      next: (products) => {
        this.featuredProducts = products;
        this.featuredLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.featuredLoading = false;
      }
    });

    // Placeholder for new arrivals (you can implement this later)
    this.newArrivals = [];
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.currentPage = 0;
    
    switch (section) {
      case 'trending':
        this.filteredProducts = this.trendingProducts;
        break;
      case 'bestsellers':
        this.filteredProducts = this.bestSellingProducts;
        break;
      case 'featured':
        this.filteredProducts = this.featuredProducts;
        break;
      case 'new':
        this.filteredProducts = this.newArrivals;
        break;
      default:
        this.filteredProducts = [...this.products];
        break;
    }
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => {
          this.filteredProducts = products;
          this.activeSection = 'all';
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.setActiveSection(this.activeSection);
    }
  }

  onCategoryChange(): void {
    this.currentPage = 0;
    this.activeSection = 'all';
    this.loadProducts();
  }

  onPriceRangeChange(): void {
    this.currentPage = 0;
    this.activeSection = 'all';
    this.loadProducts();
  }

  onSortChange(): void {
    this.currentPage = 0;
    this.activeSection = 'all';
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  calculateDiscountPrice(price: number, discount?: number): number {
    return discount ? price - (price * discount / 100) : price;
  }

  getPrimaryImage(images: any[]): string {
    if (!images || images.length === 0) {
      return 'assets/images/placeholder.jpg';
    }
    const primary = images.find(img => img.isPrimary);
    return primary?.filePath || images[0]?.filePath || 'assets/images/placeholder.jpg';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.jpg';
  }

  addToCart(product: ProductResponseDTO): void {
    // Implement cart functionality
    console.log('Add to cart:', product);
    // You can integrate with CartService here
  }

  addToWishlist(product: ProductResponseDTO): void {
    // Implement wishlist functionality
    console.log('Add to wishlist:', product);
  }

  getDisplayProducts(): ProductResponseDTO[] {
    if (this.activeSection === 'all') {
      return this.filteredProducts;
    }
    return this.filteredProducts;
  }
  getVisiblePages(): number[] {
  const visiblePages = [];
  const startPage = Math.max(0, this.currentPage - 2);
  const endPage = Math.min(this.totalPages - 1, this.currentPage + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }
  return visiblePages;
}
}