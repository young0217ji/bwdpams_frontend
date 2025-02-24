<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00175') }}</li>
      <!-- 설비관리 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00621') }}</li>
      <!-- 예비품 입/출고관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group" style="margin-left: -5px">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00622') }}</label>
                    <!-- 예비품 코드 -->
                    <InputText
                      ref="sparePartId"
                      :boxWidth="'85%'"
                      :dataNm="'sparePartId'"
                      :disabled="false"
                      :defaultValue="sparePartId"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group" style="margin-left: -50px">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00623') }}</label>
                    <!-- 예비품명 -->
                    <InputText
                      ref="sparePartName"
                      :boxWidth="'85%'"
                      :dataNm="'sparePartName'"
                      :disabled="false"
                      :defaultValue="sparePartName"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  icon="search"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}</Button
                >
                <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="10" :lg="12" :style="{ height: '100%' }">
        <v-row :style="{ height: 'calc(50% - 5px)' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }" no-gutters>
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{
                      $t('MES_CommLang.MES_CommLang_00624')
                    }}</CardTitle>
                    <!-- 재고현황 -->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button
                      :theme-color="'primary'"
                      :size="'small'"
                      icon="add"
                      @click="add"
                      >{{ $t('MES_CommLang.MES_CommLang_00215') }}</Button
                    >
                    <!-- 입고 -->
                    <Button
                      ref="release"
                      :theme-color="'secondary'"
                      :size="'small'"
                      :icon="'delete'"
                      @click="release"
                    >
                      {{ $t('MES_CommLang.MES_CommLang_00625') }}</Button
                    ><!-- 출고 -->
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
                  </v-col>
                </v-row>
                <div ref="divWrapper1" style="height: calc(100% - 33px)">
                  <KendoGrid
                    ref="MaterialStatus"
                    :gridHeight="gridHeight"
                    :gridItems="gridDataMaterialStock"
                    :sortable="true"
                    :gridPageData="gridPageData"
                    :columns="MaterialStatusHeaderParam.gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :selected-field="selectedField"
                    @pageChangeEvent="pageChangeEvent"
                    @gridrowclick="MaterialStockRowClick"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row
          :style="{ margin: '10px 0 0 0', height: 'calc(50% - 5px)' }"
          no-gutters
        >
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{
                      $t('MES_CommLang.MES_CommLang_00626')
                    }}</CardTitle>
                    <!-- 입/출고이력 -->
                  </v-col>
                  <v-col cols="6" align="right">
                    <kbutton
                      :theme-color="'secondary'"
                      :size="'small'"
                      @click="getExcelBottom"
                      >전체EXCEL</kbutton
                    >
                    <kbutton
                      :theme-color="'secondary'"
                      :size="'small'"
                      @click="getExcelPagingBottom"
                      >페이지EXCEL</kbutton
                    >
                  </v-col>
                </v-row>
                <div ref="divWrapper2" style="height: calc(100% - 33px)">
                  <KendoGrid
                    ref="MaterialStockHistory"
                    :gridHeight="gridHeight"
                    :gridItems="gridDataMaterialStockHistory"
                    :sortable="true"
                    :columns="materialStockHistoryParam.gridHeader"
                    :resizable="false"
                    :gridPageData="gridPageData"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :selected-field="selectedField"
                    @pageChangeEventBotton="pageChangeEventBotton"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <SparePartModal
      ref="SparePartModal"
      v-if="sparePartModalVisible"
      :visibleDialog="sparePartModalVisible"
      :gridData="sparePartGridData"
      :title="sparePartModalTitle"
      :selected-field="selectedField"
      @visibleDialog="val => (sparePartModalVisible = val)"
      @selectedRow="selectedRow"
    />

    <Warehousing
      ref="WarehousingModal"
      v-if="WarehousingModalVisible"
      :visibleDialog="WarehousingModalVisible"
      :title="WarehousingTitle"
      :workType="workType"
      @MaterialStockSaveData="MaterialStockSaveData"
      @visibleDialog="val => (WarehousingModalVisible = val)"
      :selectedMaterialId="selectedMaterialId"
      :selectedMaterialName="selectedMaterialName"
      :selectedWarehouseId="selectedWarehouseId"
      :selectedWarehouseName="selectedWarehouseName"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import WorkerGroup from '@/components/frmEquipmentWorker/WorkerGroup';
import InputText from '@/components/common/input/InputText';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import SparePartModal from '@/components/frmSparePart/SparePartModal.vue';
import Warehousing from '@/components/frmMatMgmt/Warehousing.vue';

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
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
    KendoGrid,
    WorkerGroup,
    InputText,
    CardTitle,
    DropDownList,
    SparePartModal,
    Warehousing,
    kbutton: Button,
  },
  data() {
    return {
      gridHeight: '100px',
      columns: [],
      gridDataMaterialStock: [],
      gridDataMaterialStockHistory: [],
      selectedField: 'selected',
      reSetPage: false,
      sparePartModalVisible: false,
      WarehousingModalVisible: false,
      WarehousingTitle: '',
      workType: '',
      sparePartId: '',
      sparePartName: '',

      selectedMaterialId: '',
      selectedMaterialName: '',
      selectedWarehouseId: '',
      selectedWarehouseName: '',

      MaterialStatusHeaderParam: {
        gridid: 'dgvMaterialManagement', // 그리드 ID
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      materialStockHistoryParam: {
        gridid: 'dgvMaterialManagementHistory', // 그리드 ID
        rowStat: '',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      gridPageData: {},
    };
  },
  created() {},
  async mounted() {
    this.sparePartModalTitle = this.$i18n.t(
      'MES_CommLang.MES_CommLang_00595'
    ); /* 예비품 선택/등록 */
    this.WarehousingTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00215'); //입고
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(
      this.MaterialStatusHeaderParam,
      this.$refs.divWrapper1
    );
    await this.getHeaderMulti(
      this.materialStockHistoryParam,
      this.$refs.divWrapper2
    );
    await this.getMaterialStockGridData();
    await this.getMaterialStockGridDataHistory();
  },
  computed: {},
  watch: {},
  methods: {
    MaterialStockRowClick(event) {
      this.selectedMaterialId = event.dataItem.MATERIALID;
      this.selectedMaterialName = event.dataItem.SPAREPARTNAME;
      this.selectedWarehouseId = event.dataItem.WAREHOUSEID;
      this.selectedWarehouseName = event.dataItem.WAREHOUSENAME;
      this.gridDataMaterialStock.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.getMaterialStockGridDataHistory(
        this.selectedWarehouseId,
        this.selectedMaterialId
      );
    },

    // 재고현황 그리드 데이터 가져오기
    async getMaterialStockGridData() {
      this.gridDataMaterialStock = [];
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetMaterialStockManagement',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          MATERIALID: this.sparePartId,
          MATERIALNAME: this.sparePartName,
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
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridDataMaterialStock = data;
      });
    },
    // 입출고 이력 그리드 데이터 불러오기
    async getMaterialStockGridDataHistory(warehouse, material) {
      this.gridDataMaterialStockHistory = [];
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetMaterialStockManagementHistory',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          MATERIALID: material,
          WAREHOUSEID: warehouse,
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
            EVENTNAME:
              x.EVENTNAME == 'TxnMaterialInput'
                ? this.$i18n.t('MES_CommLang.MES_CommLang_00215')
                : this.$i18n.t(
                    'MES_CommLang.MES_CommLang_00625'
                  ) /* 입고, 출고 */,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridDataMaterialStockHistory = data;
      });
    },
    async searchBtn() {
      this.getMaterialStockGridData();
      this.getMaterialStockGridDataHistory();
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
    add() {
      this.WarehousingModalVisible = true;
      this.WarehousingTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00215'); //입고
      this.workType = 'input';
    },
    async pageChangeEvent(skip = 0, take = 20) {
      this.gridPageData = {
        skip: skip,
        take: take,
      };
      this.reSetPage = false;
      this.getMaterialStockGridData();
    },

    async pageChangeEventBotton(skip = 0, take = 20) {
      this.gridPageData = {
        skip: skip,
        take: take,
      };
      this.reSetPage = false;
      this.getMaterialStockGridDataHistory();
    },
    release() {
      this.WarehousingModalVisible = true;
      this.WarehousingTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00625'); //출고
      this.workType = 'output';
    },
    //자재현황 저장
    MaterialStockSaveData(data) {
      this.saveWarehousingData(data);
    },
    //입출고 저장
    saveWarehousingData(clickData) {
      if (this.workType == 'input') {
        if (clickData[0].length > 0) {
          this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnMaterialInput',
            sendParam: clickData[0],
          }).then(result => {
            this.$nextTick(() => {
              if (
                result.returncode !== undefined &&
                result.returncode === '0'
              ) {
                this.$refs.alertPop.show(
                  this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
                  this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
                ); /* 알림, 저장되었습니다. */
                this.WarehousingModalVisible = false;
                this.gridDataMaterialStock = [];
                this.getMaterialStockGridData();
                this.getMaterialStockGridDataHistory();
              } else {
                this.$refs.alertPop.show(
                  'ERROR : ' + result.code,
                  result.message
                );
              }
            });
          });
        }
      } else if (this.workType == 'output') {
        if (clickData[0].length > 0) {
          this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnMaterialOutput',
            sendParam: clickData[0],
          }).then(result => {
            this.$nextTick(() => {
              if (
                result.returncode !== undefined &&
                result.returncode === '0'
              ) {
                this.$refs.alertPop.show(
                  this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
                  this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
                ); /* 알림, 저장되었습니다. */
                this.WarehousingModalVisible = false;
                this.gridDataMaterialStock = [];
                this.getMaterialStockGridData();
                this.getMaterialStockGridDataHistory();
              } else {
                this.$refs.alertPop.show(
                  'ERROR : ' + result.code,
                  result.message
                );
              }
            });
          });
        }
      }
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetMaterialStockManagement',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          MATERIALID: this.sparePartId,
          MATERIALNAME: this.sparePartName,
          gridid: this.MaterialStatusHeaderParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetMaterialStockManagement',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          MATERIALID: this.sparePartId,
          MATERIALNAME: this.sparePartName,
          gridid: this.MaterialStatusHeaderParam.gridid,
          gridqueryversion: '00001',
          skip: skip,
          take: take,
        },
      });
    },
    getExcelBottom() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetMaterialStockManagementHistory',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          MATERIALID: this.selectedMaterialId,
          WAREHOUSEID: this.selectedWarehouseId,
          gridid: this.materialStockHistoryParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPagingBottom() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetMaterialStockManagementHistory',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          MATERIALID: this.selectedMaterialId,
          WAREHOUSEID: this.selectedWarehouseId,
          gridid: this.materialStockHistoryParam.gridid,
          gridqueryversion: '00001',
          skip: skip,
          take: take,
        },
      });
    },
  },
};
const defaultData = {};
</script>
<style lang="scss"></style>
