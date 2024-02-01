<template>
    <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00755") }}</li> <!-- 특채신청 목록 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00540") }}</label> <!-- 품번그룹명 -->
                    <DropDownList
                      ref="cmbProGroup"
                      :style="{ width: '250px' }"
                      :data-items="productGroupList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="productGroupValue"
                      @change="productGroupChange"
                      >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00545") }}</label> <!-- 품번 -->
                    <InputText
                      ref="product"
                      :dataNm="'productid'"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00740") }}</label> <!-- 업체  -->
                    <DropDownList
                      ref="cmbCompanyGroup"
                      :style="{ width: '250px' }"
                      :data-items="companyList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="companyValue"
                      @change="companyChange"
                      >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00681") }}</label> <!-- Work Center  -->
                    <DropDownList
                      ref="cmbWorkCenter"
                      :style="{ width: '250px' }"
                      :data-items="workCenterList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :allYN="true"
                      :value="workCenterValue"
                      @change="workCenterChange"
                      >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00741") }}</label> <!-- 등록일자 -->
                      <div class="form-datepicker">
                        <DatePicker
                          ref="startDate"
                          :format="'yyyy-MM-dd'"
                          :default-value="new Date()"
                          :searchOption="true"
                          :value="startDate"
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
                          :value="endDate"
                          @change="selectEndDate"
                        />
                      </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button 
                > <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row>
                  <v-col cols="4" align="left">
                      <CardTitle>&nbsp;</CardTitle><!-- 자격인증관리 -->
                  </v-col>
                  <v-col cols="8" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00757") }}</Button> <!-- 신규등록 -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="showUbiform">{{ $t("MES_CommLang.MES_CommLang_00854") }}</Button> <!-- 출력 -->
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="finishBtn">{{ $t("MES_CommLang.MES_CommLang_00495") }}</Button><!-- 완료 -->
                  </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :checkHeaderArr="checkBox"
                  :isPaging="true"
                  :scrollable="false"
                  :reSetPage="this.reSetPage"
                  @gridrowclick="onRowClick"
                  @rowdblclick="rowdblclick"
                  @selectionchange="onSelectionchange"
                  @pageChangeEvent="pageChangeEvent"
              />
              </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <CreateConcessionModal
    v-if="insertModalVisible"
    :visibleDialog="insertModalVisible"
    @visibleDialog="(val) => insertModalVisible = val"
    @insert="insertSave"
    />
    <ConcessionJudgmentModal
    v-if="updateModalVisible"
    :visibleDialog="updateModalVisible"
    :selectedRowData="selectedConcessionRow"
    @visibleDialog="(val) => updateModalVisible = val"
    @save="updateSave"
    />
    <ConfirmPop
      :is="'confirmPop'"
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
    />
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <WindowPop ref="windowPop" :formName="'ConcessionReport'"></WindowPop>
  </div>

</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import AlertPop from "@/components/common/modal/AlertPop";
import { Button } from '@progress/kendo-vue-buttons';
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker, TimePicker, DateTimePicker } from "@progress/kendo-vue-dateinputs";
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import GetUserModal from "@/components/common/modal/GetUserModal.vue";
import CreateConcessionModal from '@/components/frmCreateConcession/CreateConcessionModal.vue';
import ConcessionJudgmentModal from '@/components/frmCreateConcession/ConcessionJudgmentModal.vue';
import WindowPop from '@/components/common/WindowPop';


let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
    AlertPop,
    KendoGrid,
    InputText,
    DropDownList,
    MesSelectBox,
    DatePicker,
    GetUserModal,
    CreateConcessionModal,
    ConcessionJudgmentModal,
    WindowPop,
  },
  data() {
    return {
      gridHeader:[],
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      selectedField: "selected",
      checkBox: [],
      productGroupList: [
        {
          text: '전체',
          id: '',
        }
      ], 
      productGroupValue: '',
      selectedRequestitem: '',
      selectedRequestitemName: '',
      selectedReceiverUserId: '',
      selectedReceiverUserName: '',
      companyList: [
        {
          text: '전체',
          id: '',
        }
      ],
      companyValue: '',
      workCenterList: [
        {
          text: '전체',
          id: '',
        }
      ],
      workCenterValue: '',
      headerParam: {
        gridid: "dgvConcessionList", // 그리드ID
        gridHeader: [],
        noRowstat: true,
        noFirstCheck: true,
        xOverflowYn: true,
      },
      startDate: new Date(),
      endDate: new Date(),
      insertModalVisible: false,
      updateModalVisible: false,
      reSetPage: false,

    }
  },
  created() {

  },
  async mounted() {
    await this.getProductGroupData();   // 품번그룹명 콤보
    await this.getCompanyListData();    // 업체목록 콤보
    await this.getWorkCenterListData(); // WorkCenter 콤보 

    const date = new Date();
    date.setDate(this.endDate.getDate()-30);
    this.startDate = date;
    await this.getGridData();
  },
  computed: {

  },
  watch: {},  
  methods: {


    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },

    // ======================= 검색 조건 ==========================

    // 품번그룹명 콤보 change 
    productGroupChange(event) { 
      this.productGroupValue = event.value;
    },

    // 검색 INPUT 변경 시
    searchInput(nm, val) {
          this[nm] = val;
    },

    // 업체명 콤보 change 
    companyChange(event) {
      this.companyValue = event.value;
    },

    // WorkCenter 콤보 change
    workCenterChange(event) {
      this.workCenterValue = event.value;
    },

    // 기간 - 시작일 선택
    selectStartDate(event) {
      this.startDate = event.value;
    },
    
    // 기간 - 종료일 선택
    selectEndDate(event) {
      this.endDate = event.value;
    },

    // 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProductGroupList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        for(let i = 0; i < data.length; i++){
          if(i < data.length){
            this.productGroupList.push({ id : data[i].PRODUCTGROUPID, text : data[i].PRODUCTGROUPNAME });
            this.productGroupValue = this.productGroupList[0];
          }
        }
      });
    },

    // 업체 콤보 데이터 가져오기
    async getCompanyListData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetCompanyDefinitionList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        for(let i = 0; i < data.length; i++){
          if(i < data.length){
            this.companyList.push({ id : data[i].COMPANYID, text : data[i].COMPANYNAME });
            this.companyValue = this.companyList[0];
          }
        }
      });
    },

    // 검색조건 WorkCenter 콤보박스 데이터 가져오기
    async getWorkCenterListData(){
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00003',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          AREATYPE: 'WorkCenter',
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        for(let i = 0; i < data.length; i++){
          if(i < data.length){
            this.workCenterList.push({ id : data[i].CODE, text : data[i].NAME });
            this.workCenterValue = this.workCenterList[0];
          }
        }
      });
    },


    // 조회버튼
    async searchBtn() {
      this.reSetPage = true;
      this.getGridData();
    },

    // 그리드 데이터 가져오기
    async getGridData() {
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: "mes/common/customquerypaging",
        queryId: "GetConcessionList",
        queryVersion: "00001",
        sendParam: {
            plantid: this.$auth.$state.user.plantId,
            productGroupid: this.productGroupValue.id,
            productid: this.productid,
            workcenter: this.workCenterValue.id,
            requestcompany: this.companyValue.id,
            startdate: this.DateToYYYYMMDDString(this.startDate),
            enddate: this.DateToYYYYMMDDString(this.endDate),
            skip: skip,
            take: take,
        },
        }).then(({list, paging, ...x}) => {
        const data = list.map((x, idx) => {
            return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            };
        });
        this.$nuxt.$emit("iccReset");
        this.gridPageData = paging;
        this.gridData = data;
        this.gridOriData = data;
        });
    },

    async pageChangeEvent(skip=0, take=20) {
      this.gridPageData = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridData();
      
    },

    // 신규등록 버튼
    addBtn() {
      this.insertModalVisible = true;
    },

    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      this.selectedConcessionRow = event.dataItem;
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },

    // 완료 버튼 클릭
    finishBtn() {
      const saveData = [{
        ...this.selectedConcessionRow,
        _ROWSTATUS: "U",
        CONCESSIONSTATE: 'Finish',
        TYPE:'CONCESSION',
      }];

      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnCreateConcession',
        sendParam: saveData,
      }).then(result => {
        this.$nextTick(() => {
        if (result.returncode !== undefined && result.returncode === '0') {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00277')); /* 알림, 완료되었습니다.*/
          return;
        } 
        });
      });
    },


    // 그리드 로우 클릭
    onRowClick(event) {
      this.selectedConcessionRow = event.dataItem;
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;

    },  


    rowdblclick(event) {
      this.selectedConcessionRow = event.dataItem;
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.updateModalVisible = true;
    },

    
    // 신청서 작성시 alertPop
    insertSave() {
      this.$refs.alertPop.show("알림","신청서가 등록되었습니다.")
      this.insertModalVisible = false;
      this.getGridData();
    },

    // 신청서 수정 및 결재완료시 alertPop
    updateSave() {
      this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
      this.updateModalVisible = false;
      this.getGridData();
    },

    // 레포트 출력
    showUbiform(){
      if (this.selectedConcessionRow == undefined) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00087')
        ); /* 알림, 선택한 데이터가 없습니다.*/
        return;
      }
      const datasetList = {};
      const paramList = {};
      datasetList.dataset_0 = this.selectedConcessionRow;

      this.$refs.windowPop.show(datasetList, paramList);    
    },


    //전체excel
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetConcessionList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productGroupid: this.productGroupValue.id,
          productid: this.productid,
          workcenter: this.workCenterValue.id,
          requestcompany: this.companyValue.id,
          startdate: this.DateToYYYYMMDDString(this.startDate),
          enddate: this.DateToYYYYMMDDString(this.endDate),
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
        },
      });
    },

    //페이지excel
    getExcelPaging() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
      const {skip=0, take=20} = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetConcessionList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productGroupid: this.productGroupValue.id,
          productid: this.productid,
          workcenter: this.workCenterValue.id,
          requestcompany: this.companyValue.id,
          startdate: this.DateToYYYYMMDDString(this.startDate),
          enddate: this.DateToYYYYMMDDString(this.endDate),
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },
  },
}

</script>