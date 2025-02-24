<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00074') }}</li>
      <!-- 기준정보 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00538') }}</li>
      <!-- 품번그룹정보 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00541') }}</label>
                    <!-- 제품그룹코드 -->
                    <InputText
                      ref="productGroupId"
                      :dataNm="'productGroupId'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00542') }}</label>
                    <!-- 제품그룹명 -->
                    <InputText
                      ref="productGroupName"
                      :dataNm="'productGroupName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group" style="margin-top: 10px">
                    <Label>{{ $t('MES_CommLang.MES_CommLang_00129') }}</Label>
                    <!-- 사용여부 -->
                    <DropDownList
                      ref="cmbActiveState"
                      :style="{ width: '100px' }"
                      :data-items="activeStateEnum"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="stateEnum"
                      @change="comboChangeEnum"
                    >
                    </DropDownList>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}</kbutton
                >
                <!-- 조회 -->
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
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00539')
                }}</CardTitle>
                <!-- 제품그룹목록 -->
              </v-col>
              <v-col cols="6" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'small'"
                  icon="save"
                  @click="saveBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00414') }}</kbutton
                >
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
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :gridPageData="gridPageData"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange"
                @sortChangeHandler="sortChangeHandler"
                @pageChangeEvent="pageChangeEvent"
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
import { DropDownList } from '@progress/kendo-vue-dropdowns';

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
  },
  data() {
    return {
      productid: '', // 제품ID 검색
      productName: '', // 제품명 검색
      ProductionType: '', //제품구분 콤보박스
      productGroupId: '',
      productGroupName: '',
      activeStateEnum: [],
      stateEnum: {},
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      // checkHeaderArr: ['ACTIVESTATE'],
      headerParam: {
        gridid: 'dgvProductGroup', // 그리드 ID
        rowStat: '',
        enumComboBox: [],
        checkBox: [],
        noFirstCheck: true,
      },
      gridHeader: [],
      reSetPage: false,
      gridPageData: {},
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';

    // await this.getGridComboList();
    this.getGridData();
    this.getEnum();
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
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          validate.msg
        ); /* 알림 */
        return;
      }
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename:
            '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.getGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); /* 알림, 저장되었습니다. */
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
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProdGrpGridList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productGroupId: this.productGroupId,
          productGroupName: this.productGroupName,
          ACTIVESTATE: this.stateEnum.id,
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

    // 검색조건 ActiveState enum콤보 데이터 가져오기
    async getEnum() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValue',
        queryVersion: '00001',
        sendParam: {
          plantID: this.$auth.$state.user.plantId,
          ENUMID: 'ActiveState',
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
        this.activeStateEnum.push({
          id: '',
          text: this.$i18n.t('MES_CommLang.MES_CommLang_00501'),
        });
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.activeStateEnum.push({
              id: data[i].ENUMVALUE,
              text: data[i].ENUMVALUENAME,
            });
            this.stateEnum = this.activeStateEnum[0];
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
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetProdGrpGridList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productGroupId: this.productGroupId,
          productGroupName: this.productGroupName,
          ACTIVESTATE: this.stateEnum.id,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetProdGrpGridList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productGroupId: this.productGroupId,
          productGroupName: this.productGroupName,
          ACTIVESTATE: this.stateEnum.id,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
          skip: skip,
          take: take,
        },
      });
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
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
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

    //ActiveState Enum Change
    comboChangeEnum(event) {
      this.stateEnum = event.value;
    },
  },
};

const defaultData = {};
</script>
