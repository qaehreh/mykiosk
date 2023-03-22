<template>
  <div>
    <div>
      <button v-for="category in categories" :key="category" @click="selectedCategory = category">{{ category }}</button>
    </div>
    <input
        type="text"
        v-model="search"
        placeholder="상품 검색"
        ref="searchInput"
        @keydown.enter="addFirstSearchedProductToCart"
    />
    <ul>
      <li v-for="product in paginatedProducts" :key="product.id">
        <!-- 이미지를 표시합니다. -->
        <img :src="product.image" alt="상품 이미지" width="100" height="100" />
        {{ product.name }} - {{ product.price }}원
        <button @click="$emit('add-to-cart', product)">장바구니에 담기</button>
      </li>
    </ul>
    <div>
      <button @click="goToPreviousPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      currentPage: 1,
      itemsPerPage: 8,
      categories: ["전체 메뉴", "음료", "디저트"],
      selectedCategory: "전체 메뉴",
      products: [
        { id: 1, name: "카페라떼", price: 3000, category: "커피", image: "data:image/jpeg;base64,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", },
        { id: 2, name: "딸기스무디", price: 5000 },
        { id: 3, name: "아이스티", price: 20000, category: "음료" },
        { id: 4, name: "아메리카노", price: 4000, category: "커피" },
        { id: 5, name: "미숫가루", price: 2500, category: "음료"  },
        { id: 6, name: "치즈케이크", price: 5000, category: "디저트" },
        { id: 7, name: "티라미수", price: 5500, category: "디저트" },
        { id: 8, name: "물3", price: 5002 },
        { id: 9, name: "물4", price: 5003 },
        { id: 10, name: "물5", price: 5004 , category: "음료"  },
        { id: 11, name: "물6", price: 5005, category: "음료"  },
        { id: 12, name: "물6", price: 5005 , category: "음료" },
        { id: 13, name: "물6", price: 5005 , category: "음료" },
        { id: 14, name: "물6", price: 5005 },
        { id: 15, name: "물6", price: 5005 },
        { id: 16, name: "물6", price: 5005 },
        { id: 17, name: "물6", price: 5005 },
        { id: 18, name: "물6", price: 5005 },
        { id: 19, name: "물6", price: 5005 },
      ],
    };
  },
  computed: {

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    filteredProducts() {
      return this.products.filter(
          (product) =>
              (this.search === "" || product.name.includes(this.search)) &&
              (this.selectedCategory === "전체 메뉴" || product.category === this.selectedCategory)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
  },
  methods: {
    addFirstSearchedProductToCart() {
      // 검색창이 비어 있지 않은 경우에만 상품을 추가합니다.
      if (this.search.trim() !== "") {
        const searchedProducts = this.filteredProducts;
        if (searchedProducts.length > 0) {
          this.$emit("add-to-cart", searchedProducts[0]);
          this.search = ""; // 검색창을 비웁니다.
        }
      }
    },
    addToCart(product) {
      this.$emit("add-to-cart", product);
    },
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
      }
    },
  },
};
</script>
