<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!--홈-->
      <li>{{ $t('MES_CommLang.MES_CommLang_00492') }}</li>
      <!--시스템유지-->
      <li>{{ $t('MES_CommLang.MES_CommLang_00916') }}</li>
      <!--공지사항-->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00920') }}</label
                    ><!-- 제목 -->
                    <inputText
                      ref="title"
                      :boxWidth="'100%'"
                      :dataNm="'title'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00279') }}</label>
                    <!-- 조회기간 -->
                    <div class="form-datepicker">
                      <DatePicker
                        ref="startDate"
                        :default-value="new Date(startDate)"
                        :dataNm="'startDate'"
                        :format="'yyyy-MM-dd'"
                        @change="selectStartDate"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="endDate"
                        :default-value="new Date()"
                        :dataNm="'endDate'"
                        :format="'yyyy-MM-dd'"
                        @change="selectEndDate"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group"></div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  @click="writeCall"
                  >{{ $t('MES_CommLang.MES_CommLang_00917') }}</Button
                >
                <!-- 글작성 -->
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
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00918')
                }}</CardTitle>
                <!-- 글목록 -->
              </v-col>
              <v-col cols="6" align="right">
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
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :isPaging="true"
                :gridDropDownList="headerParam.enumComboBox"
                :gridPageData="gridPageData"
                @sortChangeHandler="sortChangeHandler"
                @rowdblclick="rowDoubleClick"
                @gridddchang="rowDdChange"
                @pageChangeEvent="pageChangeEvent"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <writePopUp
      ref="writePopUp"
      v-if="writePopupVisible"
      :visibleDialog="writePopupVisible"
      :title="writePopupTitle"
      :selected-field="selectedField"
      :initData="initData"
      :callBack="() => {}"
      @visibleDialog="val => (writePopupVisible = val)"
      @returnSave="returnSave"
      @returnCancel="returnCancel"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import InputText from '@/components/common/input/InputText';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { Button } from '@progress/kendo-vue-buttons';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import writePopUp from '@/components/frmNtc/writePopUp';

let myTitle;
let myMenuId;

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일

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
    KendoGrid,
    InputText,
    DropDownList,
    MesSelectBox,
    DatePicker,
    writePopUp,
    kbutton: Button,
  },
  data() {
    return {
      gridData: [],
      gridOriData: [],
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvNotice', // 그리드 ID
        gridHeader: [],
        rowStat: '',
        noRowstat: true,
        noFirstCheck: true,
        enumComboBox: [],
      },
      title: '',
      startDate: Utility.setFormatDate(
        new Date(year - 1, month, day),
        'YYYY-MM-DD'
      ),
      endDate: Utility.setFormatDate(new Date(), 'YYYY-MM-DD'),
      writePopupTitle: '',
      writePopupVisible: false,
      initData: {},
      gridPageData: {},
    };
  },
  created() {},
  async mounted() {
    this.writePopupTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00917');
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
    // 조회버튼 클릭
    searchBtn() {
      this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetNtcList',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          TITLE: this.title,
          STARTDATE: Utility.setFormatDate(this.startDate, 'YYYY-MM-DD'),
          ENDDATE:
            Utility.setFormatDate(this.endDate, 'YYYY-MM-DD') + ' 23:59:59',
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
        this.gridOriData = JSON.parse(JSON.stringify(data));
        this.gridPageData = paging;
        this.gridData = data;
        this.$refs.rowGrid.skip = 0;
      });
    },
    onRowClick(event) {
      this.onSelectionchange(event);
    },
    rowDoubleClick(event) {
      this.initData = event.dataItem;
      this.writePopupVisible = true;
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

    // 기간 - 시작일 선택
    selectStartDate(event) {
      this.startDate = Utility.setFormatDate(event.value, 'YYYY-MM-DD');
    },
    // 기간 - 종료일 선택
    selectEndDate(event) {
      this.endDate = Utility.setFormatDate(event.value, 'YYYY-MM-DD');
    },

    writeCall() {
      this.initData = '';
      this.writePopupVisible = true;
    },

    returnSave(res) {
      if (res) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
        ); /* 알림, 저장되었습니다. */
        this.getGridData();
      }
    },
    returnCancel(res) {
      if (res) {
        this.getGridData();
      }
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
        queryId: 'GetNtcList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          TITLE: this.title,
          STARTDATE: Utility.setFormatDate(this.startDate, 'YYYY-MM-DD'),
          ENDDATE:
            Utility.setFormatDate(this.endDate, 'YYYY-MM-DD') + ' 23:59:59',
          gridid: this.headerParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetNtcList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          TITLE: this.title,
          STARTDATE: Utility.setFormatDate(this.startDate, 'YYYY-MM-DD'),
          ENDDATE:
            Utility.setFormatDate(this.endDate, 'YYYY-MM-DD') + ' 23:59:59',
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
