// import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/types';

export const useProductsListStore = defineStore('productsList', () => {
  let list: Product[] = []

  function addOrRemove(product: Product) {
    product.selected = !product.selected
  }

  return { addOrRemove, list }
})
