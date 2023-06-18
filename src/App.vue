<template>
  <meta name="mobile-web-app-capable" content="yes">
  <link rel="manifest" href="../manifest.json">

  <div id="app">
  <div v-if="main===true" @changed="this.main=!this.main" >
    <main-page @next="changed"></main-page>
  </div>

<div v-else>


  <!--    장소선택-->
  <div v-if="place === true && toPlace === true"  >
    <Place @select="Place" @selto="ToPlace" ></Place>
  </div>
  <!--    장소선택-->
 <div v-else-if="place===false && toPlace===false" >

   <!--    프로덕트-->
   <div v-if="show===true" @clear-cart="this.show=!this.show;">

     <ProductList @add-to-cart="addToCart" ref="productList" :purchase-history="purchaseHistory"  :cart="cart"/>
     <button class="zangba" @click="gogo"><img src="/image/icon2.png" alt="장바구니"><p>장바구니</p></button>
   </div>
   <!--    프로덕트-->

   <!--    장바구니-->
   <div v-else>
     <div v-if="cttem===true">
     </div>
     <div>

       <ShoppingCart
           :cart="cart"
           :gogos="gogos"
           :totalItemsInCart="totalItemsInCart"
           :total="total"
           @update-quantity="updateQuantity"
           @remove-item="removeItem"
           @clear-cart="clearCart"
           ref="shoppingCart"
           @updateChashrap="handleChashrap"
       />


     </div>
   </div>

   <!--    장바구니-->
 </div>
  <div v-else>

    <!--    프로덕트-->
    <div v-if="show===true" @clear-cart="this.show=!this.show;">

      <ProductList @add-to-cart="addToCart" ref="productList" :purchase-history="purchaseHistory"  :cart="cart"/>
      <button class="zangba" @click="gogo"><img src="/image/icon2.png" alt="장바구니"><p>장바구니</p></button>

    </div>
    <!--    프로덕트-->

<!--    장바구니-->
    <div v-else>
      <div v-if="cttem===true">
      </div>
      <div>
      <ShoppingCart
          :cart="cart"
          :gogos="gogos"
          @update-quantity="updateQuantity"
          @remove-item="removeItem"
          @clear-cart="clearCart"
          ref="shoppingCart"
          @updateChashrap="handleChashrap"
      />

      </div>
    </div>

    <!--    장바구니-->

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
      main: true,
      place: true,
      show: true,
      shows: true,
      cttem: true,
      toPlace: true,
      cart: [],
      voiceRecognitionActive: false,
      recognition: null,
      purchaseHistory: {},
      product: null, // 또는 초기값을 다른 것으로 설정
      speakIntervalId: null,
      isClearCartCalled: false,
    };
  },
  watch: {
    cart: {
      deep: true, // 배열 내부의 변경사항을 감지합니다.
      handler() {
        if (this.cart.length === 0 && this.show=== false && this.isClearCartCalled === false ) {
          this.show=true  ;
          this.speak("장바구니 상품을 전부 삭제하여 상품페이지로 이동했습니다.");
        }
        this.isClearCartCalled = false;
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
    handleChashrap(chashrap) {
      this.chashrap = chashrap;
      this.someOtherMethod(chashrap); // chashrap 값에 따라 다른 메소드를 실행합니다.
    },
    someOtherMethod(chashrap) {
      if (this.chashrap===true) {
        this.chashrap=!this.chashrap
    }
    },
cg() {
  console.log(this.main)
},
    startSpeaking() {
      // 실행 중인 인터벌이 있다면 정지시킵니다.
      if (this.speakIntervalId) {
        clearInterval(this.speakIntervalId);
        this.speakIntervalId = null;
      }

      this.speakIntervalId = setInterval(() => {
        this.speak("음성을 따라 주문해 주세요 아무 키나 눌러주세요.");
        console.log('Speaking.');
      }, 15000);
    },

    stopSpeaking() {
      clearInterval(this.speakIntervalId);
      console.log('stopSpeaking.');// setInterval을 중단합니다.
    },
  changed() {
    this.main = false;
    this.speak("포장은칠번 매장이용은팔번을 눌러주세요.");
  },
    Place() {
      this.isClearCartCalled = false;
     this.place = !this.place
      this.toPlace=true
      this.speak("포장을 선택하셨습니다. /버튼을 누르시고 점자키보드로 매뉴검색을 해주세요");
    },
    ToPlace() {
      this.isClearCartCalled = false;
      this.toPlace = false;
      this.place = !this.place;
      this.speak("매장이용을 선택하셨습니다. /버튼을 누르시고 점자키보드로 매뉴검색을 해주세요");
    },
    cttem() {
      this.cttem = !this.cttem;
    },
    gogo(product) {
      if (this.totalItemsInCart === 0) {
        this.speak("장바구니에 담긴 상품이 없습니다.");
      } else if (this.show === true) {
        this.show = !this.show;
        this.speak(`장바구니에 담긴 상품은 총 ${this.totalItemsInCart}개이고, 총 가격은 ${this.total}원 입니다.`);

      } // 장바구니 보이게 하// 기
      else {
        this.shows = !this.shows;
        this.speak(`장바구니에 담긴 상품은 총 ${this.totalItemsInCart}개이고, 총 가격은 ${this.total}원 입니다.`);
      }
    },
    gogose(product) {
      if (this.totalItemsInCart === 0) {
        this.speak("장바구니에 담긴 상품이 없습니다.");
      } else if (this.show === true) {
        this.show = !this.show;
        this.speak(`장바구니에 담긴 상품은 총 ${this.totalItemsInCart}개이고, 총 가격은 ${this.total}원 입니다.`);

      } // 장바구니 보이게 하// 기
      else {
        this.shows = !this.shows;
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

          this.show = true;// 상품 페이지 보이게 하기
          this.shows = true;
          break;
        case '2':
          if (this.totalItemsInCart === 0) {
            this.speak("장바구니에 담긴 상품이 없습니다.");
          } else if (this.show === true) {
            this.show = !this.show;
            this.speak(`장바구니에 담긴 상품은 총 ${this.totalItemsInCart}개이고, 총 가격은 ${this.total}원 입니다.`);

          } // 장바구니 보이게 하// 기
          else {
            this.shows = !this.shows;
            this.speak(`장바구니에 담긴 상품은 총 ${this.totalItemsInCart}개이고, 총 가격은 ${this.total}원 입니다.`);
          }
          break;
        case '3':
          this.$refs.shoppingCart.submitOrder();
          // this.show = !this.show;// 주문하기 메소드 실행
          // this.clearCart()
          break;
        case '7':
          this.Place()
          break;
        case '8':
          this.ToPlace()
          break;
        default:
          break;
      }
      if (event.key === "/") {
        this.speak("검색할 상품을 입력후 엔터를 눌러주세요")
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
    speak(text) {


        let voices = window.speechSynthesis.getVoices();

        // 첫 번째 음성을 선택합니다.
        let selectedVoice = voices[0];  // 이 값을 변경하여 다른 음성을 선택할 수 있습니다.

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;  // 선택한 음성을 설정합니다.
        utterance.lang = "ko-KR";
        window.speechSynthesis.speak(utterance);

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

      this.isClearCartCalled = true;
      this.cart = [];
      this.main = true;
      this.place = true;
      this.show = true;
      this.toPlace = true;
      this.shows = true;
      this.ptpers=true;
      this.agweg=true;
    },
    // submitOrder() {
    //   if (this.cart.length === 0) {
    //     alert("장바구니가 비어 있습니다.");
    //     return;
    //   }
    //
    //   this.cart.forEach(item => {
    //     if (!this.purchaseHistory[item.product.id]) {
    //       this.purchaseHistory[item.product.id] = 0;
    //     }
    //     this.purchaseHistory[item.product.id] += item.quantity;
    //   });
    //   alert("주문이 완료되었습니다.");
    //   this.$refs.shoppingCart.clearCart();
    // },
  },
};

</script>
<style lang="scss">
@import "assets/css/app.scss";

</style>
