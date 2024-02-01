<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00162") }}</li> <!-- 생산관리 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00689") }}</li> <!-- MES Lot 조회 -->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row ref="searchFilter" no-gutters>
                            <v-col :sm="9" :lg="10" align="left">
                                <div class="form-group-wrap">
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00544") }}</label> <!-- 품번그룹 -->
                                        <DropDownList ref="cmbProGroup" :style="{ width: '250px' }"
                                            :data-items="productGroup" :text-field="'text'" :data-item-key="'id'"
                                            :value="value" @change="selectProGroup">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00264") }}</label> <!-- 품번구분 -->
                                        <MesSelectBox ref="producttype" :enumID="'ProductionType'" :allYN="true"
                                            :dataNm="'ProductionType'"  @comboChange="comboChange">
                                        </MesSelectBox>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00258") }}</label><!--품번-->
                                        <InputText :dataNm="'productId'" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</label><!--품명-->
                                        <InputText :dataNm="'productName'" @input-text-set="searchInput" />
                                    </div>

                                    <div class="form-group">
                                        <label>기간</label>
                                        <div class="form-datepicker">
                                            <DatePicker ref="startDate" :default-value="new Date(startDate)"
                                                :format="'yyyy-MM-dd'" @change="fromChange" :dataNm="'startDate'"/>
                                        </div>
                                        <span class="i_tilde">~</span>
                                        <div class="form-datepicker">
                                            <DatePicker ref="endDate" :default-value="new Date()"
                                                :format="'yyyy-MM-dd'" @change="toChange" :dataNm="'endDate'"/>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col :sm="3" :lg="2" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00277") }}</Button><!--조회-->
                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <v-row ref="contents">
            <v-col :sm="12" :lg="12" :class="'divListWapper'" :style="{ height: '50%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00529") }}</CardTitle> <!-- W/O 정보 -->
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                                :edit-field="'inEdit'" :columns="headerParam.gridHeader" :resizable="true" :isPaging="false"
                                :selected-field="selectedField" @gridrowclick="onRowClick"
                                @sortChangeHandler="sortChangeHandler" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
            <v-col :sm="12" :lg="3" :class="'divListWapper2'" :style="{ height: '50%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00688") }}</CardTitle> <!-- 공정 목록 -->
                            </v-col>
                        </v-row>
                        <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData2" :sortable="true"
                                :edit-field="'inEdit'" :columns="headerParam2.gridHeader" :resizable="true" @gridrowclick="onRowClick2"
                                :isPaging="false" :selected-field="selectedField" @sortChangeHandler="sortChangeHandler" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
            <v-col :sm="12" :lg="9" :class="'divListWapper3'" :style="{ height: '50%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00687") }}</CardTitle> <!-- Lot 상세 -->
                            </v-col>
                        </v-row>
                        <div ref="divWrapper3" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData3" :sortable="true"
                                :edit-field="'inEdit'" :columns="headerParam3.gridHeader" :resizable="true"
                                :isPaging="false" :selected-field="selectedField" @sortChangeHandler="sortChangeHandler" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
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
import MesSelectBox from '@/components/common/select/MesSelectBox';

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
        DatePicker,
        MesSelectBox
    },
    props: {
        gridHeight: {
            type: String,
            defaultData: "500px",
        },
    },
    data() {
        return {
            startDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
            endDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            gridData: [],
            gridData2: [],
            gridData3: [],
            headerParam: {
                gridid: "dgvWorkOrderLists", // 그리드 ID
                gridHeader: [],
                enumComboBox: [],
                noRowstat: true,
                noFirstCheck: true,
                xOverflowYn: true,
            },
            headerParam2: {
                gridid: "dgvProcessLists", // 그리드 ID
                gridHeader: [],
                rowStat: '',
                noRowstat: true,
                noFirstCheck: true,
                xOverflowYn: true,
            },
            headerParam3: {
                gridid: "dgvLotDetails", // 그리드 ID
                gridHeader: [],
                rowStat: '',
                noRowstat: true,
                noFirstCheck: true,
                xOverflowYn: true,
            },
            gridHeader: [],
            selectedField: 'selected',
            productGroup: [],
            value: '',
            productId: '',
            ProductionType: '',
        };
    },
    created() {
    },
    async mounted() {
        await this.getProductGroupData();
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper, this.customDropDown);
        await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
        await this.getHeaderMulti(this.headerParam3, this.$refs.divWrapper3);
        await this.getGridData();
    },
    watch: {},
    methods: {
        async getProductGroupData() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetProductGroupList',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                },
            }).then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.productGroup.push({ id: res[i].PRODUCTGROUPID, text: res[i].PRODUCTGROUPNAME });
                        this.value = this.productGroup[0];
                    }
                }
            });
        },
        selectProGroup(event) {
            this.value = event.value;
        },
        searchInput(nm, val) {
            this[nm] = val;
        },
        fromChange(e) {
            this.startDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange(e) {
            this.endDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        comboChange(nm, val) {
            this[nm] = val;
        },
        async searchBtn() {
            this.getGridData();
        },
        // 그리드 데이터 가져오기
        async getGridData() {
            this.gridData = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetWorkOrderList',
                queryVersion: '00004',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    productgroupid: this.value.id,
                    productid: this.productId,
                    PRODUCTNAME: this.productName,
                    PRODUCTIONTYPE: this.ProductionType,
                    FROMDATE: this.startDate,
                    TODATE: this.endDate,
                },
            }).then(res => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: 'N',
                        selected: false,
                        idx: idx,
                        inEdit: true,
                        resizable: true,
                    }
                });
                //GIRD input v-model초기화, chkbox초기화 위해 추가
                this.$nuxt.$emit('iccReset');
                this.gridData = data;

                if (this.gridData.length == 0) {
                    this.gridData2 = []
                    this.gridData3 = []
                }

                if(this.gridData.length != 0){
                    this.gridData[0].selected = true;
                    this.getGridData2(this.gridData[0].WORKORDER);
                }
            });
        },
        async getGridData2(event) {
            this.gridData2 = [];
            this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetProcessList",
                queryVersion: '00003',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    workorder: event,
                },
            }).then((res) => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: "N",
                        selected: false,
                        idx: idx,
                        inEdit: true,
                        newRow: false,
                    };
                });
                this.$nuxt.$emit("iccReset");
                this.gridData2 = data;

                this.gridData2[0].selected = true;
                this.getGridData3(this.gridData2[0]);
            });
            
        },
        async getGridData3(event){
            this.gridData3 = [];
            this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetLotDetail",
                queryVersion: '00002',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    WORKORDER: event.WORKORDER,
                    PROCESSID : event.PROCESSID,
                },
            }).then((res) => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: "N",
                        selected: false,
                        idx: idx,
                        inEdit: true,
                        newRow: false,
                    };
                });
                this.$nuxt.$emit("iccReset");
                this.gridData3 = data;
            });
        },
        onRowClick(event) {
            this.gridData.forEach((x) => (x.selected = false));
            event.dataItem[this.selectedField] = true;
            this.selectedData = event.dataItem;
            this.getGridData2(event.dataItem.WORKORDER);

        },
        onRowClick2(event) {
            this.gridData2.forEach((x) => (x.selected = false));
            event.dataItem[this.selectedField] = true;
            this.selectedData = event.dataItem;
            this.getGridData3(event.dataItem);
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
    }
};
const defaultData = {};
</script>