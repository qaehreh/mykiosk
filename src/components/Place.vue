<template>
  <div class="place">
    <h1>식사하실 장소를 선택해 주세요</h1>
    <div class="choose1">
      <button class="li-bt w-bt" @click="$emit('select')" >
        <img alt="menu" src="/image/icon6.png" />
      </button>
      <br><br>포장
    </div>
    <div class="choose2" @click="$emit('select')">
      <button class="li-bt w-bt">
        <img alt="menu" src="/image/icon7.png" />
      </button>
      <br><br>매장에서 식사
    </div>
  </div>

</template>

<script>
export default {
  methods: {
    place() {
      this.place = !this.place;
    },
    handleKeydown(e) {
      if (e.keyCode === 55) { // ASCII for '7'
        this.$refs.choose1.click();
      } else if (e.keyCode === 56) { // ASCII for '8'
        this.$refs.choose2.click();
      }
    },
    handleClick(button) {
      console.log(button + ' clicked');
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
};
</script>
