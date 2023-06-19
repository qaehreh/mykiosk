<template>
  <div v-if="chashrap===true" class="shopping">
    <h2>장바구니</h2>
    <!--    <ul>-->
    <div class="contain">

      <button class="LB-ton" @click="changePage(currentPage - 1)" :disabled="currentPage <= 1"><i class="fa-solid fa-caret-left"></i></button>
    <div class="cart-item" v-for="(item, index) in paginatedItems" :key="item.product.id">
      <img class="cart-img" :src="item.product.image" alt="상품 이미지" />
      <div>
<!--       text-align: center;-->
      </div>
      <div class="price">
        {{ item.product.price }}원
      </div>
      <div class="change">
        {{ item.product.name}}
        <div class="pluminu">
      <button @click="changeQuantity(index, item.quantity - 1)"><i class="fa-solid fa-minus"></i></button>
      {{ item.quantity }}
      <button @click="changeQuantity(index, item.quantity + 1)"><i class="fa-solid fa-plus"></i></button>
        </div>
      <button class="rmve" @click="removeItem(index)"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
      <button class="RB-ton" @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages"><i class="fa-solid fa-caret-right"></i></button>
    </div>
    <!--    </ul>-->
    <div>
      <textarea ref="myTextarea" v-model="orderNote" placeholder="요청사항을 입력해주세요." maxlength="40" rows="15" spellcheck="false"></textarea>
    </div>
<!--    <button class="submit" @click="submitOrder">주문하기</button>-->
    <button class="submit" @click="Chash">결제하기</button>
    <div  class="total" >

      <p class="shop-count">
        상품수: {{ totalItemsInCart() }}
      </p>

      <p class="shop-count">
        총가격: {{ this.cartTotal }}원
      </p>
    </div>
    <button class="prodPa" @click="gogos">상품페이지</button>
    <!--    <div>총 가격: {{  total }}원</div>-->
  </div>
  <div v-else>
  <Payment
      :submitOrder="submitOrder"
      ref="payment"
  ></Payment>

  </div>
</template>

<script>
import Payment from"./Payment.vue";
export default {
  components: {
    Payment,

  },
  props: {
    cart: Array,
    total: Number,  // Here
    gogos: Function
  },
  data() {
    return {
      text: '',
      chashrap:true,
      show: false,
      timer: null,
      actions: [],
      items: [],
      orderNote: "",
      currentPage: 1,
      itemsPerPage: 4,
    };
  },
  mounted() {
    window.addEventListener('keydown', this.keydownHandler);

  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.keydownHandler);
  },
  watch: {
    cart: {
      handler() {
        if (this.cart.length === 0) {
          this.show = true;
        }
      },
      immediate: true, // 컴포넌트가 생성될 때 `handler` 함수를 바로 실행합니다.
    },
  },
  computed: {
    cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },
    totalPages() {
      return Math.ceil(this.cart.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.cart.slice(start, end);
    },
  },

  methods: {
    keydownHandler(e) {
      if (event.key === " " && this.chashrap===true && document.activeElement !== this.$refs.myTextarea) {
        this.speak("요청사항입력후 엔터를 눌러주세요")
        this.$refs.myTextarea.focus();
      }
      if (e.key === 'Enter'  && this.chashrap===true) {
        this.speak("요청사항이 입력되었습니다 결제방법을 선택하시려면 삼번을 눌러주세요")
        this.$refs.myTextarea.blur();
      }
    },

    Chash() {
      this.speak("현금결제는 구번 카드결제는 영번을 눌러주세요.")
      this.chashrap=false
      this.$emit('updateChashrap', this.chashrap);

    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) {
        return;
      }
      this.currentPage = page;
    },
    totalItemsInCart() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    removeItem(index) {
      this.actions.push(`${this.cart[index].product.name} 상품을 삭제했습니다.`);
      this.speakWithDelay();
      this.$emit("remove-item", index);
    },
    changeQuantity(index, newQuantity) {
      const item = this.cart[(this.currentPage - 1) * this.itemsPerPage + index];
      if (newQuantity >= 1) {
        this.$emit("update-quantity", {index: (this.currentPage - 1) * this.itemsPerPage + index, newQuantity});

        // 음성 출력
        if (newQuantity > item.quantity) {
          this.actions.push(`${item.product.name}의 수량을 ${newQuantity}개로 늘렸습니다.`);
        } else if (newQuantity < item.quantity) {
          this.actions.push(`${item.product.name}의 수량을 ${newQuantity}개로 줄였습니다.`);
        }
        this.speakWithDelay();
      }
    },
    speakWithDelay() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.speak(this.actions.join(", "));
        this.actions = [];
      },);
    },
    speak(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ko-KR";
      window.speechSynthesis.speak(utterance);
    },
    submitOrder() {
      if (this.cart.length === 0) {

        this.show = !this.show;
        this.shows = !this.shows;
        this.speak("장바구니가 비어있어 상품페이지로 이동했습니다.")
        // this.$emit('cart-empty');


      }
      else {
        // 주문 정보 및 요청사항 출력
        console.log("주문 정보:", this.cart);
        console.log("요청사항:", this.orderNote);
        console.log(this.show ? "매장" : "포장");
        console.log(this.cartTotal);
        // 주문 정보 및 요청사항을 서버로 전송하는 로직 추가
        // ...

        this.cart.forEach((item, index) => {
          this.speak(`상품 ${index + 1}: ${item.product.name}, 개수: ${item.quantity}, 가격: ${item.product.price * item.quantity}원 총 가격: ${this.cartTotal}원 입니다. 주문이 완료되었습니다.`);
        });
        console.log(this.cartTotal);
        this.$emit('clearCart')
        setTimeout(() => {
          this.startSpeaking();
        }, 2000);

      }
    },
  }
};

</script>
<style>

</style>
