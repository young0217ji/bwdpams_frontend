<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="$t('MES_CommLang.MES_CommLang_00530')"
      width="60%"
      height="900"
      @close="toggleDialog"
    >

      <div class="detail-area">
        <div
          class="left-area"
          style="
            display: block;
            float: left;
            width: calc(100% - 5px) !important;
          "
        >
        </div>

          <div class="area-form" style="width: 100%;">
            <div class="area-th" style="width: 10%; text-align: center;">
              <label>
                Line
              </label>
            </div>
            <div class="area-td" style="width: 15%">
              <InputText
                ref="line"
                :boxWidth="'100%'"
                :dataNm="'line'"
                :readonly = "true"
                :defaultValue="line"
              />
            </div>

            
            <div class="area-th" style="width: 10%; text-align: center;">
              <label>
                Work Center
              </label>
            </div>
            <div class="area-td" style="width: 15%;">
              <inputText
                ref="workcenter"
                :boxWidth="'100%'"
                :dataNm="'workcenter'"
                :readonly = "true"
                :defaultValue="toData.WORKCENTER"
              />
            </div>
          

            <div class="area-th" style="width: 10%; text-align: center;">
              <label>
                {{ $t("MES_CommLang.MES_CommLang_00532") }} <!-- 작업지시번호 -->
              </label>
            </div>
            <div class="area-td" style="width: 15%;">
              <InputText
                ref="workorder"
                :boxWidth="'100%'"
                :dataNm="'workorder'"
                :readonly = "true"
                :defaultValue="toData.WORKORDER"
              />
            </div>
            <div class="area-th" style="width: 10%; text-align: center;">
              <label>
                {{ $t("MES_CommLang.MES_CommLang_00045") }} <!-- 계획수량 -->
              </label>
            </div>
            <div class="area-td" style="width: 15%;">
              <InputText
                ref="workorderqty"
                :boxWidth="'100%'"
                :dataNm="'workorderqty'"
                :readonly = "true"
                :defaultValue="toData.WORKORDERQTY"
              />
            </div>
          </div>
          <div class="area-form" style="width: 100%;">
            <div class="area-th" style="width: 10%; text-align: center;">
                <label>
                  {{ $t("MES_CommLang.MES_CommLang_00542") }} <!-- 제품그룹명 -->
                </label>
              </div>
              <div class="area-td" style="width: 15%;">
                <InputText
                  ref="productGroupName"
                  :boxWidth="'100%'"
                  :dataNm="'productGroupName'"
                  :readonly = "true"
                  :defaultValue="productGroupName"
                />
              </div>
            <div class="area-th" style="width: 10%;  text-align: center;">
              <label>
                {{ $t("MES_CommLang.MES_CommLang_00260") }} <!-- 제품명 -->
              </label>
            </div>
            <div class="area-td" style="width: 15%;">
              <InputText
                ref="productname"
                :boxWidth="'100%'"
                :dataNm="'productname'"
                :readonly = "true"
                :defaultValue="toData.PRODUCTNAME"
              />
            </div>
              <div class="area-th" style="width: 10%; text-align: center;">
              <label>
                {{ $t("MES_CommLang.MES_CommLang_00168") }} <!-- 생성일자 -->
              </label>
            </div>
            <div class="area-td" style="width: 15%;">
              <InputText
                ref="wostartdate"
                :boxWidth="'100%'"
                :dataNm="'wostartdate'"
                :readonly = "true"
                :defaultValue="toData.WOSTARTDATE"
              />
            </div>
            <div class="area-th" style="width: 10%; text-align: center;">
              <label>
                {{ $t("MES_CommLang.MES_CommLang_00533") }} <!-- Lot 생성 수량 -->
              </label>
            </div>
            <div class="area-td" style="width: 15%;">
              <InputText
                ref="makelotqty"
                :boxWidth="'100%'"
                :dataNm="'makelotqty'"
                :readonly = "true"
                :defaultValue="toData.MAKELOTQTY"
              />
            </div>

          </div>
      </div>
        <v-col :cols="12" :class="'divList1'" style="margin-top: 8px; height: 25%;">
              <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle style="margin-bottom: 10px;">{{ $t("MES_CommLang.MES_CommLang_00534") }}</CardTitle> <!-- MES Lot 정보 -->
                </v-col>
              </v-row>
              <div ref="divWrapper3" style="height: 100%;">
                  <KendoGrid
                      ref="rowGrid3"
                      :gridHeight="gridHeight"
                      :gridItems="gridData"
                      :sortable="true"
                      :columns="headerParam.gridHeader"
                      :resizable="true"
                      :edit-field="'inEdit'"
                      :isPaging="false"
                      :selected-field="selectedField"
                  />
              </div>
        </v-col>
        <div style="height: 58%;">

          <div style="display: inline-block; float: left; width: 70%; margin-top: 45px;">
            <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00536") }}</CardTitle> <!-- 시작 공정 선택 -->
                </v-col>
              </v-row>
              <div ref="divWrapper4" style="height: 90%;">
                  <KendoGrid
                      ref="rowGrid4"
                      :gridHeight="gridHeight2"
                      :gridItems="gridData2"
                      :sortable="true"
                      :columns="headerParam2.gridHeader"
                      :resizable="true"
                      :edit-field="'inEdit'"
                      :isPaging="false"
                      :selected-field="selectedField"
                      @selectionchange="onSelectionchange"
                      @gridrowclick="onRowClick2"
                  />
              </div>
          <!-- </v-col> -->
        </div>
        <div class="area-form" style="margin-top: 45px; margin-left: 25px; width: 25%; display: inline-block;">
            <div class="area-th">
              <CardTitle>
                {{ $t("MES_CommLang.MES_CommLang_00535") }}  <!-- 생성수량 -->
              </CardTitle>
              <InputText
                    ref="createlotcount"
                    :boxWidth="'100%'"
                    :dataNm="'createlotcount'"
                    :readonly = "false"
                  />
            </div>
            </div>
      </div>
              <v-col cols="12" align="right">
              <div>
              <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn" >{{ $t("MES_CommLang.MES_CommLang_00166") }}</Button> <!-- 생성 -->
              </div>
              </v-col>
        </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" :callBack="() => searchModalVisible = true"/>
  </div>
</template>
<script>
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import AlertPop from "../common/modal/AlertPop.vue";



export default { 
  name: "LotCreateModal",
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    InputText,
    MesSelectBox,
    CardTitle,
    MesVariableSelectBox,
    KendoGrid,
    gridHeaderMinin,
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    },
    initData: {

    },
    initData2: {

    }
  },
  data() {
    return {
      saveData: [],
      toData: {
        PRODUCTORDERID: "",
        DUEDATE: "",
        PLANORDERQTY: "",
        PRODUCTUNIT: "",
        PLANSTARTDATE: "",
        PLANENDDATE: "",
        PRODUCTID: "",
        PROCESSROUTEID:"",
        PRODUCTNAME:"",
        PROCESSROUTENAME:"",
        PROCESSROUTETYPE:"",
        BOMID:"",
        BOMVERSION:"",
        POLICYNAME:"",
        POLICYVALUE:"",
        CONDITIONTYPE:"",
        CONDITIONID:"",
        STARTQUANTITY:"1",
        PRODUCTTYPENAME:"",
        PRODUCTQUANTITY:"",
        LOTTYPE:"P",
        WORKORDER:"",
        WORKCENTER:"",
        WOSTARTDATE:"",
        WORKORDERQTY:"",
        MAKELOTQTY:"",
        PRIORITY:5,
        PLANTID: "",
        DEPARTMENTID: "",
        DEPARTMENTNAME:"",
        AREAID: "",
        AREANAME: "",
        LINE: ""
      },
      gridHeight : '350px',
      gridHeight2 : '350px',
      selectedField: 'selected',
      gridOriData : [],
      gridOriData2 : [],
      gridData : [],
      gridData2 : [],
      selectedData : {},
      bomid: "",
      bomversion: "",
      policyname: "",
      policyvalue: "",
      conditiontype: "",
      conditionid: "",
      createlotcount: "",
      startprocessid: "",
      startprocesssequence: "",
      isNumberValid: false, // 생성수량 입력값이 숫자인지 여부를 저장하는 데이터 변수
      headerParam: {
          gridid: "dgvLotList_Create3", // 그리드 ID
          rowStat: "", //rowStat 표시 여부
          gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      headerParam2: {
          gridid: "dgvStartProcess", // 그리드 ID
          rowStat: "", //rowStat 표시 여부
          gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      departmentid: "",
      areaid: "",
      line: "",
      productGroupName: ''
    }
  },
  computed: {
  },
  async mounted() {

      this.toData.PLANTID = this.initData.PLANTID; // PLANTID
      this.toData.PRODUCTORDERID = this.initData.PRODUCTORDERID; // PRODUCTORDERID
      this.toData.DUEDATE = this.initData.DUEDATE; // 납기일
      this.toData.PLANORDERQTY = this.initData.PLANORDERQTY; // 주문수량
      this.toData.PRODUCTUNIT = this.initData.PRODUCTUNIT; // 주문단위
      this.toData.PLANSTARTDATE = this.initData.PLANSTARTDATE; // 계획시작일
      this.toData.WOSTARTDATE = this.initData.WOSTARTDATE; // 작지시작일
      this.toData.PLANENDDATE = this.initData.PLANENDDATE; // 계획종료일
      this.toData.PRODUCTID = this.initData.PRODUCTID; // 제품코드
      this.toData.PROCESSROUTEID = this.initData.PROCESSROUTEID; // 라우팅코드
      this.toData.PRODUCTNAME = this.initData.PRODUCTNAME; // 제품명
      this.toData.PROCESSROUTENAME = this.initData.PROCESSROUTENAME; // 라우팅명
      this.toData.PROCESSROUTETYPE = this.initData.PROCESSROUTETYPE; // 구분
      this.toData.BOMID = this.initData.BOMID; // BOM ID
      this.toData.BOMVERSION = this.initData.BOMVERSION; // BOM Ver
      this.toData.POLICYNAME = this.initData.POLICYNAME; // 생산방법
      this.toData.POLICYVALUE = this.initData.POLICYVALUE; // 조건구분
      this.toData.CONDITIONTYPE = this.initData.CONDITIONTYPE; // 작업구분
      this.toData.CONDITIONID = this.initData.CONDITIONID; // 조건명
      this.toData.STARTQUANTITY = '1'; // 생성수량
      this.toData.WORKORDERQTY = this.initData.WORKORDERQTY; // 계획수량
      this.toData.MAKELOTQTY = this.initData.MAKELOTQTY; // 계획수량
      this.toData.PRODUCTTYPENAME = this.initData.PRODUCTTYPENAME; //생산구분
      this.toData.PRODUCTQUANTITY = this.initData.PRODUCTQUANTITY; // 기준생산량 >> 작업지시수량 명칭변경 2023.03.28
      this.toData.WORKORDER = this.initData.WORKORDER; // WORKORDER
      this.toData.WORKCENTER = this.initData.WORKCENTER; // WORKCENTER
      this.toData.LOTTYPE = this.initData.LOTTYPE; // LOTTYPE

      this.line = this.initData2.LINE;
      this.productGroupName = this.initData2.PRODUCTGROUPNAME;
      
      await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper3);
      await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper4);
      await this.getGridData();
  },
  methods: {
  // MES별 LOT정보 데이터 가져오기
  async getGridData() {
    this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetLotInfoList3",
      sendParam: {
        plantid: this.initData.PLANTID,
        productid: this.initData.PRODUCTID,
        workorder: this.initData.WORKORDER,
        workcenter: this.initData.WORKCENTER
      }
    }).then((res) => {
       const data = res.map((x, idx) => {
        return {
          ...x,
          rowStat: "N",
          selected: false,
          idx: idx,
          inEdit: true,
          newRow: false
        }
      });
      // this.gridOriData = data;
      this.gridData = data;
      this.getGridData2();
    })
  },
  async getGridData2() {
    this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetConsumableConditionData",
      sendParam: {
        plantid: this.$auth.$state.user.plantId,
        productid: this.initData.PRODUCTID,
        bomid: this.initData.BOMID,
        bomversion: this.initData.BOMVERSION,
        policyname: this.initData.POLICYNAME,
        policyvalue: this.initData.POLICYVALUE,
        ConditionType: this.initData.CONDITIONTYPE, // 수정해야할 듯 ConditionType >> conditiontype
        conditionid: this.initData.CONDITIONID,
      }
    }).then((res) => {
       const data = res.map((x, idx) => {
        return {
          ...x,
          rowStat: "N",
          selected: false,
          idx: idx,
          inEdit: true,
          newRow: false
        }
      });
      if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
          this.selectedData = data[0];
        }
      this.gridData2 = data;
    })

  },
    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //그리드 로우 클릭
    onRowClick2 (event) {
      //그리드 로우 클릭시 라인표시 유무 확인필요
      this.gridData2.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.selectedData = event.dataItem;
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    changeInput(nm, val){
      this.toData[nm] = val;
    },
    comboChange(nm, val){
      this.toData[nm] = val;
      if(nm === "departmentid" ){
        this.$refs.comboArea.sendParam.department = this.toData.DEPARTMENTID;
        this.$refs.comboArea.getComboList();
      }
    },
    isEmptyObject(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    saveBtn(){
      this.createlotcount = this.$refs['createlotcount'].textVal;
      const numericRegex = /^[0-9]+$/; 
      this.isNumberValid = numericRegex.test(this.createlotcount);
      /* 첫번 째 공정 선택 시 startprocessid, startprocesssequence 빈값으로 전송 */
      if(this.gridData2[0].selected != false){
        this.startprocessid = "";
        this.startprocesssequence = "";
      }else{
        this.startprocessid = this.selectedData.PROCESSID;
        this.startprocesssequence = this.selectedData.PROCESSSEQUENCE;
      }
      /* 생성수량 숫자 여부 Validation */
      if(this.isNumberValid != true){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00219')); /* 알림, 생성수량은 숫자로 입력해주세요. */
      }else{
        /* 시작공정 선택 여부 Validation */
        if (this.isEmptyObject(this.selectedData)) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00220')); /* 알림, 시작공정을 선택해주세요. */
        }else{
          this.saveData.push(this.toData);
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnCreateLot",
            sendParam: this.saveData,
            params2: {
              CREATELOTCOUNT: this.createlotcount,
              STARTPROCESSID: this.startprocessid,
              STARTPROCESSSEQUENCE: this.startprocesssequence
            }
          }).then(result => {
            this.$emit('saveBtn', result.returncode);
              this.$nextTick(() => {
                if (result.returncode !== undefined && result.returncode === '0') {
                  this.$emit('visibleDialog', !this.visibleDialog);
                }
              });
            });
        }
      }
    },
    closeBtn(){
      this.$emit('visibleDialog', !this.visibleDialog)
    },
  },
};
</script>
<style lang="scss">
  .search-box {
    width: 100%;
  }
</style>