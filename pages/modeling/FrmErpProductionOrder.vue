<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00827") }}</li> <!-- 조립 생산계획 수립 -->
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
                        :value="sendParam.planOperValue"
                        @change="selectPlanOper"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00939") }}</label> <!-- 라인  -->
                      <DropDownList
                        :style="{ width: '150px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="sendParam.workCenterValue"
                        @change="selectWorkCenter"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00258") }}</label> <!-- 제품ID -->
                      <Input
                        v-model="sendParam.productId"
                      />
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회 기간 -->
                      <div class="form-datepicker">
                        <DatePicker
                          ref="startDate"
                          :format="'yyyy-MM-dd'"
                          :default-value="new Date()"
                          :searchOption="true"
                          :value="sendParam.startDate"
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
                          :value="sendParam.endDate"
                          @change="selectEndDate"
                        />
                      </div>
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
                    <Button :theme-color="'secondary'" :size="'small'" @click="createBtn">{{ $t("MES_CommLang.MES_CommLang_00935") }}</Button><!--버전생성-->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'calendar'" @click="planningBtn">{{ $t("MES_CommLang.MES_CommLang_00835") }}</Button><!--Planning-->
                    <Button :theme-color="'secondary'" :size="'small'" @click="erpBtn">{{ $t("MES_CommLang.MES_CommLang_00836") }}</Button><!--EPR 전송-->
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
    <PlanningPopUp
      ref="planningPopUp"
      :visibleDialog="planningVisible"
      :title="'Planning'"
      @visibleDialog="(val) => planningVisible = val"
      @executeEnd = "executeEnd"
      @resetEnd = "resetEnd"
    />
    <CreateVersionPopUp
      ref="createVersionPopUp"
      :visibleDialog="createVersionVisible"
      :title="'Create Version'"
      @visibleDialog="(val) => createVersionVisible = val"
      @createVersionEnd = "createVersionEnd"
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
import MpsSearch from '@/components/frmErpProductionOrder/MpsSearch.vue';
import ResultSearch from '@/components/frmErpProductionOrder/ResultSearch.vue';
import PlanningPopUp from '@/components/frmErpProductionOrder/PlanningPopUp.vue';
import CreateVersionPopUp from '@/components/frmErpProductionOrder/CreateVersionPopUp.vue';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import { Input } from '@progress/kendo-vue-inputs';

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
    PlanningPopUp,
    CreateVersionPopUp,
    DropDownList,
    DatePicker,
    Input
},
  data() {
    return {
      selectedTab: 0,
      planVersionList:[],
      planOperList: [],
      workCenterList: [],
      productId:'',
      tabs: [
        { title: this.$i18n.t('MES_CommLang.MES_CommLang_00671'), content: 'MpsSearch' },
        { title: this.$i18n.t('MES_CommLang.MES_CommLang_00672'), content: 'ResultSearch' }, 
      ],
      sendParam:{
        planOperValue:'',
        planVersionValue:'',
        workCenterValue:'',
        startDate: new Date(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+60),
        productId:'',
      },
      v1:false,
      mpsSearch:false,
      resultSearch:false,
      planningVisible:false,
      createVersionVisible:false,
    }
  },
  created() {},
  async mounted() {
    await this.getPlanOperListData();
    await this.getWorkCenterListData();
    await this.getPlanVersionListData();
  },
  computed: {
  },
  watch: {},
  methods: {

    // 계획공정 콤보 데이터
    async getPlanOperListData() {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPlanOperList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
      }).then(res => {
        res.map(x=>{
          this.planOperList.push({ id : x.PLANOPERID, text : x.PLANOPERNAME })
        })
        this.sendParam.planOperValue = this.planOperList[2].id;
      })
    },

    // 계획공정 콤보 선택
    selectPlanOper(event) {
      this.sendParam.planOperValue = event.value;
    },

    // W/C 콤보 데이터
    async getWorkCenterListData(){
      await this.mesGet({
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
        this.sendParam.workCenterValue = this.workCenterList[0].id;
      });
    },

    // W/C 콤보 선택
    selectWorkCenter(event) {
      this.sendParam.workCenterValue = event.value;
    },

    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.sendParam.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.sendParam.endDate = event.value;
    },

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
        this.sendParam.planVersionValue = this.planVersionList[0]?.id;
      });
    },

    // 계획 버전 콤보 선택
    selectPlanVersion(event) {
      this.sendParam.planVersionValue = event.value;
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
            messagename: "TxnGetPlanningData",
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
    // 버전생성 버튼
    createBtn(){
      this.createVersionVisible = true;
      this.$refs.createVersionPopUp.getPlanVersionListData();
    },

    // 버전생성 END
    async createVersionEnd(){
      this.createVersionVisible = false;
      await this.getPlanVersionListData();
      await this.searchBtn();
    },
    
    // PLANNING 버튼 - 팝업
    planningBtn(){
      this.planningVisible = true;
      this.$refs.planningPopUp.getPlanVersionListData();
    },
    
    // PLANNING END
    async executeEnd(){
      this.planningVisible = false;
      await this.getPlanVersionListData();
      await this.searchBtn();
    },

    // RESET END
    async resetEnd(){
      this.planningVisible = false;
      await this.getPlanVersionListData();
      await this.searchBtn();
    },

    // ERP 전송 버튼
    erpBtn(){
      // Validation - 결과 조회 탭 선택 
      if(this.selectedTab!=1){
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00086')//선택된 항목이 없습니다.
        );
        return;
      }
      else{
        this.$refs.ResultSearch.erpBtn();
      }

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