<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00808") }}</li> <!-- 자주검사 Header 관리 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                    <div class="form-group-wrap" style="display: inline-block;">
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00053") }}</label>  <!-- 공정ID -->
                            <Input 
                            v-model="processId"
                            :style="{ width: '200px' }"
                            :dataNm="'processId'"
                            :readonly="true"
                            :class="'k-readonly'"
                            />
                            <Button
                            :theme-color="'primary'"
                            :class="'btn-form'"
                            @click="selectProcessModal"
                            >{{ $t("MES_CommLang.MES_CommLang_00169") }}</Button 
                            > <!-- 선택 -->
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
                <v-row>
                    <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00808") }}</CardTitle><!--자주검사 Header 관리-->
                    </v-col>
                    <v-col cols="6" align="right">
                    <!-- <Button :theme-color="'primary'" :size="'small'" @click="$refs.fileInput.click()">엑셀업로드</Button>
                    <input type="file" ref="fileInput" @change="uploadExcel" style="display: none;">
                    <Button :theme-color="'primary'" :size="'small'" @click="downloadExcel">엑셀저장</Button> -->
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button><!--추가-->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBtn">{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button><!--삭제-->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">undo</Button>
                    </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                  ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :gridDropDownList="headerParam.enumComboBox"
                    :selected-field="selectedField"
                    :resizable="false"
                    :isPaging="false"
                    :scrollable="true"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @gridrowclick="onRowClick"
                />
                </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <SelectProcessModal
        v-if="SelectProcessModalVisible"
        :visibleDialog="SelectProcessModalVisible"
        :title="$t('MES_CommLang.MES_CommLang_00056')"
        @visibleDialog="val => (SelectProcessModalVisible = val)"
        @selectedRow="selectedProcessId"
        />
        <AlertPop ref="alertPop" :is="'alertPop'" />
    </div>
</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import { Input } from '@progress/kendo-vue-inputs';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import SelectProcessModal from '@/components/frmSelfInspection/SelectProcessModal.vue';
import XLSX from 'xlsx';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';

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
    closable: true,
  },
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    DatePicker,
    SelectProcessModal,
    Input,
    XLSX,
    saveAs
  },
  data() {
    return {
        gridHeight: "100px",
        gridData: [],
        selectedField: "selected",
        SelectProcessModalVisible: false,
        processId: '',
        processName:'',
        searchedProcessId:'',
        searchedProcessName:'',
        headerParam:{
            gridid:'dgvSelfInspectionSpread',
            noFirstCheck:true,
            gridHeader:[],
            enumComboBox: [],
        },

    }
  },
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
  },
  computed: {

  },
  watch: {},
  methods: {
    // 공정 선택 팝업 열기
    selectProcessModal(){
        this.SelectProcessModalVisible = true;
    },
    // 공정ID 선택 팝업 CALLBACK
    selectedProcessId(item){
        this.processId = item.PROCESSID;
        this.processName = item.PROCESSNAME;
    },
    // 조회 버튼
    searchBtn(){
        this.searchedProcessId = this.processId;
        this.searchedProcessName = this.processName;
        this.getGridData();
    },

    // 데이터 조회
    async getGridData() {
        this.mesGet({
        apiKey: "mes/common/customquery",
        queryId: "GetSelfInspectionHeaderList",
        sendParam: {
            plantid: this.$auth.$state.user.plantId,
            processid: this.processId,
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
                };
            });
            this.$nuxt.$emit("iccReset");
            this.gridData = data;
            this.gridOriData = JSON.parse(JSON.stringify(data));
        });
    },

    // 저장 버튼
    saveBtn(){
        const saveData = this.gridData.filter((x) => x.rowStat !== "N").map((x) => {
            return {
              ...x,
              _ROWSTATUS: x.rowStat,
            };
        });

        const saveValidate = this.mesValidation(
          this.headerParam.gridHeader,
          this.gridData
        );
        if(!saveValidate.isValidate){
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), saveValidate.msg);//알림
          return;
        }

        if (saveData.length > 0) {
            const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnSelfInspectionHeader",
            sendParam: saveData,
            }).then((result) => {
                this.$nextTick(() => {
                if (result.returncode !== undefined && result.returncode === "0") {
                    this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
                    );
                    this.getGridData();
                } else {
                    this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
                }
                });
            });
          
        } else {
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')//저장할 데이터가 없습니다.
          );
          return;
        }
    },
    // 추가 버튼
    addBtn(){
        if(this.isNullOrEmpty(this.searchedProcessId)){
            return;
        }
        this.$refs.rowGrid.skip = 0;
        const data = {
          inEdit: true,
          newRow: true,
          selected: false,
          rowStat: 'C',
          idx: this.gridData.length,
          PLANTID: this.$auth.$state.user.plantId,
          PROCESSID: this.searchedProcessId,
          PROCESSNAME: this.searchedProcessName,
          HEADERID:'',
          HEADERNAME:'',
          PARENTHEADERID:'',
          CELLTYPE:'',
          RECIPEPARAMETERID:'',
          HEADERLEVEL:'',
        };
        this.gridData.push(data);
    },
    // 삭제 버튼
    delBtn(){
        const data = JSON.parse(JSON.stringify(this.gridData));
        this.gridData = data.filter(x => !(x.selected && x.rowStat === 'C')).map(x => {
            if (x.selected) {
                return {
                ...x,
                rowStat: 'D',
                };
            }
            return x;
        });
    },
    undoBtn(){

    },
    // INPUT 데이터 변경 시
    griditemchange(e) {
        const data = JSON.parse(JSON.stringify(this.gridData));
        const idx = data.findIndex(x => x.idx === e.dataItem.idx);
        data[idx] = { ...data[idx], [e.field]: e.value };
        if(data[idx].rowStat === "N"){
            data[idx].rowStat = "U";
        }
        if(data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)){
            data[idx].rowStat = "N";
        }

        this.gridData = data;
    },
    // INPUT 제외 데이터 변경 시
    rowDdChange(e, name, dataItem){
        const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
        const data = JSON.parse(JSON.stringify(this.gridData));
  
        data[idx] = {...data[idx], [name]: e.value}
        if(data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
        }
        if(data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)){
          data[idx].rowStat = "N";
        }

        this.gridData = data;
    },
    // GRID ROW 클릭 시
    onRowClick(event) {
        const selectedIdx = event.dataItem.idx;
        this.gridData = this.gridData.map(item => {
            return {
            ...item,
            selected: item.idx === selectedIdx ? !item.selected : item.selected,
            };
        });
    },


    // ================================== 엑셀 =======================================
    // 엑셀저장 버튼
    downloadExcel(){
      this.MESGridExcelDownload(this.headerParam.gridHeader, this.gridData,"testtttt");
    },

    // 엑셀 다운로드 Method - 공통함수로 이동하면됨
    MESGridExcelDownload(gridHeader, gridData, fileName){ // HEADER, DATA, 다운로드할 파일명
      const header = [];
      gridHeader.filter(x=> x.field!='selected' && x.field!='rowStat').map(x => {
        header.push({
          field:x.field,
          name:x.title
        })
      });

      const excelData = [];
      gridData.map(x => {
        const excelRow = {};
        header.map(y => {
          excelRow[y.name] = x[y.field]
        });
        excelData.push(excelRow);
      })
        
      const sheet = XLSX.utils.json_to_sheet(excelData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet);

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(excelBlob, fileName.concat('.xlsx'));


    },
    
    // 엑셀업로드 버튼
    uploadExcel(e){
      this.MESGridExcelUpload(this.headerParam.gridHeader, this.gridData, e);
    },

    MESGridExcelUpload(gridHeader, gridData, e){
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const excelData = [];
        json.slice(1).map((row,idx) => {
          let gridRow = {};
          gridHeader.filter(x=> x.field!='selected' && x.field!='rowStat').map((x, rowIdx) => {
            gridRow[x.field] = row[rowIdx];
          })  
          gridRow = {
            ...gridRow,
            rowStat : "C",
            inEdit : true,
            newRow: true,
            idx: gridData.length+idx
          }
          excelData.push(gridRow);
        
      });
         if (excelData.length > 0) {
          excelData.map(x=>{
            gridData.push(x);
          })
         }
      };
      reader.readAsBinaryString(file);
    },

    //전체excel
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetSelfInspectionHeaderList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processid: this.processId,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
        },
      });
    },
    
    

  },






}

</script>
<style>
.dateAlignRight{
  text-align-last: right;
}
</style>