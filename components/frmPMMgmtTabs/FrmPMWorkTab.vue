<template>
  <div :style="{ height: '100%' }">
    <v-row :style="{ height: '100%' }">
      <v-col :sm="12" :lg="3" :class="'divList1'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row>
              <v-col cols="12" align="left">
                <CardTitle>{{
                  $t('MES_CommLang.MES_CommLang_00033')
                }}</CardTitle>
                <!-- 예방보전일정 목록 -->
              </v-col>
            </v-row>
            <v-row class="grid-tf-option" no-gutters>
              <v-col col="12" align="left">
                <div class="inline-flex-wrap">
                  <div class="form-chk">
                    <Checkbox
                      ref="pmEstimatedDay"
                      :value="true"
                      :dataNm="'pmEstimatedDay'"
                      :required="true"
                      :defaultchecked="pmEstimatedDayCheck"
                      @checkbox-set="pmEstimatedDayCheckValSet"
                    >
                    </Checkbox>
                    <label>{{ $t('MES_CommLang.MES_CommLang_00026') }}</label>
                    <!-- 예방보전 예정일 -->
                  </div>
                  <div class="form-datepicker">
                    <DatePicker
                      ref="pmScheduleDate"
                      :default-value="new Date()"
                      :dataNm="'pmScheduleDate'"
                      :format="'yyyy-MM-dd'"
                      :disabled="pmScheduleDateDisabled"
                      @change="pmScheduleDateChange"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
            <div ref="divWrapper1" :style="{ height: 'calc(100% - 80px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :isPaging="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                @sortChangeHandler="sortChangeHandler"
                @gridrowclick="onRowClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :sm="12" :lg="9" :class="'divList2'" :style="{ height: '100%' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row>
              <v-col ref="btnArea" cols="12" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :disabled="startBtnDisabled"
                  @click="startBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00028') }}</Button
                >
                <!-- 예방보전 시작 -->
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :disabled="endBtnDisabled"
                  @click="endBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00029') }}</Button
                >
                <!-- 예방보전 종료 -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :disabled="cancelBtnDisabled"
                  @click="cancelBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00032') }}</Button
                >
                <!-- 예방보전 작업취소 -->
              </v-col>
            </v-row>
            <!-- <v-row class="grid-tf-option" no-gutters>
              <v-col ref="btnArea" cols="12" align="right">
                
              </v-col>
            </v-row> -->
            <!-- <div
              ref="divWrapper2"
              :class="'divList3'"
              :style="{ height: 'calc(100% - 412px)' }"
              style="min-height: 213px"
            > -->
            <!-- <KendoGrid
                ref="rowGrid2"
                :gridHeight="gridHeight2"
                :gridItems="gridData2"
                :sortable="true"
                :columns="headerParam2.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField2"
                @sortChangeHandler="sortChangeHandler2"
                @gridrowclick="onRowClick2"
                @headerselectionchange="onHeaderSelectionChange2"
              /> -->
            <!-- </div> -->
            <div class="detail-area">
              <div class="left-area">
                <div class="area-form">
                  <div class="area-th">
                    <label style="float: right; margin-top: 8px">{{
                      $t('MES_CommLang.MES_CommLang_00619')
                    }}</label>
                    <!-- 예방보전 일정코드 -->
                  </div>
                  <div class="area-td area-full">
                    <inputText
                      :boxWidth="'100%'"
                      :dataNm="'intputPMScheduleID'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPMScheduleID"
                      @input-text-set="searchInput"
                      style="float: left; margin-right: 15px"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00177') }}</label>
                    <!-- 설비코드 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputEquipmentCode"
                      :boxWidth="'100%'"
                      :dataNm="'intputEquipmentCode'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputEquipmentCode"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00171') }}</label>
                    <!-- 설비명 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputEquipmentName"
                      :boxWidth="'100%'"
                      :dataNm="'intputEquipmentName'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputEquipmentName"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00037') }}</label>
                    <!-- 예방보전코드 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputEquipmentType"
                      :boxWidth="'100%'"
                      :dataNm="'intputEquipmentType'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputEquipmentType"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00598') }}</label>
                    <!-- 예방보전코드명 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputDetailType"
                      :boxWidth="'100%'"
                      :dataNm="'intputDetailType'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputDetailType"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00620') }}</label>
                    <!-- 소요예상시간 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputLatelyPreservation"
                      :boxWidth="'100%'"
                      :dataNm="'intputLatelyPreservation'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputLatelyPreservation"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00036') }} </label>
                    <!-- 예방보전상태 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputNowStatus"
                      :boxWidth="'100%'"
                      :dataNm="'intputNowStatus'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputNowStatus"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00038') }}</label>
                    <!-- 예방보전주기 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputPmCycle"
                      :boxWidth="'100%'"
                      :dataNm="'intputPmCycle'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPmCycle"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00027') }}</label>
                    <!-- 예방보전구분 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputPmType"
                      :boxWidth="'100%'"
                      :dataNm="'intputPmType'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPmType"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00507') }}</label>
                    <!-- 최근예방보전 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputRecentPMYYYYMMDD"
                      :boxWidth="'100%'"
                      :dataNm="'intputRecentPMYYYYMMDD'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputRecentPMYYYYMMDD"
                      @input-text-set="searchInput"
                      style="float: left; margin-right: 5px"
                    />
                  </div>
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00034') }}</label>
                    <!-- 예방보전일정 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputPmSchedule"
                      :boxWidth="'100%'"
                      :dataNm="'intputPmSchedule'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPmSchedule"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00237') }}</label>
                    <!-- 작업일시 -->
                  </div>
                  <div class="area-td area-full">
                    <!-- 3칸 : area-full -->
                    <inputText
                      ref="intputWorkDateYYYYMMDD"
                      :dataNm="'intputWorkDateYYYYMMDD'"
                      :readonly="workDateReadonly"
                      :defaultValue="intputWorkDateYYYYMMDD"
                      @input-text-set="searchInput"
                      style="width: 100px"
                    />
                    <inputText
                      ref="intputWorkDateHHMMSS"
                      :dataNm="'intputWorkDateHHMMSS'"
                      :readonly="workDateReadonly"
                      :defaultValue="intputWorkDateHHMMSS"
                      @input-text-set="searchInput"
                      style="width: 80px"
                    />
                    <Button
                      :ref="nowDateBtn"
                      :theme-color="'secondary'"
                      :size="'medium'"
                      @click="nowDateBtn"
                      >{{ $t('MES_CommLang.MES_CommLang_00337') }}</Button
                    >
                    <!-- 현재일시 -->
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00357') }}</label>
                    <!-- 관리자 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputManager"
                      :boxWidth="'100%'"
                      :dataNm="'intputManager'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputManager"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00233') }}</label>
                    <!-- 작업자 -->
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputWorker"
                      :dataNm="'intputWorker'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputWorker"
                      @input-text-set="searchInput"
                      style="width: calc(100% - 39px)"
                    />
                    <Button
                      :theme-color="'secondary'"
                      :class="'btn-form'"
                      :disabled="workSearchBtnDisabled"
                      @click="$event => (searchUserModalVisible = true)"
                      >...</Button
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-area" style="margin-top: 5px">
              <div class="area-form" style="height: 110px">
                <div class="area-th">
                  <label>{{ $t('MES_CommLang.MES_CommLang_00487') }}</label>
                  <!-- 비고 -->
                </div>
                <div class="area-td" style="width: 100%">
                  <TextArea
                    :auto-size="true"
                    :cols="12"
                    :readonly="workCommentReadonly"
                    v-model="workCommentTextArea"
                  />
                </div>
              </div>
              <!-- <div class="area-form" style="height: 184px"> -->

              <!-- </div> -->
            </div>
            <div class="detail-area" style="margin-top: 5px">
              <div class="area-form" style="height: 130px">
                <div class="area-th">
                  <label>{{ $t('MES_CommLang.MES_CommLang_00286') }}</label>
                  <!-- 지시사항 -->
                </div>
                <div class="area-td">
                  <TextArea
                    :auto-size="false"
                    :disabled="false"
                    :cols="5"
                    :readonly="instructionsTextAreaReadonly"
                    v-model="instructionsTextArea"
                  />
                </div>
                <div class="area-th">
                  <label>{{ $t('MES_CommLang.MES_CommLang_00239') }}</label>
                  <!-- 작업결과 -->
                </div>
                <div class="area-td">
                  <TextArea
                    :auto-size="false"
                    :cols="5"
                    :readonly="opResultTextAreaReadonly"
                    v-model="opResultTextArea"
                  />
                </div>
              </div>
              <!-- <div class="area-form" style="height: 184px"> -->

              <!-- </div> -->
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop
      :is="'confirmPop'"
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
    />
    <SelectUser
      ref="SelectUser"
      v-if="searchUserModalVisible"
      :visibleDialog="searchUserModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="val => (searchUserModalVisible = val)"
      @workuserid="workuserid"
    />
    <SetDescription
      ref="SetDescription"
      v-if="setDescriptionModalVisible"
      :visibleDialog="setDescriptionModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="val => (setDescriptionModalVisible = val)"
      @setComment="setComment"
    />
    <!-- @workuserid="workuserid" -->
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import InputText from '@/components/common/input/InputText';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import MesVariableSelectBox from '@/components/common/select/MesVariableSelectBox';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import { TextArea } from '@progress/kendo-vue-inputs';
import Checkbox from '@/components/common/input/Checkbox';
import SelectUser from '@/components/frmPMMgmtTabs/SelectUser';
import SetDescription from '@/components/frmPMMgmtTabs/SetDescription';

let myTitle;
let myMenuId;

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일
let workFromDate = new Date(year, month, day - 7);

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
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
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    MesVariableSelectBox,
    DatePicker,
    TextArea,
    Checkbox,
    SelectUser,
    SetDescription,
  },
  props: {
    viewParam: {
      lotid: '',
      productid: '',
      fromdete: '',
      todate: '',
      setYYYYMM: '',
      equipmentId: '',
      btnFlagPMWork: '',
      startPMData: [],
      workCenter: '',
      workCenter: '',
      equipmentName: '',
      paramPMScheduleDate: '',
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridHeader2: [],
      gridDropDownList: [{}],
      selectedField: 'selected',
      selectedField2: 'selected',
      intputEquipmentId: '',
      intputEquipmentCode: '',
      intputEquipmentName: '',
      intputEquipmentType: '',
      intputDetailType: '',
      intputPmType: '',
      intputPmCycle: '',
      intputPmSchedule: '',
      intputPmState: '',
      intputManager: '',
      intputWorker: '',
      opResultTextArea: '',
      instructionsTextArea: '',
      workCommentTextArea: '',
      intputLatelyPreservation: '',
      intputWorkDateYYYYMMDD: '',
      intputWorkDateHHMMSS: '',
      intputNowStatus: '',
      intputReasonCode: '',
      intputReasonCodeName: '',
      textAreaData: '',
      headerParam: {
        gridid: 'dgvPMList', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
        xOverflowYn: true,
      },
      headerParam2: {
        gridid: 'dgvEquipmentHistory', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
        xOverflowYn: true,
      },
      stateobject: '',
      pmScheduleDate: Utility.setFormatDate(new Date(), 'YYYYMMDD'),
      workFromDate: Utility.setFormatDate(
        workFromDate.toLocaleDateString(),
        'YYYY-MM-DD'
      ),
      workToDate: Utility.setFormatDate(new Date(), 'YYYYMMDD'),
      inputcol: ['STATE', 'STATENAME'],
      inputcol2: ['STATE', 'STATENAME'],
      defaultvalue: '',
      gridHeight: '',
      gridHeight2: '',
      // pmEstimatedDay:"",
      // historyChk:"",
      workDateReadonly: false,
      startBtnDisabled: true,
      endBtnDisabled: true,
      cancelBtnDisabled: true,
      workSearchBtnDisabled: false,
      instructionsTextAreaReadonly: true,
      workCommentReadonly: false,
      equipmentHisCheck: true,
      pmEstimatedDayCheck: false,
      searchUserModalVisible: false,
      setDescriptionModalVisible: false,
      opResultTextAreaReadonly: false,
      pmScheduleId: '',
      disabledCheckHeaderArr: ['ACTIVESTATE_BOM'],
      pmScheduleDateDisabled: true,
      intputRecentPMYYYYMMDD: '', // 최근PM 년 월 일
      intputPMScheduleID: '' /* 예방보전 일정코드 */,
      orderdescription: '' /* 지시사항 */,
    };
  },
  created() {},
  async mounted() {
    // this.gridHeight = (this.$refs.contents.offsetHeight * 0.8) +'px';
    // this.gridHeight2 = (this.$refs.contents.offsetHeight * 0.38) +'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper1);
    // this.$refs.comboArea.sendParam.stateobject = this.sparepart;
    // this.$refs.comboArea.sendParam.stateobject = this.changeStatus;
    // this.$refs.comboArea2.sendParam.stateobject = this.sparepart;
    // this.sparepart = this.$refs.comboArea.value;
    // this.$refs['pmEstimatedDay'].chkValue =  true ;
    // this.$refs['historyChk'].chkValue = true;

    // console.log("조회조건YYYYMM:::::::::::", this.viewParam.setYYYYMM);
    this.getGridData(this.viewParam.paramPMScheduleDate);
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
    //PM시작 버튼클릭
    startBtn() {
      // this.getGridData();
      // console.log("=========== PM시작 버튼클릭 ============");
      this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = 'Info';
      this.$refs['confirmPop'].message = this.$i18n.t(
        'MES_MsgLang.MES_MsgLang_00240'
      ); /* 예방보전작업을 시작하시겠습니까? */
      this.$refs['confirmPop'].callBack = this.saveStart;
      this.$refs['confirmPop'].modalWidth = '300px';
      this.$refs['confirmPop'].visibleDialog = true;
    },
    // PM종료 버튼클릭
    endBtn() {
      // console.log("=========== PM종료 버튼클릭 ============");
      this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = 'Info';
      this.$refs['confirmPop'].message = this.$i18n.t(
        'MES_MsgLang.MES_MsgLang_00241'
      ); /* 예방보전작업을 종료하시겠습니까? */
      this.$refs['confirmPop'].callBack = this.saveEnd;
      this.$refs['confirmPop'].modalWidth = '300px';
      this.$refs['confirmPop'].visibleDialog = true;
    },
    // PM작업취소 버튼클릭
    cancelBtn() {
      // console.log("=========== PM작업취소 버튼클릭 ============");
      this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = 'Info';
      this.$refs['confirmPop'].message = this.$i18n.t(
        'MES_MsgLang.MES_MsgLang_00242'
      ); /* 예방보전작업을 정말 취소하시겠습니까? */
      this.$refs['confirmPop'].callBack = this.cancelModalFunction;
      this.$refs['confirmPop'].modalWidth = '300px';
      this.$refs['confirmPop'].visibleDialog = true;
    },
    saveEnd(commentData) {
      // console.log("saveEnd  ::::::::::");
      let eventTime =
        this.intputWorkDateYYYYMMDD.replaceAll('-', '') +
        this.intputWorkDateHHMMSS.replaceAll(':', ''); // 작업일시
      let workerUserID = '';
      let workerUserIDArr = this.intputWorker.split(' ');
      if (workerUserIDArr.length > 0) {
        workerUserID = workerUserIDArr[0];
      }
      // console.log("eventTime::::::::::", eventTime);
      const saveData = this.gridData
        .filter(x => x.PMSCHEDULEID == this.pmScheduleId)
        .map(x => {
          return {
            WORKRESULT: this.opResultTextArea,
            PMENDTIME: eventTime,
            WORKCOMMENT: this.workCommentTextArea,
            PMSCHEDULEID: x.PMSCHEDULEID, // PM스케줄ID
            PLANTID: this.$auth.$state.user.plantId,
            _ROWSTATUS: '',
            EQUIPMENTID: x.EQUIPMENTID,
            WORKERUSERID: workerUserID,
          };
        });
      // console.log("saveEnd data ::::::::", saveData);
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnEquipmentPMEnd',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              // this.inputBoxReset(); // 우측 정보창 클리어시키기 위함
              this.$refs.alertPop.show(
                'Info',
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); /* 저장되었습니다. */
              this.getGridData(this.viewParam.paramPMScheduleDate);
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.returncode,
                result.returnmessage
              );
            }
          });
        });
      }
    },
    cancelModalFunction() {
      this.setDescriptionModalVisible = true;
    },
    saveCancel(commentData) {
      // console.log("saveCancel comment data ::::::::::", commentData);
      let cellType = '';
      const data = this.gridData.filter(
        x => x.PMSCHEDULEID == this.pmScheduleId
      );
      if (data[0].PMSTATE == this.$i18n.t('MES_CommLang.MES_CommLang_00290')) {
        /* 진행중 */
        cellType = 'PMStartCancel';
      } else if (
        data[0].PMSTATE == this.$i18n.t('MES_CommLang.MES_CommLang_00495')
      ) {
        /* 완료 */
        cellType = 'PMEndCancel';
      }
      const saveData = this.gridData
        .filter(x => x.PMSCHEDULEID == this.pmScheduleId)
        .map(x => {
          return {
            COMMENT: commentData, // 취소사유 팝업 TextArea 값
            EQUIPMENTSTATE: x.EQUIPMENTSTATE, // 설비상태
            PMSCHEDULEID: x.PMSCHEDULEID, // PM스케줄ID
            PLANTID: this.$auth.$state.user.plantId,
            _ROWSTATUS: '',
            EQUIPMENTID: x.EQUIPMENTID,
            CANCELTYPE: cellType,
          };
        });

      // console.log("saveCancel save data ::::::::", saveData);
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnEquipmentPMCancel',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              // this.inputBoxReset(); // 우측 정보창 클리어시키기 위함
              this.$refs.alertPop.show(
                'Info',
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); /* 저장되었습니다. */
              this.getGridData(this.viewParam.paramPMScheduleDate);
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.returncode,
                result.returnmessage
              );
            }
          });
        });
      }
    },

    // 저장버튼 클릭
    saveStart() {
      // console.log("저장시::::::::", this.intputEquipmentCode);
      // console.log("저장시::::::::", this.textAreaData);
      // console.log("시간::::::::", this.intputWorkDateYYYYMMDD.replaceAll('-', '') + this.intputWorkDateHHMMSS.replaceAll(':', '')); // replaceAll('-', '')
      let workerUserID = '';
      if (this.intputWorker != null) {
        workerUserID = this.intputWorker.split(' ')[0];
      }
      const saveData = this.gridData
        .filter(x => x.PMSCHEDULEID == this.pmScheduleId)
        .map(x => {
          return {
            _ROWSTATUS: '',
            WORKRESULT: this.opResultTextArea, // 작업결과
            PMSTARTTIME:
              this.intputWorkDateYYYYMMDD.replaceAll('-', '') +
              this.intputWorkDateHHMMSS.replaceAll(':', ''), // 작업일시
            WORKCOMMENT: this.workCommentTextArea, // 지시사항
            PMSCHEDULEID: x.PMSCHEDULEID, // PM스케줄ID
            PLANTID: this.$auth.$state.user.plantId,
            EQUIPMENTID: this.intputEquipmentCode, // 설비코드 있음
            WORKERUSERID: workerUserID, // 작업자
          };
        });
      // console.log("save data ::::::::", saveData);
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnEquipmentPMStart',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              // this.inputBoxReset(); // 우측 정보창 클리어시키기 위함
              this.$refs.alertPop.show(
                'Info',
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); /* 저장되었습니다. */
              this.getGridData(this.viewParam.paramPMScheduleDate);
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.returncode,
                result.returnmessage
              );
            }
          });
        });
      }
    },

    nowDateBtn() {
      // 현재시간 버튼클릭
      this.intputWorkDateYYYYMMDD = Utility.setFormatDate(
        new Date(),
        'YYYY-MM-DD'
      );
      this.intputWorkDateHHMMSS = Utility.setFormatDate(new Date(), 'HH:mm:ss');
    },

    // clearBtn 클릭
    clearBtn() {
      // Clear 클릭시 사유코드 초기화
      this.intputReasonCode = ''; // 사유코드
      this.intputReasonCodeName = ''; // 사유코드명
    },

    //예방보전일정목록 데이터 가져오기
    async getGridData(yyyymmData, equipmentId, workeruserid, clickData) {
      // console.log("getGridData::props::btnFlagPMWork:::::::", this.viewParam.btnFlagPMWork);
      // console.log("getGridData::props::startPMData:::::::", this.viewParam.startPMData);
      // console.log("getGridData::props::startPMData:::::::", this.viewParam.startPMData.length);
      // console.log("this.workeruserid = ====", workeruserid);
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPMScheduleList',
        queryVersion: '00002',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          yyyymmdd: yyyymmData,
          equipmentid: equipmentId,
          // workeruserid : workeruserid // 작업자는 쿼리에 막혀있음.
        },
      }).then(res => {
        let data;
        if (workeruserid === '' || workeruserid === undefined) {
          data = res.map((x, idx) => {
            if (this.viewParam.startPMData.length > 0) {
              if (
                x.PMSCHEDULEID === this.viewParam.startPMData[0].pmscheduleid
              ) {
                return {
                  ...x,
                  rowStat: 'N',
                  selected: true,
                  idx: idx,
                  inEdit: false,
                  newRow: false,
                  // equipmentid: this.intputEquipmentId,
                  // equipmentstate: this.sparepart
                };
              } else {
                return {
                  ...x,
                  rowStat: 'N',
                  selected: false,
                  idx: idx,
                  inEdit: false,
                  newRow: false,
                  // equipmentid: this.intputEquipmentId,
                  // equipmentstate: this.sparepart
                };
              }
            } else {
              return {
                ...x,
                rowStat: 'N',
                selected: false,
                idx: idx,
                inEdit: false,
                newRow: false,
                // equipmentid: this.intputEquipmentId,
                // equipmentstate: this.sparepart
              };
            }
          });
        } else {
          data = res
            .filter(x => (x.WORKERUSERID === null ? null : workeruserid))
            .map((x, idx) => {
              if (this.viewParam.startPMData.length > 0) {
                if (
                  x.PMSCHEDULEID === this.viewParam.startPMData[0].pmscheduleid
                ) {
                  return {
                    ...x,
                    rowStat: 'N',
                    selected: true,
                    idx: idx,
                    inEdit: false,
                    newRow: false,
                    // equipmentid: this.intputEquipmentId,
                    // equipmentstate: this.sparepart
                  };
                } else {
                  return {
                    ...x,
                    rowStat: 'N',
                    selected: false,
                    idx: idx,
                    inEdit: false,
                    newRow: false,
                    // equipmentid: this.intputEquipmentId,
                    // equipmentstate: this.sparepart
                  };
                }
              } else {
                return {
                  ...x,
                  rowStat: 'N',
                  selected: false,
                  idx: idx,
                  inEdit: false,
                  newRow: false,
                  // equipmentid: this.intputEquipmentId,
                  // equipmentstate: this.sparepart
                };
              }
            });
        }
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;

        const selectedRow = this.gridData.filter(x => x.selected === true);

        this.startBtnDisabled = true;
        this.endBtnDisabled = true;
        this.cancelBtnDisabled = true;
        if (selectedRow.length > 0) {
          // this.inputAreaControll(data, "viewParamData");
          this.inputAreaControll(selectedRow[0], 'rowClick');
        } else {
          this.inputAreaControll();
        }
      });
    },
    async inputAreaControll(data, flag) {
      // console.log("input data :::::::", data);
      // console.log("input flag :::::::", flag);
      if (data !== null && data !== undefined && flag == 'rowClick') {
        this.intputEquipmentCode = data.EQUIPMENTID; // 설비코드
        this.intputEquipmentName = data.EQUIPMENTNAME; // 설비명
        this.intputEquipmentType = data.PMCODEID; // 예방보전코드
        this.intputDetailType = data.PMCODENAME; // 예방보전명
        this.intputLatelyPreservation = data.CHECKTIME; // 소요예상시간
        this.intputPmState = data.PMSTATE; // 예방보전상태
        this.intputNowStatus = data.PMSTATE; // 현재상태명
        this.intputPmType = data.PMSCHEDULETYPENAME; // 예방보전구분
        this.intputPmSchedule = data.PMPLANNEDTIME; //PM일정
        this.intputPmCycle = data.PMCYCLEVALUE + data.PMCYCLETYPENAME; // 예방보전주기
        this.intputRecentPMYYYYMMDD = Utility.setFormatDate(
          data.LASTMAINTENANCETIME,
          'YYYY-MM-DD'
        ); // 최근PM 년 월 일
        this.intputWorkDateYYYYMMDD = Utility.setFormatDate(
          new Date(),
          'YYYY-MM-DD'
        ); // 작업일시 YYYY-MM-DD
        this.intputWorkDateHHMMSS = Utility.setFormatDate(
          new Date(),
          'HH:mm:ss'
        ); // 작업일시 HH:mm:ss
        this.intputManager = data.MANAGERUSERNAME; // 관리자
        this.intputWorker = data.WORKERUSERNAME; // 작업자
        this.workCommentTextArea = data.WORKCOMMENT; // 작업비고
        this.instructionsTextArea = data.ORDERDESCRIPTION; //지시사항
        this.opResultTextArea = data.WORKRESULT; //작업결과
        this.intputPMScheduleID = data.PMSCHEDULEID; // PM스케줄ID
        this.pmScheduleId = data.PMSCHEDULEID;
        // console.log("스케줄ID:::::::", this.pmScheduleId);

        // PM상태에 따른 input 및 버튼 비활성화
        if (data.PMSTATE == this.$i18n.t('MES_CommLang.MES_CommLang_00495')) {
          /* 완료 */
          this.workDateReadonly = true;
          this.instructionsTextAreaReadonly = true;
          this.workCommentReadonly = false;
          this.startBtnDisabled = true;
          this.endBtnDisabled = true;
          this.cancelBtnDisabled = false;
          this.workSearchBtnDisabled = true;
          this.opResultTextAreaReadonly = false;
          // this.refs['nowDateBtn'].style.display = 'none';
        } else if (
          data.PMSTATE == this.$i18n.t('MES_CommLang.MES_CommLang_00423')
        ) {
          /* 미진행 */
          this.workDateReadonly = false;
          this.instructionsTextAreaReadonly = true;
          this.workCommentReadonly = false;
          this.startBtnDisabled = false;
          this.endBtnDisabled = true;
          this.cancelBtnDisabled = true;
          this.workSearchBtnDisabled = false;
          this.opResultTextAreaReadonly = true;
          // this.$refs.dateArea.style.disabled = false;
        } else if (
          data.PMSTATE == this.$i18n.t('MES_CommLang.MES_CommLang_00290')
        ) {
          /* 진행중 */
          this.workDateReadonly = false;
          this.instructionsTextAreaReadonly = true;
          this.workCommentReadonly = false;
          this.startBtnDisabled = true;
          this.endBtnDisabled = false;
          this.cancelBtnDisabled = false;
          this.workSearchBtnDisabled = false;
          this.opResultTextAreaReadonly = false;
        }
      } else {
        this.intputEquipmentCode = ''; // 설비코드
        this.intputEquipmentName = ''; // 설비명
        this.intputEquipmentType = ''; // 설비구분
        this.intputDetailType = ''; // 상세구분
        this.intputLatelyPreservation = ''; // 최근보전
        this.intputNowStatus = ''; // 현재상태
        this.intputPmType = ''; // PM구분
        this.intputPmSchedule = ''; //PM일정
        this.intputPmCycle = ''; // PM주기
        this.intputPmState = ''; // PM상태
        this.intputWorkDateYYYYMMDD = ''; // 작업일시 YYYY-MM-DD
        this.intputWorkDateHHMMSS = ''; // 작업일시 HH:mm:ss
        this.intputManager = ''; // 관리자
        this.intputWorker = ''; // 작업자
        this.instructionsTextArea = ''; //지시사항
        this.workCommentTextArea = ''; //작업비고
        this.opResultTextArea = ''; //작업결과
        this.intputRecentPMYYYYMMDD = ''; // 최근PM 년 월 일
        this.intputPMScheduleID = ''; // 예방보전 일정코드
        this.pmScheduleId = ''; // 예방보전 일정코드
        // this.$refs.btnArea.style.display = 'none';
      }
    },

    //그리드 로우 클릭
    onRowClick(event) {
      this.row = { ...event.dataItem };
      // console.log("this.row::::::", this.row);
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
      const equipmentid = event.dataItem.EQUIPMENTID;
      const rowStat = event.dataItem.rowStat;
      if (equipmentid != '' && rowStat == 'N') {
        this.inputAreaControll(event.dataItem, 'rowClick');
      }
    },
    //검색 인풋
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      //콤보체인지
      // console.log("콤보체인지nm:::::::",nm);
      // console.log("콤보체인지val:::::::",val);
    },
    toChange(e) {
      this.workToDate = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    fromChange(e) {
      this.workFromDate = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    pmScheduleDateChange(e) {
      this.pmScheduleDate = Utility.setFormatDate(e.value, 'YYYYMMDD');
      this.pmEstimatedDayCheckValSet('', true);
      this.getGridData(this.pmScheduleDate);
    },
    inputBoxReset() {
      // this.$refs.intputEquipmentCode.defaultValue = ""; // 설비코드
      // this.intputEquipmentCode = ""; // 설비코드
      // this.intputEquipmentName = ""; // 설비명
      // this.intputEquipmentType = ""; //설비구분
      // this.intputDetailType = ""; // 상세구분
      // this.intputPmCycle = ""; // PM주기
      // this.intputLatelyPreservation = ""; // 최근보전
      // this.intputWorkDateYYYYMMDD = ""; // 작업일시 YYYY-MM-DD
      // this.intputWorkDateHHMMSS = ""; // 작업일시 HH:MM:SS
      // this.intputNowStatus = ""; // 현재상태
      // this.intputAfterStatus = ""; // 변경상태
    },
    pmEstimatedDayCheckValSet(nm, val) {
      // console.log("pmEstimatedDayCheckValSet::::nm::::", nm);
      // console.log("pmEstimatedDayCheckValSet::::val::::", val);
      // console.log("this.pmScheduleDate::::", this.pmScheduleDate);
      // console.log("this.gridData::::", this.gridData);
      if (val === true) {
        this.pmScheduleDateDisabled = false;
        this.gridData = this.gridOriData.filter(
          x =>
            Utility.setFormatDate(x.PMPLANNEDTIME, 'YYYYMMDD') ==
            this.pmScheduleDate
        );
        this.getGridData(this.pmScheduleDate);

        if (this.gridData.length > 0) {
          this.inputAreaControll(this.gridData, '');
        } else {
          this.inputAreaControll(this.gridData, '');
        }
      } else {
        this.pmScheduleDateDisabled = true;
        this.gridData = this.gridOriData;
        this.getGridData(this.viewParam.paramPMScheduleDate);
        if (this.gridData.length > 0) {
          this.inputAreaControll(this.gridData, '');
        } else {
          this.inputAreaControll(this.gridData, '');
          // this.gridData2 = [];
        }
      }
    },
    equipmentHisCheckValSet(nm, val) {
      // console.log("equipmentHisCheckValSet::::nm::::", nm);
      // console.log("equipmentHisCheckValSet::::val::::", val);
      if (val === true) {
        this.equipmentHisCheck = true;
      } else {
        this.equipmentHisCheck = false;
      }
      // this[nm] = val ? "Released" :'';
    },
    //그리드 더블 클릭
    rowdblclick(data) {
      this.intputWorker = data.USERID;
    },
    workuserid(data) {
      // console.log("workuserid data:::::::::", data);
      // console.log("workuserid data:::::::::", data.USERID);
      this.intputWorker = data.USERIDNAME;
    },
    setComment(data) {
      // console.log("comment data :::::::", data);

      this.saveCancel(data);
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
    sortChangeHandler2(e) {
      const isAscending = e.sort[0]?.dir == 'asc';
    },
  },
};

const defaultData = {};
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
}
</style>
