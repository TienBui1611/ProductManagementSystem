import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  deleting = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data;
          console.log(`✅ Loaded ${response.data.length} products successfully`);
        } else {
          this.error = response.error || 'Failed to load products';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('❌ Error loading products:', error);
      }
    });
  }

  deleteProduct(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.deleting = true;
      
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.products = this.products.filter(p => p._id !== id);
            alert(`Product "${name}" deleted successfully!`);
          } else {
            alert(`Failed to delete product: ${response.error}`);
          }
          this.deleting = false;
        },
        error: (error) => {
          alert(`Error deleting product: ${error.message}`);
          this.deleting = false;
        }
      });
    }
  }
}
