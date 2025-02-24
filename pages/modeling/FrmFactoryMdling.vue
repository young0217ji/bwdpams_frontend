<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00074') }}</li>
      <!-- 기준정보홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00049') }}</li>
      <!-- 공장기본설정 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col cols="12" align="right">
                <Button
                  :theme-color="'primary'"
                  icon="search"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}</Button
                >
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col
        :sm="3"
        :lg="2"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoTree
                :treeData="treeData"
                :textField="'AREANAME'"
                :activeItem="treeActiveItem"
                @onExpandChange="onExpandChange"
                @onItemClick="onItemClick"
              >
              </KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="9"
        :lg="10"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>&nbsp;</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  icon="save"
                  @click="saveValidation"
                  >{{ $t('MES_CommLang.MES_CommLang_00414') }}</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcel"
                  >전체EXCEL</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00411') }}</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="delConfirm"
                  >{{ $t('MES_CommLang.MES_CommLang_00412') }}</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >UNDO</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" style="height: calc(100% - 33px)">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :isPaging="false"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @sortChangeHandler="sortChangeHandler"
                @headerselectionchange="onHeaderSelectionChange"
                @gridButtonClick="gridButtonClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="ConfirmPop" />
    <!-- 공정별 가능 설비 그리드 PROCESSID 검색 버튼 클릭 Modal-->
    <SelectProcessModal
      ref="SelectProcessModal"
      v-if="SelectProcessModalVisible"
      :visibleDialog="SelectProcessModalVisible"
      :title="processModalTitle"
      :selected-field="selectedField"
      :masterData="masterData"
      @visibleDialog="val => (SelectProcessModalVisible = val)"
      @selectedRow="selectedRow"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import utils from '~/plugins/utils';
import SelectProcessModal from '@/components/common/modal/SelectProcessList.vue';

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
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoTree,
    KendoGrid,
    SelectProcessModal,
  },
  data() {
    return {
      treeData: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      parentAreaId: '',
      headerParam: {
        columns: [],
        gridid: 'dgvPlantModeling', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
        xOverflowYn: true, // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
        btnClickIdx: '',
        changeCell: [
          {
            cellName: 'REPRESENTATIVEPROCESSID',
            upperCell: '',
            condition: false,
            dataItem: [],
          },
        ],
      },
      gridHeader: [],
      SelectProcessModalVisible: false,
      treeActiveItem: {},
      processModalTitle: '',
      selectedProcessId: '',
      masterData: '',
    };
  },

  created() {},
  async mounted() {
    this.processModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00721'); // 공정ID선택
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.initTree();
    await this.getGridData();
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
    searchBtn() {
      this.initTree();
      this.getGridData();
    },
    saveValidation() {
      const validation = this.gridData.filter(
        x => x.rowStat !== 'N' && !x.AREAID
      );
      if (validation.length > 0) {
        this.openAlert(
          this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00001')
        );
        return;
      }

      const dupChk = [];
      this.gridData.forEach(x => {
        if (x.rowStat !== 'N') {
          dupChk.push(x.AREAID);
        }
      });
      const dupArr = this.gridData.filter(
        x => x.rowStat === 'N' && dupChk.indexOf(x.AREAID) > -1
      );
      if (dupArr.length > 0) {
        this.openAlert(
          this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00002')
        );
        return;
      }
      this.saveBtn();
    },
    async saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      if (saveData.length > 0) {
        const res = await this.mesPost({
          apiKey: 'mes/common/manage',
          messagename:
            '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
          sendParam: saveData,
        });

        if (res?.returncode == '0') {
          this.openAlert(
            this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
          );
          this.initTree();
          this.getGridData(this.parentAreaId);
        } else {
          this.openAlert(
            'error',
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')
          );
        }
      } else {
        this.openAlert(
          this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        );
      }
    },
    //그리드 데이터 가져오기
    async getGridData(treeId = '') {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaListDtl',
        sendParam: {
          parentareaid: treeId,
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
            change: 'button', // 검색 버튼 나오도록
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
        // this.$refs.rowGrid.sortField = [{ field: 'PLANTID', dir: 'asc' }]
      });
    },
    gridButtonClick(e, field, dataItem) {
      console.log(dataItem);
      this.btnClickIdx = dataItem.idx;
      this.masterData = dataItem.AREAID;
      this.SelectProcessModalVisible = true;
    },
    //그리드 로우 클릭
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
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'USEFLAG') {
        e.value = e.value ? 'Yes' : 'No';
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

    // 검색버튼 선택
    selectedRow(row) {
      console.log(this.btnClickIdx);
      this.selectedProcessId = row.PROCESSID;
      this.gridData = this.gridData.map(item => {
        return {
          ...item,
          REPRESENTATIVEPROCESSID:
            item.idx === this.btnClickIdx
              ? row.PROCESSID
              : item.REPRESENTATIVEPROCESSID,
          rowStat: item.idx === this.btnClickIdx ? 'U' : item.rowStat,
        };
      });
    },
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      if (e.field === 'POSITION') {
        e.value = e.value.replace(/[^0-9]/gi, '');
      }
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

    //데이터 원상복구시 "수정" 항목 제거
    // chkOriginalData(gridData, idx) {
    //   const data = JSON.parse(JSON.stringify(gridData));
    //   const keys = Object.keys(data[idx]);
    //   const chkArr = keys.filter((x) => {
    //     return (
    //       this.parseNullOrUndefinedToBlank(data[idx][x]) !==
    //         this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) &&
    //       x !== "selected" &&
    //       x !== "rowStat"
    //     );
    //   });
    //   return chkArr.length > 0;
    // },

    //트리 데이터 가져오기
    async initTree() {
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        sendParam: {
          SUPERAREAID: '',
          plantid: this.$auth.$state.user.plantId,
        },
      });

      const data = res.map(x => ({ ...x, expanded: true }));
      // .sort((a, b) => (a.POSITION || '').localeCompare(b.POSITION || ''));

      this.treeData = utils.makeTreeData(data);
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    //트리 클릭
    onItemClick(event) {
      this.getGridData(event.item.AREAID); // 데이터 없을경우 NullPointerException
      this.parentAreaId = event.item.AREAID;
      this.treeActiveItem = event.item;
    },
    // //그리드 콤보박스 리스트가져오기
    // async getGridComboList() {
    //   await this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: '6000',
    //       enumid: 'AreaType',
    //     },
    //   }).then(data => {
    //     const combo = data.map(x => {
    //       return {
    //         ENUMVALUE: x.ENUMVALUE,
    //         ENUMVALUENAME: x.ENUMVALUENAME,
    //       };
    //     });
    //     this.gridDropDownList[0].dataItem = combo;
    //   });
    // },
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
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
        PARENTAREAID: this.parentAreaId ? this.parentAreaId : null,
        _ROWSTATUS: 'C',
        newRowUUid: newRowUUid,
        KOREAN: '',
        DESCRIPTION: '',
        NATIVE2: '',
        GOINORDERREQUIRED: 'Yes',
        NATIVE1: '',
        ENGLISH: '',
        AREANAME: '',
        AREATYPE: '',
        AREAID: '',
        SUPERAREAID: this.parentAreaId || this.$auth.$state.user.plantId,
        POSITION: '',
        idx: this.gridData.length,
        REPRESENTATIVECHAR: '',
        WORKCENTERTYPE: '',
        WORKCENTERGROUPID: '',
        UNITCOUNT: '',
        STANDARDVALUEKEY: '',
        STANDARDLABOR: '',
        change: 'button', // 검색 버튼 나오도록
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetAreaListDtl',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    //삭제버튼
    delConfirm() {
      const chk = [];
      this.gridData.forEach(e => {
        if (e.selected) {
          chk.push(e.AREAID);
        }
      });

      this.$refs.ConfirmPop.title = this.$i18n.t(
        'MES_CommLang.MES_CommLang_00412'
      ); // 삭제
      this.$refs.ConfirmPop.message =
        `${chk.join()}` + ' - ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); // 선택한 데이터를 삭제 하시겠습니까?
      this.$refs.ConfirmPop.modalWidth = '330px';
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.delBtn;
    },
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));

      this.gridData = data.filter(x => !(x.selected && x.rowStat === 'C'));
      this.gridData = this.gridData.map(x => {
        if (x.selected) {
          return {
            ...x,
            rowStat: 'D',
          };
        }
        return x;
      });
    },
    openAlert(title, message, visiable = true, width = '350px') {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['POSITION'],
        ['GOINORDERREQUIRED']
      );
    },
  },
};

const defaultData = {};
</script>
<style lang="scss">
.textRight {
  text-align: right;
}
.textLeft {
  text-align: left;
}
.textCenter {
  text-align: center;
}
</style>
