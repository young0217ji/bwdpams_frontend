<template>
    <div :style="{ height: '100%' }">
      <v-row ref="contents" no-gutters :style="{ height: '100%' }">
        <v-col :cols="12" :style="{ height: '100%' }">
          <v-row
            no-gutters
            :style="{height: '100%' }"
          >
            <v-col cols="12" :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100% '}">
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
                :rowClass="rowClass"
                @sortChangeHandler="sortChangeHandler"
                />
            </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <ConfirmPop ref="ConfirmPop" />
    </div>
  </template>
  <script>
  import mixinGlobal from '@/mixin/global.js';
  import KendoGrid from '@/components/common/KendoGrid';
  import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
  import { Button } from '@progress/kendo-vue-buttons';
  import AlertPop from '../../components/common/modal/AlertPop.vue';
  
  export default {
    name: 'Routing',
    mixins: [mixinGlobal],
    components: {
      Card,
      Button,
      AlertPop,
      CardBody,
      CardTitle,
      KendoGrid,
    },
    props: {
      sendParam: {
        type: Object,
        defaultData: '',
      },
      gridHeight:{
        type: String,
        defaultData: '',
      }
    },
    data() {
      return {
        columns: [],
        gridData: [],
        gridOriData: [],
        selectedField: 'selected',
        headerParam: [
            { field: 'PLANOPERNAME', title: this.$i18n.t('MES_CommLang.MES_CommLang_00052'), width: '100px', editable: false, className:"gridTextCenter" }, // 공정
            { field: 'WORKCENTERNAME', title: this.$i18n.t('MES_CommLang.MES_CommLang_00805'), width: '100px', editable: false, className:"gridTextCenter" }, // 라인
        ],  
        oriHeaderParam: [
            { field: 'PLANOPERNAME', title: this.$i18n.t('MES_CommLang.MES_CommLang_00052'), width: '100px', editable: false, className:"gridTextCenter" }, // 공정
            { field: 'WORKCENTERNAME', title: this.$i18n.t('MES_CommLang.MES_CommLang_00805'), width: '100px', editable: false, className:"gridTextCenter" }, // 라인

        ],
      };
    },
    created() {},
    async mounted() {
      
    },
    computed: {
    },
    watch: {},
    methods: {
      //그리드 데이터 가져오기
      async getGridData() {

        this.gridOriData = [];
        this.gridData = [];
        this.headerParam = [];
        this.oriHeaderParam.map((x) => {
            this.headerParam.push(x);
        });

        let start = new Date(this.sendParam.startDate);
        let end = this.sendParam.endDate;
        let datePivotString = [];
        while(Number(this.DateToYYYYMMDDString(start))<=Number(this.DateToYYYYMMDDString(end))) {
            datePivotString.push("[DATE"+this.DateToYYYYMMDDString(start)+"]");

            const item = {
                field: "DATE"+this.DateToYYYYMMDDString(start),
                title: this.DateToYYYYMMDDString(start).substring(4,6)+'/'+this.DateToYYYYMMDDString(start).substring(6,8),
                width: 80,
                className: "gridTextRight"
            };
            this.headerParam.push(item);
            start.setDate(start.getDate()+1);
        }


        this.mesGet({
        apiKey: 'mes/common/customquery',
            queryId: 'GetPlanLineSuspenseList',
            sendParam: {
                plantID: this.$auth.$state.user.plantId,
                PLANOPERID: this.sendParam.planOperValue,
                WORKCENTER: this.sendParam.workCenterValue,
                PLANVERSION: this.sendParam.planVersionValue,
                STARTDATE: this.DateToYYYYMMDDString(this.sendParam.startDate),
                ENDDATE : this.DateToYYYYMMDDString(this.sendParam.endDate),
            },
          }).then(res => {
            this.$nuxt.$emit('iccReset');
            this.gridData = res;
          });
      },
      sortChangeHandler(e) {
        this.gfn_sortChangeHandler(this.gridData, e);
      },
      rowClass(props) {
        return props.dataItem.TOTALROW;
      },
  
  
    },
  };
  
  const defaultData = {};
  </script>
  <style lang="scss"></style>
  