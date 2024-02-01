<template>
    <div>
        <Dialog v-if="visibleDialog" :title="$t('MES_CommLang.MES_CommLang_00802')" width="55%" height="250" @close="toggleDialog">
            <v-row no-gutters style="margin-bottom: -7px;">
                <v-col cols="6" align="left">
                    <CardTitle style="margin-bottom: -10px;"> {{ $t("MES_CommLang.MES_CommLang_00802") }}</CardTitle><!-- 일괄 변경 -->
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
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00714") }}</label> <!-- 사용부서 -->
                                        <DropDownList ref="cmbProGroup" :style="{ width: '250px' }" :data-items="deptGroup"
                                            :text-field="'text'" :data-item-key="'id'" :value="value"
                                            @change="selectDeptGroup">
                                        </DropDownList>
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
    name: "FrmBulkChange",
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
                PLANTID: "",
                ITEMNO: "",
                ITEMNAME: "",
                ITEMCATEGORY: "",
                ITEMTYPE: "",
                DEPARTMENT: "",
                ASSETFLAG: "",
                ASSETNO: "",
                ITEMGRADE: "",
                ITEMSTATE: "",
                ACQUISITIONAMOUNT: "",
                RESIDUALAMOUNT: "",
                ACQUISITIONDATE: "",
                ACQUISITIONREASONE: "",
                MAKER: "",
                MODELNO: "",
                SERIALNO: "",
                VENDOR: "",
                STANDARD: "",
                RESOLUTION: "",
                CHECKINTERVAL: "",
                NEXTCHECKDATE: "",
                DESCRIPTION: "",
            },

            inputData2: {},
            selectedField: 'selected',
            gridOriData: [],
            gridData: [],
            deptGroup: [],
            value: '',

            itemNo:[],
            
            isReadOnly: true,
            saveData: [],
            rowData: [],

            companyListVisible:false,
        }
    },
    computed: {
    },
    async mounted() {
        this.rowData = this.initData2;
        await this.getDeptGroupData();
    },
    methods: {
        async getDeptGroupData() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetDeptCombo',
                sendParam: {
                },
            }).then(res => {
                for (let i = 0; i < res.length; i++) {
                    if (i < res.length) {
                        this.deptGroup.push({ id: res[i].ID, text: res[i].NAME });
                        this.value = this.deptGroup[0];
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
            for(let i = 0; i < this.rowData.length; i++){
                this.saveData.push({
                                    PLANTID : this.rowData[i].PLANTID, 
                                    ITEMNO : this.rowData[i].ITEMNO,
                                    ITEMNAME : this.rowData[i].ITEMNAME,
                                    ITEMCATEGORY : this.rowData[i].ITEMCATEGORY,
                                    ITEMTYPE : this.rowData[i].ITEMTYPE,
                                    DEPARTMENT : this.value.id,
                                    ASSETFLAG : this.rowData[i].ASSETFLAG,
                                    ASSETNO : this.rowData[i].ASSETNO,
                                    ITEMGRADE : this.rowData[i].ITEMGRADE,
                                    ITEMSTATE : this.rowData[i].ITEMSTATE,
                                    ACQUISITIONAMOUNT : this.rowData[i].ACQUISITIONAMOUNT,
                                    RESIDUALAMOUNT : this.rowData[i].RESIDUALAMOUNT,
                                    ACQUISITIONDATE : this.rowData[i].ACQUISITIONDATE,
                                    ACQUISITIONREASONE : this.rowData[i].ACQUISITIONREASONE,
                                    MAKER : this.rowData[i].MAKER,
                                    MODELNO : this.rowData[i].MODELNO,
                                    SERIALNO : this.rowData[i].SERIALNO,
                                    VENDOR : this.rowData[i].VENDOR,
                                    STANDARD : this.rowData[i].STANDARD,
                                    RESOLUTION : this.rowData[i].RESOLUTION,
                                    CHECKINTERVAL : this.rowData[i].CHECKINTERVAL,
                                    NEXTCHECKDATE : this.rowData[i].NEXTCHECKDATE,
                                    DESCRIPTION : this.rowData[i].DESCRIPTION,
                                });
            }
            const res = this.mesPost({
                apiKey: 'mes/common/manage',
                messagename: 'TxnUpdateInstrument',
                sendParam: this.saveData,
            }).then(result => {
                this.$nextTick(() => {
                    if (result.returncode !== undefined && result.returncode === '0') {
                        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                        this.$emit('bulkChangeinstrument', true)
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
        selectDeptGroup(event) {
            this.value = event.value;
        },
        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
    },
};
</script>
<style lang="scss">.search-box {
    width: 100%;
}</style>