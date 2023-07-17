<script setup lang="ts">
import { computed, watch } from 'vue';
import type { Product } from '@/types';
import { useProductsListStore } from '@/stores/productsListStore';

const props = defineProps<{
  product: Product;
}>();

const productsListStore = useProductsListStore();
</script>

<template>
  <div class="card" @click="productsListStore.addOrRemove(props.product)" :class="{'has-border-success': product.selected}">
    <div class="card-image">
      <figure class="image is-4by3">
        <img :src="props.product.image" alt="Product image">
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-6">{{ props.product.description }}</p>
        </div>
      </div>
      <div class="content">
        R${{ (props.product.price * 1) / props.product.unitQty }} / {{ props.product.unit.toUpperCase() }}
        <br>
      </div>
    </div>
  </div>
</template>

<style scoped>
.has-border-success {
  border: 1px solid hsl(204, 86%, 53%)	;
}
</style>
