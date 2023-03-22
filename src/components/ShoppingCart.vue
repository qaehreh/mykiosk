<template>
  <div>
    <h2>장바구니</h2>
    <ul>
      <li v-for="(item, index) in cart" :key="item.product.id">
        {{ item.product.name }} - {{ item.product.price }}원 x {{ item.quantity }}
        <button @click="changeQuantity(index, item.quantity - 1)">-</button>
        <button @click="changeQuantity(index, item.quantity + 1)">+</button>
        <button @click="removeItem(index)">삭제</button>
      </li>
    </ul>
    <div>
      <h3>요청사항</h3>
      <textarea v-model="orderNote" placeholder="요청사항을 입력해주세요." rows="3"></textarea>
    </div>
    <button @click="submitOrder">주문하기</button>
    <div>총 가격: {{ total }}원</div>
  </div>
</template>

<script>
export default {
  props: {
    cart: Array,
  },
  data() {
    return {
      timer: null,
      actions: [],
      orderNote: "",
    };
  },
  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },
  },
  methods: {

    removeItem(index) {
      this.actions.push(`${this.cart[index].product.name} 상품을 삭제했습니다.`);
      this.speakWithDelay();
      this.$emit("remove-item", index);
    },
    changeQuantity(index, newQuantity) {
      const item = this.cart[index];
      if (newQuantity >= 1) {
        this.$emit("update-quantity", {index, newQuantity});

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
        alert("장바구니가 비어 있습니다.");
        return;
      }

      // 주문 정보 및 요청사항 출력
      console.log("주문 정보:", this.cart);
      console.log("요청사항:", this.orderNote);

      // 주문 정보 및 요청사항을 서버로 전송하는 로직 추가
      // ...

      alert("주문이 완료되었습니다.");
      this.$emit("clear-cart");
      this.orderNote = ""; // 요청사항을 초기화합니다.
    },
  }
};
</script>
