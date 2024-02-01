<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 공정관리 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00807") }}</li> <!-- 검사성적서관리 -->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row ref="searchFilter" no-gutters>
                            <v-col :sm="9" :lg="10">
                                <div class="form-group-wrap">
                                    <div class="form-group">
                                        <Label>Line</Label>
                                        <DropDownList ref="cmbLine" :style="{ width: '250px' }" :data-items="line"
                                            :text-field="'text'" :data-item-key="'id'" :value="value" @change="comboChange">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group" style="margin-left: 5px;">
                                        <Label>WorkCenter</Label>
                                        <DropDownList ref="cmbWorkCenter" :style="{ width: '200px' }"
                                            :data-items="workCenter" :text-field="'text'" :data-item-key="'id'"
                                            :value="value2" @change="comboChange2">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00263") }}</label> <!-- 품번코드 -->
                                        <InputText ref="productid" :boxWidth="'85%'" :dataNm="'productid'" :disabled="false"
                                            :defaultValue="productid" :searchOption="true" :searchFunc="searchBtn"
                                            @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group" style="margin-left: -10px;">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00260") }}</label> <!-- 품번명 -->
                                        <InputText ref="productname" :boxWidth="'85%'" :dataNm="'producname'"
                                            :disabled="false" :defaultValue="productname" :searchOption="true"
                                            :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group" style="margin-top: 10px;">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00669") }}</label> <!--발생일-->
                                        <div class="form-datepicker">
                                            <DatePicker ref="workFromDate" :default-value="new Date(workFromDate)"
                                                :dataNm="'workFromDate'" :format="'yyyy-MM-dd'" @change="fromChange" />
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
                                <Button :theme-color="'primary'" icon="search" @click="searchBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00277")
                                }}</Button> <!-- 조회 -->
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
                                <!-- <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00585") }}</CardTitle> -->
                            </v-col>
                            <v-col cols="6" align="right" style="margin-bottom: 7px;">
                                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                                <Button :theme-color="'primary'" :size="'small'" @click="rowEdit">Edit
                                </Button>
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO
                                </Button>
                                <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{
                                    $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체 EXCEL -->
                                <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{
                                    $t("MES_CommLang.MES_CommLang_00677") }} <!-- 페이지 EXCEL -->
                                </Button>
                                <Button :theme-color="'secondary'" :size="'small'" @click="showUbiform">Print</Button>
                                <Button :theme-color="'secondary'" :size="'small'"  @click="showUbiformEng">Print(Eng)
                                </Button>
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" style="height: calc(100% - 33px);">
                            <KendoGrid ref="GridReport" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                                :columns="headerParam.gridHeader" :resizable="true" :isPaging="true"
                                :gridPageData="gridPageData" @pageChangeEvent=pageChangeEvent @griditemchange="griditemchange" :reSetPage="this.reSetPage"
                                :selected-field="selectedField" @gridrowclick="onRowClick" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
            <v-col :sm="12" :lg="12" :class="'divListWapper2'" :style="{ height: '50%' }">
                <Card ref="gridCard2" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="12" align="right" style="margin-bottom: 7px;">
                                <!-- <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00585") }}</CardTitle> -->
                                <Button :theme-color="'secondary'" :size="'small'" @click="getExcel2">전체EXCEL</Button>
                            </v-col>
                        </v-row>
                        <div ref="divWrapper2" style="height: calc(100% - 33px);">
                            <KendoGrid ref="GridReportSerial" :gridHeight="gridHeight" :gridItems="gridData2"
                                :sortable="true" :columns="headerParam2.gridHeader" :resizable="true" :isPaging="false"
                                :gridPageData="gridPageData2" @griditemchange="griditemchange2"
                                :selected-field="selectedField" @gridrowclick="onRowClick2" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <WindowPop ref="windowPop" :formName="'InspectionReport'"></WindowPop>
        <WindowPop ref="windowPop2" :formName="'Inspection_en'"></WindowPop>
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
import WindowPop from '@/components/common/WindowPop';

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
        WindowPop
    },
    data() {
        return {
            workFromDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
            workToDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            gridHeight: '100px',
            columns: [],
            gridData: [],
            gridOriData: [],
            gridData2: [],
            gridOriData2: [],
            gridPageData: {},
            gridPageData2: {},
            reSetPage: false,
            selectedField: 'selected',
            equipmentname: '',
            equipmentid: '',
            alarmid: '',
            workorder: '',
            productid: '',
            productname: '',
            line: [],
            workCenter: [],
            alarmid: [],
            value: '', /* Line */
            value2: { id: '', text: '' }, /* WorkCenter */
            value3: '',
            selectedRow: '',
            headerParam: {
                gridid: "dgvInspectionReport", // 그리드 ID
                rowStat: '',
                gridHeader: [],
                noRowstat: false,
                noFirstCheck: true,
                xOverflowYn: true,
            },
            headerParam2: {
                gridid: "dgvInspectionReportSerial", // 그리드 ID
                rowStat: '',
                gridHeader: [],
                noRowstat: false,
                noFirstCheck: true,
                xOverflowYn: false,
            },
            inspSEQ: '',
            datasetList: {},
            paramList: {},
            selectedRow: [],
            formName: 'InspectionReport'
        };
    },
    created() {
    },
    async mounted() {
        this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
        await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
        await this.getComboData();
        // await this.getAlarmComboData();
        // await this.getInspectionReport();
        this.value2.text = this.$i18n.t('MES_CommLang.MES_CommLang_00501'); /* 전체 */
    },

    watch: {
    },
    methods: {
        // 검사성적서관리 그리드 데이터 가져오기
        async getInspectionReport() {
            this.gridOriData = [];
            this.gridData = [];
            this.selectedRow = '';
            const { skip = 0, take = 20 } = this.gridPageData;
            this.mesGet({
                apiKey: 'mes/common/customquerypaging',
                queryId: 'GetInspectionReport',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
                    PRODUCTID: this.productid,
                    PRODUCTNAME: this.productname,
                    STARTTIME: this.workFromDate,
                    ENDTIME: this.workToDate,
                    skip: skip,
                    take: take,
                },
            }).then(({ list, paging, ...x }) => {

                const data = list.map((x, idx) => {
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
                //GIRD input v-model초기화, chkbox초기화 위해 추가
                this.$nuxt.$emit('iccReset');
                this.gridPageData = paging;
                this.gridOriData = data;
                this.gridData = data;
                console.log(this.gridData);
                if (this.gridData.length < 1) {
                    this.gridData2 = [];
                    this.gridOriData2 = [];
                }
            });
        },

        async pageChangeEvent(skip = 0, take = 20) {
            this.gridPageData = {
                skip: skip,
                take: take
            }
            this.reSetPage = false;
            this.getInspectionReport();

        },
        // 검사성적서 시리얼 그리드 데이터 가져오기
        async getReportSerialData(res) {
            this.gridOriData2 = [];
            this.gridData2 = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetInspectionReportSerial',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    INSPECTIONSEQUENCE: res
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
                this.gridOriData2 = data;
                this.gridData2 = data;

                this.paramList = this.gridData.filter(x => (x.selected == true))[0];
                
                this.datasetList = {
                    dataset_1 : this.gridData2
                }
            });
        },

        // 검색조건 콤보 데이터 가져오기
        async getComboData() {
            // Line 콤보 데이터 가져오기
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetAreaList',
                queryVersion: '00003',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    AREATYPE: 'Line'
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
                for (let i = 0; i < data.length; i++) {
                    if (i < data.length) {
                        this.line.push({ id: data[i].CODE, text: data[i].NAME });
                        this.value = this.line[0];
                    }
                }
                // 검색조건 WorkCenter 콤보박스 데이터 가져오기
                this.getWorkCenterComboList(this.line[0].id);
            });
        },

        // 검색조건 WorkCenter 콤보박스 데이터 가져오기
        async getWorkCenterComboList(res) {
            this.workCenter = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetAreaList',
                queryVersion: '00003',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    AREATYPE: 'WorkCenter',
                    SUPERAREAID: res
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
                this.workCenter.push({ id: '', text: this.$i18n.t('MES_CommLang.MES_CommLang_00501') }); /* 전체 */
                this.value2 = this.workCenter[0];
                for (let i = 0; i < data.length; i++) {
                    if (i < data.length) {
                        this.workCenter.push({ id: data[i].CODE, text: data[i].NAME });
                    }
                }
            });
        },

        async getAlarmComboData() {
            this.alarmid = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetAlarmComboList',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
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
                console.log(data);
                this.alarmid.push({ id: '', text: this.$i18n.t('MES_CommLang.MES_CommLang_00501') }); /* 전체 */
                this.value3 = this.alarmid[0];
                for (let i = 0; i < data.length; i++) {
                    if (i < data.length) {
                        this.alarmid.push({ id: data[i].ALARMID, text: data[i].ALARMNAME });
                    }
                }
            });
        },
        async searchBtn() {
            this.getInspectionReport();
        },

        // 저장
        saveBtn() {
            const saveData = this.gridData.filter(x => x.rowStat !== "N")
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                    }
                });

            if (saveData.length > 0) {
                const validate = this.mesValidation(this.headerParam.gridHeader, this.gridData);
                if (!validate.isValidate) {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg);
                    return;
                }
            }
            const saveDetailData = this.gridData2.filter(x => x.rowStat !== "N")
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                    }
                });

            if (saveDetailData.length > 0) {
                const validate2 = this.mesValidation(this.headerParam2.gridHeader, this.gridData2);
                if (!validate2.isValidate) {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate2.msg);
                    return;
                }
            }

            //console.log(saveData);
            //console.log(saveDetailData);

            const updateCnt = saveData.length + saveDetailData.length;
            if (updateCnt > 0) {
                if (saveData.length > 0) {
                    console.log(saveData);
                    const res = this.mesPost({
                        apiKey: "mes/common/manage",
                        messagename: "TxnInspectionReport",
                        sendParam: saveData
                    }).then((result) => {
                        if (result.returncode !== undefined && result.returncode === "0") {
                            if (saveDetailData.length > 0) {
                                const res = this.mesPost({
                                    apiKey: "mes/common/manage",
                                    messagename: "TxnInspectionReportSerial",
                                    sendParam: saveDetailData
                                }).then((result) => {
                                    this.$nextTick(() => {
                                        if (result.returncode !== undefined && result.returncode === "0") {
                                            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140'));
                                            this.getInspectionReport();
                                            this.getReportSerialData(this.inspSEQ);
                                        } else {
                                            this.$refs.alertPop.show("ERROR : " + result.code, result.message);
                                        }
                                    })
                                })
                            } else {
                                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140'));
                                this.getInspectionReport();
                            }
                        } else {
                            this.$refs.alertPop.show("Error : ", result.code, result.message);
                        }
                    })
                } else {
                    if (saveDetailData.length > 0) {
                        console.log(saveDetailData);
                        const res = this.mesPost({
                            apiKey: "mes/common/manage",
                            messagename: "TxnInspectionReportSerial",
                            sendParam: saveDetailData
                        }).then((result) => {
                            this.$nextTick(() => {
                                if (result.returncode !== undefined && result.returncode === "0") {
                                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140'));
                                    // this.getInspectionReport();
                                    this.getReportSerialData(this.inspSEQ);
                                } else {
                                    this.$refs.alertPop.show("Error : ", result.code, result.message);
                                }
                            })
                        })
                    }
                }
            } else {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143'));
                return;
            }
        },

        getPrint() {
            // this.$refs['GridReportSerial'].columns = this.headerParam.gridHeader;
            // this.$refs['GridReportSerial'].gridItems = this.gridData;
        },
        getExcel() {
            this.excelGet({
                apiKey: 'mes/excel/customquery',
                queryId: 'GetInspectionReport',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
                    PRODUCTID: this.productid,
                    PRODUCTNAME: this.productname,
                    STARTTIME: this.workFromDate,
                    ENDTIME: this.workToDate,
                    gridid: this.headerParam.gridid,
                    gridqueryversion: "00001",
                },
            });
        },
        getExcelPaging() {
            const { skip = 0, take = 20 } = this.gridPageData;
            this.excelGet({
                apiKey: 'mes/excel/customquerypaging',
                queryId: 'GetInspectionReport',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
                    PRODUCTID: this.productid,
                    PRODUCTNAME: this.productname,
                    STARTTIME: this.workFromDate,
                    ENDTIME: this.workToDate,
                    gridid: this.headerParam.gridid,
                    gridqueryversion: "00001",
                    skip: skip,
                    take: take,
                },
            });
        },

        getExcel2() {
            this.excelGet({
                apiKey: 'mes/excel/customquery',
                queryId: 'GetInspectionReportSerial',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    INSPECTIONSEQUENCE: this.inspSEQ,
                    gridid: this.headerParam2.gridid,
                    gridqueryversion: "00001",
                },
            });
        },

        rowEdit() {
            if (this.selectedRow == null || this.selectedRow == '') {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), '수정할 데이터를 선택해주세오.');
                return;
            } else {
                this.selectedRow.inEdit = true;
                console.log(this.selectedRow);
            }
        },
        notPageReset(flag) {
            // flag : false
            this.reSetPage = flag;
        },
        //unbo 버튼 클릭
        undoBtn() {
            this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
            this.$nuxt.$emit("iccReset");
            console.log(this.gridData);
            this.gridData.forEach(x => (x.inEdit = false));
        },
        searchInput(nm, val) {
            this[nm] = val;
        },
        async onRowClick(event) {
            console.log(event);

            this.selectedRow = event.dataItem;
            this.gridData.forEach(x => (x.selected = false));
            event.dataItem[this.selectedField] = true;
            // if (event.dataItem) {
            this.inspSEQ = event.dataItem.INSPECTIONSEQUENCE;
            // this.t_RoleID = this.roleID;
            this.setChildColumns(event.dataItem);
            this.getReportSerialData(event.dataItem.INSPECTIONSEQUENCE); // 데이터 없을경우 NullPointerException
            // }

        },
        async onRowClick2(event) {
            console.log(event);

            this.selectedRow = event.dataItem;
            this.gridData2.forEach(x => (x.selected = false));
            event.dataItem[this.selectedField] = true;

        },

        //그리드 인풋 데이터 변경시
        griditemchange(e) {
            const data = JSON.parse(JSON.stringify(this.gridData));
            const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
            console.log(idx)
            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === "N") {
                data[idx].rowStat = "U";
            }
            if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
                data[idx].rowStat = "N";
            }
            this.gridData = data;
        },
        //그리드 인풋 데이터 변경시
        griditemchange2(e) {
            const data = JSON.parse(JSON.stringify(this.gridData2));
            const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
            console.log(idx)
            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === "N") {
                data[idx].rowStat = "U";
            }
            if (data[idx].rowStat === "U" && !this.chkOriginalData2(data, idx)) {
                data[idx].rowStat = "N";
            }
            this.gridData2 = data;
        },
        //데이터 원상복구시 "수정" 항목 제거
        chkOriginalData(gridData, idx) {
            const data = JSON.parse(JSON.stringify(gridData));
            const keys = Object.keys(data[idx]);
            const chkArr = keys.filter((x) => {
                return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
            });
            return chkArr.length > 0;
        },
        //데이터 원상복구시 "수정" 항목 제거
        chkOriginalData2(gridData, idx) {
            const data = JSON.parse(JSON.stringify(gridData));
            const keys = Object.keys(data[idx]);
            const chkArr = keys.filter((x) => {
                return data[idx][x] !== this.gridOriData2[idx][x] && x !== "rowStat";
            });
            return chkArr.length > 0;
        },

        // 검색조건 Line 콤보 change 이벤트
        comboChange(event) {
            this.value = event.value;
            // 검색조건 Line콤보박스 선택값에 따라 검색조건 WorkCenter 콤보 데이터 가져오기
            this.getWorkCenterComboList(event.value.id);
        },
        // 검색조건 WorkCenter 콤보 change 이벤트
        comboChange2(event) {
            this.value2 = event.value;
        },

        // 검색조건 생산이상유형 콤보 change 이벤트
        comboChange3(event) {
            this.value3 = event.value;
        },

        fromChange(e) {
            this.workFromDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange(e) {
            this.workToDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },

        async setChildColumns(data) {

            // this.headerParam2.gridHeader.filter(x => x.field == data.)
            // for (const [key, value] of Object.entries(data)) {
            //     console.log("key", key);

            //     this.headerParam2.gridHeader.filter(x => x.filed == key).map(x => {
            //         return {
            //             field: x.field,
            //             title: x.title,
            //             children: ([
            //             { field: "APPEARN", width: 150, title:  data.APPEARN_HEAD},
            //             ]),
            //         }
            //     })
            // }

            this.headerParam2.gridHeader.forEach(x => {


                if (x.field == "APPEARN") {

                    // x = { title : 'APPEARN' }
                    delete x.cell;

                    x.children = ([
                        { field: "APPEARN", width: 150, title: data.APPEARN_HEAD },
                    ]);

                    console.log(Object.entries(data));
                }
                if (x.field == "WORKABILITY") {
                    delete x.cell;
                    x.children = ([
                        { field: "WORKABILITY", width: 120, title: data.WORKABILITY },
                    ])
                }
                if (x.field == "PROOF_TEST") {
                    delete x.cell;
                    x.children = ([
                        { field: "PROOF_TEST", width: 120, title: data.PROOF_TEST },
                    ])
                }
                if (x.field == "INTERNAL_LEAKAGE") {
                    delete x.cell;
                    x.children = ([
                        { field: "INTERNAL_LEAKAGE", width: 120, title: data.INTERNAL_LEAKAGE },
                    ])
                }
                if (x.field == "EXTERNAL_LEAKAGE") {
                    delete x.cell;
                    x.children = ([
                        { field: "EXTERNAL_LEAKAGE", width: 120, title: data.EXTERNAL_LEAKAGE },
                    ])
                }
                if (x.field == "MIN_OPER_PRESS") {
                    delete x.cell;
                    x.children = ([
                        { field: "MIN_OPER_PRESS", width: 120, title: data.MIN_OPER_PRESS },
                    ])
                }
                if (x.field == "WELDING") {
                    delete x.cell;
                    x.children = ([
                        { field: "WELDING", width: 150, title: data.WELDING },
                    ])
                }
                if (x.field == "ROD_SURFACE") {
                    delete x.cell;
                    x.children = ([
                        { field: "ROD_SURFACE", width: 150, title: data.ROD_SURFACE },
                    ])
                }
                if (x.field == "THREAD") {
                    delete x.cell;
                    x.children = ([
                        { field: "THREAD", width: 150, title: data.THREAD },
                    ])
                }
                if (x.field == "STROKE") {
                    delete x.cell;
                    x.children = ([
                        { field: "STROKE", width: 150, title: data.STROKE },
                    ])
                }
                if (x.field == "MARK_POINT") {
                    delete x.cell;
                    x.children = ([
                        { field: "MARK_POINT", width: 120, title: data.MARK_POINT },
                    ])
                }
            });
        },

        showUbiform() {
            if (this.datasetList.dataset_1 == undefined) {
                this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00087')
                ); /* 알림, 선택한 데이터가 없습니다.*/
                return;
            }

            this.$refs.windowPop.show(this.datasetList, this.paramList);
        },
        showUbiformEng(){
            if (this.datasetList.dataset_1 == undefined) {
                this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00087')
                ); /* 알림, 선택한 데이터가 없습니다.*/
                return;
            }

            this.$refs.windowPop2.show(this.datasetList, this.paramList);
        },

        async pageChangeEvent(skip = 0, take = 20) {
      this.gridPageData = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getInspectionReport();

    },
    }
};
const defaultData = {
};
</script>
<style lang="scss"></style>