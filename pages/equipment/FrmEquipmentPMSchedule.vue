<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00617") }}</li> <!-- 예방보전 일정조회 -->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row no-gutters>
                            <v-col :md="10">
                                <div class="form-group-wrap">
                                    <div class="form-group form-calendar-month">
                                        <Button :theme-color="'secondary'" :icon="'arrow-chevron-left'" :class="'btn-form'"
                                            @click="leftBtn"></Button>
                                        <div class="dp-calendar">
                                            <span ref="labelYear" class="i-year" value="">{{ year }}</span>
                                            <span class="i-hyphen">-</span>
                                            <span ref="labelMonth" class="i-month">{{ month }}</span>
                                        </div>
                                        <Button :theme-color="'secondary'" :icon="'arrow-chevron-right'" :class="'btn-form'"
                                            @click="rightBtn"></Button>
                                    </div>
                                    <div class="form-group">
                                        <Label>Line</Label>
                                        <DropDownList ref="cmbLine" :style="{ width: '250px' }" :data-items="line"
                                            :text-field="'text'" :data-item-key="'id'" :value="value" @change="comboChange">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group" style="margin-left: 5px;">
                                        <Label>WorkCenter</Label>
                                        <DropDownList ref="cmbWorkCenter" :style="{ width: '180px' }"
                                            :data-items="workCenter" :text-field="'text'" :data-item-key="'id'"
                                            :value="value2" @change="comboChange2">
                                        </DropDownList>
                                    </div>
                                    <div class="form-group" style="margin-left: -5px;">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00177") }}</label> <!-- 설비코드 -->
                                        <InputText ref="equipmentid" :boxWidth="'85%'" :dataNm="'equipmentid'"
                                            :disabled="false" :defaultValue="equipmentid" :searchOption="true"
                                            :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group" style="margin-left: -50px;">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                                        <InputText ref="equipmentname" :boxWidth="'85%'" :dataNm="'equipmentname'"
                                            :disabled="false" :defaultValue="equipmentname" :searchOption="true"
                                            :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                </div>
                            </v-col>
                            <v-col :md="2" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" icon="search"
                                    @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <v-row ref="contents">
            <v-col :cols="12" :style="{ height: '100%' }">
                <TabStrip :selected="selected" @select="onSelect" :tabs="tabs" :style="{ width: '100%' }">
                    <template v-slot:PMSchedule>
                        <PMSchedule ref="PMSchedule" :gridHeight="gridHeight" :gridHeight2="gridHeight2"
                            :gridHeight3="gridHeight3" :viewParam="{
                                fromdate: fromdate,
                                todate: todate,
                                lotid: '',
                                setYYYYMM: setYYYYMM,
                                setYYYYMMDD: setYYYYMMDD,
                                inputEquipmentId: equipmentid,
                                workCenter: workCenterID,
                                equipmentName: paramEquipmentName,
                                paramPMScheduleDate: paramPMScheduleDate
                                //   holdstate: 'NotOnHold'
                            }" @openPMWorkTab="openPMWorkTab" />
                    </template>
                    <template v-slot:PMWork>
                        <PMWork v-if="v1" ref="PMWork" :gridHeight="gridHeight" :gridHeight2="gridHeight2"
                            :gridHeight3="gridHeight3" :viewParam="{
                                fromdate: fromdate,
                                todate: todate,
                                lotid: '',
                                setYYYYMM: setYYYYMM,
                                setYYYYMMDD: setYYYYMMDD,
                                btnFlagPMWork: btnFlagPMWork,
                                startPMData: startPMData,
                                workCenter: workCenterID,
                                equipmentName: paramEquipmentName,
                                paramPMScheduleDate: paramPMScheduleDate
                            }" />
                    </template>
                </TabStrip>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop ref="  " :is="'confirmPop'" :visibleDialog=false />
    </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle, TabStrip } from "@progress/kendo-vue-layout";
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from "@progress/kendo-vue-buttons";
import utils from "~/plugins/utils";
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import PMSchedule from "@/components/frmPMManagementTabs/FrmPMScheduleTab";
import PMWork from "@/components/frmPMManagementTabs/FrmPMWorkTab";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";

let myTitle;
let myMenuId;
const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일
let fromdate = new Date(year, month, day);
let todate = d;
let now = new Date();

//   let setYYYYMM;

export default {
    mixins: [mixinGlobal],
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
        closable: true,
    },
    components: {
        Utility,
        Card,
        Button,
        CardBody,
        CardTitle,
        TabStrip,
        InputText,
        DatePicker,
        PMSchedule,
        PMWork,
        Window,
        Dialog,
        DialogActionsBar,
        MesVariableSelectBox,
        DropDownList
    },
    data() {
        return {
            selected: 0,
            tabs: [ /* 예방보전일정, 예방보전 작업 */
                { title: this.$i18n.t('MES_CommLang.MES_CommLang_00034'), content: "PMSchedule" }, // title: 탭명, content: v-slot:PMSchedule
                { title: this.$i18n.t('MES_CommLang.MES_CommLang_00035'), content: "PMWork" },
            ],
            gridHeight: (window.innerHeight || document.body.clientHeight) / 3 * 2 + "px",
            gridHeight2: (window.innerHeight || document.body.clientHeight) / 6 * 2 + "px",
            gridHeight3: (window.innerHeight || document.body.clientHeight) / 9 * 2 + "px",
            v1: false,
            v2: false,
            v3: false,
            testdate: todate,
            fromdate: Utility.setFormatDate(fromdate.toLocaleDateString(), 'YYYY-MM-DD'),
            todate: Utility.setFormatDate(todate, 'YYYY-MM-DD'),
            toyear: Utility.setFormatDate(todate, 'YYYY'),
            tomonth: Utility.setFormatDate(todate, 'MM'),
            today: Utility.setFormatDate(todate, 'DD'),
            visibleDialog: false,
            intputEquipmentCode: "",
            inputcol: ["USERID", "USERNAME"],
            workUserComboDefault: "", // 작업자
            intputYearMonthDefault: "",
            inputYearMonth: "",
            year: Utility.setFormatDate(todate, 'YYYY'),
            month: Utility.setFormatDate(todate, 'MM'),
            setYYYYMM: "",
            setYYYYMMDD: "",
            equipmentid: '',
            equipmentname: '',
            line: [],
            value: [],
            workCenter: [],
            value: '', /* Line */
            value2: { id: '', text: '' }, /* WorkCenter */
            mCnt: 0,
            pCnt: 0,
            btnFlagPMWork: "",
            startPMData: [],
            loginInfo: "",
            plantID: this.$auth.$state.user.plantId,
            paramPMScheduleDate: "",
            workCenterID: "",
            paramEquipmentName: ""
        };
    },
    created() {
        this.toyear = Utility.setFormatDate(todate, 'YYYY'),
            this.tomonth = Utility.setFormatDate(todate, 'MM'),
            this.today = Utility.setFormatDate(todate, 'DD'),
            // console.log("testdate:::::::::", this.testdate);
            this.intputYearMonthDefault = this.toyear + "-" + this.tomonth;
        this.setYYYYMM = Utility.setFormatDate(this.intputYearMonthDefault.replaceAll('-', ''), 'YYYYMM');

        this.setYYYYMMDD = todate;
    },
    async mounted() {
        this.getComboData();
        this.value2.text = this.$i18n.t('MES_CommLang.MES_CommLang_00501'); /* 전체 */
        this.fromdate = Utility.setFormatDate(this.fromdate, 'YYYYMMDD');
        this.todate = Utility.setFormatDate(this.todate, 'YYYYMMDD');
        // this.$refs.workUserCombo.sendParam.stateobject = this.workUser;
        // this.workUser = this.$refs.workUserCombo.value;
    },
    computed: {
    },
    watch: {},
    methods: {
        onSelect(e) {
            // console.log(this.$refs.viewParam)
            // console.log("onSelect(e)::::::", e);
            this.selected = e.selected;
            this.v1 = false; // PM작업탭에서 일정탭으로 다시 되돌아갔을때 openPMWorkTab 기능 태우기위함.
            if (this.selected === 1 && !this.v1) {
                this.v1 = !this.v1
            }
            if (this.selected === 2 && !this.v2) {
                this.v2 = !this.v2
            }
            if (this.selected === 3 && !this.v3) {
                this.v3 = !this.v3
            }
        },
        selectBtn() {
        },
        searchBtn() {
            // console.log(":::::::::::::",this.workUser);
            // console.log(":::::::::::::",this.workUserComboDefault);
            // 0이면 PM일정 탭, 1이면 PM작업 탭
            if (this.selected === 0) {
                // this.equipmentId = this.intputEquipmentCode;
                this.$refs.PMSchedule.search(new Date(now.setMonth(now.getMonth())), this.workUser);
                this.year = d.getFullYear(); // 년
                this.month = d.getMonth() + 1;   // 월
                this.day = d.getDate();      // 일
                //   this.$refs.PMSchedule.getGridData2();
            } else if (this.selected === 1) {
                // this.equipmentId = this.intputEquipmentCode;
                // console.log("this.workUser = ====", this.workUser);
                let labelYearMonth = Utility.setFormatDate(this.year + this.month, "YYYYMM");
                this.$refs.PMWork.getGridData(labelYearMonth, this.equipmentId, this.workUser);
                //   this.$refs.PMWork.getGridData2();
            }
        },
        leftBtn() {
            // 좌측버튼 클릭
            let yearData;
            let monthData;

            if (parseInt(this.month) < 2) {
                // this.mCnt--;
                this.month = "13";
                this.month--;
                this.year--;
                this.inputYearMonth = this.year + "-" + this.month;
                this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
                // console.log("leftBtn testdate:::::::::", new Date(now.setMonth(now.getMonth() -1)));
                // console.log(":::::llll급합:::", this.setYYYYMM);
                if (this.selected == 0) {
                    // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() - 1));
                    this.$refs.PMSchedule.search(this.setYYYYMM);
                } else {
                    this.$refs.PMWork.getGridData(this.setYYYYMM);
                }
            } else {
                // console.log(this.selected);
                // console.log(this.tabs.title);
                // this.mCnt--;
                this.month--;
                this.year;
                this.inputYearMonth = this.year + "-" + this.month;
                this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
                // console.log(":::::llll급합12222233111:::", this.setYYYYMM);
                // console.log("leftBtn testdate:::::::::", new Date(now.setMonth(now.getMonth() -1)));
                if (this.selected == 0) {
                    // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() - 1));
                    this.$refs.PMSchedule.search(this.setYYYYMM);
                } else {
                    this.$refs.PMWork.getGridData(this.setYYYYMM);
                }
            }
        },

        rightBtn() {
            // 우측버튼 클릭
            let yearData;
            let monthData;
            // let now = new Date();
            if (parseInt(this.month) > 11) {
                this.month = "0";
                // this.pCnt++;
                this.month++;
                this.year++;
                this.inputYearMonth = this.year + "-" + this.month;
                this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
                // console.log(":::::rrrr급합111:::", this.setYYYYMM);
                // console.log(":::::급sdfsdfasf합:::", new Date(now.getFullYear(), now.getMonth() + 1));
                if (this.selected == 0) {
                    // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() + 1));
                    this.$refs.PMSchedule.search(this.setYYYYMM);
                } else {
                    this.$refs.PMWork.getGridData(this.setYYYYMM);
                }
            } else {
                // this.pCnt++;
                this.month++;
                this.year;
                this.inputYearMonth = this.year + "-" + this.month;
                this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
                // console.log(":::::rrrr급합222:::", this.setYYYYMM);
                // console.log(":::::급sdfsdfasf합:::", new Date(now.getFullYear(), now.getMonth() + 1));
                if (this.selected == 0) {
                    // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() + 1));
                    this.$refs.PMSchedule.search(this.setYYYYMM);
                } else {
                    this.$refs.PMWork.getGridData(this.setYYYYMM);
                }
            }
        },
        openPMWorkTab(clickData, btnFlag) {
            // 우클릭 PM실행 눌렀을때
            this.btnFlagPMWork = btnFlag;
            this.startPMData = clickData[0];
            this.selected = 1;

            // this.paramPMScheduleDate = this.startPMData[0].pmplannedtime;
            this.paramPMScheduleDate = Utility.setFormatDate(this.startPMData[0].pmplannedtime.replaceAll('-', ''), 'YYYYMMDD');
            // console.log("openPMWorkTab::::::::::::::::::::::::");
            // console.log("selected::::::::::::::::::::::::", this.selected);
            // console.log("this.v1::::::::::::::::::::::::", this.v1);
            if (this.selected === 1 && !this.v1) {
                this.v1 = !this.v1;
            } else {
                this.$refs.PMWork.gridData
                    .filter(x => x.rowStat === "N")
                    .map(x => {
                        this.$refs.PMWork.gridData[x.idx].selected = false;
                        if (this.startPMData[0].pmscheduleid === x.PMSCHEDULEID) {
                            this.$refs.PMWork.gridData[x.idx].selected = !this.$refs.PMWork.gridData[x.idx].selected;
                        }
                    });
            }
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
                console.log(res);
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

        // 검색조건 Line 콤보 change 이벤트
        comboChange(event) {
            this.value = event.value;
            // 검색조건 Line콤보박스 선택값에 따라 검색조건 WorkCenter 콤보 데이터 가져오기
            this.getWorkCenterComboList(event.value.id);
        },
        // 검색조건 WorkCenter 콤보 change 이벤트
        comboChange2(event) {
            this.value2 = event.value;
            this.workCenterID = event.value.id;
        },

        searchInput(nm, val) {
            this[nm] = val;
            // console.log('val',val);
            this.$refs.PMSchedule.setEquipmentID(val);
            this.paramEquipmentName = this.$refs['equipmentname'].text;
        },
        toChange(e) {
            this.todate = Utility.setFormatDate(e.value, 'YYYYMMDD');
        },
        fromChange(e) {
            this.fromdate = Utility.setFormatDate(e.value, 'YYYYMMDD');
        },
        toggleDialog() {
            // this.visibleDialog = !this.visibleDialog;
            this.$refs['confirmPop'].title = "confirm";
            this.$refs['confirmPop'].message = "message ~~"
            this.$refs['confirmPop'].callBack = this.searchBtn;
            this.$refs['confirmPop'].modalWidth = "300px";
            this.$refs['confirmPop'].visibleDialog = true;
        },

    },
    // watch:{
    //   vmodelReset(newVal, oldVal){
    //   }
    // },
};

const defaultData = {};
</script>
<style lang="scss">
.popup-content {
    padding: 30px !important;
    color: #787878 !important;
    background-color: #fcf7f8 !important;
    border: 1px solid rgba(0, 0, 0, .05) !important;
    width: 1000px !important;
    height: 500px !important;
}
</style>