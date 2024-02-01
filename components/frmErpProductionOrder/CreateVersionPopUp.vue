<template>
    <div>
      <Dialog
        v-if="visibleDialog"
        :title="title"
        width="450px"
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
                        <div class="form-group" v-if="planVersionNewFlag">
                            <Label>
                            {{$t('MES_CommLang.MES_CommLang_00806')}} <!--계획버전-->
                            </Label>
                            <InputText
                            :dataNm="'planVersion'"
                            :style="{ width: '180px' }"
                            @input-text-set="searchInputValSet"
                            />
                            <Button :style="{ marginLeft: '5px' }" @click="planVersionSelect">{{ $t("MES_CommLang.MES_CommLang_00937") }}</Button> <!--신규-->
                        </div>
                        <div class="form-group"  v-if="!planVersionNewFlag">
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
                        <Button :style="{ marginLeft: '5px' }" @click="planVersionSelect">{{ $t("MES_CommLang.MES_CommLang_00936") }}</Button><!--기존-->
                      </div>
                    </div>
                  </v-col>
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'primary'" @click="createPlanVersion" >{{ $t("MES_CommLang.MES_CommLang_00819") }}</Button> <!-- 실행 -->
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
        planVersionNewFlag: true,
      }
    },
    computed: {
    },
    async mounted() {
    },
    methods: {

      // 계획 버전 콤보 데이터
      async getPlanVersionListData(){
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
      createPlanVersion(){
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
            PLVER: this.planVersion
        }]  

        const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnCreatePlanVersion",
            sendParam: sendParam,
        }).then((result) => {
            this.$nextTick(() => {
                if (result.returncode !== undefined && result.returncode === "0") {
                    this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
                    );
                    this.$emit("createVersionEnd");
                } else {
                    this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
                }
            });
        });
        
      },

      planVersionSelect(){
        this.planVersionNewFlag = !this.planVersionNewFlag;
        if(!this.planVersionNewFlag){
          this.planVersion = this.planVersionList[0]?.id;
        }else{
          this.planVersion = '';
        }
      }

    },
  };
  </script>