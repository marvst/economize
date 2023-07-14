<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'

import { ref } from 'vue'
import type { Product } from '@/types';

const fetchSpaniProducts = async (searchText: string): Promise<Product[]> => {
    const response = await fetch(`https://api.spanionline.com.br/v1/loja/buscas/produtos/filial/1/centro_distribuicao/9/termo/${searchText.split(' ').join('+')}?`, {
        headers: {
            Authorization: `Bearer Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2aXBjb21tZXJjZSIsImF1ZCI6ImFwaS1hZG1pbiIsInN1YiI6IjZiYzQ4NjdlLWRjYTktMTFlOS04NzQyLTAyMGQ3OTM1OWNhMCIsInZpcGNvbW1lcmNlQ2xpZW50ZUlkIjpudWxsLCJpYXQiOjE2NzI4NTE1NzEsInZlciI6MSwiY2xpZW50IjpudWxsLCJvcGVyYXRvciI6bnVsbCwib3JnIjoiNjcifQ.XeP900r-x9IEpBPQxkWqGJjZQDD-Q-3200EJWOqmqOh4L5H7Bbv5GxoNAYv7jn5kxLLi6qBhzJjaAe_eOHe1iw`
        }
    });

    if (!response.ok) {
        throw new Error('Error: ' + response.status);
    }

    const data = await response.json();

    let products: Product[] = [];

    data.data.produtos.forEach((element: any) => {
        let product: Product = {
            id: element.produto_id,
            description: element.descricao,
            price: element.preco,
            unit: element.unidade_sigla,
            unitQty: element.quantidade_unidade_diferente,
            weight: element.descricao.match(/\d+(kg|g)/g),
            image: `https://s3.amazonaws.com/produtos.vipcommerce.com.br/144x144/${element.imagem}`,
            vendor: 'spani'
        }

        products.push(product)
    });

    return products;
}

const fetchNagumoProducts = async (searchText: string): Promise<Product[]> => {
    const response = await fetch(`https://www.nagumo.com.br/api/b2c/product?store_id=2700&text=${searchText.split(' ').join('+')}?`, {
        headers: {
            Authorization: `Bearer MmWPKTl5v1O0mnrcoOvxqZaiGKXCmc7m-WpDsClzlG7zPD8fPxzTdl-eUUX_1qkjpTZwkY9WukZZp7Kr1WSIfRUPhvy0QGzAhNu-x_b-ul_svp0xgtuRa2CSLdQe4dKo2IE568xpY-rxtQHme3xHDeYhTHc9mUe58Mu2ikwT4tGD3VDemIkzAFXbYDaVOLi7jKMDN-Ks8jatEcyMO7kx9sVyXvi4wJWRuFsT_RifFaqPTZH-1znfvSzCDgR0xd-GUGvIwXYJK5t09rylyvlX_bQdEaGy9VnP0mhuaXqPxZoT2ZSH`,
            Referer: "https://www.nagumo.com.br/lorena-lj48-lorena-vila-hepacare-avenida-coronel-jose-vicente/promocoes",
            "sm-token": "{'Location':{'Latitude':-22.7247349,'Longitude':-45.1272269},'IdClientAddress':25678266,'IsDelivery':false,'IdLoja':2700,'IdRede':884,'DateBuild':'2023-01-04T13:48:58.6622055'}"
        }
    });

    if (!response.ok) {
        throw new Error('Error: ' + response.status);
    }

    const data = await response.json();

    let products: Product[] = [];

    data.products.forEach((element: any) => {
        let product: Product = {
            id: element.idProduct,
            description: element.excerpt,
            price: element.prices[0].price,
            unit: element.weight.includes('kg') ? 'kg' : 'UN',
            unitQty: 1,
            weight: element.weight,
            image: element.image,
            vendor: 'nagumo'
        }

        products.push(product)
    });
    
    return products;
}

const defineAccuracy = (searchText: string, products: Product[]): Product[] => {
    const textWords: string[] = searchText.toLowerCase().split(" ");

    products.forEach((product) => {
        const productWords: string[] = product.description.toLowerCase().replace(/[^\w\s]/g, '').split(" ");
        const matchingWords: string[] = textWords.filter((word) => productWords.includes(word));

        const accuracy: number = (matchingWords.length / productWords.length) * 100;

        product.accuracy = accuracy;
    });

    return products
}

const searchFor = async (searchText: string): Promise<Product[]> => {
    const listOfProductsFromSpani = await fetchSpaniProducts(searchText);
    const listOfProductsFromNagumo = await fetchNagumoProducts(searchText);

    const allProducts = [
        ...(listOfProductsFromSpani || []),
        ...(listOfProductsFromNagumo || [])
    ];

    const allProductsWithAccuracy = defineAccuracy(searchText, allProducts);

    return allProductsWithAccuracy
}

let results = ref<Product[] | null>(null);
const searchText = ref('');
const searchedText = ref('');
const loading = ref(false)

async function search() {
  console.log("Searching for " + searchText.value);

  loading.value = true
  
  results.value = await searchFor(searchText.value);

  loading.value = false

  searchedText.value = searchText.value

  filter('spani')
  activeTab.value = 'spani'
}

let filteredResults = ref<Product[] | null>(null);
let activeTab = ref('spani')

function filter(vendor: string) {
  if (results.value) {
    filteredResults.value = results.value.filter((product) => product.vendor === vendor);
  }
}
</script>

<template>
  <main>
    <br />
    <div class="block">
      <section class="hero is-link">
        <div class="hero-body">
          <p class="title">
            Pesquisar produto
          </p>
          <div class="columns">
            <div class="column is-full-height">
              <input type="text" v-model="searchText" @keyup.enter="search" class="input is-normal" placeholder="Pesquise pelo nome do produto e aperte enter" />
            </div>
            <!-- <div class="column">
              <button class="button" @click="search">Pesquisar</button>
            </div> -->
          </div>
        </div>
      </section>
    </div>
    <div class="block">
      <p class="title is-5">Resultados para: {{ searchedText }}</p>
    </div>
    <div class="block">
      <div class="tabs">
        <ul>
          <li :class="{'is-active': activeTab == 'spani'}">
            <a @click="filter('spani')">
              <span class="icon is-small">
                <img src="../assets/spani-logo.png" alt="" srcset="">
              </span>
              <span>Spani</span>
            </a>
          </li>
          <li :class="{'is-active': activeTab == 'nagumo'}">
            <a @click="filter('nagumo')">
              <span class="icon is-small">
                <img src="../assets/nagumo-logo.png" alt="" srcset="">
              </span>
              <span>Nagumo</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="block">
      <div class="block" v-if="loading">Pesquisando...</div>
      <div class="columns is-multiline" v-if="!loading">
        <div class="column is-2" v-for="product in filteredResults">
          <ProductCard :product=product />
        </div>
      </div>
    </div>
  </main>
</template>
