<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00596") }}</li> <!-- 예방보전 계획등록 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>Line</Label>
                    <DropDownList ref="cmbLine" :style="{ width: '250px' }" :data-items="line" :text-field="'text'"
                      :data-item-key="'id'" :value="value" @change="comboChange">
                    </DropDownList>
                  </div>
                  <div class="form-group" style="margin-left: 5px;">
                    <Label>WorkCenter</Label>
                    <DropDownList ref="cmbWorkCenter" :style="{ width: '200px' }" :data-items="workCenter"
                      :text-field="'text'" :data-item-key="'id'" :value="value2" @change="comboChange2">
                    </DropDownList>
                  </div>
                  <div class="form-group" style="margin-left: -5px;">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00177") }}</label> <!-- 설비코드 -->
                    <InputText ref="equipmentid" :boxWidth="'85%'" :dataNm="'equipmentid'" :disabled="false"
                      :defaultValue="equipmentid" :searchOption="true" :searchFunc="searchBtn"
                      @input-text-set="searchInput" />
                  </div>
                  <div class="form-group" style="margin-left: -50px;">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                    <InputText ref="equipmentname" :boxWidth="'85%'" :dataNm="'equipmentname'" :disabled="false"
                      :defaultValue="equipmentname" :searchOption="true" :searchFunc="searchBtn"
                      @input-text-set="searchInput" />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" icon="search" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277")
                }}</Button> <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>


    <v-row ref="contents">
      <v-col :sm="3" :lg="3" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="4" align="left">
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00172") }}</CardTitle>
                <!-- 설비목록 -->
              </v-col>
            </v-row>
            <div ref="divWrapper1" style="height: calc(100% - 33px);">
              <KendoGrid ref="equipmentGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                :columns="equipmentHeaderParam.gridHeader" :resizable="false" :edit-field="'inEdit'" :isPaging="true"
                :selected-field="selectedField" @gridrowclick="equipmentOnRowClick" />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :sm="9" :lg="9" :class="'divListWapper'" :style="{ height: '65%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00597") }}</CardTitle> <!-- 예방보전 항목 -->
              </v-col>
              <v-col cols="6" align="right">
                <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn">{{
                  $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                <Button ref="addBtn" :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn"
                  :disabled="disableAddBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button>
                <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delConfirm">{{
                  $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO</Button>
              </v-col>
            </v-row>
            <div ref="divWrapper2" style="height: calc(100% - 33px);">
              <KendoGrid ref="pmCodeGrid" :gridHeight="gridHeight" :gridItems="gridData2" :sortable="true"
                :columns="PMCodeHeaderParam.gridHeader" :gridDropDownList="PMCodeHeaderParam.enumComboBox"
                :resizable="true" :edit-field="'inEdit'" :isPaging="true" :selected-field="selectedField"
                :customCell="customCell" :dateTimePickerList="PMCodeHeaderParam.dateTimePickerList"
                @gridButtonClick="gridButtonClick" @selectionchange="onSelectionchange" @gridrowclick="pmCodeOnRowClick"
                @gridddchang="rowDdChange" @griditemchange="griditemchange" />
            </div>
          </CardBody>
        </Card>

        <v-col :style="{ margin: '15px 0 0 0', height: '53%', width: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00599") }}</CardTitle> <!-- 점검항목 상세 -->
                </v-col>
              </v-row>
              <div ref="divWrapper3" style="height: calc(100% - 33px);">
                <KendoGrid ref="pmCodeDetailGrid" :gridHeight="gridHeight" :gridItems="gridData3" :sortable="true"
                  :columns="pmCodeDetalHeaderParam.gridHeader" :gridDropDownList="pmCodeDetalHeaderParam.enumComboBox"
                  :resizable="true" :edit-field="'inEdit'" :isPaging="false" :selected-field="selectedField" />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <PMCodeDetailModal ref="PMCodeDetailModal" v-if="pmCodeDetailModalVisible" :visibleDialog="pmCodeDetailModalVisible"
      :title="pmCodeDetailModalTitle" :selected-field="selectedField" :initData=initData
      @visibleDialog="val => (pmCodeDetailModalVisible = val)" @pmCodeList="pmCodeList" />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import moment from "moment";
import utils from "~/plugins/utils";
//   import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";
import WorkerGroup from "@/components/frmEquipmentWorker/WorkerGroup"
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import PMCodeDetailModal from "@/components/frmEquipmentPMCodeMap/PMCodeDetailModal.vue";
import { DateTimePicker } from '@/static/kendo.all.min.js';

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
    PMCodeDetailModal,
    DateTimePicker
  },
  data() {
    return {
      gridHeight: '100px',
      columns: [],
      gridData: [],
      gridOriData: [],

      gridData2: [],
      gridOriData2: [],

      gridData3: [],
      gridOriData3: [],

      initData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      gridHeader: [],
      equipmentid: '',
      reSetPage: false,
      equipmentname: '',
      rowInfo: {},
      headerParam: {},
      line: [],
      workCenter: [],
      disableAddBtn: true,
      selectedEquipmentID: '',
      selectedPMCodeID: '',
      selectedPMCodeList: [],
      value: '', /* Line */
      value2: { id: '', text: '' }, /* WorkCenter */
      equipmentSelectedIdx: '',
      pmCodeDetailModalVisible: false,
      btnClickIdx: '',
      equipmentHeaderParam: {
        gridid: "dgvEquipmentLisst_SparePart", // 그리드 ID
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      PMCodeHeaderParam: {
        gridid: "dgvEquipmentPMCodeMap", // 그리드 ID
        rowStat: '',
        gridHeader: [],
        noRowstat: false,
        enumComboBox: [],
        xOverflowYn: true,
        dateTimePickerList: ["PMPLANSTARTTIME", "PMPLANENDTIME"],
        gridDropDownList: [
          {
            dataVal: "MANAGERUSERID",
            dataItem: [],
            disable: false,
          },
          {
            dataVal: "WORKERUSERID",
            dataItem: [],
            disable: false,
          },
        ],
      },
      pmCodeDetalHeaderParam: {
        gridid: "dgvPMDetail", // 그리드 ID
        rowStat: '',
        gridHeader: [],
        noRowstat: true,
        enumComboBox: [],
        noFirstCheck: true,
      },
      customCell: ['MANAGERUSERID', 'WORKERUSERID'],
      customDropDown: true,
    };
  },
  created() {
  },
  async mounted() {
    this.pmCodeDetailModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00597'); /* 예방보전 항목 */
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(this.equipmentHeaderParam, this.$refs.divWrapper1);
    await this.getHeaderMulti(this.PMCodeHeaderParam, this.$refs.divWrapper2, this.customDropDown);
    await this.getHeaderMulti(this.pmCodeDetalHeaderParam, this.$refs.divWrapper3);
    this.getComboData();
    await this.getEquipmentGridData();
    this.getGridComboList();
    this.value2.text = this.$i18n.t('MES_CommLang.MES_CommLang_00501'); /* 전체 */
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    },
  },
  watch: {
  },
  methods: {
    // 설비목록 그리드 데이터 가져오기
    async getEquipmentGridData() {
      this.disableAddBtn = true;
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEquipmentDefinitionList',
        queryVersion: '00002',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          EQUIPMENTNAME: this.equipmentname,
          EQUIPMENTID: this.equipmentid
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
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
      });
    },
    // 예방보전 항목 그리드 데이터 불러오기
    async getEquipmentPMCodeMap(res) {
      this.gridOriData2 = [];
      this.gridData2 = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEquipmentPMCodeMap',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          EQUIPMENTID: res,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          const customCell = {
            MANAGERUSERID: {
              type: 'combo',
              dataItem: this.PMCodeHeaderParam.gridDropDownList[0].dataItem,
              disable: false,
            },
            WORKERUSERID: {
              type: 'combo',
              dataItem: this.PMCodeHeaderParam.gridDropDownList[1].dataItem,
              disable: false,
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
            PMPLANSTARTTIME: new Date(x.PMPLANSTARTTIME),
            PMPLANENDTIME: new Date(x.PMPLANENDTIME),
            customCell,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData2 = data;
        this.gridData2 = data;
      });
    },
    // 점검항목 상세 그리드 가져오기
    async getPMCodeDetail(data) {
      this.gridOriData3 = [];
      this.gridData3 = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPmCodeDetail',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PMCODEID: data,
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
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData3 = data;
        this.gridData3 = data;
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

    // 점검항목 상세 그리드 가져오기
    async getPMCodeDetail(data) {
      this.gridOriData3 = [];
      this.gridData3 = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPmCodeDetail',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PMCODEID: data,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
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
        this.gridOriData3 = data;
        this.gridData3 = data;
      });
    },
    // 그리드 콤보박스 데이터 가져오기
    async getGridComboList() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetUserList',
        queryVersion: '00004',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(data => {
        const combo = data.map(x => {
          return {
            ENUMVALUE: x.USERID,
            ENUMVALUENAME: x.USERNAME,
          }
        })
        this.PMCodeHeaderParam.gridDropDownList[0].dataItem = combo;
        this.PMCodeHeaderParam.gridDropDownList[1].dataItem = combo;
      });
      
    },
    async getHaeder() {
      this.gridHeader = await this.getCustomHeader("dgvEquipmentStateChangeList", true, true);
    },
    async searchBtn() {
      this.getEquipmentGridData();

    },
    // modal에서 선택된 PMCODEID 리스트 가져오기
    pmCodeList(data) {
      this.selectedPMCodeList = data;

      this.addRow(this.selectedPMCodeList);
    },
    // 저장
    saveBtn() {
      const saveData = this.gridData2
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
            PMPLANSTARTTIME: Utility.setFormatDate(x.PMPLANSTARTTIME, "YYYYMMDDHHmmss")
          };
        });
      const validate = this.mesValidation(
        this.PMCodeHeaderParam.gridHeader,
        this.gridData2
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnEquipmentPMCodeMap',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getEquipmentPMCodeMap(this.selectedEquipmentID);
              this.gridData3 = [];
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
    openAlert(title, message, visiable = true, width = "350px") {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    //설비목록 그리드 로우 클릭
    equipmentOnRowClick(event) {
      this.selectedEquipmentID = event.dataItem.EQUIPMENTID;
      this.equipmentSelectedIdx = event.dataItem.idx;
      this.disableAddBtn = false;
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.getEquipmentPMCodeMap(this.selectedEquipmentID);
    },
    // 예방보전 항목 그리드 로우 클릭
    pmCodeOnRowClick(event) {
      this.selectedPMCodeID = event.dataItem.PMCODEID
      this.gridData2.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.getPMCodeDetail(this.selectedPMCodeID);
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
    //추가 버튼 클릭(예방보전 항목 팝업 호출)
    addBtn() {
      this.initData = this.gridData2;
      this.pmCodeDetailModalVisible = true;
    },
    // 신규 로우 추가
    addRow(data) {
      for (let i = 0; i < data.length; i++) {
        this.$refs.pmCodeGrid.skip = 0;

        const dataItem = {
          inEdit: true,
          newRow: true,
          selected: false,
          PLANTID: this.$auth.$state.user.plantId,
          rowStat: 'C',
          EQUIPMENTID: this.selectedEquipmentID,
          PMCODEID: data[i],
          PMPLANSTARTTIME: new Date(),
          PMPLANENDTIME: new Date(),
          MANAGERUSERID: '',
          WORKERUSERID: '',
          SCHEDULETYPE: 'LASTPM',
          SCHEDULETVALUE: '',
          DESCRIPTION: '',
          DESCRIPTION: '',
          idx: this.gridData2.length,
          customCell: {
            MANAGERUSERID: {
              type: 'combo',
              dataItem: this.PMCodeHeaderParam.gridDropDownList[0].dataItem,
              disable: false,
            },
            WORKERUSERID: {
              type: 'combo',
              dataItem: this.PMCodeHeaderParam.gridDropDownList[1].dataItem,
              disable: false,
            },
          },
        };
        this.gridData2.splice(0, 0, dataItem);
        this.$nuxt.$emit('iccReset');
      }
    },
    //삭제버튼
    delConfirm() {
      const delData = this.gridData2
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
          ].message = selectedRow + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제 하시겠습니까? */
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
      const data = JSON.parse(JSON.stringify(this.gridData2));
      this.gridData2 = data
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
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData2 = this.gridOriData2.filter((x) => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData2.findIndex((x) => x.idx === dataItem.idx);
      const Data = JSON.parse(JSON.stringify(this.gridData2));

      if (this.gridOriData2)
        Data[idx] = { ...Data[idx], [name]: e.value };

      if (Data[idx].rowStat === "N") {
        Data[idx].rowStat = 'U';
      }

      if (
        Data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.PMCodeHeaderParam.gridHeader, Data, this.gridOriData2, idx)
      ) {
        Data[idx].rowStat = 'N';
      }

      this.gridData2 = Data;
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData2));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);

      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }

      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.PMCodeHeaderParam.gridHeader, data, this.gridOriData2, idx)
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData2 = data;
    },
   
    //검색버튼 선택
    selectedRow(row) {
      this.gridData2 = this.gridData2.map(item => {

        return {
          ...item,
          PARTID: item.idx === this.btnClickIdx ? row.SPAREPARTID : item.PARTID,
          PARTNAME: item.idx === this.btnClickIdx ? row.SPAREPARTNAME : item.PARTNAME,

        };
      });
    },
    // HH:MM String to Date 포맷 변환
    hhmmStringToDate(time) {
      const timeSplit = time.split(':');
      let dt = new Date();
      dt.setHours(timeSplit[0]);
      dt.setMinutes(timeSplit[1]);
      return dt;
    },
    //그리드 버튼 클릭 
    gridButtonClick(e, field, dataItem) {
      if (field === 'PARTIDBUTTON') {
        this.sparePartGridData = this.gridData2.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickIdx = dataItem.idx;
        // this.sparePartModalVisible = true;
      }
    },
  }
};
const defaultData = {
};
</script>
<style lang="scss"></style>