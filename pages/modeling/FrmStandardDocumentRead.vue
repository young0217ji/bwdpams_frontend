<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li> <!-- 기준정보 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00679") }}</li> <!-- Lessons & Learned 조회이력 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00630") }}</label> <!-- 표준구분  -->
                      <DropDownList
                        :style="{ width: '250px' }"
                        :data-items="standardCategoryList"
                        :text-field="'ENUMVALUENAME'"
                        :data-item-key="'ENUMVALUE'"
                        :value="standardCategory"
                        @change="selectStandardCategory"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00631") }}</label> <!-- 표준번호 -->
                      <InputText
                        :dataNm="'documentId'"
                        @input-text-set="searchInput"
                      />
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00632") }}</label><!-- 표준명 -->
                      <InputText
                        :dataNm="'documentName'"
                        @input-text-set="searchInput"
                      />
                    </div>
                  </div>
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00681") }}</label><!-- Work Center -->
                      <DropDownList
                        ref="cmbWorkCenter"
                        :style="{ width: '250px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="workCenterValue"
                        @change="selectWorkCenter"
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
                    </div>
                  </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
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
              <v-row>
                  <v-col cols="4" align="left">
                      <CardTitle>&nbsp;</CardTitle><!-- 자격인증관리 -->
                  </v-col>
                  <v-col cols="8" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="showUbiform">{{ $t("MES_CommLang.MES_CommLang_00854") }}</Button> <!-- 출력 -->
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
                :columnMenu="true"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                @pageChangeEvent="pageChangeEvent"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <WindowPop ref="windowPop" :formName="'searchHisReport'"></WindowPop>
    </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '../../components/common/input/InputText.vue';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import WindowPop from '@/components/common/WindowPop';

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
    DropDownList,
    DatePicker,
    MesSelectBox,
    WindowPop,
  },
  data() {
    return {
      columns: [],
      gridHeight : '100px',
      gridHeader: [],
      gridData : [],
      gridPageData: {},
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvStandardDocumentRead", // 그리드 ID
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      reSetPage: false,
      startDate: new Date(),
      endDate: new Date(),
      documentId:'',
      documentName:'',
      workCenterList: [
        {
          text: '전체',
          id: '',
        }
      ],
      workCenterValue: '',
      standardCategory: '',
      standardCategoryList: [
        {
          ENUMVALUENAME: '전체',
          ENUMVALUE: '',
        }
      ],
      hdList: [{
        ctqStartDate: '',
        ctqEndDate: '',
        ctqTxtName:'CTQ문서명',
        ctqSearchCnt: '조회회수',
        ctqJan:'',
        ctqFeb:'',
        ctqMar:'',
        ctqApr:'',
        ctqMay:'',
        ctqJune:'',
        ctqJuly:'',
        ctqAug:'',
        ctqSep:'',
        ctqOct:'',
        ctqNov:'',
        ctqDec:'',
        xData:"1월",
        yData:20
      },
      // column chart용 월별데이터
      {
        xData:"2월",
        yData:20
      },
      {
        xData:"3월",
        yData:20
      },
      {
        xData:"4월",
        yData:20
      },
      {
        xData:"5월",
        yData:20
      },
      {
        xData:"6월",
        yData:20
      },
      {
        xData:"7월",
        yData:20
      },
      {
        xData:"8월",
        yData:20
      },
      {
        xData:"9월",
        yData:20
      },
      {
        xData:"10월",
        yData:20
      },
      {
        xData:"11월",
        yData:20
      },
      {
        xData:"12월",
        yData:20
      }
      
      ],
      
    }
  },
  created() {},
  async mounted() {
    await this.getWorkCenterListData();
    await this.getStandardCategoryList();
  },
  computed: {

  },
  watch: {},
  methods: {
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },

    // ====== 검색조건 ====== 
    // 검색 INPUT 변경 시
    searchInput(nm, val) {
        this[nm] = val;
      },

    // 표준구분 콤보 change
    selectStandardCategory(nm, val) {
      this[nm] = val;
    },

    // WorkCenter 콤보 change
    selectWorkCenter(event) {
      this.workCenterValue = event.value;
    },
    selectStandardCategory(event){
      this.standardCategory = event.value;
    },
  
    // 기간 - 시작일 선택
    selectStartDate(event) {
      this.startDate = event.value;
    },
    
    // 기간 - 종료일 선택
    selectEndDate(event) {
      this.endDate = event.value;
    },
    
    async searchBtn() {
      this.reSetPage = true;
      this.getGridData();
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


    // 표준구분 콤보박스 데이터 가져오기
    async getStandardCategoryList(){
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          enumid: "StandardCategory"
        }
      }).then(res => {
        res.map(x => {
          this.standardCategoryList.push(x);
        })
      });

      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          enumid: "StandardCategoryRead"
        }
      }).then(res => {
        res.map(x => {
          this.standardCategoryList.push(x);
        })
      });
      this.standardCategory = this.standardCategoryList[0];
    },



    // 그리드 데이터 가져오기
    async getGridData() {
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: "mes/common/customquerypaging",
        queryId: "GetStandardDocumentRead",
        sendParam: {
            plantid: this.$auth.$state.user.plantId,
            standardcategory: this.standardCategory.ENUMVALUE,
            documentid: this.documentId,
            documentname: this.documentName,
            workcenter: this.workCenterValue.id,
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
        queryId: 'GetStandardDocumentRead',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          standardcategory: this.standardCategory.ENUMVALUE,
          documentid: this.documentId,
          documentname: this.documentName,
          workcenter: this.workCenterValue.id,
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
        queryId: 'GetStandardDocumentRead',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          standardcategory: this.standardCategory.ENUMVALUE,
          documentid: this.documentId,
          documentname: this.documentName,
          workcenter: this.workCenterValue.id,
          startdate: this.DateToYYYYMMDDString(this.startDate),
          enddate: this.DateToYYYYMMDDString(this.endDate),
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },


    // 레포트 출력
    showUbiform(){
      const datasetList = {};
      const paramList = {};
      const wcList = []; // workCenterList
      const scList = []; // standardCategoryList

      this.hdList[0].ctqStartDate = this.DateToYYYYMMDDString(this.startDate);
      this.hdList[0].ctqEndDate = this.DateToYYYYMMDDString(this.endDate);

      console.log("문서명 :: ",this.standardCategoryList);
      // 표준구분 정보
      for(let i = 0; i < this.standardCategoryList.length; i++){
          if(i < this.standardCategoryList.length){
            if(i != 0) {
              scList.push({idx: i, ctqTxtNm : this.standardCategoryList[i].ENUMVALUENAME});
            }
        }
      }
      
      // workCenter 정보
      for(let j = 0; j < this.workCenterList.length; j++){
          if(j < this.workCenterList.length){
            if(j != 0) {
              const wcText = this.workCenterList[j].text.split(' ');
              wcList.push({idx: j, wcXData : this.workCenterList[j].text, wcYData: j+2, wcText: wcText[0]});
            }
        }
      }

      datasetList.dataset_0 = this.hdList;
      datasetList.dataset_1 = wcList;
      datasetList.dataset_2 = scList;

      this.$refs.windowPop.show(datasetList, paramList);    
    },
  },
}

</script>