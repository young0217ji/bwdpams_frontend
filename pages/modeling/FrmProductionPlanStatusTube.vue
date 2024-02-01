<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00800") }}</li> <!-- TUBE 생산순서 관리 -->
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
                    <label>{{ $t("MES_CommLang.MES_CommLang_00706")}}</label>
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
                    <label :style="{marginLeft: '-40px'}" >&nbsp;개 열 고정</label>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        ref="oneView"
                        :dataNm="'oneView'"
                        :disabled="false"
                        :defaultchecked="false"
                        @checkbox-set="chkVal"
                      ></Checkbox>
                    </div>
                    <label :style="{marginLeft: '-45px'}">&nbsp;각각보기</label>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        ref="planQtySum"
                        :dataNm="'planQtySum'"
                        :disabled="false"
                        :defaultchecked="false"
                        @checkbox-set="chkVal"
                      ></Checkbox>
                    </div>
                    <label>&nbsp;계획 수량 합계 보기</label>
                  </div>
                </div>
                <div class="form-group-wrap" ref="equipmentChk">
                  <!-- 최초 check box 4개 true -->
                  <div v-for="(equipmentList, index) in equipmentList" class="form-group" :key="index" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        :ref="'equipment'+index"
                        :dataNm="String(index)"
                        :disabled="false"
                        :defaultchecked="equipmentChk[index]"
                        :checked="equipmentChk[index]"
                        :checkedControl="true"
                        @checkbox-set="chkEquipment"
                      ></Checkbox>
                    </div>
                    <label>&nbsp;{{ equipmentList.EQUIPMENTNAME }}</label>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" :size="'medium'" :icon="'save'" @click="undoBtn">{{ $t("MES_CommLang.MES_CommLang_00826") }}</Button> <!-- 미지정 -->
                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: layoutHeight('first') }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <div :ref="'gridArea'+index" v-for="(equipmentList, index) in equipmentList" :key="index"
                  :style="{ width: gridWidth(), height: 'calc(100% - 33px)', float:'left', display: index < firstCheckGrid ? 'block' : 'none' }">
                <CardTitle>{{ equipmentList.EQUIPMENTNAME }}</CardTitle>
                <KendoGrid
                  :ref="'rowGrid'+index"
                  :gridHeight="gridHeight"
                  :gridItems="gridData[index]"
                  :sortable="false"
                  :columns="headerParam.gridHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :isPaging="false"
                  :scrollable="true"
                  :dataItem="gridData[index]"
                  :dropPosition="dropPosition"
                  :gridIdx= "index"
                  :rowClass= "rowClass"
                  @gridddchang="rowDdChange"
                  @gridrowclick="onRowClick"
                  @griditemchange="griditemchange"
                  @dragHandler="dragHandler"
                  @pressHandler="pressHandler"
                  @releaseHandler="releaseHandler">
                </KendoGrid>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card v-if="planQtySum"  ref="gridCard2" :style="{ height: layoutHeight('last') }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <div ref="divWrapper2" :style="{ height: '100%', 'overflow-x':'scroll'}">
              <!-- planQtySumGrid -->
              <KendoGrid
                ref="planQtySumGrid" 
                :gridHeight="gridHeight"
                :gridItems="gridData2"
                :sortable="true"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :isPaging="false"
                :scrollable="true"
                @gridddchang="rowDdChange"
              />
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
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
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
      gridData: {},
      gridOriData: {},
      gridData2: [],
      gridOriData2: [],
      workCenterList: [],
      workCenterValue: '',
      equipmentList: [],
      equipmentValue: '',
      equipmentChk: {},
      quantityRemain: [], // 잔량
      workDate: new Date(),
      colunmFix: false,
      colunmFixInput: null,
      isReadOnly: false,
      resetCycle: false,
      resetCycleInput: "",
      oneView: false,
      // manyView: false,
      planQtySum: false,
      selectedField: "selected",
      selectedIdx: null,
      headerParam: {
        gridid: 'dgvProductionPlanStatusRod',
        gridHeader: [],
        noRowstat: true,
        noFirstCheck: true,
        xOverflowYn: true,
        // enumComboBox: [ {dataVal:'WORKCENTER', dataItem:[]},'CERTIFICATIONTYPE', 'CERTIFICATIONSUBTYPE',],
        // pkColumn: ['CERTIFICATIONID']
      },
      gridHeader: [
          { filed: "PLANTID", visible:false},
          { field: "AREAID", title:"W/C코드", visible:false, width:120, editable:false, locked:true },
          { field: "AREANAME", title:"W/C명", width:180, editable:false, locked:true },
          { field: "EQUIPMENTID", title:this.$i18n.t('MES_CommLang.MES_CommLang_00177'), visible:false, width:100, editable:false, locked:true }, // 설비코드
          { field: "EQUIPMENTNAME", title:this.$i18n.t('MES_CommLang.MES_CommLang_00171'), width:200, editable:false, locked:true } // 설비명
      ],
      gridOriHeader: [
          { filed: "PLANTID", visible:false},
          { field: "AREAID", title:"W/C코드", visible:false, width:120, editable:false, locked:true },
          { field: "AREANAME", title:"W/C명", width:180, editable:false, locked:true },
          { field: "EQUIPMENTID", title:this.$i18n.t('MES_CommLang.MES_CommLang_00177'), visible:false, width:100, editable:false, locked:true }, // 설비코드
          { field: "EQUIPMENTNAME", title:this.$i18n.t('MES_CommLang.MES_CommLang_00171'), width:200, editable:false, locked:true } // 설비명
      ],

      top: 0,
      left: 0,
      targetTopOffset: null,
      targetLeftOffset: null,
      showDropHints: false,
      dropPosition: '',
      activeItem: {},
      targetRowIdx: null,
      orgTargetRowIdx: null,
      targetGridIdx: null,
      orgTargetGridIdx: null,
      targetData: {},
      targetDate: '',
      targetDayOfWeek: '',
      visibleData: true,
      firstCheckGrid: 4, // 최초 보여줄 그리드개수
      firstCheck: true,
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

  computed: {},
  watch: {},
  methods: {

    // 검색조건 WorkCenter 콤보박스 데이터 가져오기
    async getWorkCenterListData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00003',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          AREATYPE: 'WorkCenter',
        }
      }).then(res => {
        res.filter(x => x.CODE === 'P030').map(x=>{
          this.workCenterList.push({ id : x.CODE, text : x.NAME })
        });
        this.workCenterValue = this.workCenterList[0];
        this.searchBtn();
      });
    },

    // 설비 ID List 조회
    async getWCEquipmentList() {
      let equipmentChk = {};
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetWCEquipmentList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTER: this.workCenterValue.id,
        },
      }).then(res => {
        this.equipmentList = res;
        this.setPlanQtySum();
        this.equipmentList.map((x, idx) => {
          if(this.firstCheck){
            if(idx < this.firstCheckGrid){
              equipmentChk[idx] = true;
            } else {
              equipmentChk[idx] = false;
            }
          } else {
            equipmentChk[idx] = this.equipmentChk[idx];
          }
          this.getGridData(idx);
        });
        this.$nextTick(() => {
          this.firstCheck = false;
          this.equipmentChk = equipmentChk;

          this.gridData2 = this.equipmentList;
          this.gridOriData2 = JSON.parse(JSON.stringify(this.gridData2));

          this.setGridVisible();
        });
      });
    },

    // 조회 버튼
    async searchBtn() {
      const bfrDate = new Date();
      const aftDate = new Date();
      bfrDate.setDate(bfrDate.getDate()-4);
      aftDate.setDate(aftDate.getDate()+4);

      if(this.DateToYYYYMMDDString(this.workDate) <= this.DateToYYYYMMDDString(bfrDate) || this.DateToYYYYMMDDString(this.workDate) >= this.DateToYYYYMMDDString(aftDate)){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00280')); /* 알림, 계획일자를 확인하십시오.\n(3일이전, 이후 지정불가) */
        return;
      } else if(this.DateToYYYYMMDDString(this.workDate) != this.DateToYYYYMMDDString(new Date())){
        this.$refs['confirmPop'].title = "Warning";
        this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00281'); /* 확정 기준 일자(계획)와 실제(당일) 일자가 다릅니다.\n계속 진행 하시겠습니까? */
        this.$refs['confirmPop'].callBack = this.getWCEquipmentList;
        this.$refs['confirmPop'].modalWidth = "300px";
        this.$refs['confirmPop'].visibleDialog = true;
      } else {
        this.getWCEquipmentList();
      }
    },

    // 그리드 데이터 가져오기
    async getGridData(gridIndex) {
      let displayWorkDate = "";
      let cnt = 0;
      let subTotal = {
        QUANTITY: 0, // 계획
        QUANTITYPRODUCT: 0, // 양품
        QUANTITYNOTOK: 0, // 불량
        QUANTITYREMAIN: 0, // 잔량
        NEEDTIME: 0 // 소요시간
      
      };
      let total = {
        QUANTITY: 0, // 계획
        QUANTITYPRODUCT: 0, // 양품
        QUANTITYNOTOK: 0, // 불량
        QUANTITYREMAIN: 0, // 잔량
        NEEDTIME: 0 // 소요시간
      
      };

      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProductionPlanStatusRod',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTERID: this.workCenterValue.id,
          EQUIPMENTID: this.equipmentList[gridIndex].EQUIPMENTID,
          WORKDATE: this.DateToYYYYMMDDString(this.workDate),
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
        data.map((x, idx) => {
          if(displayWorkDate !== x.DISPLAYWORKDATE && idx != 0){
            sumData.push({
              rowStat: 'N',
              selected: false,
              idx: cnt,
              inEdit: false,
              TOTALROW:'ROW_SUBTOTAL',
              QUANTITY: subTotal.QUANTITY, // 계획
              QUANTITYPRODUCT: subTotal.QUANTITYPRODUCT, // 양품
              QUANTITYNOTOK: subTotal.QUANTITYNOTOK, // 불량
              QUANTITYREMAIN: subTotal.QUANTITYREMAIN, // 잔량
              NEEDTIME: subTotal.NEEDTIME.toFixed(2) // 소요시간
            });
            subTotal.QUANTITY = 0;
            subTotal.QUANTITYPRODUCT = 0;
            subTotal.QUANTITYNOTOK = 0;
            subTotal.QUANTITYREMAIN = 0;
            subTotal.NEEDTIME = 0;
            cnt++;
          }
          sumData.push({
            ...x,
            rowStat: 'N',
            selected: false,
            idx: cnt,
            inEdit: true,
            TOTALROW: ''
          });
          displayWorkDate = x.DISPLAYWORKDATE;
          subTotal.QUANTITY = subTotal.QUANTITY + Number(x.QUANTITY === undefined ? 0 : x.QUANTITY);
          subTotal.QUANTITYPRODUCT = subTotal.QUANTITYPRODUCT + Number(x.QUANTITYPRODUCT === undefined ? 0 : x.QUANTITYPRODUCT);
          subTotal.QUANTITYNOTOK = subTotal.QUANTITYNOTOK + Number(x.QUANTITYNOTOK === undefined ? 0 : x.QUANTITYNOTOK);
          subTotal.QUANTITYREMAIN = subTotal.QUANTITYREMAIN + Number(x.QUANTITYREMAIN === undefined ? 0 : x.QUANTITYREMAIN);
          subTotal.NEEDTIME = subTotal.NEEDTIME + Number(x.NEEDTIME === undefined ? 0 : x.NEEDTIME);
          total.QUANTITY = total.QUANTITY + Number(x.QUANTITY === undefined ? 0 : x.QUANTITY);
          total.QUANTITYPRODUCT = total.QUANTITYPRODUCT + Number(x.QUANTITYPRODUCT === undefined ? 0 : x.QUANTITYPRODUCT);
          total.QUANTITYNOTOK = total.QUANTITYNOTOK + Number(x.QUANTITYNOTOK === undefined ? 0 : x.QUANTITYNOTOK);
          total.QUANTITYREMAIN = total.QUANTITYREMAIN + Number(x.QUANTITYREMAIN === undefined ? 0 : x.QUANTITYREMAIN);
          total.NEEDTIME = total.NEEDTIME + Number(x.NEEDTIME === undefined ? 0 : x.NEEDTIME);
          if(data.length - 1 === idx){
            sumData.push({
              rowStat: 'N',
              selected: false,
              idx: ++cnt,
              inEdit: false,
              TOTALROW:'ROW_SUBTOTAL',
              QUANTITY: subTotal.QUANTITY, // 계획
              QUANTITYPRODUCT: subTotal.QUANTITYPRODUCT, // 양품
              QUANTITYNOTOK: subTotal.QUANTITYNOTOK, // 불량
              QUANTITYREMAIN: subTotal.QUANTITYREMAIN, // 잔량
              NEEDTIME: subTotal.NEEDTIME.toFixed(2) // 소요시간
            });
            sumData.push({
              rowStat: 'N',
              selected: false,
              idx: ++cnt,
              inEdit: false,
              TOTALROW: 'ROW_TOTAL',
              QUANTITY: total.QUANTITY, // 계획
              QUANTITYPRODUCT: total.QUANTITYPRODUCT, // 양품
              QUANTITYNOTOK: total.QUANTITYNOTOK, // 불량
              QUANTITYREMAIN: total.QUANTITYREMAIN, // 잔량
              NEEDTIME: total.NEEDTIME.toFixed(2) // 소요시간
            });
          }
          cnt++;
        });
        cnt = 0;
        const unSpecifiedData = []; // 미지정만 있을 시 윗쪽에 row 추가
        sumData.map((x, idx) => {
          if(x.WORKDATE === "29990101" && idx === 0){
            unSpecifiedData.push({
              rowStat: 'N',
              selected: false,
              idx: cnt,
              inEdit: false,
              TOTALROW:'ROW_SUBSUBTOTAL',
            });
            cnt++;
          }
          unSpecifiedData.push({
            ...x,
            rowStat: 'N',
            idx: cnt
          });
          cnt++;
        });

        if(unSpecifiedData.length === 0){ // 빈 그리드 row 추가
          unSpecifiedData.push({
            rowStat: 'N',
            selected: false,
            idx: cnt,
            inEdit: false,
            TOTALROW:'ROW_SUBSUBTOTAL',
          });
        }

        unSpecifiedData.forEach(item => { // 하단그리드 합계
          const {ASSEMBLYDATE, WORKDATE, QUANTITYREMAIN} = item;
          if(this.gridData2[gridIndex]["ASSEMBLY"+ASSEMBLYDATE]){
            this.gridData2[gridIndex]["ASSEMBLY"+ASSEMBLYDATE] += parseInt(QUANTITYREMAIN);
          } else{
            this.gridData2[gridIndex]["ASSEMBLY"+ASSEMBLYDATE] = parseInt(QUANTITYREMAIN);
          }
          if(this.gridData2[gridIndex]["SUPPORT"+WORKDATE]){
            this.gridData2[gridIndex]["SUPPORT"+WORKDATE] += parseInt(QUANTITYREMAIN);
          } else{
            this.gridData2[gridIndex]["SUPPORT"+WORKDATE] = parseInt(QUANTITYREMAIN);
          }
        })

        this.$nuxt.$emit('iccReset');
        this.$set(this.gridData, gridIndex, unSpecifiedData);
        this.$set(this.gridOriData, gridIndex, JSON.parse(JSON.stringify(this.gridData[gridIndex])));
      });
    },

    // 미지정 버튼 클릭시
    undoBtn() {
      if(this.selectedIdx === null || this.gridData[this.targetGridIdx][this.selectedIdx].TOTALROW != ""){
        return;
      }
      
      if(this.DateToYYYYMMDDString(this.workDate) != this.DateToYYYYMMDDString(new Date())){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00282')); /* 알림, 확정 기준 일자(계획)와 실제(당일) 일자가 다릅니다.\n확인 후 다시 처리하시기 바랍니다. */
        return;
      }
      
      let cnt = 0;

      const saveData = this.gridData[this.targetGridIdx].filter(x => Utility.setFormatDate(x.PLANSTARTDATE, "YYYYMMDD") === "29990101").map((x, idx) => {
        cnt++;
        return {
          ...x,
          rowStat: "U",
          _ROWSTATUS: "U",
          PLANTID: x.PLANTID,
          WORKCENTER: x.WORKCENTER,
          EQUIPMENTID: x.EQUIPMENTID,
          WORKDATE: this.DateToYYYYMMDDString(this.workDate),
          DATAKEY: x.DATAKEY,
          PLANSTARTPRIOR: cnt,
          PLANSTARTDATE: "29990101"
        };
      });

      const selectData = this.gridData[this.targetGridIdx].filter(x => x.selected === true).map((x, idx) => {
        return {
          ...x,
          rowStat: "U",
          _ROWSTATUS: "U",
          PLANTID: x.PLANTID,
          WORKCENTER: x.WORKCENTER,
          EQUIPMENTID: x.EQUIPMENTID,
          WORKDATE: this.DateToYYYYMMDDString(this.workDate),
          DATAKEY: x.DATAKEY,
          PLANSTARTPRIOR: cnt+1,
          PLANSTARTDATE: "29990101"
        };
      });

      saveData.push(selectData[0]);

      if(saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnProcWorkOrderReplan',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getWCEquipmentList();
            } 
          });
        });
      } else {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다.*/
        return;
      }
    },

    // 저장
    saveBtn(edit, gridIndex) {
      if(this.DateToYYYYMMDDString(this.workDate) != this.DateToYYYYMMDDString(new Date())){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00282')); /* 알림, 확정 기준 일자(계획)와 실제(당일) 일자가 다릅니다.\n확인 후 다시 처리하시기 바랍니다. */
        return;
      }

      let saveData;
      
      if(edit){
        saveData = this.gridData[gridIndex].filter(x => x.rowStat === "U" && x.TOTALROW === "").map((x, idx) => {
          return {
            ...x,
            rowStat: "U",
            _ROWSTATUS: "U"
          };
        });

      } else {
        saveData = this.gridData[gridIndex].filter(x => x.DISPLAYWORKDATE == this.targetDayOfWeek).map((x, idx) => {
          return {
            rowStat: "U",
            _ROWSTATUS: "U",
            PLANTID: x.PLANTID,
            WORKCENTER: x.WORKCENTER,
            EQUIPMENTID: x.EQUIPMENTID,
            WORKDATE: this.DateToYYYYMMDDString(this.workDate),
            DATAKEY: x.DATAKEY,
            PLANSTARTPRIOR: idx+1,
            PLANSTARTDATE: this.DateToYYYYMMDDString(this.targetDate)
          };
        });
      }

      if(saveData.length > 0) {
        if(edit){
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnProcWorkOrderUpdate',
            sendParam: saveData,
          }).then(result => {
            this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === '0') {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getWCEquipmentList();
              } 
            });
          });
        } else {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnProcWorkOrderReplan',
            sendParam: saveData,
          }).then(result => {
            this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === '0') {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getWCEquipmentList();
              } 
            });
          });
        }
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
      // nm : colunmFix / resetCycle
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
      if(nm === "oneView"){
        if(this[nm] === true){
          for(let i = 0; i < this.$refs.equipmentChk.children.length; i++){
            if(i === 0){
              this.equipmentChk[i] = true;
              this.$refs.divWrapper.children[i].style.display = "block";
            } else {
              this.equipmentChk[i] = false;
              this.$refs.divWrapper.children[i].style.display = "none";
            }
          }
        }
        this.setGridVisible();
      }
      if(nm === "planQtySum"){
        // this.setPlanQtySum();
      }
      if(nm === "resetCycle"){
        alert("새로고침:::" + val);
      }
    },

    chkEquipment(nm, val) {
      if(this.oneView){
        this.equipmentList.map((x, idx) => {
          this.equipmentChk[idx] = false;
        });
      }
      this.equipmentChk[nm] = val;
      this.setGridVisible();
    },

    setGridVisible() {
      let trueCnt = 0;
      this.equipmentList.map((x, idx) => {
        if(this.equipmentChk[idx]){
          this.$refs.divWrapper.children[idx].style.display = "block";
          trueCnt++;
        } else{
          this.$refs.divWrapper.children[idx].style.display = "none";
        }
      });
      this.equipmentList.map((x, idx) => {
        if(this.equipmentChk[idx]){
          this.$refs.divWrapper.children[idx].style.width = 100/trueCnt+'%';
        }
      });
    },

    // 하단 그리드 컬럼세팅
    setPlanQtySum() {
      this.gridHeader = [];
      this.gridOriHeader.map((x) => {
        this.gridHeader.push(x);
      });

      const start = new Date(this.workDate);
      const end = new Date();
      end.setDate(end.getDate()+14);

      let datePivotString = [];
      while(start<=end){

        datePivotString.push("[DATE"+this.DateToYYYYMMDDString(start)+"]");

        const item = {
          field:"DATE"+this.DateToYYYYMMDDString(start),
          title:this.DateToYYYYMMDDString(start).substring(4,6)+'/'+this.DateToYYYYMMDDString(start).substring(6,8),
          children:[
            // { field: "SUPPORT"+this.DateToYYYYMMDDString(start), title:"지원", width:70, editable:false, cell:"dragDate" },
            // { field: "ASSEMBLY"+this.DateToYYYYMMDDString(start), title:"조립", width:70, editable:false, cell:"dragDate" },
            { field: "SUPPORT"+this.DateToYYYYMMDDString(start), title:"지원", width:70, editable:false },
            { field: "ASSEMBLY"+this.DateToYYYYMMDDString(start), title:"조립", width:70, editable:false },
          ]
        };
        this.gridHeader.push(item);
        
        start.setDate(start.getDate()+1);
      }
    },

    // 그리드 INPUT 제외 수정
    rowDdChange(e, name, dataItem){
      console.log(e)
      return;
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name == 'CHANGEOPERDATE') {
        data[idx][name] = e.value
        
        const expectDate = new Date(e.value);

        expectDate.setFullYear(expectDate.getFullYear() + 1);
        
        data[idx].DISQUALIFICATIONEXPECTDATE = Utility.setFormatDate(expectDate, "YYYYMMDD")
        // console.log(expectDate);
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
      this.targetGridIdx = e.event.target.closest('div').parentElement.parentElement.parentElement.parentElement.getAttribute('itemid');
      const data = JSON.parse(JSON.stringify(this.gridData[this.targetGridIdx]));
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
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(gridHeader, data, this.gridOriData[this.targetGridIdx], idx)) {
        data[idx].rowStat = "N";
      }

      this.gridData[this.targetGridIdx] = data;
      this.saveBtn(true, this.targetGridIdx);
    },
    
    // 그리드 ROW 선택
    onRowClick(event){
      this.selectedIdx = event.dataItem.idx;
      this.targetGridIdx = event.event.target.closest('div').parentElement.parentElement.parentElement.parentElement.getAttribute('itemid');
      const dataKey = event.dataItem.DATAKEY;
      if(dataKey != undefined && dataKey != ""){
        this.gridData[this.targetGridIdx] = this.gridData[this.targetGridIdx]
        .map(item => {
            return {
            ...item,
            selected: item.idx === this.selectedIdx ? true : false,
            };
        });
      }
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      return;
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    dragHandler(dataItem, event, idx) {
      // if(this.orgTargetRowIdx === undefined || this.orgTargetRowIdx == "") { // 최초 rowIdx를 설정
      //   this.orgTargetRowIdx = event.originalEvent.target.parentElement.rowIndex; 
      // }
      if(dataItem.TOTALROW != ""){
        return;
      }

      this.top = event.pageY + 10;
      this.left = event.pageX;
      this.targetLeftOffset = this.getGridReference().offsetLeft + this.getGridReference().offsetLeft/2;
      this.targetTopOffset = this.getTargetTopOffSet(event);
      // this.dropPosition = this.getDropPosition(event);
      this.getDropPosition(event);
      this.showDropHints = true;
    },
    
    getDropPosition: function(event){
      console.log("Drop")
      const targetRowIdx = event.originalEvent.target.parentElement.rowIndex; // 셀영역 rowIdx
      const iconRowIdx = event.originalEvent.target.parentElement.parentElement.rowIndex; // 아이콘영역의 부모 rowIdx
      const targetGridIdx = event.originalEvent.target.closest('div').parentElement.parentElement.parentElement.parentElement.getAttribute('itemid'); // 그리드 idx
      
      if(iconRowIdx != undefined){
        this.targetRowIdx = iconRowIdx;
      } else {
        this.targetRowIdx = targetRowIdx;
      }

      this.targetGridIdx = targetGridIdx;
    },
    
    pressHandler(dataItem, event) {
      console.log("Press")
      this.orgTargetRowIdx = event.originalEvent.target.parentElement.rowIndex;
      this.orgTargetGridIdx = event.originalEvent.target.closest('div').parentElement.parentElement.parentElement.parentElement.getAttribute('itemid'); // 그리드 idx
      this.selectedIdx = dataItem.idx;
      const dataKey = dataItem.DATAKEY;
      if(dataKey != undefined && dataKey != ""){
        this.gridData[this.orgTargetGridIdx] = this.gridData[this.orgTargetGridIdx]
        .map(item => {
            return {
            ...item,
            selected: item.idx === this.selectedIdx ? true : false,
            };
        });
      }
      this.activeItem = dataItem;
    },
    
    releaseHandler(dataItem, event) {
      console.log("release")
      this.showDropHints = false;

      if(this.DateToYYYYMMDDString(this.workDate) != this.DateToYYYYMMDDString(new Date())){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00282')); /* 알림, 확정 기준 일자(계획)와 실제(당일) 일자가 다릅니다.\n확인 후 다시 처리하시기 바랍니다. */
        return;
      }

      if(dataItem.TOTALROW === "" && this.gridData[this.targetGridIdx][this.targetRowIdx].TOTALROW === "ROW_SUBSUBTOTAL"){
        this.targetDate = DateUtility.format(this.workDate, "YYYY-MM-DD");
        this.equipmentId = this.equipmentList[this.targetGridIdx].EQUIPMENTID;
      } else {
        if(dataItem.TOTALROW != "" || this.gridData[this.targetGridIdx][this.targetRowIdx].TOTALROW != ""){
          return;
        }
        if(dataItem.DATAKEY === this.gridData[this.targetGridIdx][this.targetRowIdx].DATAKEY){
          return;
        }
        this.targetDate = this.gridData[this.targetGridIdx][this.targetRowIdx].PLANSTARTDATE;
        this.equipmentId = this.gridData[this.targetGridIdx][this.targetRowIdx].EQUIPMENTID;
      }

      this.targetDayOfWeek = DateUtility.getWeek(null, this.targetDate);
      this.activeItem.PLANSTARTDATE = this.targetDate;
      this.activeItem.DISPLAYWORKDATE = this.targetDayOfWeek;
      this.activeItem.EQUIPMENTID = this.equipmentId;

      if(this.targetGridIdx != this.orgTargetGridIdx){
        this.gridData[this.targetGridIdx] = this.reorderData(event, this.gridData[this.targetGridIdx], this.activeItem, "move");
        this.gridData[this.orgTargetGridIdx] = this.reorderData(event, this.gridData[this.orgTargetGridIdx], this.activeItem, "org");
      } else {
        this.gridData[this.targetGridIdx] = this.reorderData(event, this.gridData[this.targetGridIdx], this.activeItem, "none");
      }

      this.activeItem = {};

      this.saveBtn(false, this.targetGridIdx);
      // this.saveBtn();

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
    },
    gridWidth() {
      const width = 100/this.firstCheckGrid + "%";
      return width;
    },
    layoutHeight(layout) {
      let height;
      if(!this.planQtySum){
        height = 100+"%";
      } else {
        if(layout === "first"){
          height = 70+"%"
        } else {
          height = 30+"%"
        }
      }
      return height;
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