<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!--홈-->
      <li>{{ $t('MES_CommLang.MES_CommLang_00492') }}</li>
      <!--시스템유지-->
      <li>{{ $t('MES_CommLang.MES_CommLang_00593') }}</li>
      <!--Query편집기-->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Query ID</label>
                    <InputText
                      ref="inputQueryid"
                      :dataNm="'inputQueryid'"
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
                  <!--조회-->
                </kbutton>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="12" :class="'divList1'" :style="{ height: '60%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>CustomQueryList</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <kbutton
                      :theme-color="'primary'"
                      :size="'small'"
                      :icon="'save'"
                      @click="saveBtn"
                      >{{ $t('MES_CommLang.MES_CommLang_00414') }}
                      <!--저장-->
                    </kbutton>
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
                      :icon="'add'"
                      @click="addBtn"
                      >{{ $t('MES_CommLang.MES_CommLang_00411') }}
                      <!--추가-->
                    </kbutton>
                    <kbutton
                      :theme-color="'secondary'"
                      :size="'small'"
                      :icon="'delete'"
                      @click="confirmDel"
                      >{{ $t('MES_CommLang.MES_CommLang_00412') }}
                      <!--삭제-->
                    </kbutton>
                    <kbutton
                      :theme-color="'secondary'"
                      :size="'small'"
                      :icon="'undo'"
                      @click="undoBtn"
                    >
                      UNDO
                    </kbutton>
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :gridDropDownList="headerParam.enumComboBox"
                    :checkHeaderArr="headerParam.checkBox"
                    :isPaging="true"
                    :reSetPage="this.reSetPage"
                    :gridPageData="gridPageData"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="onRowClick"
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

          <v-col :cols="12" :class="'divList2'" :style="{ height: '40%' }">
            <v-row class="search-box" align="center" no-gutters>
              <v-col :cols="1">
                <Label>
                  {{ 'QueryString' }}
                </Label>
              </v-col>
              <v-col :cols="11">
                <TextArea
                  ref="queryString"
                  :style="{ width: '100%', height: '300px' }"
                  @input="textAreaChange"
                ></TextArea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
import { TextArea } from '@progress/kendo-vue-inputs';
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
    TextArea,
  },
  data() {
    return {
      inputQueryid: '', // Query ID 검색
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvCustomQuery', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
      },
      gridHeader: [],
      reSetPage: false,
      selected: {},
      gridPageData: {},
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
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
      this.$refs['queryString'].currentValue = event.dataItem.QUERYSTRING;

      if (this.gridData[selectedIdx].rowStat == 'N') {
        this.gridData[selectedIdx].selected = false;
      }
      this.selected = event.dataItem;
    },
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.getGridData();

      this.selected = '';
      if (
        (this.$refs['queryString'].currentValue = this.gridData.QUERYSTRING)
      ) {
        this.$refs['queryString'].currentValue = '';
      }
      this.reSetPage = false;
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
        ); // 알림
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TransCustQry',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.getGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); /* ('알림', '저장되었습니다.') */
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
        ); /* ('알림', '저장할 데이터가 존재하지 않습니다.') */
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
        queryId: 'GetCustQry',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          queryid: this.inputQueryid,
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
        this.gridOriData = data;
        this.gridPageData = paging;
        this.gridData = data;
        this.$refs.rowGrid.skip = 0;
        this.$refs['queryString'].currentValue = data[0].QUERYSTRING;
      });
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      this.$refs['queryString'].currentValue = event.dataItem.QUERYSTRING;
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
      const idx = this.gridData.findIndex(x => x.idx === e.dataItem.idx);
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
    // TEXTAREA 데이터 변경
    textAreaChange(e) {
      let idx = this.gridData.findIndex(x => x.idx === this.selected.idx);
      if (idx == -1) {
        idx = 0;
      }
      this.gridData[idx].QUERYSTRING = e.value;

      if (this.gridData[idx].rowStat == 'C') {
        this.gridData[idx].rowStat = 'C';
      } else {
        this.gridData[idx].rowStat = 'U';
      }
    },
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.selected = '';
      this.$refs['queryString'].currentValue = this.gridData[0].QUERYSTRING;
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        QUERYID: '',
        QUERYVERSION: '',
        QUERYSTRING: '',
        QUERYTYPE: '',
        DESCRIPTION: '',
        FORMID: '',
        MENUID: '',
        QUERYCOUNT: '',
        CREATETIME: '',
        CREATEUSERID: '',
        idx: this.gridData.length,
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
      this.$refs['queryString'].currentValue = '';
    },
    //삭제버튼
    confirmDel() {
      const delData = this.gridData
        .filter(x => x.selected === true)
        .map(x => {
          return {
            ...x,
          };
        });
      if (delData.length > 0) {
        this.$refs['confirmPop'].title = 'info';
        this.$refs['confirmPop'].message = this.$i18n.t(
          'MES_MsgLang.MES_MsgLang_00089'
        ); /* 선택한 데이터를 삭제 하시겠습니까? */
        if (delData.filter(x => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData
            .filter(x => x.rowStat !== 'C')
            .map(x => x.QUERYID);
          this.$refs['confirmPop'].message =
            selectedRow +
            ' - ' +
            this.$i18n.t(
              'MES_MsgLang.MES_MsgLang_00089'
            ); /* 선택한 데이터를 삭제 하시겠습니까? */
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtn;
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')
        );
        return;
      }
    },
    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data
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
    //파라미터: gridData, event핸들러, 숫자컬럼리스트, 체크컬럼리스트
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e);
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetCustQry',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          queryid: this.inputQueryid,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetCustQry',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          queryid: this.inputQueryid,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
          skip: skip,
          take: take,
        },
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
  },
};

const defaultData = {};
</script>
