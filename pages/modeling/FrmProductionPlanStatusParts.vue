<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00801") }}</li> <!-- PARTS 생산순서 관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">                
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00681") }}</label> <!-- Work Center  -->
                    <DropDownList
                        ref="cmbWorkCenter"
                        :style="{ width: '200px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="workCenterValue"
                        @change="workCenterChange"
                        >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00706")}}</label> <!-- 계획일 -->
                    <div class="form-datepicker">  
                      <DatePicker
                        ref="workDate"
                        :name="'workDate'"
                        :default-value="new Date()"
                        :value="workDate"
                        :format="'yyyy-MM-dd'"
                        @change="dateChange"
                      />
                    </div>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '20px'}">
                    <div class="form-chk">
                      <Checkbox
                        ref="colunmFix"
                        :dataNm="'colunmFix'"
                        :disabled="false"
                        :defaultchecked="false"
                        @checkbox-set="chkVal"
                      ></Checkbox>
                    </div>
                    <NumericTextBox 
                      ref="colunmFixInput"
                      v-model="colunmFixInput"
                      :default-value="0"
                      :style="{ width: '35px', marginLeft: '5px'}" 
                      @change="setColunmFixInput">
                    </NumericTextBox>
                    <label :style="{marginLeft: '-20px'}" >&nbsp;개 열 고정</label>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        ref="inspectionHis"
                        :dataNm="'inspectionHis'"
                        :disabled="false"
                        :defaultchecked="false"
                        @checkbox-set="chkVal"
                      ></Checkbox>
                    </div>
                    <label>&nbsp;조립 계획/합계 보기</label>
                  </div>
                </div>
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00923") }}</label> <!-- 조립 기준일 -->
                  </div>
                  <div v-for="index in 4" class="form-group" :key="index" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        :ref="'assemblyDays'+index"
                        :dataNm="String(index)"
                        :disabled="false"
                        :defaultchecked="assemblyDaysChk[index]"
                        :checked="assemblyDaysChk[index]"
                        :checkedControl="true"
                        @checkbox-set="chkAssemblyDays"
                      ></Checkbox>
                    </div>
                    <label :style="{marginLeft: '-25px'}" >&nbsp;+{{ index }}일 계획</label>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" :size="'medium'" :icon="'save'" @click="saveBtn(false)">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
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
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="false"
                :columns="headerParam.gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :isPaging="false"
                :scrollable="true"
                :gridDropDownList="headerParam.enumComboBox"
                :pkNotEditArr="headerParam.pkColumn"
                :dataItem="gridData"
                :dropPosition="dropPosition"
                :rowClass= "rowClass"
                @gridddchang="rowDdChange"
                @gridrowclick="onRowClick"
                @griditemchange="griditemchange"
                @selectionchange="onSelectionchange"
                @headerselectionchange="onHeaderSelectionChange"
                @dragHandler="dragHandler"
                @pressHandler="pressHandler"
                @releaseHandler="releaseHandler">
              </KendoGrid>
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import Checkbox from "@/components/common/input/Checkbox";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { NumericTextBox } from "@progress/kendo-vue-inputs";
import DateUtility from '~/plugins/dateUtility';

let myTitle;
let myMenuId;


export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit('setActiveMenuInfo', myState.menuData[myMenuId]);
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
    InputText,
    MesSelectBox,
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    DatePicker,
    Checkbox,
    NumericTextBox
  },
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      workCenterList: [],
      workCenterValue: '',
      equipmentValue: '',
      nowDate: new Date(),
      workDate: new Date(),
      colunmFix: false,
      colunmFixInput: null,
      isReadOnly: false,
      resetCycle: false,
      resetCycleInput: "",
      inspectionHis: false,
      selectedField: "selected",
      selectedIdx: null,
      assemblyDaysChk: {1:true, 2:false, 3:false, 4:false},
      assemblyDays: 1,
      lastPlanStartPrior: null,
      firstPlanStartPrior: null,
      headerParam: {
        gridid: 'dgvProductionPlanStatusParts',
        gridHeader: [],
        noRowstat: true,
        // noFirstCheck: true,
        xOverflowYn: true,
        // enumComboBox: [ {dataVal:'WORKCENTER', dataItem:[]},'CERTIFICATIONTYPE', 'CERTIFICATIONSUBTYPE',],
        // pkColumn: ['CERTIFICATIONID']
      },

      top: 0,
      left: 0,
      targetTopOffset: null,
      targetLeftOffset: null,
      showDropHints: false,
      dropPosition: '',
      activeItem: {},
      targetRowIdx: null,
      orgTargetRowIdx: null,
      targetData: {},
      targetDate: '',
      targetDayOfWeek : ''
      };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getWorkCenterListData();
    // const gridBody = document.getElementsByClassName("k-grid-content")[0];
    // gridBody.addEventListener("mouseover", this.gridMouseover, false)
    // gridBody.addEventListener("mouseout", this.gridMouseout, false)
  },
  unmounted() {
      // const gridBody = document.getElementsByClassName("k-grid-content")[0];
      // gridBody.removeEventListener("mouseover", this.gridMouseover, false)
      // gridBody.removeEventListener("mouseout", this.gridMouseout, false)
  },

  computed: {
  },
  watch: {},
  methods: {

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
        res.filter(x => x.CODE === 'P040').map(x=>{
          this.workCenterList.push({ id : x.CODE, text : x.NAME })
        });
        this.workCenterValue = this.workCenterList[0];
        this.searchBtn();
      });
    },

    // 설비 ID 조회
    // async getWCEquipment() {
    //     this.mesGet({
    //         apiKey: 'mes/common/getqueryresult',
    //         queryId: 'GetWCEquipment', // 2023.12.20 기준 쿼리에 LIKE 'TEST%' 적용중.....
    //         sendParam: {
    //           plantid: this.$auth.$state.user.plantId,
    //           WORKCENTER: this.workCenterValue.id,
    //         },
    //     }).then(res => {
    //       res.map(x=>{
    //         this.equipmentValue = x.EQUIPMENTID;
    //       });
    //       this.getGridData();
    //     });
    // },

    // 조회 버튼
    async searchBtn() {

      // const bfrDate = new Date();
      // const aftDate = new Date();
      // bfrDate.setDate(bfrDate.getDate()-4);
      // aftDate.setDate(aftDate.getDate()+4);

      // if(this.DateToYYYYMMDDString(this.workDate) <= this.DateToYYYYMMDDString(bfrDate) || this.DateToYYYYMMDDString(this.workDate) >= this.DateToYYYYMMDDString(aftDate)){
      //   this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00280')); /* 알림, 계획일자를 확인하십시오.\n(3일이전, 이후 지정불가) */
      //   return;
      // } else if(this.DateToYYYYMMDDString(this.workDate) != this.DateToYYYYMMDDString(new Date())){
      //   this.$refs['confirmPop'].title = "Warning";
      //   this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00281'); /* 확정 기준 일자(계획)와 실제(당일) 일자가 다릅니다.\n계속 진행 하시겠습니까? */
      //   this.$refs['confirmPop'].callBack = this.getGridData;
      //   this.$refs['confirmPop'].modalWidth = "300px";
      //   this.$refs['confirmPop'].visibleDialog = true;
      // } else {
        this.getGridData();
      // }
    },

    // 그리드 데이터 가져오기
    async getGridData() {

      let displayAssemblyPlanDate = "";
      let cnt = 0;
      let total = {
        QUANTITY: 0, // 계획
        QUANTITYPRODUCT: 0, // 양품
        QUANTITYNOTOK: 0, // 불량
        NEEDTIME: 0 // 소요시간
      
      };
      this.mesGet({
        // apiKey: 'mes/common/customquery',
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProductionPlanStatusParts',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTERID: this.workCenterValue.id,
          WORKDATE: this.DateToYYYYMMDDString(this.workDate),
          ASSEMBLYDAYS: this.assemblyDays,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
              ...x,
              rowStat: 'N',
              selected: false,
              idx: idx,
              inEdit: true,
              TOTALROW: ''
          }
        });
        const sumData = [];
        let firstPlanStartPriorChk = true;
        data.map((x, idx) => {
          sumData.push({
            ...x,
            rowStat: 'N',
            selected: false,
            idx: cnt,
            inEdit: true,
            TOTALROW: ''
          });
          if(x.CONFIRMFLAG === "X" && firstPlanStartPriorChk){
            this.firstPlanStartPrior = x.PLANSTARTPRIOR;
            firstPlanStartPriorChk = false;
          }
          if(x.CONFIRMFLAG === "O"){
            this.lastPlanStartPrior = x.PLANSTARTPRIOR;
          }
          displayAssemblyPlanDate = x.DISPLAYASSEMBLYPLANDATE;
          total.QUANTITY = total.QUANTITY + Number(x.QUANTITY === undefined ? 0 : x.QUANTITY);
          total.QUANTITYPRODUCT = total.QUANTITYPRODUCT + Number(x.QUANTITYPRODUCT === undefined ? 0 : x.QUANTITYPRODUCT);
          total.QUANTITYNOTOK = total.QUANTITYNOTOK + Number(x.QUANTITYNOTOK === undefined ? 0 : x.QUANTITYNOTOK);
          total.NEEDTIME = total.NEEDTIME + Number(x.NEEDTIME === undefined ? 0 : x.NEEDTIME);
          if(data.length - 1 === idx){
            sumData.push({
              rowStat: 'N',
              selected: false,
              idx: ++cnt,
              inEdit: false,
              TOTALROW: 'ROW_TOTAL',
              QUANTITY: total.QUANTITY, // 계획
              QUANTITYPRODUCT: total.QUANTITYPRODUCT, // 양품
              QUANTITYNOTOK: total.QUANTITYNOTOK, // 불량
              NEEDTIME: total.NEEDTIME.toFixed(2) // 소요시간
            });
          }
          cnt++;
        });
        this.$nuxt.$emit('iccReset');
        this.gridData = sumData;
        this.gridOriData = JSON.parse(JSON.stringify(this.gridData));
      });
    }, 
    
    // 저장
    saveBtn(edit) {
      // if(this.DateToYYYYMMDDString(this.workDate) != this.DateToYYYYMMDDString(new Date())){
      //   this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00282')); /* 알림, 확정 기준 일자(계획)와 실제(당일) 일자가 다릅니다.\n확인 후 다시 처리하시기 바랍니다. */
      //   return;
      // }

      let saveData;

      if(edit){
        saveData = this.gridData.filter(x => x.rowStat === "U" && x.TOTALROW === "").map((x, idx) => {
          return {
            ...x,
            PLANTID: this.$auth.$state.user.plantId,
            WORKDATE: this.DateToYYYYMMDDString(this.workDate),
            rowStat: "U",
            _ROWSTATUS: "U"
          };
        });
      } else {
        saveData = this.gridData.filter(x => x.selected && x.CONFIRMFLAG === "X").map((x, idx) => {
          return {
            ...x,
            PLANSTARTPRIOR: ++this.lastPlanStartPrior,
            PLANTID: this.$auth.$state.user.plantId,
            WORKDATE: this.DateToYYYYMMDDString(this.workDate),
            rowStat: "U",
            _ROWSTATUS: "U"
          };
        });
      }

      console.log(saveData)

      if(saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnProcWorkOrderForParts',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getGridData();
            } 
          });
        });
      } else {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다.*/
        return;
      }
    },

    // WorkCenter 콤보 change
    workCenterChange(event) {
      this.workCenterValue = event.value;
      this.searchBtn();
    },

    // DatePicker 변경
    dateChange(e){
      this[e.target.name] = e.value;
      this.searchBtn();
    },

    // 검색 ComboBox 변경 시
    comboChange(nm, val) {
        this[nm] = val;
    },

    // 검색 INPUT 변경 시
    searchInput(nm, val) {
        this[nm] = val;
    },

    // 열 고정 INPUT 변경 시
    setColunmFixInput(e) {
      this.colunmFixInput = e.value;
      if(this.colunmFix === true){
        if(this.colunmFixInput > 0){
          for(let i = 0; i < this.colunmFixInput; i++){
            this.headerParam.gridHeader[i].locked = true;
          }
        } else {
          for(let i = 0; i < this.headerParam.gridHeader.length; i++){
            this.headerParam.gridHeader[i].locked = false;
          } 
        }
      } else {
        for(let i = 0; i < this.headerParam.gridHeader.length; i++){
          this.headerParam.gridHeader[i].locked = false;
        } 
      }
    },

    // 선택 버튼 클릭시
    selectBtn() {
        alert("선택!");
    },

    // 이동 버튼 클릭시
    moveBtn() {
        alert("이동!");
    },

    // 선택취소 버튼 클릭시
    unSelectBtn() {
        alert("선택취소!");
    },

    // 새로고침 버튼 클릭시
    resetBtn() {
      alert("새로고침!");  
    },

    // 새로고침 주기 INPUT 변경시
    setResetCycleInput(nm, val) {
        this[nm] = val;
    },

    chkVal(nm, val) {
      this[nm] = val;
      // nm : colunmFix / resetCycle / inspectionHis
      if(nm === "colunmFix") {
        if(this[nm] === true){
          if(this.colunmFixInput > 0){
            for(let i = 0; i < this.colunmFixInput; i++){
              this.headerParam.gridHeader[i].locked = true;
            }
          } else {
            for(let i = 0; i < this.headerParam.gridHeader.length; i++){
              this.headerParam.gridHeader[i].locked = false;
            }
          }
        } else {
          for(let i = 0; i < this.headerParam.gridHeader.length; i++){
              this.headerParam.gridHeader[i].locked = false;
            }
        }
      }
      if(nm === "resetCycle"){
        alert("새로고침:::" + val);
      }
      if(nm === "inspectionHis"){
        alert("점검이력:::" + val);
      }
    },


    // plusOneDayPlan: false,
    //   plusTwoDayPlan: false,
    //   plusThreeDayPlan: false,
    //   plusFourDayPlan: false,

    chkAssemblyDays(nm, val) {
      for(let i = 1; i < 5; i++){
        this.assemblyDaysChk[i] = false;
      }
      this.assemblyDaysChk[nm] = val;
      this.assemblyDays = nm;
    },

    // 그리드 INPUT 제외 수정
    rowDdChange(e, name, dataItem){
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name == 'CHANGEOPERDATE') {
        data[idx][name] = e.value
        
        const expectDate = new Date(e.value);

        expectDate.setFullYear(expectDate.getFullYear() + 1);
        
        data[idx].DISQUALIFICATIONEXPECTDATE = Utility.setFormatDate(expectDate, "YYYYMMDD")
      }
      
      data[idx] = { ...data[idx], [name]: e.value };
      if(data[idx].rowStat === 'N') {
          data[idx].rowStat = 'U';
      }
      
      if(data[idx].rowStat === 'U' && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)) {
          // data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };

      let gridHeader = []; 
      this.headerParam.gridHeader.map(x => {
        if(x.children === undefined){
          gridHeader.push(x);
        } else {
          x.children.map(y => {
            gridHeader.push(y);
          });
        }
      });

      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(gridHeader, data, this.gridOriData, idx)) {
        data[idx].rowStat = "N";
      }
      
      this.gridData = data;
      this.saveBtn(true);
    },

    // 그리드 ROW 선택
    onRowClick(event){
      this.selectedIdx = event.dataItem.idx;
      const dataKey = event.dataItem.DATAKEY;
      if(dataKey != undefined && dataKey != ""){
        this.gridData = this.gridData
        .map(item => {
          return {
            ...item,
            selected: item.idx === this.selectedIdx ? !item.selected : item.selected,
          };
        });
        event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      }
    },

    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      this.selectedIdx = event.dataItem.idx;
      const dataKey = event.dataItem.DATAKEY;
      if(dataKey != undefined && dataKey != ""){
        this.gridData = this.gridData
        .map(item => {
          return {
            ...item,
            selected: item.idx === this.selectedIdx ? !item.selected : item.selected,
          };
        });
        event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      }
    },

    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      // 전체 체크일 경우
      if (checked) {
        this.gridData = this.gridData.map(item => {
          return {
            ...item,
            selected: checked,
          };
        });
      }
      else {
        this.gridData = this.gridData.map(item => {
          return {
            ...item,
            selected: checked,
          };
        });
      }
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    dragHandler(dataItem, event) {
      // if(this.targetRowIdx === undefined || this.targetRowIdx == "") { // 최초 rowIdx를 설정
      //   this.targetRowIdx = event.originalEvent.target.parentElement.rowIndex; 
      // }
      if(dataItem.TOTALROW != ""){
        return;
      }

      this.top = event.pageY + 10;
      this.left = event.pageX;
      this.targetLeftOffset = this.getGridReference().offsetLeft + this.getGridReference().offsetLeft/2;
      this.targetTopOffset = this.getTargetTopOffSet(event);
      this.getDropPosition(event);
      this.showDropHints = true;

    },

    getDropPosition: function(event){
      const targetRowIdx = event.originalEvent.target.parentElement.rowIndex; // 셀영역 rowIdx
      const iconRowIdx = event.originalEvent.target.parentElement.parentElement.rowIndex; // 아이콘영역의 부모 rowIdx
      
      if(iconRowIdx != undefined){
        this.targetRowIdx = iconRowIdx;
      } else {
        this.targetRowIdx = targetRowIdx;
      }
    },

    pressHandler(dataItem, event) {
      // this.selectedIdx = dataItem.idx;
      // const dataKey = dataItem.DATAKEY;
      // if(dataKey != undefined && dataKey != ""){
      //   this.gridData = this.gridData
      //   .map(item => {
      //       return {
      //       ...item,
      //       selected: item.idx === this.selectedIdx ? true : false,
      //       };
      //   });
      // }
      this.activeItem = dataItem;

    },

    releaseHandler(dataItem, event) {
      console.log("release")
      this.showDropHints = false;

      // console.log(this.gridData[this.targetRowIdx+1].PLANSTARTPRIOR)
      // console.log(dataItem)
      
      // this.gridData[dataItem.idx+1].PLANSTARTPRIOR = dataItem.PLANSTARTPRIOR;
      // if(this.DateToYYYYMMDDString(this.workDate) != this.DateToYYYYMMDDString(new Date())){
      //   this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00282')); /* 알림, 확정 기준 일자(계획)와 실제(당일) 일자가 다릅니다.\n확인 후 다시 처리하시기 바랍니다. */
      //   return;
      // }

      if(dataItem.TOTALROW != "" || this.gridData[this.targetRowIdx].TOTALROW != ""){
        return;
      }
      if(dataItem.DATAKEY === this.gridData[this.targetRowIdx].DATAKEY){
        return;
      }
      if(dataItem.CONFIRMFLAG === "O" || this.gridData[this.targetRowIdx].CONFIRMFLAG === "O"){
        return;
      }
      
      // this.targetDate = this.gridData[this.targetRowIdx].PLANSTARTDATE;
      // this.targetDayOfWeek = DateUtility.getWeek(null, this.targetDate);
      // this.activeItem.PLANSTARTDATE = this.targetDate;
      // this.activeItem.DISPLAYWORKDATE = this.targetDayOfWeek;

      // this.targetDate = this.gridData[this.targetRowIdx].PLANSTARTPRIOR;
      
      let firstPlanStartPrior = this.firstPlanStartPrior;

      const reorderedData = this.reorderData(event, this.gridData, this.activeItem, "none");
      
      this.activeItem = {};

      this.gridData = reorderedData;

      this.gridData = this.gridData
      .map((item, idx) => {
        if(item.CONFIRMFLAG === "X"){
          console.log(item)
          return {
            ...item,
            idx: idx,
            PLANSTARTPRIOR: firstPlanStartPrior++
          };
        } else{
          return {
            ...item,
            idx: idx
          };
        }
      });

      let test = this.gridData.filter(x => !this.gridOriData.includes(x));

      console.log(test)
      // this.saveBtn(false);

    },
    // gridMouseover(e) {
    //      this.showDragClueContent = true;
    // },
    // gridMouseout(e){
    //     this.showDragClueContent = false;
    // },
    getGridReference(){
      return document.querySelector(".k-grid");
    },

    rowClass(props) {
        return props.dataItem.TOTALROW;
    }

  },
};

const defaultData = {};
</script>
<style>
.dropdown-menu {
    min-width: 1rem !important;
}

html .k-grid.dragging tbody tr:hover td {
    /* background-color: #f5a3a3 !important; */
    /* border-bottom-color: red;
    border-bottom-width: 3px; */
    background-color: rgb(240, 200, 200);
}

</style>