<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li> <!-- 기준정보 -->
            <li>도장실적등록</li> <!-- 작업 실적 관리 -->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row no-gutters>
                            <v-col :sm="9" :lg="10">
                                <div class="form-group-wrap">
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00053") }}</label> <!-- 공정ID -->
                                        <InputText ref="processid" :dataNm="'processid'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>

                                    <div class="form-group">
                                        <kbutton :theme-color="'primary'" :size="'small'" :icon="'search'" @click="getProcessID">
                                        선택</kbutton> <!-- 선택 -->
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>장비ID</label> <!-- 장비ID -->
                                        <InputText ref="equipmentid" :dataNm="'equipmentid'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group">
                                        <kbutton :theme-color="'primary'" :size="'small'" :icon="'search'" @click="getEquipmentID">
                                        선택</kbutton> <!-- 선택 -->
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00237") }}</label> <!-- 작업일시 -->
                                        <div class="form-datepicker">
                                            <DatePicker ref="endDate" :default-value="new Date()" :format="'yyyy-MM-dd'"
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
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00813") }}</CardTitle> <!-- 작업 실적 목록 -->
                            </v-col>
                            <v-col cols="6" align="right">
                                <kbutton :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</kbutton> <!-- 저장 -->
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData"
                                :gridPageData="gridPageData" :sortable="true" :columns="gridHeader" :resizable="true"
                                :edit-field="'inEdit'" :selected-field="selectedField"
                                :gridDropDownList="headerParam.enumComboBox" :checkHeaderArr="headerParam.checkBox"
                                :isPaging="true" :reSetPage="this.reSetPage" @pageChangeEvent="pageChangeEvent"
                                @selectionchange="onSelectionchange" @headerselectionchange="onHeaderSelectionChange"
                                @sortChangeHandler="sortChangeHandler" @griditemchange="griditemchange" />
                        </div>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <WindowPop ref="windowPop" :formName="'Education'"></WindowPop>

        <SelectProcessModal
        ref="SelectProcessModal"
        v-if="SelectProcessModalVisible"
        :visibleDialog="SelectProcessModalVisible"
        :title="processModalTitle"
        :selected-field="selectedField"
        @visibleDialog="val => (SelectProcessModalVisible = val)"
        @selectedRow="selectedRow"
        />

        <EquipmentModal
        ref="SelectEquipmentModal"
        v-if="SelectEquipmentModalVisible"
        :visibleDialog="SelectEquipmentModalVisible"
        :title="equipmentModalTitle"
        :selected-field="selectedField"
        :masterData="masterData"
        :initData = "initData"
        @visibleDialog="val => (SelectEquipmentModalVisible = val)"
        @selectedRow="selectedRowEquipment"
        />
        
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
import SelectProcessModal from '@/components/frmDisplayManagement/SelectProcessModal.vue';
import EquipmentModal from '@/components/frmPaintingProcess/EquipmentModal.vue';


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
        SelectProcessModal,
        EquipmentModal,
    },
    data() {
        return {
            startDate: Utility.setFormatDate(new Date(year, month, day - 3), 'YYYY-MM-DD'),
            endDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            processid: '',
            equipmentid:'',
            columns: [],
            gridHeight: '100px',
            gridData: [],
            gridPageData: {},
            gridOriData: [],
            gridLastModIdx: null,
            selectedField: 'selected',
            // checkHeaderArr: ['ACTIVESTATE'],
            headerParam: {
                gridid: 'dgvPainting', // 그리드 ID
                rowStat: '', //rowStat 표시 여부
                enumComboBox: [],
                checkBox: [],
                noFirstCheck: false,
                noRowstat: false,
                xOverflowYn: true // true - spread관리 width 그대로 사용, 스크롤바 사용 / false - 전체 넓이 중 비율 사용, 스크롤바 사용 안함
            },
            gridHeader: [],
            reSetPage: false,
            filterData: [],
            SelectProcessModalVisible: false,
            SelectEquipmentModalVisible: false,
            processModalTitle:'',
            equipmentModalTitle:'',
            initData:{},
            masterData:[],
        };
    },
    created() { },
    async mounted() {
        this.processModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00721');      // 공정ID선택  
        this.equipmentModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00427');   // 가능설비 목록
        this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
        this.getGridData();

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

        // 저장
        saveBtn() {
            const saveData = this.gridData
                .filter(x => x.selected == true)
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                        
                    };
                });

/*                 if(saveData[0].LOTID == null){
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'),"LOTID가 없습니다.");
                    return;
                } */

            const validate = this.mesValidation(this.gridHeader, this.gridData);
            if (!validate.isValidate) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
                return;
            }


            if (saveData.length > 0) {
                const res = this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnProcessStart',
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
        fromChange(e) {
            this.startDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange(e) {
            this.endDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
            this.startDate = Utility.setFormatDate(new Date(Utility.setFormatDate(e.value,'YYYY'), Utility.setFormatDate(e.value,'MM')-1, Utility.setFormatDate(e.value,'DD') -3), 'YYYY-MM-DD');
        },
        //그리드 데이터 가져오기
        async getGridData() {
            
            console.log(this.startDate)
            console.log(this.endDate + ' 23:59:59')
            this.gridOriData = [];
            this.gridData = [];
            this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: 'GetPainting',
                queryVersion: '00001',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
                    PROCESSID: this.processid,
                    EQUIPMENTID: this.equipmentid,
                    STARTDATE: this.startDate,
                    ENDDATE: this.endDate + ' 23:59:59',
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
                    this.gridOriData = data;
                    this.gridData = data;
                this.$nuxt.$emit('iccReset');
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
    getProcessID(){
        this.SelectProcessModalVisible = true;
    },

    getEquipmentID(){
        if(this.$refs['processid'].textVal != null){   
            this.initData = this.$refs['processid'].textVal;
            console.log('initData', this.initData)
            this.SelectEquipmentModalVisible = true;
        }else{
            this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00262')   // 공정코드를 먼저 선택해주세요
          );
          return;
        }
    },
     // 검색버튼 선택
     selectedRow(row) {
        this.$refs['processid'].textVal = row.PROCESSID
    },

    selectedRowEquipment(row){
    console.log('EQUIPMENTID', row.EQUIPMENTID)
     this.$refs['equipmentid'].textVal = row.EQUIPMENTID
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

    },
};

const defaultData = {};
</script>
<style>
.dropdown-menu {
    min-width: 1rem !important;
}
</style>
  