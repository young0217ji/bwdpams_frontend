<template>
    <div>
      <Dialog
        v-if="visibleDialog"
        :title="title"
        width="450px"
        height="300px"
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
                          <label>{{ $t("MES_CommLang.MES_CommLang_00806") }}</label> <!-- 계획 버전  -->
                          <DropDownList
                            :style="{ width: '180px' }"
                            :data-items="planVersionList"
                            :text-field="'text'"
                            :data-item-key="'id'"
                            :value-field="'id'"
                            :value-primitive="true"
                            :value="planVersion"
                            @change="selectPlanVersion"
                            >
                          </DropDownList>
                      </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00046") }}</label> <!-- 계획 시작일 -->
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
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00047") }}</label> <!-- 계획 종료일 -->
                            <div class="form-datepicker">
                                <DatePicker
                                ref="planEndDate"
                                :style="{width:'180px'}"
                                :format="'yyyy-MM-dd'"
                                :default-value="new Date()"
                                :value="planEndDate"
                                @change="selectEndDate"
                                />
                            </div>
                        </div>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                    <v-col :cols="4" align="left">
                      <Button :theme-color="'secondary'" @click="resetBtn" >{{ $t("MES_CommLang.MES_CommLang_00938") }}</Button> <!-- 실행 -->
                    </v-col>
                    <v-col :cols="8" align="right">
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
  import InputText from "@/components/common/input/InputText";
  import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { DatePicker } from '@progress/kendo-vue-dateinputs';
  import { DropDownList } from "@progress/kendo-vue-dropdowns";
  
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
      InputText,
      FadeLoader,
      DatePicker,
      DropDownList,
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
        planVersion:'',
        planVersionList:[],
        planStartDate:new Date(),
        planEndDate:new Date(),
      }
    },
    computed: {
    },
    async mounted() {
      this.planEndDate.setDate(new Date().getDate()+60);
    },
    methods: {

      // 계획 버전 콤보 데이터
      async getPlanVersionListData(){
        this.planVersionList = [];
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetPlanVersionList',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          },
        }).then(res => {
          res.map(x=>{
            this.planVersionList.push({ id : x.PLANVERSION, text : x.PLANVERSION })
          })
          this.planVersion = this.planVersionList[0].id;
        });
      },

      // 계획 버전 콤보 선택
      selectPlanVersion(event) {
        this.planVersion = event.value;
      },

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

      // 종료일 선택
      selectEndDate(e){
        this.planEndDate = e.value;
      },

      // 실행
      executePlan(){
        // Validation
        if(this.isNullOrEmpty(this.planVersion)){
            this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00279')//계획버전을 입력해주세요.
            );
            return;
        }

        // SP_DYPDBR_PLANNING(PLVER, STDATE, EDDATE)
        const sendParam = [{
            PLVER: this.planVersion,
            STDATE : this.DateToYYYYMMDDString(this.planStartDate),
            EDDATE: this.DateToYYYYMMDDString(this.planEndDate)
        }]  

        const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnWeekPlanning",
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
      // 초기화
      resetBtn(){
        const sendParam = [{
          PLANSTARTDATE: this.DateToYYYYMMDDString(this.planStartDate),
          PLANVERSION: this.planVersion
        }]
        const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnResetPlanning",
            sendParam: sendParam,
        }).then((result) => {
            this.$nextTick(() => {
                if (result.returncode !== undefined && result.returncode === "0") {
                    this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
                    );
                    this.$emit("resetEnd");
                } else {
                    this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
                }
            });
        });
      },

    },
  };
  </script>