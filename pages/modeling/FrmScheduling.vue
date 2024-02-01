<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00828") }}</li> <!-- 생산 Scheduling -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00052") }}</label> <!-- 공정  -->
                      <DropDownList
                        :style="{ width: '150px' }"
                        :data-items="planOperList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="sendParam.planOperId"
                        @change="selectPlanOper"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00805") }}</label> <!-- 라인  -->
                      <DropDownList
                        :style="{ width: '200px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="sendParam.workCenter"
                        @change="selectWorkCenter"
                      />
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00806") }}</label> <!-- 계획 버전  -->
                      <DropDownList
                        :style="{ width: '150px' }"
                        :data-items="planVersionList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="sendParam.planVersionValue"
                        @change="selectPlanVersion"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                        <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회 기간 -->
                        <div class="form-datepicker">
                          <DatePicker
                            ref="startDate"
                            :format="'yyyy-MM-dd'"
                            :default-value="new Date()"
                            :searchOption="true"
                            :value="selectedStartDate"
                            @change="selectStartDate"
                          />
                        </div>
                        <span class="i_tilde">~</span>
                        <div class="form-datepicker">
                          <DatePicker
                            ref="endDate"
                            :format="'yyyy-MM-dd'"
                            :default-value="new Date()"
                            :searchOption="true"
                            :value="selectedEndDate"
                            @change="selectEndDate"
                          />
                        </div>
                      </div>
                  </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn" >{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      

      <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="12" :class="'divList2'" :style="{ height: '100%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row>
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" @click="excel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button><!--전체EXCEL-->
                    <Button :theme-color="'secondary'" :size="'small'" @click="pagingExcel">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button><!--페이지EXCEL-->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getBtn">{{ $t("MES_CommLang.MES_CommLang_00915") }}</Button><!--가져오기-->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'calendar'" @click="planningBtn">{{ $t("MES_CommLang.MES_CommLang_00831") }}</Button><!--Scheduling-->
                    <Button :theme-color="'secondary'" :size="'small'" @click="erpBtn">{{ $t("MES_CommLang.MES_CommLang_00832") }}</Button><!--ERP 전송-->
                  </v-col>

                </v-row>
                <TabStrip
                  :selected="selectedTab"
                  @select="onSelect"
                  :tabs="tabs"
                  :style="{ height: '100%' }"
                >
                  <template v-slot:MpsSearch>
                    <MpsSearch
                      ref="MpsSearch"
                      :sendParam="sendParam"
                    />
                  </template>
                  <template v-slot:ResultSearch>
                    <ResultSearch
                      v-if="v1"
                      ref="ResultSearch"
                      :sendParam="sendParam"
                    />
                  </template>
                </TabStrip>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <SchedulingPopUp
      :visibleDialog="schedulingVisible"
      :title="'Scheduling'"
      @visibleDialog="(val) => schedulingVisible = val"
      @executeEnd = "executeEnd"
    />
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import { Card, CardBody, CardTitle, TabStrip } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import MpsSearch from '@/components/frmScheduling/MpsSearch.vue';
import ResultSearch from '@/components/frmScheduling/ResultSearch.vue';
import SchedulingPopUp from '@/components/frmScheduling/SchedulingPopUp.vue';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';

let myTitle;
let myMenuId;


export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
    myTitle = await myState.activeMenuInfo.menuName;
  },
  meta: {
    title: () => {
      return myTitle;
    },
    menuId: myMenuId,
    closable: true,
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    MesSelectBox,
    TabStrip,
    MpsSearch,
    ResultSearch,
    SchedulingPopUp,
    DropDownList,
    DatePicker,
},
  data() {
    return {
        selectedTab: 0,
        planOperList: [],
        workCenterList:[{id:'', text:'-ALL-'}],
        planVersionList:[],
        tabs: [
        { title: this.$i18n.t('MES_CommLang.MES_CommLang_00671'), content: 'MpsSearch' },
        { title: this.$i18n.t('MES_CommLang.MES_CommLang_00672'), content: 'ResultSearch' }, 
        ],
        sendParam:{
            planOperId:'',
            workCenter:'',
            planVersionValue:'',
            startDate : this.DateToYYYYMMDDString(new Date()),
            endDate : this.DateToYYYYMMDDString(new Date()),
        },
        v1:false,
        mpsSearch:false,
        resultSearch:false,
        schedulingVisible:false,
        selectedStartDate : new Date(),
        selectedEndDate : new Date(),
    }
  },
  created() {},
  async mounted() {
    await this.getPlanOperListData();
    await this.getWorkCenterListData();
    await this.getPlanVersionListData();
    const date = new Date();
    date.setDate(this.selectedStartDate.getDate()+14);
    this.selectedEndDate = date;
    this.sendParam.endDate = this.DateToYYYYMMDDString(date);
  },
  computed: {
  },
  watch: {},
  methods: {
    // 계획공정 콤보 데이터
    async getPlanOperListData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPlanOperList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
      }).then(res => {
        res.map(x=>{
          this.planOperList.push({ id : x.PLANOPERID, text : x.PLANOPERNAME })
        })
        this.sendParam.planOperId = this.planOperList[2].id;
      })
    },

    // 계획공정 콤보 선택
    selectPlanOper(event) {
      this.sendParam.planOperId = event.value;
    },

    // W/C 콤보 데이터
    async getWorkCenterListData(){
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00006',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        res.map(x=>{
          this.workCenterList.push({ id : x.CODE, text : x.NAME })
        })
      });
    },

    // W/C 콤보 선택
    selectWorkCenter(event) {
      this.sendParam.workCenter = event.value;
    },
    
    // 계획 버전 콤보 데이터
    async getPlanVersionListData(){
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPlanVersionList',
        queryVersion: '00002',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        res.map(x=>{
          this.planVersionList.push({ id : x.PLANVERSION, text : x.PLANVERSION })
        })
        this.sendParam.planVersionValue = this.planVersionList[0]?.id;
      });
    },

    // 계획 버전 콤보 선택
    selectPlanVersion(event) {
      this.sendParam.planVersionValue = event.value;
    },

    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.selectedStartDate = event.value;
        this.sendParam.startDate = this.DateToYYYYMMDDString(event.value);
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.selectedEndDate = event.value;
        this.sendParam.endDate = this.DateToYYYYMMDDString(event.value);
    },

    // 조회 버튼
    async searchBtn() {
      this.mpsSearch = false;
      this.resultSearch = false;

      if(this.selectedTab === 0){
        this.$refs.MpsSearch.getGridData();
        this.mpsSearch = true;
      }else if(this.selectedTab === 1){
        this.$refs.ResultSearch.getGridData();
        this.resultSearch = true;
      }
    },

    // 검색조건 변경
    comboChange(nm, val) {
      this[nm] = val;
      this.sendParam.MPSTYPE = val;
    },

    // 탭 선택
    onSelect(e) {
      this.selectedTab = e.selected;
      
      if(this.selectedTab === 0 && !this.mpsSearch){
        this.$refs.MpsSearch.getGridData();
        this.mpsSearch = true;
      }
      else if(this.selected === 1 && !this.resultSearch && v1){
          this.$refs.ResultSearch.getGridData();
          this.resultSearch = true;
      }
      if(e.selected==1){
        this.v1 = true;
      }
      
      
      
    },

    // 가져오기 버튼
    async getBtn(){
      this.$refs['confirmPop'].title = "Info";
      this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00291'); // 데이터를 가져오시겠습니까?
      this.$refs['confirmPop'].callBack = this.getBtnCallback;
      this.$refs['confirmPop'].modalWidth = "300px";
      this.$refs['confirmPop'].visibleDialog = true;
    },

    async getBtnCallback(){
      await this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnGetSchedulingData",
      }).then((result) => {
          this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === "0") {
                  this.$refs.alertPop.show(
                  this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                  this.$i18n.t('MES_MsgLang.MES_MsgLang_00277')//완료되었습니다.
                  );
                  this.selectedTab = 0;
                  this.searchBtn();
              } else {
                  this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
              }
          });
      });
    },
    
    // PLANNING 버튼 - 팝업
    planningBtn(){
      
      this.schedulingVisible = true;

    },
    
    // ERP 전송 버튼
    erpBtn(){
      // Validation - 결과 조회 탭 선택 
      if(this.selectedTab!=1){
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),// 알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00086')// 선택된 항목이 없습니다.
        );
        return;
      }
      else{
        this.$refs.ResultSearch.erpBtn();
      }

    },

    executeEnd(){
      this.schedulingVisible = false;
      this.searchBtn();
    },

    excel(){
      this.$refs[this.tabs[this.selectedTab].content].excel();
    },
    
    pagingExcel(){
      this.$refs[this.tabs[this.selectedTab].content].pagingExcel();
    }


  },

}

</script>