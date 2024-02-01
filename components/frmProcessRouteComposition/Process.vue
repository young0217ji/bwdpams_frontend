<template>
  <div :style="{ height: '100%' }">
    <v-row no-gutters>
      <v-col cols="5" align="left">
        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00052") }}</CardTitle> <!--공정-->
      </v-col>
      <v-col cols="7" align="right">
        <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtnBefore" :disabled="confirm" >{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
        <Button :theme-color="'secondary'" :size="'small'" icon="delete" :disabled="!isTreeClicked" @click="delBtn">{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
        <Button :theme-color="'secondary'" :size="'small'" :disabled="!isTreeClicked" @click="upBtn">{{ $t("MES_CommLang.MES_CommLang_00443") }}</Button> <!-- 위로 -->
        <Button :theme-color="'secondary'" :size="'small'" :disabled="!isTreeClicked" @click="downBtn">{{ $t("MES_CommLang.MES_CommLang_00442") }}</Button> <!-- 아래로 -->

        <Button :theme-color="'primary'" :size="'small'" :disabled="processDisabled" @click="insertOperation">{{ $t("MES_CommLang.MES_CommLang_00058") }}</Button> <!-- 공정삽입 -->
        <Button :theme-color="'primary'" :size="'small'" :disabled="stepDisabled" @click="insertStep">{{ $t("MES_CommLang.MES_CommLang_00196") }}</Button> <!-- 스텝삽입 -->
        <Button :theme-color="'primary'" :size="'small'" @click="getRoutingSet">{{ $t("MES_MsgLang.MES_MsgLang_00043") }}</Button> <!-- 라우팅 구성 가져오기 -->

      </v-col>
    </v-row>
    
    <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
      <KendoGrid
        ref="rowGrid"
        :gridHeight="gridHeight"
        :gridItems="gridData"
        :sortable="true"
        :columns="gridHeader"
        :resizable="false"
        :edit-field="'inEdit'"
        :selected-field="selectedField"
        :gridDropDownList="headerParam.enumComboBox"
        :checkHeaderArr="checkHeaderArr"
        @gridrowclick="onRowClick"
        @gridddchang="rowDdChange"
        @griditemchange="griditemchange"
        @gridButtonClick="gridButtonClick"
      />
    </div>

    <AlertPop ref="alertPop" :is="'alertPop'" />
    <CurrentSearchModal
      ref="CurrentSearchModal"
      v-if="currentSearchModalVisible"
      :visibleDialog="currentSearchModalVisible"
      :gridData="currentGridData"
      :title="$t('MES_CommLang.MES_CommLang_00440')"  
      :inputVal="inputVal"
      @visibleDialog="(val) => (currentSearchModalVisible = val)"
      @selectedRow="selectedRow"
      @cancelRow="cancelRow"
    />
    <TextAreaModal
      ref="TextAreaModal"
      v-if="textAreaModalVisible"
      :visibleDialog="textAreaModalVisible"
      :title="$t('MES_CommLang.MES_CommLang_00287')" 
      :defaultValue="defaultDescription"
      @visibleDialog="(val) => (textAreaModalVisible = val)"
      @descriptionSave="descriptionSave"
    />
    <RoutingSetModal
      ref="RoutingSetModal"
      v-if="RoutingSetModalVisible"
      :visibleDialog="RoutingSetModalVisible"
      @routingSet="routingSet"
      @visibleDialog="(val) => (RoutingSetModalVisible = val)"
    />
    <InsertStep
      ref="InsertStep"
      v-if="InsertStepVisible"
      :visibleDialog="InsertStepVisible"
      :itemHierarchicalIndex="itemHierarchicalIndex"
      :insertHierarchi="insertHierarchi"
      @visibleDialog="(val) => (InsertStepVisible = val)"
    />
    <InsertOperation
      ref="InsertOperation"
      v-if="InsertOperationModalVisible"
      :visibleDialog="InsertOperationModalVisible"
      :itemHierarchicalIndex="itemHierarchicalIndex"
      :insertHierarchi="insertHierarchi"
      @visibleDialog="(val) => (InsertOperationModalVisible = val)"
    />
    <ConfirmPop ref="ConfirmPop" />
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { mapState, mapMutations, mapActions } from "vuex";
import CurrentSearchModal from "@/components/frmProcessRouteComposition/CurrentSearchModal";
import TextAreaModal from "@/components/frmProcessRouteComposition/TextAreaModal";
import RoutingSetModal from "@/components/frmProcessRouteComposition/RoutingSetModal";
import InsertStep from "@/components/frmProcessRouteComposition/InsertStep";
import InsertOperation from "@/components/frmProcessRouteComposition/InsertOperation";
import {arrayMoveImmutable} from 'array-move';



export default {
  name: "Process",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
    CurrentSearchModal,
    TextAreaModal,
    RoutingSetModal,
    InsertStep,
    InsertOperation,
  },
  props: {
    gridHeight: {
      type: String,
      default: "500",
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    gridOriData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      gridHeader: [],
      selectedField: "selected",
      checkHeaderArr: ["AUTOTRACKIN", "AUTOTRACKOUT"],
      headerParam: {
        gridid: "dgvOperation", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        enumComboBox: [],
      },
      noFirstCheck: true,
      currentSearchModalVisible: false,
      currentGridData: [],
      inputVal: "",
      btnClickRow: {},
      textAreaModalVisible: false,
      defaultDescription: "",
      RoutingSetModalVisible: false,
      confirmCheck: false,
      processDisabled:  true,
      stepDisabled: true,
      InsertStepVisible: false,
      InsertOperationModalVisible: false,
      itemHierarchicalIndex: "",
      insertHierarchi: {},
      changeDisabled: false,
      processrouteid: ''
    };
  },
  created() {
    this.$nuxt.$on('treeTarget', (data) => {
      this.treeTarget(data)
    })
  },
  async mounted() {
  },
  computed: {
    ...mapState({
      gridData: (state) => state.modules.frmPRC.dgvOperation,
      dgvOperation: (state) => state.modules.frmPRC.dgvOperation,
      dgvRecipe: (state) => state.modules.frmPRC.dgvRecipe,
      frmPRC_Data: state => state.modules.frmPRC.frmPRC_Data,
      treeData: state => state.modules.frmPRC.treeData,
      isTreeChange: state => state.modules.frmPRC.isTreeChange,
      modProcessStep: state => state.modules.frmPRC.modProcessStep,
      isTreeClicked: state => state.modules.frmPRC.isTreeClicked,
    }),
  },
  methods: {
    ...mapActions({
      setdgvOperationAction: "modules/frmPRC/setdgvOperationAction",
      setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction",
      setTreeDataAction: "modules/frmPRC/setTreeDataAction",
      setRoutingSetSaveAction: "modules/frmPRC/setRoutingSetSaveAction",
      setIsTreeChange: "modules/frmPRC/setIsTreeChange",
      setModProcessStep: "modules/frmPRC/setModProcessStep",
      setIsTreeClicked: "modules/frmPRC/setIsTreeClicked"
    }),
    //그리드 로우 클릭
    onRowClick(event) {},
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      if (name === "AUTOTRACKIN" || name === "AUTOTRACKOUT") {
        e.value = e.value ? "Yes" : "No";
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }
      this.setdgvOperationAction(data);
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
      this.setdgvOperationAction(data);
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {

        if ( this.gridOriData[idx] == undefined ) {
          return x;
        }
        else {
          return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
        }
      });
      return chkArr.length > 0;
    },
    //그리드 버튼 클릭
    gridButtonClick(e, field, dataItem) {
      if (field === "CONCURRENCYPROCESSBUTTON") {
        this.currentGridData = this.gridData.filter((x, idx) => {
          return idx > dataItem.idx
        });
        if (this.currentGridData.length === 0) {
          this.$refs.alertPop.title = "";
          this.$refs.alertPop.message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00171'); // 현재 마지막 공정입니다.
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
          return;
        }
        this.btnClickRow = dataItem;
        this.inputVal = dataItem.PROCESSNAME;
        this.currentSearchModalVisible = true;
      } else {
        this.btnClickRow = dataItem;
        this.defaultDescription = dataItem.DESCRIPTION;
        this.textAreaModalVisible = true;
      }
    },
    //동시진행공정 선택
    selectedRow(row) {
      const data = this.gridData.map((x) => {
        if (this.btnClickRow?.UIKEY === x.UIKEY) {
          return {
            ...x,
            CONCURRENCYPROCESSID: row.PROCESSID,
            CONCURRENCYPROCESSNAME: `[${row.PROCESSSEQUENCE}] - ${row.PROCESSID}`,
            CONCURRENCYPROCESSUIKEY: row.UIKEY,
            CONCURRENCYSEQUENCE: row.PROCESSSEQUENCE,
            rowStat: "U",
          };
        }
        return x;
      });
      this.setdgvOperationAction(data);
    },
    //동시진행공정 취소
    cancelRow() {
      const data = this.gridData.map((x) => {
        if (this.btnClickRow?.UIKEY === x.UIKEY) {
          return {
            ...x,
            CONCURRENCYPROCESSID: null,
            CONCURRENCYPROCESSNAME: null,
            CONCURRENCYPROCESSUIKEY: null,
            CONCURRENCYSEQUENCE: null,
            rowStat: "N",
          };
        }
        return x;
      });
      this.setdgvOperationAction(data);
    },
    //지시사항등록
    descriptionSave(text) {
      const data = this.gridData.map((x) => {
        if (this.btnClickRow?.UIKEY === x.UIKEY) {
          return { ...x, DESCRIPTION: text, rowStat: "U" };
        }
        return x;
      });
      this.setdgvOperationAction(data);
    },
    //라우팅구성 가져오기
    getRoutingSet() {
      if (this.confirmCheck) {
        this.$refs.alertPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00456'); // 알림
        this.$refs.alertPop.message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00174'); // 확정된 라우팅은 복사하기가 불가능 합니다.
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }

      if (this.isNullOrEmpty(this.processrouteid)) {
        this.$refs.alertPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00456'); // 알림
        this.$refs.alertPop.message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00047'); //라우팅을 검색 후 진행하세요.
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }
      this.RoutingSetModalVisible = true;
    },
    routingSet({ process, step, tree }) {
      const pData = process.map(x => ({...x, DESCRIPTIONSET: this.$i18n.t('MES_CommLang.MES_CommLang_00287') })) // 지시사항등록
      const sData = step.map(x => ({...x, CONCURRENCYPROCESSBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), DESCRIPTIONSET: this.$i18n.t('MES_CommLang.MES_CommLang_00287')})) // 검색, 지시사항등록
      this.setRoutingSetSaveAction(true);
      this.setdgvOperationAction(pData);
      this.setDgvRecipeAction(sData);
      this.setTreeDataAction(tree);
    },
    initGrid() {
      this.$nuxt.$emit("iccReset");
    },
    saveBtnBefore() {
      let bFlag = true;
      this.dgvOperation.map(x => {
        if ( this.isNullOrEmpty(x.ERPPROCESSCODE) ) {
          bFlag = false;
        }
      });
      
      if ( bFlag ) {
        this.$emit("saveBtnBefore");
      }
      else {
        this.$refs.alertPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00456'); // 알림
        this.$refs.alertPop.message = this.headerParam.gridHeader.filter(item => item.field == 'ERPPROCESSCODE')[0].title + " - " + this.$i18n.t('MES_MsgLang.MES_MsgLang_00016'); // 값은 필수 입력 항목입니다.
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }
    },
    treeTarget(data){
      this.stepDisabled = true;
      this.processDisabled = true;
      const flag = data.itemHierarchicalIndex.split('_');
      const idx = data.itemHierarchicalIndex;
      if(flag.length === 3){
        // this.stepDisabled = false;
      }else if(flag.length === 2){
        this.stepDisabled = false;
        this.processDisabled = false;
      }else if(flag.length === 1){
        this.processDisabled = false;
      }
      this.itemHierarchicalIndex = idx;
      this.insertHierarchi = data.item;
    },
    insertOperation(){
      if(this.isTreeChange){
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00052'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00270')); // 공정, 트리변경시 저장후 가능합니다.
        return;
      }
      this.setModProcessStep(true);
      this.InsertOperationModalVisible = true;
    },
    insertStep(){
      if(this.isTreeChange){
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00193'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00270')); // 스텝, 트리변경시 저장후 가능합니다.
        return;
      }
      this.setModProcessStep(true);
      this.InsertStepVisible = true
    },
    delBtn(){
      this.setIsTreeClicked(false)
      if(this.isTreeChange){
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00412'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00270')); // 삭제, 트리변경시 저장후 가능합니다.
        return;
      }
      const idx = this.itemHierarchicalIndex;
      const flag = this.itemHierarchicalIndex.split('_');
      const delTarget = this.insertHierarchi;

      if(flag.length === 3){
        //스텝
        if(delTarget.RECIPETYPE == "Change" || delTarget.RECIPETYPE == "Consumable"){
          const step = this.dgvRecipe.filter(x => x.RECIPERELATIONCODE !== delTarget.RECIPERELATIONCODE);
          this.setDgvRecipeAction(step);
          this.mkTree(this.frmPRC_Data, this.dgvOperation, step);
        }else{
          this.$refs.ConfirmPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00409'); // 확인   
          this.$refs.ConfirmPop.message = `${delTarget.ALIASRECIPENAME || delTarget.PROCESSSEQUENCE }` + this.$i18n.t('MES_MsgLang.MES_MsgLang_00050') + this.$i18n.t('MES_MsgLang.MES_MsgLang_00271'); //를 삭제하겠습니까?, 삭제시 같은 스텝들은 전부 삭제 됩니다.
          this.$refs.ConfirmPop.modalWidth = "330px";
          this.$refs.ConfirmPop.visibleDialog = true;
          this.$refs.ConfirmPop.callBack = this.delStep;
        }
      }else if(flag.length === 2){
        //공정
        this.$refs.ConfirmPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00409'); // 확인 
        this.$refs.ConfirmPop.message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00272'); // 삭제할 경우 스텝들도 같이 삭제 됩니다. 삭제하시겠습니까?"
        this.$refs.ConfirmPop.modalWidth = "330px";
        this.$refs.ConfirmPop.visibleDialog = true;
        this.$refs.ConfirmPop.callBack = this.delProcess;
      }else if(flag.length === 1){
        //라우트 
        return;
      }
    },
    delProcess(){
      const delTarget = this.insertHierarchi;
      const process = this.dgvOperation.filter(x =>{
        if(!(x.PROCESSID == delTarget.PROCESSID && x.PROCESSSEQUENCE == delTarget.PROCESSSEQUENCE)){
          return x
        }
      });
      const step = this.dgvRecipe.filter(x => x.PROCESSSEQUENCE !== delTarget.PROCESSSEQUENCE);
      this.setdgvOperationAction(process);
      this.setDgvRecipeAction(step);
      this.mkTree(this.frmPRC_Data, process, step);
    },
    delStep(){
      const delTarget = this.insertHierarchi;
      // const step = this.dgvRecipe.filter(x => {
      //   if(!(delTarget.PROCESSID == x.PROCESSID && delTarget.PROCESSSEQUENCE == x.PROCESSSEQUENCE 
      //     && (x.RECIPETYPE == "Start" || x.RECIPETYPE == "End"))){
      //     return x
      //   }
      // });
      // this.setDgvRecipeAction(step);
      // this.mkTree(this.frmPRC_Data, this.dgvOperation, step);
      const step = this.dgvRecipe.filter(x => x.RECIPERELATIONCODE !== delTarget.RECIPERELATIONCODE);
      this.setDgvRecipeAction(step);
      this.mkTree(this.frmPRC_Data, this.dgvOperation, step);
    },
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    initDgvs(){
      const arrProcess = [];
      let arrStep = [];
      this.treeData[0].items.forEach((x,idx) => {
        const PROCESSSEQUENCE = ((idx + 1) * 100) + 100000;
        arrProcess.push(({...x, PROCESSSEQUENCE: PROCESSSEQUENCE} ));
        arrStep = arrStep.concat(x.items.map(y => ({...y, PROCESSSEQUENCE: PROCESSSEQUENCE})));
      });
      this.setdgvOperationAction(arrProcess)
      this.setDgvRecipeAction(arrStep.filter(x => x));
      this.mkTree(this.frmPRC_Data, this.dgvOperation, this.dgvRecipe);
    },
    upBtn(){
      this.setIsTreeClicked(false)
      const idx = this.itemHierarchicalIndex;
      const flag = this.itemHierarchicalIndex.split('_');
      const moveTarget = this.insertHierarchi;
      if(flag.length === 3){
        //스텝
        let idx = 0;
        this.dgvRecipe.some((x, idxx) => {idx = idxx; return x.selected})
        this.mvStep(idx, 1, "U")
      }else if(flag.length === 2){
        //공정
        const targetIdx = idx.split("_")[1];
        if(targetIdx == 0 ) return;
        const newProcess = arrayMoveImmutable(this.dgvOperation, targetIdx, targetIdx-1)
        this.setdgvOperationAction(newProcess);
        this.mkTree(this.frmPRC_Data, newProcess, this.dgvRecipe);
        this.initDgvs();
      }else if(flag.length === 1){
        //라우트 
        return;
      }
    },
    downBtn(){
      this.setIsTreeClicked(false)
      // if(this.modProcessStep){
      //   this.openAlert("아래로", "트리변경시 저장후 가능합니다.");
      //   return;
      // }
      const idx = this.itemHierarchicalIndex;
      const flag = this.itemHierarchicalIndex.split('_');
      const moveTarget = this.insertHierarchi;
      if(flag.length === 3){
        //스텝
        let idx = 0;
        this.dgvRecipe.some((x, idxx) => {idx = idxx; return x.selected })
        this.mvStep(idx, -1, "D")
      }else if(flag.length === 2){
        //공정
        const targetIdx = idx.split("_")[1];
        if(targetIdx == this.dgvOperation.length-1 ) return;
        let newProcess = arrayMoveImmutable(this.dgvOperation, targetIdx, Number(targetIdx)+1)
        this.setdgvOperationAction(newProcess);
        this.mkTree(this.frmPRC_Data, newProcess, this.dgvRecipe);
        this.initDgvs();
      }else if(flag.length === 1){
        //라우트 
        return;
      }
    },
    mvStep(targetIdx, moveValue, type){
      const orgTree = JSON.parse(JSON.stringify(this.treeData))
      const orgProcess = JSON.parse(JSON.stringify(this.dgvOperation))
      const orgStep = JSON.parse(JSON.stringify(this.dgvRecipe))

      const moveTarget = this.insertHierarchi;
      const nowProcessSeq = moveTarget.PROCESSSEQUENCE
      const sameProcessStepList = this.dgvRecipe.filter(x => x.PROCESSSEQUENCE == nowProcessSeq);
      const nowStepIndex = this.dgvRecipe.findIndex(x => x.RECIPESEQUENCE == moveTarget.RECIPESEQUENCE);
      const nowSameStepIndex = sameProcessStepList.findIndex(x => x.RECIPESEQUENCE == moveTarget.RECIPESEQUENCE);
      const nowProcessIdx = this.dgvOperation.findIndex(x => x.PROCESSSEQUENCE == nowProcessSeq);
      const upperProcess = this.dgvOperation[nowProcessIdx-1]
      const lowerProcess = this.dgvOperation[nowProcessIdx+1]
      let stepData = JSON.parse(JSON.stringify(this.dgvRecipe))
      
      if(sameProcessStepList.length === 1){
        /**
         * 공정에 1개의 스탭일경우 바로 다른 공정으로 이동
         * 그런데 상위 or 하위에 공정이 없을경우는 이동불가
         */
        if(type === "U" && upperProcess){
          stepData = stepData.map(x => {
            if(x.RECIPESEQUENCE == moveTarget.RECIPESEQUENCE){
              return {...x, PROCESSSEQUENCE: upperProcess.PROCESSSEQUENCE,PROCESSID: upperProcess.PROCESSID}
            }
            return x
          })
        }else if(type === "D" && lowerProcess){
          stepData = stepData.map(x => {
            if(x.RECIPESEQUENCE == moveTarget.RECIPESEQUENCE){
              return {...x, PROCESSSEQUENCE: lowerProcess.PROCESSSEQUENCE,PROCESSID: lowerProcess.PROCESSID}
            }
            return x
          });
        }
      }else{
        if(nowSameStepIndex === 0){
          /**
           * @firstIdx upperProcess로넘어감
           */
          if(type === "U"){
            stepData = stepData.map(x => {
              if(x.RECIPESEQUENCE == moveTarget.RECIPESEQUENCE){
                return {...x, PROCESSSEQUENCE: upperProcess.PROCESSSEQUENCE,PROCESSID: upperProcess.PROCESSID}
              }
              return x
            });
          }else if(type === "D"){
            stepData = arrayMoveImmutable(stepData, nowStepIndex, nowStepIndex+1)
          }

        }else if(nowSameStepIndex === sameProcessStepList.length-1){
          /**
           * @lastIdx lowerProcess로넘어감
           * target의 index가 같은 공정의 step langth -1 일경우
           */
          if(type === "U"){
            stepData = arrayMoveImmutable(stepData, nowStepIndex, nowStepIndex-1)
          }else if(type === "D"){
            stepData = stepData.map(x => {
              if(x.RECIPESEQUENCE == moveTarget.RECIPESEQUENCE){
                return {...x, PROCESSSEQUENCE: lowerProcess.PROCESSSEQUENCE, PROCESSID: lowerProcess.PROCESSID}
              }
              return x
            });
          }
        }else{
          /**
           * @같은공정내에서이동
           */
          if(type === "U"){
            stepData = arrayMoveImmutable(stepData, nowStepIndex, nowStepIndex-1)
          }else if(type === "D"){
            stepData = arrayMoveImmutable(stepData, nowStepIndex, nowStepIndex+1)
          }
        }
      }
      this.setDgvRecipeAction(stepData)
      this.mkTree(this.frmPRC_Data, this.dgvOperation, this.dgvRecipe);

      const sameTypeStep = this.dgvRecipe.filter(x => x.RECIPERELATIONCODE == moveTarget.RECIPERELATIONCODE);
      const recipetypeArr = []
      sameTypeStep.forEach(x => {
        if(x.RECIPETYPE === "Start"){
          recipetypeArr.push(1)
        }else if(x.RECIPETYPE === "Change"){
          recipetypeArr.push(2)
        }else if(x.RECIPETYPE === "End"){
          recipetypeArr.push(3)
        }
      });
      // console.log(recipetypeArr)
      if(!this.isAscending(recipetypeArr)) { 
        this.openAlert("", this.$i18n.t('MES_MsgLang.MES_MsgLang_00273')); // 현재 스탭은 Start, Change, End 순으로 설정해야 합니다.
        this.setdgvOperationAction(orgProcess);
        this.setDgvRecipeAction(orgStep);
        this.mkTree(this.frmPRC_Data, this.dgvOperation, this.dgvRecipe);
        return
      } 
      this.setIsTreeChange(true)
      
    },
    isAscending(arr) {
      const sortedArray = [...arr].sort((a, b) => a - b);
      return JSON.stringify(arr) === JSON.stringify(sortedArray);
    },
    updateSeq(){
      let arrStep = [];
      const arrProcess = [];
      this.treeData[0].items.forEach((x,idx) => {
        const PROCESSSEQUENCE = ((idx + 1) * 100) + 100000;
        arrProcess.push(({...x, PROCESSSEQUENCE: PROCESSSEQUENCE} ));
        arrStep = arrStep.concat(x.items.map(y => ({...y, PROCESSSEQUENCE: PROCESSSEQUENCE})));
      });
      this.setdgvOperationAction(arrProcess);
      this.setDgvRecipeAction(arrStep.filter(x => x));
    },
    mkTree(route, process, step){
      const gd = route.map((x) => ({
        ...x,
        id: "routeGrid",
        label: x.PROCESSROUTEID,
        icon: "PROCESSROUTE",
      }));
      const pd = process.map((x) => ({
        ...x,
        id: x.UIKEY,
        parentId: "routeGrid",
        label: x.PROCESSNAME,
        icon: "PROCESS",
      }));
       for(let i =0; i<pd.length;i++){
          for(let j =0; j<step.length; j++) {
            if(pd[i].PROCESSID == step[j].PROCESSID && pd[i].PROCESSSEQUENCE == step[j].PROCESSSEQUENCE) {
              step[j].PROCESSROUTEID = pd[i].UIKEY;
            }
          }
        }

      const sd = step.map((x) => ({
        ...x,
        parentId: x.PROCESSROUTEID,
        label: `[${x.RECIPERELATIONCODE}] - ${x.RECIPENAME}[${x.RECIPETYPE || ''}]`,
        icon: "RECIPE",
      }));
      this.setTreeDataAction([...gd, ...pd, ...sd])
    },
  },
  watch: {},
};

const defaultData = {};
</script>
<style lang="scss">
</style> 
