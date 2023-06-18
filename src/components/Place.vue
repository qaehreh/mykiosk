<template>
  <div class="place">
    <h1>식사하실 장소를 선택해 주세요</h1>
    <div class="choose1">
      <button class="li-bt w-bt" @click="$emit('select')" >
        <img alt="menu" src="/image/icon6.png" />
      </button>
      <br><br>포장
    </div>
    <div class="choose2" @click="$emit('selto')">
      <button class="li-bt w-bt">
        <img alt="menu" src="/image/icon7.png" />
      </button>
      <br><br>매장에서 식사
    </div>
  </div>

</template>

<script>
export default {}
</script>
