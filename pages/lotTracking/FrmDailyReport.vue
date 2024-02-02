<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00665") }}</li> <!-- 공정관리 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00855") }}</li> <!-- 작업 일보 현황 -->
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
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00053") }}</label> <!-- 공정ID -->
                                        <InputText ref="processid" :dataNm="'processid'" :disabled="false" :readonly="true"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                        <kbutton :theme-color="'primary'" :size="'medium'"
                                            @click="$event => SelectProcessVisible = true">{{
                                                $t("MES_CommLang.MES_CommLang_00169") }}</kbutton> <!-- 선택 -->
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00177") }}</label> <!-- 설비코드 -->
                                        <InputText ref="equipmentid" :dataNm="'equipmentid'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" :readonly="true"
                                            @input-text-set="searchInput" />
                                        <kbutton :theme-color="'primary'" :size="'medium'"
                                            @click="$event => SelectEquipmentModalVisible = true">{{
                                                $t("MES_CommLang.MES_CommLang_00169") }}</kbutton> <!-- 선택 -->
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회기간 -->
                                        <div class="form-datepicker">
                                            <DatePicker ref="startDate" :default-value="new Date(startDate)" v-model="startDateModel" 
                                                :format="'yyyy-MM-dd'" @change="fromChange" :dataNm="'startDate'" />
                                        </div>
                                        <span class="i_tilde">~</span>
                                        <div class="form-datepicker">
                                            <DatePicker ref="endDate" :default-value="new Date()" :format="'yyyy-MM-dd'"  v-model="endDateModel" 
                                                @change="toChange" :dataNm="'endDate'" />
                                        </div>
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
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00855") }}</CardTitle> <!-- 작업 일보 현황 -->
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData"
                                :gridPageData="gridPageData" :sortable="true" :columns="gridHeader" :resizable="true"
                                :edit-field="'inEdit'" :selected-field="selectedField"
                                :gridDropDownList="headerParam.enumComboBox" :checkHeaderArr="headerParam.checkBox"
                                :isPaging="true" :reSetPage="this.reSetPage" @pageChangeEvent="pageChangeEvent"
                                @selectionchange="onSelectionchange" @headerselectionchange="onHeaderSelectionChange"
                                @sortChangeHandler="sortChangeHandler" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <WindowPop ref="windowPop" :formName="'Education'"></WindowPop>
        <!-- <SelectEquipmentModal ref="SelectEquipmentModal" v-if="SelectEquipmentModalVisible"
            :visibleDialog="SelectEquipmentModalVisible" :title="equipmentModalTitle" :selected-field="selectedField"
            :initData="initData" @visibleDialog="val => (SelectEquipmentModalVisible = val)"
            @selectedRow="selectedEquipment" /> -->
        <SelectProcess ref="SelectProcess" v-if="SelectProcessVisible" :visibleDialog="SelectProcessVisible"
            :title="SelectProcessTitle" :selected-field="selectedField" :initData="initData"
            @visibleDialog="val => (SelectProcessVisible = val)" @selectedRow="selectedProcess" />
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
// import SelectEquipmentModal from '@/components/frmPaintingInspection/SelectEquipmentModal.vue';
import SelectProcess from '@/components/frmDailyReport/SelectProcess.vue';
import DateUtility from '~/plugins/dateUtility';


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
        // SelectEquipmentModal,
        SelectProcess,
        DateUtility
    },
    data() {
        return {
            startDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
            endDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            startDateModel : new Date(year, month, day - 7),
            endDateModel : new Date(),
            workorder: '',
            equipmentid: '',
            processid: '',
            columns: [],
            gridHeight: '100px',
            gridData: [],
            gridPageData: {},
            gridOriData: [],
            gridLastModIdx: null,
            selectedField: 'selected',
            // checkHeaderArr: ['ACTIVESTATE'],
            headerParam: {
                gridid: 'dgvDailyReport', // 그리드 ID
                rowStat: '', //rowStat 표시 여부
                enumComboBox: [],
                checkBox: [],
                noFirstCheck: true,
                noRowstat: true,
                xOverflowYn: true // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
            },
            gridHeader: [],
            reSetPage: false,
            value: '',                    /* Line */
            value2: { id: '', text: '' }, /* WorkCenter */
            line: [],
            columns: [],
            workCenter: [],
            SelectEquipmentModalVisible: false,
            selectedEquipmentId: '',
            selectedProcessId: '',
            SelectProcessVisible: false,
            initData: '',
            equipmentModalTitle:'',
            SelectProcessTitle: ''
        };
    },
    created() { },
    async mounted() {
        // this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
        this.equipmentModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00427');   // 가능설비 목록
        this.SelectProcessTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00056');   // 공정 목록
        // this.getGridData();
        this.getComboData();
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
            const selectedIdx = event.dataItem.idx;
            this.gridData = this.gridData.map(item => {
                return {
                    ...item,
                    selected: item.idx === selectedIdx ? !item.selected : item.selected,
                };
            });
            this.selected = event.dataItem;
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

       
        fromChange(e) {
            let checkDay = DateUtility.checkDiffDay(e.value, new Date(this.endDate), 30);
            if(checkDay){
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00284')); /* 알림, 조회기간은 30일을 넘을 수 없습니다. */
                // this.startDateModel = new Date(year, month, day - 7);
                this.startDateModel = new Date(this.startDate);
                return;
            }
            this.startDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange(e) {
            let checkDay = DateUtility.checkDiffDay(new Date(this.startDate), e.value, 30);
            if(checkDay){
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00284')); /* 알림, 조회기간은 30일을 넘을 수 없습니다. */
                this.endDateModel = new Date(this.endDate);
                return;
            }
            this.endDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        //그리드 데이터 가져오기
        async getGridData() {
            if(this.$refs['processid'].textVal == '' || this.$refs['processid'].textVal == null || this.$refs['equipmentid'].textVal == '' || this.$refs['equipmentid'].textVal == null){
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00283')); /* 알림, 공정ID와 설비코드를 선택해주세요. */
                return;
            }

            if(0 > DateUtility.diff(new Date(this.startDate), new Date(this.endDate))){
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00285')); /* 알림, 종료 일자가 시작 일자보다 이전 일 수 없습니다. */
                return;
            }
            
            this.gridOriData = [];
            this.gridData = [];
            const { skip = 0, take = 20 } = this.gridPageData;
            this.mesGet({
                apiKey: 'mes/common/customquerypaging',
                queryId: 'GetDailyReport',
                queryVersion: '00001',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
                    EQUIPMENTID: this.equipmentid,
                    PROCESSID: this.processid,
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
                        inEdit: false,
                        newRow: false,
                        resizable: true,
                    };
                });
                //GIRD input v-model초기화, chkbox초기화 위해 추가
                this.$nuxt.$emit('iccReset');
                this.gridPageData = paging;
                this.gridOriData = data;
                this.gridData = data;

                this.initData = this.$refs['cmbWorkCenter'].value.id;
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
        async pageChangeEvent(skip = 0, take = 20) {
            this.gridPageData = {
                skip: skip,
                take: take
            }
            this.reSetPage = false;
            this.getGridData();

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
            this.value = event.value;
        },

        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
        comboChange(nm, val) {
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

        selectedEquipment(row) {
            this.selectedEquipmentId = row.EQUIPMENTID
            this.equipmentid = row.EQUIPMENTID
            this.$refs['equipmentid'].textVal = this.equipmentid;
        },
        selectedProcess(row) {
            this.selectedProcessId = row.PROCESSID
            this.processid = row.PROCESSID
            this.$refs['processid'].textVal = this.processid;
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
  