
    <script>


      export default {
        name: 'mainPage',
        data(){

          return{

          }
        },
        methods: {



        },
        components: {

        },
        props: {

        },
      }
    </script>

    <template  >
      <div @click="$emit('next')">

      <div class="main-info"  >
        <span>내린커피 키오스크 이용안내</span>
        <p style="z-index: 5"  >아무곳이나 클릭해주세요</p>
        <!--  <p style="z-index: 5" @click="goTo('/PlusmenuPage')">포탈</p>-->
        <!--  <p style="z-index: 5" @click="goTo('/EXchoosePage')">포탈2</p>-->
        <!--  <button @click="goTo('/finishCash')">결제종료</button>-->
        <div class="info">
          <div class="info-sub">
            <img src="/image/icon1.png" alt=""><span>1. 메뉴를 선택해주세요</span>
          </div>
        </div>

        <div class="info">
          <div class="info-sub">
            <img src="/image/icon2.png" alt=""><span>2. 장바구니에서 메뉴확인 후 결제해주세요</span>
          </div>
        </div>

        <div class="info">
          <div class="info-sub">
            <img src="/image/icon3.png" alt=""><span>3. 카드 투입구에 카드를 넣어 결제해주세요</span>
          </div>
        </div>

        <div class="info">
          <div class="info-sub">
            <img src="/image/icon4.png" alt=""><span>4. 영수증에 적힌 주문번호를 확인해주세요</span>
          </div>
        </div>

        <div class="info">
          <div class="info-sub">
            <img src="/image/icon5.png" alt=""><span>5. 카운터에서 제품을 수령해주세요</span>
          </div>
        </div>
      </div>

      <div class="side">

      </div>
      </div>
    </template>




