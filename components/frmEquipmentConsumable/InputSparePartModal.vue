<template>
    <div>
      <span v-if="!visibleDialog">
        <Button @click="toggleDialog">Open Dialog</Button>
      </span>
      <Dialog
        v-if="visibleDialog"
        :title="title"
        width="70%"
        height="650"
        @close="toggleDialog"
      >
        <v-row no-gutters style="margin-bottom: 20px;">
          <v-col :sm="7" :lg="7">
            <!-- <div class="form-group-wrap">
                <div class="form-group">
              <label>예비품코드</label>
              <InputText
                ref="sparepartid"
                :dataNm="'sparepartid'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>예비품명</label>
              <InputText
                ref="sparepartname"
                :dataNm="'sparepartname'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            </div> -->
          </v-col>
          <v-col :sm="5" :lg="5" align="right">
            <kbutton
              :theme-color="'primary'"
              :size="'medium'"
              :icon="'save'"
              @click="saveBtn"
              >{{ $t("MES_CommLang.MES_CommLang_00414") }}<!--저장-->
            </kbutton> 
            <kbutton
              :theme-color="'primary'"
              :size="'medium'"
              :icon="'search'"
              @click="searchBtn"
              >{{ $t("MES_CommLang.MES_CommLang_00277") }}<!--조회-->
            </kbutton> 
            <!-- 선택 -->
            <!-- <kbutton
              :theme-color="'primary'"
              :size="'medium'"
              :icon="'save'"
              @click="selectRow"
              >{{ $t("MES_CommLang.MES_CommLang_00169") }} 
            </kbutton> -->
            <kbutton
              :theme-color="'secondary'"
              :size="'medium'"
              :icon="'add'"
              @click="addBtn"
              >{{ $t("MES_CommLang.MES_CommLang_00411") }}<!--추가-->
            </kbutton>
            <kbutton
              :theme-color="'secondary'"
              :size="'medium'"
              :icon="'delete'"
              @click="confirmDel"
              >{{ $t("MES_CommLang.MES_CommLang_00412") }}<!--삭제-->
            </kbutton>
          </v-col>
        </v-row>
        <div ref="divWrapper" style="height: calc(100% - 94px)">
          <KendoGrid
            ref="rowGrid"
            :gridHeight="gridHeight"
            :gridItems="gridData"
            :sortable="true"
            :columns="headerParam.gridHeader"
            :resizable="true"
            :edit-field="'inEdit'"
            :readonly="false"
            :selected-field="selectedField"
            :changeCell="changeCell"
            :isPaging="true"
            :reSetPage="this.reSetPage"
            @gridButtonClick="gridButtonClick"
            @gridrowclick="onRowClick"
            @rowdblclick="rowdblclick"
            @gridddchang="rowDdChange"
            @griditemchange="griditemchange"
            @sortChangeHandler="sortChangeHandler"
          />
        </div>
      </Dialog>
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
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  import mixinGlobal from "@/mixin/global.js";
  import { DropDownList } from '@progress/kendo-vue-dropdowns';
  import MesSelectBox from '@/components/common/select/MesSelectBox';
  //import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
//   import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
  import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
  import KendoGrid from "@/components/common/KendoGrid";
  import InputText from "@/components/common/input/InputText";
  import FadeLoader from "vue-spinner/src/FadeLoader.vue";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import SparePartModal from '@/components/frmSparePart/SparePartModal.vue';
  
  
  
  export default {
    mixins: [mixinGlobal, gridHeaderMinin],
    components: {
      Dialog,
      DialogActionsBar,
      kbutton: Button,
      KendoGrid,
      InputText,
      FadeLoader,
      Card,
      CardBody,
      DropDownList,
      MesSelectBox,
      SparePartModal
    },
    props: {
      visibleDialog: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: () => $t("MES_CommLang.MES_CommLang_00426"),//모델링설정목록
      },
      callBack: {
        type: Function,
        default: () => true,
      },
      initData: {
        
      }
    },
    data() {
      return {
        gridHeader: [],
        gridData: [],
        gridOriData: [],
        gridHeight: "400px",
        selectedField: "selected",
        headerParam: {
          gridid: "dgvEquipmentConsumableList", // 그리드 ID
          rowStat: "", //rowStat 표시 여부
          noFirstCheck: false,
          noRowstat: false,
          gridHeader: [],
    //       gridDropDownList: [
    //     {
    //       dataVal: "PARTID",
    //       dataItem: [],
    //       disable: false,
    //     }
    //   ],
        },
        // customCell: ["PARTID"],
        changeCell: [
        {
          cellName: 'PARTIDBUTTON',
          upperCell: '',
          condition: false,
          dataItem: [],
        },
      ],
        selectedID: null,
        sparepartid: "",
        sparepartname: "",
        isLoading: true,
        reSetPage: false,
        disableGrid: false,
        btnClickIdx: '',
        sparePartModalVisible: false,
      };
    },
    computed: {},
    async mounted() {
        this.sparePartModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00595'); /* 예비품 선택/등록 */
      await this.getGridData();
    },
    methods: {
      notPageReset(flag) {
        // flag : false
        this.reSetPage = flag;
      },
      async searchBtn() {
        this.reSetPage = true;
        await this.getGridData();
      },
      selectProGroup(event) { 
        this.value = event.value;
      },
      comboChange(nm, val) {
        this[nm] = val;
      },
      
      //그리드 데이터 가져오기
      async getGridData() {
        this.gridData = [];
        this.gridOriData = [];
        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetEquipmentConsumable",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            EQUIPMENTID: this.initData.equipmentID,
            REQUESTID: this.initData.requestID,
          },
        }).then((res) => {
          const data = res.map((x, idx) => {
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
              resizable: true,
            };
          });
          this.$nuxt.$emit("iccReset");
        //   if (data !== undefined && data.length > 0) {
        //     data[0][this.selectedField] = true;
        //   }
          this.gridData = data;
          this.gridOriData = data;
          this.isLoading = false;
        });
      },


    // 저장
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
            
          };
        });
        console.log(saveData);
      const validate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridData
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show( this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
        return;
      }

      for(let i = 0; i < saveData.length; i++){
        if(saveData[i].QUANTITY == '' || saveData[i].QUANTITY == null){
            this.$refs.alertPop.show( this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00254')); /* 수량은 필수 입력 값입니다. */
            return;
        }
        let newData = this.gridData.filter((x) => x.rowStat == 'N')
        for(let k = 0; k < newData.length; k++){
            if(saveData[i].PARTID == newData[k].PARTID){
              console.log(saveData[i].PARTID);
              console.log(newData[k].PARTID);
                this.$refs.alertPop.show( this.$i18n.t('MES_CommLang.MES_CommLang_00456'),saveData[i].PARTID + ' - ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00255')); /* 해당 부품코드가 이미 존재합니다. */
            return;
            }
        }
      }
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnEquipmentConsumable',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show( this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getGridData();
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
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;

      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        // AREAID: this.treeActiveItem.SUPERAREAID,
        // EQUIPMENTGROUPID: this.treeActiveItem.AREAID,
        EQUIPMENTID: this.initData.equipmentID,
        EQUIPMENTNAME: this.initData.equipmentName,
        REQUESTID: this.initData.requestID,
        PARTID: '',
        PARTNAME: '',
        QUANTITY: '',
        UNIT: '',
        DESCRIPTION: '',
        idx: this.gridData.length,
        changeCellType: 'button', // 검색 버튼 나오도록
        PARTIDBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
      this.disableGrid = false;
    },
    //삭제버튼
    confirmDel() {
      const delData = this.gridData
        .filter((x) => x.selected === true)
        .map((x) => {
          return {
            ...x,
          };
        });

      if (delData.length > 0) {
        if (delData.filter((x) => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData
            .filter((x) => x.rowStat !== 'C')
            .map((x) => x.SPAREPARTID);

          this.$refs['confirmPop'].title = 'info';
          this.$refs['confirmPop'].message = this.gridData[0].PARTID + " - " + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); // 선택한 데이터를 삭제 하시겠습니까?
          this.$refs['confirmPop'].modalWidth = '300px';
          this.$refs['confirmPop'].visibleDialog = true;
          this.$refs['confirmPop'].callBack = this.delBtn;
        } else {
          this.delBtn();
        }
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')
        ); /* 알림, 선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.*/
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

    //검색버튼 선택
    selectedRow(row) {
      this.gridData = this.gridData.map(item => {

        return {
          ...item,
          PARTID: item.idx === this.btnClickIdx ? row.SPAREPARTID : item.PARTID,
          PARTNAME: item.idx === this.btnClickIdx ? row.SPAREPARTNAME : item.PARTNAME,
          UNIT: item.idx === this.btnClickIdx ? row.UNIT : item.UNIT,

        };
      });
    },

    //그리드 버튼 클릭 
    gridButtonClick(e, field, dataItem) {
      if (field === 'PARTIDBUTTON') {
        this.sparePartGridData = this.gridData.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickIdx = dataItem.idx;
        console.log(this.btnClickIdx);
        this.sparePartModalVisible = true;
      }
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
    //그리드 인풋 제외 데이터 변경시
     rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const rowData = JSON.parse(JSON.stringify(this.gridData));
      
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
    },
    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },
    openAlert(title, message, visiable=true, width="350px"){
        this.$refs.alertPop.title = title;
        this.$refs.alertPop.message = message;
        this.$refs.alertPop.visibleDialog = visiable;
        this.$refs.alertPop.modalWidth = width;
      },
      toggleDialog() {
        this.$emit("visibleDialog", !this.visibleDialog);
      },
      //그리드 로우 클릭
      onRowClick(event) {
        this.gridData.forEach((x) => (x.selected = false));
        event.dataItem[this.selectedField] = true;
      },
      //그리드 더블 클릭
      rowdblclick(event) {
        if(event.dataItem.rowStat != 'N'){
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00256')); /* 알림, 저장 후 선택해주세요. */
          return;
        }
        this.$emit('selectedRow', event.dataItem);
        this.$emit('visibleDialog', !this.visibleDialog);
      },
      //row 선택
      selectRow() {
        const returnData = this.gridData.filter(x => x.selected);
        if(returnData[0].rowStat != 'N'){
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00256')); /* 알림, 저장 후 선택해주세요. */
          return;
        }
        this.$emit('selectedRow', returnData[0]);
        this.$emit('visibleDialog', !this.visibleDialog);
      },
      searchInput(nm, val) {
        this[nm] = val;
      },
      sortChangeHandler(e) {
        const isAscending = e.sort[0]?.dir == "asc";
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
    },
  };
  </script>