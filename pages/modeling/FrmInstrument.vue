<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00162") }}</li> <!-- 생산관리 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00713") }}</li> <!-- 계측기 관리 -->
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
                                        <label> {{ $t("MES_CommLang.MES_CommLang_00148") }} </label> <!-- 상태 -->
                                        <MesSelectBox :enumID="'ItemState'" :allYN="true" :dataNm="'itemState'"
                                            @comboChange="comboChange"></MesSelectBox>
                                    </div>
                                    <div class="form-group">
                                        <label> {{ $t("MES_CommLang.MES_CommLang_00729") }} </label> <!-- 교정구분 -->
                                        <MesSelectBox :enumID="'InstrumentRevision'" :allYN="true"
                                            :dataNm="'instrumentRevision'" @comboChange="comboChange"></MesSelectBox>
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
                            <v-col :sm="6" :lg="6" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" @click="newCalibrationbtn">{{
                                    $t("MES_CommLang.MES_CommLang_00924") }}</Button><!--교정-->
                                <Button :theme-color="'primary'" :size="'medium'" @click="repairbtn">{{
                                    $t("MES_CommLang.MES_CommLang_00735") }}</Button><!--수리실적-->
                                <Button :theme-color="'primary'" :size="'medium'" @click="Disusebtn">{{
                                    $t("MES_CommLang.MES_CommLang_00514") }}</Button><!--폐기-->
                                <Button :theme-color="'primary'" :size="'medium'" @click="Retalbtn">{{
                                    $t("MES_CommLang.MES_CommLang_00736") }}</Button><!--대여-->
                                <Button :theme-color="'primary'" :size="'medium'" @click="Returnbtn">{{
                                    $t("MES_CommLang.MES_CommLang_00926") }}</Button><!--반납-->
                                <Button :theme-color="'primary'" :size="'medium'" @click="Changebtn">{{
                                    $t("MES_CommLang.MES_CommLang_00802") }}</Button><!--일괄 변경-->
                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <v-row ref="contents">
            <v-col :sm="12" :lg="12" :class="'divListWapper'" :style="{ height: '100%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00719") }}</CardTitle> <!-- 계측기정보 -->
                            </v-col>
                            <v-col cols="6" align="right">
                                <Button :theme-color="'primary'" :size="'small'" :icon="'add'" @click="newCreateBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00166")
                                }}</Button><!--생성-->
                                <!-- <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="confirmDel">{{
                                    $t("MES_CommLang.MES_CommLang_00412") }}</Button> -->
                                     <!-- 삭제 -->
                                <!-- <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</Button>  -->
                                <!-- 저장 -->
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
        </v-row>
        <CreateInstrument ref="createInstrument" v-if="createInstrumentVisible" :visibleDialog="createInstrumentVisible"
            :title="'title'" :message="'message'" :initData="initData" :callBack="() => { }"
            @visibleDialog="(val) => createInstrumentVisible = val" @instrumentSave="instrumentSave" />

        <CalibrationInstrument ref="calibrationInstrument" v-if="calibrationInstrumentVisible"
            :visibleDialog="calibrationInstrumentVisible" :title="'title'" :message="'message'" :initData2="initData2"
            :callBack="() => { }" @visibleDialog="(val) => calibrationInstrumentVisible = val"
            @instrumentDetailAdd="instrumentDetailAdd" />

        <RepairInstrument ref="repairInstrument" v-if="repairInstrumentVisible" :visibleDialog="repairInstrumentVisible"
            :title="'title'" :message="'message'" :initData2="initData2" :callBack="() => { }"
            @visibleDialog="(val) => repairInstrumentVisible = val" @repairinstrumentDetail="repairinstrumentDetail" />

        <DisuseInstrument ref="disuseInstrument" v-if="disuseInstrumentVisible" :visibleDialog="disuseInstrumentVisible"
            :title="'title'" :message="'message'" :initData2="initData2" :callBack="() => { }"
            @visibleDialog="(val) => disuseInstrumentVisible = val" @disuseinstrumentDetail="disuseinstrumentDetail" />

        <RetalInstrument ref="retalInstrument" v-if="retalInstrumentVisible" :visibleDialog="retalInstrumentVisible"
            :title="'title'" :message="'message'" :initData2="initData2" :callBack="() => { }"
            @visibleDialog="(val) => retalInstrumentVisible = val" @retalinstrumentDetail="retalinstrumentDetail" />

        <ReturnInstrument ref="returnInstrument" v-if="returnInstrumentVisible" :visibleDialog="returnInstrumentVisible"
            :title="'title'" :message="'message'" :initData2="initData2" :callBack="() => { }"
            @visibleDialog="(val) => returnInstrumentVisible = val" @returninstrumentDetail="returninstrumentDetail" />

        <BulkChange ref="bulkChange" v-if="bulkChangeVisible" :visibleDialog="bulkChangeVisible" :title="'title'"
            :message="'message'" :initData2="initData2" :callBack="() => { }"
            @visibleDialog="(val) => bulkChangeVisible = val" @bulkChangeinstrument="bulkChangeinstrument" />
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
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
import ReturnInstrument from "@/components/frmInstrument/FrmReturnInstrument";
import BulkChange from "@/components/frmInstrument/FrmBulkChange";

let myTitle;
let myMenuId;

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
        ReturnInstrument
    },
    props: {
        gridHeight: {
            type: String,
            defaultData: "200px",
        },
    },
    data() {
        return {
            gridData: [],
            headerParam: {
                gridid: "dgvInstrument", // 그리드 ID
                gridHeader: [],
                enumComboBox: [],
                noRowstat: true,
                noFirstCheck: false,
                xOverflowYn: true,
            },
            gridHeader: [],
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
            returnInstrumentVisible: false,
            bulkChangeVisible: false,

            initData: [],
            initData2: [],
            itemState: '',
            instrumentRevision: ''
        };
    },
    created() {
    },
    async mounted() {
        await this.getDeptGroupData();
        await this.getItemTypeCombo();
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper, this.customDropDown);
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
            console.log('z', this.itemState)
            console.log('x', this.instrumentRevision)
            this.gridData = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetInstrument',
                queryVersion: '00001',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    DEPARTMENT: this.value.id,
                    ITEMNO: this.itemNo,
                    ASSETNO: this.assetNo,
                    ITEMTYPE: this.value2.id,
                    STANDARD: this.standard,
                    ITEMSTATE: this.itemState,
                    INSTRUMENTREVISION: this.instrumentRevision
                },
            }).then(res => {
                const data = res.map((x, idx) => {
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
                this.gridData = data;
            });
        },
        // 저장
        saveBtn() {
            const saveData = this.gridData
                .filter(x => x.rowStat !== 'N')
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                    };
                });

            const validate = this.mesValidation(
                this.headerParam.gridHeader,
                this.gridData
            );
            if (!validate.isValidate) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); // 알림
                return;
            }

            if (saveData.length > 0) {
                const res = this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnDeleteInstrument',
                    sendParam: saveData,
                }).then(result => {
                    this.$nextTick(() => {
                        this.getGridData();
                        if (result.returncode !== undefined && result.returncode === '0') {
                            this.$refs.alertPop.show(
                                this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
                                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); //저장되었습니다.
                        } else {
                            this.$refs.alertPop.show(
                                'ERROR : ' + result.code,
                                result.message
                            );
                        }
                    });
                });
            } else {
                this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); //저장할 데이터가 없습니다.
                return;
            }
        },
        onRowClick(event) {
            const selectedIdx = event.dataItem.idx;
            this.gridData = this.gridData.map(item => {
                return {
                    ...item,
                    selected: item.idx === selectedIdx ? !item.selected : item.selected,
                };
            });
            //this.gridData.forEach(x => (x.selected = false));
            //event.dataItem[this.selectedField] = true;
            this.selected = event.dataItem;
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

        //그리드 더블 클릭
        rowdblclick(event) {
            this.createInstrumentVisible = true;
            this.initData[0] = event.dataItem;
        },

        // 신규생성 버튼 클릭
        newCreateBtn() {
            this.createInstrumentVisible = true;
            this.initData = [];
        },

        // 검교정 버튼 클릭
        newCalibrationbtn() {
            this.initData2 = this.gridData.filter(x => (x.selected == true));
            console.log(this.initData2);
            if (this.initData2.length == 0) {
                this.calibrationInstrumentVisible = false;
            }
            for (let i = 0; i < this.initData2.length; i++) {
                if (this.initData2[i].ITEMSTATE == 'Disuse') {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00294')); // 알림, 이미 폐기된 상태입니다.
                    return;
                } 
            }
            this.calibrationInstrumentVisible = true;
        },
        // 수리실적 버튼 클릭
        repairbtn() {
            this.initData2 = this.gridData.filter(x => (x.selected == true));
            console.log(this.initData2);
            if (this.initData2.length == 0) {
                this.repairInstrumentVisible = false;
            }
            for (let i = 0; i < this.initData2.length; i++) {
                if (this.initData2[i].ITEMSTATE == 'Disuse') {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00294')); // 알림, 이미 폐기된 상태입니다.
                    return;
                } 
            }
            this.repairInstrumentVisible = true;
        },
        // 폐기 버튼 클릭
        Disusebtn() {
            this.initData2 = this.gridData.filter(x => (x.selected == true));
            if (this.initData2.length == 0) {
                this.disuseInstrumentVisible = false;
            }
            for (let i = 0; i < this.initData2.length; i++) {
                if (this.initData2[i].ITEMSTATE == 'Rental') {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00293')); // 알림, 대여상태일 경우 폐기를 진행할 수 없습니다.
                    return;
                } else if (this.initData2[i].ITEMSTATE == 'Disuse') {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00294')); // 알림, 이미 폐기된 상태입니다.
                    return;
                }
            }
            this.disuseInstrumentVisible = true;
        },
        // 대여 버튼 클릭
        Retalbtn() {
            this.initData2 = this.gridData.filter(x => (x.selected == true));
            if (this.initData2.length == 0) {
                this.retalInstrumentVisible = false;
            }
            for (let i = 0; i < this.initData2.length; i++) {
                if (this.initData2[i].ITEMSTATE == 'Disuse') {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00294')); // 알림, 이미 폐기된 상태입니다.
                    return;
                } 
            }
            this.retalInstrumentVisible = true;
        },
        // 반납 버튼 클릭
        Returnbtn() {

            this.initData2 = this.gridData.filter(x => (x.selected == true));
            if (this.initData2.length == 0) {
                this.returnInstrumentVisible = false;
            }
            for (let i = 0; i < this.initData2.length; i++) {
                if (this.initData2[i].ITEMSTATE == 'Disuse') {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00294')); // 알림, 이미 폐기된 상태입니다.
                    return;
                } 
            }
            this.returnInstrumentVisible = true;

            console.log(this.initData2);
        },
        // 일괄변경 버튼 클릭
        Changebtn() {
            this.initData2 = this.gridData.filter(x => (x.selected == true));
            if (this.initData2.length == 0) {
                this.bulkChangeVisible = false;
            }
            for (let i = 0; i < this.initData2.length; i++) {
                if (this.initData2[i].ITEMSTATE == 'Disuse') {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00294')); // 알림, 이미 폐기된 상태입니다.
                    return;
                } 
            }
            console.log(this.initData2);
            this.bulkChangeVisible = true;
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
                        .map((x) => x.ITEMNO);

                    this.$refs['confirmPop'].title = 'info';
                    this.$refs['confirmPop'].message = delData[0].ITEMNO + " - " + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); // 선택한 데이터를 삭제 하시겠습니까?
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

            this.saveBtn();
        },


        instrumentSave(res) {
            if (res) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getGridData();
            }
        },
        instrumentDetailAdd(res) {
            if (res) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getGridData();
            }
        },
        repairinstrumentDetail(res) {
            if (res) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getGridData();
            }
        },
        disuseinstrumentDetail(res) {
            if (res) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getGridData();
            }
        },
        retalinstrumentDetail(res) {
            if (res) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getGridData();
            }
        },
        returninstrumentDetail(res) {
            if (res) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getGridData();
            }
        },
        bulkChangeinstrument(res) {
            if (res) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getGridData();
            }
        },
    }
};
const defaultData = {};
</script>