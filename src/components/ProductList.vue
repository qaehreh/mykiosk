<template>
  <div class="main">

    <div class="kate">
      <img src="" alt="">
      <button v-for="category in categories" :key="category" @click="selectedCategory = category">{{
          category
        }}
      </button>
    </div>

    <div class="serch">

      <img alt="검색버튼 이미지" src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png">
      <input
          type="text"
          v-model="search"
          placeholder="상품 검색"
          ref="searchInput"
          @keydown.enter="addFirstSearchedProductToCart"
      />
    </div>

    <div class="cover">

      <div class="main-cart" v-for="product in paginatedProducts" :key="product.id">
        <!-- 이미지를 표시합니다. -->
        <!--    <ul>-->

        <img :src="product.image" @click="$emit('add-to-cart', product)" alt="상품 이미지" width="100" height="100"/>
        <div class="pay">
          {{ product.name }} - {{ product.price }}원

        </div>
        <!--        <button @click="$emit('add-to-cart', product)">장바구니에 담기</button>-->
      </div>
    </div>
    <!--    </ul>-->


    <div id="cart" class="cart" data-totalitems="0">
      <i class="fas fa-shopping-cart"></i>
    </div>

    <div>
      <button class="leftBtn" @click="goToPreviousPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>

      <button class="rightBtn" @click="goToNextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
    <!--    <shopping-cart-->
    <!--        :cart="cart"-->
    <!--        @update-total="updateTotal"-->
    <!--        @remove-item="removeItemFromCart"-->
    <!--        @update-quantity="updateCartItemQuantity"-->
    <!--        @clear-cart="clearCart"-->
    <!--    ></shopping-cart>-->


  </div>
</template>

<script>
import ShoppingCart from "./ShoppingCart.vue";

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
      categories: ["전체 메뉴", "음료", "디저트", "커피", "에이드"],
      selectedCategory: "전체 메뉴",
      products: [
        //숫자넘버를 id === number 다른게 뭐지
        {id: 1, name: "카페라떼", price: 32000, category: "커피", image: "/image/coffee/카페라떼(ICED).png"},
        {id: 2, name: "레몬에이드", price: 50200, category: "음료", image: "/image/ade/레몬에이드.png"},
        {id: 3, name: "콜드브루", price: 202000, category: "커피", image: "/image/coffee/콜드브루.png"},
        {id: 4, name: "아메리카노", price: 40200, category: "커피", image: "/image/coffee/아메리카노(ICED).png"},
        {id: 5, name: "아이스티", price: 25200, category: "음료", image: "/image/tea/아이스티.png"},
        {id: 6, name: "치즈케이크", price: 10200, category: "디저트", image: "/image/dessert/치즈케이크.png"},
        {id: 7, name: "티라미수", price: 55020, category: "디저트", image: "/image/dessert/티라미수.png"},
        {id: 8, name: "고구마라떼", price: 10000, category: "음료", image: "../../image/drink/고구마라떼(ICED).png"},
        {id: 9, name: "녹차프라푸치노", price: 54003, category: "음료", image: "../../image/drink/녹차프라푸치노.png"},
        {id: 10, name: "오곡라떼", price: 1003, category: "음료", image: "../../image/drink/오곡라떼(ICED).png"},
        {id: 11, name: "초코젤라또프라푸치노", price: 40001, category: "음료", image: "../../image/drink/초코젤라또프라푸치노.png"},
        {id: 12, name: "타로버블티", price: 30000, category: "음료", image: "../../image/drink/타로버블티.png"},
        {id: 13, name: "흑당버블티", price: 20000, category: "음료", image: "../../image/drink/흑당버블티.png"},
        {id: 14, name: "블랙밀크버블티", price: 8000, category: "음료", image: "../../image/drink/블랙밀크버블티.png"},
        {id: 15, name: "아쌈", price: 2000, category: "음료", image: "../../image/tea/아쌈.png"},
        {id: 16, name: "아이스티", price: 100, category: "음료", image: "../../image/tea/아이스티.png"},
        {id: 17, name: "고구마케이크", price: 4000, category: "디저트", image: "/image/dessert/고구마케이크.png"},
        {id: 18, name: "오레오마카롱", price: 60000, category: "디저트", image: "/image/dessert/오레오마카롱.png"},
        {id: 19, name: "초코머핀", price: 260000, category: "디저트", image: "/image/dessert/초코머핀.png"},
        {id: 20, name: "플레인크로플", price: 56000, category: "디저트", image: "/image/dessert/플레인크로플.png"},
        {id: 21, name: "블루베리머핀", price: 10000, category: "디저트", image: "/image/dessert/블루베리머핀.png"},
        {id: 22, name: "자두에이드", price: 9000, category: "에이드", image: "/image/ade/자두에이드.png"},
        {id: 23, name: "자몽주스", price: 1500, category: "에이드", image: "/image/ade/자몽주스.png"},
        {id: 24, name: "키위주스", price: 2500, category: "에이드", image: "/image/ade/키위주스.png"},
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
    speak(message) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "ko-KR";
      speechSynthesis.speak(utterance);
    },
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
          this.$refs.searchInput.blur();

        } else {
          this.speak(`존재하지 않는 상품이거나 잘못입력하셨습니다. 다시 입력해 주세요`);
          this.search = ""; // 검색창을 비웁니다.
          this.$refs.searchInput.blur();
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
