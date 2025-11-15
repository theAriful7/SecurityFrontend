import { Component, OnInit } from '@angular/core';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { CategoryResponseDTO } from 'src/app/models/category.model';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Featured products
  trendingProducts: ProductResponseDTO[] = [];
  bestSellingProducts: ProductResponseDTO[] = [];
  featuredProducts: ProductResponseDTO[] = [];
  newArrivals: ProductResponseDTO[] = [];
  
  // Categories
  categories: CategoryResponseDTO[] = [];
  
  // Loading states
  loading = true;
  categoriesLoading = true;
  
  // Testimonials
  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frequent Shopper',
      comment: 'Amazing platform! Found everything I needed from multiple vendors at great prices.',
      rating: 5,
      image: 'assets/images/testimonial1.jpg'
    },
    {
      name: 'Mike Chen',
      role: 'Business Owner',
      comment: 'The multi-vendor approach gives me access to unique products I cant find elsewhere.',
      rating: 5,
      image: 'assets/images/testimonial2.jpg'
    },
    {
      name: 'Emma Davis',
      role: 'Home Maker',
      comment: 'Fast delivery and excellent customer service. My go-to shopping destination!',
      rating: 4,
      image: 'assets/images/testimonial3.jpg'
    }
  ];

  // Features
  features = [
    {
      icon: 'fas fa-shipping-fast',
      title: 'Free Shipping',
      description: 'Free delivery on orders over $50'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: 'fas fa-undo-alt',
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: 'fas fa-headset',
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ];

  // Stats
  stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Verified Vendors' },
    { number: '50K+', label: 'Products Available' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  loadFeaturedProducts(): void {
    this.loading = true;

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
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading = false;
      }
    });

    // Placeholder for new arrivals
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.newArrivals = products.slice(0, 8);
      },
      error: (error) => {
        console.error('Error loading new arrivals:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoriesLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.slice(0, 8);
        this.categoriesLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categoriesLoading = false;
      }
    });
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

  calculateDiscountPrice(price: number, discount?: number): number {
    return discount ? price - (price * discount / 100) : price;
  }

  getStarRating(rating: number): any[] {
    return Array(5).fill(0).map((_, i) => ({
      filled: i < Math.floor(rating),
      half: i === Math.floor(rating) && rating % 1 !== 0
    }));
  }
}