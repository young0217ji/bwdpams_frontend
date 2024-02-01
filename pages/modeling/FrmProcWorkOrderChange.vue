<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00900") }}</li> <!-- 계획 변경 현황 -->
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
                          :style="{ width: '240px' }"
                          :data-items="workCenterList"
                          :text-field="'text'"
                          :data-item-key="'id'"
                          :value="workCenterValue"
                          @change="workCenterChange"
                          >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                      <DropDownList
                      ref="cmbEquipmentType"
                      :style="{ width: '240px' }"
                      :data-items="equipmentList"
                      :text-field="'EQUIPMENTNAME'"
                      :data-item-key="'EQUIPMENTID'"
                      :value="equipmentValue"
                      @change="selectEquipmentCombo"
                      />
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00901") }}</label> <!-- 메뉴타입 -->
                      <DropDownList
                      ref="cmbMenuType"
                      :style="{ width: '240px' }"
                      :data-items="menuTypeList"
                      :text-field="'EQUIPMENTNAME'"
                      :data-item-key="'EQUIPMENTID'"
                      :value="menuTypeValue"
                      @change="selectMenuTypeCombo"
                      />
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00141") }}</label> <!-- 사유 -->
                      <Input 
                        ref="description" 
                        v-model="this.description"
                        :dataNm="'description'" 
                        :disabled="false" 
                        :readonly="true"
                        :searchOption="true" 
                        :searchFunc="searchBtn"
                      />
                        <Button :theme-color="'primary'" @click="SelectReasonCodeListVisible = true">{{
                          $t("MES_CommLang.MES_CommLang_00169")
                        }}</Button> <!-- 선택 -->
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
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
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
      <ReasonCodeModal
        ref="SelectReasonCodeList"
        v-if="SelectReasonCodeListVisible"
        :visibleDialog="SelectReasonCodeListVisible"
        @visibleDialog="val => (SelectReasonCodeListVisible = val)"
        @selectedRow="selectedRow"
      />
    </div>

</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import InputText from '@/components/common/input/InputText';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from '@progress/kendo-vue-inputs';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import ReasonCodeModal from "@/components/frmProcWorkOrderChange/ReasonCodeModal.vue";

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
    InputText,
    Input,
    DropDownList,
    DatePicker,
    ReasonCodeModal, // 사유코드 팝업
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
        gridid: "dgvProcWorkOrderChange", // 그리드 ID
        gridHeader: [],
        rowStat: '', //rowStat 표시 여부
        noRowstat: true,
        noFirstCheck: true,
        xOverflowYn: true,
      },
      workCenterList: [
        {
          text: '전체',
          id: '',
        }
      ],
      workCenterValue:'',
      equipmentList: [],
      equipmentValue: '',
      menuTypeList: [],
      menuTypeValue: '',
      reasonCode: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      SelectReasonCodeListVisible: false,
      reSetPage: false,  



    };
  },
  created() {},
  async mounted() {
    await this.getWorkCenterListData(); // WorkCenter 콤보 
    await this.getEquipmentListData(); // 설비 콤보

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

    // WorkCenter 콤보 change
    workCenterChange(event) {
      this.workCenterValue = event.value;
    },

    // 설비 Combobox 선택
    selectEquipmentCombo(event) {
      this.equipmentValue = event.value;
    },


    // 메뉴 콤보 change
    selectMenuTypeCombo(event) {
      this.menuTypeValue = event.value;
    },

    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.endDate = event.value;
    },


    toggleDialog() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },


    // 사유코드 선택
    selectedRow(data) {
      this.reasonCode = data.REASONCODE;
      this.description = data.DESCRIPTION;

    },

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
            this.workCenterList.push({ id : data[i].CODE, text : data[i].NAME });
            this.workCenterValue = this.workCenterList[0];
          }
        }
      });
    },


    // 설비 Combobox
    async getEquipmentListData(res) {
        this.mesGet({
            apiKey: 'mes/common/getqueryresult',
            queryId: 'GetOMProcessAvailableEquipment',
            sendParam: {
            plantid: this.$auth.$state.user.plantId,
            processId: res
            },
        }).then(res => {
            this.equipmentList = res;
            this.equipmentValue = this.equipmentList[0];
        });
    },

    // 그리드 데이터 가져오기
    async getGridData() {
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: "mes/common/customquerypaging",
        queryId: "GetProcWorkOrderChangeList",
        sendParam: {
            plantid: this.$auth.$state.user.plantId,
            workcenter: this.workCenterValue.id,
            equipmentId: this.equipmentValue.EQUIPMENTID,
            // menuType: this.menuTypeValue,
            reasonCode: this.reasonCode,
            startdate: this.DateToYYYYMMDDString(this.startDate),
            enddate: this.DateToYYYYMMDDString(this.endDate),
            skip: skip,
            take: take,
        },
        }).then(({list, paging, ...x}) => {
        const data = list.map((x, idx) => {
            return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            };
        });
        this.$nuxt.$emit("iccReset");
        this.gridPageData = paging;
        this.gridData = data;
        this.gridOriData = data;
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
        queryId: 'GetProcWorkOrderChangeList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          workcenter: this.workCenterValue.id,
          equipmentId: this.equipmentValue.EQUIPMENTID,
          // menuType: this.menuTypeValue,
          reasonCode: this.reasonCode,
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
        queryId: 'GetProcWorkOrderChangeList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          workcenter: this.workCenterValue.id,
          equipmentId: this.equipmentValue.EQUIPMENTID,
          // menuType: this.menuTypeValue,
          reasonCode: this.reasonCode,
          startdate: this.DateToYYYYMMDDString(this.startDate),
          enddate: this.DateToYYYYMMDDString(this.endDate),
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },




  }

}


</script>