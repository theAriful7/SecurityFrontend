import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryResponseDTO } from 'src/app/models/category.model';
import { FileDataDTO } from 'src/app/models/file-data.model';
import { SubCategoryResponseDTO } from 'src/app/models/sub-category.model';
import { Vendor } from 'src/app/models/vendor.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { VendorService } from 'src/app/services/vendor.service';


interface UploadedImage {
  file?: File;
  previewUrl: string;
  altText: string;
  isPrimary: boolean;
  uploaded: boolean;
  fileData?: FileDataDTO;
}

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  categories: CategoryResponseDTO[] = [];
  subCategories: SubCategoryResponseDTO[] = [];
  vendor: Vendor | null = null;
  loading = false;
  submitting = false;
  uploading = false;
  uploadProgress = 0;

  uploadedImages: UploadedImage[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private vendorService: VendorService,
    private authService: AuthService,
    private router: Router
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('AddProductComponent initialized');
    this.loadVendorAndCategories();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      subCategoryId: [''],
      brand: [''],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      specifications: this.fb.array([])
    });
  }

  // Form Array Getters
  get specifications(): FormArray {
    return this.productForm.get('specifications') as FormArray;
  }

  // Individual control getters for template
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get discount() { return this.productForm.get('discount'); }

  // Upload progress getters
  get uploadedImagesCount(): number {
    return this.uploadedImages?.length || 0;
  }

  get uploadedCompletedCount(): number {
    return this.uploadedImages?.filter(img => img.uploaded).length || 0;
  }

  get uploadProgressPercentage(): number {
    if (this.uploadedImagesCount === 0) return 0;
    return Math.round((this.uploadedCompletedCount / this.uploadedImagesCount) * 100);
  }

  loadVendorAndCategories(): void {
    this.loading = true;
    console.log('Loading vendor and categories...');

    // Load vendor first
    this.loadVendor().then(() => {
      // Then load categories
      this.loadCategories();
    }).catch(error => {
      console.error('Failed to load vendor:', error);
      this.loading = false;
      alert('Failed to load vendor profile. Please make sure you are registered as a vendor.');
    });
  }

  async loadVendor(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Loading vendor from /vendors/my-profile...');
      
      // ✅ Use the correct endpoint that exists in backend
      this.vendorService.getCurrentVendor().subscribe({
        next: (vendor) => {
          console.log('✅ Vendor loaded successfully:', vendor);
          this.vendor = vendor;
          resolve();
        },
        error: (error) => {
          console.error('❌ Error loading vendor:', error);
          
          // If vendor profile doesn't exist, guide user to register as vendor
          if (error.status === 404 || error.status === 500) {
            this.handleVendorNotRegistered();
          }
          reject(error);
        }
      });
    });
  }

  handleVendorNotRegistered(): void {
    const register = confirm(
      'You need to register as a vendor first. Would you like to register now?'
    );
    
    if (register) {
      this.router.navigate(['/vendor/register']);
    }
  }

  loadCategories(): void {
    console.log('Loading categories...');
    
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        console.log('Categories loaded:', categories);
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        alert('Failed to load categories. Please refresh the page.');
      }
    });
  }

  onCategoryChange(): void {
    const categoryId = this.productForm.get('categoryId')?.value;
    console.log('Category changed:', categoryId);
    
    if (categoryId) {
      this.categoryService.getSubCategoriesByCategory(categoryId).subscribe({
        next: (subCategories) => {
          console.log('Subcategories loaded:', subCategories);
          this.subCategories = subCategories;
          // Reset subcategory when category changes
          this.productForm.patchValue({ subCategoryId: '' });
        },
        error: (error) => {
          console.error('Error loading subcategories:', error);
          this.subCategories = [];
        }
      });
    } else {
      this.subCategories = [];
    }
  }

  // File Upload Methods
  onFileSelected(event: any): void {
    console.log('File selected:', event.target.files);
    const files: FileList = event.target.files;
    this.processFiles(files);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    console.log('File dropped');
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
    this.removeDragOverStyles();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    element.classList.add('border-blue-500', 'bg-blue-50');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.removeDragOverStyles();
  }

  private removeDragOverStyles(): void {
    const elements = document.querySelectorAll('[class*="border-dashed"]');
    elements.forEach(el => {
      el.classList.remove('border-blue-500', 'bg-blue-50');
    });
  }

  private processFiles(files: FileList): void {
    console.log('Processing files:', files.length);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        continue;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        continue;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const uploadedImage: UploadedImage = {
          file: file,
          previewUrl: e.target.result,
          altText: file.name,
          isPrimary: this.uploadedImages.length === 0, // First image is primary by default
          uploaded: false
        };
        this.uploadedImages.push(uploadedImage);
        console.log('Image added to upload queue:', uploadedImage);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number): void {
    console.log('Removing image at index:', index);
    const removedImage = this.uploadedImages[index];
    
    // If removing primary image, set another image as primary
    if (removedImage.isPrimary && this.uploadedImages.length > 1) {
      const nextIndex = index === 0 ? 1 : 0;
      this.uploadedImages[nextIndex].isPrimary = true;
    }
    
    this.uploadedImages.splice(index, 1);
  }

  setPrimaryImage(index: number): void {
    console.log('Setting primary image:', index);
    this.uploadedImages.forEach((img, i) => {
      img.isPrimary = i === index;
    });
  }

  async uploadImages(): Promise<FileDataDTO[]> {
    if (!this.uploadedImages || this.uploadedImages.length === 0) {
      console.log('No images to upload');
      return [];
    }

    this.uploading = true;
    this.uploadProgress = 0;
    const uploadedFileData: FileDataDTO[] = [];

    console.log('Starting upload of', this.uploadedImages.length, 'images');

    try {
      for (let i = 0; i < this.uploadedImages.length; i++) {
        const image = this.uploadedImages[i];
        
        // Skip if already uploaded or no file
        if (!image.file || image.uploaded) {
          if (image.fileData) {
            uploadedFileData.push(image.fileData);
          }
          continue;
        }

        console.log(`Uploading image ${i + 1}/${this.uploadedImages.length}:`, image.file.name);

        // Upload the file
        const response = await this.productService.uploadProductImage(image.file).toPromise();
        if (response) {
          const fileData: FileDataDTO = {
            ...response,
            altText: image.altText,
            sortOrder: i,
            isPrimary: image.isPrimary
          };
          uploadedFileData.push(fileData);
          
          // Update the image status
          image.uploaded = true;
          image.fileData = fileData;
          
          // Update progress
          this.uploadProgress = Math.round(((i + 1) / this.uploadedImages.length) * 100);
          console.log(`Image ${i + 1} uploaded successfully`);
        }
      }
      
      console.log('All images uploaded successfully:', uploadedFileData.length);
      return uploadedFileData;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      this.uploading = false;
      this.uploadProgress = 0;
    }
  }

  // Specification Methods
  addSpecification(): void {
    console.log('Adding specification');
    const specificationGroup = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
      displayOrder: [this.specifications.length]
    });
    this.specifications.push(specificationGroup);
  }

  removeSpecification(index: number): void {
    console.log('Removing specification:', index);
    this.specifications.removeAt(index);
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  // Form Submission
  async onSubmit(): Promise<void> {
    console.log('=== FORM SUBMISSION STARTED ===');
    
    // Step 1: Check vendor
    if (!this.vendor?.id) {
      console.log('❌ NO VENDOR ID - Current vendor:', this.vendor);
      alert('Vendor information not loaded. Please make sure you are registered as a vendor.');
      return;
    }
    console.log('✅ Vendor ID:', this.vendor.id);

    // Step 2: Check form validity
    if (this.productForm.invalid) {
      console.log('❌ FORM INVALID');
      this.markFormGroupTouched();
      alert('Please fill all required fields correctly.');
      return;
    }
    console.log('✅ Form is valid');

    // Step 3: Check images
    if (this.uploadedImages.length === 0) {
      console.log('❌ NO IMAGES');
      alert('Please upload at least one product image.');
      return;
    }
    console.log('✅ Images count:', this.uploadedImages.length);

    this.submitting = true;
    console.log('🔄 Starting submission process...');

    try {
      // Step 4: Upload images
      console.log('📤 Uploading images...');
      const uploadedImages = await this.uploadImages();
      console.log('✅ Images uploaded:', uploadedImages.length);

      if (uploadedImages.length === 0) {
        throw new Error('No images were successfully uploaded');
      }

      // Step 5: Prepare data
      const productData: any = {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        price: this.productForm.get('price')?.value,
        stock: this.productForm.get('stock')?.value,
        categoryId: this.productForm.get('categoryId')?.value,
        brand: this.productForm.get('brand')?.value || '',
        discount: this.productForm.get('discount')?.value || 0,
        images: uploadedImages,
        specifications: []
      };

      // Add subcategory if selected
      const subCategoryId = this.productForm.get('subCategoryId')?.value;
      if (subCategoryId) {
        productData.subCategoryId = subCategoryId;
      }

      // Add specifications
      const specs = this.specifications.value.filter((spec: any) => spec.key && spec.value);
      if (specs.length > 0) {
        productData.specifications = specs;
      }

      console.log('📦 Final product data:', productData);

      // Step 6: Create product
      console.log('🚀 Calling product service...');
      this.productService.createProduct(this.vendor.id, productData).subscribe({
        next: (product) => {
          console.log('🎉 PRODUCT CREATED SUCCESSFULLY:', product);
          this.submitting = false;
          
          // Show success message
          alert('Product created successfully!');
          
          // Navigate to products list
          this.router.navigate(['/vendor/products']);
        },
        error: (error) => {
          console.error('💥 PRODUCT CREATION FAILED:', error);
          this.submitting = false;
          
          let errorMessage = 'Failed to create product. ';
          if (error.status === 401) {
            errorMessage += 'Please login again.';
          } else if (error.status === 403) {
            errorMessage += 'You do not have permission to create products.';
          } else if (error.error?.message) {
            errorMessage += error.error.message;
          } else {
            errorMessage += 'Please try again.';
          }
          
          alert(errorMessage);
        }
      });

    } catch (error: any) {
      console.error('💥 UPLOAD PROCESS FAILED:', error);
      this.submitting = false;
      alert('Failed to upload images: ' + (error.message || 'Please try again.'));
    }
  }
}
