<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li> <!-- 기준정보 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00270") }}</li> <!-- 제품기준정보 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00544") }}</label> <!-- 제품그룹 -->
                    <DropDownList
                      ref="cmbProGroup"
                      :style="{ width: '250px' }"
                      :data-items="productGroup"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="value"
                      @change="selectProGroup"
                      >
                  </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00545") }}</label> <!-- 품번 -->
                    <InputText
                      ref="productid"
                      :dataNm="'productid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</label> <!-- 품명 -->
                    <InputText
                      ref="productName"
                      :dataNm="'productName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00554") }}</label> <!-- User 품명 -->
                    <InputText
                      ref="UserproductName"
                      :dataNm="'UserproductName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
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
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00262") }}</CardTitle> <!-- 제품목록 -->
              </v-col>
              <v-col cols="6" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t("MES_CommLang.MES_CommLang_00414") }}</kbutton
                > <!-- 저장 -->
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcel"
                  >전체EXCEL</kbutton
                >
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcelPaging"
                  >페이지EXCEL</kbutton
                >
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >UNDO</kbutton
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridPageData="gridPageData"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
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
      productid: '', // 품번 검색
      productName: '', // 품명 검색
      UserproductName: '', //User 품명
      productGroupID: '', //제품그룹 콤보박스
      value : {},
      productGroup: [],
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvProductLabel', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
        noFirstCheck: true,
        xOverflowYn : true // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
      },
      gridHeader: [],
      reSetPage: false,
      gridPageData: {}
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    this.getProductGroupData();
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
    // 저장
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      const validate = this.mesValidation(this.gridHeader, this.gridData);
      if (!validate.isValidate) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnProductLabelManagement',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.getGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
        return;
      }
    },
    //그리드 데이터 가져오기
    async getGridData() {
      
      this.gridOriData = [];
      this.gridData = [];
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProductLabel',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          UserproductName: this.UserproductName,
          productGroupID: this.$refs['cmbProGroup'].value.id,
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
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetProductLabel',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          UserproductName: this.UserproductName,
          productGroupID: this.$refs['cmbProGroup'].value.id,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
        },
      });
    },
    getExcelPaging() {
      const {skip=0, take=20} = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetProductLabel',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          UserproductName: this.UserproductName,
          productGroupID: this.$refs['cmbProGroup'].value.id,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },
    // 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {
      
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProductGroupList',
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
            this.productGroup.push({ id : data[i].PRODUCTGROUPID, text : data[i].PRODUCTGROUPNAME });
            this.value = this.productGroup[0];
          }
        }
      });
    },

    //unbo 버튼 클릭
    undoBtn() {
            this.gridData = this.gridOriData.filter(x => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
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
    /* sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['PRODUCTQUANTITY', 'ESTIMATEDCYCLETIME'],
        ['ACTIVESTATE']
      );
    }, */
  },
};

const defaultData = {};
</script>
<style>
.dropdown-menu {
    min-width: 1rem !important;
}
</style>
