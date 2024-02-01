<template>
    <div :style="{ height: '100%' }">
        <v-row ref="contents" no-gutters :style="{ height: '100%' }">
            <v-col :cols="12" :style="{ height: '100%' }">
                <div ref="divWrapper2" :style="{ height: '100%' }">
                    <KendoGrid
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :gridPageData="gridPageData"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :selected-field="selectedField"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :scrollable="true"
                    :rowClass="rowClass"
                    @pageChangeEvent="pageChangeEvent"
                    @gridrowclick="onRowClick"
                    @selectionchange="onSelectionChange"
                    />
                </div>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
    </div>
  </template>
  <script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import AlertPop from '@/components/common/modal/AlertPop.vue';

export default {
name: 'ResultSearch',
mixins: [mixinGlobal, multiGridHeaderMinin],
components: {
    Card,
    Button,
    AlertPop,
    CardBody,
    CardTitle,
    KendoGrid,
},
props: {
    sendParam:{
        type:Object,
        default:{},
    }
},
data() {
    return {
    gridHeight: '100px',
    selectedField: 'selected',
    gridData: [],
    gridPageData: {},
    headerParam: {
        gridid : 'dgvResultSearchList',
        noRowstat: true,
        gridHeader:[],
        xOverflowYn: true,
        },
    };
},
created() {},
async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper2);
    await this.getGridData();
},
computed: {
},
watch: {},
methods: {
    // 조회
    async getGridData() {
        const {skip=0, take=20} = this.gridPageData;
        this.mesGet({
            apiKey: 'mes/common/customquerypaging',
            queryId: 'GetResultSearchList',
            sendParam: {
                PLANTID: this.$auth.$state.user.plantId,
                WORKCENTER:this.sendParam.workCenterValue,
                PRODUCTID:this.sendParam.productId,
                STARTDATE:this.DateToYYYYMMDDString(this.sendParam.startDate),
                ENDDATE:this.DateToYYYYMMDDString(this.sendParam.endDate),
                PLANVERSION: this.sendParam.planVersionValue,
                skip: skip,
                take: take,
            },
        }).then(({list, paging, ...x}) => {
            const data = list.map((x, idx) => {
                return {
                    ...x,
                    idx: idx,
                    selected: x.CHECKFLAG=='Yes',
                };
            });
            
            //GIRD input v-model초기화, chkbox초기화 위해 추가
            this.$nuxt.$emit('iccReset');
            this.gridPageData = paging;
            this.gridData = data;
        });
    },

    // 페이지 변경
    async pageChangeEvent(skip=0, take=20) {
        this.gridPageData = {
            skip: skip,
            take: take
        }
        this.reSetPage = false;
        this.getGridData();      
    },

    // GRID ROW 클릭 
    onRowClick(event) {
        if(!this.isNullOrEmpty(event.dataItem.TOTALROW)){
            return;
        }
        const selectedIdx = event.dataItem.idx;
        this.gridData = this.gridData.map(item => {
            return {
            ...item,
            selected: item.idx === selectedIdx ? !item.selected : item.selected,
            };
        });
    },

    // GRID CHECKBOX 클릭
    onSelectionChange(event){
        if(!this.isNullOrEmpty(event.dataItem.TOTALROW)){
            event.event.target.checked = false;
            return;
        }
        event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    // ERP 전송
    async erpBtn(){
        console.log('btn');
    },

    rowClass(props) {
        return props.dataItem.TOTALROW;
    },

    excel(){
        this.excelGet({
            apiKey: 'mes/excel/customquery',
            queryId: 'GetResultSearchList',
            sendParam: {
                plantid: this.$auth.$state.user.plantId,
                gridid: this.headerParam.gridid,
                WORKCENTER:this.sendParam.workCenterValue,
                PRODUCTID:this.sendParam.productId,
                STARTDATE:this.DateToYYYYMMDDString(this.sendParam.startDate),
                ENDDATE:this.DateToYYYYMMDDString(this.sendParam.endDate),
                PLANVERSION: this.sendParam.planVersionValue,
            },
        });
    },
    pagingExcel() {
        const {skip=0, take=20} = this.gridPageData;
        this.excelGet({
            apiKey: 'mes/excel/customquerypaging',
            queryId: 'GetResultSearchList',
            sendParam: {
                plantid: this.$auth.$state.user.plantId,
                gridid: this.headerParam.gridid,
                WORKCENTER:this.sendParam.workCenterValue,
                PRODUCTID:this.sendParam.productId,
                STARTDATE:this.DateToYYYYMMDDString(this.sendParam.startDate),
                ENDDATE:this.DateToYYYYMMDDString(this.sendParam.endDate),
                PLANVERSION: this.sendParam.planVersionValue,
                skip: skip,
                take: take,
            },
        });
    },
},
};

</script>