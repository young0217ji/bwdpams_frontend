<template>
    <div>
        <Dialog v-if="visibleDialog" :title="$t('MES_CommLang.MES_CommLang_00713')" width="55%" height="930"
            @close="toggleDialog">
            <v-row no-gutters style="margin-bottom: -7px;">
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: -10px;">{{
                        $t("MES_CommLang.MES_CommLang_00720") }}</CardTitle>
                </v-col>
                <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                        $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                </v-col>
            </v-row>
            <v-row ref="searchFilter">
                <v-col :cols="12">
                    <Card>
                        <CardBody style="padding: 10px;">
                            <v-row no-gutters>
                                <v-col :cols="12">
                                    <div class="form-group-wrap" style="margin-bottom: 5px;">
                                        <div class="form-group">
                                            <label>Plant</label>
                                            <InputText ref="plant" :dataNm="'plant'" :disabled="false" :readonly="true"
                                                :searchOption="true" />
                                        </div>
                                        <div class="form-group">
                                            <label>Item No.</label>
                                            <InputText ref="itemNo" :dataNm="'itemNo'" :default-value="itemNo"
                                                :disabled="false" :readonly="true" :searchOption="true"
                                                @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00766") }}</label> <!-- 범주 -->
                                            <InputText ref="itemCategory" :dataNm="'itemCategory'" :disabled="false"
                                                :readonly="true" :searchOption="true" @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00715") }}</label> <!-- 분류 -->
                                            <DropDownList ref="cmbItemType" :style="{ width: '165px' }"
                                                :data-items="itemType" :disabled="itemTypeDisabled" :text-field="'text'"
                                                :data-item-key="'id'" :value="itemTypeValue" @change="selectItemType">
                                            </DropDownList>
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00767") }}</label> <!-- 계측기명 -->
                                            <InputText v-show="itemNmInputShow" ref="itemName"
                                                :dataNm="'InstrumentItemName'" :default-value="itemName"
                                                :readonly="nmTypeReadonly" :boxWidth="'100%'" :searchOption="true"
                                                @input-text-set="searchInput" />
                                            <!-- <MesSelectBox ref="itemNameCombo" v-show="itemNmCmbShow"
                                                :readonly="nmTypeReadonly" :enumID="'InstrumentItemName'" :allYN="false"
                                                :dataNm="'InstrumentItemName'" @comboChange="itemNameChange"></MesSelectBox> -->
                                            <DropDownList ref="itemNameCombo" v-show="itemNmCmbShow"
                                                :style="{ width: '165px' }" :data-items="InstrumentItemName"
                                                :text-field="'text'" :data-item-key="'id'" :value="InstrumentItemNameValue"
                                                @change="itemNameChange">
                                            </DropDownList>
                                        </div>
                                    </div>
                                </v-col>

                            </v-row>
                        </CardBody>
                    </Card>

                    <v-col cols="6" align="left">
                        <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{
                            $t("MES_CommLang.MES_CommLang_00768") }}</CardTitle> <!-- 자산정보 -->
                    </v-col>
                    <Card>
                        <CardBody style="padding: 10px;">
                            <v-row no-gutters>
                                <v-col :cols="12">
                                    <div class="form-group-wrap" style="margin-bottom: 5px;">
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00769") }}</label> <!-- 자산여부 -->
                                            <MesSelectBox :enumID="'AccetFlag'" :allYN="false" :dataNm="'AccetFlag'"
                                                @comboChange="accetFlagChange"></MesSelectBox>
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00717") }}</label> <!-- 자산번호 -->
                                            <InputText ref="accetNo" :dataNm="'accetNo'" :disabled="false"
                                                :readonly="isReadOnly" :searchOption="true" @input-text-set="searchInput" />
                                            <Button :theme-color="'primary'" @click="searchAccetBtn">찾기</Button>
                                            <!-- 찾기 -->
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00770") }}</label> <!-- 취득가액 -->
                                            <InputText ref="acquisitionAmount" :dataNm="'acquisitionAmount'"
                                                :disabled="false" :boxWidth="'100%'" :readonly="isReadOnly"
                                                :searchOption="true" @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00771") }}</label> <!-- 잔존가액 -->
                                            <InputText ref="residualAmount" :dataNm="'residualAmount'" :disabled="false"
                                                :readonly="isReadOnly" :searchOption="true" @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00772") }}</label> <!-- 취득일 -->
                                            <!-- <div class="form-datepicker">
                                                <DatePicker ref="acquisitionFromDate" :default-value="new Date(acquisitionFromDate)"
                                                    :dataNm="'acquisitionFromDate'" :format="'yyyy-MM-dd'" @change="fromChange" />
                                            </div> -->
                                            <!-- <span class="i_tilde">~</span> -->
                                            <div class="form-datepicker">
                                                <DatePicker ref="acquisitionToDate" v-model="defaultAcquisitionToDate"
                                                    :dataNm="'acquisitionToDate'" :format="'yyyy-MM-dd'"
                                                    @change="toChange" />
                                            </div>
                                        </div>
                                    </div>
                                </v-col>

                            </v-row>
                        </CardBody>
                    </Card>

                    <v-col cols="6" align="left">
                        <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{
                            $t("MES_CommLang.MES_CommLang_00773") }}</CardTitle> <!-- 기본정보상세 -->
                    </v-col>
                    <Card>
                        <CardBody style="padding: 10px;">
                            <v-row no-gutters>
                                <v-col :cols="12">
                                    <div class="form-group-wrap" style="margin-bottom: 5px;">
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00774") }}</label> <!-- 관리부서 -->
                                            <DropDownList ref="cmbDepartment" :style="{ width: '165px' }"
                                                :data-items="department" :text-field="'text'" :data-item-key="'id'"
                                                :value="departmentValue" @change="selectDepartment">
                                            </DropDownList>
                                        </div>
                                        <div class="form-group">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00148") }} </label> <!-- 상태 -->
                                            <MesSelectBox :enumID="'InstrumentState'" :allYN="false" :dataNm="'ITEMSTATE'"
                                                @comboChange="comboChange"></MesSelectBox>
                                        </div>
                                    </div>
                                    <div class="form-group-wrap">
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00775") }}</label> <!-- 제작회사 -->
                                            <InputText ref="maker" :dataNm="'maker'" :disabled="false"
                                                :default-value="maker" :readonly="false" :searchOption="true"
                                                @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>Model No</label>
                                            <InputText ref="modelNo" :dataNm="'modelNo'" :disabled="false"
                                                :default-value="modelNo" :readonly="false" :searchOption="true"
                                                @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>Serial No</label>
                                            <InputText ref="serialNo" :dataNm="'serialNo'" :disabled="false"
                                                :default-value="serialNo" :readonly="false" :searchOption="true"
                                                @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00776") }}</label> <!-- 구매업체 -->
                                            <InputText ref="vendor" :dataNm="'vendor'" :disabled="false"
                                                :default-value="vendor" :readonly="false" :searchOption="true"
                                                @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00718") }}</label> <!-- 규격 -->
                                            <InputText ref="standard" :dataNm="'standard'" :default-value="standard"
                                                :disabled="false" :readonly="false" :searchOption="true"
                                                @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label>{{
                                                $t("MES_CommLang.MES_CommLang_00777") }}</label> <!-- 분해능 -->
                                            <InputText ref="resolution" :dataNm="'resolution'" :default-value="resolution"
                                                :disabled="false" :readonly="false" :searchOption="true"
                                                @input-text-set="searchInput" />
                                        </div>
                                    </div>
                                </v-col>

                            </v-row>
                        </CardBody>
                    </Card>

                    <v-col cols="6" align="left">
                        <CardTitle v-text="changeTitle" style="margin-bottom: 0px; margin-top: 10px"></CardTitle> <!-- 점검정보/교정정보 -->
                    </v-col>
                    <Card>
                        <CardBody style="padding: 10px;">
                            <v-row no-gutters>
                                <v-col :cols="12">
                                    <div class="form-group-wrap" style="margin-bottom: 5px;">
                                        <div class="form-group">
                                            <label v-text="checkIntervalTitle"></label> <!-- 점검주기 -->
                                            <!-- <MesSelectBox :enumID="'CheckInterval'" :allYN="false" :dataNm="'checkInterval'"
                                                @comboChange="checkIntervalChange"></MesSelectBox> -->
                                            <DropDownList ref="CheckInterval" :style="{ width: '165px' }"
                                                :data-items="checkInterval" :text-field="'text'" :data-item-key="'id'"
                                                :value="checkIntervalValue" @change="changeCheckInterval">
                                            </DropDownList>
                                        </div>
                                        <div class="form-group">
                                            <label v-text="nextCheckTitle"></label> <!-- 예정점검일자 -->
                                            <!-- <div class="form-datepicker">
                                                <DatePicker ref="lastCheckFromDate"
                                                    :default-value="new Date(lastCheckFromDate)"
                                                    :dataNm="'lastCheckFromDate'" :format="'yyyy-MM-dd'"
                                                    @change="fromChange2" />
                                            </div> -->
                                            <!-- <span class="i_tilde">~</span> -->
                                            <div class="form-datepicker">
                                                <DatePicker ref="nextCheckToDate" v-model="defaultNextCheckToDate"
                                                    :dataNm="'nextCheckToDate'" :format="'yyyy-MM-dd'"
                                                    @change="toChange2" />
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00729") }} </label> <!-- 교정구분 -->
                                            <MesSelectBox :enumID="'InstrumentRevision'" :allYN="false"
                                                :dataNm="'INSTRUMENTREVISION'" @comboChange="comboChange"></MesSelectBox>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </CardBody>
                    </Card>
                </v-col>
            </v-row>
            <v-col v-show="instrumentDetailShow" :cols="12" :class="'divList1'" style="margin-top: 8px; height: 25%;">
                <v-row no-gutters>
                    <v-col cols="6" align="left">
                        <CardTitle v-text="instrumentDetailTitle" style="margin-bottom: 10px;"></CardTitle> <!-- 계측기 상태관리 -->
                    </v-col>
                    <v-col cols="6" align="right">
                        <Button :theme-color="'secondary'" :size="'small'" @click="showUbiform">{{
                            $t("MES_CommLang.MES_CommLang_00823") }}</Button>
                        <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn2">{{
                            $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                        <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO</Button>
                    </v-col>
                </v-row>
                <div ref="divWrapper" style="height: 100%;">
                    <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                    :gridDropDownList="headerParam.enumComboBox"
                        :columns="headerParam.gridHeader" :resizable="true" :edit-field="'inEdit'" :isPaging="false"
                        :selected-field="selectedField" :dateTimePickerList="headerParam.dateTimePickerList"
                        @gridrowclick="onRowClick" @griditemchange="griditemchange" @gridddchang="rowDdChange" />
                </div>

            </v-col>
            <v-col v-show="defaultFileGridShow" :cols="12" :class="'divList2'" style="margin-top: 30px; height: 25%;">
                <v-row no-gutters>
                    <v-col cols="6" align="left">
                        <CardTitle style="margin-bottom: 10px;">{{
                            $t("MES_CommLang.MES_CommLang_00782") }}</CardTitle> <!-- 계측기 삳태관리파일 -->
                    </v-col>
                    <v-col cols="6" align="right">
                        <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn3">{{
                            $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                        <Button :theme-color="'secondary'" :size="'small'" icon="add" @click="addBtn">{{
                            $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
                        <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="confirmDel">{{
                            $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                        <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn2">UNDO</Button>
                    </v-col>
                </v-row>
                <v-col :cols="12">
                    <div ref="divWrapper2" style="height: 100%; margin-bottom: 10px;">
                        <KendoGrid ref="rowGrid2" :gridHeight="gridHeight" :gridItems="gridData2" :sortable="true"
                            :columns="headerParam2.gridHeader" :resizable="true" :edit-field="'inEdit'" :isPaging="false"
                            :selected-field="selectedField" @fileChange="fileChange" @gridrowclick="onRowClick2" />
                    </div>
                </v-col>
            </v-col>
        </Dialog>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <WindowPop ref="windowPop" :formName="'InstrumentDetail'"></WindowPop>
    </div>
</template>
<script>
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import AlertPop from "../common/modal/AlertPop.vue";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import Utility from "~/plugins/utility";
import { DateTimePicker } from '@/static/kendo.all.min.js';
import WindowPop from '@/components/common/WindowPop';


const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일

export default {
    name: "FrmCreateInstrument",
    mixins: [mixinGlobal, multiGridHeaderMinin],
    components: {
        Dialog,
        DialogActionsBar,
        Button,
        InputText,
        Card,
        CardBody,
        MesSelectBox,
        CardTitle,
        MesVariableSelectBox,
        KendoGrid,
        gridHeaderMinin,
        DropDownList,
        DatePicker,
        Utility,
        DateTimePicker,
        WindowPop
    },
    props: {
        visibleDialog: {
            type: Boolean,
            default: false,
        },
        callBack: {
            type: Function,
            default: () => true
        },
        initData: {

        },
    },
    data() {
        return {
            inputData: {
                PLANTID: "",
                ITEMNO: "",
                ITEMNAME: "",
                ITEMCATEGORY: "",
                ITEMTYPE: "",
                DEPARTMENT: "",
                ITEMSTATE: "Normal",
                ASSETFLAG: "",
                ASSETNO: "",
                ITEMGRADE: "",
                ACQUISITIONAMOUNT: "",
                RESIDUALAMOUNT: "",
                ACQUISITIONDATE: "",
                ACQUISITIONREASONE: "",
                MAKER: "",
                MODELNO: "",
                SERIALNO: "",
                VENDOR: "1",
                STANDARD: "",
                RESOLUTION: "",
                CHECKINTERVAL: "",
                NEXTCHECKDATE: "",
                INSTRUMENTREVISION: "InCompanyRevision",
                DESCRIPTION: "",
            },
            gridHeight: '350px',
            gridHeight2: '350px',
            selectedField: 'selected',
            gridOriData: [],
            gridData: [],

            headerParam: {
                gridid: "dgvInstrumentDetail", // 그리드 ID
                rowStat: "", //rowStat 표시 여부
                gridHeader: [],
                noFirstCheck: true,
                noRowstat: false,
                xOverflowYn: true,
                dateTimePickerList: ["ACTIONTIME"],
                enumComboBox: [],
            },

            gridOriData2: [],
            gridData2: [],
            headerParam2: {
                gridid: "dgvInstrumentDetailFile", // 그리드 ID
                rowStat: "", //rowStat 표시 여부
                gridHeader: [],
                noFirstCheck: true,
                noRowstat: false,
                xOverflowYn: true,

            },

            departmentid: "",
            areaid: "",
            plant: "",
            itemNo: "",
            itemName: "",
            itemCategory: "",
            itemType: [],
            itemTypeValue: {},
            accetFlag: [],
            accetFlagValue: {},
            accetNo: '',
            accetNoModalVisible: false,
            acquisitionAmount: "",
            residualAmount: "",
            acquisitionFromDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
            acquisitionToDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            defaultAcquisitionToDate: new Date(),
            department: [],
            departmentValue: { id: '', text: '' },
            maker: "",
            modelNo: "",
            serialNo: "",
            vendor: "",
            standard: "",
            resolution: "",
            checkInterval: [],
            checkIntervalValue: {},
            lastCheckFromDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
            nextCheckToDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            defaultNextCheckToDate: new Date(),
            selectedAccetFlag: 'Y',
            isReadOnly: true,
            saveData: [],
            rowData: [],
            itemNmInputShow: false,
            itemNmCmbShow: true,
            InstrumentItemName: [],
            InstrumentItemNameValue: {},
            selectedItemNo: '',
            itemTypeReadonly: false,
            itemTypeDisabled: false,
            defaultFileGridShow: false,
            nmTypeReadonly: false,
            relationTimekey: '',
            CalibrationData: [],
            instrumentDetailShow: false,
            datasetList: {},
            paramList: {},
            ITEMSTATE: '',
            INSTRUMENTREVISION: '',
            changeTitle: '',
            checkIntervalTitle: '',
            nextCheckTitle: '',
            instrumentDetailTitle: ''
        }
    },
    computed: {
    },
    async mounted() {
        this.$refs['plant'].textVal = this.$auth.$state.user.plantId;
        this.$refs['itemCategory'].textVal = "계측";
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
        await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);

        if (this.initData.length > 0) {
            this.rowData = this.initData[0];
            console.log("---------------------", this.rowData);
            // if(this.itemType[2].id == this.rowData.ITEMTYPE){
            //     console.log('asdas');
            // }
            //  this.aa = this.itemType
            //     .filter(x => x.id == this.rowData.ITEMTYPE)

            // console.log(this.aa);
            this.getInstrumentDetail(this.rowData.ITEMNO);
            this.$i18n.t('MES_CommLang.MES_CommLang_00779');
            this.changeTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00930');
            this.checkIntervalTitle =  this.$i18n.t('MES_CommLang.MES_CommLang_00931');
            this.nextCheckTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00925');
            this.instrumentDetailTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00932');
            this.inspectionTitle = false;
            this.calibrationTitle = true;
            this.itemNmInputShow = true;
            this.itemNmCmbShow = false,
                this.nmTypeReadonly = true;
            this.itemTypeDisabled = true;
            this.selectedItemNo = this.rowData.ITEMNO;
            this.itemNo = this.rowData.ITEMNO;
            this.itemName = this.rowData.ITEMNAME;
            this.maker = this.rowData.MAKER;
            this.modelNo = this.rowData.MODELNO;
            this.serialNo = this.rowData.SERIALNO;
            this.vendor = this.rowData.VENDOR;
            this.standard = this.rowData.STANDARD;
            this.resolution = this.rowData.RESOLUTION;
            this.defaultAcquisitionToDate = new Date(this.rowData.ACQUISITIONDATE)
            this.defaultNextCheckToDate = new Date(this.rowData.NEXTCHECKDATE);
            // this.$refs['nextCheckDate'].textVal = Utility.setFormatDate(new Date(this.rowData.NEXTCHECKDATE), "YYYY-MM-DD");
            this.instrumentDetailShow = true;
        }else{
            this.changeTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00778');
            this.checkIntervalTitle =  this.$i18n.t('MES_CommLang.MES_CommLang_00779');
            this.nextCheckTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00780');
            this.instrumentDetailTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00781');
        }

        this.getDepartmentCombo();
        this.getItemTypeCombo();
        this.getCheckIntervalCombo();
        this.getInstrumentNameCombo();
    },
    methods: {
        // 계측기명 콤보데이터 불러오기
        async getInstrumentNameCombo() {
            await this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetEnumValue",
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    enumid: "InstrumentItemName"
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

                for (let i = 0; i < data.length; i++) {
                    if (i < data.length) {
                        this.InstrumentItemName.push({ id: data[i].ENUMVALUE, text: data[i].ENUMVALUENAME });
                        if (this.rowData.ITEMNAME != undefined && data[i].ENUMVALUE == this.rowData.ITEMNAME) {
                            console.log('a');
                            this.InstrumentItemNameValue = this.InstrumentItemName[i];
                        } else {
                            console.log('b');
                            this.InstrumentItemNameValue = this.InstrumentItemName[0];
                        }
                    }
                }
            })
        },
        async getDepartmentCombo() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetSFDepartment',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
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
                        this.department.push({ id: data[i].ID, text: data[i].NAME });
                        if (this.rowData.DEPARTMENT != undefined && data[i].ID == this.rowData.DEPARTMENT) {
                            this.departmentValue = this.department[i];
                        } else {
                            this.departmentValue = this.department[0];
                        }
                    }
                }
            });
        },
        async getItemTypeCombo() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetItemTypeCombo',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
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
                        this.itemType.push({ id: data[i].ID, text: data[i].NAME });
                        this.itemTypeValue = this.itemType[0];
                        if (this.rowData.ITEMTYPE != undefined && data[i].ID == this.rowData.ITEMTYPE) {
                            this.itemTypeValue = this.itemType[i];
                        }
                    }
                }
            });


        },
        // 점검주기 콤보데이터 불러오기
        async getCheckIntervalCombo() {
            await this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetEnumValue",
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    enumid: "CheckInterval"
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

                for (let i = 0; i < data.length; i++) {
                    if (i < data.length) {
                        this.checkInterval.push({ id: data[i].ENUMVALUE, text: data[i].ENUMVALUENAME });
                        this.checkIntervalValue = this.checkInterval[0];
                        if (this.rowData.CHECKINTERVAL != undefined && data[i].ENUMVALUE == this.rowData.CHECKINTERVAL) {
                            console.log('fff', this.rowData.CHECKINTERVAL);
                            this.checkIntervalValue = this.checkInterval[i];
                        }
                    }
                }
            })
        },

        // 계측기 상태 그리드 데이터 가져오기
        async getInstrumentDetail(itemNo) {
            this.gridData = [];
            this.gridOriData = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetInstrumentDetail',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
                    ITEMNO: itemNo
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
                        ACTIONTIME: new Date(x.ACTIONTIME),
                    };
                });
                this.gridOriData = data;
                this.gridData = data;


                this.paramList = {};

                this.datasetList = {
                    dataset_1: this.initData,
                    dataset_2: this.gridData
                }
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
                    RELATIONTIMEKEY: key
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
                        // FILELOCATION: "\\\\172.31.15.21\\스마트 공장 Track A\\프로젝트관리\\98. 기타\\09.개인폴더\\이홍상\\TEST",
                        UPLOADFILE: '',
                        FILECHANGE: false,
                        FILEUPLOADYN: false,
                    };
                });
                this.gridOriData2 = data;
                this.gridData2 = data;
            });
        },

        fileChange(e, field, dataItem) {
            dataItem.FILENAME = this.fileTimestamp(e.target.files[0].name);
            console.log(dataItem.FILENAME);
            const fileName = e.target.files[0].name.substring(0, e.target.files[0].name.lastIndexOf("."));
            const ext = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
            console.log(this.gridData2);
            this.gridData2 = this.gridData2.map(item => {
                return {
                    ...item,
                    FILELOCATION: item.idx === dataItem.idx ? "/프로젝트관리/98. 기타/09.개인폴더/이홍상/TEST/".concat(dataItem.FILENAME) : item.FILELOCATION,
                    // FILENAME: item.idx === dataItem.idx ? fileName.concat(".").concat(ext) : item.FILENAME,
                    UPLOADFILE: item.idx === dataItem.idx ? e.target.files[0] : item.UPLOADFILE,
                    FILECHANGE: item.idx === dataItem.idx ? true : item.FILECHANGE,
                    rowStat: (item.idx === dataItem.idx) && dataItem.rowStat === 'N' ? 'U' : item.rowStat,
                    // SEQUENCE: item.idx === dataItem.idx ? dataItem.SEQUENCE : item.SEQUENCE,
                };
            });
            console.log("확인:", e.target)
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
        searchAccetBtn() {
            if (this.selectedAccetFlag == 'Y') {
                this.accetNoModalVisible = true;
            } else {
                return;
            }
        },

        //맨앞 checkBox 클릭
        onSelectionchange(event) {
            event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        //그리드 로우 클릭
        onRowClick(event) {
            //그리드 로우 클릭시 라인표시 유무 확인필요
            this.gridData.forEach((x) => (x.selected = false));
            event.dataItem[this.selectedField] = true;
            if (event.dataItem.ACTIONTYPE == "Calibration") {
                this.defaultFileGridShow = true;
                this.relationTimekey = event.dataItem.RELATIONTIMEKEY
                this.getInstrumentDetailFile(event.dataItem.RELATIONTIMEKEY);
            } else {
                this.defaultFileGridShow = false;
            }
        },
        //그리드 로우 클릭
        onRowClick2(event) {
            //그리드 로우 클릭시 라인표시 유무 확인필요
            this.gridData2.forEach((x) => (x.selected = false));
            event.dataItem[this.selectedField] = true;
        },
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog)
        },
        changeInput(nm, val) {
            this.inputData[nm] = val;
        },
        comboChange(nm, val) {
            console.log(nm);
            this.inputData[nm] = val;
            if (nm === "departmentid") {
                this.$refs.comboArea.sendParam.department = this.inputData.DEPARTMENTID;
                this.$refs.comboArea.getComboList();
            }
        },
        isEmptyObject(obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        },
        saveBtn() {
            this.inputData.PLANTID = this.$auth.$state.user.plantId
            this.inputData.ITEMNO = this.itemNo // 계측기ID
            this.inputData.ITEMNAME = this.InstrumentItemNameValue.id; // 계측기명
            this.inputData.ITEMCATEGORY = this.$refs['itemCategory'].textVal; // 범주
            this.inputData.ITEMTYPE = this.$refs['cmbItemType'].value.id; // 분류
            this.inputData.DEPARTMENT = this.$refs['cmbDepartment'].value.id; // 부서
            this.inputData.ASSETFLAG = this.selectedAccetFlag; // 자산여부
            this.inputData.ASSETNO = this.accetNo; // 자산번호
            this.inputData.ACQUISITIONAMOUNT = this.acquisitionAmount; // 취득가액
            this.inputData.RESIDUALAMOUNT = this.residualAmount; // 잔존가액
            this.inputData.ACQUISITIONDATE = this.acquisitionToDate // 취득일
            this.inputData.STANDARD = this.standard // 규격
            this.inputData.MAKER = this.maker; // 제작회사
            this.inputData.MODELNO = this.modelNo;
            this.inputData.SERIALNO = this.serialNo;
            this.inputData.VENDOR = this.vendor; //구매업체
            this.inputData.RESOLUTION = this.resolution; // 분해능
            this.inputData.CHECKINTERVAL = this.checkIntervalValue.id; // 점검주기
            this.inputData.NEXTCHECKDATE = Utility.setFormatDate(this.defaultNextCheckToDate, "YYYY-MM-DD"); // 예정점검일
            this.inputData.DESCRIPTION = "" //비고

            this.saveData[0] = this.inputData;
            console.log(this.saveData);
            if (this.rowData.ITEMNO == undefined) {
                const res = this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnCreateInstrument',
                    sendParam: this.saveData,
                }).then(result => {
                    this.$nextTick(() => {
                        if (result.returncode !== undefined && result.returncode === '0') {

                            this.$emit('instrumentSave', true)
                            this.$emit('visibleDialog', !this.visibleDialog)
                        } else {
                            this.$refs.alertPop.show(
                                'ERROR : ' + result.code,
                                result.message
                            );
                        }
                    });
                });
            } else {
                console.log('b');
                const res = this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnUpdateInstrument',
                    sendParam: this.saveData,
                }).then(result => {
                    this.$nextTick(() => {
                        if (result.returncode !== undefined && result.returncode === '0') {
                            this.$emit('instrumentSave', true);
                            this.$emit('visibleDialog', !this.visibleDialog)
                        } else {
                            this.$refs.alertPop.show(
                                'ERROR : ' + result.code,
                                result.message
                            );
                        }
                    });
                });
            }

        },
        saveBtn2() {
            const saveData = this.gridData
                .filter(x => x.rowStat !== 'N')
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                        ACTIONTIME: Utility.setFormatDate(x.ACTIONTIME, "YYYY-MM-DD hh:mm:ss")
                    };
                });

            const validate = this.mesValidation(this.headerParam.gridHeader, this.gridData);
            if (!validate.isValidate) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
                return;
            }

            if (saveData.length > 0) {
                const res = this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnEditInstrumentDetail',
                    sendParam: saveData,
                }).then(result => {
                    this.$nextTick(() => {
                        if (result.returncode !== undefined && result.returncode === '0') {
                            this.getInstrumentDetail(this.selectedItemNo);
                            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                        } else {
                            this.$refs.alertPop.show(
                                'ERROR : ' + result.code,
                                result.message
                            );
                        }
                    });
                });
            } else {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
                return;
            }
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


        closeBtn() {
            this.$emit('visibleDialog', !this.visibleDialog)
        },
        selectAccetFlag(event) {
            this.accetFlagValue = event.value;
        },
        selectDepartment(event) {
            this.departmentValue = event.value;
        },
        selectItemType(event) {
            this.itemTypeValue = event.value;
            if (event.value.id == "C") {
                this.itemNmInputShow = true;
                this.itemNmCmbShow = false;
            } else if (event.value.id != "C") {
                this.itemNmInputShow = false;
                this.itemNmCmbShow = true;
            }
        },
        changeCheckInterval(event) {
            this.checkIntervalValue = event.value;
            console.log('event.value', event.value);

            let mostRecentRow = null;
            let mostRecentTime = new Date(0); // 초기값을 1970년 1월 1일로 설정
            let lastDate = null;
            this.Calibration = this.gridData.filter(x => x.ACTIONTYPE == "Calibration");

            if (this.gridData.length > 0) {


                for (let i = 0; i < this.Calibration.length; i++) {
                    if (new Date(this.Calibration[i].ACTIONTIME) > mostRecentTime) {
                        mostRecentRow = this.Calibration[i];
                        mostRecentTime = new Date(this.Calibration[i].ACTIONTIME);
                    }
                }

                lastDate = mostRecentTime;
                lastDate.setMonth(lastDate.getMonth() + Number(event.value.id));
            } else {
                console.log('sdsd');
                lastDate = new Date();
                lastDate.setMonth(lastDate.getMonth() + Number(event.value.id));
            }

            if (event.value.id != "NO") {
                this.defaultNextCheckToDate = new Date(Utility.setFormatDate(lastDate, "YYYY-MM-DD"));
                this.NextCheckToDate = this.defaultNextCheckToDate
            } else {
                if (this.gridData.length > 0) {

                    this.defaultNextCheckToDate = new Date(this.rowData.NEXTCHECKDATE);
                    this.NextCheckToDate = this.defaultNextCheckToDate
                } else {
                    this.defaultNextCheckToDate = new Date();
                    this.NextCheckToDate = this.defaultNextCheckToDate
                }
            }
        },
        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
        fromChange(e) {
            this.acquisitionFromDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange(e) {
            this.acquisitionToDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        fromChange2(e) {
            this.lastCheckFromDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange2(e) {
            this.nextCheckToDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
            console.log(e.value);
        },
        accetFlagChange(nm, val) {
            this[nm] = val;
            if (val == 'N') {
                this.selectedAccetFlag = 'N';
                this.isReadOnly = false;
            } else if (val == 'Y') {
                this.selectedAccetFlag = 'Y';
                this.isReadOnly = true;
            }
        },
        itemNameChange(event) {
            this.InstrumentItemNameValue = event.value;
        },
        // checkIntervalChange(nm, val) {
        //     this[nm] = val;
        //     console.log(val);

        // },

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

        //데이터 원상복구시 "수정" 항목 제거
        chkOriginalData(gridData, idx) {
            const data = JSON.parse(JSON.stringify(gridData));
            const keys = Object.keys(data[idx]);
            const chkArr = keys.filter((x) => {
                return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
            });
            return chkArr.length > 0;
        },

        //그리드 인풋 제외 데이터 변경시
        rowDdChange(e, name, dataItem) {
            console.log('a');
            const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
            const Data = JSON.parse(JSON.stringify(this.gridData));

            if (this.gridOriData)
                Data[idx] = { ...Data[idx], [name]: e.value };

            if (Data[idx].rowStat === "N") {
                Data[idx].rowStat = 'U';
            }

            if (
                Data[idx].rowStat === 'U' &&
                !this.gfn_ChkOriginalData(this.headerParam.gridHeader, Data, this.gridOriData, idx)
            ) {
                Data[idx].rowStat = 'N';
            }

            this.gridData = Data;
        },
        //unbo 버튼 클릭
        undoBtn() {
            this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
        },
        //unbo 버튼 클릭
        undoBtn2() {
            this.gridData2 = this.gridOriData2.filter((x) => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
        },
    },
};
</script>
<style lang="scss">
.search-box {
    width: 100%;
}
</style>