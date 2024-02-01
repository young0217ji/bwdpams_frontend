<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li>  <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
          <li>{{ $t("MES_CommLang.MES_CommLang_00594") }}</li> <!-- 예비품 기준정보 -->
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
                <DropDownList
                  ref="cmbLine"
                  :style="{ width: '250px' }"
                  :data-items="line"
                  :text-field="'text'"
                  :data-item-key="'id'"
                  :value="value"
                  @change="comboChange"
                  >
                </DropDownList>
              </div>
              <div class="form-group" style="margin-left: 5px ;">
                <Label>WorkCenter</Label>
                <DropDownList
                  ref="cmbWorkCenter"
                  :style="{ width: '200px' }"
                  :data-items="workCenter"
                  :text-field="'text'"
                  :data-item-key="'id'"
                  :value="value2"
                  @change="comboChange2"
                  >
                </DropDownList>
              </div>
              <div class="form-group" style="margin-left: -5px;">
                <label>{{ $t("MES_CommLang.MES_CommLang_00177") }}</label> <!-- 설비코드 -->
                <InputText
                    ref="equipmentid"
                    :boxWidth="'85%'"
                    :dataNm="'equipmentid'"
                    :disabled="false"
                    :defaultValue="equipmentid"
                    :searchOption="true"
                    :searchFunc="searchBtn" 
                    @input-text-set="searchInput"
                    />
                  </div>
              <div class="form-group" style="margin-left: -50px;">
                <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                <InputText
                    ref="equipmentname"
                    :boxWidth="'85%'"
                    :dataNm="'equipmentname'"
                    :disabled="false"
                    :defaultValue="equipmentname"
                    :searchOption="true"
                    :searchFunc="searchBtn" 
                    @input-text-set="searchInput"
                    />
                  </div>
                  </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button :theme-color="'primary'" icon="search" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
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
                <KendoGrid 
                  ref="equipmentGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="equipmentHeaderParam.gridHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :isPaging="true"
                  :selected-field="selectedField"
                  @gridrowclick="equipmentOnRowClick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :sm="9" :lg="9" :class="'divListWapper'" :style="{ height: '100%' }">
            <Card ref="gridCard" :style="{height : '100%'}">
                <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                    <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00591") }}</CardTitle> <!-- 예비품 목록 -->
                    </v-col>
                    <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                    <Button ref="addBtn" :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn" :disabled="disableAddBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delConfirm">{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO</Button> 
                    </v-col>
                </v-row>
                <div ref="divWrapper2" style="height: calc(100% - 33px);">
                    <KendoGrid 
                    ref="equipmentBomGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData2"
                    :sortable="true"
                    :columns="sparePartHeaderParam.gridHeader"
                    :gridDropDownList="sparePartHeaderParam.enumComboBox"
                    :resizable="true"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :changeCell="changeCell"
                    :selected-field="selectedField"
                    @gridButtonClick="gridButtonClick"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="equipmentBomOnRowClick"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    />
                </div>
            </CardBody>
        </Card>
    </v-col>
      </v-row>
      <AlertPop 
        ref="alertPop"
        :is="'alertPop'"
      />
      <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
      <SparePartModal
      ref="SparePartModal"
      v-if="sparePartModalVisible"
      :visibleDialog="sparePartModalVisible"
      :gridData="sparePartGridData"
      :title="sparePartModalTitle"
      :selected-field="selectedField"
      @visibleDialog="val => (sparePartModalVisible = val)"
      @selectedRow="selectedRow"
    />
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
  import SparePartModal from '@/components/frmSparePart/SparePartModal.vue';

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
      menuId : myMenuId,
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
      SparePartModal
    },
    data() {
      return {
        gridHeight : '100px',
        columns: [],
        gridData : [],
        gridOriData : [],
        gridData2 : [],
        gridOriData2 : [],
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
        value: '', /* Line */
        value2: { id: '', text: ''}, /* WorkCenter */
        equipmentSelectedIdx: '',
        sparePartModalVisible: false,
        btnClickIdx: '',
        equipmentHeaderParam: {
          gridid: "dgvEquipmentLisst_SparePart", // 그리드 ID
          gridHeader: [],
          noFirstCheck: true,
          noRowstat: true
        },
        sparePartHeaderParam: {
          gridid: "dgvEquipmentBOM", // 그리드 ID
          rowStat:'',
          gridHeader: [],
          noRowstat: false,
          enumComboBox: [],
        },
        changeCell: [
        {
          cellName: 'PARTIDBUTTON',
          upperCell: '',
          condition: false,
          dataItem: [],
        },
      ],
      };
    },
    created() {
    },
    async mounted() {
        this.sparePartModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00595'); /* 예비품 선택/등록 */
        this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
        await this.getHeaderMulti(this.equipmentHeaderParam, this.$refs.divWrapper1);
        await this.getHeaderMulti(this.sparePartHeaderParam, this.$refs.divWrapper2);
        this.getComboData();
        await this.getEquipmentGridData();
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
    // 예비품 그리드 데이터 불러오기
    async getEquipmentBomData(res) {
      this.gridOriData2 = [];
      this.gridData2 = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSparePart',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          EQUIPMENTID: res,
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
            // changeCellType: 'button',
            // PARTIDBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData2 = data;
        this.gridData2 = data;
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
          AREATYPE : 'Line'
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
        for(let i = 0; i < data.length; i++){
          if(i < data.length){
            this.line.push({ id : data[i].CODE, text : data[i].NAME });
            this.value = this.line[0];
          }
        }
        // 검색조건 WorkCenter 콤보박스 데이터 가져오기
        this.getWorkCenterComboList(this.line[0].id);
      });
    },
    // 검색조건 WorkCenter 콤보박스 데이터 가져오기
    async getWorkCenterComboList(res){
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
        this.workCenter.push({ id : '', text : this.$i18n.t('MES_CommLang.MES_CommLang_00501')}); /* 전체 */
        this.value2 = this.workCenter[0];
      for(let i = 0; i < data.length; i++){
        if(i < data.length){
          this.workCenter.push({ id : data[i].CODE, text : data[i].NAME });
        }
      }
      // this.value2 = '';
    });
    },
      async getHaeder(){
        this.gridHeader = await this.getCustomHeader("dgvEquipmentStateChangeList",true,true);
      },
      async searchBtn(){
        this.getEquipmentGridData();

      },

    // 저장
    saveBtn() {
      const saveData = this.gridData2
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });
        const validate = this.mesValidation(
        this.sparePartHeaderParam.gridHeader,
        this.gridData2
      );
      console.log('validate',validate);
      if (!validate.isValidate) {
        this.$refs.alertPop.show( this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
        return;
      }
        for(let i = 0; i < saveData.length; i++){
          if(saveData[i].PARTID == null || saveData[i].PARTID == ''){
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00235')); /* 알림, 부품코드는 필수 입력 값 입니다. */
            return;
          }
        }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnEquipmentBom',
          sendParam: saveData,
        }).then(result => {
          console.log(res);
          console.log('result',result);
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getEquipmentBomData(this.selectedEquipmentID);
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
      openAlert(title, message, visiable=true, width="350px"){
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
      this.getEquipmentBomData(this.selectedEquipmentID);
    },
    // 예비품 목록 그리드 로우 클릭
    equipmentBomOnRowClick(event) {
      this.gridData2.forEach(x => (x.selected = false));
        event.dataItem[this.selectedField] = true;
    },
    searchInput(nm, val){
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
      this.$refs.equipmentBomGrid.skip = 0;

      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        EQUIPMENTID: this.selectedEquipmentID,
        PARTID: '',
        PARTNAME: '',
        PARTTYPE: '',
        QUANTITY: "",
        UNIT: '',
        changeCellType: 'button', // 검색 버튼 나오도록
        PARTIDBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
        DESCRIPTION: '',
        idx: this.gridData2.length,
      };
      this.gridData2.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
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
      const rowData = JSON.parse(JSON.stringify(this.gridData2));
      
      rowData[idx] = { ...rowData[idx], [name]: e.value };
      if (rowData[idx].rowStat === 'N') {
        rowData[idx].rowStat = 'U';
      }
      if (
        rowData[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.gridHeader, rowData, this.gridOriData2, idx)
      ) {
        rowData[idx].rowStat = 'N';
      }
      
      this.gridData2 = rowData;
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
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      this.gridData2 = data;
    },
    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData2, idx) {
      const data = JSON.parse(JSON.stringify(gridData2));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.gridOriData2[idx][x] && x !== 'rowStat';
      });
      return chkArr.length > 0;
    },
    //검색버튼 선택
    selectedRow(row) {
      this.gridData2 = this.gridData2.map(item => {
        // if(item.idx === this.btnClickIdx){
        //   item.PARTID = row.SPAREPARTID;
        //   item.PARTNAME = row.SPAREPARTNAME;
        //   item.UNIT = row.UNIT;
        //   if(item.rowStat != 'C'){
        //     if(item.PARTID != this.gridOriData2[item.idx].PARTID){
        //       item.rowStat = 'U';
        //     }else{
        //       item.rowStat = 'N';
        //     }
        //   }

        // }
        // if(item.PARTID != this.gridOriData2[item.idx].PARTID && item.idx === this.btnClickIdx && item.rowStat != 'C'){
        //   this.gridData2[this.btnClickIdx].rowStat = 'U';
        // }
        
        return {
          ...item,
          PARTID: item.idx === this.btnClickIdx ? row.SPAREPARTID : item.PARTID,
          PARTNAME: item.idx === this.btnClickIdx ? row.SPAREPARTNAME : item.PARTNAME,
          // rowStat: item.idx === this.btnClickIdx ? (item.rowStat == 'N' ? 'U' : item.rowStat) : item.rowStat,

        };
      });
    },
    //그리드 버튼 클릭 
    gridButtonClick(e, field, dataItem) {
      if (field === 'PARTIDBUTTON') {
        this.sparePartGridData = this.gridData2.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickIdx = dataItem.idx;
        this.sparePartModalVisible = true;
      }
    },
    }
  };
  const defaultData = {
  };
  </script>
  <style lang="scss">
  
  </style>