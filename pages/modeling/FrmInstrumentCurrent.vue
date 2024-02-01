<template>
    <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00803") }}</li> <!-- 계측기 현황 Report -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="12" :lg="2" align="right">
                <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t("MES_CommLang.MES_CommLang_00277") }} <!-- 조회 -->
                </kbutton>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="10" :lg="12" :style="{ height: '70%' }">
      <v-row :style="{ height: '70%' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }" no-gutters>
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00803") }}</CardTitle>
                    <!-- 계측기 현황 Report-->
                  </v-col>
                </v-row>
                <div ref="divWrapper" style="height: calc(100% - 33px);">
                  <KendoGrid ref="ReportCurrent" 
                  :gridHeight="gridHeight" 
                  :gridItems="gridData" 
                  :sortable="true"
                  :columns="headerParam.gridHeader" 
                  :resizable="false" 
                  :edit-field="'inEdit'" 
                  :isPaging="true"
                  :selected-field="selectedField" 
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-col :style="{ height: '100%' }">
          <v-row :style="{ height: 'calc(100% - 5px)' }">
            <v-col :cols="12" :style="{ height: '100%' }">
              <Card :style="{ height: '100%' }">
                <CardBody :style="{ height: '100%' }">
                  <InstrumentReportRate 
                    ref="InstrumentReportRate" 
                    :gridHeight="gridHeight" />
                </CardBody>
              </Card>
            </v-col>
          </v-row>
        </v-col>
      </v-col>
      </v-row>
    </div>
  </template>
  <script>
  import mixinGlobal from '@/mixin/global.js';
  import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
  import Utility from '~/plugins/utility';
  import KendoGrid from '@/components/common/KendoGrid';
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import InstrumentReportRate from "@/components/FrmInstrumentCurrent/InstrumentReportRate.vue";
  import { Button } from '@progress/kendo-vue-buttons';

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
      kbutton: Button,
      CardBody,
      CardTitle,
      KendoGrid,
      InstrumentReportRate,
    },
    data() {
      return {
        value : {},
        columns: [],
        gridPageData: {},
        gridHeight: "500px",
        selectedField: 'selected',
        gridData: [],
        gridOriData: [],
        headerParam: {
            gridid: 'dgvInstrumentCurrent', // 그리드 ID
            xOverflowYn : true, // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
            gridHeader: [],
            columns: [],
            noFirstCheck: true,
            noRowstat: true,
      },
      reSetPage: false,
      enumData:[]
      };
    },
    created() {
    },
    async mounted() {
      this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
      this.getGridData();
      this.getEnumData();

    },
    computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
  },
    watch: {
      enumData() {
        for(var i = 0; i < this.headerParam.gridHeader.length; i++){
            for(let j = 0; j < this.enumData.length; j++){
              if(this.headerParam.gridHeader[i].field == this.enumData[j].ENUMVALUE){
                this.headerParam.gridHeader[i].title = this.enumData[j].ENUMVALUENAME;
              }
            }
          };
          this.$nuxt.$emit('iccReset');
      }
    },
    methods: {
    //조회버튼 클릭
    searchBtn() {
      this.reSetPage = true;
      this.getGridData();
    },
    //EnumId = ItemType 데이터 가져오기
    async getEnumData(){
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetEnumItemType',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            ENUMID : 'ItemType'
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
          this.enumData = data;
          // for(var i = 0; i < this.headerParam.gridHeader.length; i++){
          //   for(let j = 0; j < this.enumData.length; j++){
          //     if(this.headerParam.gridHeader[i].field == this.enumData[j].ENUMVALUE){
          //       this.headerParam.gridHeader[i].title = this.enumData[j].ENUMVALUENAME;
          //     }
          //   }
          // };
          // this.$nuxt.$emit('iccReset');
        });
    },
    //그리드 데이터 가져오기
    async getGridData() {
        this.gridOriData = [];
        this.gridData = [];
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetInstrumentChart',
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

          this.$nuxt.$emit('iccReset');
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

    },
  };
  const defaultData = {};
  </script>
  
  <style lang="scss">
  .pane-content {
    padding: 10px;
  }
  .dropdown-menu {
    min-width: 1rem !important;
}
  </style>
  