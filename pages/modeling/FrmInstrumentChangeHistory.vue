<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00804") }}</li> <!-- 계측기 변경이력 -->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row ref="searchFilter" no-gutters>
                            <v-col :sm="9" :lg="10" align="left">
                                <div class="form-group-wrap">
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00714") }}</label> <!-- 사용부서 -->
                                        <DropDownList ref="cmbProGroup" :style="{ width: '250px' }" :data-items="deptGroup"
                                            :text-field="'text'" :data-item-key="'id'" :value="value"
                                            @change="selectDeptGroup">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00715") }}</label> <!-- 분류 -->
                                        <DropDownList ref="cmbItemType" :style="{ width: '250px' }" :data-items="ItemType"
                                            :text-field="'text'" :data-item-key="'id'" :value="value2"
                                            @change="selectItemtypeCombo">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group">
                                        <label>itemNo</label><!--itemNo-->
                                        <InputText :dataNm="'itemNo'" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00717") }}</label><!--자산번호-->
                                        <InputText :dataNm="'assetNo'" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00718") }}</label><!--규격-->
                                        <InputText :dataNm="'standard'" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회기간 -->
                                        <div class="form-datepicker">
                                            <DatePicker ref="startDate" :default-value="new Date(startDate)"
                                                v-model="startDateModel" :format="'yyyy-MM-dd'" @change="fromChange"
                                                :dataNm="'startDate'" />
                                        </div>
                                        <span class="i_tilde">~</span>
                                        <div class="form-datepicker">
                                            <DatePicker ref="endDate" :default-value="new Date()" :format="'yyyy-MM-dd'"
                                                v-model="endDateModel" @change="toChange" :dataNm="'endDate'" />
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Action Type</label>
                                        <MesSelectBox :enumID="'InstrumentActionType'" :allYN="true"
                                            :dataNm="'InstrumentActionType'" @comboChange="comboChange"></MesSelectBox>
                                    </div>
                                </div>
                            </v-col>
                            <v-col :sm="3" :lg="2" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00277") }}</Button><!--조회-->
                            </v-col>
                        </v-row>
                        <v-row ref="searchFilter" no-gutters>
                            <v-col :sm="6" :lg="6" align="left"></v-col>
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
                                <CardTitle>{{
                                    $t("MES_CommLang.MES_CommLang_00781") }}</CardTitle> <!-- 계측기 상태관리 -->
                            </v-col>
                            <v-col cols="6" align="right">
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                                :edit-field="'inEdit'" :columns="headerParam.gridHeader" :resizable="true" :isPaging="false"
                                :selected-field="selectedField" @gridrowclick="onRowClick"
                                @selectionchange="onSelectionchange" @sortChangeHandler="sortChangeHandler"
                                @rowdblclick="rowdblclick" @headerselectionchange="onHeaderSelectionChange" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
            <v-col :sm="12" :lg="12" :class="'divListWapper2'" :style="{ height: '50%' }">
                <Card ref="gridCard2" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="6" align="left">
                                <CardTitle>{{
                                    $t("MES_CommLang.MES_CommLang_00782") }}</CardTitle><!-- 계측기 상태관리 파일 -->
                            </v-col>
                            <v-col cols="6" align="right" v-show="btnListShow">
                                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn3">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                                <Button :theme-color="'secondary'" :size="'small'" icon="add" @click="addBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
                                <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="confirmDel">{{
                                    $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'"
                                    @click="undoBtn2">UNDO</Button>
                            </v-col>
                        </v-row>
                        <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid2" :gridHeight="gridHeight" :gridItems="gridData2" :sortable="true"
                                :columns="headerParam2.gridHeader" :resizable="true" :edit-field="'inEdit'"
                                :isPaging="false" :selected-field="selectedField" @fileChange="fileChange"
                                @gridrowclick="onRowClick2" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
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
import CreateInstrument from "@/components/frmInstrument/FrmCreateInstrument";
import CalibrationInstrument from "@/components/frmInstrument/FrmCalibrationInstrument";
import RepairInstrument from "@/components/frmInstrument/FrmRepairInstrument";
import DisuseInstrument from "@/components/frmInstrument/FrmDisuseInstrument";
import RetalInstrument from "@/components/frmInstrument/FrmRetalInstrument";
import BulkChange from "@/components/frmInstrument/FrmBulkChange";
import DateUtility from '~/plugins/dateUtility';

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
        MesSelectBox,
        CreateInstrument,
        CalibrationInstrument,
        RepairInstrument,
        DisuseInstrument,
        RetalInstrument,
        BulkChange,
        DateUtility
    },
    props: {
        gridHeight: {
            type: String,
            defaultData: "200px",
        },
    },
    data() {
        return {
            startDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
            endDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            startDateModel: new Date(year, month, day - 7),
            endDateModel: new Date(),
            gridOriData: [],
            gridData: [],
            gridOriData2: [],
            gridData2: [],
            headerParam: {
                gridid: "dgvInstrumentChangeHistory", // 그리드 ID
                gridHeader: [],
                enumComboBox: [],
                noRowstat: true,
                noFirstCheck: false,
                xOverflowYn: true,
            },
            headerParam2: {
                gridid: "dgvInstrumentDetailFile", // 그리드 ID
                rowStat: "", //rowStat 표시 여부
                gridHeader: [],
                noFirstCheck: true,
                noRowstat: false,
                xOverflowYn: true,
            },
            selectedField: 'selected',
            value: '',
            value2: '',
            deptGroup: [],
            ItemType: [],
            itemNo: '',
            assetNo: '',
            standard: '',

            createInstrumentVisible: false,
            calibrationInstrumentVisible: false,
            repairInstrumentVisible: false,
            disuseInstrumentVisible: false,
            retalInstrumentVisible: false,
            bulkChangeVisible: false,

            initData: [],
            initData2: [],
            InstrumentActionType: '',
            gridPageData: {},
            gridPageData2: {},
            relationTimekey: '',
            btnListShow: false
        };
    },
    created() {
    },
    async mounted() {
        await this.getDeptGroupData();
        await this.getItemTypeCombo();
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper, this.customDropDown);
        await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
        await this.getGridData();
    },
    watch: {},
    methods: {
        async getDeptGroupData() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetDeptCombo',
                sendParam: {
                },
            }).then(res => {
                this.deptGroup.push({id : '', text: this.$i18n.t('MES_CommLang.MES_CommLang_00501')})
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.deptGroup.push({ id: res[i].ID, text: res[i].NAME });
                        this.value = this.deptGroup[0];
                    }
                }
            });
        },
        async getItemTypeCombo() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetItemTypeCombo',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                },
            }).then(res => {
                // 콤보박스 첫번째에 전체 추가
                this.ItemType.push({ id: '', text: this.$i18n.t('MES_CommLang.MES_CommLang_00501') }); /* 전체 */
                this.value2 = this.ItemType[0];
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.ItemType.push({ id: res[i].ID, text: res[i].NAME });
                        // this.value2 = this.ItemType[0];
                    }
                }
            });
        },
        selectDeptGroup(event) {
            this.value = event.value;
        },
        selectItemtypeCombo(event) {
            this.value2 = event.value;
        },
        searchInput(nm, val) {
            this[nm] = val;
        },
        comboChange(nm, val) {
            this[nm] = val;
        },
        async searchBtn() {
            this.getGridData();
        },
        // 그리드 데이터 가져오기
        async getGridData() {
            this.btnListShow = false;
            this.gridData = [];
            this.gridOriData = [];
            this.gridData2 = [];
            this.gridOriData2 = [];
            const { skip = 0, take = 20 } = this.gridPageData;
            this.mesGet({
                apiKey: 'mes/common/customquerypaging',
                queryId: 'GetInstrumentChangeHistory',
                queryVersion: '00001',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    DEPARTMENT: this.value.id,
                    ITEMNO: this.itemNo,
                    ASSETNO: this.assetNo,
                    ITEMTYPE: this.value2.id,
                    STANDARD: this.standard,
                    ACTIONTYPE: this.InstrumentActionType,
                    STARTDATE: this.startDate + ' 00:00:00',
                    ENDDATE: this.endDate + ' 23:59:59',
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
                        inEdit: true,
                        resizable: true,
                        ACQUISITIONDATE: Utility.setFormatDate(x.ACQUISITIONDATE, 'YYYY-MM-DD'),
                        NEXTCHECKDATE: Utility.setFormatDate(x.NEXTCHECKDATE, 'YYYY-MM-DD')
                    }
                });
                //GIRD input v-model초기화, chkbox초기화 위해 추가
                this.$nuxt.$emit('iccReset');
                this.gridPageData = paging;
                this.gridData = data;
                this.gridOriData = data;
            });
        },

        // 계측기 상태 관리 파일 그리드 가져오기
        async getInstrumentDetailFile(key) {
            this.gridData2 = [];
            this.gridOriData2 = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetInstrumentDetailFile',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
                    RELATIONTIMEKEY: key,
                },
            }).then(res => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: 'N',
                        selected: false,
                        idx: idx,
                        inEdit: false,
                        resizable: true,
                        UPLOADFILE: '',
                        FILECHANGE: false,
                        FILEUPLOADYN: false,
                    };
                });
                this.$nuxt.$emit('iccReset');
                this.gridOriData2 = data;
                this.gridData2 = data;
            });
        },
        saveBtn3() {
            // 디테일 데이터
            const saveDataFile = this.gridData2
                .filter(x => x.rowStat !== 'N')
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                    };
                });

            const fileList = [];
            this.gridData2.filter(x => !this.isNullOrEmpty(x.FILENAME) && x.FILECHANGE).map((x, idx) => {
                fileList.push({
                    file: x.UPLOADFILE,
                    fileName: x.FILENAME,
                    fileLocation: "\\\\172.31.15.21\\스마트 공장 Track A\\프로젝트관리\\98. 기타\\09.개인폴더\\이홍상\\TEST\\\\",
                })
            });
            const validateDetail = this.mesValidation(this.headerParam2.gridHeader, this.gridData2);

            if (!validateDetail.isValidate) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validateDetail.msg); // 알림
                return;
            }

            console.log('fileList', fileList);
            if (saveDataFile.length > 0) {
                if (this.mesFileUpload(fileList)) {
                    const res = this.mesPost({
                        apiKey: 'mes/common/manage',
                        messagename: 'TxnInstrumentDetailFile',
                        sendParam: saveDataFile,
                    }).then(result => {
                        this.$nextTick(() => {
                            if (result.returncode !== undefined && result.returncode === '0') {
                                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                                this.getInstrumentDetailFile(this.relationTimekey);
                            } else {
                                this.$refs.alertPop.show(
                                    'ERROR : ' + result.code,
                                    'result :' + result.message
                                );
                            }
                        });
                    });
                } else {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
                    return;
                }
            }
            else {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
                return;
            }
        },
        //추가 버튼 클릭
        addBtn() {
            this.$refs.rowGrid2.skip = 0;
            const newRowUUid = Math.round(Math.random() * 1000000000).toString()
            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: false,
                PLANTID: this.$auth.$state.user.plantId,
                rowStat: "C",
                _ROWSTATUS: "C",
                newRowUUid: newRowUUid,
                idx: this.gridData2.length,
                RELATIONTIMEKEY: this.relationTimekey,
                FILENAME: "",
                DESCRIPTION: "",
                //파일 업로드시 저장되는 경로
                FILELOCATION: "",
                FILECHANGE: false,
                LocalDownYN: false,
                FILEUPLOADYN: true
            };
            this.gridData2.splice(this.gridData2.length, 0, dataItem)
            this.$nuxt.$emit('iccReset')
        },
        //삭제버튼
        confirmDel() {
            const delData = this.gridData2
                .filter((x) => x.selected === true)
                .map((x) => {
                    return {
                        ...x,
                    };
                });
            if (delData.length > 0) {
                if (delData.filter((x) => x.rowStat !== 'C').length >= 1) {
                    var selectedRow = {};
                    selectedRow = delData
                        .filter((x) => x.rowStat !== 'C')
                        .map((x) => x.FILENAME);

                    this.$refs['confirmPop'].title = 'info';
                    this.$refs['confirmPop'].message = delData[0].FILENAME + " - " + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); // 선택한 데이터를 삭제 하시겠습니까?
                    this.$refs['confirmPop'].modalWidth = '300px';
                    this.$refs['confirmPop'].visibleDialog = true;
                    this.$refs['confirmPop'].callBack = this.delBtn;
                } else {
                    this.delBtn();
                }
            } else {
                this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')
                ); /* 알림, 선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.*/
                return;
            }
        },
        //삭제
        delBtn() {
            const data = JSON.parse(JSON.stringify(this.gridData2));
            this.gridData2 = data
                .filter(x => !(x.selected && x.rowStat === 'C'))
                .map(x => {
                    if (x.selected) {
                        return {
                            ...x,
                            rowStat: 'D',
                        };
                    }
                    return x;
                });
        },
        //unbo 버튼 클릭
        undoBtn2() {
            this.gridData2 = this.gridOriData2.filter((x) => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
        },
        onRowClick(event) {
            this.gridData.forEach((x) => (x.selected = false));
            event.dataItem[this.selectedField] = true;
            if (event.dataItem.ACTIONTYPE == "Calibration") {
                this.relationTimekey = event.dataItem.RELATIONTIMEKEY
                this.getInstrumentDetailFile(event.dataItem.RELATIONTIMEKEY);
                this.btnListShow = true;
            }
            else {
                this.gridData2 = [];
                this.gridOriData2 = [];
                this.btnListShow = false;
            }
        },
        //그리드 로우 클릭
        onRowClick2(event) {
            //그리드 로우 클릭시 라인표시 유무 확인필요
            this.gridData2.forEach((x) => (x.selected = false));
            event.dataItem[this.selectedField] = true;
        },
        onSelectionchange(event) {
            event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        //header checkbox 클릭
        onHeaderSelectionChange(event) {
            let checked = event.event.target.checked;
            this.gridData = this.gridData.map(item => {
                return { ...item, selected: checked };
            });
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
        fileChange(e, field, dataItem) {
            const fileName = e.target.files[0].name.substring(0, e.target.files[0].name.lastIndexOf("."));
            const ext = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
            console.log(this.gridData2);
            this.gridData2 = this.gridData2.map(item => {
                return {
                    ...item,
                    FILELOCATION: item.idx === dataItem.idx ? "/프로젝트관리/98. 기타/09.개인폴더/이홍상/TEST/".concat(fileName.concat(".").concat(ext)) : item.FILELOCATION,
                    FILENAME: item.idx === dataItem.idx ? fileName.concat(".").concat(ext) : item.FILENAME,
                    UPLOADFILE: item.idx === dataItem.idx ? e.target.files[0] : item.UPLOADFILE,
                    FILECHANGE: item.idx === dataItem.idx ? true : item.FILECHANGE,
                    rowStat: (item.idx === dataItem.idx) && dataItem.rowStat === 'N' ? 'U' : item.rowStat,
                    // SEQUENCE: item.idx === dataItem.idx ? dataItem.SEQUENCE : item.SEQUENCE,
                };
            });
            console.log("확인:", e.target)
        },
        //그리드 더블 클릭
        rowdblclick(event) {
            this.createInstrumentVisible = true;
            this.initData[0] = event.dataItem;
        },

        fromChange(e) {
            let checkDay = DateUtility.checkDiffDay(e.value, new Date(this.endDate), 30);
            if (checkDay) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00284')); /* 알림, 조회기간은 30일을 넘을 수 없습니다. */
                // this.startDateModel = new Date(year, month, day - 7);
                this.startDateModel = new Date(this.startDate);
                return;
            }
            this.startDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange(e) {
            let checkDay = DateUtility.checkDiffDay(new Date(this.startDate), e.value, 30);
            if (checkDay) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00284')); /* 알림, 조회기간은 30일을 넘을 수 없습니다. */
                this.endDateModel = new Date(this.endDate);
                return;
            }
            this.endDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
    }
};
const defaultData = {};
</script>