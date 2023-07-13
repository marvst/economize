<script setup lang="ts">
  import type { Product } from '@/types';

  const props = defineProps<{
    product: Product;
  }>();

</script>

<template>
  <div class="card">
      <div class="card-image">
        <figure class="image is-4by3">
          <img :src="product.image" alt="Product image">
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-6">{{ product.description }}</p>
          </div>
        </div>
        <div class="content">
          R${{ (product.price * 1) / product.unitQty }} / {{ product.unit.toUpperCase() }}
          <br>
        </div>
      </div>
    </div>
</template>

<style scoped>
</style>
