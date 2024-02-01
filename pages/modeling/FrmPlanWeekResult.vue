<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00678") }}</li> <!-- 주간 생산계획 조회 -->
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
                        ref="cmbPlanOper"
                        :style="{ width: '250px' }"
                        :data-items="planOperList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="planOperValue"
                        @change="selectPlanOper"
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
                        :value="startDate"
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
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                  ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :isPaging="false"
                    :scrollable="true"
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
import DateUtility from '~/plugins/dateUtility';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
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
  mixins: [mixinGlobal, gridHeaderMinin],
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
      planOperList: [],
      planOperValue: '',
      selectedField: "selected",
      headerParam: [
        { field: 'PRODUCTORDERTYPE', title: 'Type', width: '80px', editable: false },
        { field: 'PRODUCTID', title: '품번', width: '100px', editable: false },
        { field: 'PRODUCTNAME', title: '품명', width: '200px', editable: false },
        { field: 'PLANOPERNAME', title: '공정명', width: '100px', editable: false},
      ],  
      oriHeaderParam: [
        { field: 'PRODUCTORDERTYPE', title: 'Type', width: '80px', editable: false },
        { field: 'PRODUCTID', title: '품번', width: '100px', editable: false },
        { field: 'PRODUCTNAME', title: '품명', width: '200px', editable: false},
        { field: 'PLANOPERNAME', title: '공정명', width: '100px', editable: false },
      ],
      startDate: new Date(),
      endDate: new Date(),
    }
  },
  created() {
    this.todate = Utility.setFormatDate(new Date(), 'YYYY-MM-DD');
    this.fromdate = Utility.setFormatDate(
      DateUtility.addDate(-7, null, new Date()),
      'YYYY-MM-DD'
    );
  },
  async mounted() {
    await this.getPlanOperListData();
  },
  computed: {

  },
  watch: {},
  methods: {


    // 계획공정 콤보 선택
    async getPlanOperListData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPlanOperList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
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
        for(let i = 0; i < data.length; i++){
          if(i < data.length){
            this.planOperList.push({ id : data[i].PLANOPERID, text : data[i].PLANOPERNAME });
            this.planOperValue = this.planOperList[0].id;
          }
        }
      })
    },

    // 계획공정 콤보 선택
    selectPlanOper(event) {
      this.planOperValue = event.value;
    },



    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.endDate = event.value;
    },

    async searchBtn() {
      this.getGridData();
    },

    // 그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      this.headerParam = [];
      this.oriHeaderParam.map((x) => {
        this.headerParam.push(x);
      });

      let start = new Date(this.startDate);
      let end = this.endDate;
      let datePivotString = [];
      while(start<=end) {
        datePivotString.push("[DATE"+this.DateToYYYYMMDDString(start)+"]");

        const item = {
                field: "DATE"+this.DateToYYYYMMDDString(start),
                title: this.DateToYYYYMMDDString(start).substring(4,6)+'/'+this.DateToYYYYMMDDString(start).substring(6,8),
                width: 80,
            };
            this.headerParam.push(item);
            start.setDate(start.getDate()+1);
      }

      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
            queryId: 'GetPlanWeekResultList',
            sendParam: {
                plantID: this.$auth.$state.user.plantId,
                PLANENDTIME: encodeURI(datePivotString.toString()),
                PLANOPERID: this.$refs.cmbPlanOper.value.id,
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
        this.gridData = JSON.parse(JSON.stringify(data));
      });
    }, 
  },






}

</script>