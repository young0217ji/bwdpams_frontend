<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00074') }}</li>
      <!-- 기준정보 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00546') }}</li>
      <!-- 도급업체작업자관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap"></div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}</Button
                >
                <!--조회-->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00547')
                }}</CardTitle>
                <!-- 작업자 목록 -->
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
                  @click="delBeforChk"
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
                :sortable="true"
                :gridPageData="gridPageData"
                :columns="headerParam.gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :customCell="customCell"
                :isPaging="true"
                :checkHeaderArr="checkHeaderArr"
                @sortChangeHandler="sortChangeHandler"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop
      :is="'confirmPop'"
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import InputText from '@/components/common/input/InputText';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';

let myTitle;
let myMenuId;

export default {
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
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
  },
  data() {
    return {
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      saveOriData: [],
      // gridHeader: [],
      checkHeaderArr: ['USEFLAG'],
      USEFLAG: '',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvSubContract', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        gridDropDownList: [
          {
            dataVal: 'WORKCENTER',
            dataItem: [],
            disable: false,
          },
          {
            dataVal: 'USERID',
            dataItem: [],
            disable: false,
          },
        ],
      },
      customCell: ['WORKCENTER', 'USERID'],
      customDropDown: true,
      gridPageData: {},
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
    await this.getGridComboList();
    await this.getGridData();
  },
  computed: {},
  watch: {},
  methods: {
    // 조회버튼 클릭
    searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      this.getGridData();
    },
    // 저장버튼 클릭
    async saveBtn() {
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
            }
          });
        });
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        ); /* 알림, 저장할 데이터가 없습니다.*/
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
        queryId: 'GetSubCont',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          skip: skip,
          take: take,
        },
      }).then(({ list, paging, ...x }) => {
        const data = list.map((x, idx) => {
          const customCell = {
            WORKCENTER: {
              type: 'text',
              // dataItem: this.headerParam.gridDropDownList[0].dataItem,
              disable: false,
              readonly: true,
            },
            USERID: {
              type: 'text',
              // dataItem: this.headerParam.gridDropDownList[1].dataItem,
              disable: false,
              readonly: true,
            },
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
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridOriData = data;
        this.gridData = data;
        console.log('this.gridData', this.gridData);
      });
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetSubCont',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetSubCont',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
          skip: skip,
          take: take,
        },
      });
    },
    //그리드 콤보박스 리스트가져오기
    async getGridComboList() {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00002',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(data => {
        console.log('data', data);
        const combo = data.map(x => {
          return {
            ENUMVALUE: x.CODE,
            ENUMVALUENAME: x.NAME,
          };
        });
        this.headerParam.gridDropDownList[0].dataItem = combo;
      }),
        await this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetUserList',
          queryVersion: '00004',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          },
        }).then(data => {
          console.log('data', data);
          const combo = data.map(x => {
            return {
              ENUMVALUE: x.USERID,
              ENUMVALUENAME: x.USERNAME,
            };
          });
          this.headerParam.gridDropDownList[1].dataItem = combo;
        });
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const rowData = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'USEFLAG') {
        e.value = e.value ? 'Yes' : 'No';
      }

      rowData[idx] = { ...rowData[idx], [name]: e.value };
      if (rowData[idx].rowStat === 'N') {
        rowData[idx].rowStat = 'U';
      }
      if (
        rowData[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.gridHeader,
          rowData,
          this.gridOriData,
          idx
        )
      ) {
        rowData[idx].rowStat = 'N';
      }

      this.gridData = rowData;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
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
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return (
          this.parseNullOrUndefinedToBlank(data[idx][x]) !==
            this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) &&
          x !== 'selected' &&
          x !== 'rowStat'
        );
        // return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    onRowClick(event) {
      // console.log("로우셀렉티드:::", event);
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },

    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: true,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        USEFLAG: 'Yes',
        DESCRIPTION: '',
        WORKCENTER: '',
        USERID: '',
        idx: this.gridData.length,
        newRowUUid: newRowUUid,
        customCell: {
          WORKCENTER: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[0].dataItem,
            disable: false,
          },
          USERID: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[1].dataItem,
            disable: false,
          },
        },
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    delBeforChk() {
      const delData = this.gridData
        .filter(x => x.selected === true)
        .map(x => {
          return {
            ...x,
          };
        });

      if (delData.length > 0) {
        if (delData.filter(x => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData
            .filter(x => x.rowStat !== 'C')
            .map(x => x.PRODUCTID);

          this.$refs['confirmPop'].title = 'info';
          this.$refs['confirmPop'].message =
            this.selected.WORKCENTER +
            ', ' +
            this.selected.USERID +
            ' - ' +
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); // 선택한 데이터를 삭제 하시겠습니까?
          this.$refs['confirmPop'].modalWidth = '300px';
          this.$refs['confirmPop'].visibleDialog = true;
          this.$refs['confirmPop'].callBack = this.delBtn;
        } else {
          this.delBtn();
        }
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')
        ); /* 알림, 선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.*/
        return;
      }
    },
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

    //검색 인풋
    searchInput(nm, val) {
      this[nm] = val;
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
