<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li><!--기준정보-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00657") }}</li><!--중점관리사항 문서 관리-->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row ref="searchFilter" no-gutters>
                <v-col :sm="9" :lg="10" align="left">
                    <div class="form-group-wrap">
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00540") }}</label> <!-- 품번그룹명 -->
                          <DropDownList
                            ref="cmbProGroup"
                            :style="{ width: '250px' }"
                            :data-items="productGroupList"
                            :text-field="'text'"
                            :data-item-key="'id'"
                            :value="productGroupValue"
                            @change="productGroupChange"
                            >
                          </DropDownList>
                        </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00258") }}</label><!--품번-->
                            <InputText
                            :dataNm="'productId'"
                            @input-text-set="searchInputValSet"
                            />
                        </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</label><!--품명-->
                            <InputText
                            :dataNm="'productName'"
                            @input-text-set="searchInputValSet"
                            />
                        </div>
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00655") }}</label><!--파일명-->
                            <InputText
                            :dataNm="'fileName'"
                            @input-text-set="searchInputValSet"
                            />
                        </div>
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00656") }}</label><!--파일등록유무-->
                            <MesSelectBox
                            :allYN="true"
                            :enumID="'FlagYesNo'"
                            :dataNm="'fileUseFlag'"
                            :style="{ width: '160px' }"
                            @comboChange="comboChange"
                            ></MesSelectBox>
                        </div>
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00129") }}</label><!--사용여부-->
                            <MesSelectBox
                            :allYN="true"
                            :enumID="'FlagYesNo'"
                            :dataNm="'useFlag'"
                            :style="{ width: '160px' }"
                            @comboChange="comboChange"
                            ></MesSelectBox>
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
        <v-col :cols="12" :style="{ height: '100%' }">
          <Card ref="gridCard2" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%' }">
              <v-row>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00657") }}</CardTitle><!--중점관리사항 문서 관리-->
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button><!--추가-->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBtn">{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button><!--삭제-->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">undo</Button>
                </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="grid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :gridPageData="gridPageData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :isPaging="true"
                  :reSetPage="this.reSetPage"
                  :checkHeaderArr="headerParam.checkBox"
                  @pageChangeEvent="pageChangeEvent"
                  @fileChange="fileChange"
                  @gridddchang="rowDdChange"
                  @gridrowclick="onRowClick"
                  @griditemchange="griditemchange"
                  @gridButtonClick="gridButtonClick"
                  @selectionchange="onSelectionchange"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <SelectProductModal
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
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import { DropDownList } from '@progress/kendo-vue-dropdowns';
  import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';
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
      MesSelectBox,
      DropDownList,
      SelectProductModal,
    },
    props: {
      gridHeight: {
        type: String,
        defaultData: "500px",
      },
    },
    data() {
      return {
        selectedField: 'selected',
        productGroupList: [{id:'', text:''}], 
        productGroupValue: '',
        gridData:[],
        gridOriData:[],
        headerParam:{
            gridid: 'dgvFocusControlDocument', // 그리드 ID
            rowStat: '', //rowStat 표시 여부
            checkBox:['USEFLAG'],
            xOverflowYn: true,
        },
        gridHeader:[],
        productId:'',
        productName:'',
        fileName:'',
        fileUseFlag: '',
        useFlag: '',
        gridPageData: {},
        reSetPage: false,
        searchIdx:'',
        SelectProductModalVisible:false,
        productModalTitle: this.$i18n.t('MES_CommLang.MES_CommLang_00262'), // 품번목록

       
      };
    },
    created() {},
    async mounted() {
      await this.getProductGroupData();
    },
    computed: {
    },
    watch: {},
    methods: { 
      // ===== 검색조건 START =====

      // 품번그룹 Combo 
      async getProductGroupData() {
        this.gridOriData = [];
        this.gridData = [];
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetProductGroupList',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          },
        }).then(res => {
          res.map(x => {
            this.productGroupList.push({ id : x.PRODUCTGROUPID, text : x.PRODUCTGROUPNAME });
          })
        });
        this.productGroupValue = this.productGroupList[0];
      },
      // 품번그룹 변경시
      productGroupChange(event) { 
        this.productGroupValue = event.value;
      },
      // 검색조건 TEXT 입력
      searchInputValSet(nm, val) {
          this[nm] = val;
      },
      // 검색 ComboBox 변경 시
      comboChange(nm, val) {
          this[nm] = val;
      },
      // 검색버튼
      searchBtn(){
        this.reSetPage = true;
        this.gridPageData.skip = 0;
        this.getGridData();
      },
      
      // ===== 검색조건 END =====

      // ===== GRID START =====
      async getGridData() {
          const {skip=0, take=20} = this.gridPageData;
          this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetFocusControlDocumentList",
          sendParam: {
              plantid: this.$auth.$state.user.plantId,
              productgroupid: this.productGroupValue.id,
              productid: this.productId,
              productname : this.productName,
              fileName: this.fileName,
              fileUseFlag: this.fileUseFlag,
              useFlag: this.useFlag,
              skip: skip,
              take: take,
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
              P_FILECHANGE: false,
              P_UPLOADFILE: '',
              P_FILEUPLOADYN: true,
              P_FILEDOWNLOADYN: !this.isNullOrEmpty(x.P_FILENAME)?true:false,
              Q_FILECHANGE: false,
              Q_UPLOADFILE: '',
              Q_FILEUPLOADYN: true,
              Q_FILEDOWNLOADYN: !this.isNullOrEmpty(x.Q_FILENAME)?true:false,
              P_FILEUPLOADYN:true,
              Q_FILEUPLOADYN:true,
              USEFLAG: this.isNullOrEmpty(x.USEFLAG)?'No':x.USEFLAG,
              DESCRIPTION: this.isNullOrEmpty(x.DESCRIPTION)?'':x.DESCRIPTION,
              };
          });
          this.$nuxt.$emit("iccReset");
          this.gridData = data;
          this.gridOriData = JSON.parse(JSON.stringify(data));
          this.gridPageData = {
            ...this.gridPageData,
            total: Number(this.isNullOrEmpty(data)?0:data[0].TOTAL),
          }
          });
      },
      // 페이지 변경
      async pageChangeEvent(skip=0, take=20) {
        this.gridPageData = {
          skip: skip,
          take: take
        }
        this.reSetPage = false;
        this.getGridData();
        
      },
      // 추가버튼
      addBtn(){
        this.$refs.grid.skip = 0;
        const data = {
          inEdit: true,
          newRow: true,
          selected: false,
          rowStat: 'C',
          idx: this.gridData.length,
          PLANTID: this.$auth.$state.user.plantId,
          PRODUCTID: '',
          PRODUCTNAME: '',
          P_FILENAME: '',
          P_FILECHANGE: false,
          P_UPLOADFILE: '',
          P_FILEUPLOADYN: true,
          P_FILEDOWNLOADYN: false,
          Q_FILENAME: '',
          Q_FILECHANGE: false,
          Q_UPLOADFILE: '',
          Q_FILEUPLOADYN: true,
          Q_FILEDOWNLOADYN: false,
          USEFLAG: 'Yes',
          DESCRIPTION: '',
          change:true,
        };
        this.gridData.splice(0, 0, data);
      },
      // 삭제버튼
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
      // 저장버튼
      saveBtn(){
        const saveData = this.gridData.filter((x) => x.rowStat !== "N").map((x) => {
            return {
              ...x,
              _ROWSTATUS: this.isNullOrEmpty(x.CREATETIME)?"C":x.rowStat,
              P_FILELOCATION:this.isNullOrEmpty(x.P_UPLOADFILE)?'':'Production/', 
              Q_FILELOCATION:this.isNullOrEmpty(x.Q_UPLOADFILE)?'':'Quality/' 
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
        this.gridData.filter(x=> x.P_FILECHANGE).map(x=> {
            fileList.push({
              file: x.P_UPLOADFILE,
              fileName: x.P_FILENAME,
              fileLocation: 'Production/',
            });
        });
        this.gridData.filter(x=> x.Q_FILECHANGE).map(x=> {
            fileList.push({
              file: x.Q_UPLOADFILE,
              fileName: x.Q_FILENAME,
              fileLocation: 'Quality/',
            });
        });

        if (saveData.length > 0) {
          if(this.mesFileUpload(fileList)){
              const res = this.mesPost({
              apiKey: "mes/common/manage",
              messagename: "TxnFocusControlDocument",
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
      // UNDO 버튼
      undoBtn(){
        this.gridData = this.gridOriData;
      },
      // GRID ROW 클릭
      onRowClick(event) {
        const selectedIdx = event.dataItem.idx;
        this.gridData = this.gridData.map(item => {
            return {
            ...item,
            selected: item.idx === selectedIdx ? !item.selected : item.selected,
            };
        });
      },
      // 맨앞 CHECKBOX 클릭
      onSelectionchange(event) {
        event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
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
  
        data[idx] = {...data[idx], [name]: e.value}
        if(data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
        }
        if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
          data[idx].rowStat = "N";
        }

        this.gridData = data;
      },
      // 업로드 파일 선택 시
      fileChange(e, field, dataItem){
        
        if(field==="P_FILEUPLOAD"){
          dataItem.P_FILENAME = this.fileTimestamp(e.target.files[0].name);
          dataItem.P_FILECHANGE = true;
          dataItem.P_UPLOADFILE = e.target.files[0];
        }else if(field==="Q_FILEUPLOAD"){
          dataItem.Q_FILENAME = this.fileTimestamp(e.target.files[0].name);
          dataItem.Q_FILECHANGE = true;
          dataItem.Q_UPLOADFILE = e.target.files[0];
        }
        dataItem.rowStat = dataItem.rowStat==="C"?"C":"U";
      },
      chkOriginalData(gridData, idx){
        const data = JSON.parse(JSON.stringify(gridData));
        const keys = Object.keys(data[idx]);
        const chkArr = keys.filter(x => {
          return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat"
        });
        return chkArr.length > 0;
      },
      // GRID 버튼 클릭(품번검색, 파일업로드)
      gridButtonClick(e, name, item){
        
        if(name != 'PRODUCTID'){
          let fileLocation = '';
          let fileName = '';
          if(name==='P_FILEDOWNLOAD'){
            fileName = item.P_FILENAME;
            fileLocation = item.P_FILELOCATION;
          }else if(name==="Q_FILEDOWNLOAD"){
            fileName = item.Q_FILENAME;
            fileLocation = item.Q_FILELOCATION;
          }
          window.open("/api/mes/common/fileDownload?fileName="+fileName+"&fileLocation="+fileLocation);  
        }else{
          this.searchIdx = item.idx;
          this.SelectProductModalVisible = true;
        }
      },
      // 팝업에서 품번 선택시
      selectedRow(select){
        this.gridData = this.gridData.map(x => {
            return {
                ...x,
                PRODUCTID: x.idx === this.searchIdx ? select.PRODUCTID : x.PRODUCTID,
                PRODUCTNAME: x.idx === this.searchIdx ? select.PRODUCTNAME : x.PRODUCTNAME,
            };
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
  