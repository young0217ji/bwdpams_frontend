<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00674") }}</li> <!-- 전사 Calendar 조회 -->
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
                        <DatePicker ref="workFromDate" :default-value="new Date(workFromDate)" :dataNm="'workFromDate'"
                          :format="'yyyy-MM-dd'" @change="fromChange" />
                      </div>
                      <span class="i_tilde">~</span>
                      <div class="form-datepicker">
                        <DatePicker ref="workToDate" :default-value="new Date()" :dataNm="'workToDate'"
                          :format="'yyyy-MM-dd'" @change="toChange" />
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col :sm="2" :lg="2" align="right">
                  <Button :theme-color="'primary'" icon="search" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277")
                  }}</Button> <!-- 조회 -->
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <v-row ref="contents">
        <v-col :sm="12" :lg="12" :class="'divListWapper'" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00675") }}</CardTitle> <!-- 전사 Calendar 목록 -->
                </v-col>
              </v-row>
              <div ref="divWrapper2" style="height: calc(100% - 33px);">
                <KendoGrid ref="CalendarGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                  :columns="headerParam.gridHeader" :checkHeaderArr="headerParam.checkBox" :resizable="true" :isPaging="true" :selected-field="selectedField" />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid"
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import InputText from "@/components/common/input/InputText";
  import { DropDownList } from "@progress/kendo-vue-dropdowns";
  import { DatePicker } from "@progress/kendo-vue-dateinputs";
  
  let myTitle;
  let myMenuId;
  
  
  const d = new Date();
  let year = d.getFullYear(); // 년
  let month = d.getMonth();   // 월
  let day = d.getDate();      // 일
  
  export default {
    mixins: [mixinGlobal, multiGridHeaderMinin],
    async asyncData(context) {
      const myState = context.store.state;
      myMenuId = context.route.query.menuId;
      await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
      myTitle = await myState.activeMenuInfo.menuName;
    },
    meta: {
      title: () => {
        return myTitle;
      },
      menuId: myMenuId,
      closable: true
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
      DatePicker
    },
    data() {
      return {
        workFromDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
        workToDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
        gridHeight: '100px',
        selectedField: 'selected',
        line: [],
        columns: [],
        workCenter: [],
        gridData: [],
        gridOriData: [],
        equipmentid: '',
        equipmentname: '',
        value: '',                    /* Line */
        value2: { id: '', text: '' }, /* WorkCenter */
  
        headerParam: {
          gridid: "dgvSFCalendar", // 그리드 ID
          rowStat: '',
          gridHeader: [],
          noRowstat: true,
          noFirstCheck: true,
          xOverflowYn: false,
          checkBox: [],
        },
      };
    },
    created() {
    },
    async mounted() {
      this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
      await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper2, this.customDropDown);
      await this.getGridData();
    },
  
    watch: {
    },
    methods: {
      // 그리드 데이터 가져오기
      async getGridData() {
        this.gridOriData = [];
        this.gridData = [];
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetSFCalendar',
          queryVersion: '00001',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            STARTTIME: this.workFromDate,
            ENDTIME: this.workToDate,
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
          //GIRD input v-model초기화, chkbox초기화 위해 추가
          this.$nuxt.$emit('iccReset');
          this.gridOriData = data;
          this.gridData = data;

          this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    HOLIDAYFLAG: x.HOLIDAYFLAG === "X" ? "Yes" : "No",
                };
            });
        });
      },
  
      
      async searchBtn() {
        this.getGridData();
      },
      searchInput(nm, val) {
        this[nm] = val;
      },
     
      fromChange(e) {
        this.workFromDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
      },
      toChange(e) {
        this.workToDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
      },
    }
  };
  const defaultData = {
  };
  </script>
  <style lang="scss"></style>