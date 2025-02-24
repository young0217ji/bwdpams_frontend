<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!--홈-->
      <li>{{ $t('MES_CommLang.MES_CommLang_00074') }}</li>
      <!--기준정보-->
      <li>{{ $t('MES_CommLang.MES_CommLang_00147') }}</li>
      <!--사유코드기준정보-->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10" align="left"> </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}</Button
                ><!--조회-->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="3" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col align="left">
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00145')
                }}</CardTitle
                ><!--사유구분목록-->
              </v-col>
              <v-col align="right">
                <Button
                  :style="{ width: '25px' }"
                  :theme-color="'primary'"
                  :size="'small'"
                  @click="maximizeTree"
                  >{{ this.treeBtn }}</Button
                >
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  @click="reasonCodeTypeModal = true"
                  >{{ $t('MES_CommLang.MES_CommLang_00549') }}</Button
                ><!--사유구분관리-->
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoTree
                :treeData="treeData"
                :textField="'REASONCODENAME'"
                :activeItem="treeActiveItem"
                @onExpandChange="onExpandChange"
                @onItemClick="onItemClick"
              >
              </KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="9" :style="{ height: '100%' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00146')
                }}</CardTitle
                ><!--사유구분목록-->
              </v-col>
              <v-col cols="6" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00414') }}</Button
                ><!--저장-->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcel"
                  >전체EXCEL</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcelPaging"
                  >페이지EXCEL</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00411') }}</Button
                ><!--추가-->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="delBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00412') }}</Button
                ><!--삭제-->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >undo</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :gridPageData="gridPageData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="gridDropDownList"
                :checkHeaderArr="checkHeaderArr"
                :isPaging="true"
                @sortChangeHandler="sortChangeHandler"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ReasonCodeType
      v-if="reasonCodeTypeModal"
      :title="$t('MES_CommLang.MES_CommLang_00145')"
      :visibleDialog="reasonCodeTypeModal"
      @visibleDialog="val => (reasonCodeTypeModal = val)"
      @popUpChange="searchBtn"
    /><!--사유구분목록-->
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import RsnCdType from '@/components/frmRsnCd/RsnCdType';
import InputText from '@/components/common/input/InputText';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Checkbox from '@/components/common/input/Checkbox';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import utils from '~/plugins/utils';

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
    CardTitle,
    KendoGrid,
    KendoTree,
    InputText,
    Checkbox,
    ReasonCodeType,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: '500px',
    },
  },
  data() {
    return {
      treeData: [],
      treeActiveItem: {},
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      saveOriData: [],
      gridDropDownList: [{}],
      selectedField: 'selected',
      checkHeaderArr: ['AVAILABILITY'],
      intputReasonCodeType: '',
      parentAreaId: '',
      headerParam: {
        gridid: 'dgvReasonCode_Modeling', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
      },
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      reasonCodeTypeModal: false,
      currTreeData: {},
      maximize: true,
      treeBtn: '-',
      treeID: '',
      gridPageData: {},
    };
  },
  created() {},
  async mounted() {
    // this.gridHeight = (this.$refs.contents.offsetHeight - 180) +'px';
    // await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.initTree();
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    //this.searchBtn();
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
    // 조회버튼 클릭
    searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      // this.$refs.rowGrid.skip = 0;
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      this.initTree();
      this.getGridData('NONE');
      this.treeBtn = '-';
      this.maximize = true;
    },
    // 저장버튼 클릭
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _rowstatus: x.rowStat,
          };
        });

      const saveValidate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridData
      );
      if (!saveValidate.isValidate) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          saveValidate.msg
        ); //알림
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
            this.initTree();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140') //저장되었습니다.
              );
              this.getGridData(saveData[0].SUPERREASONCODE);
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.returncode,
                result.returnmessage
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143') //저장할 데이터가 없습니다.
        );
        return;
      }
    },

    //트리 데이터 가져오기
    async initTree() {
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetRsncodeTypeList_Mdling',
        sendParam: {
          SUPERREASONCODE: '',
          plantid: this.$auth.$state.user.plantId,
        },
      });
      this.currTreeData = res;
      const data = res.map(x => ({ ...x, expanded: true }));
      // .sort((a, b) => (a.POSITION || '').localeCompare(b.POSITION || ''));

      this.treeData = utils.makeTreeData2(data);
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    //트리 클릭
    onItemClick(event) {
      if (event.item.REASONCODE !== '6000') {
        this.getGridData(event.item.REASONCODE); // 데이터 없을경우 NullPointerException
        this.parentAreaId = event.item.REASONCODE;
      }
      this.treeActiveItem = event.item;
    },

    //그리드 데이터 가져오기
    async getGridData(treeId = '') {
      // console.log("reasoncodetype:::::::::", reasoncodetype);
      this.treeID = treeId;
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetRsncodeList',
        queryVersion: '00002',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          reasoncodetype: treeId,
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
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridOriData = data;
        this.saveOriData = data;
        this.gridData = data;
      });
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetRsncodeList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          reasoncodetype: this.treeID,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00002',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetRsncodeList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          reasoncodetype: this.treeID,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00002',
          skip: skip,
          take: take,
        },
      });
    },
    onRowClick(event) {
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
      // console.log(event.dataItem);
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      // console.log("===========onSelectionchange==============");
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      const availability = event.dataItem.AVAILABILITY;
      const rowStat = event.dataItem.rowStat;
      if (availability != 'Available' && rowStat == 'N') {
        const reasoncodetype = event.dataItem.REASONCODETYPEID;
        this.getGridData(reasoncodetype);
      }
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      // console.log("===========onHeaderSelectionChange==============");
      // let checked = event.event.target.checked;
      // this.gridData = this.gridData2.map((item) => {
      //   return { ...item, selected: checked };
      // });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'AVAILABILITY') {
        e.value = e.value ? 'Yes' : 'No';
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = 'N';
      }

      this.gridData = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      // console.log("===griditemchange===");
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = 'N';
      }

      this.gridData = data;
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

    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      // const data = JSON.parse(JSON.stringify(this.gridData2));
      // this.gridData2 = data
      //   .map((x) => {
      //     if (x.selected) {
      //       if (!x.newRow) {
      //         const item = this.gridOriData2.filter(
      //           (ori) => ori.REASONCODE === x.REASONCODE
      //         );
      //         return item[0];
      //       }
      //     } else {
      //       return x;
      //     }
      //   })
      //   .filter((x) => !!x);
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        idx: this.gridData.length,
        _ROWSTATUSIMAGE: 'System.Drawing.Bitmap',
        REASONCODE: '',
        SUPERREASONCODE:
          this.treeActiveItem.REASONCODETYPE === 'ReasonType'
            ? null
            : this.treeActiveItem.REASONCODE,
        REASONCODETYPE:
          this.treeActiveItem.REASONCODETYPE === 'ReasonType'
            ? this.treeActiveItem.REASONCODE
            : this.treeActiveItem.REASONCODETYPE,
        newRowUUid: newRowUUid,
        AVAILABILITY: 'Yes',
      };
      // console.log(":::::::", this.gridData2);
      // console.log("dataItems ::::::", dataItem);
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data
        .map(x => {
          if (x.selected) {
            if (x.rowStat !== 'C') {
              return {
                ...x,
                rowStat: 'D',
              };
            }
          } else {
            return x;
          }
        })
        .filter(x => x !== undefined);
      this.$nuxt.$emit('iccReset');
    },

    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, ['POSITION']);
    },

    //트리 전체접기 버튼
    maximizeTree() {
      this.treeBtn = this.treeBtn === '-' ? '+' : '-';
      this.maximize = !this.maximize;
      this.currTreeData = this.currTreeData.map(x => ({
        ...x,
        expanded: this.maximize,
      }));
      this.treeData = utils.makeTreeData2(this.currTreeData);
    },
  },
};

const defaultData = {};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 339px !important;
  }
  .divList2 {
    height: auto !important;
  }
  .divList3 {
    height: 213px !important;
  }
}
</style>
