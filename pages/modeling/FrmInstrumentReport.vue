<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00804") }}</li> <!-- 긴급보전 이력조회 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group" style="margin-top: 10px;">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!--조회 기간-->
                    <div class="form-datepicker">
                      <DateInput :style="{ width: '45%' }"
                        :format="'yyyy'"
                        :steps="steps"
                        :spinners="true"
                        v-model="fromDt"
                        />
                    </div>
                  </div>
                </div>

              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t("MES_CommLang.MES_CommLang_00277") }} <!-- 조회 -->
                </kbutton>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="10" :lg="12" :style="{ height: '100%' }">
        <v-row :style="{ height: '100%' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }" no-gutters>
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00804") }}</CardTitle>
                    <!-- 계측기 이력조회 -->
                  </v-col>
                </v-row>
                <div ref="divWrapper" style="height: calc(100% - 33px);">
                  <KendoGrid ref="InstrumentReport" 
                  :gridHeight="gridHeight" 
                  :gridItems="gridData" 
                  :sortable="true"
                  :columns="headerParam.gridHeader" 
                  :resizable="false" 
                  :edit-field="'inEdit'" 
                  :isPaging="true"
                  :selected-field="selectedField" 
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" /> -->
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
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DateInput } from '@progress/kendo-vue-dateinputs';
import moment from "moment";

let myTitle;
let myMenuId;

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일


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
    DatePicker,
    DropDownList,
    DateInput,
  },
  data() {
    return {
      steps: { year: 1 },
      fromDt: new Date(),
      value : {},
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      gridLastModIdx: null,
      selectedField: 'selected',
      // checkHeaderArr: ['ACTIVESTATE'],
      headerParam: {
        gridid: 'dgvInstrumentReport', // 그리드 ID
        xOverflowYn : true, // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
        gridHeader: [],
        columns: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      reSetPage: false,
      selectedWorkFromDate:'',
      selectedWorkToDate:'',
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    this.selectedWorkFromDate = this.workFromDate;
    this.selectedWorkToDate = this.workToDate;
    this.FromDate = Utility.setFormatDate(new Date(), "YYYY-MM-DD");
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
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.reSetPage = true;
      this.getGridData();
    },
     
    //그리드 데이터 가져오기
    async getGridData() {
        this.gridOriData = [];
        this.gridData = [];
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetInstrumentChangeList',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            FROMDT: moment(this.fromDt).format('yyyy'),
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
          this.$nuxt.$emit('iccReset');
          this.gridOriData = data;
          this.gridData = data;
        });
      },


    async pageChangeEvent(skip=0, take=20) {
      this.gridPageData = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridData();
      
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

    searchInput(nm, val) {
        this[nm] = val;
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
