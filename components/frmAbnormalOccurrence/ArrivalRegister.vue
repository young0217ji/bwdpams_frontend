<template>
    <div>
        <Dialog v-if="visibleDialog" :title="$t('MES_CommLang.MES_CommLang_00906')" width="55%" height="200"
            @close="toggleDialog">
            <v-row no-gutters style="margin-bottom: -7px;">
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: -10px;"> {{ $t("MES_CommLang.MES_CommLang_00906") }}</CardTitle>
                    <!-- 검교정 결과 등록 -->
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
                                        <div class="form-group">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00909") }} </label> <!-- 발생코드 -->
                                            <InputText ref="occurrencecode" :dataNm="'occurrencecode'" :disabled="false" :readonly="true"
                                                :searchOption="true" />
                                        </div>
                                        <div class="form-group" style="margin-left: 1%;">
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00908") }}</label><!-- 이상발생 구분 -->
                                            <InputText ref="abnormalType" :dataNm="'abnormalType'" :disabled="false"
                                                :readonly="true" :searchOption="true" />
                                        </div>
                                        <div class="form-group" >
                                            <label>{{ $t("MES_CommLang.MES_CommLang_00910") }}</label> <!-- 최초판정 -->
                                            <MesSelectBox :enumID="'ArrivalResult'" :allYN="false" :dataNm="'ArrivalResult'"
                                                @comboChange="comboChange"></MesSelectBox>
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
        <!-- <CompanyListModal ref="CompanyList" v-if="companyListVisible" :visibleDialog="companyListVisible" :title="'title'"
            :message="'message'" :callBack="() => { }" @visibleDialog="val => (companyListVisible = val)"
            @companyCode="companyCode" /> -->
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
// import CompanyListModal from "@/components/frmInstrument/FrmCompanysearch";

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
        // CompanyListModal
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
            inputData: {},
            selectedField: 'selected',

            abnormalType: "",
            abnormalState: '',
            actionTime: '',
            occurrencecode: '',
            actionResult: [],
            actionResultValue: { id: '', text: '' },
            actiontypeDetailGroup: [],
            ArrivalResult: 'Precess',

            isReadOnly: true,
            saveData: [],
            rowData: [],

            companyListVisible: false,
            abnormalState: '',
        }
    },
    computed: {
        userInfo: (state) => state.$store.$auth.$state.user,
    },
    async mounted() {
        console.log(this.initData);
        this.$refs['abnormalType'].textVal = this.initData.ABNORMALTYPENAME;
        this.$refs['occurrencecode'].textVal = this.initData.OCCURRENCECODE;
    },
    methods: {
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog)
        },
        saveBtn() {
            this.saveData = [];
            this.actiontypeid = "Calibration";
            if(this.ArrivalResult == 'Precess'){
                this.abnormalState = 'Precessing';
            }else if(this.ArrivalResult == "Return"){
                this.abnormalState = "Returned";
            }
            this.saveData.push(this.initData);
            this.saveData = this.saveData.map(x => {
                return {
                    ...x,
                    _ROWSTATUS : 'U',
                    ARRIVALRESULT : this.ArrivalResult,
                    ARRIVALTIME : Utility.setFormatDate(new Date(), "YYYY-MM-DD hh:mm:ss"),
                    ARRIVALUSERID : this.userInfo.userId,
                    ABNORMALSTATE : this.abnormalState
                }
            })
            console.log('a',this.saveData);
            const res = this.mesPost({
                apiKey: 'mes/common/manage',
                messagename: 'TxnAbnormalOccurrence',
                sendParam: this.saveData,
            }).then(result => {
                this.$nextTick(() => {
                    if (result.returncode !== undefined && result.returncode === '0') {
                        this.$emit('arrivalSave', true)
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
        selectActiontypeDetailGroup(event) {
            this.value = event.value;
        },
    },
};
</script>
<style lang="scss">.search-box {
    width: 100%;
}</style>