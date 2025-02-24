<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00449') }}</li>
      <!-- 설정 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00519') }}</li>
      <!-- 메뉴관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00106') }}</label>
                    <!-- 메뉴ID -->
                    <InputText
                      ref="s_menuID"
                      :dataNm="'s_menuID'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00107') }}</label>
                    <!-- 메뉴명 -->
                    <InputText
                      ref="s_menuName"
                      :dataNm="'s_menuName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00524') }}</label>
                    <!-- 메뉴구분 -->
                    <MesSelectBox
                      :enumID="'MenuSystemType'"
                      :allYN="true"
                      :dataNm="'MenuSystemType'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                >
                  {{ $t('MES_CommLang.MES_CommLang_00277') }}
                </Button>
                <!-- 조회 -->
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
                :textField="LOCALECOLUMN"
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
                <!-- 저장 -->
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
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00411') }}</Button
                >
                <!-- 추가 -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="delConfirm"
                  >{{ $t('MES_CommLang.MES_CommLang_00412') }}</Button
                >
                <!-- 삭제 -->
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
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :isPaging="true"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                :gridPageData="gridPageData"
                @selectionchange="onSelectionchange"
                @pageChangeEvent="pageChangeEvent"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @sortChangeHandler="sortChangeHandler"
                @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="ConfirmPop" />
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
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';

let myTitle;
let myMenuId;

let tmpI18n =
  localStorage.getItem('i18nVal') != null
    ? JSON.parse(localStorage.getItem('i18nVal'))
    : { text: 'Kor', id: 'ko', iso: 'ko-KR' };
let locale = tmpI18n.id == 'en' ? 'MENUNAME_EN' : 'MENUNAME';

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
    InputText,
    MesSelectBox,
    kbutton: Button,
  },
  data() {
    return {
      s_menuID: '', // 메뉴 ID 검색
      s_menuName: '', // 메뉴명 검색
      MenuSystemType: '', //메뉴구분 콤보박스
      LOCALECOLUMN: locale,
      treeData: [],
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'MENUNAME',
      },
      parentMenuID: '',
      headerParam: {
        gridid: 'dgvSFMenuList', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
      },
      gridHeader: [],
      treeActiveItem: {},
      gridPageData: {},
    };
  },

  created() {},
  async mounted() {
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
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    saveValidation() {
      const validation = this.gridData.filter(
        x => x.rowStat !== 'N' && !x.MENUID
      );
      if (validation.length > 0) {
        this.openAlert(
          this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00213')
        );
        return;
      }

      const dupChk = [];
      this.gridData.forEach(x => {
        if (x.rowStat !== 'N') {
          dupChk.push(x.MENUID);
        }
      });
      const dupArr = this.gridData.filter(
        x => x.rowStat === 'N' && dupChk.indexOf(x.MENUID) > -1
      );
      if (dupArr.length > 0) {
        this.openAlert(
          this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00214')
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
          ); /* ('저장', '저장되었습니다.') */
          this.initTree();
          this.getGridData(this.parentMenuID);
        } else {
          this.openAlert(
            'error',
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')
          ); /* ('오류가 발생했습니다.') */
        }
      } else {
        this.openAlert(
          this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        ); /* ('저장', '저장할 데이터가 존재하지 않습니다.') */
      }
    },
    //그리드 데이터 가져오기
    async getGridData(treeId = '') {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetSFMenuListDtl',
        queryVersion: '00001',
        sendParam: {
          parentMenuID: treeId,
          plantid: this.$auth.$state.user.plantId,
          MENUTYPE: this.MenuSystemType,
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
        this.gridOriData = data;
        this.gridPageData = paging;
        this.gridData = data;
        this.$refs.rowGrid.skip = 0;
      });
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
    comboChange(nm, val) {
      this[nm] = val;
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
    //트리 데이터 가져오기
    async initTree() {
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSFMenuList',
        sendParam: {
          parentsID: '',
          plantid: this.$auth.$state.user.plantId,
          menuID: this.s_menuID,
          menuName: this.s_menuName,
          MENUTYPE: this.MenuSystemType,
        },
      });

      const data = res.map(x => ({ ...x, expanded: true }));

      this.treeData = utils.makeTreeDataForMenu(data);
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    //트리 클릭
    onItemClick(event) {
      this.getGridData(event.item.MENUID); // 데이터 없을경우 NullPointerException
      this.parentMenuID = event.item.MENUID;
      this.treeActiveItem = event.item;
    },
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
        PARENTMENUID: this.parentMenuID ? this.parentMenuID : null,
        _ROWSTATUS: 'C',
        newRowUUid: newRowUUid,
        MENUID: '',
        USEFLAG: 'Yes',
        MENUNAME: '',
        MENUTYPE: '',
        URL: '',
        MENUNAME_EN: '',
        ICONCLASS: '',
        PARENTSID:
          this.parentMenuID == this.$auth.$state.user.plantId
            ? ''
            : this.parentMenuID,
        POSITION: '',
        idx: this.gridData.length,
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    delConfirm() {
      const chk = [];
      this.gridData.forEach(e => {
        if (e.selected) {
          chk.push(e.MENUID);
        }
      });

      this.$refs.ConfirmPop.title = this.$i18n.t(
        'MES_CommLang.MES_CommLang_00412'
      ); /* 삭제 */
      this.$refs.ConfirmPop.message =
        this.$i18n.t('MES_CommLang.MES_CommLang_00106') +
        '(' +
        chk.join() +
        ') : ' +
        this.$i18n.t(
          'MES_MsgLang.MES_MsgLang_00089'
        ); /* 선택한 데이터를 삭제 하시겠습니까? */
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
        reeId['POSITION']['USEFLAG']
      );
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetSFMenuListDtl',
        sendParam: {
          parentMenuID: this.parentMenuID,
          plantid: this.$auth.$state.user.plantId,
          MENUTYPE: this.MenuSystemType,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetSFMenuListDtl',
        sendParam: {
          parentMenuID: this.parentMenuID,
          plantid: this.$auth.$state.user.plantId,
          MENUTYPE: this.MenuSystemType,
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
