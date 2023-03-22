<template>
  <div id="app">
    <ProductList @add-to-cart="addToCart" ref="productList" />
    <ShoppingCart
        :cart="cart"
        @update-quantity="updateQuantity"
        @remove-item="removeItem"
        @clear-cart="clearCart"
        ref="shoppingCart"
    />
    <button @click="toggleVoiceRecognition">
      {{ voiceRecognitionActive ? '음성 인식 중지' : '음성 인식 시작' }}
    </button>
    <div>장바구니에 담긴 상품 개수: {{ totalItemsInCart }}</div>
  </div>


</template>

<script>
import ProductList from "./components/ProductList.vue";
import ShoppingCart from "./components/ShoppingCart.vue";

export default {
  name: "App",
  components: {
    ProductList,
    ShoppingCart,
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },
  data() {
    return {
      cart: [],
      voiceRecognitionActive: false,
      recognition: null,
    };
  },
  computed: {
    //장바구니에 담긴 총개수
    totalItemsInCart() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  methods: {
    handleKeyDown(event) {
      if (event.key === "/") {
        event.preventDefault();
        this.focusSearchInput();
      }
    },
    focusSearchInput() {
      this.$refs.productList.$refs.searchInput.focus();
    },
    addToCart(product) {
      const index = this.cart.findIndex(item => item.product.id === product.id);
      if (index === -1) {
        this.cart.push({ product, quantity: 1 });
        this.speak(`${product.name} 상품이 1개 추가되었습니다.`);
      } else {
        this.cart[index].quantity += 1;
        this.speak(`${product.name} 상품이 ${this.cart[index].quantity}개로 변경되었습니다.`);
      }
    },
    updateQuantity({ index, newQuantity }) {
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
          this.updateQuantity({ index: cartIndex, newQuantity });
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
    clearCart() {
      this.cart = [];
    },

  },
};
</script>
