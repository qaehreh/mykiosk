<template>
  <div class="main">

    <div class="kate">
      <button v-for="category in categories" :key="category" @click="selectedCategory = category">{{ category }}</button>
    </div>

    <div class="serch">
      <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png">
    <input
        type="text"
        v-model="search"
        placeholder="상품 검색"
        ref="searchInput"
        @keydown.enter="addFirstSearchedProductToCart"
    />
    </div>
  <div class="cart">
<!--    <ul>-->
      <div class="main-cart" v-for="product in paginatedProducts" :key="product.id">
        <!-- 이미지를 표시합니다. -->
        <img :src="product.image" @click="$emit('add-to-cart', product)" alt="상품 이미지" width="100" height="100" />
        <div class="pay">
        {{ product.name }} - {{ product.price }}원

        </div>
<!--        <button @click="$emit('add-to-cart', product)">장바구니에 담기</button>-->
      </div>
<!--    </ul>-->
  </div>

    <div id="cart" class="cart" data-totalitems="0">
      <i class="fas fa-shopping-cart"></i>
    </div>

    <div>
      <button @click="goToPreviousPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
<!--    <shopping-cart-->
<!--        :cart="cart"-->
<!--        @update-total="updateTotal"-->
<!--        @remove-item="removeItemFromCart"-->
<!--        @update-quantity="updateCartItemQuantity"-->
<!--        @clear-cart="clearCart"-->
<!--    ></shopping-cart>-->

<!--    <div>총 가격: {{ total }}원</div>-->
  </div>
</template>

<script>
import ShoppingCart from "./ShoppingCart.vue";
import $ from 'jquery';
export default {
  components: {
    ShoppingCart,

  },
  data() {

    return {
      cart: [],
      total: 0,
      search: "",
      currentPage: 1,
      itemsPerPage: 8,
      categories: ["전체 메뉴", "음료", "디저트","커피"],
      selectedCategory: "전체 메뉴",
      products: [
          //숫자넘버를 id === number 다른게 뭐지
        { id: 1, name: "카페라떼", price: 3000, category: "커피", image:"/image/coffee/카페라떼(ICED).png"},
        { id: 2, name: "레몬에이드", price: 5000, category: "음료", image:"/image/ade/레몬에이드.png"},
        { id: 3, name: "콜드브루", price: 20000, category: "커피", image:"/image/coffee/콜드브루.png" },
        { id: 4, name: "아메리카노", price: 4000, category: "커피", image:"/image/coffee/아메리카노(ICED).png" },
        { id: 5, name: "아이스티", price: 2500, category: "음료", image:"/image/tea/아이스티.png"  },
        { id: 6, name: "치즈케이크", price: 5000, category: "디저트" , image:"/image/dessert/치즈케이크.png"},
        { id: 7, name: "티라미수", price: 5500, category: "디저트", image:"/image/dessert/티라미수.png" },
        { id: 8, name: "물3", price: 123444,category:"음료", image:"/image/tea/아이스티.png"},
        { id: 9, name: "물4", price: 54003 },
        { id: 10, name: "물5", price: 10203 , category: "음료"  },
        { id: 11, name: "물6", price: 4124, category: "음료"  },
        { id: 12, name: "물6", price: 12351235 , category: "음료" },
        { id: 13, name: "물6", price: 213512341 , category: "음료" },
        { id: 14, name: "물6", price: 1235124 },
        { id: 15, name: "물6", price: 52324 },
        { id: 16, name: "물6", price: 23415 },
        { id: 17, name: "물6", price: 235234 },
        { id: 18, name: "물6", price: 2351 },
        { id: 19, name: "물6", price: 23513 },
      ],
    };
  },
  props: {
    purchaseHistory: Object,

  },
  computed: {
    // total() {
    //   const totalValue = this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    //   this.$emit("update-total", totalValue);
    //   return totalValue;
    // },
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

    animateCart() {
      const cartElement = document.getElementById("cart");
      cartElement.classList.add("added-to-cart");

      setTimeout(() => {
        cartElement.classList.remove("added-to-cart");
      }, 300);
    },
    // updateTotal(newTotal) {
    //   this.total = newTotal;
    // },

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
      this.animateCart();
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
