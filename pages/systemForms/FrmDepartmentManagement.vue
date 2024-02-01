<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
            <li>{{ $t("MES_CommLang.MES_CommLang_00492") }}</li><!--시스템유지-->
            <li>{{ $t("MES_CommLang.MES_CommLang_00295") }}</li> <!--부서관리-->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row>
                            <v-col :sm="9" :lg="10" align="left">
                                <div class="form-group-wrap">
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00480") }}</label><!-- 부서 ID -->
                                        <inputText ref="deptId" :boxWidth="'100%'" :dataNm="'deptId'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00477") }}</label><!-- 부서이름 -->
                                        <inputText ref="deptName" :boxWidth="'100%'" :dataNm="'deptName'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                </div>
                            </v-col>
                            <v-col :sm="3" :lg="2" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!--조회-->

                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <v-row ref="contents">
            <v-col :cols="12" :style="{ height: '100%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%' }">
                        <v-row>
                            <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00684") }}</CardTitle><!-- 부서목록 -->
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
                        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridItems="gridData" :sortable="true"
                                :columns="headerParam.gridHeader" :edit-field="'inEdit'" :selected-field="selectedField"
                                :gridDropDownList="headerParam.enumComboBox" :checkHeaderArr="headerParam.checkBox"
                                :gridPageData="gridPageData" :isPaging="true" @sortChangeHandler="sortChangeHandler" @pageChangeEvent="pageChangeEvent"
  />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" :callBack="() => { }" />
    </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { Button } from "@progress/kendo-vue-buttons";
import WarehouseMAPSetting from "@/components/FrmWarehouseDefinition/WarehouseMAPSetting";

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
        MesSelectBox,
        WarehouseMAPSetting,
        kbutton: Button,
    },
    data() {
        return {
            gridData: [],
            gridOriData: [],
            selectedField: "selected",
            headerParam: {
                gridid: "dgvDeptList", // 그리드 ID
                gridHeader: [],
                enumComboBox: [],
                rowStat: '',
                checkBox: [],
                noRowstat: true,
                noFirstCheck: true,
            },
            gridPageData: {},
            deptId: "",
            deptName: "",
        };
    },
    created() { },
    async mounted() {
        await this.getGridData();
    },
    computed: {
        areAllSelected() {
            return (
                this.gridData.findIndex((x) => x.checked === false) === -1 &&
                this.gridData.length !== 0
            );
        },
    },
    watch: {},
    methods: {
        // 조회버튼 클릭
        searchBtn() {
            this.getGridData();
        },
        //그리드 데이터 가져오기
        async getGridData() {
            this.gridOriData = [];
            this.gridData = [];
            const { skip = 0, take = 20 } = this.gridPageData;
            this.mesGet({
                apiKey: "mes/common/customquerypaging",
                queryId: "GetDeptInfo",
                queryVersion: '00001',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    ID: this.deptId,
                    NAME: this.deptName,
                    skip: skip,
                    take: take,
                },
            }).then(({ list, paging, ...x }) => {
                const data = list.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: "N",
                        selected: false,
                        idx: idx,
                        inEdit: true,
                        newRow: false,
                    };
                });

                this.gridOriData = JSON.parse(JSON.stringify(data))
                this.gridPageData = paging;
                this.gridData = data;
                this.$refs.rowGrid.skip = 0;
            });
        },
        onRowClick(event) {
            this.onSelectionchange(event);
        },
        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
        comboChange(nm, val) {
            this[nm] = val;
        },
        chkVal(nm, val) {
            this[nm] = val ? "Yes" : "";
        },
        sortChangeHandler(e) {
            const isAscending = e.sort[0]?.dir == "asc";
            if (isAscending) {
                this.gridData = this.gridData.sort((a, b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
            } else {
                this.gridData = this.gridData.sort((a, b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
            }
        },
        async pageChangeEvent(skip=0, take=20) {
        this.gridPageData = {
            skip: skip,
            take: take
        }
        this.reSetPage = false;
        this.getGridData();
        
        },
        getExcel(){
        this.excelGet({
            apiKey: 'mes/excel/customquery',
            queryId: 'GetDeptInfo',
            sendParam: {
            plantid: this.$auth.$state.user.plantId,
            ID: this.deptId,
            NAME: this.deptName,
            gridid: this.headerParam.gridid,
            gridqueryversion: "00001",
            },
        });
        },
        getExcelPaging() {
        const {skip=0, take=20} = this.gridPageData;
        this.excelGet({
            apiKey: 'mes/excel/customquerypaging',
            queryId: 'GetDeptInfo',
            sendParam: {
            plantid: this.$auth.$state.user.plantId,
            ID: this.deptId,
            NAME: this.deptName,
            gridid: this.headerParam.gridid,
            gridqueryversion: "00001",
            skip: skip,
            take: take,
            },
        });
        },
    },
};

const defaultData = {};
</script>