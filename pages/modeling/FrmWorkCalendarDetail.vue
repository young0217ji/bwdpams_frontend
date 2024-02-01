<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00615") }}</li> <!-- 작업자 근무 계획 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00055") }}</label> <!-- 공정명  -->
                      <DropDownList
                        ref="cmbProcessType"
                        :style="{ width: '250px' }"
                        :data-items="processList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="processValue"
                        @change="selectProcessType"
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
                    <Button :theme-color="'secondary'" :size="'medium'" @click="setDate(1)">1개월</Button>
                    <Button :theme-color="'secondary'" :size="'medium'" @click="setDate(2)">2개월</Button>
                    <Button :theme-color="'secondary'" :size="'medium'" @click="setDate(3)">3개월</Button>
                    <Button :theme-color="'primary'" :size="'medium'" @click="userApply">{{ $t("MES_CommLang.MES_CommLang_00606") }}</Button><!--일괄적용-->
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
                <v-col cols="6">
                <CardTitle>&nbsp;</CardTitle>
              </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" @click="excel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button><!--전체EXCEL-->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn" >undo</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)', width: '100%'}">
                    <KendoGrid
                        ref="rowGrid"
                        :gridHeight="gridHeight"
                        :gridItems="gridData"
                        :sortable="true"
                        :columns="headerParam"
                        :resizable="false"
                        :edit-field="'inEdit'"
                        :selected-field="selectedField"
                        :isPaging="false"
                        :scrollable="true"
                        @cellClickPopup="cellClickPopup"
                        @userApply="userApply"
                    />
                </div>
            </CardBody>    
          </Card>
        </v-col>
      </v-row>
      <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
      />
      <ConfirmPop
        ref="ConfirmPop"
      />
      <GetUserModal
        ref="UserModal"
        v-if="UserModalVisible"
        :visibleDialog="UserModalVisible"
        @visibleDialog="(val) => UserModalVisible = val"
        @selectUser="selectUser"
      />
      
    </div>
</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import DateUtility from '~/plugins/dateUtility';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '../../components/common/input/InputText.vue';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import GetUserModal from "@/components/common/modal/GetUserModal.vue"
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';
import { dataSdsIcon } from '@progress/kendo-svg-icons';

let myTitle;
let myMenuId;



export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    DropDownList,
    SelectProductModal,
    GetUserModal,
    DatePicker,
  },
  props: {},
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      saveOriData:[],
      processList: [], // 공정명 콤보박스 
      processValue: '',
      oriHeaderParam: [
        { field: 'PROCESSID', title:'공정ID', width:'200px', cell:'merge',  },
        { field: 'PROCESSNAME', title:'공정명', width:'200px', editable:false },
        { field: 'EQUIPMENTNAME', title:'설비명', width:'200px', cell:'merge' },
        ],
      headerParam: [
        { field: 'PROCESSID', title:'공정ID', width:'200px', cell:'merge'},
        { field: 'PROCESSNAME', title:'공정명', width:'200px', editable:false },
        { field: 'EQUIPMENTNAME', title:'설비명', width:'200px', cell:'merge' },
        
        
      ],
      selectedField: 'selected',
      startDate: new Date(),
      endDate: new Date(),
      dateList: [],
      UserModalVisible: false,
      selectedIndex: '',
      selectedColumn: '',
      multiFlag: false,
      dateColumn: [],

    };
  },
  created() {
    this.todate = Utility.setFormatDate(new Date(), 'YYYY-MM-DD');
    this.fromdate = Utility.setFormatDate(
      DateUtility.addDate(-7, null, new Date()),
      'YYYY-MM-DD'
    );
  },
  async mounted() {
    await this.getProcessListData();
    await this.setDate(1);
  },
  computed: {
    
  },
  watch: {},
  methods: {

    // 공정명 콤보 선택
    selectProcessType(event) {
      this.processValue = event.value;
    },

    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.endDate = event.value;
    },

    // 날짜 세팅 버튼
    setDate(num){
        this.startDate = new Date();
        let endDate = new Date();
        endDate.setMonth(this.startDate.getMonth()+num);
        endDate.setDate(this.startDate.getDate());
        this.endDate = endDate;
    },

    // 공정명 콤보 데이터 가져오기
    async getProcessListData() {
        this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetProcessList',
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
            this.processList.push({ id : data[i].PROCESSID, text : data[i].PROCESSNAME });
            this.processValue = this.processList[0].id;
          }
        }
      });
    }, 


    selectProcessType(event) {
        this.processValue = event.value;
    },


    async searchBtn() {
        this.getGridData();

    },

    // 그리드 데이터 가져오기
    async getGridData() {
        this.gridOriData = [];
        this.gridData = [];
        this.headerParam = [];
        this.dateColumn = [];
        this.oriHeaderParam.map((x) => {
            this.headerParam.push(x);
        });

        let start = new Date(this.startDate);
        let end = this.endDate;
        let datePivotString = [];
        while(start<=end) {

            datePivotString.push("[DATE"+this.DateToYYYYMMDDString(start)+"]");

            const item = {
                field: "DATE"+this.DateToYYYYMMDDString(start),
                title: this.DateToYYYYMMDDString(start).substring(4,6)+'/'+this.DateToYYYYMMDDString(start).substring(6,8),
                width: 100,
                cell: "cellClickPopup"
            };
            this.headerParam.push(item);
            this.dateColumn.push(item.field);

            start.setDate(start.getDate()+1);
        }


        this.mesGet({
            apiKey: 'mes/common/getqueryresult',
            queryId: 'GetWorkCalendarDetailList',
            sendParam: {
                plantID: this.$auth.$state.user.plantId,
                PROCESSID: this.$refs.cmbProcessType.value.id,
                PROCESSNAME: this.$refs.cmbProcessType.value.text,
                STARTDATE: this.DateToYYYYMMDDString(this.startDate),
                ENDDATE: this.DateToYYYYMMDDString(this.endDate),
            },
        }).then(res => {
          let gridTo3Row = [];
          let cnt = 0;
             const data = res.map((x, idx) => {
                x = {
                    ...x,
                    rowStat: 'N',
                    selected: false,
                    idx: idx,
                    inEdit: true,
                    newRow: false,
                    resizable: true,
                    PROCESSNAME: this.processList.filter(y => x.PROCESSID === y.id)[0].text
                };

                // 3행 중 1행 만들기
                if(gridTo3Row.filter(y => x.EQUIPMENTID==y.EQUIPMENTID && x.PROCESSID == y.PROCESSID).length<1){
                  gridTo3Row.push({
                    PROCESSID:x.PROCESSID,
                    PROCESSNAME:x.PROCESSNAME,
                    EQUIPMENTID:x.EQUIPMENTID,
                    EQUIPMENTNAME:x.EQUIPMENTNAME,
                    idx: cnt++
                  });
                }
                const searchRow = res.filter(y => x.EQUIPMENTID==y.EQUIPMENTID && x.PROCESSID == y.PROCESSID).length;
                if(searchRow == 1){
                  if(x.SHIFTTYPE == 1 || x.SHIFTTYPE == '1'){
                    gridTo3Row.push({
                      ...x,
                      idx:cnt++,
                      PROCESSNAME:'주간',
                    });
                    const row = {
                      PROCESSID:x.PROCESSID,
                      PROCESSNAME:'야간',
                      EQUIPMENTID:x.EQUIPMENTID,
                      EQUIPMENTNAME:x.EQUIPMENTNAME,
                      idx: cnt++
                    };
                    this.dateColumn.map(y => {
                      row[y] = '';
                    })
                    gridTo3Row.push(row);
                  }else{
                    const row = {
                      PROCESSID:x.PROCESSID,
                      PROCESSNAME:'주간',
                      EQUIPMENTID:x.EQUIPMENTID,
                      EQUIPMENTNAME:x.EQUIPMENTNAME,
                      idx: cnt++
                    };
                    this.dateColumn.map(y => {
                      row[y] = '';
                    })
                    gridTo3Row.push(row);
                    gridTo3Row.push({
                      ...x,
                      idx:cnt++,
                      PROCESSNAME:'야간',
                    });
                    
                  }
                }else if(searchRow == 2){
                  gridTo3Row.push({
                    ...x,
                    idx:cnt++,
                    PROCESSNAME: x.SHIFTTYPE=='1'?'주간':'야간',
                  });
                }           
            });
            this.$nuxt.$emit('iccReset');
            this.gridData = gridTo3Row;
            this.gridOriData = JSON.parse(JSON.stringify(this.gridData));
            
        })
    },

    // 더블클릭 - 더블클릭했던 셀 하나에만 값을 적용시켜야함
    cellClickPopup(e, name, item){
      this.multiFlag = false;
      if(item.idx % 3 == 0) {
        return;
      }
      this.UserModalVisible = true;
      this.selectedIndex = item.idx;
      this.selectedColumn = name;
    },

    //일괄적용 버튼 - 선택된 모든 셀에 값을 적용시켜야함
    userApply() {
      this.multiFlag = true;
      this.UserModalVisible = true;
          
    },



    selectUser(data){
      if(this.multiFlag == true){
        this.userApply;
        document.querySelectorAll('.k-selected').forEach((x)=>{
        x.firstChild.firstChild.value = data.name;
        x.firstChild.firstChild.dispatchEvent(new Event("input"));
      })

      }else{
        this.cellClickPopup;

      }

      this.gridData.filter(x=> (x.idx ==this.selectedIndex))[0][this.selectedColumn] = data.name;
    },

    // 저장 버튼 클릭
    saveBtn() {
      console.log(this.selectedIndex)
      console.log(this.selectedColumn)
      let sendParam = [];
      this.gridData.forEach((x,idx) => {
        this.headerParam.map(y => {
          
          if(x[y.field] != this.gridOriData[idx][y.field]) {
            let data = {
              PLANTID: this.$auth.$state.user.plantId,
              WORKDATE: y.field.substring(4,12),
              PROCESSID: x.PROCESSID,
              EQUIPMENTID: x.EQUIPMENTID,
              SHIFTTYPE: x.PROCESSNAME == "주간"?"1":"2",
              WORKERID: x[y.field],
              _ROWSTATUS: this.isNullOrEmpty(this.gridOriData[idx][y.field])?"C":"U"
              
            }
            sendParam.push(data);
          }
        })
      })

      const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnWorkCalendarDetail',
            sendParam: sendParam,
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
    },
    undoBtn(){
      this.gridData = JSON.parse(JSON.stringify(this.gridOriData));
    },


    // excel다운로드
    excel() {
      this.getPivotExcel(
        this.headerParam,
        this.gridData,
        this.$i18n.t("MES_CommLang.MES_CommLang_00615").concat(this.currentTimeStamp())
      );
    }


    
  },
  
}

</script>