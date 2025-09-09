import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product: Omit<Product, '_id'> = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    units: 0
  };

  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.addProduct(this.product).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `Product "${this.product.name}" added successfully!`;
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 1500);
        } else {
          this.errorMessage = response.error || 'Failed to add product';
        }
        this.submitting = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.product = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      units: 0
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}