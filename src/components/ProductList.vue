<template>
  <div>
    <h2>상품 목록</h2>
    <input type="text" v-model="search" placeholder="상품 검색" />
    <ul>
      <li v-for="product in filteredProducts" :key="product.id">
        {{ product.name }} - {{ product.price }}원
        <button @click="addToCart(product)">장바구니에 추가</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      products: [
        { id: 1, name: "휴지", price: 3000 },
        { id: 2, name: "설탕", price: 5000 },
        { id: 3, name: "쌀", price: 20000 },
        { id: 4, name: "라면", price: 4000 },
        { id: 5, name: "계란", price: 2500 },
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
          product.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    addToCart(product) {
      this.$emit("add-to-cart", product);
    },
  },
};
</script>
