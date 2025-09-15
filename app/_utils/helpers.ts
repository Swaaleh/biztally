// app/_utils/helpers.ts
export const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  export interface ValidationErrors {
    name: string;
    price: string;
    stock: string;
  }
  
  export function validateProduct(product: { name: string; price: string; stock: string }) {
    const errors: ValidationErrors = { name: '', price: '', stock: '' };
    let valid = true;
  
    if (!product.name.trim()) {
      errors.name = 'Product name is required.';
      valid = false;
    }
    if (!product.price || parseFloat(product.price) <= 0) {
      errors.price = 'Price must be a positive number.';
      valid = false;
    }
    if (product.stock === '' || parseInt(product.stock, 10) < 0) {
      errors.stock = 'Stock cannot be negative.';
      valid = false;
    }
  
    return { valid, errors };
  }