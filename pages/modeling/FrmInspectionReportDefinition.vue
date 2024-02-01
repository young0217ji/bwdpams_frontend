<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00561") }}</li> <!-- 검사성적서 기준정보 관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00542") }}</label> <!-- 제품그룹명 -->
                    <DropDownList ref="cmbProGroup" :style="{ width: '250px' }" :data-items="productGroup"
                      :text-field="'text'" :data-item-key="'id'" :value="value" @change="selectProGroup">
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00264") }}</label> <!-- 제품구분 -->
                    <MesSelectBox :enumID="'ProductionType'" :allYN="true" :dataNm="'ProductionType'"
                      @comboChange="comboChange"></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00259") }}</label> <!-- 제품ID -->
                    <InputText ref="productid" :dataNm="'productid'" :disabled="false" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00260") }}</label> <!-- 제품명 -->
                    <InputText ref="productName" :dataNm="'productName'" :disabled="false" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t("MES_CommLang.MES_CommLang_00277") }}</kbutton> <!-- 조회 -->
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
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00585") }}</CardTitle> <!-- 검사성적서 목록 -->
              </v-col>
              <v-col cols="6" align="right">
                <kbutton :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                  $t("MES_CommLang.MES_CommLang_00414") }}</kbutton> <!-- 저장 -->
                <kbutton :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO</kbutton>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)', width: '100%' }">
              <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                :columns="headerParam.columns" :resizable="false" :edit-field="'inEdit'"  :gridPageData="gridPageData" :selected-field="selectedField"
                :gridDropDownList="enumComboBox" :checkHeaderArr="checkBox" :groupable="true" :reorderable="true"
                :columnMenu="true" :isPaging="true" :scrollable="true" :changeCell="changeCell"
                :reSetPage="this.reSetPage" @selectionchange="onSelectionchange" @gridrowclick="onRowClick"
                @griditemchange="griditemchange" @gridButtonClick="gridButtonClick" />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <SelectProductModal ref="SelectProductModal" v-if="SelectProductModalVisible"
      :visibleDialog="SelectProductModalVisible" :gridData="SelectProductGridData" :title="productModalTitle"
      :selected-field="selectedField" @visibleDialog="val => (SelectProductModalVisible = val)"
      @selectedRow="selectedRow" />
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
import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';

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
    DropDownList,
    SelectProductModal
  },
  props: {},
  data() {
    return {
      productid: '', // 제품ID 검색
      productName: '', // 제품명 검색
      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스
      value: {},
      productGroup: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      // checkHeaderArr: ['ACTIVESTATE'],
      headerParam: {
        // gridid: 'dgvProductDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        xOverflowYn: true, // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
        columns: [
          { field: 'rowStat', editable: false, title: " ", width: '70px', cell: "crudCellTemplate", className: "gridTextCenter" },
          { field: 'PRODUCTID', title: '', resizable: 'false', width: '120px', editable: false, PRIMARYKEYFLAG: "Yes" },
          { field: 'PRODUCTNAME', title: '', resizable: 'false', width: '220px', editable: false },
          { field: 'ENDPRODUCTID', title: '', resizable: 'true', width: '120px', editable: false },
          { field: 'ENDPRODUCTBUTTON', title: '', resizable: 'true', width: '60px', cell: 'ENDPRODUCTBUTTON' },
          { field: 'ENDPRODUCTNAME', title: '', resizable: 'true', width: '220px', editable: false },
          { field: 'USERPRODUCTID', title: '', resizable: 'true', width: '120px' },
          {
            title: '', children: [
              { field: 'APPEARN', title: '', resizable: 'true', width: '80px' },
              { field: 'WORKABILITY', title: '', width: '80px' },
              { field: 'PROOF_TEST', title: '', width: '80px' },
              { field: 'INTERNAL_LEAKAGE', title: '', width: '80px' },
              { field: 'EXTERNAL_LEAKAGE', title: '', width: '80px' },
              { field: 'MIN_OPER_PRESS', title: '', width: '80px' },
              { field: 'WELDING', title: '', width: '80px' },
              { field: 'ROD_SURFACE', title: 'ROD 표면', width: '90px' },
              { field: 'THREAD', title: 'ROD 방향', width: '90px' },
              {
                title: 'Stroke', children: [
                  { field: 'STROKE_BASE', title: '기준', width: '50px' },
                  { field: 'STROKE_UPPER', title: 'U', width: '40px' },
                  { field: 'STROKE_LOWER', title: 'L', width: '40px' }
                ]
              },
              { field: 'MARK_POINT', title: '타각위치', width: '80px' },
            ]
          },
          {
            title: '도면 Spec', children: [
              {
                title: 'H/C 내경치수', children: [
                  { field: 'HC_INSIDE_DIA_BASE', title: '기준', width: '50px' },
                  { field: 'HC_INSIDE_DIA_UPPPER', title: 'U', width: '40px' },
                  { field: 'HC_INSIDE_DIA_LOWER', title: 'L', width: '40px' },
                ]
              },
              {
                title: 'H/C 이면폭', children: [
                  { field: 'HC_SIDTH_BASE', title: '기준', width: '50px' },
                  { field: 'HC_SIDTH_UPPER', title: 'U', width: '40px' },
                  { field: 'HC_SIDTH_LOWER', title: 'L', width: '40px' },
                ]
              },
              {
                title: 'K/C 내경치수', children: [
                  { field: 'KC_INSIDE_DIA_BASE', title: '기준', width: '50px' },
                  { field: 'KC_INSIDE_DIA_UPPPER', title: 'U', width: '40px' },
                  { field: 'KC_INSIDE_DIA_LOWER', title: 'L', width: '40px' },
                ]
              },
              {
                title: 'K/C 이면폭', children: [
                  { field: 'KC_SIDTH_BASE', title: '기준', width: '50px' },
                  { field: 'KC_SIDTH_UPPER', title: 'U', width: '40px' },
                  { field: 'KC_SIDTH_LOWER', title: 'L', width: '40px' },
                ]
              },
              {
                title: '최축장', children: [
                  { field: 'CLOSED_LENTH_BASE', title: '기준', width: '50px' },
                  { field: 'CLOSED_LENTH_UPPER', title: 'U', width: '40px' },
                  { field: 'CLOSED_LENTH_LOWER', title: 'L', width: '40px' },
                ]
              },
              {
                title: 'ROD 돌출', children: [
                  { field: 'LENGTH_RC_TO_KC_BASE', title: '기준', width: '50px' },
                  { field: 'LENGTH_RC_TO_KC_UPPER', title: 'U', width: '40px' },
                  { field: 'LENGTH_RC_TO_KC_LOWER', title: 'L', width: '40px' },
                ]
              },
            ]
          },
          { field: 'DESCRIPTION', title: '불량이력', resizable: 'true', width: '120px' },
        ],
      },
      changeCell: [
        {
          cellName: 'ENDPRODUCTBUTTON',
          upperCell: '',
          condition: false,
          dataItem: [],
        },
      ],
      reSetPage: false,
      gridPageData: {},
      // customCell: [ 'ENDPRODUCTBUTTON'],
      enumComboBox: [],
      checkBox: [],
      SelectProductModalVisible: false,
      productModalTitle: '',
      reSetPage: false,
      btnClickIdx: '',
      oriEndProductID: '',
      oriEndProductName: '',
    };
  },
  created() { },
  async mounted() {
    this.productModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00262'); /* 품번목록 */
    this.setColumnTitle();
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    this.getProductGroupData();
    this.getGridData();

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

      const validate = this.mesValidation(this.headerParam.columns, this.gridData);
      if (!validate.isValidate) {
        console.log('abc');
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
        return;
      }

      for (let i = 0; i < saveData.length; i++) {
        if (saveData[i].USERPRODUCTID == null || saveData[i].USERPRODUCTID == '') {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), 'User품번은 필수 압력 값입니다.'); /* 알림,  */
          return;
        }
      }


      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnInspectionReportDefinition',
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
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetInspectionReportDef',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          ProductionType: this.ProductionType,
          productGroupID: this.$refs['cmbProGroup'].value.id,
          skip: skip,
          take: take,
        },
      }).then(({ list, paging, ...x }) => {

        const data = list.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
            // cell: 'Button',
            changeCellType: 'button',
            ENDPRODUCTBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
            // change: false,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridOriData = data;
        this.gridData = data;
      });
    },
    async pageChangeEvent(skip = 0, take = 20) {
            this.gridPageData = {
                skip: skip,
                take: take
            }
            this.reSetPage = false;
            this.getGridData();

        },
    // 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {
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
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.productGroup.push({ id: data[i].PRODUCTGROUPID, text: data[i].PRODUCTGROUPNAME });
            this.value = this.productGroup[0];
          }
        }
      });
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      console.log('aaa');
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      console.log(idx)
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }
      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    selectProGroup(event) {
      this.value = event.value;
    },

    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
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

    //검색버튼 선택
    selectedRow(row) {
      console.log('dd', row);

      // this.gridData.map(x => {
      //   if(this.btnClickIdx == x.idx){
      //     x.ENDPRODUCTID = row.PRODUCTID;        
      //     x.ENDPRODUCTNAME = row.PRODUCTNAME;        
      //   }
      // });

      this.gridData = this.gridData.map(item => {
        return {
          ...item,
          ENDPRODUCTID: item.idx === this.btnClickIdx ? row.PRODUCTID : item.ENDPRODUCTID,
          ENDPRODUCTNAME: item.idx === this.btnClickIdx ? row.PRODUCTNAME : item.ENDPRODUCTNAME,
        };
      });
      if (this.gridData[this.btnClickIdx] != this.gridOriData[this.btnClickIdx]) {
        this.gridData[this.btnClickIdx].rowStat = 'U';
      }

      console.log('ori', this.gridOriData);
      console.log('now', this.gridData);
    },
    //그리드 버튼 클릭 
    gridButtonClick(e, field, dataItem) {
      console.log(e);
      console.log(field);
      console.log(dataItem);
      if (field === 'ENDPRODUCTBUTTON') {
        this.SelectProductGridData = this.gridData.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickIdx = dataItem.idx;
        this.SelectProductModalVisible = true;
      }
    },

    // 컬럼이름 새팅
    setColumnTitle() {
      console.log('컬럼', this.headerParam.columns);
      this.headerParam.columns[1].title = this.$i18n.t('MES_CommLang.MES_CommLang_00258'); /* 품번 */
      this.headerParam.columns[2].title = this.$i18n.t('MES_CommLang.MES_CommLang_00260'); /* 품번명 */
      this.headerParam.columns[3].title = this.$i18n.t('MES_CommLang.MES_CommLang_00562'); /* 기종품번 */
      this.headerParam.columns[4].title = this.$i18n.t('MES_CommLang.MES_CommLang_00042'); /* 검색 */
      this.headerParam.columns[5].title = this.$i18n.t('MES_CommLang.MES_CommLang_00563'); /* 기종명 */
      this.headerParam.columns[6].title = this.$i18n.t('MES_CommLang.MES_CommLang_00564'); /* User품번 */
      this.headerParam.columns[7].title = this.$i18n.t('MES_CommLang.MES_CommLang_00565'); /* 검사항목 */
      this.headerParam.columns[7].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00566'); /* 외관상태 */
      this.headerParam.columns[7].children[1].title = this.$i18n.t('MES_CommLang.MES_CommLang_00567'); /* 작동시험 */
      this.headerParam.columns[7].children[2].title = this.$i18n.t('MES_CommLang.MES_CommLang_00568'); /* 내압 */
      this.headerParam.columns[7].children[3].title = this.$i18n.t('MES_CommLang.MES_CommLang_00569'); /* 내부누유 */
      this.headerParam.columns[7].children[4].title = this.$i18n.t('MES_CommLang.MES_CommLang_00570'); /* ROD누유 */
      this.headerParam.columns[7].children[5].title = this.$i18n.t('MES_CommLang.MES_CommLang_00571'); /* 최저작동 */
      this.headerParam.columns[7].children[6].title = this.$i18n.t('MES_CommLang.MES_CommLang_00572'); /* 용접부 */
      this.headerParam.columns[7].children[7].title = this.$i18n.t('MES_CommLang.MES_CommLang_00573'); /* ROD 표면 */
      this.headerParam.columns[7].children[8].title = this.$i18n.t('MES_CommLang.MES_CommLang_00574'); /* ROD 방향 */
      this.headerParam.columns[7].children[9].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00575'); /* 기준 */
      this.headerParam.columns[7].children[10].title = this.$i18n.t('MES_CommLang.MES_CommLang_00576'); /* 타각위치 */
      this.headerParam.columns[8].title = this.$i18n.t('MES_CommLang.MES_CommLang_00577'); /* 도면 Spec */
      this.headerParam.columns[8].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00578'); /* H/C 내경치수 */
      this.headerParam.columns[8].children[0].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00575'); /* 기준 */
      this.headerParam.columns[8].children[1].title = this.$i18n.t('MES_CommLang.MES_CommLang_00579'); /* H/C 이면폭 */
      this.headerParam.columns[8].children[1].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00575'); /* 기준 */
      this.headerParam.columns[8].children[2].title = this.$i18n.t('MES_CommLang.MES_CommLang_00580'); /* K/C 내경치수 */
      this.headerParam.columns[8].children[2].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00575'); /* 기준 */
      this.headerParam.columns[8].children[3].title = this.$i18n.t('MES_CommLang.MES_CommLang_00581'); /* K/C 이면폭 */
      this.headerParam.columns[8].children[3].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00575'); /* 기준 */
      this.headerParam.columns[8].children[4].title = this.$i18n.t('MES_CommLang.MES_CommLang_00582'); /* 최축장 */
      this.headerParam.columns[8].children[4].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00575'); /* 기준 */
      this.headerParam.columns[8].children[5].title = this.$i18n.t('MES_CommLang.MES_CommLang_00583'); /* ROD 돌출 */
      this.headerParam.columns[8].children[5].children[0].title = this.$i18n.t('MES_CommLang.MES_CommLang_00575'); /* 기준 */
      this.headerParam.columns[9].title = this.$i18n.t('MES_CommLang.MES_CommLang_00584'); /* 불량이력 */
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
