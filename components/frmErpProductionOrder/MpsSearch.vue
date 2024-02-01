<template>
    <div :style="{ height: '100%' }">
        <v-row ref="contents" no-gutters :style="{ height: '100%' }">
            <v-col :cols="12" :style="{ height: '100%' }">
                <div ref="divWrapper1" :style="{ height: '100%' }">
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
                    />
                </div>
            </v-col>
        </v-row>
    </div>
  </template>
  <script>
  import mixinGlobal from '@/mixin/global.js';
  import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
  import KendoGrid from '@/components/common/KendoGrid';
  import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
  import { Button } from '@progress/kendo-vue-buttons';
  import AlertPop from '../../components/common/modal/AlertPop.vue';
  
  export default {
    name: 'MpsSearch',
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
            gridid : 'dgvErpProductionOrder',
            noRowstat: true,
            noFirstCheck: true,
            gridHeader:[],
            xOverflowYn: true,
        },
      };
    },
    created() {},
    async mounted() {
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper1);
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
                queryId: 'GetMpsSearchList',
                sendParam: {                    
                    WORKCENTER:this.sendParam.workCenterValue,
                    PRODUCTID:this.sendParam.productId,
                    STARTDATE:this.DateToYYYYMMDDString(this.sendParam.startDate),
                    ENDDATE:this.DateToYYYYMMDDString(this.sendParam.endDate),
                    skip: skip,
                    take: take,
                },
            }).then(({list, paging, ...x}) => {
                const data = list.map((x, idx) => {
                    return {
                        ...x,
                        idx: idx,
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

        rowClass(props) {
            return props.dataItem.TOTALROW;
        },

        excel(){
            this.excelGet({
                apiKey: 'mes/excel/customquery',
                queryId: 'GetMpsSearchList',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    gridid: this.headerParam.gridid,
                    WORKCENTER:this.sendParam.workCenterValue,
                    PRODUCTID:this.sendParam.productId,
                    STARTDATE:this.DateToYYYYMMDDString(this.sendParam.startDate),
                    ENDDATE:this.DateToYYYYMMDDString(this.sendParam.endDate),
                },
            });
        },
        pagingExcel() {
            const {skip=0, take=20} = this.gridPageData;
            this.excelGet({
                apiKey: 'mes/excel/customquerypaging',
                queryId: 'GetMpsSearchList',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    gridid: this.headerParam.gridid,
                    WORKCENTER:this.sendParam.workCenterValue,
                    PRODUCTID:this.sendParam.productId,
                    STARTDATE:this.DateToYYYYMMDDString(this.sendParam.startDate),
                    ENDDATE:this.DateToYYYYMMDDString(this.sendParam.endDate),
                    skip: skip,
                    take: take,
                },
            });
        },
    },
  };

</script>