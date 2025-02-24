<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00175') }}</li>
      <!-- 설비관리 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00610') }}</li>
      <!-- 예방보전 실적조회 -->
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
                      :style="{ width: '250px' }"
                      :data-items="line"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="value"
                      @change="comboChange"
                    >
                    </DropDownList>
                  </div>
                  <div class="form-group" style="margin-left: 5px">
                    <Label>WorkCenter</Label>
                    <DropDownList
                      ref="cmbWorkCenter"
                      :style="{ width: '200px' }"
                      :data-items="workCenter"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="value2"
                      @change="comboChange2"
                    >
                    </DropDownList>
                  </div>
                  <div class="form-group" style="margin-left: -5px">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00177') }}</label>
                    <!-- 설비코드 -->
                    <InputText
                      ref="equipmentid"
                      :boxWidth="'85%'"
                      :dataNm="'equipmentid'"
                      :disabled="false"
                      :defaultValue="equipmentid"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group" style="margin-left: -40px">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00171') }}</label>
                    <!-- 설비명 -->
                    <InputText
                      ref="equipmentname"
                      :boxWidth="'85%'"
                      :dataNm="'equipmentname'"
                      :disabled="false"
                      :defaultValue="equipmentname"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group" style="margin-top: 10px">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00279') }}</label>
                    <!--조회 기간-->
                    <div class="form-datepicker">
                      <DatePicker
                        ref="workFromDate"
                        :default-value="new Date(workFromDate)"
                        :dataNm="'workFromDate'"
                        :format="'yyyy-MM-dd'"
                        @change="fromChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="workToDate"
                        :default-value="new Date()"
                        :dataNm="'workToDate'"
                        :format="'yyyy-MM-dd'"
                        @change="toChange"
                      />
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
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00611')
                }}</CardTitle>
                <!-- 예방보전 목록-->
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
            <div ref="divWrapper2" style="height: calc(100% - 33px)">
              <KendoGrid
                ref="PMReport"
                :gridHeight="gridHeight"
                :gridItems="gridDataPMReport"
                :sortable="true"
                :gridPageData="gridPageData"
                :columns="PMReportParam.gridHeader"
                :resizable="true"
                :isPaging="true"
                :selected-field="selectedField"
                @pageChangeEvent="pageChangeEvent"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
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

let myTitle;
let myMenuId;

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
    kbutton: Button,
  },
  data() {
    return {
      workFromDate: Utility.setFormatDate(
        new Date(year, month, day - 7),
        'YYYY-MM-DD'
      ),
      workToDate: Utility.setFormatDate(new Date(), 'YYYY-MM-DD'),
      gridHeight: '100px',
      columns: [],
      gridDataPMReport: [],
      gridOriDataPMReport: [],
      selectedField: 'selected',
      equipmentname: '',
      equipmentid: '',
      line: [],
      workCenter: [],
      value: '' /* Line */,
      value2: { id: '', text: '' } /* WorkCenter */,
      PMReportParam: {
        gridid: 'dgvEquipmentPMReport', // 그리드 ID
        rowStat: '',
        gridHeader: [],
        noRowstat: true,
        noFirstCheck: true,
        xOverflowYn: true,
      },
      gridPageData: {},
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(
      this.PMReportParam,
      this.$refs.divWrapper2,
      this.customDropDown
    );
    this.getComboData();
    await this.getEquipmentGridData();
    this.value2.text = this.$i18n.t(
      'MES_CommLang.MES_CommLang_00501'
    ); /* 전체 */
  },

  watch: {},
  methods: {
    // 실적조회 그리드 데이터 가져오기
    async getEquipmentGridData() {
      this.gridOriDataPMReport = [];
      this.gridDataPMReport = [];
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetPMReport',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          EQUIPMENTID: this.equipmentid,
          EQUIPMENTNAME: this.equipmentname,
          PMSTARTTIME: this.workFromDate,
          PMENDTIME: this.workToDate,
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
        this.gridOriDataPMReport = data;
        this.gridPageData = paging;
        this.gridDataPMReport = data;
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
    async searchBtn() {
      this.getEquipmentGridData();
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

    fromChange(e) {
      this.workFromDate = Utility.setFormatDate(e.value, 'YYYY-MM-DD');
    },
    toChange(e) {
      this.workToDate = Utility.setFormatDate(e.value, 'YYYY-MM-DD');
    },
    async pageChangeEvent(skip = 0, take = 20) {
      this.gridPageData = {
        skip: skip,
        take: take,
      };
      this.reSetPage = false;
      this.getEquipmentGridData();
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetPMReport',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          EQUIPMENTID: this.equipmentid,
          EQUIPMENTNAME: this.equipmentname,
          PMSTARTTIME: this.workFromDate,
          PMENDTIME: this.workToDate,
          gridid: this.PMReportParam.gridid,
          gridqueryversion: '00001',
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetPMReport',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          EQUIPMENTID: this.equipmentid,
          EQUIPMENTNAME: this.equipmentname,
          PMSTARTTIME: this.workFromDate,
          PMENDTIME: this.workToDate,
          gridid: this.PMReportParam.gridid,
          gridqueryversion: '00001',
          skip: skip,
          take: take,
        },
      });
    },
  },
};
const defaultData = {};
</script>
<style lang="scss"></style>
