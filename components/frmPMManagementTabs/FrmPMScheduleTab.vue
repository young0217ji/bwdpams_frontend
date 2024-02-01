<template>
  <div :style="{ height: '100%' }">
    <v-row :style="{ height: '100%' }">
      <v-col ref="gridArea" :cols="12" align="right">
        <!-- <v-col :cols="2"> -->
        <label :style="{ backgroundColor: 'green', color: 'green', float: 'left' }">&nbsp;{{ $t('MES_CommLang.MES_CommLang_00446') }}</label> <!-- 색상 -->
        <label :style="{ fontWeight: 'bold', float: 'left', marginRight: '15px' }">&nbsp;: {{ $t('MES_CommLang.MES_CommLang_00495') }}</label> <!-- 완료 -->
        <!-- </v-col>
          <v-col :cols="2"> -->
        <label :style="{ backgroundColor: 'blue', color: 'blue', float: 'left' }">&nbsp;{{ $t('MES_CommLang.MES_CommLang_00446') }}</label> <!-- 색상 -->
        <label :style="{ fontWeight: 'bold', float: 'left', marginRight: '15px' }">&nbsp;: {{ $t('MES_CommLang.MES_CommLang_00290') }}</label> <!-- 진행중 -->
        <!-- </v-col>
          <v-col :cols="2"> -->
        <label :style="{ backgroundColor: 'red', color: 'red', float: 'left' }">&nbsp;{{ $t('MES_CommLang.MES_CommLang_00446') }}</label> <!-- 색상 -->
        <label :style="{ fontWeight: 'bold', float: 'left', marginRight: '15px' }">&nbsp;: {{ $t('MES_CommLang.MES_CommLang_00423') }}</label> <!-- 미진행 -->
        <!-- </v-col> -->
        <!-- <v-col :cols="2"> -->
        <label :style="{ backgroundColor: 'yellow', color: 'yellow', float: 'left' }">&nbsp;{{ $t('MES_CommLang.MES_CommLang_00446') }}</label> <!-- 색상 -->
        <label :style="{ fontWeight: 'bold', float: 'left' }">&nbsp;: {{ $t('MES_CommLang.MES_CommLang_00493') }}</label> <!-- 예정 -->
        <!-- </v-col> -->
        <Button :theme-color="'primary'" :size="'small'" @click="addPMCycle">{{ $t('MES_CommLang.MES_CommLang_00039') }}</Button> <!-- 예방보전 주기 추가 -->
      </v-col>
      <v-col ref="gridArea" :cols="4" style="display: none;">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody>
            <div class="d-flex align-center justify-space-between pa-2">
              <CardTitle>{{ $t('MES_CommLang.MES_CommLang_00307') }}</CardTitle> <!-- 캘린더 리스트 -->
              <div>
                <!-- <Button :theme-color="'primary'" @click="rowGridSave">{{$t('CommLang.btn.saveBtn')}}</Button> -->
              </div>
            </div>
            <div ref="divWrapper">
              <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridItems" :sortable="true" :columns="columns"
                :resizable="false" :edit-field="'inEdit'" :selected-field="selectedField"
                :gridDropDownList="gridDropDownList" @griditemchange="itemChange" @gridddchang="ddChange"
                @gridrowclick="onRowClick">
              </KendoGrid>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="12" :style="{ height: '100%' }">
        <div ref="calWrapper" style="height:100%;">
          <calendar ref="calendar" :navigation="false" :cell="customCell" :style="{ width: '100%', height: '100%' }"
            :value="defaultValue">
            <template v-slot:myCellTemplate="{ props }">
              <CustomCalendarCell :is-weekend="props.isWeekend" :is-focused="props.isFocused"
                :formatted-value="props.formattedValue" :is-today="props.isToday" :title="props.title"
                :value="props.value" :gridData="gridData" :planData="planData" :calCellHeight="calCellHeight"
                :calCellWidth="calCellWidth" @click="changeHandler" @updateClick="updateClick"
                @onRightClick="onRightClick" @onLeftClick="onLeftClick" />
            </template>
          </calendar>
        </div>
      </v-col>
    </v-row>
    <PlanPop ref="planPop" :is="'PlanPop'" :comId="comId" @search="search" />
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" :callBack="() => { }" />
    <ContextMenu v-if="isContextMenuVisible" :posX="contextMenuPosX" :posY="contextMenuPosY"
      :planData="contextMenuPlanData" :menuFlag="menuFlag" @addClickContextMenu="addClickContextMenu"
      @editClickContextMenu="editClickContextMenu" @removeClickContextMenu="removeClickContextMenu"
      @startPMClickContextMenu="startPMClickContextMenu" />
    <PMDetail ref="PMDetail" v-if="setPMDetailModalVisible" :visibleDialog="setPMDetailModalVisible"
      :rightClickPlanData="rightClickPlanData" :btnFlag="btnFlag" :title="'title'" :message="'message'"
      :callBack="() => { }" @visibleDialog="(val) => setPMDetailModalVisible = val"
      @pmDetailSaveData="pmDetailSaveData" />
    <PMDetailAdd ref="PMDetailAdd" v-if="setPMDetailAddModalVisible" :visibleDialog="setPMDetailAddModalVisible"
      :rightClickPlanData="rightClickPlanData" :btnFlag="btnFlag" :title="'title'" :message="'message'"
      :callBack="() => { }" @visibleDialog="(val) => setPMDetailAddModalVisible = val"
      @pmDetailSaveData="pmDetailSaveData" />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle, CardActions, TabStrip } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { DateInput, Calendar } from '@progress/kendo-vue-dateinputs';
import { Label } from "@progress/kendo-vue-labels";
import KendoGrid from "@/components/common/KendoGrid.vue"
import CustomCalendarCell from '@/components/frmPMManagementTabs/PMScheduleCustom.vue';
import PlanPop from "@/components/common/modal/PlanPop";
import ContextMenu from '@/components/frmPMManagementTabs/ContextMenu.vue';
import PMDetail from "@/components/frmPMManagementTabs/PMDetail";
import PMDetailAdd from "@/components/frmPMManagementTabs/PMDetailAdd";

let myTitle;
let myMenuId;


export default {
  mixins: [mixinGlobal],
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
    closable: true
  },
  components: {
    Card, CardBody, CardTitle, CardActions, TabStrip,
    Button,
    Utility,
    DateInput,
    Label,
    KendoGrid,
    Calendar,
    CustomCalendarCell,
    PlanPop,
    ContextMenu,
    PMDetail,
    PMDetailAdd
  },
  props: {
    viewParam: {
      lotid: "",
      productid: "",
      fromdete: "",
      todate: "",
      setYYYYMM: "",
      workCenter: "",
      equipmentName: "",
      inputEquipmentId: "",
    },
    callBack: {
            type: Function,
            default: () => true
        },
  },
  data() {
    return {
      comId: "FEMS",
      fromDt: new Date(),
      steps: { year: 1, month: 1 },
      columns: [],
      selectedField: 'selected',
      selectedID: 0,
      selectedData: [],
      gridHeight: '0px',
      gridData: [],
      planData: [],
      gridDropDownList: [
        {
          dataVal: 'hldyFg',
          dataItem: ['', '']
        }
      ],
      customCell: 'myCellTemplate',
      calendarValue: null,
      calCellWidth: '100px',
      calCellHeight: '100px',
      defaultValue: null,
      testValue: null,
      addSaveData: [],
      searchDate: "",
      isContextMenuVisible: false,
      contextMenuPosX: 0,
      contextMenuPosY: 0,
      contextMenuPlanData: [],
      setPMDetailModalVisible: false,
      setPMDetailAddModalVisible: false,
      rightClickPlanData: [],
      equipmentid: '',
      equipmentname: '',
      btnFlag: "",
      menuFlag: "",
      inputEqId: "",
      removeConfirm: false,
      removeData: [],
      removeBtnflag: ''
    };
  },
  computed: {
    userInfo: (state) => state.$store.$auth.$state.user,
    gridItems() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.idx === this.selectedID,
        inEdit: item.idx === this.selectedID,
        hldyFg: item.hldyFg == "1" ? this.$i18n.t('MES_CommLang.MES_CommLang_00343') : this.$i18n.t('MES_CommLang.MES_CommLang_00342')
      }));                                      /* 평일 */                                    /* 휴일 */
    }
  },
  watch: {
  },
  beforeCreate() {
  },
  async mounted() {
    this.gridDropDownList[0].dataItem[0] = this.$i18n.t('MES_CommLang.MES_CommLang_00342'); /* 평일 */
    this.gridDropDownList[0].dataItem[1] = this.$i18n.t('MES_CommLang.MES_CommLang_00343'); /* 휴일 */
    // var today = new Date();
    // this.defaultValue = new Date(today.setMonth(today.getMonth() -1));
    // this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
    this.calCellWidth = (this.$refs.calWrapper.offsetWidth / 8) + 'px';
    this.calCellHeight = (this.$refs.calWrapper.offsetHeight / 7) + 'px';
    // console.log("mounted 조회조건YYYYMM:::::::::::", this.viewParam.setYYYYMM);
    // console.log("mounted 조회조건YYYYMMDD:::::::::::", this.viewParam.setYYYYMMDD);
    this.testValue = this.viewParam.setYYYYMM;
    //this.calCelWidth = (this.$refs,calendar)
    //   this.gridInit();
    this.search(this.viewParam.setYYYYMMDD);
  },
  methods: {
    onLeftClick(e, customPlanData, customPMState) {
      this.isContextMenuVisible = false;
    },
    onRightClick(e, customPlanData, customPMState) {
      this.showContextMenu(e, customPlanData, customPMState);
    },
    showContextMenu(e, customPlanData, customPMState) {
      this.menuFlag = customPMState;
      this.contextMenuPosX = e.clientX;
      this.contextMenuPosY = e.clientY;
      this.contextMenuPlanData = customPlanData;
      this.isContextMenuVisible = true;
    },

    /* 
      ContextMenu 기능
      planData - PMScheduleCustom.vue 에서 우클릭대상의 데이터, 
      btnFlag - ContextMenu.vue 에서 버튼 기능별 플래그
              - 추가: C, 수정: U, 삭제: D, PM실행: startPM
    */
    addClickContextMenu(clickData, btnFlag) {
      // 우클릭 메뉴 - 추가
      this.rightClickPlanData = clickData[0];
      this.btnFlag = btnFlag;
      this.isContextMenuVisible = false;
      // console.log("rightClickPlanData::::::::", this.rightClickPlanData);
      this.setPMDetailAddModalVisible = true;
      // this.savePlanData(clickData, btnFlag);
    },
    editClickContextMenu(clickData, btnFlag) {
      // 우클릭 메뉴 - 수정
      this.rightClickPlanData = clickData[0];
      this.btnFlag = btnFlag;
      this.isContextMenuVisible = false;
      this.setPMDetailModalVisible = true;
      // this.savePlanData(clickData, btnFlag);
    },
    removeClickContextMenu(clickData, btnFlag) {
      // 우클릭 메뉴 - 삭제

      this.isContextMenuVisible = false;
      this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = this.$i18n.t('MES_CommLang.MES_CommLang_00456'); /* 알림  */
      this.$refs['confirmPop'].message = clickData[0][0].planTitle + ' - ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00243'); /* 해당 예방보전일정을 삭제하시겠습니까? */
      this.$refs['confirmPop'].callBack = remove;
      this.$refs['confirmPop'].modalWidth = "300px";
      this.$refs['confirmPop'].visibleDialog = true;
       
      var t = this;
      function remove() {
        t.savePlanData(clickData, btnFlag);
      }
      
    },
    startPMClickContextMenu(clickData, btnFlag) {
      // 우클릭 메뉴 - PM실행 얘는 탭이동해야함
      this.isContextMenuVisible = false;
      this.$emit('openPMWorkTab', clickData, btnFlag);
      // this.savePlanData(clickData, btnFlag);
    },

    addPMCycle(e) {
      // console.log("======= PM주기 추가 버튼 =========", e);
      this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = this.$i18n.t('MES_CommLang.MES_CommLang_00618'); /* 이달의 계획 설정  */
      this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00239'); /* 현재시간 이후 모든 계획을 초기화 후 재설정합니다. 진행하시겠습니까? */
      this.$refs['confirmPop'].callBack = this.getPMCycleListSearch;
      this.$refs['confirmPop'].modalWidth = "300px";
      this.$refs['confirmPop'].visibleDialog = true;
    },
    itemChange: function (e) {
      // console.log("::::::::::::::: itemChange: function (e) :::::::::::");
      const data = this.gridData.slice();
      const index = data.findIndex(d => d.idx === e.dataItem.idx);
      data[index] = { ...data[index], [e.field]: e.value };
      if (data[index].rowStat == '') {
        data[index].rowStat = "U";
      }
      this.gridData = data;
    },
    ddChange: function (e, name, dataItem) {
      // console.log("::::::::::::::: ddChange: function (e, name, dataItem) :::::::::::")
      const data = this.gridData.slice();
      const index = data.findIndex(d => d.idx === dataItem.idx);
      if (name == "hldyFg") {
        e.value = e.value == this.$i18n.t('MES_CommLang.MES_CommLang_00343') ? "1" : "0"
      }
      data[index] = { ...data[index], [name]: e.value };
      if (data[index].rowStat == '') {
        data[index].rowStat = "U";
      }
      this.gridData = data;
    },
    changeHandler: function (value) {
      // console.log(":::::::::::: changeHandler: function (value) :::::::::::", value);


      // this.$refs['planPop'].planLabel = this.$i18n.t('CalendarMngPage.label8')
      // this.$refs['planPop'].popUpAction = 'insert';
      // this.$refs['planPop'].strtDt = value;
      // this.$refs['planPop'].endDt = value;
      // this.$refs['planPop'].visibleDialog = true;
    },
    updateClick: function (e) {
      // console.log(":::::::::::: updateClick: function(val)  :::::::::::", e);


      // this.$refs['planPop'].planLabel = this.$i18n.t('CalendarMngPage.label9')
      // this.$refs['planPop'].popUpAction = 'update';
      // this.$refs['planPop'].planSeq = val;
      // this.$refs['planPop'].visibleDialog = true;
    },

    search(yearMonthData, workeruserid) {
      var today = new Date();
      this.defaultValue = new Date(Utility.setFormatDate(yearMonthData));
      // console.log("defaultValue:::::::::", this.defaultValue);
      // console.log("yearMonthData::::::::::::", yearMonthData);
      this.gridDataSelect(yearMonthData, workeruserid);
    },
    searchSelectValSet(nm, txt, val) {
      // console.log("=========== searchSelectValSet(nm,txt, val) ============");
      this[nm] = val;
      this.search();
    },
    searchDateValSet(nm, val) {
      // console.log("=========== searchDateValSet(nm, val) ============");
      this[nm] = Utility.setFormatDate(val, 'YYYY-MM-DD');

      this.search();
    },
    async onRowClick(event) {
      // console.log("=========== async onRowClick(event)============");
      if (event.dataItem) {
        // console.log("event.dataItem.idx::::::::::", event.dataItem.idx);
        // console.log("event.dataItem::::::::::", event.dataItem);
        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;
      }
    },

    // PM주기추가버튼 클릭
    async getPMCycleListSearch() {
      const res = this.mesPost({
        apiKey: "mes/common/manage",
        messagename: "TxnEquipmentPMScheduleCreate",
        params2: {
          PLANTID: this.$auth.$state.user.plantId,
          EQUIPMENTID: this.inputEqId,
          EQUIPMENTNAME: this.viewParam.equipmentName,
          WORKCENTER: this.viewParam.workCenter
        }
      }).then((result) => {
        this.$nextTick(() => {
          if (result.returncode !== undefined && result.returncode === "0") {
            this.search(this.searchDate);
            // this.addSaveData = [];
            this.$refs.alertPop.show("Info", this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 저장되었습니다. */
          } else {
            this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
          }
        })
      })
      // await this.mesGet({
      //   apiKey: "mes/common/getqueryresult",
      //   queryId: "GetPMCycleList",
      //   sendParam: {
      //     plantid: this.$auth.$state.user.plantId,
      //     // yyyymm : Utility.setFormatDate(yearMonthData, 'YYYYMM')
      //     // yyyymm : "202303"
      //     // yyyymm : Utility.setFormatDate(this.fromDt,'YYYYMM'),
      //     // equipmentid : ""
      //     }
      //   }).then((getPMCycleListRes) => {
      //    const getPMCycleListData = getPMCycleListRes.map((x, idx) => {
      //     return {
      //       ...x,
      //       rowStat: "N",
      //       selected: false,
      //       idx: idx,
      //       inEdit: false,
      //       newRow: false,
      //       // equipmentid: this.intputEquipmentId,
      //       // equipmentstate: this.sparepart
      //     }
      //   });

      // if(getPMCycleListData.length > 0) {
      //   // console.log("PMCYCLETYPE ::::::::", getPMCycleListData);

      //   for(var i=0; i<getPMCycleListData.length; i++){
      //       if(getPMCycleListData[i].PMCYCLETYPE != "0" && getPMCycleListData[i].PMCYCLETYPE != "None" && getPMCycleListData[i].PMCYCLETYPE != null) {
      //           const orgDateTime = new Date(getPMCycleListData[i].LASTMAINTENANCETIME);
      //           let dateTime = new Date(getPMCycleListData[i].LASTMAINTENANCETIME);
      //           let dateTimeFormat = Utility.setFormatDate(dateTime, "YYYYMM");
      //           const currdate = new Date(Utility.setFormatDate(this.searchDate));
      //           const dateTimeAddMonth = new Date(currdate.setMonth(currdate.getMonth() +1));
      //           const dateTimeAddMonthFormat = Utility.setFormatDate(dateTimeAddMonth, "YYYYMM");
      //           const newCurrdate = new Date();
      //           const getCurrdateFormat = Utility.setFormatDate(newCurrdate, "YYYYMM");
      //           let newDateTime = "";

      //           while(dateTimeFormat < dateTimeAddMonthFormat) {
      //               if(getPMCycleListData[i].PMCYCLETYPE == "Day") {
      //                   // const newDate = new Date(orgDateTime.setDate(orgDateTime.getDate() + parseInt(getPMCycleListData[i].PMCYCLEVALUE)));
      //                   dateTime = new Date(dateTime.getTime() + (parseInt(getPMCycleListData[i].PMCYCLEVALUE) * 24 * 60 * 60 * 1000));
      //                   dateTimeFormat = Utility.setFormatDate(dateTime, "YYYYMM");
      //                   newDateTime = Utility.setFormatDate(dateTime, "YYYYMMDDHHmmss");

      //               } else if(getPMCycleListData[i].PMCYCLETYPE == "Hour") {
      //                   // const newDate = new Date(orgDateTime.setHours(orgDateTime.getHours() + parseInt(getPMCycleListData[i].PMCYCLEVALUE)));
      //                   dateTime = new Date(dateTime.setHours(dateTime.getHours() + (parseInt(getPMCycleListData[i].PMCYCLEVALUE) * 60 * 60 * 1000)));
      //                   dateTimeFormat = Utility.setFormatDate(dateTime, "YYYYMM");
      //                   newDateTime = Utility.setFormatDate(dateTime, "YYYYMMDDHHmmss");
      //               } else {
      //                   break;
      //               }

      //               if(dateTimeFormat == this.searchDate) {
      //                   this.addSaveData.push({
      //                       pmplannedtime:newDateTime,
      //                       workcomment: "",
      //                       pmscheduleid:"",
      //                       plantid: this.$auth.$state.user.plantId,
      //                       pmscheduletype:"Manual",
      //                           _rowstatus : "C",
      //                           manageruserid : this.userInfo.userId,
      //                       equipmentid:getPMCycleListData[i].EQUIPMENTID,
      //                       workeruserid: ""
      //                   });
      //                 }
      //               }
      //             }
      //           }
      //           // console.log("addSaveData::::::::::::::", this.addSaveData);

      // } else {
      //   // console.log("getPMCycleListData:::::::", getPMCycleListData);
      // }

      // 위에서 this.addSaveData 에 push 한 data를 저장.
      // if(this.addSaveData.length > 0) {

      // }
      // })
    },

    async gridDataSelect(yearMonthData, workeruserid) {
      // console.log("this.fromDt:::::::::::::", this.fromDt);
      // console.log("this.fromDt:::::::::::::", this.fromDt);
      // console.log("this.fromDt:::::::::", Utility.setFormatDate(this.fromDt,'YYYYMM'));

      this.searchDate = yearMonthData; // 다른곳에서 공통으로 해당날자 사용하기위함.
      let res = await this.getListReturn({
        apiKey: "common/calendar/search",
        sendParam: {
          yyyymm: Utility.setFormatDate(yearMonthData, 'YYYYMM')
        }
      });

      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetPMScheduleList",
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          YYYYMM: Utility.setFormatDate(yearMonthData, 'YYYYMM'),
          EQUIPMENTID: this.inputEqId,
          EQUIPMENTNAME: this.viewParam.equipmentName,
          WORKCENTER: this.viewParam.workCenter
        }
      }).then((res1) => {
        let PMScheduleListData;
        if (workeruserid === "" || workeruserid === undefined) {
          PMScheduleListData = res1
            .map((x, idx) => {
              // console.log(":x::::::",x);
              return {
                ...x,
                rowStat: "N",
                selected: false,
                idx: idx,
                inEdit: false,
                newRow: false,
              }
            });
        } else {
          PMScheduleListData = res1
            .filter(x => x.WORKERUSERID === null ? null : workeruserid)
            .map((x, idx) => {
              // console.log(":x::::::",x);
              return {
                ...x,
                rowStat: "N",
                selected: false,
                idx: idx,
                inEdit: false,
                newRow: false,
              }
            });
        }
        this.planData = PMScheduleListData;
      })


      for (var i = 0; i < res.length; i++) {
        if (!(res[i].hldyNm == null || res[i].hldyNm == this.$i18n.t('MES_CommLang.MES_CommLang_00345') || res[i].hldyNm == this.$i18n.t('MES_CommLang.MES_CommLang_00346'))) {
          for (var j = i + 1; j < res.length; j++) {
            if (res[i].hldyNm == res[j].hldyNm) {
              res[i].hldyNm = "";
            }
          }
        }
      }

      res = res.map((item, i) => {
        // console.log("item::::::::::::", item);
        const dt = this.$dayjs(item.dt.split(" ")[0]); // YYYY-MM-DD
        const dtNm = dt.format("ddd"); // 요일
        const newItem = {
          ...item,
          dtNm: dtNm,
          dt: Utility.setFormatDate(item.dt, 'YYYY-MM-DD'),
          hldyNm: item.hldyNm ? item.hldyNm : "",
          rowStat: null,
          selected: i === this.selectedID,
          idx: i,
          rowStat: ""
        };
        return newItem;
      });
      this.gridData = res;
      //   this.planData = res2;
      if (this.gridData.length > 0);
      this.onRowClick({ dataItem: this.gridData[0] });
      //   this.$refs.gridArea.style.display = 'none';
    },

    savePlanData(clickData, btnFlag) {

      // clickData[0]._rowstatus = btnFlag; 
      clickData[0] = clickData[0].map(x => {
        return {
          ...x,
          _rowstatus: btnFlag,
        };
      });

      // console.log("removePlanData:::::삭제바로전[0] 에 속성추가 ::", clickData);

      if(clickData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnEquipmentPMSchedule",
          sendParam: clickData[0]
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.setPMDetailModalVisible = false;
              this.setPMDetailAddModalVisible = false;
              this.search(this.searchDate);
              this.gridData3 = [];
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
      }
    },
    pmDetailSaveData(data, btnFlag) {
      // console.log("pmDetailSaveData:::::::", data);
      this.savePlanData(data, btnFlag);
    },
    pmDetailSave() {
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnEquipmentPMSchedule",
          sendParam: saveData[0],
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$emit('reSearch', Utility.setFormatDate(saveData[0].workcomment, "YYYYMM"));
              this.$refs.alertPop.show("Info", this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 저장되었습니다. */
              this.visibleDialog = !this.visibleDialog;
              this.setPMDetailAddModalVisible = false;
            } else {
              this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
            }
          })
        })
      }
    },
    setEquipmentID(equipmentId) {
      this.inputEqId = equipmentId;
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss">
.k-calendar-view {
  margin: 50px auto !important;
  height: 100%;
}

.k-calendar-table {
  height: 100%;
}

.k-calendar-view.k-hstack.k-align-items-start.k-justify-content-center.k-calendar-monthview {
  overflow: scroll;
}
</style>