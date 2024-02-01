<template>
    <div>
        <Dialog v-if="visibleDialog" :title="$t('MES_CommLang.MES_CommLang_00942')" width="55%" height="900"
            @close="toggleDialog">
            <v-row no-gutters style="margin-bottom: -7px;">
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: -10px;"> {{ $t("MES_CommLang.MES_CommLang_00942") }}</CardTitle>
                </v-col>
                <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                        $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                </v-col>
            </v-row>
            <v-row ref="searchFilter">
                <v-col :cols="12">
                    <Card style="background-color: #f1f2f7;">
                        <CardBody style="padding: 20px;">
                            <v-row no-gutters>
                                <v-col :cols="12">
                                    <div class="form-group-wrap" style="margin-bottom: 5px;">
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label> W/O</label><!--  -->
                                            <InputText ref="workorderID" :dataNm="'workorderID'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00052") }}</label><!-- 공정 -->
                                            <InputText ref="processID" :dataNm="'processID'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00943") }}</label><!-- 설비 -->
                                            <InputText ref="equipmentID" :dataNm="'equipmentID'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00258") }}</label><!-- 품번 -->
                                            <InputText ref="productID" :dataNm="'productID'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00260") }}</label><!-- 품번명 -->
                                            <InputText ref="productName" :dataNm="'productName'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00908") }}</label><!-- 이상발생 구분 -->
                                            <InputText ref="abnormalType" :dataNm="'abnormalType'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00148") }}</label> <!-- 상태 -->
                                            <InputText ref="abnormalState" :dataNm="'abnormalState'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00944") }}</label><!-- 이상발생 KEY -->
                                            <InputText ref="dataKey" :dataNm="'dataKey'" :disabled="false" :readonly="true"
                                                :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00945") }}</label><!-- 발생시간 -->
                                            <InputText ref="occurrenceTime" :dataNm="'occurrenceTime'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00946") }}</label><!-- 발생유저 -->
                                            <InputText ref="occurrenceUserID" :dataNm="'occurrenceUserID'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 20%;">
                                        </div>
                                        <div class="form-group" style="margin-left: 1%; width: 830px;">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00947") }}</label><!-- 발생내용 -->
                                            <InputText ref="occurrenceComment" :dataNm="'occurrenceComment'"
                                                :readonly="false" :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00948") }}</label><!-- 도착시간 -->
                                            <InputText ref="arrivalTime" :dataNm="'arrivalTime'" :readonly="false"
                                                :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00949") }}</label><!-- 도착유저 -->
                                            <InputText ref="arrivalUserID" :dataNm="'arrivalUserID'" :readonly="false"
                                                :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00950") }}</label><!-- 판단 -->
                                            <MesSelectBox :enumID="'arrivalResult'" :allYN="false" :dataNm="'arrivalResult'"
                                                @comboChange="comboChange"></MesSelectBox>
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00951") }}</label><!-- 완료시간 -->
                                            <InputText ref="finishTime" :dataNm="'finishTime'" :readonly="false"
                                                :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00952") }}</label><!-- 완료유저 -->
                                            <InputText ref="finishUserID" :dataNm="'finishUserID'" :readonly="false"
                                                :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00953") }}</label><!-- 완료결과 -->
                                            <InputText ref="finishResult" :dataNm="'finishResult'" :readonly="false"
                                                :searchOption="true" />
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </CardBody>
                    </Card>
                </v-col>
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: 0px;">{{
                        $t("MES_CommLang.MES_CommLang_00955") }}</CardTitle> <!-- 처리내용 -->
                </v-col>
                <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn2">{{
                        $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                </v-col>
                <Card>
                    <CardBody style="padding: 20px; background-color: #f1f2f7;">
                        <v-row no-gutters>
                            <v-col :cols="12">
                                <div class="form-group-wrap" style="margin-bottom: 5px;">
                                    <div class="form-group" style="margin-left: 2%;">
                                        <label>
                                            {{ $t("MES_CommLang.MES_CommLang_00954") }}</label> <!-- 처리코드 -->
                                        <DropDownList ref="cmbReasonCode1" :style="{ width: '250px' }"
                                            :data-items="reasoncode1" :text-field="'text'" :data-item-key="'id'"
                                            :value="value1" @change="selectReasonCode1">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group" style="margin-left: 4%;">
                                        <DropDownList ref="cmbReasonCode2" :style="{ width: '250px' }"
                                            :data-items="reasoncode2" :text-field="'text'" :data-item-key="'id'"
                                            :value="value2" @change="selectReasonCode2">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group" style="margin-left: 4%;">
                                        <DropDownList ref="cmbReasonCode3" :style="{ width: '250px' }"
                                            :data-items="reasoncode3" :text-field="'text'" :data-item-key="'id'"
                                            :value="value3" @change="selectReasonCode3"><!-- actionCode -->
                                        </DropDownList>
                                    </div>
                                    <div class="form-group" style="margin-left: 2%; width: 935px;">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00955") }}</label> <!-- 처리내용 -->
                                        <InputText ref="actionComment" :dataNm="'actionComment'" :readonly="false"
                                            :searchOption="true" />
                                    </div>
                                    <div class="form-group" style="margin-left: 2%;">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00957") }}</label> <!-- 비가동 등록 연결  -->
                                        <InputText ref="lineStopCode" :dataNm="'lineStopCode'" :disabled="false"
                                            :readonly="isReadOnly" :searchOption="true" @input-text-set="searchInput" />
                                        <Button :theme-color="'primary'" @click="searchLineStopBtn">{{
                                            $t("MES_CommLang.MES_CommLang_00042") }}</Button>
                                        <!-- 검색 -->
                                    </div>
                                    <div class="form-group" style="margin-left: 1.5%;">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00958") }}</label> <!-- 부적합 등록 연결 -->
                                        <InputText ref="defectReport" :dataNm="'defectReport'" :disabled="false"
                                            :readonly="isReadOnly" :searchOption="true" @input-text-set="searchInput" />
                                        <Button :theme-color="'primary'" @click="searchDefectBtn">{{
                                            $t("MES_CommLang.MES_CommLang_00042") }}</Button>
                                        <!-- 검색 -->
                                    </div>
                                </div>
                            </v-col>

                        </v-row>
                    </CardBody>
                </Card>
            </v-row>
            <v-row ref="contents">
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: 0px;">{{
                        $t("MES_CommLang.MES_CommLang_00956") }}</CardTitle> <!-- 파일등록 -->
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
                <v-col :cols="12" :class="'divListWapper'" :style="{ height: 'calc(100% - 33px)' }">
                    <div ref="divWrapper" :style="{ height: '90%' }">
                        <KendoGrid :isPaging="false" ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData"
                            :sortable="true" :columns="headerParam.gridHeader" :resizable="false" :edit-field="'inEdit'"
                            :selected-field="selectedField" @gridrowclick="onRowClick" @fileChange="fileChange"
                            @griditemchange="griditemchange" />
                    </div>
                </v-col>
            </v-row>
        </Dialog>

        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <LineStopListModal ref="lineStopList" v-if="lineStopListVisible" :visibleDialog="lineStopListVisible"
            :title="'title'" :message="'message'" :initData2="initData2" :callBack="() => { }"
            @visibleDialog="(val) => lineStopListVisible = val" @lineStopListDetail="lineStopListDetail" />
        <DefectListModal ref="defectList" v-if="defectListVisible" :visibleDialog="defectListVisible" :title="'title'"
            :message="'message'" :initData2="initData2" :callBack="() => { }"
            @visibleDialog="(val) => defectListVisible = val" @defectListDetail="defectListDetail" />
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
import LineStopListModal from "@/components/frmAbnormalOccurrence/LineStopList";
import DefectListModal from "@/components/frmAbnormalOccurrence/DefectList";

// const d = new Date();
// let year = d.getFullYear(); // 년
// let month = d.getMonth();   // 월
// let day = d.getDate();      // 일

export default {
    name: "AdditionalRegister",
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
        LineStopListModal,
        DefectListModal
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
            gridData: [],
            gridOriData: [],
            gridHeight: '',
            selectedField: 'selected',
            value: {},
            columns: [],

            headerParam: {
                gridid: 'dgvAbnormalOccurrenceFile',
                rowStat: '',
                noFirstCheck: true,
                selectedID: null,
                selected: null,
                gridHeader: [],
            },


            inputData: {
                _ROWSTATUS: "",
                DATAKEY: "",
                ABNORMALSTATE: "",
                OCCURRENCECOMMENT: "",
                ARRIVALTIME: "",
                ARRIVALUSERID: "",
                ARRIVALRESULT: "",
                FINISHTIME: "",
                FINISHUSERID: "",
                FINISHRESULT: "",

                WORKORDERID:"",
                PRODUCTID:"",
                PROCESSID:"",
                EQUIPMENTID:"",
                ABNORMALTYPE:"",
                ABNORMALSTATE:"",
                OCCURRENCETIME:"",
                OCCURRENCEUSERID:"",
            },

            inputData2: {
                PLANTID: "",
                DATAKEY: "",
                ACTIONCODE: "",
                ACTIONCOMMENT: "",
                LINESTOPCODE: "",
                DEFECTREPORTID: "",
                DESCRIPTION: "",
            },

            selectedField: 'selected',

            abnormalType: "",
            abnormalState: "",
            dataKey: "",
            occurrenceTime: "",
            occurrenceUserID: "",
            occurrenceComment: "",
            workorderID: "",
            processID: "",
            equipmentID: "",
            productID: "",
            productName: "",
            arrivalTime: "",
            arrivalUserID: "",
            arrivalResult: "",
            arrivalResultValue: {},
            finishTime: "",
            finishUserID: "",
            finishResult: "",
            lineStopCode: "",
            defectReport: "",

            reasoncode1: [],
            reasoncode2: [],
            reasoncode3: [],
            value1: {},
            value2: {},
            value3: {},

            actionResult: [],
            actionResultValue: { id: '', text: '' },
            actiontypeDetailGroup: [],

            isReadOnly: true,
            saveData: [],
            saveData2: [],
            rowData: [],
            initData2: [],

            lineStopListVisible: false,
            defectListVisible: false,
            abnormalState: '',

            FILEUPLOADYN:true
        }
    },
    computed: {
        //userInfo: (state) => state.$store.$auth.$state.user,
    },
    async mounted() {
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);

        this.getReasonCode1();
        this.$refs['workorderID'].textVal = this.initData.WORKORDERID;
        this.$refs['processID'].textVal = this.initData.PROCESSID;
        this.$refs['equipmentID'].textVal = this.initData.EQUIPMENTID;
        this.$refs['productID'].textVal = this.initData.PRODUCTID;
        this.$refs['productName'].textVal = this.initData.PRODUCTNAME;
        this.$refs['abnormalType'].textVal = this.initData.ABNORMALTYPENAME;
        this.$refs['abnormalState'].textVal = this.initData.ABNORMALSTATE;
        this.$refs['dataKey'].textVal = this.initData.DATAKEY;
        this.$refs['occurrenceTime'].textVal = this.initData.OCCURRENCETIME;
        this.$refs['occurrenceUserID'].textVal = this.initData.OCCURRENCEUSERID;
        this.$refs['occurrenceComment'].textVal = this.initData.OCCURRENCECOMMENT;
        this.$refs['arrivalTime'].textVal = this.initData.ARRIVALTIME;
        this.$refs['arrivalUserID'].textVal = this.initData.ARRIVALUSERID;
        this.$refs['finishTime'].textVal = this.initData.FINISHTIME;
        this.$refs['finishUserID'].textVal = this.initData.FINISHUSERID;
        this.$refs['finishResult'].textVal = this.initData.FINISHRESULT;
        this.arrivalResult = "Precess";

        this.getGridData();

        console.log(this.arrivalResult);
    },
    methods: {
        //그리드 데이터 가져오기
        async getGridData() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetAbnormalOccurrenceFile',
                sendParam: {
                },
            }).then(res => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: 'N',
                        selected: idx === 0,
                        idx: idx,
                        inEdit: false,
                        newRow: false,
                        FILEUPLOADYN :true,
                    };
                });
                this.$nuxt.$emit('iccReset');
                this.gridOriData = data;
                this.gridData = data;
            });
        },
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog)
        },
        // 진행내용부분
        saveBtn() {
            this.inputData._ROWSTATUS = "U";
            this.inputData.DATAKEY = this.$refs['dataKey'].textVal;
            this.inputData.ABNORMALSTATE = this.initData.ABNORMALSTATE;
            this.inputData.OCCURRENCECOMMENT = this.$refs['occurrenceComment'].textVal; // 발생내용
            this.inputData.ARRIVALTIME = this.$refs['arrivalTime'].textVal; // 도착시간
            this.inputData.ARRIVALUSERID = this.$refs['arrivalUserID'].textVal; // 도착유저
            this.inputData.ARRIVALRESULT = this.arrivalResult; // 판단
            this.inputData.FINISHTIME = this.$refs['finishTime'].textVal; // 완료시간
            this.inputData.FINISHUSERID = this.$refs['finishUserID'].textVal; // 완료유저
            this.inputData.FINISHRESULT = this.$refs['finishResult'].textVal; // 완료결과
            this.inputData.FINISHCOMMENT = this.initData.FINISHCOMMENT;
            this.inputData.WORKORDERID = this.initData.WORKORDERID;
            this.inputData.PRODUCTID = this.initData.PRODUCTID;
            this.inputData.PROCESSID = this.initData.PROCESSID;
            this.inputData.EQUIPMENTID = this.initData.EQUIPMENTID;
            this.inputData.ABNORMALTYPE = this.initData.ABNORMALTYPE;
            this.inputData.ABNORMALSTATE = this.initData.ABNORMALSTATE;
            this.inputData.OCCURRENCETIME = this.initData.OCCURRENCETIME;
            this.inputData.OCCURRENCEUSERID = this.initData.OCCURRENCEUSERID;


            this.saveData[0] = this.inputData;
            const res = this.mesPost({
                apiKey: 'mes/common/manage',
                messagename: 'TxnAbnormalOccurrenceUpdate',
                sendParam: this.saveData,
            }).then(result => {
                this.$nextTick(() => {
                    if (result.returncode !== undefined && result.returncode === '0') {

                        this.$emit('additionalSave', true)
                        this.$emit('visibleDialog', !this.visibleDialog)
                    } else {
                        this.$refs.alertPop.show(
                            'ERROR : ' + result.code,
                            result.message
                        );
                    }
                });
            });
        },
        // 처리내용 저장부분
        saveBtn2() {
            if (this.$refs['lineStopCode'].textVal == "" || this.$refs['lineStopCode'].textVal == null) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00297')); /* 알림, 비가동 등록 연결을 입력해주세요. */
                return;
            }

            if (this.$refs['defectReport'].textVal == "" || this.$refs['defectReport'].textVal == null) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00298')); /* 알림, 부적합 등록 연결을 입력해주세요. */
                return;
            }

            this.inputData2.PLANTID = this.$auth.$state.user.plantId;
            this.inputData2.DATAKEY = this.$refs['dataKey'].textVal;
            this.inputData2.ACTIONCODE = this.value3.id;
            this.inputData2.ACTIONCOMMENT = this.$refs['actionComment'].textVal;
            this.inputData2.LINESTOPCODE = this.$refs['lineStopCode'].textVal;
            this.inputData2.DEFECTREPORTID = this.$refs['defectReport'].textVal;
            this.inputData2.DESCRIPTION = "";

            this.saveData2[0] = this.inputData2;
            const res = this.mesPost({
                apiKey: 'mes/common/manage',
                messagename: 'TxnAbnormalOccurrenceAction',
                sendParam: this.saveData2,
            }).then(result => {
                this.$nextTick(() => {
                    if (result.returncode !== undefined && result.returncode === '0') {

                        this.$emit('additionalSave', true)
                        this.$emit('visibleDialog', !this.visibleDialog)
                    } else {
                        this.$refs.alertPop.show(
                            'ERROR : ' + result.code,
                            result.message
                        );
                    }
                });
            });
        },
        // 파일저장부분
        saveBtn3() {
            // 디테일 데이터
            const saveDataFile = this.gridData
                .filter(x => x.rowStat !== 'N')
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                    };
                });

            const fileList = [];
            this.gridData.filter(x => !this.isNullOrEmpty(x.FILENAME) && x.FILECHANGE).map((x, idx) => {
                fileList.push({
                    file: x.UPLOADFILE,
                    fileName: x.FILENAME,
                    fileLocation: "\\\\172.31.15.21\\스마트 공장 Track A\\프로젝트관리\\98. 기타\\09.개인폴더\\이홍상\\TEST\\\\",
                })
            });
            const validateDetail = this.mesValidation(this.headerParam.gridHeader, this.gridData);

            if (!validateDetail.isValidate) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validateDetail.msg); // 알림
                return;
            }

            console.log('fileList', fileList);
            if (saveDataFile.length > 0) {
                if (this.mesFileUpload(fileList)) {
                    const res = this.mesPost({
                        apiKey: 'mes/common/manage',
                        messagename: 'TxnAbnormalOccurrenceFile',
                        sendParam: saveDataFile,
                    }).then(result => {
                        this.$nextTick(() => {
                            if (result.returncode !== undefined && result.returncode === '0') {
                                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                                this.getGridData();
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
        async getReasonCode1() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetReasoncodeComboList',
                queryVersion: '00001',
                sendParam: {
                    REASONCODETYPE: 'ABNORMAL',
                    LEVELNO: '1',
                    SUPERREASONCODE: 'ABNORMAL'
                },
            }).then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.reasoncode1.push({ id: res[i].REASONCODE, text: res[i].DESCRIPTION });
                        this.value1 = this.reasoncode1[0];
                    }
                }
                this.getReasonCode2();
            });
        },

        async getReasonCode2() {
            this.reasoncode2 = [];
            this.value2 = {};
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetReasoncodeComboList',
                queryVersion: '00001',
                sendParam: {
                    REASONCODETYPE: 'ABNORMAL',
                    LEVELNO: '2',
                    SUPERREASONCODE: this.value1.id
                },
            }).then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.reasoncode2.push({ id: res[i].REASONCODE, text: res[i].DESCRIPTION });
                        this.value2 = this.reasoncode2[0];
                    }
                }
                this.getReasonCode3();
            });
        },

        async getReasonCode3() {
            this.reasoncode3 = [];
            this.value3 = {};
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetReasoncodeComboList',
                queryVersion: '00001',
                sendParam: {
                    REASONCODETYPE: 'ABNORMAL',
                    LEVELNO: '3',
                    SUPERREASONCODE: this.value2.id
                },
            }).then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.reasoncode3.push({ id: res[i].REASONCODE, text: res[i].DESCRIPTION });
                        this.value3 = this.reasoncode3[0];
                    }
                }
            });
        },
        closeBtn() {
            this.$emit('visibleDialog', !this.visibleDialog)
        },
        searchLineStopBtn() {
            this.initData2 = this.initData;
            this.lineStopListVisible = true;
        },
        lineStopListDetail(data) {
            this.lineStopCode = data.LINESTOPCODE;
            this.$refs['lineStopCode'].textVal = this.lineStopCode;
        },
        searchDefectBtn() {
            this.initData2 = this.initData;
            this.defectListVisible = true;
        },
        defectListDetail(data) {
            this.defectReport = data.DEFECTREPORTID;
            this.$refs['defectReport'].textVal = this.defectReport;
        },
        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
        toChange(e) {
            this.actionTime = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        comboChange(nm, val) {
            this[nm] = val;
        },
        selectReasonCode1(event) {
            this.value1 = event.value;
            this.getReasonCode2();
        },
        selectReasonCode2(event) {
            this.value2 = event.value;
            this.getReasonCode3();
        },
        selectReasonCode3(event) {
            this.value3 = event.value;
        },
        onRowClick(event) {
            const selectedIdx = event.dataItem.idx;
            this.gridData.forEach(item => {
                item.selected = item.idx === selectedIdx;
            });
            this.selectedID = event.dataItem.COMPANYID;
        },
        addBtn() {
            this.$refs.rowGrid.skip = 0;
            const newRowUUid = Math.round(Math.random() * 1000000000).toString()
            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: false,
                PLANTID: this.$auth.$state.user.plantId,
                rowStat: "C",
                _ROWSTATUS: "C",
                newRowUUid: newRowUUid,
                idx: this.gridData.length,
                DATAKEY: this.$refs['dataKey'].textVal,
                FILENAME: "",
                UPLOADFILE:'',
                //파일 업로드시 저장되는 경로
                FILELOCATION: "",
                FILECHANGE: false,
                LocalDownYN: false,
                FILEUPLOADYN: true
            };
            this.gridData.splice(this.gridData.length, 0, dataItem)
            this.$nuxt.$emit('iccReset')
        },
        //unbo 버튼 클릭
        undoBtn2() {
            this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
        },
        //삭제버튼
        confirmDel() {
            const delData = this.gridData
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
            const data = JSON.parse(JSON.stringify(this.gridData));
            this.gridData = data
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
        fileChange(e, field, dataItem) {
            const fileName = e.target.files[0].name.substring(0, e.target.files[0].name.lastIndexOf("."));
            const ext = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
            console.log(this.gridData);
            this.gridData = this.gridData.map(item => {
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
        //그리드 인풋 데이터 변경시
        griditemchange(e) {
            const data = JSON.parse(JSON.stringify(this.gridData));
            const idx = data.findIndex(x => x.idx === e.dataItem.idx);
            const file = this.gridData[idx].UPLOADFILE;

            data.forEach((item, index) => {
                if (this.gridData[index].UPLOADFILE) {
                    item.UPLOADFILE = this.gridData[index].UPLOADFILE;
                }
            });
            /**************************** 시간 : 분 형식 시작 *****************/
            if (e.field === 'STARTTIME' || e.field === 'ENDTIME') {
                const hour = [];
                const min = [];
                e.value = e.value.replace(/[^0-9]/gi, '');
                if (e.value.length > 4) {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00266'));
                }
                for (let i = 2; i <= 3; i++) {
                    min[i - 2] = e.value[i];
                }
                for (let i = 0; i <= 1; i++) {
                    hour[i] = e.value[i];

                    if (min[i] == null) {
                        min[i] = '0';
                    }
                    if (hour[i] == null) {
                        hour[i] = '0'
                    }
                }
                e.value = hour[0] + hour[1] + ":" + min[0] + min[1]
            }
            /**************************** 시간 : 분 형식 끝 *****************/
            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === 'N') {
                data[idx].rowStat = 'U';
            }
            if (
                data[idx].rowStat === 'U' &&
                !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)
            ) {
                data[idx].rowStat = 'N';
            }
            data[idx].UPLOADFILE = file;
            this.gridData = data;
        },
    },
};
</script>
<style lang="scss">
.search-box {
    width: 100%;
}
</style>