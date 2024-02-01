<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li> <!-- 기준정보 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00837") }}</li> <!-- IPC 옵션관리 -->
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row ref="searchFilter" no-gutters>

                            <v-col :sm="12" :lg="12" align="right">
                                <Button :theme-color="'primary'" icon="search" @click="searchBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>


        <v-row ref="contents">
            <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
                <v-row :style="{ height: '100%' }">
                    <v-col :cols="5" :class="'divList1'" :style="{ height: '100%' }">
                        <Card ref="gridCard" :style="{ height: '100%' }">
                            <CardBody :style="{ width: '100%', height: '100%' }">
                                <v-row no-gutters>
                                    <v-col cols="4" align="left">
                                        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00838") }}</CardTitle>
                                        <!-- 설정목록 -->
                                    </v-col>
                                    <v-col cols="8" align="right">
                                        <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{
                                            $t("MES_CommLang.MES_CommLang_00411") }}
                                        </Button> <!-- 추가 -->
                                        <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'"
                                            @click="confirmDel">{{ $t("MES_CommLang.MES_CommLang_00412") }}
                                        </Button> <!-- 삭제 -->
                                    </v-col>
                                </v-row>
                                <div ref="divWrapper1" style="height: calc(100% - 33px);">
                                    <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                                        :gridPageData="gridPageData" :columns="headerParam.gridHeader"
                                        :gridDropDownList="headerParam.enumComboBox" :resizable="false"
                                        :customCell="customCell" :changeCell="changeCell" :edit-field="'inEdit'"
                                        :isPaging="true" :reSetPage="this.reSetPage" :selected-field="selectedField"
                                        @gridrowclick="onRowClick" @pageChangeEvent="pageChangeEvent"
                                        @gridButtonClick="gridButtonClick" @gridddchang="rowDdChange" />
                                </div>
                            </CardBody>
                        </Card>
                    </v-col>
                    <v-col :cols="7" :class="'divList1'" :style="{ height: '100%' }">
                        <Card ref="gridCard" :style="{ height: '100%' }">
                            <CardBody :style="{ width: '100%', height: '100%' }">
                                <v-row no-gutters>
                                    <v-col cols="6" align="left">
                                        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00839") }}</CardTitle>
                                        <!-- 상세설정 -->
                                    </v-col>
                                    <v-col cols="6" align="right">
                                        <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                                            $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                                        <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'"
                                            @click="resetBtn">{{ $t("MES_CommLang.MES_CommLang_00840") }}
                                        </Button>
                                    </v-col>
                                </v-row>
                                <div>
                                    <v-row no-gutters>
                                        <v-col :cols="6">
                                            <v-row class="search-box" align="center" no-gutters>
                                                <v-col :cols="4">
                                                    <Label>
                                                        <v-icon x-small :color="'#fb8200'"
                                                            class="mr-1">mdi-record-circle</v-icon>
                                                        W/C
                                                    </Label> <!-- W/C명 -->
                                                </v-col>
                                                <v-col :cols="8">
                                                    <InputText ref="workcenter" :readonly="true" :required="true"
                                                        :boxWidth="'70%'" :dataNm="'workcenter'"
                                                        @input-text-set="formInputValSet" />
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col :cols="6">
                                            <v-row class="search-box" align="center" no-gutters>
                                                <v-col :cols="4">
                                                    <Label>
                                                        <v-icon x-small :color="'#fb8200'"
                                                            class="mr-1">mdi-record-circle</v-icon>
                                                        {{ $t("MES_CommLang.MES_CommLang_00171") }}
                                                    </Label> <!-- 설비명 -->
                                                </v-col>
                                                <v-col :cols="8">
                                                    <InputText ref="equipmentName" :required="true" :readonly="true"
                                                        :boxWidth="'70%'" :dataNm="'equipmentName'"
                                                        @input-text-set="formInputValSet" />
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col :cols="10">
                                            <v-row class="search-box" no-gutters
                                                style="margin-top: 20px; margin-bottom: 20px; margin-left: -35px;">
                                                <v-col :cols="4">
                                                    <Label>
                                                        <v-icon x-small :color="'primary'"
                                                            class="mr-1">mdi-record-circle</v-icon>
                                                            {{ $t("MES_CommLang.MES_CommLang_00841") }}
                                                    </Label> <!-- 현황판 색상 설정 -->
                                                </v-col>
                                                <v-col :cols="8">
                                                    <div class="m-3">
                                                        <div style="display: inline-block; width: 40%;">
                                                            <div class="beforeColor" style="
                                                            border: 1px solid black;  
                                                            width: 100%; 
                                                            height: 30px; 
                                                            display: flex; 
                                                            justify-content: center;
                                                            margin-right: 5px;
                                                            align-items: center;"
                                                                :style="{ 'backgroundColor': beforeBack, 'color': beforeFont }">
                                                                {{ $t("MES_CommLang.MES_CommLang_00842") }}</div> <!-- 작업전 -->
                                                        </div>
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00843") }} : </p>
                                                        <ColorPicker :ref="beforeBack" v-model="beforeBack"
                                                            @change="beforeBackChange" />
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00844") }} : </p>
                                                        <ColorPicker :ref="beforeFont" v-model="beforeFont"
                                                            @change="beforeFontChange" />
                                                    </div>
                                                    <div class="m-3">
                                                        <div style="display: inline-block; width: 40%;">
                                                            <div class="workingColor" style="
                                                            border: 1px solid black;  
                                                            width: 100%; 
                                                            height: 30px; 
                                                            display: flex; 
                                                            justify-content: center;
                                                            margin-right: 5px;
                                                            align-items: center;"
                                                                :style="{ 'backgroundColor': workingBack, 'color': workingFont }">
                                                                {{ $t("MES_CommLang.MES_CommLang_00845") }}</div> <!-- 작업중 -->
                                                        </div>
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00843") }} : </p>
                                                        <ColorPicker :ref="workingBack" v-model="workingBack"
                                                            @change="workingBackChange" />
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00844") }} : </p>
                                                        <ColorPicker :ref="workingFont" v-model="workingFont"
                                                            @change="workingFontChange" />
                                                    </div>
                                                    <div class="m-3">
                                                        <div style="display: inline-block; width: 40%;">
                                                            <div class="afterColor" style="
                                                            border: 1px solid black;  
                                                            width: 100%; 
                                                            height: 30px; 
                                                            display: flex; 
                                                            justify-content: center;
                                                            margin-right: 5px;
                                                            align-items: center;"
                                                                :style="{ 'backgroundColor': afterBack, 'color': afterFont }">
                                                                {{ $t("MES_CommLang.MES_CommLang_00846") }}</div> <!-- 작업후 -->
                                                        </div>
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00843") }} : </p>
                                                        <ColorPicker :ref="afterBack" v-model="afterBack"
                                                            @change="afterBackChange" />
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00844") }} : </p>
                                                        <ColorPicker :ref="afterFont" v-model="afterFont"
                                                            @change="afterFontChange" />
                                                    </div>
                                                    <div class="m-3">
                                                        <div style="display: inline-block; width: 40%;">
                                                            <div class="pauseColor" style="
                                                            border: 1px solid black;  
                                                            width: 100%; 
                                                            height: 30px; 
                                                            display: flex; 
                                                            justify-content: center;
                                                            margin-right: 5px;
                                                            align-items: center;"
                                                                :style="{ 'backgroundColor': pauseBack, 'color': pauseFont }">
                                                                {{ $t("MES_CommLang.MES_CommLang_00847") }}</div> <!-- 작업중단 -->
                                                        </div>
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00843") }} : </p>
                                                        <ColorPicker :ref="pauseBack" v-model="pauseBack"
                                                            @change="pauseBackChange" />
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00844") }} : </p>
                                                        <ColorPicker :ref="pauseFont" v-model="pauseFont"
                                                            @change="pauseFontChange" />
                                                    </div>
                                                    <div class="m-3">
                                                        <div style="display: inline-block; width: 40%;">
                                                            <div class="stopColor" style="text-align: center;
                                                            border: 1px solid black;  
                                                            width: 100%; 
                                                            height: 30px; 
                                                            display: flex; 
                                                            justify-content: center;
                                                            margin-right: 5px;
                                                            align-items: center;"
                                                                :style="{ 'backgroundColor': stopBack, 'color': stopFont }">
                                                                {{ $t("MES_CommLang.MES_CommLang_00848") }}</div> <!-- 비가동 -->
                                                        </div>
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00843") }} : </p>
                                                        <ColorPicker :ref="stopBack" v-model="stopBack"
                                                            @change="stopBackChange" />
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00844") }} : </p>
                                                        <ColorPicker :ref="stopFont" v-model="stopFont"
                                                            @change="stopFontChange" />
                                                    </div>
                                                    <div class="m-3">
                                                        <div style="display: inline-block; width: 40%;">
                                                            <div class="nextColor" style="text-align: center;
                                                            border: 1px solid black;  
                                                            width: 100%; 
                                                            height: 30px; 
                                                            display: flex; 
                                                            justify-content: center;
                                                            margin-right: 5px;
                                                            align-items: center;"
                                                                :style="{ 'backgroundColor': nextBack, 'color': nextFont }">
                                                                {{ $t("MES_CommLang.MES_CommLang_00849") }}</div> <!-- 익일작지 -->
                                                        </div>
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00843") }} : </p>
                                                        <ColorPicker :ref="nextBack" v-model="nextBack"
                                                            @change="nextBackChange" />
                                                        <p style="display: inline-block;">{{ $t("MES_CommLang.MES_CommLang_00844") }} : </p>
                                                        <ColorPicker :ref="nextFont" v-model="nextFont"
                                                            @change="nextFontChange" />
                                                    </div>

                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col :cols="10">
                                            <v-row class="search-box" style="margin-bottom: 20px; margin-left: -35px;"
                                                no-gutters>
                                                <v-col :cols="4">
                                                    <Label>
                                                        <v-icon x-small :color="'primary'"
                                                            class="mr-1">mdi-record-circle</v-icon>
                                                            {{ $t("MES_CommLang.MES_CommLang_00850") }}
                                                    </Label> <!-- 현황판 보기 비율 -->
                                                </v-col>
                                                <v-col :cols="8" style="display: inline-block;">
                                                    <v-row>
                                                        <v-col :cols="4">
                                                            <InputText ref="visualRate" :boxWidth="'100%'"
                                                                :dataNm="'visualRate'" :disabled="false" editor="numeric"
                                                                @input-text-set="formInputValSet" />
                                                        </v-col>
                                                        <v-col :cols="8" style="display: flex; align-items: center;">
                                                            <p style="margin: 0;">{{ $t("MES_CommLang.MES_CommLang_00851") }}</p>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col :cols="12">
                                            <v-row class="search-box" style="margin-bottom: 20px; margin-left: 8px;"
                                                no-gutters>
                                                <v-col :cols="4">
                                                    <Label>
                                                        <v-icon x-small :color="'primary'"
                                                            class="mr-1">mdi-record-circle</v-icon>
                                                            {{ $t("MES_CommLang.MES_CommLang_00852") }}
                                                    </Label> <!-- 현황판 익일 작업 계획 미리보기 -->
                                                </v-col>
                                                <v-col :cols="8" style="display: inline-block;">
                                                    <v-row>
                                                        <v-col :cols="4">
                                                            <InputText ref="nextCount" :boxWidth="'100%'"
                                                                :dataNm="'nextCount'" :disabled="false" :type="Number"
                                                                @input-text-set="formInputValSet" />
                                                        </v-col>
                                                        <v-col :cols="8" style="display: flex; align-items: center;">
                                                            <p style="margin: 0;">건</p>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </div>
                            </CardBody>
                        </Card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <AlertPop ref="alertPop" :is="'alertPop'" />
        <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
        <SelectEquipmentModal ref="SelectEquipmentModal" v-if="selectEquipmentModalVisible"
            :visibleDialog="selectEquipmentModalVisible" :gridData="selectEquipmentGridData" :title="equipmentModalTitle"
            :initData="initData" :selected-field="selectedField" @visibleDialog="val => (selectEquipmentModalVisible = val)"
            @selectedRow="selectedRow" />

    </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import utils from "~/plugins/utils";
//   import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";
import WorkerGroup from "@/components/frmEquipmentWorker/WorkerGroup"
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { ColorPicker } from '@progress/kendo-vue-inputs';
import SelectEquipmentModal from '@/components/frmAvailableEquipment/SelectEquipmentModal.vue';

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
        WorkerGroup,
        InputText,
        CardTitle,
        DropDownList,
        ColorPicker,
        SelectEquipmentModal
    },
    data() {
        return {
            gridHeight: '100px',
            columns: [],
            gridData: [],
            gridOriData: [],
            gridLastModIdx: null,
            selectedField: 'selected',
            equipmentid: '',
            reSetPage: false,
            equipmentname: '',
            rowInfo: {},
            line: [],
            workCenter: [],
            disableAddBtn: true,
            selectedEquipmentID: '',
            value: '', /* Line */
            value2: { id: '', text: '' }, /* WorkCenter */
            selectedIdx: '',
            sparePartModalVisible: false,
            btnClickIdx: '',
            workcenter: '',
            equipmentName: '',
            headerParam: {
                gridid: "dgvBoardOptionSet", // 그리드 ID
                gridHeader: [],
                noFirstCheck: true,
                noRowstat: false,
                xOverflowYn: false,
                enumComboBox: [],
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
                    cellName: 'MANAGEMENTBUTTON',
                    upperCell: '',
                    condition: false,
                    dataItem: [],
                },
            ],

            gridPageData: {},
            beforeBack: 'white',
            beforeFont: 'black',
            workingBack: 'white',
            workingFont: 'black',
            afterBack: 'white',
            afterFont: 'black',
            pauseBack: 'white',
            pauseFont: 'black',
            stopBack: 'white',
            stopFont: 'black',
            nextBack: 'white',
            nextFont: 'black',
            selectedData: {},
            selectEquipmentModalVisible: false,
            equipmentModalTitle: '',
            selectedEquipmentID: '',
            initData: '',
            comboList: []
        };
    },
    created() {
    },
    async mounted() {
        this.equipmentModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00172');
        this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper1);
        await this.getGridData();
        await this.getGridComboList();
    },
    computed: {
        areAllSelected() {
            return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
        },
    },
    watch: {
    },
    methods: {
        // 그리드 데이터 가져오기
        async getGridData() {
            this.disableAddBtn = true;
            this.gridOriData = [];
            this.gridData = [];
            const { skip = 0, take = 20 } = this.gridPageData;
            this.mesGet({
                apiKey: 'mes/common/customquerypaging',
                queryId: 'GetBoardOptionSet',
                queryVersion: '00001',
                sendParam: {
                    PLANTID: this.$auth.$state.user.plantId,
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
                this.gridData[0].selected = true;
                this.$refs['workcenter'].textVal = data[0].WORKCENTER;
                this.$refs['equipmentName'].textVal = data[0].MANAGEMENTNAME;
                this.$refs['visualRate'].textVal = data[0].VISUALRATE;
                this.$refs['nextCount'].textVal = data[0].NEXTCOUNT;

                this.selectedIdx = this.gridData[0].idx

                this.setColors(data[0]);
            });
        },


        async getHaeder() {
            this.gridHeader = await this.getCustomHeader("dgvEquipmentStateChangeList", true, true);
        },
        async searchBtn() {
            this.getGridData();

        },

        // 저장
        saveBtn() {
            const saveData = this.gridData
                .filter(x => x.rowStat !== 'N')
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                        WORKCENTER: x.rowStat != 'C' ? this.comboList.filter(y => y.ENUMVALUENAME == x.WORKCENTER)[0].ENUMVALUE : x.WORKCENTER

                    };
                });
            console.log(saveData);
            // saveData = saveData.map(x =>{
            //     return{
            //         ...x,
            //         WORKCENTER : x.rowStat != 'C' ? this.comboList.filter(x => x.ENUMVALUENAME == x.WORKCENTER)[0].ENUMVALUE : x.WORKCENTER
            //     }
            // })

            if (saveData.length > 0) {
                const res = this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnBoardOptionSet',
                    sendParam: saveData,
                }).then(result => {
                    console.log(res);
                    console.log('result', result);
                    this.$nextTick(() => {
                        if (result.returncode !== undefined && result.returncode === '0') {
                            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                            this.getGridData(this.selectedEquipmentID);
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
        async pageChangeEvent(skip = 0, take = 20) {
            this.gridPageData = {
                skip: skip,
                take: take
            }
            this.reSetPage = false;
            this.getGridData();

        },
        openAlert(title, message, visiable = true, width = "350px") {
            this.$refs.alertPop.title = title;
            this.$refs.alertPop.message = message;
            this.$refs.alertPop.visibleDialog = visiable;
            this.$refs.alertPop.modalWidth = width;
        },
        // 그리드 로우 클릭
        onRowClick(event) {
            console.log('------------------', event.dataItem);
            console.log(this.gridData);
            this.selectedIdx = event.dataItem.idx;
            this.selectedData = event.dataItem;
            this.gridData.forEach(x => (x.selected = false));
            event.dataItem[this.selectedField] = true;
            if(event.dataItem.rowStat != 'C'){
                this.$refs['workcenter'].textVal = event.dataItem.WORKCENTER;
            }else{
                this.$refs['workcenter'].textVal = event.dataItem.WORKCENTERNAME;
            }
            this.$refs['equipmentName'].textVal = event.dataItem.MANAGEMENTNAME;
            this.$refs['visualRate'].textVal = event.dataItem.VISUALRATE;
            this.$refs['nextCount'].textVal = event.dataItem.NEXTCOUNT;
            this.setColors(this.selectedData);
        },
        setColors(data) {
            console.log('setColors', data);
            this.beforeBack = data.BEFOREBACKCOLOR;
            this.beforeFont = data.BEFOREFONTCOLOR;
            this.workingBack = data.WORKINGBACKCOLOR;
            this.workingFont = data.WORKINGFONTCOLOR;
            this.afterBack = data.AFTERBACKCOLOR;
            this.afterFont = data.AFTERFONTCOLOR;
            this.pauseBack = data.PAUSEBACKCOLOR;
            this.pauseFont = data.PAUSEFONTCOLOR;
            this.stopBack = data.STOPBACKCOLOR;
            this.stopFont = data.STOPFONTCOLOR;
            this.nextBack = data.NEXTBACKCOLOR;
            this.nextFont = data.NEXTFONTCOLOR;
            // this.beforeBackDefault = this.selectedData.BEFOREBACKCOLOR;
            // this.workingBackDefault = "rgba(52, 40, 205, 1)";
        },
        searchInput(nm, val) {
            this[nm] = val;
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
        },
        //추가 버튼 클릭
        addBtn() {
            this.$refs.rowGrid.skip = 0;

            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: false,
                PLANTID: this.$auth.$state.user.plantId,
                rowStat: 'C',
                DESCRIPTION: '',
                MANAGEMENTID: '',
                MANAGEMENTNAME: '',
                WORKCENTERNAME: '',
                BEFOREBACKCOLOR: '#ffffff',
                BEFOREFONTCOLOR: '#000000',
                WORKINGBACKCOLOR: '#ffffff',
                WORKINGFONTCOLOR: '#000000',
                AFTERBACKCOLOR: '#ffffff',
                AFTERFONTCOLOR: '#000000',
                PAUSEBACKCOLOR: '#ffffff',
                PAUSEFONTCOLOR: '#000000',
                STOPBACKCOLOR: '#ffffff',
                STOPFONTCOLOR: '#000000',
                NEXTBACKCOLOR: '#ffffff',
                NEXTFONTCOLOR: '#000000',
                VISUALRATE: '',
                NEXTCOUNT: '',
                idx: this.gridData.length,
                changeCellType: 'button', // 검색 버튼 나오도록
                MANAGEMENTBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
                customCell: {
                    WORKCENTER: {
                        type: 'combo',
                        dataItem: this.headerParam.gridDropDownList[0].dataItem,
                        disable: false,
                    },
                },
            };
            this.gridData.splice(0, 0, dataItem);
            this.$nuxt.$emit('iccReset');
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
        // 초기화 버튼 클릭
        resetBtn() {


            this.resetColors();
            this.$refs['visualRate'].textVal = this.gridData.filter(x => x.selected == true)[0].VISUALRATE;
            this.$refs['nextCount'].textVal = this.gridData.filter(x => x.selected == true)[0].NEXTCOUNT;
            this.setColors(this.gridData.filter(x => x.selected == true)[0]);

            let currentData = this.gridData.filter(x => x.idx == this.selectedIdx).map(x => {
                return {
                    ...x,
                    selected: '',
                    rowStat: '',
                }
            });

            let oriData = this.gridOriData.filter(x => x.idx == this.selectedIdx).map(x => {
                return {
                    ...x,
                    selected: '',
                    rowStat: '',
                }
            });
            if (this.gridData.filter(x => x.idx == this.selectedIdx)[0].rowStat != 'C' && this.gridData.filter(x => x.idx == this.selectedIdx)[0].rowStat != 'D') {
                if (JSON.stringify(currentData) == JSON.stringify(oriData)) {
                    console.log('a');
                    this.gridData = this.gridData.map(x => {
                        return {
                            ...x,
                            rowStat: x.idx == this.selectedIdx ? 'N' : x.rowStat
                        }
                    })
                } else {
                    console.log('b');
                    this.gridData = this.gridData.map(x => {
                        return {
                            ...x,
                            rowStat: x.idx == this.selectedIdx ? 'U' : x.rowStat
                        }
                    })

                }
            }
        },
        resetColors() {
            this.gridData = this.gridData.map(x => {
                if (x.selected) {
                    return {
                        ...x,
                        BEFOREBACKCOLOR: "#ffffff",
                        BEFOREFONTCOLOR: "#000000",
                        WORKINGBACKCOLOR: "#00ff00",
                        WORKINGFONTCOLOR: "#000000",
                        AFTERBACKCOLOR: "#e3c8ff",
                        AFTERFONTCOLOR: "#000000",
                        PAUSEBACKCOLOR: "#ff0000",
                        PAUSEFONTCOLOR: "#ffffff",
                        STOPBACKCOLOR: "#f8d9af",
                        STOPFONTCOLOR: "#ffffff",
                        NEXTBACKCOLOR: "#dedede",
                        NEXTFONTCOLOR: "#000000",
                        VISUALRATE: 150,
                        NEXTCOUNT: 3,
                    }
                }
                return x
            })
        },
        //그리드 인풋 제외 데이터 변경시
        rowDdChange(e, name, dataItem) {
            console.log(e);
            console.log(name);
            const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
            const rowData = JSON.parse(JSON.stringify(this.gridData));
            let wcName = this.comboList.filter(x => x.ENUMVALUE == e.value)[0].ENUMVALUENAME;
            
            rowData[idx] = { ...rowData[idx], [name]: e.value };
            if (rowData[idx].rowStat === 'N') {
                rowData[idx].rowStat = 'U';
            }
            if (
                rowData[idx].rowStat === 'U' &&
                !this.gfn_ChkOriginalData(this.gridHeader, rowData, this.gridOriData, idx)
                ) {
                    rowData[idx].rowStat = 'N';
                }

            this.gridData = rowData;
            console.log('rowdata[idx]',rowData[idx]);
            this.initData = rowData[idx].WORKCENTER;
            this.gridData = this.gridData.map(x => {
                return{
                    ...x,
                    WORKCENTERNAME : x.idx == dataItem.idx ? this.comboList.filter(x => x.ENUMVALUE == e.value)[0].ENUMVALUENAME : x.WORKCENTERNAME
                }
            }) 
            console.log(dataItem.idx);
            console.log(this.selectedIdx);
            console.log(this.gridData);
            if(dataItem.idx == this.selectedIdx){
                this.$refs['workcenter'].textVal = wcName;
                this.$refs['equipmentName'].textVal = '';
            }
            this.gridData = this.gridData.map(x => {
                return{
                    ...x,
                    MANAGEMENTID : x.idx == dataItem.idx ? '' : x.MANAGEMENTID,
                    MANAGEMENTNAME : x.idx == dataItem.idx ? '' : x.MANAGEMENTNAME,
                }
            })
        },
        //맨앞 checkBox 클릭
        onSelectionchange(event) {
            event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        //그리드 인풋 데이터 변경시
        griditemchange(e) {
            const data = JSON.parse(JSON.stringify(this.gridData));
            const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === "N") {
                data[idx].rowStat = "U";
            }
            if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
                data[idx].rowStat = "N";
            }

            this.gridData = data;
        },
        //데이터 원상복구시 "수정" 항목 제거
        chkOriginalData(gridData, idx) {
            const data = JSON.parse(JSON.stringify(gridData));
            const keys = Object.keys(data[idx]);
            const chkArr = keys.filter(x => {
                return data[idx][x] !== this.gridOriData2[idx][x] && x !== 'rowStat';
            });
            return chkArr.length > 0;
        },
        //검색버튼 선택
        selectedRow(row) {
            console.log(row);
            this.selectedEquipmentID = row.EQUIPMENTID;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    MANAGEMENTID: this.btnClickIdx == x.idx ? row.EQUIPMENTID : x.MANAGEMENTID,
                    MANAGEMENTNAME: this.btnClickIdx == x.idx ? row.EQUIPMENTNAME : x.MANAGEMENTNAME
                }
            });
            if(this.btnClickIdx == this.selectedIdx){
                this.$refs['equipmentName'].textVal = row.EQUIPMENTNAME;
            }
            console.log(this.gridData);

        },
        formInputValSet(nm, val) {
            console.log(this.selectedIdx);
            console.log(this.gridData);
            if (nm == 'visualRate') {
                this.gridData = this.gridData.map(x => {
                    return {
                        ...x,
                        VISUALRATE: x.idx === this.selectedIdx ? val : x.VISUALRATE
                    }
                })
            } else if (nm == 'nextCount') {
                this.gridData = this.gridData.map(x => {
                    return {
                        ...x,
                        NEXTCOUNT: x.idx === this.selectedIdx ? val : x.NEXTCOUNT
                    }
                })
            }
            // if (this.gridData[this.selectedIdx].rowStat == "N") {
            //     this.gridData[this.selectedIdx].rowStat = "U";
            // }
            this.gridData.map(x => {
                if (x.idx == this.selectedIdx && x.rowStat == 'N') {
                    x.rowStat = 'U';
                }
            })
        },
        //그리드 버튼 클릭 (추가 후 검색버튼)
        gridButtonClick(e, field, dataItem) {
            if (field === 'MANAGEMENTBUTTON') {
                this.selectEquipmentGridData = this.gridData.filter(
                    x => x.idx > dataItem.idx
                );
                this.btnClickIdx = dataItem.idx;
                console.log('gridButtonclick - btnclickIdx',this.gridData.filter(x => x.idx == this.btnClickIdx)[0]);
                if (this.gridData.filter(x => x.idx == this.btnClickIdx)[0].WORKCENTER == undefined) {
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00223')); /* 알림, Workcenter를 선택해주세요. */
                    return;
                }
                this.selectEquipmentModalVisible = true;
            }
        },
        changeRowstat() {
            this.gridData = this.gridData.map(x => {
                if (x.selected) {
                    return {
                        ...x,
                        rowStat: 'U',
                    };
                }
                return x;
            });
        },
        beforeBackChange(event) {
            this.beforeBack = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    BEFOREBACKCOLOR: x.selected ? this.beforeBack : x.BEFOREBACKCOLOR
                }
            })
            console.log(this.gridData);
            console.log(event);
            this.changeRowstat();
            // console.log(this.gridData.map(x => x.selected == true))
        },
        beforeFontChange(event) {
            this.beforeFont = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    BEFOREFONTCOLOR: x.selected ? this.beforeFont : x.BEFOREFONTCOLOR
                }
            })
            this.changeRowstat();
        },
        workingBackChange(event) {
            this.workingBack = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    WORKINGBACKCOLOR: x.selected ? this.workingBack : x.WORKINGBACKCOLOR
                }
            })
            this.changeRowstat();
        },
        workingFontChange(event) {
            this.workingFont = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    WORKINGFONTCOLOR: x.selected ? this.beforeBack : x.WORKINGFONTCOLOR
                }
            })
            this.changeRowstat();
        },
        afterBackChange(event) {
            this.afterBack = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    AFTERBACKCOLOR: x.selected ? this.afterBack : x.AFTERBACKCOLOR
                }
            })
            this.changeRowstat();
        },
        afterFontChange(event) {
            this.afterFont = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    AFTERFONTCOLOR: x.selected ? this.afterFont : x.AFTERFONTCOLOR
                }
            })
            this.changeRowstat();
        },
        pauseBackChange(event) {
            this.pauseBack = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    PAUSEBACKCOLOR: x.selected ? this.pauseBack : x.PAUSEBACKCOLOR
                }
            })
            this.changeRowstat();
        },
        pauseFontChange(event) {
            this.pauseFont = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    PAUSEFONTCOLOR: x.selected ? this.pauseFont : x.PAUSEFONTCOLOR
                }
            })
            this.changeRowstat();
        },
        stopBackChange(event) {
            this.stopBack = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    STOPBACKCOLOR: x.selected ? this.stopBack : x.STOPBACKCOLOR
                }
            })
            this.changeRowstat();
        },
        stopFontChange(event) {
            this.stopFont = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    STOPFONTCOLOR: x.selected ? this.stopFont : x.STOPFONTCOLOR
                }
            })
            this.changeRowstat();
        },
        nextBackChange(event) {
            this.nextBack = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    NEXTBACKCOLOR: x.selected ? this.nextBack : x.NEXTBACKCOLOR
                }
            })
            this.changeRowstat();
        },
        nextFontChange(event) {
            this.nextFont = event.value;
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    NEXTFONTCOLOR: x.selected ? this.nextFont : x.NEXTFONTCOLOR
                }
            })
            this.changeRowstat();
        },
    }
};
const defaultData = {
};
</script>
<style lang="scss"></style>