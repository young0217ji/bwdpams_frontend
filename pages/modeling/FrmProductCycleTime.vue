<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00588") }}</li> <!-- 품목별C/T관리 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00055") }}</label> <!-- 공정명  -->
                      <DropDownList
                        ref="cmbProcessType"
                        :style="{ width: '250px' }"
                        :data-items="processList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="processValue"
                        @change="selectProcessType"
                      >
                    </DropDownList>
                    </div>
                    <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                      <DropDownList
                        ref="cmbEquipmentType"
                        :style="{ width: '250px' }"
                        :data-items="equipmentList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :allYN="true"
                        :value="equipmentValue"
                        @change="selectEquipmentType"
                      >
                    </DropDownList>
                    </div>
                  </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button
                    :theme-color="'primary'"
                    :size="'medium'"
                    :icon="'search'"
                    @click="searchBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button 
                  > <!-- 조회 -->
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
  
      <v-row ref="contents">
        <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row no-gutters>
                <v-col cols="6">
                  <CardTitle>&nbsp;</CardTitle>
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                  <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                  <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBtn" >{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn" >undo</Button> 
                </v-col>
              </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="headerParam.gridHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :groupable="true"
                  :reorderable="true"
                  :columnMenu="true"
                  :isPaging="true"
                  :scrollable="true"
                  :checkHeaderArr="headerParam.checkBox"
                  :reSetPage="this.reSetPage"
                  @pageChangeEvent="pageChangeEvent"
                  @selectionchange="onSelectionchange"
                  @gridrowclick="onRowClick"
                  @griditemchange="griditemchange"
                  @gridButtonClick="gridButtonClick"
                  @headerselectionchange="onHeaderSelectionChange"
                />
                </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <ConfirmPop
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
      />
      <SelectProductModal
      ref="SelectProductModal"
      v-if="SelectProductModalVisible"
      :visibleDialog="SelectProductModalVisible"
      :title="productModalTitle"
      :selected-field="selectedField"
      @visibleDialog="val => (SelectProductModalVisible = val)"
      @selectedRow="selectedRow"
      />
    </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '../../components/common/input/InputText.vue';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';

let myTitle;
let myMenuId;


export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
    KendoGrid,
    InputText,
    DropDownList,
    SelectProductModal,
  },
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      selectedField: "selected",
      headerParam: {
        gridid: "dgvProductCycleTime", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        checkBox: [],
      },
      processId: '', 
      equipmentId: '',
      topcoating: '',
      cycletime: '',
      processList: [], // 공정명 콤보박스 
      equipmentList: [], // 설비명 콤보박스
      processValue: '',
      equipmentValue: '',
      changeCell: [
        {
          cellName: 'PRODUCTID',
          upperCell: '',
          condition: false,
          dataItem: [],
        },
      ],
      SelectProductModalVisible: false,
      productModalTitle: '',
      btnClickIdx: '',
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    this.productModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00262'); /* 품번목록 */
    await this.getProcessListData();
    await this.getEquipmentListData();
  },
  computed: {

  },
  watch: {},
  methods: {
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },

    // 조회 버튼 클릭
    searchBtn(){
      this.reSetPage = true;
        this.getGridData();
    },

    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData = this.gridData.map(item => {
        return {
          ...item,
          selected: item.idx === selectedIdx ? !item.selected : item.selected,
        };
      });
      this.selected = event.dataItem;
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

    // 공정명 콤보 데이터 가져오기
    async getProcessListData() {
        this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProcessList',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
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
            this.processList.push({ id : data[i].PROCESSID, text : data[i].PROCESSNAME });
          }
        }
        this.processValue = this.processList[0].id;
        // 선택한 공정명 데이터 가져오기
        this.getEquipmentListData(this.processValue);
      });
    }, 

    // 설비명 콤보 데이터 가져오기
    async getEquipmentListData(res) {
      this.equipmentList = [{id:'', text:'전체'}];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetOMProcessAvailableEquipment',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processId: res
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
            this.equipmentList.push({ id : data[i].EQUIPMENTID, text : data[i].EQUIPMENTNAME });
          }
        }
        this.equipmentValue = this.equipmentList[0].id;
      });
    }, 

    selectProcessType(event) {
      this.processValue = event.value;
      this.getEquipmentListData(this.processValue);
    },
    
    selectEquipmentType(event) {
      this.equipmentValue = event.value;
    },

    

    // 그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetProductCycleTimeList',
        queryVersion: '00002',
        sendParam: {
          plantId: this.$auth.$state.user.plantId,
          processId: this.processValue,
          equipmentId: this.equipmentValue,
          skip: skip,
          take: take,
        },
      }).then(({list, paging, ...x}) => {
        const data = list.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
            changeCellType: 'button',
          };
        });

        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridOriData = data;
        this.gridData = data;
      });
    },

    async pageChangeEvent(skip=0, take=20) {
      this.gridPageData = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridData();
      
    },

    // 그리드 버튼 클릭
    gridButtonClick(e, field, dataItem) {
      if (field === 'PRODUCTID') {
        this.btnClickIdx = dataItem.idx;
        this.SelectProductModalVisible = true;
      }
    },

    // 검색버튼 선택
    selectedRow(row) {
      this.gridData = this.gridData.map(item => {
        return {
          ...item,
          PRODUCTID: item.idx === this.btnClickIdx ? row.PRODUCTID : item.PRODUCTID,
          PRODUCTNAME: item.idx === this.btnClickIdx ? row.PRODUCTNAME : item.PRODUCTNAME,
          TOPCOATING: item.idx === this.btnClickIdx ? row.TOPCOATING : item.TOPCOATING,
          
        };
      });
    },

    // 저장 버튼 클릭
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

        const validata = this.mesValidation(
          this.headerParam.gridHeader,
          this.gridData
        );
        if(!validata.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validata.msg); /* 알림 */
          return;
        }

        if(saveData.length > 0) {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnProductCycleTime',
            sendParam: saveData,
          }).then(result => {
            this.$nextTick(() => {
            this.getGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getGridData();
            } 
            });
          });
        } else {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다.*/
          return;
        }
    },

    // 추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = {
        inEdit: true, 
        newRow: true,
        selected: false, 
        PLANTID: this.$auth.$state.user.plantId, 
        rowStat: "C",
        _ROWSTATUS: "C",
        newRowUUid: newRowUUid,
        idx: this.gridData.length,
        PRODUCTID: '',
        change: 'button', // 검색 버튼 나오도록
        PROCESSID: this.$refs.cmbProcessType.value.id,
        PROCESSNAME: this.$refs.cmbProcessType.value.text,
        EQUIPMENTID: this.$refs.cmbEquipmentType.value.id,
        EQUIPMENTNAME: this.$refs.cmbEquipmentType.value.text,
        TOPCOATING: '',
        CYCLETIME: '',

      };
      this.gridData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },

    //삭제 버튼 클릭
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

    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
    },

    //그리드 인풋 데이터 변경시
      griditemchange(e) {
        const data = JSON.parse(JSON.stringify(this.gridData));
        const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
        data[idx] = { ...data[idx], [e.field]: e.field==='CYCLETIME'?Number(e.value):e.value };
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
        const chkArr = keys.filter((x) => {
          return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
        });
        return chkArr.length > 0;
      },

      //전체excel
      getExcel(){
        this.excelGet({
          apiKey: 'mes/excel/customquery',
          queryId: 'GetProductCycleTimeList',
          queryVersion: '00002',
          sendParam: {
            plantId: this.$auth.$state.user.plantId,
            processId: this.processValue,
            equipmentId: this.equipmentValue,
            gridid: this.headerParam.gridid,
            gridqueryversion: "00001",
          },
        });
      },

      //페이지excel
      getExcelPaging() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        const {skip=0, take=20} = this.gridPageData;
        this.excelGet({
          apiKey: 'mes/excel/customquerypaging',
          queryId: 'GetProductCycleTimeList',
          queryVersion: '00002',
          sendParam: {
            plantId: this.$auth.$state.user.plantId,
            processId: this.processValue,
            equipmentId: this.equipmentValue,
            gridid: this.headerParam.gridid,
            gridqueryversion: "00001",
            skip: skip,
            take: take,
          },
        });
      },
  },

}
</script>