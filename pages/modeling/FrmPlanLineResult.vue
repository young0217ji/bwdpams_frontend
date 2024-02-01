<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00680") }}</li> <!-- 라인 생산계획 조회 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00052") }}</label> <!-- 공정  -->
                      <DropDownList
                        :style="{ width: '150px' }"
                        :data-items="planOperList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="sendParam.planOperValue"
                        @change="selectPlanOper"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00805") }}</label> <!-- 라인  -->
                      <DropDownList
                        :style="{ width: '150px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="sendParam.workCenterValue"
                        @change="selectWorkCenter"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회 기간 -->
                      <div class="form-datepicker">
                        <DatePicker
                          ref="startDate"
                          :format="'yyyy-MM-dd'"
                          :default-value="new Date()"
                          :searchOption="true"
                          :value="sendParam.startDate"
                          @change="selectStartDate"
                        />
                      </div>
                      <span class="i_tilde">~</span>
                      <div class="form-datepicker">
                        <DatePicker
                          ref="endDate"
                          :format="'yyyy-MM-dd'"
                          :default-value="new Date()"
                          :searchOption="true"
                          :value="sendParam.endDate"
                          @change="selectEndDate"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00806") }}</label> <!-- 계획 버전  -->
                      <DropDownList
                        :style="{ width: '150px' }"
                        :data-items="planVersionList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="sendParam.planVersionValue"
                        @change="selectPlanVersion"
                        >
                      </DropDownList>
                    </div>
                  </div>


                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button
                    :theme-color="'primary'"
                    :size="'medium'"
                    :icon="'search'"
                    @click="searchBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button 
                  > <!-- 조회 -->
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
              <v-row>
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" @click="excel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button><!--전체EXCEL-->
                  </v-col>
              </v-row>
                <TabStrip
                :selected="selected"
                @select="onSelect"
                :tabs="tabs"
                style="height: 100%"
              >
                <template v-slot:Time>
                  <Time
                    ref="Time"
                    :gridHeight="gridHeight"
                    :sendParam="sendParam"
                  />
                </template>
                <template v-slot:LineCapa>
                  <LineCapa
                    ref="LineCapa"
                    :gridHeight="gridHeight"
                    :sendParam="sendParam"
                  />
                </template>
                <template v-slot:Summary>
                  <Summary
                    ref="Summary"
                    :gridHeight="gridHeight"
                    :sendParam="sendParam"
                  />
                </template>
                <template v-slot:Suspense>
                  <Suspense
                    ref="Suspense"
                    :gridHeight="gridHeight"
                    :sendParam="sendParam"
                  />
                </template>
                <template v-slot:Plan>
                  <Plan
                    ref="Plan"
                    :gridHeight="gridHeight"
                    :sendParam="sendParam"
                  />
                </template>
              </TabStrip>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </div>
</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import { TabStrip } from "@progress/kendo-vue-layout";
import Plan from "@/components/frmPlanLineResult/Plan";
import Time from "@/components/frmPlanLineResult/Time";
import LineCapa from "@/components/frmPlanLineResult/LineCapa";
import Suspense from "@/components/frmPlanLineResult/Suspense";
import Summary from "@/components/frmPlanLineResult/Summary";

let myTitle;
let myMenuId;


export default {
  mixins: [mixinGlobal],
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
    closable: true,
  },
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    DatePicker,
    TabStrip,
    Plan,
    Time,
    LineCapa,
    Suspense,
    Summary
  },
  data() {
    return {
      columns: [],
      gridHeight: "100%",
      gridData: [],
      gridOriData: [],
      planOperList: [],
      planOperValue: '',
      workCenterList: [],
      workCenterValue: '',
      planVersionList: [],
      planVersionValue: '',
      selectedField: "selected",
      sendParam:{
        planOperValue: '',
        workCenterValue: '',
        planVersionValue: '',
        startDate: new Date(),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+60),
      },
      selected: 0,
      tabs: [
        {title: this.$i18n.t('MES_CommLang.MES_CommLang_00816'), content: "Time"}, // 부하시간
        {title: this.$i18n.t('MES_CommLang.MES_CommLang_00817'), content: "LineCapa"}, // 라인 CAPA
        {title: this.$i18n.t('MES_CommLang.MES_CommLang_00820'), content: "Summary"}, // 라인별(요약)
        {title: this.$i18n.t('MES_CommLang.MES_CommLang_00822'), content: "Suspense"}, // 예상미결
        {title: this.$i18n.t('MES_CommLang.MES_CommLang_00159'), content: "Plan"}, // 생산계획
      ],
      TimeSearch:false,
      LineCapaSearch:false,
      SummarySearch:false,
      SuspenseSearch:false,
      PlanSearch:false,
      
      
    }
  },
  async mounted() {
    await this.getPlanOperListData();
    await this.getWorkCenterListData();
    await this.getPlanVersionListData();
    await this.$refs.Time.getGridData();
  },
  computed: {

  },
  watch: {},
  methods: {
    // 탭 선택
    onSelect(e) {
      this.selected = e.selected;
      if(this.selected === 0 && !this.TimeSearch){
        this.$refs.Time.getGridData();
        this.TimeSearch = true;
      }else if(this.selected === 1 && !this.LineCapaSearch){
          this.$refs.LineCapa.getGridData();
          this.LineCapaSearch = true;
      }else if(this.selected === 2 && !this.SummarySearch){
          this.$refs.Summary.getGridData();
          this.SummarySearch = true;
      }else if(this.selected === 3 && !this.SuspenseSearch){
          this.$refs.Suspense.getGridData();
          this.SuspenseSearch = true;
      }else if(this.selected === 4 && !this.PlanSearch){
          this.$refs.Plan.getGridData();
          this.PlanSearch = true;
      }
    },

    // 계획공정 콤보 데이터
    async getPlanOperListData() {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPlanOperList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
      }).then(res => {
        res.map(x=>{
          this.planOperList.push({ id : x.PLANOPERID, text : x.PLANOPERNAME })
        })
        this.sendParam.planOperValue = this.planOperList[2].id;
      })
    },

    // 계획공정 콤보 선택
    selectPlanOper(event) {
      this.sendParam.planOperValue = event.value;
    },

    // W/C 콤보 데이터
    async getWorkCenterListData(){
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00006',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        res.map(x=>{
          this.workCenterList.push({ id : x.CODE, text : x.NAME })
        })
        this.sendParam.workCenterValue = this.workCenterList[0].id;
      });
    },

    // W/C 콤보 선택
    selectWorkCenter(event) {
      this.sendParam.workCenterValue = event.value;
    },

    // 계획 버전 콤보 데이터
    async getPlanVersionListData(){
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPlanVersionList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        res.map(x=>{
          this.planVersionList.push({ id : x.PLANVERSION, text : x.PLANVERSION })
        })
        this.sendParam.planVersionValue = this.planVersionList[0]?.id;
      });
    },

    // 계획 버전 콤보 선택
    selectPlanVersion(event) {
      this.sendParam.planVersionValue = event.value;
    },

    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.sendParam.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.sendParam.endDate = event.value;
    },

    // 조회 버튼
    async searchBtn() {
      this.TimeSearch = false;
      this.LineCapaSearch = false;
      this.PlanSearch = false;
      this.SummarySearch = false;
      this.SuspenseSearch = false;

      if(this.selected === 0){
        this.$refs.Time.getGridData();
        this.TimeSearch = true;
      }else if(this.selected === 1){
        this.$refs.LineCapa.getGridData();
        this.LineCapaSearch = true;
      }else if(this.selected === 2){
        this.$refs.Summary.getGridData();
        this.SummarySearch = true;
      }else if(this.selected === 3){
        this.$refs.Suspense.getGridData();
        this.SuspenseSearch = true;
      }else if(this.selected === 4){
        this.$refs.Plan.getGridData();
        this.PlanSearch = true;
      }
      
    },

    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    },

    excel(){
      this.getPivotExcel(
        this.$refs[this.tabs[this.selected].content].headerParam,
        this.$refs[this.tabs[this.selected].content].gridData,
        this.tabs[this.selected].title.concat('_').concat(this.currentTimeStamp())
      )
    },
  },






}

</script>
