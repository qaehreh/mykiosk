<template>
  <body>
  <div>
    <h1>카드 결제 방식을 선택해 주세요</h1>
    <div class="choose1">
      <button class="li-bt w-bt">
        <img alt="menu" src="public/image/cu.png" />
      </button>
      <br><br>신용·체크카드(삼성페이)
    </div>
    <div class="choose2">
      <button class="li-bt w-bt">
        <img alt="menu" src="public/image/매장에서.png" />

      </button>
      <br><br>모바일 쿠폰
    </div>
  </div>
  </body>
</template>

<script>
export default {
  name: 'cardchash',
  data(){
    return{
    }
  },
  components: {
  }
}
</script>

<style>
body {
  width: 100%;
  margin: 0px auto;
}
h1{
  margin-top: 2.5%;
  font-size: 60pt;
  float: center;
}
/*버튼*/
.choose1, .choose2 {
  float: left;
  margin-top: 2%;
  margin-left: 10%;
  font-size: 14mm;
}
.choose1 {
  margin-left: 3%;
}
.li-bt{
  position: relative;
  padding: 3px 3px;
  border-radius: 40px;
  box-shadow: 0 15px 35px rbga(0, 0, 0, 0.2);
  transition: 0.25s;
  width: 400px;
  height: 400px;
  margin: 0px;
}
.li-bt:hover{
  letter-spacing: 2px;
  transform: scale(1.2);
  cursor: pointer;
}
.w-bt {
  border: 2px solid #a3a1a1;
  color: #ffffff;
}
img {
  width: 350px;
  height: 350px;
}
</style>
