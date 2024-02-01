<template>
  <div class="context-menu" :style="{ top: posY-200 + 'px', left: posX-260 + 'px'}">
    <ul>
      <li @click="add">{{ $t("MES_CommLang.MES_CommLang_00411") }}</li> <!--추가-->
      <li :class="{disabled: menuFlag===$t('MES_CommLang.MES_CommLang_00495') || menuFlag==='' }" @click="edit">{{ $t("MES_CommLang.MES_CommLang_00188") }}</li> <!--완료, 수정-->
      <li :class="{disabled: menuFlag===$t('MES_CommLang.MES_CommLang_00495') || menuFlag ===$t('MES_CommLang.MES_CommLang_00290') || menuFlag===''}" @click="remove">{{$t('MES_CommLang.MES_CommLang_00412')}}</li><!--완료, 진행중, 삭제-->
      <li :class="{disabled: menuFlag==='' }" @click="startPM">{{ $t("MES_CommLang.MES_CommLang_00786") }}</li> <!--PM실행-->
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    posX: Number,
    posY: Number,
    planData:[],
    menuFlag:"", // "": 빈셀 우클릭, 진행중: 진행중인 planData 우클릭, 미완료: planData 우클릭, 완료: 완료된 planData 우클릭
  },
  methods: {
    add() {
      // 추가 버튼 클릭 시 실행될 함수

      console.log(":::::::::ContextMunu.vue add()::::::::");
      this.$el.style.display = "none";
      this.$emit('addClickContextMenu', this.planData, "C");
    },
    edit() {
      // 수정 버튼 클릭 시 실행될 함수
      console.log(":::::::::ContextMunu.vue edit()::::::::");
      this.$el.style.display = "none";
      this.$emit('editClickContextMenu', this.planData, "U");
    },
    remove() {
      // 삭제 버튼 클릭 시 실행될 함수
      console.log(":::::::::ContextMunu.vue remove()::::::::");
      this.$el.style.display = "none";
      this.$emit('removeClickContextMenu', this.planData, "D");
    },
    startPM() {
      // PM주기추가 버튼 클릭 시 실행될 함수
      console.log(":::::::::ContextMunu.vue startPM()::::::::");
      this.$el.style.display = "none";
      this.$emit('startPMClickContextMenu', this.planData, "startPM");
    },
  },
};
</script>

<style>
.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px #ccc;
  padding: 5px 0;
  z-index: 9999;
}
.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.context-menu ul li {
  padding: 5px 10px;
  cursor: pointer;
}
.context-menu ul li:hover {
  background-color: #f2f2f2;
}
.disabled {
  color: #ccc;
  cursor: not-allowed;
  pointer-events: none;
}
</style>