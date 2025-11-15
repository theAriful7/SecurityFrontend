import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductResponseDTO } from 'src/app/models/product.model';
import { ReviewResponseDTO } from 'src/app/models/review.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartItemService } from 'src/app/services/cart-item.service';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-customer-product-detail',
  templateUrl: './customer-product-detail.component.html',
  styleUrls: ['./customer-product-detail.component.css']
})
export class CustomerProductDetailComponent implements OnInit {
   product: ProductResponseDTO | null = null;
  relatedProducts: ProductResponseDTO[] = [];
  reviews: ReviewResponseDTO[] = [];
  selectedQuantity = 1;
  loading = true;
  addingToCart = false;
  currentUser: any = null;
  activeTab = 'description';
  averageRating = 0;
  totalReviews = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cartItemService: CartItemService,
    private authService: AuthService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
      this.loadReviews(productId);
    });
  }

  loadProduct(productId: number): void {
    this.loading = true;
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loadRelatedProducts(productId);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(productId: number): void {
    this.productService.getSimilarProducts(productId, 4).subscribe({
      next: (products) => {
        this.relatedProducts = products;
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  loadReviews(productId: number): void {
    this.reviewService.getReviewsByProduct(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateRatingStats();
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  calculateRatingStats(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      this.totalReviews = 0;
      return;
    }

    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = total / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }

  addToCart(): void {
    if (!this.product || !this.authService.isAuthenticated()) {
      // Redirect to login or show message
      return;
    }

    this.addingToCart = true;
    
    if (!this.currentUser?.id) return;

    // Get user's cart or create one
    this.cartService.getCartByUser(this.currentUser.id).subscribe({
      next: (cart) => {
        const cartItemRequest = {
          cartId: cart.id,
          productId: this.product!.id,
          quantity: this.selectedQuantity
        };

        this.cartItemService.createCartItem(cartItemRequest).subscribe({
          next: () => {
            this.addingToCart = false;
            // Show success message
            this.showSuccessMessage('Product added to cart!');
          },
          error: (error) => {
            console.error('Error adding to cart:', error);
            this.addingToCart = false;
            this.showErrorMessage('Failed to add product to cart');
          }
        });
      },
      error: (error) => {
        console.error('Error getting cart:', error);
        this.addingToCart = false;
        this.showErrorMessage('Failed to add product to cart');
      }
    });
  }

  showSuccessMessage(message: string): void {
    // You can implement a toast notification here
    console.log('Success:', message);
  }

  showErrorMessage(message: string): void {
    // You can implement a toast notification here
    console.error('Error:', message);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
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

  getStockStatus(stock: number): { text: string, class: string } {
    if (stock > 10) return { text: 'In Stock', class: 'text-green-600' };
    if (stock > 0) return { text: `Only ${stock} left`, class: 'text-orange-600' };
    return { text: 'Out of Stock', class: 'text-red-600' };
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('full');
      } else if (i - rating < 1) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  getRatingPercentage(rating: number): number {
    return (this.reviews.filter(review => review.rating === rating).length / this.totalReviews) * 100;
  }
}

