<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00693") }}</li> <!-- 5M 인원변동 조회 -->
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
                        :style="{ width: '250px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="workCenterValue"
                        @change="workCenterChange"
                        >
                      </DropDownList>
                    </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회 기간 -->
                    <div class="form-datepicker">
                      <DatePicker
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
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date()"
                        :searchOption="true"
                        :value="endDate"
                        @change="selectEndDate"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00694") }}</label> <!-- 특별공정  -->
                      <DropDownList
                        :style="{ width: '250px' }"
                        :data-items="specialProcessList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="specialProcessValue"
                        @change="specialProcessChange"
                        >
                      </DropDownList>
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
                        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00693") }}</CardTitle><!--5M 인원변동 조회-->
                    </v-col>
                    <v-col cols="8" align="right">
                      <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                      <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                      <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
                      <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
                      <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBtn">{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                      <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">undo</Button><!--UNDO-->
                      <Button :theme-color="'secondary'" :size="'small'" @click="updateBtn">{{ $t("MES_CommLang.MES_CommLang_00188") }}</Button><!--수정-->
                      
                    </v-col>

                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                  ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :isPaging="true"
                    :scrollable="false"
                    :checkHeaderArr="headerParam.checkBox"
                    :gridDropDownList="gridDropDownList"
                    :reSetPage="this.reSetPage"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @gridButtonClick="gridButtonClick"
                    @gridrowclick="onRowClick"
                    @selectionchange="onSelectionchange"
                    @pageChangeEvent="pageChangeEvent"
                />
                </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>

      <GetUserModal
        ref="UserModal"
        v-if="UserModalVisible"
        :visibleDialog="UserModalVisible"
        @visibleDialog="(val) => UserModalVisible = val"
        @selectUser="selectUser"
      />
      <AlertPop 
        ref="alertPop"
        :is="'alertPop'"
      />
    </div>
</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import DateUtility from '~/plugins/dateUtility';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '../../components/common/input/InputText.vue';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import GetUserModal from "@/components/common/modal/GetUserModal.vue";

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
    InputText,
    DropDownList,
    DatePicker,
    GetUserModal,
  },
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      specialProcessList: [],
      specialProcessValue: '',
      workCenterList: [{id:'', text:'-ALL-'}],
      workCenterValue: '',
      selectedField: "selected",
      headerParam:{
        gridid: 'dgvWorkerChange',
        gridHeader: [],
        checkBox:['SPECIALQUALIFICATIONFLAG', 'EDUCATIONFLAG', 'STANDARDDOCUMENTFLAG', 'DRAWINGFLAG', 'INSPECTIONSTANDARDFLAG', 'INSPECTIONDOCUMENTFLAG', 'MEASURINGINSTRUMENTFLAG'],
        xOverflowYn:true,
      },
      gridDropDownList: [
        {
          dataVal: 'CHANGETYPE',
          dataItem: [],
        },
        {
          dataVal: 'PROCESSNAME',
          dataItem: [],
        }
      ],
      
      startDate: new Date(),
      endDate: new Date(),
      UserModalVisible: false,
      selectedIndex: '',
      selectedColumn:'',
      reSetPage: false,

    }
  },
  created() {
  },
  async mounted() {
    await this.getComboData();
    await this.getTypeData();
    await this.getProcessData();
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
  },
  computed: {

  },
  watch: {},
  methods: {


    // 검색조건 Combo 데이터 가져오기
    async getComboData() {
      //공정
      this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetSpecialProcessList',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          }
      }).then(res => {
          res.map(x=> {
              this.specialProcessList.push({ id : x.PROCESSID, text : x.PROCESSNAME });
          });
          this.specialProcessList.push({id: '', text: this.$i18n.t("MES_CommLang.MES_CommLang_00722") }); // 일반
          this.specialProcessValue = this.specialProcessList[0];
      });

      //라인
      this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetAreaList',
          queryVersion: '00003',
          sendParam: {
              plantid: this.$auth.$state.user.plantId,
              AREATYPE: 'WorkCenter',
          },
      }).then(res => {
          res.map(x => {
              this.workCenterList.push({ id : x.CODE, text : x.NAME });
          });
          this.workCenterValue = this.workCenterList[0];
      });
    },

    // 검색조건 Combo 선택
    specialProcessChange(e) {
      this.specialProcessValue = e.value;
    },
    workCenterChange(e){
      this.workCenterValue = e.value;
    },
    
    // 기간 - 시작일 선택
    selectStartDate(event) {
      this.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
      this.endDate = event.value;
    },

    // 조회 버튼
    async searchBtn() {
      await this.getGridData();
    },

    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },

    // 그리드 발생사유 데이터 가져오기
    async getTypeData(){
      this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetEnumValue',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            enumid: 'WorkerChangeType',
          }
      }).then(res => {
          const combo = res.map(x=> {
              return{
                ENUMVALUE: x.ENUMVALUE,
                ENUMVALUENAME: x.ENUMVALUENAME,
              }
          });
          this.gridDropDownList[0].dataItem = combo;
      });
    },

    // 그리드 공정 가져오기
    async getProcessData(){
      this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetProcessList',
          queryVersion: '00002',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          }
      }).then(res => {
          const combo = res.map(x=> {
              return{
                ...x,
                ENUMVALUE: x.PROCESSID,
                ENUMVALUENAME: x.PROCESSNAME,
              }
          });
          this.gridDropDownList[1].dataItem = combo;
      });
    },

    // 그리드 데이터 가져오기
    async getGridData() {
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
          apiKey: 'mes/common/customquerypaging',
          queryId: 'GetWorkerChangeList',
          sendParam: {
            plantID: this.$auth.$state.user.plantId,
            PROCESSID:this.specialProcessValue.id,
            WORKCENTER:this.workCenterValue.id,
            STARTDATE:this.DateToYYYYMMDDString(this.startDate),
            ENDDATE:this.DateToYYYYMMDDString(this.endDate),
            skip: skip,
            take: take,
          },
      }).then(({list, paging, ...x}) => {
          const data = list.map((x, idx) => {
              return {
                  ...x,
                  rowStat: 'N',
                  selected: false,
                  idx: idx,
                  inEdit: false,
                  newRow: false,
                  resizable: true,
                  disabled: true,
                  //발생사유, 공정도 수정 가능하게 할때
                  CHANGETYPE: this.isNullOrEmpty(x.CHANGETYPE)?'':this.gridDropDownList[0].dataItem.filter(y => y.ENUMVALUE == x.CHANGETYPE)[0].ENUMVALUENAME,
                  CHANGEDATE: x.CHANGEDATE.substring(0,4)+'-'+x.CHANGEDATE.substring(4,6)+'-'+x.CHANGEDATE.substring(6,8),
                  //기존 데이터 날짜 수정불가
                  disabledDate:true,
              };
          });

      this.$nuxt.$emit('iccReset');
      this.gridPageData = paging;
      this.gridData = data;
      this.gridOriData = JSON.parse(JSON.stringify(this.gridData));
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

    // 그리드 사용자 검색 버튼
    gridButtonClick(e, name, item){
      this.UserModalVisible = true;
      this.selectedIndex = item.idx;
      this.selectedColumn = name;
    },

    // 사용자 검색 팝업 사용자 선택
    selectUser(data){
      this.gridData.map(x => {
        if(x.idx == this.selectedIndex){
          x[this.selectedColumn] = data.name;
          x[this.selectedColumn=='PRVWORKERNAME'?'PRVWORKER':'CHANGEWORKER'] = data.userId;
        }
      })
    },
    
    // 그리드 맨앞 CHECKBOX 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    // 그리드 ROW 클릭
    onRowClick(event) {
        const selectedIdx = event.dataItem.idx;
        this.gridData = this.gridData.map(item => {
            return {
            ...item,
            selected: item.idx === selectedIdx ? !item.selected : item.selected,
            };
        });
      },

      // 저장 버튼
    saveBtn(){
      const saveData = this.gridData.filter((x) => x.rowStat !== "N").map((x) => {
        return {
          ...x,
          _rowstatus: x.rowStat,
          PROCESSID : x.rowStat==="C"?x.PROCESSNAME:x.PROCESSID,
          CHANGETYPE : x.rowStat==="C"?x.CHANGETYPE:x.CHANGETYPEID,
          CHANGEDATE: this.DateToYYYYMMDDString(new Date(x.CHANGEDATE)),
        };
      });

      const saveValidate = this.mesValidation(this.headerParam.gridHeader, this.gridData);
      if(!saveValidate.isValidate){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), saveValidate.msg);//알림
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnWorkerChange',
            sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
              );
              this.getGridData();
            } else {
              this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
            }
          });
        });
      }

    },

    // 추가 버튼
    addBtn(){
      const data = {
        inEdit: true,
        newRow: true,
        selected: false,
        rowStat: "C",
        idx: this.gridData.length,
        PLANTID: this.$auth.$state.user.plantId,
        PROCESSID: '',
        CHANGEDATE: this.dateFormat(new Date()),
        CHANGEWORKER: '',
        CHANGEWORKERNAME: '',
        PRVWORKER: '',
        PRVWORKERNAME: '',
        CHANGETYPE: '',
        SPECIALQUALIFICATIONFLAG: "No", 
        EDUCATIONFLAG: "No", 
        STANDARDDOCUMENTFLAG: "No", 
        DRAWINGFLAG: "No", 
        INSPECTIONSTANDARDFLAG: "No", 
        INSPECTIONDOCUMENTFLAG: "No", 
        MEASURINGINSTRUMENTFLAG: "No",
        MONITORINGRESULT: '',
        DESCRIPTION: '',
        change: true,
      }
      this.gridData.splice(0, 0, data);
      this.$nuxt.$emit("iccReset");
    },

    // 삭제 버튼
    delBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data.map(x => {
        if(x.selected){
          if(x.rowStat !== "C"){
            return {
              ...x,
              rowStat: "D"
            }
          }
        }
        else {
          return x;
        }
      }).filter(x => x !== undefined);
    },

    // UNDO 버튼
    undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
    },

    //전체excel
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetWorkerChangeList',
        sendParam: {
          plantID: this.$auth.$state.user.plantId,
          PROCESSID:this.specialProcessValue.id,
          WORKCENTER:this.workCenterValue.id,
          STARTDATE:this.DateToYYYYMMDDString(this.startDate),
          ENDDATE:this.DateToYYYYMMDDString(this.endDate),
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
        queryId: 'GetWorkerChangeList',
        sendParam: {
          plantID: this.$auth.$state.user.plantId,
          PROCESSID:this.specialProcessValue.id,
          WORKCENTER:this.workCenterValue.id,
          STARTDATE:this.DateToYYYYMMDDString(this.startDate),
          ENDDATE:this.DateToYYYYMMDDString(this.endDate),
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },

    // 수정 버튼
    updateBtn(){
      this.gridData.filter(x=> !x.newRow).map(x => {
          x.disabled = false;
          x.inEdit = true;
          x.textOnly = true;
          //발생사유, 공정도 수정 가능하게 할때
          //x.CHANGETYPE = JSON.parse(JSON.stringify(this.gridDropDownList))[0].dataItem.filter(y => y.ENUMVALUENAME = x.CHANGETYPE)[0].ENUMVALUE;
          //x.PROCESSNAME = x.PROCESSID;
      });
      this.gridOriData.map(x => {
          x.disabled = false;
          x.inEdit = true;
          x.textOnly = true;
          //발생사유, 공정도 수정 가능하게 할때
          //x.CHANGETYPE = JSON.parse(JSON.stringify(this.gridDropDownList))[0].dataItem.filter(y => y.ENUMVALUENAME = x.CHANGETYPE)[0].ENUMVALUE;
          //x.PROCESSNAME = x.PROCESSID;
      });

    },

    // 그리드 INPUT 제외 변경
    rowDdChange(e, name, dataItem){
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(this.headerParam.checkBox.includes(name)) {
        e.value = e.value ? "Yes" : "No";
      }else if(name=='CHANGEDATE'){
        data[idx][name] = this.dateFormat(e.value);
      }else if(name=='PROCESSNAME'){
        data[idx].WORKCENTERNAME = this.gridDropDownList[1].dataItem.filter(x => x.PROCESSID == e.value)[0].WORKCENTERNAME;
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if(data[idx].rowStat === 'N') {
          data[idx].rowStat = 'U';
      }
      
      if(data[idx].rowStat === 'U' && !this.checkOriData(data, this.gridOriData, idx)) {
          data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },

    // 그리드 INPUT TEXT 변경
    griditemchange(e){
      const idx = this.gridData.findIndex(x => x.idx === e.dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.checkOriData(data, this.gridOriData, idx)) {
          data[idx].rowStat = "N";
      }
      this.gridData = data;
    },

    // rowStat 체크
    checkOriData(gridData, gridOriData, idx){
      const oriIdx = this.gridOriData.findIndex(x => x.idx == gridData[idx].idx);
      let data1 = JSON.parse(JSON.stringify(gridData));
      let data2 = JSON.parse(JSON.stringify(gridOriData));
      data1[idx].CHANGEDATE = this.dateFormat(new Date(gridData[idx].CHANGEDATE));
      data2[oriIdx].CHANGEDATE = this.dateFormat(new Date(gridOriData[oriIdx].CHANGEDATE));
      const keys = Object.keys(gridData[idx]);
      const chkArr = keys.filter((x) => {
        return this.parseNullOrUndefinedToBlank(data1[idx][x]) !== this.parseNullOrUndefinedToBlank(data2[oriIdx][x]) && x !== "selected" && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    // Date to yyyy-mm-dd
    dateFormat(date){
      return date.getFullYear() + '-' 
          + (Number(date.getMonth()+1)>9 ? date.getMonth()+1 : '0'+ date.getMonth()+1)+'-'
          + (Number(date.getDate())>9 ? date.getDate() : '0'+ date.getDate());
    }
  },






}

</script>