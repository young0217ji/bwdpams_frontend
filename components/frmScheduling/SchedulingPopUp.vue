<template>
    <div>
      <Dialog
        v-if="visibleDialog"
        :title="title"
        width="400px"
        height="200px"
        @close="toggleDialog"
      >

        <v-row ref="searchFilter" no-gutters>
          <v-col :cols="12">
            <Card>
              <CardBody>
                <v-row class="search-box" align="center" no-gutters>
                  <v-col :cols="12" :lg="3">
                    <div class="form-group-wrap">
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00833") }}</label> <!-- 계획일자 -->
                            <div class="form-datepicker">
                                <DatePicker
                                ref="planStartDate"
                                :style="{width:'180px'}"
                                :format="'yyyy-MM-dd'"
                                :default-value="new Date()"
                                :value="planStartDate"
                                @change="selectStartDate"
                                />
                            </div>
                        </div>
                    </div>
                  </v-col>
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'primary'" @click="executePlan" >{{ $t("MES_CommLang.MES_CommLang_00819") }}</Button> <!-- 실행 -->
                    <Button :theme-color="'secondary'"  @click="toggleDialog">{{ $t("MES_CommLang.MES_CommLang_00413") }}</Button> <!-- 닫기 -->
                  </v-col>
                </v-row>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    </div>
  </template>
  <script>
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  import mixinGlobal from "@/mixin/global.js";
  import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { DatePicker } from '@progress/kendo-vue-dateinputs';
  
  export default { 
    name: "PlanningPopUp",
    mixins: [mixinGlobal],
    components: {
      Card,
      CardBody,
      CardTitle,
      Dialog,
      DialogActionsBar,
      Button,
      FadeLoader,
      DatePicker,
    },
    props:{
      visibleDialog: {
        type: Boolean,
        default: false,
      },
      title:{
        type:String,
        default: 'Planning',
      },
    },
    data() {
      return {
        planStartDate:new Date(),

      }
    },
    computed: {
    },
    async mounted() {
    },
    methods: {

      // 팝업 닫기
      toggleDialog() {
        this.$emit('visibleDialog', !this.visibleDialog)
      },

      // INPUT 입력
      searchInputValSet(nm, val){
        this[nm] = val;
      },

      // 시작일 선택
      selectStartDate(e){
        this.planStartDate = e.value;
      },
      // 실행
      executePlan(){
        // SP_DYPDBR_SCHEDULING(PLDATE)
        const sendParam = [{
            PLNDATE : this.DateToYYYYMMDDString(this.planStartDate),
        }]  

        const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnScheduling",
            sendParam: sendParam,
        }).then((result) => {
            this.$nextTick(() => {
                if (result.returncode !== undefined && result.returncode === "0") {
                    this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
                    );
                    this.$emit("executeEnd");
                } else {
                    this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
                }
            });
        });
        
      },
    },
  };
  </script>