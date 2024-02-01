<template>
  <div :style="{ height: '100%' }">
    <v-row ref="contents" no-gutters :style="{ height: '100%' }">
      <v-col :cols="12" :style="{ height: '100%' }">
        <v-row no-gutters>
          <v-col cols="12" align="right">
            <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveValidation">{{
              $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
            <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">전체EXCEL</Button>
            <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">페이지EXCEL</Button>
            <Button :theme-color="'secondary'" :size="'small'" icon="add" @click="addBtn">{{
              $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
            <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="delConfirm">{{
              $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
            <Button :theme-color="'secondary'" :size="'small'" icon="undo" @click="undoBtn">undo</Button>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="form-group-wrap form-group-style2">
              <div class="form-group">
                <Label>Line</Label>
                <DropDownList ref="cmbLine" :style="{ width: '250px' }" :data-items="line" :text-field="'text'"
                  :data-item-key="'id'" :value="value" @change="comboChange">
                </DropDownList>
              </div>
              <div class="form-group">
                <Label>WorkCenter</Label>
                <DropDownList ref="cmbWorkCenter" :style="{ width: '250px' }" :data-items="workCenter"
                  :text-field="'text'" :data-item-key="'id'" :value="value2" @change="comboChange2">
                </DropDownList>
              </div>
              <div class="form-group">
                <Label>{{ $t("MES_CommLang.MES_CommLang_00053") }}</Label> <!-- 공정ID -->
                <InputText ref="processid" :dataNm="'processid'" :disabled="false" @input-text-set="searchInput"
                  :searchOption="true" :searchFunc="searchBtn" />
              </div>
              <div class="form-group">
                <Label>{{ $t("MES_CommLang.MES_CommLang_00055") }}</Label> <!-- 공정명 -->
                <InputText ref="processname" :dataNm="'processname'" :disabled="false" @input-text-set="searchInput"
                  :searchOption="true" :searchFunc="searchBtn" />
              </div>

            </div>
          </v-col>
        </v-row>
        <v-row no-gutters :style="{ margin: '10px 0 0 0', height: 'calc(100% - 92px)' }">
          <v-col cols="12" :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true" :gridPageData="gridPageData"
                :columns="headerParam.gridHeader" :resizable="false" :edit-field="'inEdit'"
                :selected-field="selectedField" :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox" :customCell="customCell" :isPaging="true"
                @selectionchange="onSelectionchange" @gridrowclick="onRowClick" @gridddchang="rowDdChange"
                @griditemchange="griditemchange" @sortChangeHandler="sortChangeHandler"
                @headerselectionchange="onHeaderSelectionChange" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="ConfirmPop" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import AlertPop from '../../components/common/modal/AlertPop.vue';
import Checkbox from '@/components/common/input/Checkbox';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import { DropDownList } from '@progress/kendo-vue-dropdowns';

export default {
  name: 'Routing',
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Card,
    Button,
    AlertPop,
    CardBody,
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: '500px',
    },
    confirm: {
      type: Boolean,
      defaultData: false,
    },
  },
  data() {
    return {
      columns: [],
      gridData: [],
      gridOriData: [],
      selectedField: 'selected',
      processid: '',
      processname: '',
      headerParam: {
        gridid: 'dgvProcessDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        checkBox: [],
        gridHeader: [],
        enumComboBox: [],
        gridDropDownList: [
          {
            dataVal: "WORRKCENTER",
            dataItem: [],
            disable: false,
          },
          {
            dataVal: "PROCESSOPERTYPE",
            dataItem: [],
            disable: true,
          },
        ],
      },
      customCell: ['WORKCENTER', 'PROCESSOPERTYPE', 'PROCESSID'],
      newRowChk: [],
      value: '',
      value2: { id: '', text: '' },
      line: [],
      workCenter: [],
      processOperType: [],
      AREAID: '',
      AREANAME: '',
      selectedWorkCenter: '',
      selectedProcessOperType: '',
      RepresentativeChar: '',
      gridPageData: {}
    };
  },
  created() { },
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getComboData();
    await this.getGridComboList();
    await this.getGridComboList2();
    await this.getGridData();
    await this.getRepresentativeChar();
    this.value2.text = this.$i18n.t('MES_CommLang.MES_CommLang_00501');
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
    routingId() { },
    searchBtn() {
      this.getGridData();
    },
    saveValidation() {
      this.saveBtn();
    },
    async saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      for (let i = 0; i < saveData.length; i++) {
        if (saveData[i].WORKCENTER == "") {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00223')); /* 알림, WorkCenter를 선택해주세요. */
          return;
        } else {
          if (saveData[i].PROCESSOPERTYPE == "") {
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00224')); /* 알림, 공정구분을 선택해주세요. */
            return;
          }
        }
      }
      if (saveData.length > 0) {
        const res = await this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnProcessDefinition',
          sendParam: saveData,
        });
        if (res?.returncode == '0') {
          this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 저장, 저장되었습니다. */
          this.getGridData();
        } else {
          this.openAlert('error', this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')); /* 오류가 발생했습니다. */
          return;
        }
      } else {
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 저장, 저장할 데이터가 없습니다. */
        return;
      }


    },
    //그리드 데이터 가져오기
    async getGridData() {
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProcessList',
        sendParam: {
          processid: this.processid,
          processname: this.processname,
          plantid: this.$auth.$state.user.plantId,
          AREAID: this.$refs['cmbLine'].value.id,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          skip: skip,
          take: take,
        },
      }).then(({list, paging, ...x}) => {

        const data = list.map((x, idx) => {
          const customCell = {
            WORKCENTER: {
              type: 'combo',
              dataItem: this.headerParam.gridDropDownList[0].dataItem,
              disable: true,
              readonly: true
            },
            PROCESSOPERTYPE: {
              type: 'combo',
              dataItem: this.headerParam.gridDropDownList[1].dataItem,
              disable: true,
              readonly: true
            },
            PROCESSID: {
              type: '',
              dataItem: x.PROCESSID
            }
          };
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
            customCell,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridOriData = data;
        this.gridData = data;
      });
    },
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetProcessList',
        sendParam: {
          processid: this.processid,
          processname: this.processname,
          plantid: this.$auth.$state.user.plantId,
          AREAID: this.$refs['cmbLine'].value.id,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
        },
      });
    },
    getExcelPaging() {
      const {skip=0, take=20} = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetProcessList',
        sendParam: {
          processid: this.processid,
          processname: this.processname,
          plantid: this.$auth.$state.user.plantId,
          AREAID: this.$refs['cmbLine'].value.id,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
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
    //그리드 WorckCenter 콤보박스 리스트가져오기
    async getGridComboList() {
      this.headerParam.gridDropDownList[1].dataItem = [];

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
        this.headerParam.gridDropDownList[0].dataItem = combo;
        this.selectedWorkCenter = 'A010';
      });
    },

    // 그리드 공정구분 콤보박스 데이터 가져오기
    async getGridComboList2() {
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessOperType",
        queryVersion: "00001",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
      }).then((data) => {
        const combo = data.map(x => {
          return {
            ENUMVALUE: x.ENUMVALUE,
            ENUMVALUENAME: x.ENUMVALUENAME,
            WORKCENTER: x.WORKCENTER
          }
        })

        this.headerParam.gridDropDownList[1].dataItem = combo;
      });
    },
    // 공정코드 생성을 위해 REPRESENTATIVECHAR 가져오기
    getRepresentativeChar() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetRepresentativeChar",
        queryVersion: "00001",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
      }).then((data) => {
        this.RepresentativeChar = data[0].REPRESENTATIVECHAR;
      })
    },
    //그리드 로우 클릭
    onRowClick(event) {
      //그리드 로우 클릭시 라인표시 유무 확인필요
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
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
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const rowData = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'ACTIVESTATE') {
        e.value = e.value ? 'Active' : 'Inactive';
      }

      rowData[idx] = { ...rowData[idx], [name]: e.value };
      if (rowData[idx].rowStat === 'N') {
        rowData[idx].rowStat = 'U';
      }
      if (
        rowData[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.headerParam.gridHeader, rowData, this.gridOriData, idx)
      ) {
        rowData[idx].rowStat = 'N';
      }

      if (name === "WORKCENTER") {
        rowData[idx].PROCESSID = '';
        rowData[idx].PROCESSOPERTYPE = '';
        // 그리드 WorkCenter콤보박스 선택값
        this.selectedWorkCenter = e.value.toString();

        rowData[idx].customCell.PROCESSOPERTYPE.disable = false;
      }

      if (name === "PROCESSOPERTYPE") {
        this.selectedProcessOperType = e.value.toString();
        rowData[idx].PROCESSID = this.RepresentativeChar + this.selectedWorkCenter + this.selectedProcessOperType;

        let selectedWorkCenterName = this.headerParam.gridDropDownList[0].dataItem.filter(x => x.ENUMVALUE == this.selectedWorkCenter)[0].ENUMVALUENAME;
        let selectedOperTypeName = this.headerParam.gridDropDownList[1].dataItem.filter(x => x.ENUMVALUE == this.selectedProcessOperType)[0].ENUMVALUENAME;

        selectedWorkCenterName = selectedWorkCenterName.substring(selectedWorkCenterName.indexOf("("), selectedWorkCenterName.lastIndexOf(")") + 1);
        selectedOperTypeName = selectedOperTypeName.substring(selectedOperTypeName.indexOf("(") + 1, selectedOperTypeName.lastIndexOf(")"));

        rowData[idx].PROCESSNAME = selectedOperTypeName + " " + selectedWorkCenterName;
      }
      this.gridData = rowData;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== 'rowStat';
      });
      return chkArr.length > 0;
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
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
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
        _ROWSTATUS: 'C',
        idx: this.gridData.length,
        DESCRIPTION: '',
        BASICPROCESSID: '',
        PROCESSID: '',
        PROCESSNAME: '',
        WORKCENTER: '',
        PROCESSOPERTYPE: '',
        ACTIVESTATE: 'Active',
        CLASSIFICATION: "Normal",
        customCell: {
          WORKCENTER: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[0].dataItem,
            disable: false,
          },
          PROCESSOPERTYPE: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[1].dataItem,
            disable: true,
          },
          PROCESSID: {
            type: '',
          }
        },
      };

      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    delConfirm() {
      const chk = [];
      this.newRowChk = [];
      let message;
      this.gridData.forEach(e => {
        if (e.selected) {
          if (e.PROCESSID != '') {
            chk.push(e.PROCESSID);
          } else {
            this.newRowChk.push(e.idx);
          }
        }
      });

      if (chk.length == 0 && this.newRowChk.length == 0) {
        // 체크한 행 없을 때
        this.$refs.alertPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00412'); /* 삭제 */
        this.$refs.alertPop.message =
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088'); /* 선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다. */
        this.$refs.alertPop.visibleDialog = true;
      } else {
        if (chk.length != 0) {
          // 기존 행 삭제시에만 ID 값 Set
          message = `(${chk.join()})`;
        } else {
          message = '';
        }
        this.$refs.ConfirmPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00412'); /* 삭제 */
        this.$refs.ConfirmPop.message = message + ' - ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제하시겠습니까? */
        this.$refs.ConfirmPop.modalWidth = '330px';
        this.$refs.ConfirmPop.visibleDialog = true;
        this.$refs.ConfirmPop.callBack = this.delBtn;
      }
    },
    //삭제버튼
    delBtn() {
      let data = JSON.parse(JSON.stringify(this.gridData));
      data = data.filter((data, index, source) => {
        // 새로운 행은 Grid 에서 바로 삭제 처리
        return this.newRowChk.indexOf(data.idx) < 0;
      });
      this.gridData = data
        .map(x => {
          if (x.selected) {
            return {
              ...x,
              rowStat: 'D',
            };
          }
          return x;
        })
        .filter(x => !!x);
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    chkVal(nm, val) {
      this[nm] = val ? 'Yes' : '';
    },
    openAlert(title, message, visiable = true, width = '350px') {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, undefined, ['ACTIVESTATE']);
    },


  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
