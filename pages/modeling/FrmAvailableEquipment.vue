<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li>
      <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li>
      <li>{{ $t("MES_CommLang.MES_CommLang_00267") }}</li>
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
                      :text-field="'text'" :data-item-key="'id'" :disabled="chkAllProduct" :value="progroupValue"
                      @change="selectProGroup">
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00264") }}</label> <!-- 품번구분 -->
                    <MesSelectBox ref="producttype" :enumID="'ProductionType'" :allYN="true" :dataNm="'ProductionType'"
                      :disabled="chkAllProduct" @comboChange="comboChange"></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00259") }}</label> <!-- 품번ID -->
                    <InputText ref="productid" :dataNm="'productid'" :disabled="chkAllProduct" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00260") }}</label> <!-- 품번명 -->
                    <InputText ref="productName" :dataNm="'productName'" :disabled="chkAllProduct" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>

                  <div class="form-group">
                    <Label>Line</Label>
                    <DropDownList ref="cmbLine" :style="{ width: '255px' }" :data-items="line" :text-field="'text'"
                      :data-item-key="'id'" :value="lineValue" @change="comboChange">
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <Label>WorkCenter</Label>
                    <DropDownList ref="cmbWorkCenter" :style="{ width: '160px' }" :data-items="workCenter"
                      :text-field="'text'" :data-item-key="'id'" :value="workcenterValue" @change="comboChange2">
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00053") }}</Label> <!-- 공정ID -->
                    <InputText ref="processid" :dataNm="'processid'" :disabled="false" @input-text-set="searchInput"
                      :searchOption="true" :searchFunc="searchBtn" />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00055") }}</Label> <!-- 공정명 -->
                    <InputText ref="processname" :dataNm="'processname'" :disabled="false" @input-text-set="searchInput"
                      :searchOption="true" :searchFunc="searchBtn" />
                  </div>
                </div>


              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <div class="form-chk" style="margin-right: 30px;">
                  <Checkbox ref="chkAllProduct" :value="true" :dataNm="'chkAllProduct'" :required="true"
                    :searchOption="true" @checkbox-set="formCheckValSet"></Checkbox>
                  <label>{{ $t("MES_CommLang.MES_CommLang_00555") }}</label> <!-- 전품목설정 -->
                </div>
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
        <v-row :style="{ height: '100%' }">
          <v-col :sm="4" :lg="6" :class="'divList1'" :style="{ height: '60%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00262") }}</CardTitle> <!-- 품번목록 -->
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid ref="productGrid" :gridHeight="gridHeight" :gridItems="productItems"
                    :gridPageData="gridPageData" :sortable="true" :columns="headerParam.gridHeader" :resizable="false"
                    :edit-field="'inEdit'" :reSetPage="this.reSetPage" :selected-field="selectedField" :isPaging="true"
                    @gridrowclick="productOnRowClick" @pageChangeEvent=pageChangeEvent />
                </div>
              </CardBody>
            </Card>
          </v-col>
          <v-col :sm="4" :lg="6" :class="'divList1'" :style="{ height: '60%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00056") }}</CardTitle> <!-- 공정목록 -->
                  </v-col>
                </v-row>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid ref="processGrid" :gridHeight="gridHeight" :gridItems="processItems"
                    :gridPageData="gridPageData2" :sortable="true" :columns="headerParam2.gridHeader" :resizable="false"
                    :edit-field="'inEdit'" :selected-field="selectedField" :isPaging="true"
                    @gridrowclick="processOnRowClick" @pageChangeEvent=pageChangeEvent2 />
                </div>
              </CardBody>
            </Card>
          </v-col>
          <v-col :sm="4" :lg="12" :class="'divList1'" :style="{ height: '40%' }">
            <div :style="{ width: '100%', height: '100%' }">
              <v-col :cols="12" :class="'divList3'" :style="{ height: '100%' }">
                <Card :style="{ height: '100%' }">
                  <CardBody :style="{ height: '100%' }">
                    <v-row no-gutters>
                      <v-col cols="6" align="left">
                        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00427") }}</CardTitle> <!-- 가능설비목록 -->
                      </v-col>
                      <v-col cols="6" align="right">
                        <kbutton :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                          $t("MES_CommLang.MES_CommLang_00414") }}</kbutton> <!-- 저장 -->
                        <kbutton :theme-color="'secondary'" :size="'small'" @click="getExcel">전체EXCEL</kbutton>
                        <kbutton :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">페이지EXCEL</kbutton>
                        <kbutton :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{
                          $t("MES_CommLang.MES_CommLang_00411") }}
                        </kbutton> <!-- 추가 -->
                        <kbutton :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="confirmDel">{{
                          $t("MES_CommLang.MES_CommLang_00412") }}</kbutton> <!-- 삭제 -->
                        <kbutton :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO
                        </kbutton>
                      </v-col>
                    </v-row>
                    <div ref="divWrapper3" :style="{ height: 'calc(100% - 33px)' }">
                      <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData3" :sortable="true"
                        :columns="headerParam3.gridHeader" :gridPageData="gridPageData3" :customCell="customCell"
                        :changeCell="changeCell" :resizable="true" :edit-field="'inEdit'" :selected-field="selectedField"
                        :isPaging="true" :reSetPage="this.reSetPage" :pkNotEditArr="pkNotEditArr"
                        @gridrowclick="equipmentOnRowClick" @gridButtonClick="gridButtonClick"
                        @sortChangeHandler="sortChangeHandler" @pageChangeEvent=pageChangeEvent3 />
                    </div>
                  </CardBody>
                </Card>
              </v-col>
              <AlertPop ref="alertPop" :is="'alertPop'" />
              <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
              <SelectEquipmentModal ref="SelectEquipmentModal" v-if="selectEquipmentModalVisible" :gridPageData="gridPageData"
                :visibleDialog="selectEquipmentModalVisible" :gridData="selectEquipmentGridData"
                :title="equipmentModalTitle" :initData="initData" :checkHeaderArr="checkHeaderArr"
                :selected-field="selectedField" @visibleDialog="val => (selectEquipmentModalVisible = val)"
                @selectedRow="selectedRow" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '../../components/common/input/InputText.vue';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { mapState, mapMutations, mapActions } from 'vuex';
import ModelingSearchModal from '@/components/frmAvailableEquipment/ModelingSearchModal';
import Process from '@/components/frmAvailableEquipment/Process.vue';
import Equipment from '@/components/frmAvailableEquipment/Equipment.vue';
import StartPop from '@/components/common/modal/StartPop';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import Checkbox from "@/components/common/input/Checkbox";
import SelectEquipmentModal from '@/components/frmAvailableEquipment/SelectEquipmentModal.vue';

let myTitle;
let myMenuId;


export default {
  name: 'AvailableEquipment',
  mixins: [mixinGlobal, gridHeaderMinin, multiGridHeaderMinin],
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
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    MesSelectBox,
    ModelingSearchModal,
    Process,
    Equipment,
    StartPop,
    Button,
    DropDownList,
    Checkbox,
    SelectEquipmentModal
  },
  props: {},
  data() {
    return {
      modelingSearchModalVisible: false,

      //제품목록 그리드
      gridData: [],
      gridOriData: [],
      columns: [],
      gridHeight: '250px',
      headerParam: {
        gridid: 'dgvProductList', // 그리드 ID
        gridHeader: [],
        enumComboBox: [],
        checkBox: [],
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        xOverflowYn: false // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
      },
      productid: '', // 제품ID 검색
      productName: '', // 제품명 검색
      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스

      // 공정목록 그리드
      gridData2: [],
      gridOriData2: [],
      reSetPage: false,
      processid: '',
      processname: '',
      selectedField: 'selected',
      headerParam2: {
        gridid: 'dgvProcessDefinition2', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        checkBox: [],
        gridHeader: [],
        noFirstCheck: true,
        xOverflowYn: false,
      },
      customCell: ['PRODUCTID', 'PROCESSID', 'EQUIPMENTID'],
      newRowChk: [],
      value: '',
      value2: '',
      gridHeight3: '',
      line: [],
      workCenter: [],
      processOperType: [],
      AREAID: '',
      AREANAME: '',
      selectedWorkCenter: '',
      row: '',
      selected: '',


      // 가능설비목록 그리드
      checkHeaderArr: ['ACTIVESTATE'],
      headerParam3: {
        gridid: 'dgvEquipmentList_Available', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        gridHeader: [],
      },
      gridData3: [],
      gridOriData3: [],
      initData: '',
      btnClickIdx: '',
      // defaultDescription: '',
      changeCell: [
        {
          cellName: 'EQUIPMENTBUTTON',
          upperCell: '',
          condition: false,
          dataItem: [],
        },
      ],
      selectEquipmentModalVisible: false,
      reSetPage: false,
      pkNotEditArr: [
        'PRODUCTID',
        'PRODUCTNAME',
        'PROCESSID',
        'PROCESSNAME',
        'EQUIPMENTID',
      ],

      productSelectedIdx: '',
      processSelectedIdx: '',

      selectedProductID: '',
      selectedProductName: '',
      selectedWorkCenter: '',
      selectedProcessID: '',
      selectedProcessName: '',

      progroupValue: '',
      lineValue: '',
      workcenterValue: { id: '', text: '' },
      productGroup: [],
      chkAllProduct: false,
      equipmentData: [],
      reSetPage: false,
      productGridOpacity: '',
      equipmentModalTitle: '',
      selectedEquipmentID: '',
      gridPageData: {},
      gridPageData2: {},
      gridPageData3: {},
      resProductID: ''
    };
  },
  created() { },
  async mounted() {
    this.equipmentModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00172');
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getHeaderMulti(this.headerParam3, this.$refs.divWrapper3);

    this.getProductGroupData();
    this.getGridProductData();
    this.getGridProcessData();
    this.getComboData();
    this.workcenterValue.text = this.$i18n.t('MES_CommLang.MES_CommLang_00501');
  },
  computed: {
    ...mapState({
      frmData: state => state.modules.frmAE,
      dgvProcessList_Available: state =>
        state.modules.frmAE.dgvProcessList_Available,
      dgvEquipmentList_Available: state =>
        state.modules.frmAE.dgvEquipmentList_Available,
      isModelingSetSave: state => state.modules.frmAE.isModelingSetSave, // ?
      selectedProduct: state => state.modules.frmAE.selectedProduct,
      selectedProcess: state => state.modules.frmAE.selectedProcess,
      selectedEquipment: state => state.modules.frmAE.selectedEquipment,
      equipmentOriData: state => state.modules.frmAE.equipmentOriData,
    }),
    productItems() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.idx === this.productSelectedIdx,
      }));
      // }
    },
    processItems() {
      return this.gridData2.map((item) => ({
        ...item,
        selected: item.idx === this.processSelectedIdx,
      }));
    }
  },
  watch: {},
  methods: {
    ...mapActions({
      setDgvEquipmentListAction: 'modules/frmAE/setDgvEquipmentListAction',
      setModelingSetSaveAction: 'modules/frmAE/setModelingSetSaveAction',
      setSelectedProductAction: 'modules/frmAE/setSelectedProductAction',
      setSelectedProcessAction: 'modules/frmAE/setSelectedProcessAction',
      setSelectedEquipmentAction: 'modules/frmAE/setSelectedEquipmentAction',
      setsetEquipmentOriDataAction:
        'modules/frmAE/setsetEquipmentOriDataAction',
    }),
    // 제품목록 그리드 데이터 가져오기
    async getGridProductData() {
      this.gridOriData = [];
      this.gridData = [];
      this.productGroupID = this.$refs['cmbProGroup'].value.id
      this.processSelectedIdx = '';
      if (this.chkAllProduct) {
        this.productGroupID = '';
        this.ProductionType = '';
        this.productName = '';
        this.productid = '';
      }
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProductDefinition',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          ProductionType: this.ProductionType,
          productGroupID: this.productGroupID,
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
        this.gridPageData = paging;
        this.$nuxt.$emit('iccReset');
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
      this.getGridProductData();

    },

    // 공정목록 그리드 데이터 가져오기
    //그리드 데이터 가져오기
    async getGridProcessData() {
      this.gridData3 = [];
      this.gridOriData3 = [];
      const { skip = 0, take = 20 } = this.gridPageData2;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProcessList',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processid: this.processid,
          processname: this.processname,
          AREAID: this.$refs['cmbLine'].value.id,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
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
        this.gridPageData2 = paging;
        this.gridOriData2 = data;
        this.gridData2 = data;
      });
    },
    async pageChangeEvent2(skip = 0, take = 20) {
      this.gridPageData2 = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridProcessData();

    },

    // 가능설비 목록 그리드 데이터 가져오기
    async equipmentGrid() {
      this.resProductID = '';
      if (this.chkAllProduct) {
        this.resProductID = 'ALL'
      } else {
        this.resProductID = this.selectedProductID;
      }
      const { skip = 0, take = 20 } = this.gridPageData3;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetAvailableEquipment',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PRODUCTID: this.resProductID, // 제품코드
          processid: this.selectedProcessID, // 공정코드
          skip: skip,
          take: take,
        },
      }).then(({ list, paging, ...x }) => {
        const data = list.map((x, idx) => {
          const customCell = {
            PRODUCTID: {
              type: '',
              dataItem: x.PRODUCTID
            },
            PROCESSID: {
              type: '',
              dataItem: x.PROCESSID
            },
            EQUIPMENTID: {
              type: '',
              dataItem: x.EQUIPMENTID
            }
          };
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
            customCell,
            EQUIPMENTBUTTON: '',
          };
        });
        this.$nuxt.$emit('iccReset');
        this.setDgvEquipmentListAction(data);
        this.gridPageData3 = paging;
        this.gridOriData3 = data;
        this.gridData3 = data;
      });
    },

    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetAvailableEquipment',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PRODUCTID: this.resProductID, // 제품코드
          processid: this.selectedProcessID, // 공정코드
          gridid: this.headerParam3.gridid,
          gridqueryversion: "00001",
        },
      });
    },
    getExcelPaging() {
      const {skip=0, take=20} = this.gridPageData3;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetAvailableEquipment',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PRODUCTID: this.resProductID, // 제품코드
          processid: this.selectedProcessID, // 공정코드
          gridid: this.headerParam3.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },

    async pageChangeEvent3(skip = 0, take = 20) {
      this.gridPageData3 = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.equipmentGrid();

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
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.productGroup.push({ id: data[i].PRODUCTGROUPID, text: data[i].PRODUCTGROUPNAME });
            this.progroupValue = this.productGroup[0];
          }
        }
      });
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
          AREATYPE: 'Line'
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
            this.lineValue = this.line[0];
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
          SUPERAREAID: res
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
        this.workCenter.push({ id: '', text: this.$i18n.t('MES_CommLang.MES_CommLang_00501') });
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.workCenter.push({ id: data[i].CODE, text: data[i].NAME });
          }
        }
        // this.workcenterValue = '';
      });
    },

    // 검색조건 Line 콤보 change 이벤트
    comboChange(event) {
      this.lineValue = event.value;
      // 검색조건 Line콤보박스 선택값에 따라 검색조건 WorkCenter 콤보 데이터 가져오기
      this.getWorkCenterComboList(event.value.id);
      if (this.chkAllProduct) {
        this.$refs['cmbProGroup'].disabled = true;
        this.$refs['producttype'].disabled = true;
        this.$refs['productid'].disabled = true;
        this.$refs['productName'].disabled = true;
      } else {
        this.$refs['cmbProGroup'].disabled = false;
        this.$refs['producttype'].disabled = false;
        this.$refs['productid'].disabled = false;
        this.$refs['productName'].disabled = false;
      }
    },
    // 검색조건 WorkCenter 콤보 change 이벤트
    comboChange2(event) {
      this.workcenterValue = event.value;
    },

    //전품목설정 체크박스 이벤트
    formCheckValSet(nm, val) {
      this.chkAllProduct = val;
      const gridRef = this.$refs.productGrid;
      const gridElement = gridRef.$el;
      this.productGridOpacity = gridElement.style.opacity;
      if (val) {
        gridElement.style.opacity = 0.4;
      } else {
        gridElement.style.opacity = '';
      }
      this.equipmentGrid();
    },
    selectProGroup(event) {
      this.progroupValue = event.value;
    },
    //제품목록 그리드 로우 클릭
    productOnRowClick(event) {
      // 전품목설정 체크 되어있을 시 그리드 로우 클릭 라인표시 없음
      if (!this.chkAllProduct) {
        this.productSelectedIdx = event.dataItem.idx;
        this.selectedProductID = event.dataItem.PRODUCTID;
        this.selectedProductName = event.dataItem.PRODUCTNAME;
        this.equipmentGrid();
      }

    },
    //공정목록 그리드 로우 클릭
    processOnRowClick(event) {
      this.processSelectedIdx = event.dataItem.idx;

      this.selectedWorkCenter = event.dataItem.WORKCENTER;
      this.selectedProcessID = event.dataItem.PROCESSID;
      this.selectedProcessName = event.dataItem.PROCESSNAME;
      this.equipmentGrid();


    },
    // 저장
    saveBtn() {
      const dgvEquipmentListData = this.gridData3
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });
      const validate = this.mesValidation(
        this.headerParam3.gridHeader,
        this.gridData3
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
        return;
      }


      if (dgvEquipmentListData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnAvailableEquipment',
          sendParam: dgvEquipmentListData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.equipmentGrid();
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
    equipmentOnRowClick(event) {
      this.row = { ...event.dataItem };
      this.gridData3.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData3 = this.gridOriData3.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
    },
    //추가 버튼 클릭
    addBtn() {
      let productid = '';
      let productname = '';
      if (this.chkAllProduct) {
        productid = 'ALL';
        productname = this.$i18n.t('MES_CommLang.MES_CommLang_00501');
        if (this.selectedProcessID == null || this.selectedProcessID == '') {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00226')); /* 알림, 공정을 선택해주세요. */
          return;
        }
      } else {
        if (this.selectedProductID != null && this.selectedProductID != '' && this.selectedProcessID != null && this.selectedProcessID != '') {
          productid = this.selectedProductID;
          productname = this.selectedProductName;
        } else {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00227')); /* 알림, 제품과 공정을 모두 선택해주세요. */
          return;
        }
      }

      // if(this.gridData3.length != '0'){
      //   this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00208')); /* 알림, 현재공정의 진행가능설비가 설정되어 있습니다. */
      //   return;
      // }

      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        newRowUUid,
        inEdit: false,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        PRODUCTID: productid, // 제품
        PRODUCTNAME: productname, // 제품명
        WORKCENTER: this.selectedWorkCenter,
        PROCESSID: this.selectedProcessID, // 공정
        PROCESSNAME: this.selectedProcessName, // 공정명
        customCell: {
          PRODUCTID: {
            type: '',
            dataItem: productid,
            disabled: true
          },
          PROCESSID: {
            type: '',
            dataItem: this.selectedProcessID,
            disabled: true
          },
          EQUIPMENTID: {
            type: '',
            disabled: true
          }
        },
        EQUIPMENTID: '', // 설비코드
        EQUIPMENTNAME: '', // 설비명
        changeCellType: 'button', // 검색 버튼 나오도록
        EQUIPMENTBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
        CREATEUSERID: '',
        CREATETIME: '',
        PRIORITY: this.gridData3.length + 1,
        idx: this.gridData3.length,
      };



      this.gridData3.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');

    },
    //삭제버튼
    confirmDel() {
      const delData = this.gridData3
        .filter((x) => x.selected === true)
        .map((x) => {
          return {
            ...x,
          };
        });

      if (delData.length > 0) {
        if (delData.filter((x) => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData
            .filter((x) => x.rowStat !== 'C')
            .map((x) => x.PRODUCTID);

          this.$refs['confirmPop'].title = 'info';
          this.$refs['confirmPop'].message = this.gridData3[0].PRODUCTID + ", " + this.gridData3[0].PROCESSID + " - " + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); // 선택한 데이터를 삭제 하시겠습니까?
          this.$refs['confirmPop'].modalWidth = '300px';
          this.$refs['confirmPop'].visibleDialog = true;
          this.$refs['confirmPop'].callBack = this.delBtn;
        } else {
          this.delBtn();
        }
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')
        ); /* 알림, 선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.*/
        return;
      }
    },
    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData3));
      this.gridData3 = data
        .filter(x => !(x.selected && x.rowStat === 'C'))
        .map(x => {
          if (x.selected) {
            return {
              ...x,
              rowStat: 'D',
            };
          }
          return x;
        });
    },
    ...mapActions({
      setDgvEquipmentListAction: 'modules/frmAE/setDgvEquipmentListAction', // 가능설비목록
    }),

    searchBtn() {
      this.selectedProcessID = '';
      this.selectedProductID = '';
      this.getGridProductData();
      this.getGridProcessData();
      // this.gridData.map(x => x.selected = false);
      this.productSelectedIdx = -1
    },
    //그리드 버튼 클릭 (가능설비목록 - 추가 후 검색버튼)
    gridButtonClick(e, field, dataItem) {
      if (field === 'EQUIPMENTBUTTON') {
        this.selectEquipmentGridData = this.gridData3.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickIdx = dataItem.idx;
        // this.inputVal = dataItem.CONSUMABLENAME;
        this.initData = this.selectedWorkCenter;
        this.selectEquipmentModalVisible = true;
      }
    },
    //검색버튼 선택
    selectedRow(row) {
      this.selectedEquipmentID = row.EQUIPMENTID;
      this.gridData3.map(x => {
        if (this.btnClickIdx == x.idx) {
          x.EQUIPMENTID = row.EQUIPMENTID;
          x.EQUIPMENTNAME = row.EQUIPMENTNAME;
        }
      });
    },
    sortChangeHandler(e) {
      const isAscending = e.sort[0]?.dir == 'asc';
      if (isAscending) {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] < b[e.event?.field]
            ? -1
            : a[e.event?.field] > b[e.event?.field]
              ? 1
              : 0
        );
      } else {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] > b[e.event?.field]
            ? -1
            : a[e.event?.field] < b[e.event?.field]
              ? 1
              : 0
        );
      }
    },

    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    chkVal(nm, val) {
      this[nm] = val ? 'Yes' : '';
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
