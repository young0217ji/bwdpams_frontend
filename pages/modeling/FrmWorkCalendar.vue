<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li><!--생산계획-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00602") }}</li><!--근무시간관리-->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row ref="searchFilter" no-gutters>
                <v-col :sm="9" :lg="10" align="left">
                  <div class="form-group-wrap">
                    
                    <div class="form-group">
                      <label>W/C</label> 
                      <DropDownList
                        :style="{ width: '250px' }"
                        :data-items="workCenterList"
                        :text-field="'NAME'"
                        :data-item-key="'CODE'"
                        :value-field="'CODE'"
                        :value-primitive="true"
                        :value="workCenter"
                        @change="selectWorkCenter"
                        />
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                      <DropDownList
                        ref="cmbEquipmentType"
                        :style="{ width: '250px' }"
                        :data-items="equipmentList"
                        :text-field="'NAME'"
                        :data-item-key="'CODE'"
                        :value-field="'CODE'"
                        :value-primitive="true"
                        :value="equipment"
                        @change="selectEquipment"
                        />
                    </div>

                    <div class="form-group">
                      <label>기간</label>
                      <div class="form-datepicker">  
                        <DatePicker
                          ref="startDate"
                          :default-value="new Date()"
                          :value="startDate"
                          :format="'yyyy-MM-dd'"
                          @change="selectStartDate"
                        />
                      </div>
                      <span class="i_tilde">~</span>
                      <div class="form-datepicker">  
                        <DatePicker
                          ref="endDate"
                          :default-value="new Date()"
                          :value="endDate"
                          :format="'yyyy-MM-dd'"
                          @change="selectEndDate"
                        />
                      </div> 
                      <Button :theme-color="'secondary'" :size="'medium'" @click="setDate(1)">{{ $t("MES_CommLang.MES_CommLang_00603") }}</Button><!--1개월-->
                      <Button :theme-color="'secondary'" :size="'medium'" @click="setDate(2)">{{ $t("MES_CommLang.MES_CommLang_00604") }}</Button><!--1개월-->
                      <Button :theme-color="'secondary'" :size="'medium'" @click="setDate(3)">{{ $t("MES_CommLang.MES_CommLang_00605") }}</Button><!--1개월-->
                    </div>
                    <div class="form-group">
                      <label>SHIFT</label>
                      <DropDownList
                        :style="{ width: '250px' }"
                        :data-items="shiftList"
                        :text-field="'SHIFTNAME'"
                        :data-item-key="'SHIFTID'"
                        :value="shiftValue"
                        @change="selectShiftCombo"
                      />
                      <Button :theme-color="'primary'" :size="'medium'" @click="shiftApply">{{ $t("MES_CommLang.MES_CommLang_00606") }}</Button><!--일괄적용-->
                      <Button :theme-color="'warning'" :size="'medium'" @click="shiftType(1)">{{ $t("MES_CommLang.MES_CommLang_00493") }}</Button><!--확정-->
                      <Button :theme-color="'error'" :size="'medium'" @click="shiftType(2)">{{ $t("MES_CommLang.MES_CommLang_00607") }}</Button> <!--예정-->
                      <Button :theme-color="'base'" :size="'medium'" @click="shiftType(3)">{{ $t("MES_CommLang.MES_CommLang_00608") }}</Button><!--미정-->
                    </div>
                  </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="getGridData">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button><!--조회-->
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
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00602") }}</CardTitle><!--근무시간관리-->
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'undo'"
                    @click=""
                    >undo</Button
                  >
                </v-col>
              </v-row>
              <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)', 'overflow-x':'scroll'}">
                  <KendoGrid
                    ref="detailGrid"
                    :selectable="'multiple cell'"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
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
    </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import Utility from "~/plugins/utility";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import KendoGrid from "@/components/common/KendoGrid"
  //import { Grid } from "@progress/kendo-grid-vue-wrapper"
  import { DatePicker } from "@progress/kendo-vue-dateinputs";
  import { DropDownList } from "@progress/kendo-vue-dropdowns";

  
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
      //"DragGrid": Grid,
      DatePicker,
      DropDownList,
      KendoGrid

    },
    props: {
      gridHeight: {
        type: String,
        defaultData: "500px",
      },
    },
    data() {
      return {
        orgHeader : [
          { filed: "PLANTID", visible:false},
          { field: "WORKCENTER", title:"WORKCENTER", width:120, editable:false, locked:true},
          { field: "WORKCENTERNAME", title:"WORKCENTERNAME", width:180, editable:false, locked:true},
          { field: "EQUIPMENTID", title:this.$i18n.t('MES_CommLang.MES_CommLang_00177'), width:100, editable:false, locked:true}, // 설비코드
          { field: "EQUIPMENTNAME", title:this.$i18n.t('MES_CommLang.MES_CommLang_00171'), width:200, editable:false, locked:true} // 설비명
        ],
        gridHeader: [
          { filed: "PLANTID", visible:false},
          { field: "WORKCENTER", title:"WORKCENTER", width:120, editable:false, locked:true},
          { field: "WORKCENTERNAME", title:"WORKCENTERNAME", width:180, editable:false, locked:true},
          { field: "EQUIPMENTID", title:this.$i18n.t('MES_CommLang.MES_CommLang_00177'), width:100, editable:false, locked:true}, // 설비코드
          { field: "EQUIPMENTNAME", title:this.$i18n.t('MES_CommLang.MES_CommLang_00171'), width:200, editable:false, locked:true} // 설비명
        ],
        gridData: [],
        gridOriData: [],
        selectedField: "selected",
        workCenterList: [{CODE: '', NAME : '-ALL-'}],
        workCenter: '',
        equipmentList: [{CODE: '', NAME: '-ALL-'}],
        equipment:'',
        shiftList: [],
        shiftValue: '',
        startDate: new Date(),
        endDate: new Date(),
        dateList : [],
        holidayFlagList: [],

      };
    },
    created() {},
    async mounted() {
      //this.gridHeader = this.orgHeader;
      await this.getWorkCenterData();
      await this.getEquipmentListData();
      await this.getShiftListData();
      await this.setDate(1);
    },
    computed: {
    },
    watch: {},
    methods: {
      //===== 검색조건 START =====

      // 공정 Combobox
      async getWorkCenterData() {
          this.mesGet({
          apiKey: 'mes/common/customquery',
          queryId: 'GetAreaList',
          queryVersion: '00006',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          },
        }).then(res => {
          res.map(x => {
            this.workCenterList.push(x);  
          })
          this.workCenter = this.workCenterList[0].CODE;
        });
      }, 

      // 설비 Combobox
      async getEquipmentListData() {
        this.mesGet({
          apiKey: 'mes/common/customquery',
          queryId: 'GetEquipmentComboList',
          queryVersion: '00002',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          },
        }).then(res => {
          res.map(x => {
            this.equipmentList.push(x);  
          })
          this.equipment = this.equipmentList[0].CODE;
        });
      }, 
      // SHIFT Combobox
      async getShiftListData() {
        this.mesGet({
          apiKey: 'mes/common/customquery',
          queryId: 'GetShiftList',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          },
        }).then(res => {
          this.shiftList = res;
          this.shiftValue = this.shiftList[0];
        });
      }, 

      // 공정 Combobox 선택
      selectWorkCenter(event) {
        this.workCenter = event.value;
      },
      // 장비 Combobox 선택
      selectEquipment(event) {
        this.equipment = event.value;
      },
      // SHIFT Combobox 선택
      selectShiftCombo(event){
        this.shiftValue = event.value;
      },
      // 기간 - 시작일 선택
      selectStartDate(event){
        this.startDate = event.target.value;
      },
      // 기간 - 종료일 선택
      selectEndDate(event){
        this.endDate = event.target.value;
      },
      // 날짜 세팅 버튼
      setDate(num){
        this.startDate = new Date();
        let endDate = new Date();
        endDate.setMonth(this.startDate.getMonth()+num);
        endDate.setDate(this.startDate.getDate());
        this.endDate = endDate;
      },

      //===== 검색조건 END =====

      rowDdChange(e, name, dataItem){
        const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
        const data = JSON.parse(JSON.stringify(this.gridData));

        data[idx] = {...data[idx], [name]: e.value}

        this.gridData = data;
      },
      // 데이터 조회
      async getGridData(){
        this.gridHeader = [];
        this.orgHeader.map((x) => {
          this.gridHeader.push(x);
        });

        let start = new Date(this.startDate);
        let end = this.endDate;
        let datePivotString = [];
        while(start<=end){

          datePivotString.push("[DATE"+this.DateToYYYYMMDDString(start)+"]");

          const item = {
            field:"DATE"+this.DateToYYYYMMDDString(start),
            title:this.DateToYYYYMMDDString(start).substring(4,6)+'/'+this.DateToYYYYMMDDString(start).substring(6,8),
            width: 120,
            cell:"dragDate"
          };
          this.gridHeader.push(item);

          start.setDate(start.getDate()+1);
        }
        this.mesGet({
          apiKey: "mes/common/customquery",
          queryId: "GetWorkCalendarList",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            workcenter: this.workCenter,
            equipmentid: this.equipment,
            startdate: this.DateToYYYYMMDDString(this.startDate),
            enddate: this.DateToYYYYMMDDString(this.endDate),
          }
        }).then((res) => {
          const data = res.map((x, idx) => {
            this.gridHeader.filter(y=> String(y.field).includes('DATE')).map(y=> {
              if(!this.isNullOrEmpty(x[y.field])){
                const SHIFTID = x[y.field].indexOf('/')==-1?x[y.field]:x[y.field].split('/')[0];
                x[y.field+'NAME'] = this.isNullOrEmpty(SHIFTID)?'':this.shiftList.filter(z => z.SHIFTID == SHIFTID)[0].SHIFTNAME;
              }
            });
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
            }
          });
          this.$nuxt.$emit('iccReset')
          this.gridData = data;
          this.gridOriData = data.map((x, idx) => {
            return{
              ...x
            }
          });
        })

        this.mesGet({
          apiKey: "mes/common/customquery",
          queryId: "GetHolydayFlag",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            startdate:this.DateToYYYYMMDDString(this.startDate),
            endDate:this.DateToYYYYMMDDString(this.endDate),
          }
        }).then((res) => {
          this.holidayFlagList = res;
        });
      },

      // selected 셀에 SHIFT 적용
      shiftApply(){
        document.querySelectorAll('.k-selected').forEach((x)=>{
          x.firstChild.firstChild.value = this.shiftValue.SHIFTID;
          x.childNodes[2].firstChild.value = this.shiftValue.SHIFTNAME;
          //x.firstChild.childNodes[1].value = this.shiftValue.SHIFTNAME;
          x.firstChild.firstChild.dispatchEvent(new Event("input"));
          x.childNodes[2].firstChild.dispatchEvent(new Event("input"));
        })
      },
      // selected 셀에 SHIFT TYPE 적용
      shiftType(type){
        let shiftClass = '';
        if(type==1){
          shiftClass = 'shift-1';
        }else if(type==2){
          shiftClass = 'shift-2';
        }else if(type==3){
          shiftClass = 'shift-3';
        }
        document.querySelectorAll('.k-selected').forEach((x)=>{
          let input = x.firstChild.firstChild;
          
          if(input.value!='' && !input.value.includes('/')){
            input.value += "/"+type;
            input.dispatchEvent(new Event("input"));
            x.lastChild.className = shiftClass;
          }else if(input.value.includes('/')){
            input.value = input.value.split('/')[0]+"/"+type;
            input.dispatchEvent(new Event("input"));
            x.lastChild.className = shiftClass;
          }    
        })
      },
      saveBtn(){

        let sendParam = [];
        this.gridData.forEach((x, idx) =>{
          this.gridHeader.map(y => {
            if(x[y.field] != this.gridOriData[idx][y.field]){
              let data = {
                PLANTID: x.PLANTID,
                WORKDATE: y.field.substring(4,12),
                WORKTYPE: this.holidayFlagList.filter(x => x.DATE == y.field.substring(4,12))[0].HOLIDAYFLAG=="X"?"A2":"A1",
                WORKCENTER: x.WORKCENTER,
                EQUIPMENTID: x.EQUIPMENTID,
                SHIFTID: x[y.field].includes('/')?x[y.field].split('/')[0]:x[y.field],
                CONFIRMFLG: x[y.field].includes('/')?x[y.field].split('/')[1]:0,
                _ROWSTATUS: this.isNullOrEmpty(this.gridOriData[idx][y.field])?"C":"U"
              }
              sendParam.push(data);
            }
          });
        })

        const res = this.mesPost({
              apiKey: "mes/common/manage",
              messagename: "TxnWorkCalendar",
              sendParam: sendParam,
            }).then((result) => {
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
      },

    },
  };
  
  const defaultData = {};
  </script>
  <style>
  .multicell-shift-1, .shift-1{
    background-color: #ffc857 !important;
  }
  .multicell-shift-2, .shift-2{
    background-color: #d31038 !important;
  }
  .multicell-shift-3, .shift-3{
    background-color: #d6e5e9 !important;
  }
  </style>
  