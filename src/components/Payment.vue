<template>
  <head><meta charset="UTF-8"></head>
  <body>
  <div v-if="ptpers===true">
    <h1>결제 방식을 선택해 주세요</h1>
    <div class="choose1" @click="chashHam">
      <div style="-webkit-box-align: center;" >
       현금

      </div><br>
      <button class="li-bt w-bt">
        <img alt="menu" src="/image/icon8.png" />
      </button>
      <br><br>카운터에서<br>결제해 주세요
    </div>
    <div class="choose2" @click="chashHamsa" >
      <div >

        카드

      </div><br>
      <button class="li-bt w-bt" >
        <img alt="menu" src="/image/icon9.png" />
      </button>
      <br><br>신용·체크카드<br>(삼성페이) / 모바일 쿠폰
    </div>
  </div>
  <div v-else-if="ptpers===false && agweg=== true">
  <finish-cash></finish-cash>
  </div>
  <div v-else>
    <fin-ish></fin-ish>
  </div>

  </body>
</template>
finIsh
<script>
import finishCash from "./finishCash.vue";
import finIsh from "./finIsh.vue";
export default {
  name: 'payPage',
  data(){
    return{
    ptpers:true,
      agweg:true,
    }
  },
  components: {
    finishCash,
    finIsh,
  },
  props: {
    submitOrder:Function,


  },
  methods: {
    goTo:function (v){
      this.$router.push(v);
    },
    hamCha() {
    this.ptpers = false;
    this.agweg = true;
    },
    hanvhs() {
      this.ptpers=false
      this.agweg = false;
    },
    chashHam() {

      this.hamCha();

      setTimeout(() => {
        this.submitOrder();
      }, 5000);
    },
    chashHamsa() {

      this.hanvhs();

      setTimeout(() => {
        this.submitOrder();
      }, 5000);
    },


  },
}
</script>

<style scoped>
body {


  width: 100%;
  margin: 0px auto;


}
h1{

  margin-top: 8%;
  font-size: 46pt;
  text-align: center;
}
/*버튼*/
.choose1, .choose2 {

  float: left;
  margin-top: 3%;
  margin-left: 16%;
  font-size: 14mm;
  text-align: center;

}

.choose1 {

  margin-left: 22%;
  text-align: center;
}
.li-bt{

  position: relative;
  padding: 3px 3px;
  border-radius: 40px;
  box-shadow: 0 15px 35px rbga(0, 0, 0, 0.2);
  transition: 0.25s;
  width: 250px;
  height: 250px;
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
  width: 200px;
  height: 200px;
}
</style>
