<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00074') }}</li>
      <!-- 기준정보 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00616') }}</li>
      <!-- 용접기준정보 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00542') }}</label>
                    <!-- 품번그룹명 -->
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
                    <label>{{ $t('MES_CommLang.MES_CommLang_00264') }}</label>
                    <!-- 품번구분 -->
                    <MesSelectBox
                      :enumID="'ProductionType'"
                      :allYN="true"
                      :dataNm="'ProductionType'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00259') }}</label>
                    <!-- 품번ID -->
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
                    <label>{{ $t('MES_CommLang.MES_CommLang_00260') }}</label>
                    <!-- 품번명 -->
                    <InputText
                      ref="productName"
                      :dataNm="'productName'"
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
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}
                  <!-- 조회 -->
                </kbutton>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col
        :sm="4"
        :lg="3"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00262')
                }}</CardTitle>
                <!-- 품번목록 -->
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid
                ref="productList"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="listParam.gridHeader"
                :resizable="true"
                :selected-field="selectedField"
                :isPaging="true"
                :gridPageData="gridPageData"
                :reSetPage="this.reSetPage"
                @gridrowclick="ProductDefinitionRowClick"
                @pageChangeEvent="pageChangeEvent"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="8"
        :lg="9"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="girdCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="12" style="margin-bottom: 10px" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00414') }}</kbutton
                >
                <!-- 저장 -->
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  :disabled="disableAddBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00411') }}</kbutton
                >
                <!-- 추가 -->
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="delBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00412') }}</kbutton
                >
                <!-- 삭제 -->
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >UNDO
                </kbutton>
              </v-col>
            </v-row>
            <div ref="divWrapper2" style="height: calc(100% - 33px)">
              <KendoGrid
                ref="weldingGrid"
                :gridHeight="gridHeight"
                :gridItems="gridDataWelding"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                @selectionchange="onSelectionchange"
                :gridPageData="gridPageDataMaster"
                @gridrowclick="onRowClick"
                @griditemchange="griditemchange"
                :gridDropDownList="headerParam.enumComboBox"
                @gridddchang="rowDdChange"
                @headerselectionchange="onHeaderSelectionChange"
                @sortChangeHandler="sortChangeHandler"
                @pageChangeEvent="pageMasterChangeEvent"
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
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from '@progress/kendo-vue-dropdowns';

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
    InputText,
    MesSelectBox,
    Utility,
    Card,
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
  },
  data() {
    return {
      // 검색 필드
      productid: '', // 제품ID 검색
      productName: '', // 제품명 검색
      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스

      value: {},
      productGroup: [],
      columns: [],
      gridHeight: '100px',
      disableAddBtn: true,

      //품번목록 데이터
      gridData: [],
      gridOriData: [],
      //페이징
      gridPageData: {},

      //용접목록 데이터
      gridDataWelding: [],
      gridOriDataWelding: [],
      //페이징
      gridPageDataMaster: {},

      selectedProductId: '',
      selectedProductName: '',
      PRODUCTID: '',
      PRODUCTNAME: '',
      RODTHICK: '',
      WELDINGPASS: '',
      GROOVE: '',
      WELDINGMATERIAL: '',
      WIREDIA: '',
      DESCRIPTION: '',
      gridLastModIdx: null,
      selectedField: 'selected',

      headerParam: {
        gridid: 'dgvMasterProductionSchdule', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        checkBox: [],
        gridHeader: [],
        enumComboBox: [],
        xOverflowYn: true,
      },
      listParam: {
        gridid: 'dgvProductList',
        noRowstat: true,
        noFirstCheck: true,
        gridHeader: [],
        xOverflowYn: true,
      },
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper2);
    await this.getHeaderMulti(this.listParam, this.$refs.divWrapper);
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    //제품 그룹 콤보 데이터 가져오기
    this.getProductGroupData();
    //제품 목록 그리드 데이터 가져오기
    this.getGridData();
    //용접 목록 그리드 데이터 가져오기
    this.getMasterProduct();
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
    // 품번 목록 RowClick
    ProductDefinitionRowClick(event) {
      //RowClick한 데이터 중 id, name 저장
      this.selectedProductId = event.dataItem.PRODUCTID;
      this.selectedProductName = event.dataItem.PRODUCTNAME;
      this.disableAddBtn = false;

      //RowClick한 데이터만 seleted = true
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;

      const data = JSON.parse(JSON.stringify(this.gridDataWelding));

      data.map(x => {
        return {
          ...x,
          selected:
            x.PRODUCTID === event.dataItem.PRODUCTID
              ? (x.selected = true)
              : (x.selected = false),
        };
      });
      this.gridDataWelding = data;
    },
    //용접목록 리스트 데이터 그리드 가져오기
    async getMasterProduct() {
      this.gridOriDataWelding = [];
      this.gridDataWelding = [];
      const { skip = 0, take = 20 } = this.gridPageDataMaster;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetMasterProduct',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
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
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridPageDataMaster = paging;
        this.gridOriDataWelding = data;
        this.gridDataWelding = data;
      });
    },
    //용접 목록 RowClick
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridDataWelding = this.gridDataWelding.map(x => {
        return {
          ...x,
          selected: x.idx === selectedIdx ? !x.selected : x.selected,
        };
      });
      this.selected = event.dataItem;
    },
    // 조회
    searchBtn() {
      this.reSetPage = true;
      this.getGridData();
      this.getMasterProduct();
    },

    // 저장
    saveBtn() {
      const saveData = this.gridDataWelding
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      const validate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridDataWelding
      );

      if (!validate.isValidate) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          validate.msg
        ); /* 알림 */
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnMasterProductSchedule',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); /* 알림, 저장되었습니다. */
              this.getMasterProduct();
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        ); /* 알림, 저장할 데이터가 없습니다. */
        return;
      }
    },

    //품번 목록 그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProdDefine',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
          PRODUCTID: this.productid,
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
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridOriData = data;
        this.gridData = data;
      });
    },
    // 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProdGrpList',
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
            this.productGroup.push({
              id: data[i].PRODUCTGROUPID,
              text: data[i].PRODUCTGROUPNAME,
            });
            this.value = this.productGroup[0];
          }
        }
      });
    },

    async pageChangeEvent(skip = 0, take = 20) {
      this.gridPageData = {
        skip: skip,
        take: take,
      };
      this.reSetPage = false;
      this.getGridData();
    },

    async pageMasterChangeEvent(skip = 0, take = 20) {
      this.gridPageDataMaster = {
        skip: skip,
        take: take,
      };
      this.reSetPage = false;
      this.getMasterProduct();
    },

    //checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //All Check checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridDataWelding = this.gridDataWelding.map(item => {
        return { ...item, selected: checked };
      });
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridDataWelding));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          data,
          this.gridOriDataWelding,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridDataWelding = data;
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

    addBtn() {
      //용접목록에 이미 있는 PRODUCTID를 추가하려고 하면 메세지 보내고 Return
      for (let i = 0; i < this.gridDataWelding.length; i++) {
        if (this.selectedProductId == this.gridDataWelding[i].PRODUCTID) {
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00238') //용접목록에서 품번코드는 중복될 수 없습니다.
          );
          return;
        }
      }

      this.$refs.weldingGrid.skip = 0;
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        PRODUCTID: this.selectedProductId,
        PRODUCTNAME: this.selectedProductName,
        RODTHICK: '',
        WELDINGPASS: '',
        GROOVE: '',
        WELDINGMATERIAL: 'SM-80G',
        WIREDIA: 1.2,
        DESCRIPTION: '',
        idx: this.gridDataWelding.length,
      };
      this.gridDataWelding.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },

    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridDataWelding.findIndex(x => x.idx === dataItem.idx);
      const Data = JSON.parse(JSON.stringify(this.gridDataWelding));

      if (this.gridDataWelding) Data[idx] = { ...Data[idx], [name]: e.value };

      if (Data[idx].rowStat === 'N') {
        Data[idx].rowStat = 'U';
      }

      if (
        Data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          Data,
          this.gridOriDataWelding,
          idx
        )
      ) {
        Data[idx].rowStat = 'N';
      }

      this.gridDataWelding = Data;
    },

    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridDataWelding));
      this.gridDataWelding = data
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

    //unbo 버튼 클릭
    undoBtn() {
      this.gridDataWelding = this.gridOriDataWelding.filter(
        x => x.newRow !== true
      );
      this.$nuxt.$emit('iccReset');
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
