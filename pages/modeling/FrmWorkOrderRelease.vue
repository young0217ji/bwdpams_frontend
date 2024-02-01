<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00685") }}</li> <!-- Work Order Release -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00055") }}</label> <!-- 공정명  -->
                      <DropDownList
                        :style="{ width: '250px' }"
                        :data-items="planOperList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="planOperValue"
                        @change="planOperChange"
                        >
                      </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00055") }}</label> <!-- 공정명  -->
                      <DropDownList
                        :style="{ width: '250px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="workCenterValue"
                        @change="workCenterChange"
                        >
                      </DropDownList>
                    </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회 기간 -->
                    <div class="form-datepicker">
                      <DatePicker
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date()"
                        :searchOption="true"
                        :value="startDate"
                        @change="selectStartDate"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date()"
                        :searchOption="true"
                        :value="endDate"
                        @change="selectEndDate"
                      />
                    </div>
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
                    <v-col cols="4" align="left">
                        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00685") }}</CardTitle><!--Work Order Release-->
                    </v-col>
                    <v-col cols="8" align="right">
                        <Button :theme-color="'primary'" :size="'small'" @click="releaseBtn">{{ $t("MES_CommLang.MES_CommLang_00686") }}</Button><!--저장-->
                    </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                  ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :isPaging="true"
                    :scrollable="false"
                    :reSetPage="this.reSetPage"
                    :gridPageData="gridPageData"
                    @pageChangeEvent=pageChangeEvent
                    @gridrowclick="rowClick"
                    @selectionchange="checkBoxClick"
                    @headerselectionchange="allCheckBoxClick"
                />
                </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <AlertPop 
        ref="alertPop"
        :is="'alertPop'"
      />
    </div>
</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import DateUtility from '~/plugins/dateUtility';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '../../components/common/input/InputText.vue';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';

let myTitle;
let myMenuId;


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
    DatePicker,
  },
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      planOperList: [],
      planOperValue: '',
      workCenterList: [{id:'', text:'-ALL-'}],
      workCenterValue: '',
      selectedField: "selected",
      headerParam:{
        gridid: 'dgvWorkOrderRelease',
        gridHeader: [],
        noRowstat: true,
      },
      reSetPage: false,
      
      startDate: new Date(),
      endDate: new Date(),
    }
  },
  created() {
  },
  async mounted() {
    await this.getComboData();
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
  },
  computed: {

  },
  watch: {},
  methods: {


    // 검색조건 Combo 데이터 가져오기
    async getComboData() {
        //공정
        this.mesGet({
            apiKey: 'mes/common/getqueryresult',
            queryId: 'GetPlanOperList',
            sendParam: {
            plantid: this.$auth.$state.user.plantId,
            }
        }).then(res => {
            res.map(x=> {
                this.planOperList.push({ id : x.PLANOPERID, text : x.PLANOPERNAME });
            });
            this.planOperValue = this.planOperList[0];
        });

        //라인
        this.mesGet({
            apiKey: 'mes/common/getqueryresult',
            queryId: 'GetAreaList',
            queryVersion: '00003',
            sendParam: {
                plantid: this.$auth.$state.user.plantId,
                AREATYPE: 'WorkCenter',
            },
        }).then(res => {
            res.map(x => {
                this.workCenterList.push({ id : x.CODE, text : x.NAME });
            });
            this.workCenterValue = this.workCenterList[0];
        });
    },

    // 검색조건 Combo 선택
    planOperChange(e) {
        this.planOperValue = e.value;
    },
    workCenterChange(e){
        this.workCenterValue = e.value;
    },
    
    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.endDate = event.value;
    },
    // 조회 버튼
    async searchBtn() {
        this.$nuxt.$emit("iccReset");
        this.reSetPage = true;
        this.gridPageData.skip = 0;
        await this.getGridData();
    },

    // 그리드 데이터 가져오기
    async getGridData() {
        let start = new Date(this.startDate);
        let end = this.endDate;
        const { skip = 0, take = 20 } = this.gridPageData;
        this.mesGet({
            apiKey: 'mes/common/getqueryresult',
            queryId: 'GetWorkOrderReleaseList',
            sendParam: {
                plantID: this.$auth.$state.user.plantId,
                PLANOPERID:this.planOperValue.id,
                WORKCENTER:this.workCenterValue.id,
                STARTDATE:this.DateToYYYYMMDDString(this.startDate),
                ENDDATE:this.DateToYYYYMMDDString(this.endDate),
                skip: skip,
                take: take,
            },
        }).then(res => {
            const data = res.map((x, idx) => {
                return {
                    ...x,
                    rowStat: 'N',
                    selected: false,
                    idx: idx,
                    inEdit: false,
                    newRow: false,
                    resizable: true,
                };
            });

        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
        this.gridPageData = {
            ...this.gridPageData,
            total: Number(this.isNullOrEmpty(data)?0:data[0].TOTAL),
        }
      });
    }, 
    // 그리드 페이지 변경
    async pageChangeEvent(skip=0, take=20) {
      this.gridPageData = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridData();
    },
    // Release 버튼
    releaseBtn(){
      const selectedData = this.gridData.filter(x => x.selected);
      const releaseData = this.gridData.filter(x => x.selected && x.PLANSTATUS=='1');

      if(selectedData.length != releaseData.length){
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00264')//Create 상태인 경우에만 Release 가능합니다.
        );
        return;
      }else{
        // RELEASE START
        






      }
        
    },
    // 그리드 row 클릭
    rowClick(event){
        const selectedIdx = event.dataItem.idx;
        this.gridData.filter(x => x.idx == selectedIdx).map(item => {
            item.selected = item.selected?false:true;
        })
    },
    // 그리드 Checkbox 클릭
    checkBoxClick(event){
        const selectedIdx = event.dataItem.idx;
        this.gridData.filter(x => x.idx == selectedIdx).map(item => {
            item.selected = item.selected?false:true;
        })
        this.headerParam.gridHeader.filter(x => x.field == 'selected').map(x => {
            x.headerSelectionValue = this.gridData.length == this.gridData.filter(x => x.selected).length;
        })
    },
    allCheckBoxClick(event){
        const checked = event.event.target.checked;
        this.gridData.map(x=> {
            x.selected = checked;
        });
    }
  },






}

</script>