<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00588") }}</li> <!-- 품목별C/T관리 -->
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
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="processValue"
                        @change="selectProcessType"
                      >
                    </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                      <DropDownList
                        ref="cmbEquipmentType"
                        :style="{ width: '250px' }"
                        :data-items="equipmentList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :allYN="true"
                        :value="equipmentValue"
                        @change="selectEquipmentType"
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
                  :columns="headerParam.gridHeader"
                  :selected-field="selectedField"
                  :isPaging="true"
                  :scrollable="true"
                  :reSetPage="this.reSetPage"
                  @pageChangeEvent="pageChangeEvent"      
                />
                </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";


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
    KendoGrid,
    DropDownList,
  },
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      selectedField: "selected",
      headerParam: {
        gridid: "dgvProductCycleTimeHistory", // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noRowstat: true,
        noFirstCheck: true,
      },
      processId: '', 
      equipmentId: '',
      processList: [], // 공정명 콤보박스 
      equipmentList: [], // 설비명 콤보박스
      processValue: '',
      equipmentValue: '',
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    await this.getProcessListData();
    await this.getEquipmentListData();
  },
  computed: {

  },
  watch: {},
  methods: {

    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },

    // 조회 버튼 클릭
    searchBtn(){
      this.reSetPage = true;
      this.getGridData();
    },



    // 공정명 콤보 데이터 가져오기
    async getProcessListData() {
        this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProcessList',
        queryVersion: '00001',
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
          }
        }
        this.processValue = this.processList[0].id;
        // 선택한 공정명 데이터 가져오기
        this.getEquipmentListData(this.processValue);
      });
    }, 

    // 설비명 콤보 데이터 가져오기
    async getEquipmentListData(res) {
      this.equipmentList = [{id:'', text:'전체'}];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetOMProcessAvailableEquipment',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processId: res
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
            this.equipmentList.push({ id : data[i].EQUIPMENTID, text : data[i].EQUIPMENTNAME });
          }
        }
        this.equipmentValue = this.equipmentList[0].id;
      });
    }, 

    selectProcessType(event) {
      this.processValue = event.value;
      this.getEquipmentListData(this.processValue);
    },
    
    selectEquipmentType(event) {
      this.equipmentValue = event.value;
    },

    
    // 그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProductCycleTimeHistoryList',
        queryVersion: '00001',
        sendParam: {
          plantId: this.$auth.$state.user.plantId,
          processId: this.processValue,
          equipmentId: this.equipmentValue,
          skip: skip,
          take: take,
          }
      }).then(({list, paging, ...x}) => {
          const data = list.map((x, idx) => {
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

        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridOriData = data;
        this.gridData = data;
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