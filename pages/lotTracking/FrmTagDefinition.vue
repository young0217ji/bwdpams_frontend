<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00665") }}</li> <!-- 공정관리 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00853") }}</li> <!-- 설비 Tag 정보 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                  
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <kbutton
                    :theme-color="'primary'"
                    :size="'medium'"
                    :icon="'search'"
                    @click="searchBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00277") }}</kbutton 
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
              <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00853") }}</CardTitle> <!-- 설비 Tag 정보 -->
                </v-col>
                <v-col cols="6" align="right">

                </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :gridPageData="gridPageData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="headerParam.enumComboBox"
                  :checkHeaderArr="headerParam.checkBox"
                  :isPaging="true"
                  :reSetPage="this.reSetPage"
                  @pageChangeEvent="pageChangeEvent"
                  @selectionchange="onSelectionchange"
                  @gridrowclick="onRowClick"
                  @gridddchang="rowDdChange"
                  @griditemchange="griditemchange"
                  @headerselectionchange="onHeaderSelectionChange"
                  @sortChangeHandler="sortChangeHandler"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    </div>
  </template>
  <script>
  import mixinGlobal from '@/mixin/global.js';
  import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
  import Utility from '~/plugins/utility';
  import KendoGrid from '@/components/common/KendoGrid';
  import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
  import InputText from '@/components/common/input/InputText';
  import MesSelectBox from '@/components/common/select/MesSelectBox';
  import { Button } from '@progress/kendo-vue-buttons';
  import { DropDownList } from "@progress/kendo-vue-dropdowns";
  
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
      InputText,
      MesSelectBox,
      Utility,
      Card,
      kbutton: Button,
      CardBody,
      CardTitle,
      KendoGrid,
      DropDownList
    },
    data() {
      return {
        productid: '', // 제품ID 검색
        productName: '', // 제품명 검색
        ProductionType: '', //제품구분 콤보박스
        productGroupID: '', //제품그룹 콤보박스
        value : {},
        productGroup: [],
        columns: [],
        gridHeight: '100px',
        gridData: [],
        gridPageData: {},
        gridOriData: [],
        gridLastModIdx: null,
        selectedField: 'selected',
        // checkHeaderArr: ['ACTIVESTATE'],
        headerParam: {
          gridid: 'dgvTagDefinition', // 그리드 ID
          rowStat: '', //rowStat 표시 여부
          enumComboBox: [],
          checkBox: [],
          xOverflowYn : false // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
        },
        gridHeader: [],
        reSetPage: false,
      };
    },
    created() {},
    async mounted() {
      this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
      this.getGridData();
  
      // await this.getGridComboList();
    },
    computed: {
      areAllSelected() {
        return (
          this.gridData.findIndex(x => x.checked === false) === -1 &&
          this.gridData.length !== 0
        );
      },
    },
    watch: {},
    methods: {
      onRowClick(event) {
        const selectedIdx = event.dataItem.idx;
        this.gridData = this.gridData.map(item => {
          return {
            ...item,
            selected: item.idx === selectedIdx ? !item.selected : item.selected,
          };
        });
        this.selected = event.dataItem;
      },
      notPageReset(flag) {
        // flag : false
        this.reSetPage = flag;
      },
      // 조회
      searchBtn() {
        this.reSetPage = true;
        this.getGridData();
      },
  
      //unbo 버튼 클릭
      undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
      },
      
      
      //그리드 데이터 가져오기
      async getGridData() {
        
        // this.gridOriData = [];
        // this.gridData = [];
        const {skip=0, take=20} = this.gridPageData;
        this.mesGet({
          apiKey: 'mes/common/customquerypaging',
          queryId: 'GetTagDefinition',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
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
              inEdit: true,
              newRow: false,
              resizable: true,
            };
          });
          
          //GIRD input v-model초기화, chkbox초기화 위해 추가
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
     
      //맨앞 checkBox 클릭
      onSelectionchange(event) {
        event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      },
      //header checkbox 클릭
      onHeaderSelectionChange(event) {
        let checked = event.event.target.checked;
        this.gridData = this.gridData.map(item => {
          return { ...item, selected: checked };
        });
      },
      //그리드 인풋 제외 데이터 변경시
      rowDdChange(e, name, dataItem) {
        const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
        const data = JSON.parse(JSON.stringify(this.gridData));
  
        if (name === 'ACTIVESTATE') {
          e.value = e.value ? 'Active' : 'Inactive';
        }
  
        data[idx] = { ...data[idx], [name]: e.value };
        if (data[idx].rowStat === 'N') {
          data[idx].rowStat = 'U';
        }
        if (
          data[idx].rowStat === 'U' &&
          !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
        ) {
          data[idx].rowStat = 'N';
        }
  
        this.gridData = data;
      },
      //그리드 인풋 데이터 변경시
      griditemchange(e) {
        const data = JSON.parse(JSON.stringify(this.gridData));
        const idx = data.findIndex(x => x.idx === e.dataItem.idx);
        data[idx] = { ...data[idx], [e.field]: e.value };
        if (data[idx].rowStat === 'N') {
          data[idx].rowStat = 'U';
        }
        if (
          data[idx].rowStat === 'U' &&
          !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
        ) {
          data[idx].rowStat = 'N';
        }
  
        this.gridData = data;
      },
      selectProGroup(event) { 
        this.value = event.value;
      },
  
      //검색 인풋 변경시
      searchInput(nm, val) {
        this[nm] = val;
      },
      comboChange(nm, val) {
        this[nm] = val;
      },
      chkVal(nm, val) {
        this[nm] = val ? 'Yes' : '';
      },
      sortChangeHandler(e) {
        this.gfn_sortChangeHandler(
          this.gridData,
          e,
          ['PRODUCTQUANTITY', 'ESTIMATEDCYCLETIME'],
          ['ACTIVESTATE']
        );
      },
    },
  };
  
  const defaultData = {};
  </script>
  <style>
  .dropdown-menu {
      min-width: 1rem !important;
  }
  </style>
  