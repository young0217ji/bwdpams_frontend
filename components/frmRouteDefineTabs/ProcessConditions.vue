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
                <Label>{{ $t("MES_CommLang.MES_CommLang_00063") }}</Label> <!-- 공정조건코드 -->
                <InputText ref="recipeparameterid" :dataNm="'recipeparameterid'" :disabled="false"
                  @input-text-set="searchInput" :searchOption="true" :searchFunc="searchBtn" />
              </div>
              <div class="form-group">
                <Label>{{ $t("MES_CommLang.MES_CommLang_00062") }}</Label> <!-- 공정조건명 -->
                <InputText ref="recipeparametername" :dataNm="'recipeparametername'" :disabled="false"
                  @input-text-set="searchInput" :searchOption="true" :searchFunc="searchBtn" />
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row no-gutters :style="{ margin: '10px 0 0 0', height: 'calc(100% - 92px)' }">
          <v-col cols="12" :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true" :gridPageData="gridPageData"
                :columns="gridHeader" :resizable="false" :edit-field="'inEdit'" :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox" :isPaging="true" @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick" @gridddchang="rowDdChange" @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange" @sortChangeHandler="sortChangeHandler" />
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
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
// import { Input } from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";



export default {
  name: "Step",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px"
    },
    confirm: {
      type: Boolean,
      defaultData: false
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      selectedField: 'selected',
      // checkHeaderArr: ["COMMONFLAG","ACTIVESTATE"],
      recipeparameterid: "",
      recipeparametername: "",
      recipeparametergroup: "",
      Classification: "",
      headerParam: {
        gridid: "dgvParameter", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        enumComboBox: [],
      },
      newRowChk: [],
      gridPageData: {}
    };
  },
  created() {
  },
  async mounted() {
    // await this.getGridComboList();
    // await this.getGridData();
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    },
  },
  watch: {
  },
  methods: {
    routingId() {

    },
    searchBtn() {
      this.getGridData();
    },
    saveValidation() {
      const validation = this.gridData.filter(x => x.rowStat !== "N" && !x.RECIPEPARAMETERID)
      if (validation.length > 0) {
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00029')) /* 저장, 공정조건코드 값은 필수 입력값입니다. */
        return;
      }
      const validation2 = this.gridData.filter(x => x.rowStat !== "N" && !x.RECIPEPARAMETERNAME)
      if (validation2.length > 0) {
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00028')) /* 저장, 공정조건명 값은 필수 입력값입니다. */
        return;
      }
      const dupChk = [];
      this.gridData.forEach(x => {
        if (x.rowStat !== "N") {
          dupChk.push(x.RECIPEPARAMETERID)
        }
      })
      const dupArr = this.gridData.filter(x => x.rowStat === "N" && dupChk.indexOf(x.RECIPEPARAMETERID) > -1)
      if (dupArr.length > 0) {
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00025')) /* 저장, 공정ID 값이 중복 되었습니다. */
        return;
      }

      this.saveBtn();
    },
    async saveBtn() {
      const saveData = this.gridData.filter(x => x.rowStat !== "N")
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          }
        });

      if (saveData.length > 0) {
        const res = await this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnRecipeParameter",
          sendParam: saveData
        })
        if (res?.returncode == "0") {
          this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 저장, 저장되었습니다. */
          this.getGridData();
        } else {
          this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')); /* 알림, 오류가 발생했습니다. */
        }
      } else {
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 저장, 저장할 데이터가 없습니다. */
      }

    },
    //그리드 데이터 가져오기
    async getGridData() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: "GetParameterList",
        sendParam: {
          recipeparameterid: this.recipeparameterid,
          recipeparametername: this.recipeparametername,
          recipeparametergroup: this.recipeparametergroup,
          classification: this.classification,
          plantid: this.$auth.$state.user.plantId,
          skip: skip,
          take: take,
        },
      }).then(({ list, paging, ...x }) => {

        const data = list.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
          }
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        // this.$nuxt.$emit('vmodelReset');
        this.$nuxt.$emit('iccReset')
        this.gridPageData = paging;
        this.gridOriData = data;
        this.gridData = data;
      })
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetParameterList',
        sendParam: {
          recipeparameterid: this.recipeparameterid,
          recipeparametername: this.recipeparametername,
          recipeparametergroup: this.recipeparametergroup,
          classification: this.classification,
          plantid: this.$auth.$state.user.plantId,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetParameterList',
        sendParam: {
          recipeparameterid: this.recipeparameterid,
          recipeparametername: this.recipeparametername,
          recipeparametergroup: this.recipeparametergroup,
          classification: this.classification,
          plantid: this.$auth.$state.user.plantId,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },
    //그리드 로우 클릭
    onRowClick(event) {
      console.log("===========onRowClick==============")
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      console.log("===========onSelectionchange==============")
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      console.log("===========onHeaderSelectionChange==============")
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      if (name === "COMMONFLAG") {
        e.value = e.value ? "Yes" : "No";
      }
      if (name === "ACTIVESTATE") {
        e.value = e.value ? "Active" : "Inactive";
      }

      data[idx] = { ...data[idx], [name]: e.value }
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      this.gridData = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      console.log("===griditemchange===", e)

      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
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
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat"
      });
      return chkArr.length > 0;
    },
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit('iccReset')
    },
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random() * 1000000000).toString()
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: "C",
        _ROWSTATUS: "C",
        newRowUUid: newRowUUid,
        idx: this.gridData.length,
        RECIPEPARAMETERID: "",
        RECIPEPARAMETERNAME: "",
        RECIPEPARAMETERGROUP: "",
        RECIPEPARAMETERTYPE: "Normal",
        CLASSIFICATION: "Common",
        RECIPEPARAMETERNAME: "",
        DESCRIPTION: "",
      };
      this.gridData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },
    delConfirm() {
      const chk = [];
      this.newRowChk = [];
      let message;
      this.gridData.forEach(e => {
        if (e.selected) {
          if (e.RECIPEPARAMETERID != '') {
            chk.push(e.RECIPEPARAMETERID);
          } else {
            this.newRowChk.push(e.idx);
          }
        }
      });

      if (chk.length == 0 && this.newRowChk.length == 0) { // 체크한 행 없을 때
        this.$refs.alertPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00412'); /* 삭제 */
        this.$refs.alertPop.message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00088'); /* 선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다. */
        this.$refs.alertPop.visibleDialog = true;
      } else {
        if (chk.length != 0) { // 기존 행 삭제시에만 ID 값 Set
          message = `(${chk.join()})`;
        } else {
          message = '';
        }
        this.$refs.ConfirmPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00412') /* 삭제 */
        this.$refs.ConfirmPop.message = message + ' - ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제하시겠습니까? */
        this.$refs.ConfirmPop.modalWidth = "330px";
        this.$refs.ConfirmPop.visibleDialog = true;
        this.$refs.ConfirmPop.callBack = this.delBtn;
      }
    },
    //삭제버튼
    delBtn() {
      let data = JSON.parse(JSON.stringify(this.gridData));
      data = data.filter((data, index, source) => { // 새로운 행은 Grid 에서 바로 삭제 처리
        return this.newRowChk.indexOf(data.idx) < 0;
      });
      this.gridData = data.map(x => {
        if (x.selected) {
          return {
            ...x,
            rowStat: "D"
          }
        }
        return x;
      });
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    chkVal(nm, val) {
      this[nm] = val ? "Yes" : "";
    },
    openAlert(title, message, visiable = true, width = "350px") {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    sortChangeHandler(e) {
      const isAscending = e.sort[0]?.dir == "asc";
      if (isAscending) {
        this.gridData = this.gridData.sort((a, b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      } else {
        this.gridData = this.gridData.sort((a, b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss"></style>