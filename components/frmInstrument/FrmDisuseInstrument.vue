<template>
    <div>
        <Dialog v-if="visibleDialog" :title="$t('MES_CommLang.MES_CommLang_00759')" width="55%" height="250" @close="toggleDialog">
            <v-row no-gutters style="margin-bottom: -7px;">
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: -10px;"> {{ $t("MES_CommLang.MES_CommLang_00759") }}</CardTitle><!-- 폐기 등록 -->
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
                                            <label> {{ $t("MES_CommLang.MES_CommLang_00347") }}</label> <!-- 일자 -->
                                            <div class="form-datepicker">
                                                <DatePicker ref="actionTime" :default-value="new Date()"
                                                    :dataNm="'actionTime'" :format="'yyyy-MM-dd'"
                                                    @change="toChange" />
                                            </div>
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
    name: "FrmDisuseInstrument",
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
                ACTIONCOMPANY:"",
                ACTIONTIME:"",
                DESCRIPTION: "",
                ACTIONCOST:"",
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
            actioncost: '',
            actionTime: '',
            description: '',
            
            isReadOnly: true,
            saveData: [],
            rowData: [],

            companyListVisible:false,
        }
    },
    computed: {
    },
    async mounted() {
        this.$refs['actiontype'].textVal = this.$i18n.t('MES_CommLang.MES_CommLang_00514'); // 폐기
        this.rowData = this.initData2;
    },
    methods: {
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
            this.actiontypeid = "Disuse";
            for(let i = 0; i < this.rowData.length; i++){
                this.saveData.push({
                                    PLANTID :this.$auth.$state.user.plantId,
                                    ITEMNO : this.rowData[i].ITEMNO,
                                    ACTIONTYPE:this.actiontypeid,
                                    ACTIONCOMPANY:this.$refs['actionCompany'].textVal,
                                    ACTIONCOST: this.$refs['actioncost'].textVal,
                                    ACTIONTIME:this.actionTime,
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
                        this.$emit('disuseinstrumentDetail', true)
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
        setNumber(nm, val) {
            this.$refs['actioncost'].textVal = Utility.setNumber(val);
            if(this.$refs['actioncost'].textVal == ""){
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00268')); /* 알림, 비용은 숫자만 입력가능합니다. */
            }
        },  
        closeBtn() {
            this.$emit('visibleDialog', !this.visibleDialog)
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
    },
};
</script>
<style lang="scss">.search-box {
    width: 100%;
}</style>