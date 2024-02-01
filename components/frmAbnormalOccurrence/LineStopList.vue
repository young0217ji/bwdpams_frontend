<template>
    <div>
        <span v-if="!visibleDialog">
            <Button @click="toggleDialog">Open Dialog</Button>
        </span>
        <Dialog v-if="visibleDialog" :title="$i18n.t('MES_CommLang.MES_CommLang_00262')" width="60%" height="600"
            @close="toggleDialog">
            <v-row ref="searchFilter" class="search-box">
                <v-col :sm="9" :lg="10" align="left">
                    <div class="form-group-wrap">
                        <div class="form-group" style="margin-right: 34px;">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회기간 -->
                            <div class="form-datepicker">
                                <DatePicker ref="startDate" :default-value="new Date(startDate)"
                                    :format="'yyyy-MM-dd'" @change="fromChange" :dataNm="'startDate'" />
                            </div>
                            <span class="i_tilde">~</span>
                            <div class="form-datepicker">
                                <DatePicker ref="endDate" :default-value="new Date()" :format="'yyyy-MM-dd'"
                                    @change="toChange" :dataNm="'endDate'" />
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="getGridData">{{
                        $t("MES_CommLang.MES_CommLang_00277") }}</Button>
                    <Button :theme-color="'primary'" :size="'medium'" icon="check" @click="selectRow">{{
                        $t("MES_CommLang.MES_CommLang_00169") }}</Button>
                </v-col>
            </v-row>
            <v-row ref="contents">
                <v-col :cols="12" :class="'divListWapper'" :style="{ height: 'calc(100% - 33px)' }">
                    <div ref="divWrapper" :style="{ height: '100%' }">
                        <KendoGrid :isPaging="true" ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData"
                            :sortable="true" :columns="gridHeader" :resizable="false" :edit-field="'inEdit'"
                            :selected-field="selectedField" @gridrowclick="onRowClick" @rowdblclick="rowdblclick" />
                    </div>
                </v-col>
            </v-row>
        </Dialog>
    </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import Utility from '~/plugins/utility';
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from "@progress/kendo-vue-dateinputs";

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일

export default {
    name: 'LineStopList',
    mixins: [mixinGlobal, gridHeaderMinin],
    components: {
        Dialog,
        DialogActionsBar,
        Button,
        KendoGrid,
        InputText,
        MesSelectBox,
        DropDownList,
        DatePicker,
        Utility
    },
    props: {
        visibleDialog: {
            type: Boolean,
            default: false,
        },
        callBack: {
            type: Function,
            default: () => true,
        },
        initData2: {

        }
    },
    data() {
        return {
            startDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
            endDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
            gridHeader: [],
            gridData: [],
            gridOriData: [],
            gridHeight: '',
            selectedField: 'selected',
            companyid: '', // 회사 ID 검색
            companyName: '', // 회사명 검색
            companyType: '', // 회사구분 검색
            value: {},
            columns: [],

            headerParam: {
                gridid: 'dgvLineStopList',
                rowStat: '',
            },
            noFirstCheck: true,
            noRowstat: true,
            selectedID: null,
            selected: null,
        };
    },
    computed: {
        areAllSelected() {
            return (
                this.gridData.findIndex(x => x.checked === false) === -1 &&
                this.gridData.length !== 0
            );
        },
        items() {
            return this.gridData.map(item => ({
                ...item,
                selected: item.LINESTOPCODE === this.selectedID,
            }));
        },
    },
    async mounted() {
        console.log(this.initData2);
        await this.getGridData();
    },
    methods: {
        async searchBtn() {
            this.getGridData();
        },
        //그리드 데이터 가져오기
        async getGridData() {
            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetLineStopList',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
                    WORKORDER: this.initData2.WORKORDERID,
                    EQUIPMENTID: this.initData2.EQUIPMENTID,
                    PROCESSID: this.initData2.PROCESSID,
                    STARTTIME: this.startDate + ' 00:00:00',
                    ENDTIME: this.endDate + ' 23:59:59',
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
                    };
                });
                this.$nuxt.$emit('iccReset');
                this.gridOriData = data;
                this.gridData = data;
            });
        },
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog);
        },
        //그리드 로우 클릭
        onRowClick(event) {
            const selectedIdx = event.dataItem.idx;
            this.gridData.forEach(item => {
                item.selected = item.idx === selectedIdx;
            });
            this.selectedID = event.dataItem.LINESTOPCODE;
        },

        //그리드 더블 클릭
        rowdblclick(event) {
            this.$emit('lineStopListDetail', event.dataItem);
            this.$emit('visibleDialog', !this.visibleDialog);
        },
        //선택
        selectRow() {
            const returnData = this.gridData.filter(x => x.selected);
            this.$emit('lineStopListDetail', returnData[0]);
            this.$emit('visibleDialog', !this.visibleDialog);
            console.log(returnData[0]);
        },

        comboChange(nm, val) {
            this[nm] = val;
        },
        searchInput(nm, val) {
            this[nm] = val;
        },
        fromChange(e) {
            this.startDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
        toChange(e) {
            this.endDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
        },
    },
};
</script>
    