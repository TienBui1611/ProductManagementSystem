import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  product: Partial<Product> = {};
  originalProduct: Product | null = null;
  productId: string = '';
  
  loading = false;
  submitting = false;
  loadError = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.loading = true;
    this.loadError = '';
    
    // Since we need to get product by MongoDB ID, we'll fetch all products and find the one
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const foundProduct = response.data.find(p => p._id === this.productId);
          if (foundProduct) {
            this.originalProduct = foundProduct;
            this.product = { ...foundProduct };
          } else {
            this.loadError = 'Product not found';
          }
        } else {
          this.loadError = response.error || 'Failed to load product';
        }
        this.loading = false;
      },
      error: (error) => {
        this.loadError = error.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.submitting || !this.originalProduct) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Only send changed fields
    const changes: Partial<Product> = {};
    if (this.product.id !== this.originalProduct.id) changes.id = this.product.id;
    if (this.product.name !== this.originalProduct.name) changes.name = this.product.name;
    if (this.product.description !== this.originalProduct.description) changes.description = this.product.description;
    if (this.product.price !== this.originalProduct.price) changes.price = this.product.price;
    if (this.product.units !== this.originalProduct.units) changes.units = this.product.units;

    if (Object.keys(changes).length === 0) {
      this.errorMessage = 'No changes detected';
      this.submitting = false;
      return;
    }

    this.productService.updateProduct(this.productId, changes).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `Product "${this.product.name}" updated successfully!`;
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        } else {
          this.errorMessage = response.error || 'Failed to update product';
        }
        this.submitting = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.submitting = false;
      }
    });
  }

}