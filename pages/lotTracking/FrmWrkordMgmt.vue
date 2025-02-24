<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00665') }}</li>
      <!-- 공정관리 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00703') }}</li>
      <!-- 작업지시관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>Line</Label>
                    <DropDownList
                      ref="cmbLine"
                      :boxWidth="'100%'"
                      :data-items="line"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="value"
                      @change="comboChange"
                    >
                    </DropDownList>
                  </div>
                  <div
                    class="form-group"
                    style="width: 272px; margin-left: 8px"
                  >
                    <Label>WorkCenter</Label>
                    <DropDownList
                      ref="cmbWorkCenter"
                      :boxWidth="'80%'"
                      :data-items="workCenter"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="value2"
                      @change="comboChange2"
                    >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00263') }}</label>
                    <!-- 품번코드 -->
                    <InputText
                      ref="productid"
                      :boxWidth="'100%'"
                      :dataNm="'productid'"
                      :disabled="false"
                      :defaultValue="productid"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00260') }}</label>
                    <!-- 품번명 -->
                    <InputText
                      ref="productname"
                      :boxWidth="'100%'"
                      :dataNm="'productname'"
                      :disabled="false"
                      :defaultValue="productname"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00704') }}</label>
                    <!-- 입고 S/L -->
                    <InputText
                      ref="warehousename"
                      :boxWidth="'100%'"
                      :dataNm="'warehousename'"
                      :disabled="false"
                      :defaultValue="warehousename"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                    <Button
                      :theme-color="'primary'"
                      @click="warehouseModalVisible = true"
                      >{{ $t('MES_CommLang.MES_CommLang_00169') }}</Button
                    >
                    <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00532') }}</label>
                    <!-- 작업지시번호 -->
                    <InputText
                      ref="workorder"
                      :boxWidth="'100%'"
                      :dataNm="'workorder'"
                      :disabled="false"
                      :defaultValue="workorder"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div
                    class="form-group"
                    style="width: 270px; margin-right: 0px"
                  >
                    <Label>{{ $t('MES_CommLang.MES_CommLang_00052') }}</Label>
                    <!-- 공정 -->
                    <DropDownList
                      ref="cmbERPOper"
                      :boxWidth="'120px'"
                      :data-items="erpOper"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="value3"
                      @change="comboChange3"
                    >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00705') }}</label>
                    <!-- 순서번호 -->
                    <InputText
                      ref="sequenceNumber"
                      :boxWidth="'100%'"
                      :dataNm="'sequenceNumber'"
                      :disabled="false"
                      :defaultValue="sequenceNumber"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>

                  <div class="form-group" style="margin-right: 50px">
                    <label>P/M</label>
                    <InputText
                      ref="pm"
                      :boxWidth="'100%'"
                      :dataNm="'pm'"
                      :disabled="false"
                      :defaultValue="pm"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00706') }}</label>
                    <!--계획일-->
                    <div class="form-datepicker">
                      <DatePicker
                        ref="planFromDate"
                        :default-value="new Date(planFromDate)"
                        :dataNm="'planFromDate'"
                        :format="'yyyy-MM-dd'"
                        @change="fromChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="plantToDate"
                        :default-value="new Date()"
                        :dataNm="'plantToDate'"
                        :format="'yyyy-MM-dd'"
                        @change="toChange"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00148') }}</label>
                    <!-- 상태 -->
                  </div>
                  <div
                    class="form-group-wrap"
                    style="
                      margin-top: 9px;
                      border: 1px solid;
                      border-radius: 5px;
                      border-color: #d7dae4;
                      height: 40px;
                      width: 380px;
                    "
                  >
                    <div
                      class="form-group"
                      style="margin-left: -50px; margin-bottom: 15px"
                    >
                      <label>{{ $t('MES_CommLang.MES_CommLang_00410') }}</label>
                      <!-- 취소 -->
                      <div class="form-chk">
                        <Checkbox
                          ref="Cancel"
                          :dataNm="'Cancel'"
                          :disabled="false"
                          :defaultchecked="false"
                          @checkbox-set="chkVal"
                        ></Checkbox>
                      </div>
                    </div>
                    <!-- </div> -->
                    <div
                      class="form-group"
                      style="margin-left: -50px; margin-bottom: 15px"
                    >
                      <label>{{ $t('MES_CommLang.MES_CommLang_00707') }}</label>
                      <!-- 대기 -->
                      <div class="form-chk">
                        <Checkbox
                          ref="Created"
                          :dataNm="'Created'"
                          :disabled="false"
                          :defaultchecked="true"
                          @checkbox-set="chkVal"
                        ></Checkbox>
                      </div>
                    </div>
                    <div
                      class="form-group"
                      style="margin-left: -50px; margin-bottom: 15px"
                    >
                      <label>{{ $t('MES_CommLang.MES_CommLang_00708') }}</label>
                      <!-- 진행 -->
                      <div class="form-chk">
                        <Checkbox
                          ref="Released"
                          :dataNm="'Released'"
                          :disabled="false"
                          :defaultchecked="true"
                          @checkbox-set="chkVal"
                        ></Checkbox>
                      </div>
                    </div>
                    <div
                      class="form-group"
                      style="margin-left: -50px; margin-bottom: 15px"
                    >
                      <label>{{ $t('MES_CommLang.MES_CommLang_00281') }}</label>
                      <!-- 종료 -->
                      <div class="form-chk">
                        <Checkbox
                          ref="Completed"
                          :dataNm="'Completed'"
                          :disabled="false"
                          :defaultchecked="false"
                          @checkbox-set="chkVal"
                        ></Checkbox>
                      </div>
                    </div>
                    <div
                      class="form-group"
                      style="margin-left: -50px; margin-bottom: 15px"
                    >
                      <label>{{ $t('MES_CommLang.MES_CommLang_00709') }}</label>
                      <!-- 잔량 -->
                      <div class="form-chk">
                        <Checkbox
                          ref="RemainQty"
                          :dataNm="'RemainQty'"
                          :disabled="false"
                          :defaultchecked="false"
                          @checkbox-set="chkVal"
                        ></Checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="2" :lg="2" align="right">
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
      <v-col
        :sm="12"
        :lg="12"
        :class="'divListWapper'"
        :style="{ height: '50%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters style="margin-bottom: 5px">
              <v-col cols="6" align="left"> </v-col>
              <v-col cols="6" align="right">
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="statusBtn"
                  >Status</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="bomDeployBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00710') }}</Button
                >
                <!-- BOM전개 -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="stockBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00711') }}</Button
                >
                <!-- 재고정보 -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="showUbiform"
                  >Print</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="skLabelBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00712') }}</Button
                >
                <!-- S/K라벨 -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcel"
                  >{{ $t('MES_CommLang.MES_CommLang_00676') }}</Button
                >
                <!-- 전체EXCEL -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcelPaging"
                  >{{ $t('MES_CommLang.MES_CommLang_00677') }}</Button
                >
                <!-- 페이지EXCEL -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >undo</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" style="height: calc(100% - 33px)">
              <KendoGrid
                ref="workorderGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :isPaging="true"
                :gridPageData="gridPageData"
                :selected-field="selectedField"
                :checkHeaderArr="checkHeaderArr"
                :reSetPage="this.reSetPage"
                @pageChangeEvent="pageChangeEvent"
                @gridddchang="rowDdChange"
                @gridrowclick="onRowClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="12"
        :lg="12"
        :class="'divListWapper'"
        :style="{ height: '53%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="12" align="right" style="margin-bottom: 7px">
                <!-- <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00585") }}</CardTitle> -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcel2"
                  >전체EXCEL</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper2" style="height: calc(100% - 33px)">
              <KendoGrid
                ref="workorderMaterialGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData2"
                :sortable="true"
                :columns="headerParam2.gridHeader"
                :resizable="true"
                :isPaging="false"
                :selected-field="selectedField"
                @gridddchang="rowDdChange2"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="confirmPop" :is="'confirmPop'" :visibleDialog="false" />
    <WarehouseModal
      ref="WarehouseModal"
      v-if="warehouseModalVisible"
      :visibleDialog="warehouseModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="val => (warehouseModalVisible = val)"
      @selectedWarehouse="selectedWarehouse"
    />
    <WindowPop ref="windowPop" :formName="'WorkorderMgmt'"></WindowPop>
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import Checkbox from '@/components/common/input/Checkbox';
import WarehouseModal from '@/components/frmWrkordMgmt/SelectWHouseModal';
import WindowPop from '@/components/common/WindowPop';

import { mapState, mapMutations, mapActions } from 'vuex';

let myTitle;
let myMenuId;
let selectProductID = '';

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일

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
    InputText,
    CardTitle,
    DropDownList,
    DatePicker,
    Checkbox,
    WarehouseModal,
    WindowPop,
  },
  data() {
    return {
      planFromDate: Utility.setFormatDate(
        new Date(year, month, day - 7),
        'YYYY-MM-DD'
      ),
      plantToDate: Utility.setFormatDate(new Date(), 'YYYY-MM-DD'),
      warehouseModalVisible: false,
      gridHeight: '100px',
      selectedField: 'selected',
      line: [],
      columns: [],
      workCenter: [],
      gridData: [],
      gridOriData: [],
      gridData2: [],
      gridOriData2: [],
      productid: '',
      productname: '',
      warehouseid: '',
      warehousename: '',
      workorder: '',
      erpOper: [],
      sequenceNumber: '',
      pm: '',
      checkHeaderArr: ['PRINTCHECK'],
      reSetPage: false,

      value: '' /* Line */,
      value2: { id: '', text: '' } /* WorkCenter */,
      value3: '',
      state: '',
      Cancel: '',
      Created: 'Created',
      Released: 'Released',
      Completed: '',
      RemainQty: '',
      PONotConfirm: 'Released',
      visibleDialog: false,
      checkedList: ['Released', 'Created'],

      headerParam: {
        gridid: 'dgvWorkOrderMgmt', // 그리드 ID
        rowStat: '',
        gridHeader: [],
        noRowstat: false,
        noFirstCheck: true,
        xOverflowYn: true,
        // checkBox: [],
      },
      headerParam2: {
        gridid: 'dgvWorkOrderMaterial', // 그리드 ID
        rowStat: '',
        gridHeader: [],
        noRowstat: true,
        noFirstCheck: true,
        xOverflowYn: true,
      },
      datasetList: {},
      paramList: {},
      selectedRow: [],
      gridPageData: {},
      gridPageData2: {},
      materialData: {},
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(
      this.headerParam,
      this.$refs.divWrapper,
      this.customDropDown
    );
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    this.getComboData();
    this.getERPOperComboList();
    await this.getBMGridData();
    this.value2.text = this.$i18n.t(
      'MES_CommLang.MES_CommLang_00501'
    ); /* 전체 */
  },
  watch: {},
  methods: {
    ...mapActions({
      setProductIDAction: 'modules/frmBOMD/setProductIDAction',
    }),
    // 그리드 데이터 가져오기
    async getBMGridData() {
      this.gridOriData = [];
      this.gridData = [];
      console.log('pm', this.pm);
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        //조수완 : GetWorkOrderMgmt 에서 수정
        queryId: 'GetWrkOrdMgmt',
        queryVersion: '00001',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          WORKORDERID: this.workorder,
          PRODUCTID: this.productid,
          PRODUCTNAME: this.productname,
          CANCEL: this.Cancel,
          CREATED: this.Created,
          RELEASED: this.Released,
          COMPLETED: this.Completed,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          ERPOPERID: this.$refs['cmbERPOper'].value.id,
          PARENTWORKCENTERNAME: this.pm,
          STARTDATE: this.planFromDate,
          ENDDATE: this.plantToDate,
          STOCKLOCATION: this.warehouseid,
          skip: skip,
          take: take,
        },
      }).then(({ list, paging, ...x }) => {
        const data = list
          .filter(x =>
            this.RemainQty == 'RemainQty'
              ? x.PLANQUANTITY - x.GOODQTY - x.BADQTY > 0
                ? true
                : false
              : true
          )
          .map((x, idx) => {
            return {
              ...x,
              REMAINQTY: x.PLANQUANTITY - x.GOODQTY - x.BADQTY,
              rowStat: 'N',
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
              resizable: true,
            };
          });
        this.gridPageData = paging;
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
        console.log(this.gridData);
      });
    },

    async pageChangeEvent(skip = 0, take = 20) {
      this.gridPageData = {
        skip: skip,
        take: take,
      };
      this.reSetPage = false;
      this.getBMGridData();
    },

    // 검색조건 콤보 데이터 가져오기
    async getComboData() {
      // Line 콤보 데이터 가져오기
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00003',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          AREATYPE: 'Line',
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
            this.line.push({ id: data[i].CODE, text: data[i].NAME });
            this.value = this.line[0];
          }
        }
        // 검색조건 WorkCenter 콤보박스 데이터 가져오기
        this.getWorkCenterComboList(this.line[0].id);
      });
    },

    // 검색조건 WorkCenter 콤보박스 데이터 가져오기
    async getWorkCenterComboList(res) {
      this.workCenter = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00003',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          AREATYPE: 'WorkCenter',
          SUPERAREAID: res,
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
        this.workCenter.push({
          id: '',
          text: this.$i18n.t('MES_CommLang.MES_CommLang_00501'),
        }); /* 전체 */
        this.value2 = this.workCenter[0];
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.workCenter.push({ id: data[i].CODE, text: data[i].NAME });
          }
        }
      });
    },
    async getERPOperComboList() {
      this.erpOper = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPlanOper',
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
        this.erpOper.push({
          id: '',
          text: this.$i18n.t('MES_CommLang.MES_CommLang_00501'),
        }); /* 전체 */
        this.value3 = this.erpOper[0];
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.erpOper.push({
              id: data[i].PLANOPERID,
              text: data[i].PLANOPERNAME,
            });
          }
        }
      });
    },

    async searchBtn() {
      this.getBMGridData();
    },
    async onRowClick(event) {
      this.selectedRow = event.dataItem;
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;

      selectProductID = event.dataItem.PRODUCTID;
      await this.실수(event.dataItem);
    },
    async 실수(data) {
      this.gridOriData2 = [];
      this.gridData2 = [];
      this.materialData = data;
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetWrkOrdMat',
        queryVersion: '00001',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          PRODUCTORDERID: data.PRODUCTORDERID,
          WORKORDERID: data.WORKORDERID,
          ERPOPERID: data.ERPOPERID,
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
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData2 = data;
        this.gridData2 = data;

        this.paramList = this.gridData.filter(x => x.selected == true)[0];

        this.datasetList = {
          dataset_1: this.gridData2,
        };
      });
    },
    selectedWarehouse(data) {
      console.log(data);
      this.warehouseid = data.WAREHOUSEID;
      this.warehousename = data.WAREHOUSENAME;
    },
    statusBtn() {},
    async bomDeployBtn() {
      this.setProductIDAction(selectProductID);

      await this.$router.push({
        path: `/modeling/FrmBOMDefinition?menuId=46`,
      });
      this.$auth.onRedirect((to, from) => {
        return `/modeling/FrmBOMDefinition?menuId=46`;
      });
      this.$router.beforeEach((to, from, next) => {
        if (!to.matched.length) {
          next(false);
        } else {
          next();
        }
      });
    },
    stockBtn() {},
    showUbiform() {
      if (this.datasetList.dataset_1 == undefined) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00087')
        ); /* 알림, 선택한 데이터가 없습니다.*/
        return;
      }

      this.$refs.windowPop.show(this.datasetList, this.paramList);
    },
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    skLabelBtn() {},
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        //조수완 : GetWorkOrderMgmt에서 수정
        queryId: 'GetWrkOrdMgmt',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          WORKORDERID: this.workorder,
          PRODUCTID: this.productid,
          PRODUCTNAME: this.productname,
          CANCEL: this.Cancel,
          CREATED: this.Created,
          RELEASED: this.Released,
          COMPLETED: this.Completed,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          ERPOPERID: this.$refs['cmbERPOper'].value.id,
          PARENTWORKCENTERNAME: this.pm,
          STARTDATE: this.planFromDate,
          ENDDATE: this.plantToDate,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        // 조수완 : GetWorkOrderMgmt에서 수정
        queryId: 'GetWrkOrdMgmt',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          WORKORDERID: this.workorder,
          PRODUCTID: this.productid,
          PRODUCTNAME: this.productname,
          CANCEL: this.Cancel,
          CREATED: this.Created,
          RELEASED: this.Released,
          COMPLETED: this.Completed,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          ERPOPERID: this.$refs['cmbERPOper'].value.id,
          PARENTWORKCENTERNAME: this.pm,
          STARTDATE: this.planFromDate,
          ENDDATE: this.plantToDate,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
          skip: skip,
          take: take,
        },
      });
    },

    getExcel2() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetWrkOrdMat',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          PRODUCTORDERID: this.materialData.PRODUCTORDERID,
          WORKORDERID: this.materialData.WORKORDERID,
          ERPOPERID: this.materialData.ERPOPERID,
          gridid: this.headerParam2.gridid,
          gridqueryversion: '00001',
        },
      });
    },

    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'PRINTCHECK') {
        e.value = e.value ? 'Yes' : 'No';
      }

      data[idx] = { ...data[idx], [name]: e.value };

      this.gridData = data;
      console.log(this.gridData);
    },
    rowDdChange2(e, name, dataItem) {},

    chkVal(nm, val) {
      if (val) {
        this[nm] = nm;
      } else {
        this[nm] = '';
      }
    },
    chkVal2(nm, val) {
      this[nm] = val ? 'Released' : '';
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
    // 검색조건 Line 콤보 change 이벤트
    comboChange(event) {
      this.value = event.value;
      // 검색조건 Line콤보박스 선택값에 따라 검색조건 WorkCenter 콤보 데이터 가져오기
      this.getWorkCenterComboList(event.value.id);
    },
    // 검색조건 WorkCenter 콤보 change 이벤트
    comboChange2(event) {
      this.value2 = event.value;
    },
    // 검색조건 공정 콤보 change 이벤트
    comboChange3(event) {
      this.value3 = event.value;
    },
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
    },
    fromChange(e) {
      this.planFromDate = Utility.setFormatDate(e.value, 'YYYY-MM-DD');
    },
    toChange(e) {
      this.plantToDate = Utility.setFormatDate(e.value, 'YYYY-MM-DD');
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      // console.log(":::::::::::::::::::")
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return (
          this.parseNullOrUndefinedToBlank(data[idx][x]) !==
            this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) &&
          x !== 'selected' &&
          x !== 'rowStat'
        );
        // return data[idx][x] !== this.gridOriData2[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    // 그리드 페이지 변경
    async pageChangeEvent(skip = 0, take = 20) {
      this.gridPageData = {
        skip: skip,
        take: take,
      };
      this.reSetPage = false;
      this.getBMGridData();
    },
    // R
  },
};
const defaultData = {};
</script>
<style lang="scss"></style>
