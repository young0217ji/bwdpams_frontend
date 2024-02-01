<template>
    <div>
        <span v-if="!visibleDialog">
            <Button @click="toggleDialog">Open Dialog</Button>
        </span>
        <Dialog v-if="visibleDialog" :title="title" width="550px" height="350px" @close="toggleDialog">
            <v-row :style="{ margiBottom: '10px', width: '100%' }">
                <v-col :sm="12" :lg="12" align="left" :style="{ width: '100%' }">
                    <v-row class="search-box" align="center" no-gutters
                        :style="{ width: '100%', marginBottom: '10px', marginRight: '15px' }">
                        <v-col :sm="12" :lg="12" align="right">
                            <div :style="{ float: 'right' }">
                                <Button :theme-color="'primary'" :size="'small'" icon="save" @click="save">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                                <Button :theme-color="'primary'" :size="'small'" icon="close" @click="toggleDialog">{{
                                    $t("MES_CommLang.MES_CommLang_00413") }}</Button> <!-- 닫기 -->
                            </div>
                        </v-col>
                    </v-row>
                    <v-row :style="{ marginLeft: '20px' }">
                        <div class="detail-area">
                            <div class="left-area">
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px;">{{
                                            $t("MES_CommLang.MES_CommLang_00622") }}</label><!-- 예비품 코드 -->
                                    </div>
                                    <div class="area-td">
                                        <inputText ref="sparePartCode" :boxWidth="'70%'" :dataNm="'sparePartCode'"
                                            :disabled="false"
                                            :readonly="true" style="float: left; margin-right: -30px;" />
                                        <Button :theme-color="'primary'" :size="'small'" :icon="'add'"
                                            :style="{ width: '25px', float: 'left', marginTop: '5px' }"
                                            @click="PlusButtonClick"></Button>
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">{{
                                            $t("MES_CommLang.MES_CommLang_00623") }}</label> <!-- 예비품명 -->
                                    </div>
                                    <div class="area-td">
                                        <inputText ref="sparePartName" :boxWidth="'100%'" :dataNm="'sparePartName'"
                                            :disabled="false"
                                            :readonly="true" style="float: left; margin-right: 15px;" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="detail-area">
                            <div class="left-area">
                                <div class="area-form">
                                    <div class="area-th">
                                        <label  style="float: left; margin-top: 5px; margin-right: 14px;">{{
                                            $t("MES_CommLang.MES_CommLang_00294") }}</label> <!-- 창고코드-->
                                    </div>
                                    <div class="area-td">
                                        <inputText ref="warehouseCode" :boxWidth="'70%'" :dataNm="'warehouseCode'"
                                            :disabled="false" 
                                            :readonly="true" style="float: left; margin-right: -30px;" />
                                        <Button :theme-color="'primary'" :size="'small'" :icon="'add'"
                                            
                                            :style="{ width: '25px', float: 'left', marginTop: '5px' }"
                                            @click="WarehousePlusBtnClick"></Button>
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">{{
                                            $t("MES_CommLang.MES_CommLang_00293") }}</label> <!--창고명-->
                                    </div>
                                    <div class="area-td">
                                        <inputText ref="warehouseName" :boxWidth="'100%'" :dataNm="'warehouseName'"
                                            :disabled="false" 
                                            :readonly="true" style="float: left; margin-right: 15px;" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="detail-area">
                            <div class="left-area">
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">{{ stringNum
                                        }}</label>
                                    </div>
                                    <div class="area-td">
                                        <inputText ref="inoutQty" :boxWidth="'100%'" :dataNm="'qty'" :disabled="false"
                                            @input-text-set="searchInput"
                                            style="float: left; margin-right: 15px;" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-row>
                </v-col>
            </v-row>
        </Dialog>
        <SparePartModal ref="SparePartModal" v-if="sparePartModalVisible" :visibleDialog="sparePartModalVisible"
            :title="sparePartModalTitle" :selected-field="selectedField"
            @visibleDialog="val => (sparePartModalVisible = val)" @selectedRow="selectedRow" />
        <WarehouseCodeModal ref="WarehouseCodeModal" v-if="warehouseCodeModalVisible"
            :visibleDialog="warehouseCodeModalVisible" :title="warehouseCodeModalTitle" :selected-field="selectedField"
            @visibleDialog="val => (warehouseCodeModalVisible = val)" @warehouseSelectedRow="warehouseSelectedRow" />
            <AlertPop ref="alertPop" :is="'alertPop'" />
            <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import SelectUser from "@/components/frmPMManagementTabs/SelectUser";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { NumericTextBox, TextArea } from '@progress/kendo-vue-inputs';
import SparePartModal from '@/components/frmSparePart/SparePartModal.vue';
import WarehouseCodeModal from '@/components/frmMaterialManagement/WarehouseCodeModal.vue';

export default {
    name: "SetDescriptionModal",
    mixins: [mixinGlobal],
    components: {
        Dialog,
        DialogActionsBar,
        Button,
        InputText,
        SelectUser,
        Utility,
        Card,
        CardBody,
        CardTitle,
        TextArea,
        SparePartModal,
        WarehouseCodeModal
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
        title: {
            type: String,
            default: () => "",
        },
        workType: {
            type: String,
            default: () => "",
        },
        selectedMaterialId: {
            type: String,
            defalut: () => "",
        },
        selectedMaterialName: {
            type:String,
            defalut: () => "",
        },
        selectedWarehouseId: {
            type: String,
            default: () => "",
        },
        selectedWarehouseName: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {
            sparePartModalVisible: false,
            selectedField: 'selected',
            warehouseCodeModalVisible: false,
            qty: '',
            sparePartCode: '',
            warehouseCode: '',
            warehouseName:'',
            sparePartName:'',
            stringNum: '',
        }
    },    
    computed: {
    },
    async mounted() {
        this.sparePartModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00595'); /* 예비품 선택/등록 */
        this.warehouseCodeModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00627'); // 창고 선택/등록
        this.stringNum = this.workType == 'input' ? this.$i18n.t('MES_CommLang.MES_CommLang_00218') : this.$i18n.t('MES_CommLang.MES_CommLang_00303'); /* 입고수량, 출고수량 */
        this.setId = this.selectedMaterialId
        console.log('모달창에서 ID', this.selectedMaterialId);
        this.$refs['sparePartCode'].textVal = this.selectedMaterialId;
        this.$refs['sparePartName'].textVal = this.selectedMaterialName;
        this.$refs['warehouseCode'].textVal = this.selectedWarehouseId;
        this.$refs['warehouseName'].textVal = this.selectedWarehouseName;
    },
    methods: {
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog);
        },
        save() {
    
            if (this.workType == "input") {
                let saveData = [];
                saveData.push({
                    PLANTID: this.$auth.$state.user.plantId,
                    MATERIALID: this.sparePartCode,
                    WAREHOUSEID: this.warehouseCode,
                    INQTY: this.qty,
                });

                if(saveData[0].MATERIALID == '' || saveData[0].MATERIALID == 'undefined'){
                    if(saveData[0].WAREHOUSEID == '' || saveData[0].WAREHOUSEID == 'undefined'){
                        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('Mes_MsgLang.MES_MsgLang_00245')); /*알림, 예비품코드와 창고코드를 입력해주세요 */
                        return
                    }
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('Mes_MsgLang.MES_MsgLang_00246')); /*알림, 예비품코드를 입력해주세요 */
                return
                } else if(saveData[0].WAREHOUSEID == '' || saveData[0].WAREHOUSEID == 'undefined'){
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'),this.$i18n.t('Mes_MsgLang.MES_MsgLang_00247')); /*알림, 창고코드를 입력해주세요 */
                        return
                }
                if(saveData[0].INQTY == ''){
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('Mes_MsgLang.MES_MsgLang_00248')); /*알림, 입고수량를 입력해주세요 */
                        return
                }
                saveData = saveData.map(item => saveData);
                this.$emit("MaterialStockSaveData", saveData);
            } else if (this.workType == "output") {
                let saveData = [];
                saveData.push({
                    PLANTID: this.$auth.$state.user.plantId,
                    MATERIALID: this.sparePartCode,
                    WAREHOUSEID: this.warehouseCode,
                    OUTQTY: this.qty,
                });

                if(saveData[0].MATERIALID == '' || saveData[0].MATERIALID == 'undefined'){
                    if(saveData[0].WAREHOUSEID == '' || saveData[0].WAREHOUSEID == 'undefined'){
                        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('Mes_MsgLang.MES_MsgLang_00245')); /*알림, 예비품코드를 입력해주세요 */
                        return
                    }
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('Mes_MsgLang.MES_MsgLang_00246')); /*알림, 예비품코드를 입력해주세요 */
                return
                } else if(saveData[0].WAREHOUSEID == '' || saveData[0].WAREHOUSEID == 'undefined'){
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('Mes_MsgLang.MES_MsgLang_00247')); /*알림, 창고코드를 입력해주세요 */
                        return
                }
                if(saveData[0].OUTQTY == ''){
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('Mes_MsgLang.MES_MsgLang_00249')); /*알림, 출고수량를 입력해주세요 */
                        return
                }

                saveData = saveData.map(item => saveData);
                this.$emit("MaterialStockSaveData", saveData);
            }
        },
        searchInput(nm, val) {
            if ( nm == 'qty' ) {
                val = val.replace(/[^0-9]/gi, '');
                this.$refs['inoutQty'].textVal = val;
            }
            this[nm] = val;
        },
        selectedRow(row) {
            this.sparePartCode = row.SPAREPARTID;
            this.$refs['sparePartCode'].textVal = row.SPAREPARTID;
            this.$refs['sparePartName'].textVal = row.SPAREPARTNAME;
        },
        warehouseSelectedRow(row) {
            this.warehouseCode = row.WAREHOUSEID;
            this.$refs['warehouseCode'].textVal = row.WAREHOUSEID;
            this.$refs['warehouseName'].textVal = row.WAREHOUSENAME;
        },
        // + Button Click
        PlusButtonClick() {
            this.sparePartModalVisible = true;
        },
        // Warehouse + Button Click
        WarehousePlusBtnClick() {
            this.warehouseCodeModalVisible = true;
        },

    },
};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
    .divList1 {
        height: 339px !important;
    }

    .divList2 {
        height: auto !important;
    }

    .divList3 {
        height: 213px !important;
    }
}</style>