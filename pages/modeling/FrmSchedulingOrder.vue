<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00829") }}</li> <!-- Scheduling 변경 -->
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
                      :style="{ width: '150px' }"
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
                      :value="sendParam.planVersion"
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
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00829") }}</CardTitle><!--Schedule 변경-->
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'secondary'" :size="'small'" @click="excel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button><!--전체EXCEL-->
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button>
                </v-col>
              </v-row>
              <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="headerParam.gridHeader"
                  :selected-field="selectedField"
                  :resizable="false"
                  :isPaging="false"
                  :scrollable="true"
                  :rowClass= "rowClass"
                  @pressHandler="pressHandler"
                  @dragHandler="dragHandler"
                  @releaseHandler="releaseHandler"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import { Card, CardBody, CardTitle, TabStrip } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
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
  DropDownList,
  DatePicker,
},
data() {
  return {
      gridHeight: "100px",
      selectedField: "selected",
      gridData: [],
      headerParam:{
        gridid:'dgvSchedulingOrder',
        gridHeader:[],
        noRowstat: true,
        noFirstCheck:true,
        xOverflowYn: true,
      },
      planOperList: [],
      workCenterList:[],
      planVersionList:[],
      sendParam:{
          planOperId:'',
          workCenter:'',
          planVersion:'',
          startDate : this.DateToYYYYMMDDString(new Date()),
          endDate : this.DateToYYYYMMDDString(new Date()),
      },
      v1:false,
      selectedStartDate : new Date(),
      selectedEndDate : new Date(),
      selectedIdx:'',
      activeItem:{},
      targetTopOffset:'',
      targetRowIdx:'',
      orgDay: '',
      orgSeq: '',
      newDay: '',
      newSeq: '',
      SEARCHSTDATE:'',
      SEARCHEDDATE:'',
      
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

  await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper1)
  await this.getGridData();
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
      this.sendParam.planOperId = this.planOperList[2].id;
    })
  },

  // 계획공정 콤보 선택
  selectPlanOper(event) {
    this.sendParam.planOperId = event.value;
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
      this.sendParam.workCenter = this.workCenterList[0].id;
    });
  },

  // W/C 콤보 선택
  selectWorkCenter(event) {
    this.sendParam.workCenter = event.value;
  },
  
  // 계획 버전 콤보 데이터
  async getPlanVersionListData(){
    await this.mesGet({
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
      this.sendParam.planVersion = this.planVersionList[0]?.id;
    });
  },

  // 계획 버전 콤보 선택
  selectPlanVersion(event) {
    this.sendParam.planVersion = event.value;
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
    this.SEARCHSTDATE = this.DateToYYYYMMDDString(this.selectedStartDate);
    this.SEARCHEDDATE = this.DateToYYYYMMDDString(this.selectedEndDate);
    this.getGridData();
  },

  async getGridData(){
    await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSchedulingOrderList',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          PLANVERSION: this.sendParam.planVersion,
          PLANOPERID: this.sendParam.planOperId,
          WORKCENTER: this.sendParam.workCenter,
          STARTDATE: this.DateToYYYYMMDDString(this.selectedStartDate),
          ENDDATE: this.DateToYYYYMMDDString(this.selectedEndDate),
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            idx: idx,
            rowStat:"N",
          }
        });

        const totalData = [];
        let date = data[0]?.DUEDATE;
        let cnt = 0;
        
        data.map(x => {
          if(x.DUEDATE!=date){
            totalData.push({
              TOTALROW:'ROW_SUBTOTAL',
              DUEDATE: '소계',
              PLANQUANTITY: data.filter(y => y.DUEDATE == date).reduce((sum,row) => sum+Number(row.PLANQUANTITY),0),
              idx: cnt++,
              rowStat:"N",
            });
          }
          totalData.push({...x, idx:cnt++});
          date = x.DUEDATE;
        })
        totalData.push({
          TOTALROW:'ROW_SUBTOTAL',
          DUEDATE: '소계',
          PLANQUANTITY: data.filter(y => y.DUEDATE == date).reduce((sum,row) => sum+Number(row.PLANQUANTITY),0),
          idx: cnt++,
          rowStat:"N",
        });
        
        this.gridData = totalData;
      });
  },
  
  // PLANNING 버튼 - 팝업
  planningBtn(){
    
    this.schedulingVisible = true;

  },

  pressHandler(dataItem, event){
    this.selectedIdx = dataItem.idx;
      this.gridData = this.gridData.map(item => {
          return {
          ...item,
          selected: item.idx === this.selectedIdx ? true : false,
          move: item.idx === this.selectedIdx ? true : false,
          };
      });
      this.activeItem = {...dataItem};
  },
  dragHandler(dataItem, event){
    if(dataItem.TOTALROW=='ROW_SUBTOTAL'){
      return;
    }
    this.getDropPosition(event);
    this.orgDay = dataItem.DUEDATE;
    this.orgSeq = Number(dataItem.DAYSEQUENCE);
  },
  getDropPosition(event){
    const targetRowIdx = event.originalEvent.target.parentElement.rowIndex; // 셀영역 rowIdx
    const iconRowIdx = event.originalEvent.target.parentElement.parentElement.rowIndex; // 아이콘영역의 부모 rowIdx
    
    if(iconRowIdx != undefined){
      this.targetRowIdx = iconRowIdx;
    } else {
      this.targetRowIdx = targetRowIdx;
    }
  },
  releaseHandler(dataItem, event){
    if(this.gridData[this.targetRowIdx].TOTALROW=='ROW_SUBTOTAL'){
      this.gridData = this.gridData.map(item => {
          return {
          ...item,
          selected: false
          };
      });
      return;
    }

    this.newDay = this.gridData[this.targetRowIdx].DUEDATE;
    this.newSeq = Number(this.gridData[this.targetRowIdx].DAYSEQUENCE);

    // 같은 날짜 내 이동
    if(this.orgDay==this.newDay){
      this.gridData.filter(x => x.DUEDATE == this.orgDay).map(x => {
        if(this.newSeq > this.orgSeq){
          if(Number(x.DAYSEQUENCE)>this.orgSeq && Number(x.DAYSEQUENCE)<=this.newSeq){
            x.DAYSEQUENCE = String(Number(x.DAYSEQUENCE)-1).padStart(5,"0");
            x.rowStat = 'U'
          }
        }else if(this.newSeq < this.orgSeq){
          if(Number(x.DAYSEQUENCE)>=this.newSeq && Number(x.DAYSEQUENCE)<=this.orgSeq){
            x.DAYSEQUENCE = String(Number(x.DAYSEQUENCE)+1).padStart(5,"0");
            x.rowStat = 'U'
          }
        }
        
      })
    // 다른 날짜로 이동
    }else{
      this.gridData.filter(x => x.DUEDATE == this.orgDay && Number(x.DAYSEQUENCE) > this.orgSeq).map(x => {
        x.DAYSEQUENCE = String(Number(x.DAYSEQUENCE)-1).padStart(5,"0");
        x.rowStat = 'U'
      });

      this.gridData.filter(x => x.DUEDATE == this.newDay && Number(x.DAYSEQUENCE) > this.newSeq).map(x => {
        x.DAYSEQUENCE = String(Number(x.DAYSEQUENCE)+1).padStart(5,"0");
        x.rowStat = 'U'
      });
    }

    this.gridData.map((x, idx) => {
      if(x.move){
        this.gridData.splice(idx,1);
      }
    });
    this.gridData.splice(this.targetRowIdx+(this.orgDay<=this.newDay?0:1), 0, 
    {...dataItem, 
      move:false, 
      DUEDATE: this.newDay, 
      DAYSEQUENCE:String(this.newSeq+(this.orgDay==this.newDay?0:1)).padStart(5,"0"),
      rowStat: 'U',
      TOTALROW:'MOVED',
      selected:false,
    });

  },

  saveBtn(){
    const saveData = this.gridData.filter(x => x.rowStat == 'U').map(x => {
      return {
        ...x,
        DUEDATE: x.DUEDATE.substring(0,4)+x.DUEDATE.substring(5,7)+x.DUEDATE.substring(8,10),
        SEARCHSTDATE: this.SEARCHSTDATE,
        SEARCHEDDATE: this.SEARCHEDDATE,
      }
    })
    if(saveData.length>0){
      this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnScheduleReorder',
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

  rowClass(e) {
    return e.dataItem.TOTALROW;
  },

  excel(){
    this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetSchedulingOrderList',
        sendParam: {
            plantid: this.$auth.$state.user.plantId,
            gridid: this.headerParam.gridid,
            PLANVERSION: this.sendParam.planVersion,
            PLANOPERID: this.sendParam.planOperId,
            WORKCENTER: this.sendParam.workCenter,
            STARTDATE: this.DateToYYYYMMDDString(this.selectedStartDate),
            ENDDATE: this.DateToYYYYMMDDString(this.selectedEndDate),
        },
    });
  }





},

}

</script>
<style>
.MOVED{
  background-color: rgb(235, 187, 199) !important;
}
</style>