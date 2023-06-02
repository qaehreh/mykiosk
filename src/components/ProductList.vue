<template>
  <div class="main">

    <div class="kate">
      <img src="" alt="">
      <button
          v-for="category in categories"
          :key="category"
          @click="set(category)"
      >
        {{ category }}
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
      categories: ["전체 메뉴", "커피", "음료", "티", "디저트"],
      selectedCategory: "전체 메뉴",
      products: [
        //숫자넘버를 id === number 다른게 뭐지
        {id: 1, name: "아메리카노(HOT)", price: 3500, category: "커피", image: "/image/coffee/아메리카노(HOT).png"},
        {id: 2, name: "아메리카노(ICED)", price: 4000, category: "커피", image: "/image/coffee/아메리카노(ICED).png"},
        {id: 3, name: "카페라떼(HOT)", price: 4000, category: "커피", image: "/image/coffee/카페라떼(HOT).png"},
        {id: 4, name: "카페라떼(ICED)", price: 4200, category: "커피", image: "/image/coffee/카페라떼(ICED).png"},
        {id: 5, name: "카페모카(HOT)", price: 4500, category: "커피", image: "/image/coffee/카페모카(HOT).png"},
        {id: 6, name: "카페모카(ICED)", price: 4700, category: "커피", image: "/image/coffee/카페모카(ICED).png"},
        {id: 7, name: "카라멜 마끼야또(HOT)", price: 4500, category: "커피", image: "/image/coffee/카라멜마끼아또(HOT).png"},
        {id: 8, name: "카라멜 마끼야또(ICED)", price: 4700, category: "커피", image: "/image/coffee/카라멜마끼아또(ICED).png"},
        {id: 9, name: "콜드브루(HOT)", price: 5000, category: "커피", image: "/image/coffee/콜드브루.png"},
        {id: 10, name: "콜드브루(ICED)", price: 5500, category: "커피", image: "/image/coffee/콜드브루.png"},
        {id: 11, name: "복숭아 아이스티", price: 3000, category: "음료", image: "/image/tea/아이스티.png"},
        {id: 12, name: "레몬 아이스티", price: 3000, category: "음료", image: "/image/tea/아이스티.png"},
        {id: 13, name: "레몬에이드", price: 4000, category: "음료", image: "/image/ade/레몬에이드.png"},
        {id: 14, name: "청포도에이드", price: 4500, category: "음료", image: "/image/ade/청포도에이드.png"},
        {id: 15, name: "자두에이드", price: 5000, category: "음료", image: "/image/ade/자두에이드.png"},
        {id: 16, name: "망고주스", price: 6500, category: "음료", image: "/image/drink/망고주스.png"},
        {id: 17, name: "키위주스", price: 6500, category: "음료", image: "/image/drink/키위주스.png"},
        {id: 18, name: "딸기바나나주스", price: 6700, category: "음료", image: "/image/drink/딸기바나나.png"},
        {id: 19, name: "딸기라떼", price: 4800, category: "음료", image: "/image/drink/딸기라떼.png"},
        {id: 20, name: "고구마라떼", price: 5000, category: "음료", image: "/image/drink/고구마라떼(ICED).png"},
        {id: 21, name: "오곡라떼", price: 5500, category: "음료", image: "/image/drink/오곡라떼(ICED).png"},
        {id: 22, name: "타로버블티", price: 4200, category: "음료", image: "/image/drink/타로버블티.png"},
        {id: 23, name: "흑당버블티", price: 5000, category: "음료", image: "/image/drink/흑당버블티.png"},
        {id: 24, name: "블랙밀크티", price: 5000, category: "음료", image: "/image/tea/블랙밀크버블티.png"},
        {id: 24, name: "녹차(HOT)", price: 2000, category: "티", image: "/image/tea/녹차.png"},
        {id: 25, name: "녹차(ICED)", price: 2500, category: "티", image: "/image/tea/녹차.png"},
        {id: 26, name: "국화차(HOT)", price: 3500, category: "티", image: "/image/tea/국화.png"},
        {id: 27, name: "국화차(ICED)", price: 4000, category: "티", image: "/image/tea/국화.png"},
        {id: 28, name: "얼그레이(HOT)", price: 3500, category: "티", image: "/image/tea/얼그레이.png"},
        {id: 29, name: "얼그레이(ICED)", price: 4000, category: "티", image: "/image/tea/얼그레이.png"},
        {id: 30, name: "민트(HOT)", price: 3500, category: "티", image: "/image/tea/페퍼민트.png"},
        {id: 31, name: "민트(ICED)", price: 4000, category: "티", image: "/image/tea/페퍼민트.png"},
        {id: 32, name: "레몬차(HOT)", price: 4500, category: "티", image: "/image/tea/레몬티.png"},
        {id: 33, name: "레몬차(ICED)", price: 4700, category: "티", image: "/image/tea/레몬티.png"},
        {id: 34, name: "유자차(HOT)", price: 4000, category: "티", image: "/image/tea/유자차.png"},
        {id: 35, name: "유자차(ICED)", price: 4200, category: "티", image: "/image/tea/유자차.png"},
        {id: 36, name: "생강차(HOT)", price: 4000, category: "티", image: "/image/tea/생강차.jfif"},
        {id: 37, name: "생강차(ICED)", price: 4200, category: "티", image: "/image/tea/생강.jfif"},
        {id: 38, name: "티라미수", price: 6000, category: "디저트", image: "/image/dessert/티라미수.png"},
        {id: 39, name: "생크림케이크", price: 6000, category: "디저트", image: "/image/dessert/생크림케이크.png"},
        {id: 40, name: "치즈케이크", price: 6500, category: "디저트", image: "/image/dessert/치즈케이크.png"},
        {id: 41, name: "고구마케이크", price: 6500, category: "디저트", image: "/image/dessert/고구마케이크.png"},
        {id: 42, name: "초코머핀", price: 4500, category: "디저트", image: "/image/dessert/초코머핀.png"},
        {id: 43, name: "블루베리머핀", price: 4500, category: "디저트", image: "/image/dessert/블루베리머핀.png"},
        {id: 44, name: "오레오마카롱", price: 2500, category: "디저트", image: "/image/dessert/오레오마카롱.png"},
        {id: 45, name: "플레인크로플", price: 5000, category: "디저트", image: "/image/dessert/플레인크로플.png"},
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
    set(category) {
      this.selectedCategory = category;
      this.currentPage = 1;
      console.log(this.currentPage)
    },
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
