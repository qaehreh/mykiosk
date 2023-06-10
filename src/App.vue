<template>
  <meta name="mobile-web-app-capable" content="yes">
  <link rel="manifest" href="../manifest.json">

  <div id="app">
  <div v-if="main===true" @changed="this.main=!this.main" >
    <main-page @next="changed"></main-page>
  </div>

<div v-else>
  <div v-if="place === true" @place="this.place=!this.place" >
    <Place @select="Place" ></Place>
  </div>
<div v-else>

    <div v-if="show===true" @clear-cart="this.show=!this.show;">
      <button @click="changed">프로덕트</button>
      <ProductList @add-to-cart="addToCart" ref="productList" :purchase-history="purchaseHistory"/>
      <button @click="gogo">장바구니</button>
      <p class="shop-count">
        상품수: {{ totalItemsInCart }}
      </p>

      <p class="shop-count">
        총가격: {{ total }}원
      </p>
    </div>

    <div v-else>
      <button @click="gogos">상품페이지</button>
      <ShoppingCart
          :cart="cart"
          @update-quantity="updateQuantity"
          @remove-item="removeItem"
          @clear-cart="clearCart"
          ref="shoppingCart"
      />

      <div  class="total" >

        <p class="shop-count">
          상품수: {{ totalItemsInCart }}
        </p>

        <p class="shop-count">
          총가격: {{ total }}원
        </p>
      </div>
    </div>
</div>

    <!--    <button @click="toggleVoiceRecognition">-->
    <!--      {{ voiceRecognitionActive ? '음성 인식 중지' : '음성 인식 시작' }}-->
    <!--    </button>-->
<!--    <div>-->
<!--      <p>-->
<!--        총가격: {{ totalItemsInCart }}-->
<!--      </p>-->

<!--      <p>-->
<!--        총가격: {{ total }}-->
<!--      </p>-->
<!--    </div>-->
  </div>
</div>

</template>

<script>
import ProductList from "./components/ProductList.vue";
import ShoppingCart from "./components/ShoppingCart.vue";
import mainPage from "./components/mainPage.vue";
import Place from "./components/Place.vue";

export default {
  name: "App",
  components: {
    mainPage,
    ProductList,
    ShoppingCart,
    Place,
  },
  mounted() {

    window.addEventListener("keydown", this.handleKeyDown);

  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  data() {
    return {
      place: true,
      main: true,
      show: true,
      cart: [],
      voiceRecognitionActive: false,
      recognition: null,
      purchaseHistory: {},
      product: null, // 또는 초기값을 다른 것으로 설정
      speakIntervalId: null,
    };
  },
  watch: {
    cart: {
      deep: true, // 배열 내부의 변경사항을 감지합니다.
      handler() {
        if (this.cart.length === 0) {
          this.gogos();
          this.speak("장바구니 상품을 전부 삭제하여 상품페이지로 이동했습니다.");
        }
      },
    },
    main: {
      handler(newVal) {
        if (newVal) {
          this.startSpeaking();
        } else {
          this.stopSpeaking();
        }
      },
      immediate: true, // 컴포넌트가 마운트되면서 이 watch 핸들러를 한 번 실행합니다.
    },
    show(newVal) {
      if (newVal) {
        this.speak("상품 페이지입니다.");
      } else {
        this.speak("장바구니 페이지입니다.");
      }
    },
  },
  // props: ['product'],
  computed: {
    // product() {
    //   // 여기에 product 계산 로직 작성
    // },
    //장바구니에 담긴 총개수
    totalItemsInCart() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    total() {
      return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },
  },
  methods: {
    startSpeaking() {
      this.speakIntervalId = setInterval(() => {
        this.speak("아무 키나 눌러주세요.");
        console.log('Speaking.');  // 로그 추가
      }, 5000); // 5초마다 반복
    },

    stopSpeaking() {
      if (this.speakIntervalId) {
        clearInterval(this.speakIntervalId);
        console.log('Speaking stopped.');  // 로그 추가
      }
    },
  changed() {
    this.main = !this.main;
  },
    Place() {
     this.place = !this.place;
    },
    gogo(product) {
      if (this.totalItemsInCart === 0) {
        this.speak("장바구니에 담긴 상품이 없습니다.");
      } else {
        this.show = !this.show;
        this.speak(`장바구니에 담긴 상품은 총 ${this.totalItemsInCart}개이고, 총 가격은 ${this.total}원 입니다.`);
      }


    },
    gogos(product) {
      if (this.totalItemsInCart === 0) {
        this.speak("장바구니에 담긴 상품이 없습니다.");
        this.show = !this.show;
      } else {
        this.show = !this.show;
      }

    },
    handleKeyDown(event) {
      if (this.main) {
        this.changed();
        return; // main이 true일 때는 다른 키보드 이벤트를 처리하지 않습니다.
      }
      switch (event.key) {
        case '1':
          this.show = true;  // 상품 페이지 보이게 하기
          break;
        case '2':
          if (this.totalItemsInCart === 0) {
            this.speak("장바구니에 담긴 상품이 없습니다.");
          } else if (this.show === true) {
            this.show = !this.show;
            this.speak(`장바구니에 담긴 상품은 총 ${this.totalItemsInCart}개이고, 총 가격은 ${this.total}원 입니다.`);
          } // 장바구니 보이게 하기
          break;
        case '3':
          this.$refs.shoppingCart.submitOrder();
          this.show = !this.show;// 주문하기 메소드 실행
          this.clearCart()
          break;
        case '7':
          this.place = !this.place;
          break;
        case '8':
          this.place = !this.place;
          break;
        default:
          break;
      }
      if (event.key === "/") {
        event.preventDefault();
        this.focusSearchInput();
      }
    },
    focusSearchInput() {
      this.$refs.productList.$refs.searchInput.focus();
    },
    // chargeInfo(product) {
    //  this.speak(`장바구니에 담긴 상품은 총${product.totalItemsInCart}개이고 총가격은${product.total}원 입니다. `)
    // },
    addToCart(product) {
      const index = this.cart.findIndex(item => item.product.id === product.id);
      if (index === -1) {
        this.cart.push({product, quantity: 1});
        this.speak(`${product.name} 상품이 1개 추가되었습니다.`);
      } else {
        this.cart[index].quantity += 1;
        this.speak(`${product.name} 상품이 ${this.cart[index].quantity}개로 변경되었습니다.`);
      }
    },
    updateQuantity({index, newQuantity}) {
      this.cart[index].quantity = newQuantity;
      this.speak(`${this.cart[index].product.name} 상품이 ${newQuantity}개로 변경되었습니다.`);
    },
    removeItem(index) {
      this.cart.splice(index, 1);
    },
    speak(message) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "ko-KR";
      speechSynthesis.speak(utterance);
    },
    toggleVoiceRecognition() {
      if (this.voiceRecognitionActive) {
        this.stopVoiceRecognition();
      } else {
        this.startVoiceRecognition();
      }
    },
    startVoiceRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('음성 인식 기능은 Chrome 브라우저에서만 지원됩니다.');
        return;
      }

      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "ko-KR";

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const command = event.results[i][0].transcript.trim();
            this.handleVoiceCommand(command);
          }
        }
      };

      this.recognition.start();
      this.voiceRecognitionActive = true;
    },
    stopVoiceRecognition() {
      if (this.recognition) {
        this.recognition.stop();
        this.recognition = null;
      }
      this.voiceRecognitionActive = false;
    },
    handleVoiceCommand(command) {
      const productList = this.$refs.productList;

      if (command.startsWith("검색")) {
        const searchQuery = command.slice(2).trim();
        productList.search = searchQuery;
      } else if (command.startsWith("추가")) {
        const productName = command.slice(2).trim();
        const matchedProduct = productList.products.find(product => productName === product.name);
        if (matchedProduct) {
          this.addToCart(matchedProduct);
        }
      } else if (command.startsWith("수량 변경")) {
        const productName = command.split(" ")[2].trim();
        const newQuantity = parseInt(command.split(" ")[3]);
        const cartIndex = this.cart.findIndex(item => item.product.name === productName);
        if (cartIndex !== -1 && !isNaN(newQuantity)) {
          this.updateQuantity({index: cartIndex, newQuantity});
        }
      } else if (command.startsWith("삭제")) {
        const productName = command.slice(2).trim();
        const cartIndex = this.cart.findIndex(item => item.product.name === productName);
        if (cartIndex !== -1) {
          this.removeItem(cartIndex);
          this.speak(`${productName} 상품이 삭제되었습니다.`);
        }
      } else {
        const matchedProduct = productList.products.find(product => command.includes(product.name));
        if (matchedProduct) {
          this.addToCart(matchedProduct);
        }
      }
    },
    // @clear-cart="this.show=!this.show;"
    clearCart() {
      this.cart = [];
      this.show = !this.show;
    },
    submitOrder() {
      if (this.cart.length === 0) {
        alert("장바구니가 비어 있습니다.");
        return;
      }

      this.cart.forEach(item => {
        if (!this.purchaseHistory[item.product.id]) {
          this.purchaseHistory[item.product.id] = 0;
        }
        this.purchaseHistory[item.product.id] += item.quantity;
      });
      alert("주문이 완료되었습니다.");
      this.$refs.shoppingCart.clearCart();
    },
  },
};

</script>
<style lang="scss">
@import "assets/css/app.scss";
</style>
