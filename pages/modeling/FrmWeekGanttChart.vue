<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
      <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li><!--생산계획-->
      <li>{{ $t("MES_CommLang.MES_CommLang_00786") }}</li><!--주간 생산계획 Gantt Chart-->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10" align="left">
                  <div class="form-group-wrap">
                      <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00258") }}</label><!--품번-->
                          <InputText
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
                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button><!--조회-->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00786") }}</CardTitle><!--주간 생산계획 Gantt Chart-->
              </v-col>
              <v-col cols="6" align="right">
                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <DayPilotScheduler 
                  id="dp" 
                  :config="config" 
                  ref="scheduler" 
              />

            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import '@progress/kendo-theme-default/dist/all.css';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import {DayPilot, DayPilotScheduler} from 'daypilot-pro-vue'

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
    closable: true,
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    InputText,
    DatePicker,
    DayPilotScheduler
  },
  props: {
  },
  data() {
    return {
      startDate : new Date(),
      endDate : new Date(),
      selectedStartDate : new Date(),
      selectedEndDate : new Date(),
      rowHeaderColumns: [
        { text: '공정', display:'PLANOPERNAME'},
        { text: 'Type', display:'PRODUCTORDERTYPE'},
        { text: '품번', display:'PRODUCTID'},
        { text: '품명', display:'PRODUCTNAME'},
        
        
      ],    

      config: {
        timeHeaders: [{"groupBy":"Day","format":"MM/dd"}],
        cellWidth:70,
        scale: "Day",
        days: 5,
        startDate: this.selectedStartDate,
        timeRangeSelectedHandling: "Enabled",
        eventMoveHandling: "Update",
        onEventMoved: (args) => {

          // 원래 날짜에서 이동함
          if(args.e.data.orgStart!=this.DateToYYYYMMDDString(new Date(args.newStart.value))){
            args.e.data.cssClass = "moved";
            args.e.data.update = true;
            this.scheduler.update();
          }
          // 원래 날짜로 돌아옴
          else{
            args.e.data.cssClass = "";
            args.e.data.update = false;
            this.scheduler.update();
          }


        },
        
        onEventMoving: (args) => {
          // 다른 ROW로 이동할 수 없음
          if(args.e.resource() != args.resource){
              args.allowed = false;
          }
        },
        onEventResizing: (args) => {
          // Resizing(소요일수 변경) 불가, 이동만 가능
          args.allowed = false;
        },
        treeEnabled: true,
        onBeforeRowHeaderColumnRender: (args) => {
          args.column.cssClass = "rowHeaderColumn";
        },
        onBeforeRowHeaderRender: args => {
          args.row.cssClass = "rowHeader";
        },
        onBeforeTimeHeaderRender: args => {
          args.header.cssClass = "timeHeader";
        }
        
      },
     
    };
  },
  created() {},
  async mounted() {
    this.scheduler.update({rowHeaderColumns: this.rowHeaderColumns});
  },
  computed: {
    scheduler: function () {
      return this.$refs.scheduler.control;
    }
  },
  watch: {},
  methods: {
    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.selectedStartDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.selectedEndDate = event.value;
    },
    
    async searchBtn(){
      this.startDate = this.selectedStartDate;
      this.endDate = this.selectedEndDate;
      await this.getGridData();
    },
    async getGridData(){
      const startDate = new Date(this.selectedStartDate);
      startDate.setHours(startDate.getHours()+9);
      const days = this.dayDiff(this.selectedStartDate, this.selectedEndDate);
      this.scheduler.update({days : days, startDate: startDate});

      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetWeekGanttChartList",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          startdate: this.DateToYYYYMMDDString(this.selectedStartDate),
          enddate: this.DateToYYYYMMDDString(this.selectedEndDate),
        },
      }).then((res) => {
        const resourceList = [];
        const eventList = [];
        res.map((x, idx)=>{
          if(resourceList.filter(y => (this.findResourceRow(x,y))).length==0){
            resourceList.push({
              id:idx+1, 
              tags:{ 
                PRODUCTORDERTYPE: x.PRODUCTORDERTYPE,
                PRODUCTID: x.PRODUCTID,
                PRODUCTNAME: x.PRODUCTNAME,
                PLANOPERID: x.PLANOPERID,
                PLANOPERNAME: x.PLANOPERNAME,
              }
            });  
          }
          if(eventList.filter(y=> this.findEventRow(x,y)).length==0){
            eventList.push({
              DATAKEY: [x.DATAKEY],
              PRODUCTORDERTYPE: x.PRODUCTORDERTYPE,
              PRODUCTID: x.PRODUCTID,
              PLANOPERID: x.PLANOPERID,
              id:idx, 
              start:this.StringToDate(x.PLANSTARTTIME), 
              end:this.StringToDate(x.PLANENDTIME),
              orgStart:x.PLANSTARTTIME,
              orgEnd:x.PLANENDTIME, 
              text: x.PLANQUANTITY, 
              resource: resourceList.filter(y => this.findResourceRow(x,y))[0].id,
              update:false,
              cssClass:"",
              barColor:"#35497a",
              barBackColor:"#35497a"
            })
          }
          else{
            eventList.filter(y=> this.findEventRow(x,y)).map(y => {
              y.text = Number(y.text)+Number(x.PLANQUANTITY);
              y.DATAKEY.push(x.DATAKEY);
            })
          }
          
        });
        eventList.map(x=> {
          x.bubbleHtml = "말풍선 테스트, 수량 : "+x.text+"개";
        });
        // Resource Binding
        this.scheduler.resources = resourceList;
        // Event Binding
        this.scheduler.events.list = eventList;
        this.scheduler.update();
      });
    },

    saveBtn(){
      const saveData = [];
      this.scheduler.events.list.filter(x=> x.update).map(x=>{
        x.DATAKEY.map(y => {
          const data = {
            DATAKEY: y,
            PLANSTARTTIME: new Date(x.start),
            PLANENDTIME: new Date(x.end),
          }
          data.PLANSTARTTIME = data.PLANSTARTTIME.getTime();
          data.PLANENDTIME = data.PLANENDTIME.getTime();
          saveData.push(data);
        })
      });

      if(saveData.length>0){

        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnWeekGanttChart',
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
      else{
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
        return;
      }
      
      

    },

    // Util
    // 날짜 차이 계산
    dayDiff(day1, day2){
      return Math.abs((new Date(day1).getTime() - new Date(day2).getTime())/(24 * 60 * 60 * 1000))+1; 
    },
    // Resource Row 찾기
    findResourceRow(data, resource){
      return data.PRODUCTORDERTYPE == resource.tags.PRODUCTORDERTYPE
          && data.PRODUCTID == resource.tags.PRODUCTID
          && data.PLANOPERID == resource.tags.PLANOPERID
    },
    // Event Row 찾기
    findEventRow(data, event){
      const orgStart = new Date(event.start);
      const orgEnd = new Date(event.start);
      orgStart.setHours(orgStart.getHours()-9);
      orgEnd.setHours(orgEnd.getHours()-9);
      return data.PRODUCTORDERTYPE == event.PRODUCTORDERTYPE
            && data.PRODUCTID == event.PRODUCTID
            && data.PLANOPERID == event.PLANOPERID
            && data.PLANSTARTTIME == this.DateToYYYYMMDDString(orgStart)
            && data.PLANENDTIME == this.DateToYYYYMMDDString(orgEnd)
    },
    // YYYYMMDD to Date
    StringToDate(String){
      const resultDate = new Date();
      resultDate.setFullYear(String.substring(0,4));
      resultDate.setMonth(Number(String.substring(4,6))-1);
      resultDate.setDate(String.substring(6,8));
      resultDate.setHours(resultDate.getHours()+9);
      return resultDate;
    }

    // DATE TO YYYYMMDD ()
  },
};

</script>
<style>
.scheduler_default_columnheader_cell_inner{
justify-content: center;
}
.moved .scheduler_default_event_inner{
background: #fff59a;
}
.rowHeaderColumn{
justify-content: center;
color: #192F66;
background-color: #EEF0F5;
}
.rowHeader{
color: #192F66;
background-color: #FFFFFF;

}
.timeHeader{
color: #192F66;
background-color: #EEF0F5;
font-weight:bold;

}
</style>
