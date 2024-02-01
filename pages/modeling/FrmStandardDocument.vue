<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li><!--기준정보-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00629") }}</li><!--표준문서 등록-->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row ref="searchFilter" no-gutters>
                <v-col :sm="9" :lg="10" align="left">
                    <div class="form-group-wrap">
                      <div class="form-group">
                        <label>{{ $t("MES_CommLang.MES_CommLang_00630") }}</label><!--표준구분-->
                        <MesSelectBox
                          :allYN="true"
                          :enumID="'standardCategory'"
                          :dataNm="'standardCategory'"
                          :style="{ width: '160px' }"
                          @comboChange="comboChange"
                          ></MesSelectBox>
                      </div>
                      <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00631") }}</label><!--표준번호-->
                          <InputText
                          :dataNm="'documentId'"
                          @input-text-set="searchInput"
                          />
                        </div>
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00632") }}</label><!--표준 명-->
                          <InputText
                          :dataNm="'documentName'"
                          @input-text-set="searchInput"
                          />
                        </div>
                    </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button><!--조회-->
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <v-row ref="contents">
        <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
                    <Card ref="gridCard1" :style="{ height: '100%', marginBottom:'1%' }">
                        <CardBody :style="{ width: '100%' }">
                            <v-row>
                                <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00629") }}</CardTitle><!--표준문서 등록-->
                                </v-col>
                                <v-col cols="6" align="right">
                                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn()">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                                <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                                <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
                                <Button
                                    :theme-color="'secondary'"
                                    :size="'small'"
                                    :icon="'add'"
                                    @click="addBtn()"
                                    >{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button
                                ><!--추가-->
                                <Button
                                    :theme-color="'secondary'"
                                    :size="'small'"
                                    :icon="'delete'"
                                    @click="delBtn()"
                                    >{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button
                                ><!--삭제-->
                                <Button
                                    :theme-color="'secondary'"
                                    :size="'small'"
                                    :icon="'undo'"
                                    @click="undoBtn()"
                                    >undo</Button
                                >
                                </v-col>
                            </v-row>
                            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                                <KendoGrid
                                ref="grid"
                                :gridHeight="gridHeight"
                                :gridItems="gridData"
                                :sortable="true"
                                :columns="gridHeader"
                                :resizable="true"
                                :edit-field="'inEdit'"
                                :selected-field="selectedField"
                                :isPaging="true"
                                :gridDropDownList="headerParam.enumComboBox"
                                :checkHeaderArr="headerParam.checkBox"
                                :pkNotEditArr="headerParam.pkNotEditArr"
                                :reSetPage="this.reSetPage"
                                @gridrowclick="onRowClick"
                                @fileChange="fileChange"
                                @gridddchang="rowDdChange"
                                @griditemchange="griditemchange"
                                @gridButtonClick="downloadBtn"
                                @pageChangeEvent="pageChangeEvent"
                                />
                            </div>
                        </CardBody>
                    </Card>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
    </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import { DatePicker } from "@progress/kendo-vue-dateinputs";
  import MesSelectBox from '@/components/common/select/MesSelectBox';
  
  
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
      DatePicker,
      MesSelectBox,
    },
    props: {
      gridHeight: {
        type: String,
        defaultData: "500px",
      },
    },
    data() {
      return {
        gridData:[],
        gridOriData:[],
        gridPageData: {},
        headerParam: {
          gridid: 'dgvStandardDocument', // 그리드 ID
          rowStat: '', //rowStat 표시 여부
          enumComboBox: ['STANDARDCATEGORY'],
          checkBox: ['USEFLAG'],
          pkNotEditArr:[],
        },
        gridHeader: [],
        selectedField: 'selected',
        standardCategory:'',
        documentId:'',
        documentName:'',
        nextStandardDocumentId:'',
        reSetPage: false,

      };
    },
    created() {},
    async mounted() {
        
    },
    computed: {
    },
    watch: {},
    methods: { 
      // ===== 검색조건 START ======
      // 검색 INPUT 변경 시
      searchInput(nm, val) {
        this[nm] = val;
      },
      // 검색 ComboBox 변경 시
      comboChange(nm, val) {
        this[nm] = val;
      },
      // 조회 버튼
      searchBtn(){
        this.getGridData();
      },
      // ===== 검색조건 END =====

      // ===== GRID START =====

      async getGridData(){
        const {skip=0, take=20} = this.gridPageData;
        this.mesGet({
          apiKey: "mes/common/customquerypaging",
          queryId: "GetStandardDocumentList",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            standardcategory: this.standardCategory,
            documentid: this.documentId,
            documentname: this.documentName,
            skip: skip,
            take: take,
          },
          }).then(({list, paging, ...x}) => {
          const data = list.map((x, idx) => {
              return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
              UPLOADFILE: '',
              FILELOCATION: x.STANDARDCATEGORY+"/",
              FILEDOWNLOADYN: !this.isNullOrEmpty(x.FILENAME)?true:false,
              FILEYN: true,
              FILECHANGE: false,
              FILEYN:true
              };
          });
          this.$nuxt.$emit("iccReset");
          this.gridPageData = paging;
          this.gridData = data;
          this.gridOriData = data;
        })
      },
      
      notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
      },

      async pageChangeEvent(skip=0, take=20) {
      this.gridPageData = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridData();
      
      },  

      saveBtn(){
        const saveData = this.gridData.filter((x) => x.rowStat !== "N").map((x) => {
            return {
              ...x,
              _rowstatus: x.rowStat,
            };
        });

        const saveValidate = this.mesValidation(
          this.gridHeader,
          this.gridData
        );
        if(!saveValidate.isValidate){
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), saveValidate.msg);//알림
          return;
        }

        const fileList = [];
        this.gridData.filter(x=> !this.isNullOrEmpty(x.FILENAME) && x.FILECHANGE).map((x,idx)=>{
          fileList.push({
            file: x.UPLOADFILE,
            fileName: x.FILENAME,
            fileLocation: x.FILELOCATION,
          })
        });


        if (saveData.length > 0) {
          if(this.mesFileUpload(fileList)){
              const res = this.mesPost({
              apiKey: "mes/common/manage",
              messagename: "TxnStandardDocument",
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
          }else{
            this.$refs.alertPop.show(
              this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
              this.$i18n.t('MES_MsgLang.MES_MsgLang_00259')//파일 업로드에 실패하였습니다.
            );
          }
        } else {
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')//저장할 데이터가 없습니다.
          );
          return;
        }

      },
      addBtn(){

          const newRowUUid = Math.round(Math.random() * 1000000000).toString();
          const dataItem = {
                  inEdit: true,
                  newRow: true,
                  selected: false,
                  rowStat: "C",
                  idx: this.gridData.length,
                  newRowUUid: newRowUUid,
                  PLANTID: this.$auth.$state.user.plantId,
                  STANDARDDOCUMENTID: this.nextStandardDocumentId,
                  STANDARDCATEGORY: '',
                  DOCUMENTID: '',
                  DOCUMENTNAME: '',
                  FILELOCATION: '',
                  FILENAME: '',
                  USEFLAG: 'Yes',
                  DESCRIPTION: '',
                  UPLOADFILE: '',
                  FILEYN: true,
                  FILEDOWNLOADYN:false,
                  FILECHANGE:false
              }
          this.gridData.splice(0, 0, dataItem);
          this.$nuxt.$emit("iccReset");
      },
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

      fileChange(e, field, dataItem){
          dataItem.FILENAME = this.fileTimestamp(e.target.files[0].name);
          dataItem.UPLOADFILE = e.target.files[0];
          dataItem.rowStat = dataItem.rowStat==="N"?"U":"C";
          dataItem.FILECHANGE = true;
      },
      onRowClick(event) {
        const selectedIdx = event.dataItem.idx;
        this.gridData = this.gridData.map(item => {
            return {
            ...item,
            selected: item.idx === selectedIdx ? !item.selected : item.selected,
            };
        });
      },
      // INPUT 데이터 변경시
      griditemchange(e) {
        const data = JSON.parse(JSON.stringify(this.gridData));
        const idx = data.findIndex(x => x.idx === e.dataItem.idx);
        data[idx] = { ...data[idx], [e.field]: e.value };
        if(data[idx].rowStat === "N"){
          data[idx].rowStat = "U";
        }
        if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
          data[idx].rowStat = "N";
        }

        this.gridData = data;
      },

      // INPUT 제외 데이터 변경시
      rowDdChange(e, name, dataItem){
        const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
        const data = JSON.parse(JSON.stringify(this.gridData));
        if(name === "USEFLAG") {
          e.value = e.value ? "Yes" : "No";
        }
        if(name === "STANDARDCATEGORY"){
          data[idx].FILELOCATION = e.value.concat("/");
        }
        

        data[idx] = {...data[idx], [name]: e.value}
        if(data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
        }
        if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
          data[idx].rowStat = "N";
        }

        this.gridData = data;
      },

      //데이터 원상복구시 "수정" 항목 제거
      chkOriginalData(gridData, idx){
        const data = JSON.parse(JSON.stringify(gridData));
        const keys = Object.keys(data[idx]);
        const chkArr = keys.filter(x => {
          return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat"
        });
        return chkArr.length > 0;
      },
      downloadBtn(e, name, item){
        window.open("/api/mes/common/fileDownload?fileName="+item.FILENAME+"&fileLocation="+item.FILELOCATION);
      },

      //전체excel
      getExcel(){
        this.excelGet({
          apiKey: 'mes/excel/customquery',
          queryId: 'GetStandardDocumentList',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            standardcategory: this.standardCategory,
            documentid: this.documentId,
            documentname: this.documentName,
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
          queryId: 'GetStandardDocumentList',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            standardcategory: this.standardCategory,
            documentid: this.documentId,
            documentname: this.documentName,
            gridid: this.headerParam.gridid,
            gridqueryversion: "00001",
            skip: skip,
            take: take,
          },
        });
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
  