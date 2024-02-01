<template>
    <div>
        <Dialog v-if="visibleDialog" :title="$t('MES_CommLang.MES_CommLang_00728')" width="55%" height="250" @close="toggleDialog">
            <v-row no-gutters style="margin-bottom: -7px;">
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: -10px;"> {{ $t("MES_CommLang.MES_CommLang_00728") }}</CardTitle><!-- 검교정 결과 등록 -->
                </v-col>
                <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                        $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                </v-col>
            </v-row>
            <v-row ref="searchFilter">
                <v-col :cols="12">
                    <Card style="background-color: #f1f2f7;">
                        <CardBody style="padding: 10px;">
                            <v-row no-gutters>
                                <v-col :cols="12">
                                    <div class="form-group-wrap" style="margin-bottom: 5px;">
                                        <div class="form-group">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00729") }}</label><!-- 교정구분 -->
                                            <InputText ref="actiontype" :dataNm="'actiontype'" :disabled="false" :readonly="true"
                                                :searchOption="true" />
                                        </div>
                                        
                                        <div class="form-group">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00730") }}</label> <!-- 교정업체 -->
                                            <InputText ref="actionCompany" :dataNm="'actionCompany'" :disabled="false"
                                                :readonly="isReadOnly" :searchOption="true" @input-text-set="searchInput" />
                                            <Button :theme-color="'primary'" @click="companyListVisible = true">{{$t("MES_CommLang.MES_CommLang_00042")}} </Button>
                                            <!--검색 -->
                                        </div>
                                        <div class="form-group">
                                            <InputText ref="actionCompanyName" :dataNm="'actionCompanyName'" :disabled="false"
                                                :readonly="isReadOnly" :searchOption="true" @input-text-set="searchInput" />
                                        </div>
                                        <div class="form-group">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00731") }}</label> <!-- 교정일자 -->
                                            <div class="form-datepicker">
                                                <DatePicker ref="actionTime" :default-value="new Date()"
                                                    :dataNm="'actionTime'" :format="'yyyy-MM-dd'"
                                                    @change="toChange" />
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00732") }}</label> <!-- 교정결과 -->
                                            <DropDownList ref="cmbactionResult" :style="{ width: '165px' }"
                                                :data-items="actionResult" :text-field="'text'" :data-item-key="'id'"
                                                :value="actionResultValue" @change="selectActionResult">
                                            </DropDownList>
                                        </div>
                                        <div class="form-group">
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00729") }}</label> <!-- 교정구분 -->
                                            <DropDownList ref="cmbActiontypeDetail" :style="{ width: '250px' }" :data-items="actiontypeDetailGroup"
                                            :text-field="'text'" :data-item-key="'id'" :value="value"
                                            @change="selectActiontypeDetailGroup">
                                        </DropDownList>
                                        </div>
                                        <div class="form-group">
                                            <label>{{$t("MES_CommLang.MES_CommLang_00487") }}</label> <!-- 비고 -->
                                            <InputText ref="description" :dataNm="'description'" :disabled="false" :readonly="false"
                                                :searchOption="true" style="width: 618px;" />
                                        </div>
                                        
                                    </div>
                                </v-col>
                            </v-row>
                        </CardBody>
                    </Card>
                </v-col>
            </v-row>
        </Dialog>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <CompanyListModal ref="CompanyList" v-if="companyListVisible" :visibleDialog="companyListVisible"
        :title="'title'" :message="'message'" :callBack="() => { }" @visibleDialog="val => (companyListVisible = val)"
        @companyCode="companyCode" />
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
import CompanyListModal from "@/components/frmInstrument/FrmCompanysearch";

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일

export default {
    name: "FrmCalibrationInstrument",
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
        CompanyListModal
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
        initData2: {

        },
    },
    data() {
        return {
            inputData: {
                PLANTID:"",
                ITEMNO: "",
                ACTIONTYPE:"",
                ACTIONRESULT:"",
                ACTIONCOMPANY:"",
                ACTIONTIME:"",
                DESCRIPTION: "",
            },
            inputData2: {},
            selectedField: 'selected',
            gridOriData: [],
            gridData: [],

            itemNo:[],
            actiontypeid:"",
            actiontype:"",
            actionCompany: '',
            actionCompanyName:'',
            actionTime: '',
            description: '',
            actionResult: [],
            actionResultValue:{ id: '', text: '' },
            actiontypeDetailGroup : [],
            
            isReadOnly: true,
            saveData: [],
            rowData: [],

            companyListVisible:false,
        }
    },
    computed: {
    },
    async mounted() {
        this.actionResult.push({ id : 'OK', text : 'OK' });
        this.actionResult.push({ id : 'NG', text : 'NG' });
        this.$refs['actiontype'].textVal = this.$i18n.t('MES_CommLang.MES_CommLang_00734'); //검교정
        this.actionResultValue = this.actionResult[0]; 
        this.rowData = this.initData2;
        this.getActionTypeDetailData();
    },
    methods: {
        async getActionTypeDetailData() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetInstrumentActionType',
                sendParam: {
                },
            }).then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.actiontypeDetailGroup.push({ id: res[i].ID, text: res[i].NAME });
                        this.value = this.actiontypeDetailGroup[0];
                    }
                }
            });
        },
        searchAccetBtn() {
            if (this.selectedAccetFlag == 'Y') {
                this.accetNoModalVisible = true;
            } else {
                return;
            }
        },
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog)
        },
        saveBtn() {
            this.actiontypeid = "Calibration";
            for(let i = 0; i < this.rowData.length; i++){
                this.saveData.push({
                                    PLANTID :this.$auth.$state.user.plantId,
                                    ITEMNO : this.rowData[i].ITEMNO,
                                    ACTIONTYPE:this.actiontypeid,
                                    ACTIONCOMPANY:this.$refs['actionCompany'].textVal,
                                    ACTIONTIME:this.actionTime,
                                    ACTIONTYPEDETAIL: this.$refs['cmbActiontypeDetail'].value.id,
                                    ACTIONRESULT:this.$refs['cmbactionResult'].value.id,
                                    DESCRIPTION:this.$refs['description'].textVal
                                });
            }

            const res = this.mesPost({
                apiKey: 'mes/common/manage',
                messagename: 'TxnInstrumentMaintenance',
                sendParam: this.saveData,
            }).then(result => {
                this.$nextTick(() => {
                    if (result.returncode !== undefined && result.returncode === '0') {
                        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                        this.$emit('instrumentDetailAdd', true)
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
        closeBtn() {
            this.$emit('visibleDialog', !this.visibleDialog)
        },
        selectActionResult(event) {
            this.actionResultValue = event.value;
        },
        companyCode(data) {
        this.actionCompany = data.COMPANYID;
        this.actionCompanyName = data.COMPANYNAME
        this.$refs['actionCompany'].textVal = this.actionCompany;
        this.$refs['actionCompanyName'].textVal = this.actionCompanyName;
        },

        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
        toChange(e) {
            this.actionTime = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        selectActiontypeDetailGroup(event) {
            this.value = event.value;
        },
    },
};
</script>
<style lang="scss">.search-box {
    width: 100%;
}</style>