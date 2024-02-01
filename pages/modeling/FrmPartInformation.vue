<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00913") }}</li> <!-- PART그룹 기준정보 -->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row no-gutters>
                            <v-col :sm="9" :lg="10">
                                <div class="form-group-wrap">
                                    <div class="form-group">
                                        <Label>Line</Label>
                                        <DropDownList ref="cmbLine" :boxWidth="'100%'" :data-items="line"
                                            :text-field="'text'" :data-item-key="'id'" :value="value" @change="comboChange">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group" style="width: 272px; margin-left: 8px;">
                                        <Label>WorkCenter</Label>
                                        <DropDownList ref="cmbWorkCenter" :boxWidth="'80%'" :data-items="workCenter"
                                            :text-field="'text'" :data-item-key="'id'" :value="value2"
                                            @change="comboChange2">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00542") }}</label> <!-- 제품그룹명 -->
                                        <DropDownList ref="cmbProGroup" :style="{ width: '250px' }"
                                            :data-items="productGroup" :text-field="'text'" :data-item-key="'id'"
                                            :value="value3" @change="selectProGroup">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00259") }}</label> <!-- 제품ID -->
                                        <InputText ref="productid" :dataNm="'productid'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                </div>
                            </v-col>
                            <v-col :sm="3" :lg="2" align="right">
                                <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00277") }}</kbutton> <!-- 조회 -->
                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <v-row ref="contents">
            <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00914") }}</CardTitle> <!-- PART그룹 정보 -->
                            </v-col>
                            <v-col cols="6" align="right">
                                <kbutton :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</kbutton> <!-- 저장 -->
                                <kbutton :theme-color="'secondary'" :size="'small'" icon="add" @click="addBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00411") }}</kbutton> <!-- 추가 -->
                                <kbutton :theme-color="'secondary'" :size="'small'" icon="delete" @click="confirmDel">{{
                                    $t("MES_CommLang.MES_CommLang_00412") }}</kbutton> <!-- 삭제 -->
                                <kbutton :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO
                                </kbutton>
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                                :gridPageData="gridPageData" :columns="headerParam.gridHeader"
                                :gridDropDownList="headerParam.enumComboBox" :resizable="false" :customCell="customCell"
                                :changeCell="changeCell" :edit-field="'inEdit'" :isPaging="true" :reSetPage="this.reSetPage"
                                :selected-field="selectedField" @pageChangeEvent="pageChangeEvent"
                                @selectionchange="onSelectionchange" @headerselectionchange="onHeaderSelectionChange"
                                @sortChangeHandler="sortChangeHandler" @gridButtonClick="gridButtonClick"
                                @gridddchang="rowDdChange" @griditemchange="griditemchange" @gridrowclick="onRowClick" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <WindowPop ref="windowPop" :formName="'Education'"></WindowPop>
        <SelectProductModal ref="SelectProductModal" v-if="SelectProductModalVisible"
            :visibleDialog="SelectProductModalVisible" :title="productModalTitle" :selected-field="selectedField"
            @visibleDialog="val => (SelectProductModalVisible = val)" @selectedRow="selectedRow" />
    </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import WindowPop from '@/components/common/WindowPop';
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';


let myTitle;
let myMenuId;

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일

export default {
    mixins: [mixinGlobal, gridHeaderMinin],
    async asyncData(context) {
        const myState = context.store.state;
        myMenuId = context.route.query.menuId;
        await context.store.commit('setActiveMenuInfo', myState.menuData[myMenuId]);
        myTitle = await myState.activeMenuInfo.menuName;
    },
    meta: {
        title: () => {
            return myTitle;
        },
        menuId: myMenuId,
        closable: true,
    },
    components: {
        InputText,
        MesSelectBox,
        Utility,
        Card,
        kbutton: Button,
        CardBody,
        CardTitle,
        KendoGrid,
        DropDownList,
        WindowPop,
        DatePicker,
        SelectProductModal
    },
    data() {
        return {
            columns: [],
            gridHeight: '100px',
            gridData: [],
            gridPageData: {},
            gridOriData: [],
            gridLastModIdx: null,
            selectedField: 'selected',
            // checkHeaderArr: ['ACTIVESTATE'],
            headerParam: {
                gridid: 'dgvPartInformation', // 그리드 ID
                rowStat: '', //rowStat 표시 여부
                enumComboBox: [],
                checkBox: [],
                noFirstCheck: true,
                noRowstat: false,
                xOverflowYn: false, // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
                gridHeader: [],
                gridDropDownList: [
                    {
                        dataVal: "WORKCENTER",
                        dataItem: [],
                        disable: false,
                    },
                ],
            },
            customCell: ['WORKCENTER'],
            changeCell: [
                {
                    cellName: 'PRODUCTBUTTON',
                    upperCell: '',
                    condition: false,
                    dataItem: [],
                },
            ],
            reSetPage: false,
            productGroup: [],                    /* Line */
            value: {},
            value2: { id: '', text: '' }, /* WorkCenter */
            value3: {},
            line: [],
            columns: [],
            workCenter: [],
            initData: '',
            productid: '',
            comboList: [],
            SelectProductModalVisible: false,
            btnClickIdx: '',
            productModalTitle: ''
        };
    },
    created() { },
    async mounted() {
        this.productModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00262'); /* 품번목록 */
        await this.getProductGroupData();
        await this.getComboData();
        await this.getGridData();
        await this.getGridComboList();
    },
    computed: {
        areAllSelected() {
            return (
                this.gridData.findIndex(x => x.checked === false) === -1 &&
                this.gridData.length !== 0
            );
        },
    },
    watch: {},
    methods: {
        onRowClick(event) {
            this.gridData.forEach((x) => (x.selected = false));
            event.dataItem[this.selectedField] = true;
        },
        notPageReset(flag) {
            // flag : false
            this.reSetPage = flag;
        },
        // 조회
        searchBtn() {
            this.reSetPage = true;
            this.getGridData();
        },

        //unbo 버튼 클릭
        undoBtn() {
            this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
            this.$nuxt.$emit("iccReset");
        },

        //그리드 데이터 가져오기
        async getGridData() {
            this.gridOriData = [];
            this.gridData = [];
            const { skip = 0, take = 20 } = this.gridPageData;
            this.mesGet({
                apiKey: 'mes/common/customquerypaging',
                queryId: 'GetPartInformation',
                queryVersion: '00001',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
                    WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
                    PRODUCTID: this.productid,
                    PRODUCTGROUPID: this.$refs['cmbProGroup'].value.id,
                    skip: skip,
                    take: take,
                },
            }).then(({ list, paging, ...x }) => {

                const data = list.map((x, idx) => {
                    const customCell = {
                        WORKCENTER: {
                            type: 'text',
                            dataItem: this.headerParam.gridDropDownList[0].dataItem,
                            disable: true,
                            readonly: true
                        },
                    };
                    return {
                        ...x,
                        rowStat: 'N',
                        selected: false,
                        idx: idx,
                        inEdit: true,
                        newRow: false,
                        resizable: true,
                        customCell
                    };
                });
                //GIRD input v-model초기화, chkbox초기화 위해 추가
                this.$nuxt.$emit('iccReset');
                this.gridPageData = paging;
                this.gridOriData = data;
                this.gridData = data;

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
        // 제품그룹 콤보 데이터 가져오기
        async getProductGroupData() {

            this.gridOriData = [];
            this.gridData = [];
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetProductGroupList',
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
                for (let i = 0; i < data.length; i++) {
                    if (i < data.length) {
                        this.productGroup.push({ id: data[i].PRODUCTGROUPID, text: data[i].PRODUCTGROUPNAME });
                        this.value3 = this.productGroup[0];
                    }
                }
            });
        },
        //그리드 WorckCenter 콤보박스 리스트가져오기
        async getGridComboList() {
            this.headerParam.gridDropDownList[0].dataItem = [];

            await this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetAreaList",
                queryVersion: "00002",
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                }
            }).then((data) => {
                const combo = data.map(x => {
                    return {
                        ENUMVALUE: x.CODE,
                        ENUMVALUENAME: x.NAME,
                    }
                })
                this.comboList = combo;
                this.headerParam.gridDropDownList[0].dataItem = combo;
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

            const validate = this.mesValidation(this.gridHeader, this.gridData);
            if (!validate.isValidate) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
                return;
            }


            if (saveData.length > 0) {
                const res = this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnPartInformation',
                    sendParam: saveData,
                }).then(result => {
                    this.$nextTick(() => {
                        this.getGridData();
                        if (result.returncode !== undefined && result.returncode === '0') {
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
        //unbo 버튼 클릭
        undoBtn() {
            this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
            this.$nuxt.$emit("iccReset");
        },
        async pageChangeEvent(skip = 0, take = 20) {
            this.gridPageData = {
                skip: skip,
                take: take
            }
            this.reSetPage = false;
            this.getGridData();

        },
        //삭제버튼
        confirmDel() {
            const delData = this.gridData
                .filter(x => x.selected === true)
                .map(x => {
                    return {
                        ...x,
                    };
                });
            if (delData.length > 0) {
                this.$refs['confirmPop'].title = 'info';
                this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); //선택한 데이터를 삭제 하시겠습니까?
                if (delData.filter(x => x.rowStat !== 'C').length >= 1) {
                    var selectedRow = {};
                    selectedRow = delData.map(x => x.EQUIPMENTID);
                    this.$refs[
                        'confirmPop'
                    ].message = selectedRow + ' - ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제 하시겠습니까? */
                }
                this.$refs['confirmPop'].modalWidth = '300px';
                this.$refs['confirmPop'].visibleDialog = true;
                this.$refs['confirmPop'].callBack = this.delBtn;
            } else {
                this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00409'), //확인
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')//선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.
                );
                return;
            }
        },
        //추가 버튼 클릭
        addBtn() {
            this.$refs.rowGrid.skip = 0;
            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: false,
                PLANTID: this.$auth.$state.user.plantId,
                FIRSTPARTINSPECTION: '',
                SECONDPARTINSPECTION: '',
                JIGNUMBER: '',
                DESCRIPTION: '',
                rowStat: 'C',
                changeCellType: 'button', // 검색 버튼 나오도록
                PRODUCTBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
                customCell: {
                    WORKCENTER: {
                        type: 'combo',
                        dataItem: this.headerParam.gridDropDownList[0].dataItem,
                        disable: false,
                    },
                },
                CREATEUSERID: '',
                CREATETIME: '',
                idx: this.gridData.length,

            };

            this.gridData.splice(0, 0, dataItem);
            this.$nuxt.$emit('iccReset');
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

        // 검색조건 Line 콤보 change 이벤트
        comboChange(event) {

            this.value = event.value;
            // 검색조건 Line콤보박스 선택값에 따라 검색조건 WorkCenter 콤보 데이터 가져오기
            this.getWorkCenterComboList(event.value.id);
        },
        // 검색조건 WorkCenter 콤보 change 이벤트
        comboChange2(event) {
            this.value2 = event.value;
            this.initData = event.value.id;
        },

        //맨앞 checkBox 클릭
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
        //그리드 인풋 제외 데이터 변경시
        rowDdChange(e, name, dataItem) {
            const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
            const data = JSON.parse(JSON.stringify(this.gridData));

            if (name === 'ACTIVESTATE') {
                e.value = e.value ? 'Active' : 'Inactive';
            }

            data[idx] = { ...data[idx], [name]: e.value };
            if (data[idx].rowStat === 'N') {
                data[idx].rowStat = 'U';
            }
            if (
                data[idx].rowStat === 'U' &&
                !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
            ) {
                data[idx].rowStat = 'N';
            }

            this.gridData = data;
        },
        //그리드 인풋 데이터 변경시
        griditemchange(e) {
            const data = JSON.parse(JSON.stringify(this.gridData));
            const idx = data.findIndex(x => x.idx === e.dataItem.idx);
            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === 'N') {
                data[idx].rowStat = 'U';
            }
            if (
                data[idx].rowStat === 'U' &&
                !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
            ) {
                data[idx].rowStat = 'N';
            }

            this.gridData = data;
        },
        notPageReset(flag) {
            // flag : false
            this.reSetPage = flag;
        },
        selectProGroup(event) {
            this.value3 = event.value;
        },

        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
        chkVal(nm, val) {
            this[nm] = val ? 'Yes' : '';
        },
        sortChangeHandler(e) {
            this.gfn_sortChangeHandler(
                this.gridData,
                e,
                ['PRODUCTQUANTITY', 'ESTIMATEDCYCLETIME'],
                ['ACTIVESTATE']
            );
        },
        // 그리드 버튼 클릭
        gridButtonClick(e, field, dataItem) {
            if (field === 'PRODUCTBUTTON') {
                this.btnClickIdx = dataItem.idx;
                this.SelectProductModalVisible = true;
            }
        },
        // 검색버튼 선택
        selectedRow(row) {
            this.gridData = this.gridData.map(item => {
                return {
                    ...item,
                    PRODUCTID: item.idx === this.btnClickIdx ? row.PRODUCTID : item.PRODUCTID,
                    PRODUCTNAME: item.idx === this.btnClickIdx ? row.PRODUCTNAME : item.PRODUCTNAME,
                };
            });
        },
    },
};

const defaultData = {};
</script>
<style>
.dropdown-menu {
    min-width: 1rem !important;
}
</style>
  