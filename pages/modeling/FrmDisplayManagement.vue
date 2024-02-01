<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li> <!-- 기준정보 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00727") }}</li> <!-- DISPLAY 현황판 관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">           
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t("MES_CommLang.MES_CommLang_00277") }} <!-- 조회 -->
                </kbutton>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="5" :lg="5" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="8" align="left">
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00720") }}</CardTitle> <!-- 기본정보 -->
              </v-col>
              <v-col cols="4" no-gutters align="right">
                <kbutton :theme-color="'primary'" :size="'small'" :disabled="disableSaveBtn" :icon="'save'" @click="saveBtnMaster">{{
                  $t("MES_CommLang.MES_CommLang_00414") }}</kbutton> <!--저장-->
               <kbutton :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn"
                  >{{ $t("MES_CommLang.MES_CommLang_00411") }}</kbutton> <!--추가 -->
              </v-col>
            </v-row>
            <div ref="divWrapper" style="height: calc(100% - 33px)">
              <KendoGrid
                ref="MasterGrid" 
                :gridHeight="gridHeight"
                :gridItems="gridData" 
                :sortable="true"
                :edit-field="'inEdit'"
                :columns="listParam.gridHeader" 
                :resizable="true"
                :selected-field="selectedField" 
                :gridPageData="gridPageData"
                :reSetPage="this.reSetPage" 
                @gridButtonClick="gridButtonClick"
                @gridrowclick="MasterGridRowClick"
               />
            </div>
          </CardBody>
        </Card> <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00765") }}</CardTitle>
      </v-col>
      <v-col :sm="7" :lg="7" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="girdCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="1" align="left">
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00765") }}</CardTitle> <!-- 기본정보 -->
              </v-col>
              <v-col cols="11" style="margin-bottom: 10px;" align="right">
                <kbutton :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtnDetail">{{
                  $t("MES_CommLang.MES_CommLang_00414") }}</kbutton> <!-- 저장 -->
                <kbutton :theme-color="'secondary'" :size="'small'"  :icon="'add'" :disabled="disableAddBtn"  @click="addBtnDetail" 
                  >{{ $t("MES_CommLang.MES_CommLang_00411") }}</kbutton> <!-- 추가 -->
                <kbutton :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBtn">{{
                  $t("MES_CommLang.MES_CommLang_00412") }}</kbutton> <!-- 삭제 -->
                <kbutton :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO
                </kbutton>
              </v-col>
            </v-row>
            <div ref="divWrapper2" style="height: calc(100% - 34px)">
              <KendoGrid 
              ref="DetailGrid" 
                :gridHeight="gridHeight" 
                :gridItems="gridDataFile" 
                :sortable="true"
                :edit-field="'inEdit'" 
                :columns="headerParam.gridHeader" 
                :resizable="true"
                :selected-field="selectedField"
                :gridPageData="gridPageDataMaster"
                :reSetPage="this.reSetPage" 
                :checkHeaderArr="headerParam.checkBox"
                :gridDropDownList="headerParam.enumComboBox"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange" 
                @headerselectionchange="onHeaderSelectionChange" 
                @selectionchange="onSelectionchange" 
                @gridrowclick="onRowClick" 
                @pageChangeEvent="pageMasterChangeEvent"
                @fileChange="fileChange"
                @gridButtonClick="downloadBtn"
                />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />

    <!-- 공정별 가능 설비 그리드 PROCESSID 검색 버튼 클릭 Modal-->
    <SelectProcessModal
    ref="SelectProcessModal"
    v-if="SelectProcessModalVisible"
    :visibleDialog="SelectProcessModalVisible"
    :title="processModalTitle"
    :selected-field="selectedField"
    :masterData="masterData"
    @visibleDialog="val => (SelectProcessModalVisible = val)"
    @selectedRow="selectedRow"
    />

    <!-- 공정별 가능 설비 그리드 EQUIPMENTID 검색 버튼 클릭 Modal-->
    <SelectEquipmentModal
    ref="SelectEquipmentModal"
    v-if="SelectEquipmentModalVisible"
    :visibleDialog="SelectEquipmentModalVisible"
    :title="equipmentModalTitle"
    :selected-field="selectedField"
    :initData="initData"
    :masterData="masterData"
    @visibleDialog="val => (SelectEquipmentModalVisible = val)"
    @selectedRow="selectedRowEquipment"
    />

  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import SelectProcessModal from '@/components/frmDisplayManagement/SelectProcessModal.vue';
import SelectEquipmentModal from '@/components/frmDisplayManagement/SelectEquipmentModal.vue';

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit('setActiveMenuInfo', myState.menuData[myMenuId]);
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
    InputText,
    MesSelectBox,
    Utility,
    Card,
    Button,
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    SelectProcessModal,
    SelectEquipmentModal,
  },
  data() {
    return {
      columns: [],
      gridHeight: '100px',
      selectedField: 'selected',
      //공정별가능설비 데이터
      gridData: [],
      gridOriData: [],
      //파일 데이터
      gridDataFile: [],
      gridOriDataFile: [],
      //페이징
      gridPageDataMaster: {},
      gridLastModIdx: null,
      gridPageData: {},
      disableAddBtn: true,
      disableSaveBtn: false,
      PROCESSID:'',
      equipmentid:'',
      PROCESSNAME:'',
      EQUIPMENTNAME:'',
      selectedUploadFile:'',

      headerParam: {
        gridid: 'dgvDisplayDetail', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        USEFLAG:'',
        PUBLICFLAG:'',
        DAYFLAG: '',
        DESCRIPTION:'',
        ORIGINALFILEPATH:'',
        PROCESSID:'',
        EQUIPMENTID:'',
        checkHeaderArr: ["USEFLAG"],
        checkHeaderArr: ["PUBLICFLAG"],
        checkHeaderArr: ["DAYFLAG"],
        checkBox: [],
        gridHeader: [],
        enumComboBox:[], 
        xOverflowYn: true,
        imageList:[],
      },

      listParam: {
        gridid: 'dgvDisplayMaster',
        rowStat: '',
        noFirstCheck: true,
        gridHeader: [],
        btnClickIdx:'',
        xOverflowYn: true,
        changeCell: [
          {
            cellName: 'PROCESSID',
            upperCell: '',
            condition: false,
            dataItem: [],
          },
          {
            cellName: 'EQUIPMENTID',
            upperCell:'',
            condition: false,
            dataItem: [],
          },
        ],
      },
      SelectProcessModalVisible: false,
      SelectEquipmentModalVisible: false,
      reSetPage: false,
      processModalTitle:'',
      equipmentModalTitle:'',
      selectedProcessId:'',
      selectedEquipmentId:'',
      initData:{},
      masterData:[],
      OriginalUploadYN: true
    };
  },
  created() { },
  async mounted() {
    this.processModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00721');      // 공정ID선택  
    this.equipmentModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00427');   // 가능설비 목록
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper2);
    await this.getHeaderMulti(this.listParam, this.$refs.divWrapper);
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    //공정별 가능설비 목록
    this.getGridData();
  },
  computed: {
    userInfo: (state) => state.$store.$auth.$state.user,
    areAllSelected() {
      return (
        this.gridDataFile.findIndex(x => x.checked === false) === -1 &&
        this.gridDataFile.length !== 0
      );
    },
  },
  watch: {},
  methods: {

    // 공정별 가능 설비 RowClick
    MasterGridRowClick(event) {
      this.selectedProcessId = event.dataItem.PROCESSID;
      this.selectedEquipmentId = event.dataItem.EQUIPMENTID;

      //RowClick한 데이터만 seleted = true
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      const data = JSON.parse(JSON.stringify(this.gridData));
      data.map(x => {
        return {
          ...x,
          selected : x.idx === event.dataItem.idx && x.PROCESSID === event.dataItem.PROCESSID && x.EQUIPMENTID === event.dataItem.EQUIPMENTID ? x.selected = true : x. selected = false,
        }
      });
      this.gridData = data;
      this.getGridDetailData(this.selectedProcessId, this.selectedEquipmentId);
    },

    //파일 목록 리스트 데이터 그리드 가져오기
    async getGridDetailData(result, result2) {
      this.gridOriDataFile = [];
      this.gridDataFile = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetDisplayDetail',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PROCESSID: result,
          EQUIPMENTID: result2,
        },
      }).then(res => {
        const data = res.map((x, idx) => {

          if(x.USEFLAG == 'Y'){
            x.USEFLAG = "Yes";
          }
          if(x.PUBLICFLAG == 'Y'){
            x.PUBLICFLAG = "Yes";
          }
          if(x.DAYFLAG == 'Y'){
            x.DAYFLAG = "Yes";
          }
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true, 
            // 파일 업로드시 저장되는 경로 지정
            FILELOCATION: '',
            UPLOADFILE: '',
            FILECHANGE:false,
            LocalDownYN: !this.isNullOrEmpty(x.FILEPATH)?true:false,
            OriginalDownYN: !this.isNullOrEmpty(x.ORIGINALFILEPATH)?true:false,
            OriginalUploadYN: true,
          }; 
        });
        this.$nuxt.$emit('iccReset');
        this.gridOriDataFile = data;
        this.gridDataFile = data;
      });
    },



    //공정별 가능설비목록 그리드 데이터 가져오기
    async getGridData() {
      this.disableAddBtn = true;
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetDisplayMaster',
        sendParam: {
          PLANTID: this.$auth.$state.user.plantId,
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
            changeCellType: 'button'
          };
        });

        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
        if(data.length > 0){
          this.gridData[0].selected = true;
          this.getGridDetailData(this.gridData[0].PROCESSID, this.gridData[0].EQUIPMENTID);
          this.disableAddBtn = false;
          this.disableSaveBtn = false;
          this.selectedProcessId = this.gridData[0].PROCESSID;
          this.selectedEquipmentId = this.gridData[0].EQUIPMENTID;
        }else{
          this.getGridDetailData();
        }
      });
    },


    //파일 목록 RowClick
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridDataFile = this.gridDataFile.map(x => {
        return {
          ...x,
          selected: x.idx === selectedIdx ? !x.selected : x.selected,
        };
      });
      this.selected = event.dataItem;
    },
    // 조회
    searchBtn() {
      this.reSetPage = true;
      this.getGridData();
      this.getGridDetailData();
    },

    // 마스터 저장버튼
    saveBtnMaster() {
        const saveDataMaster = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          if(x.USEFLAG == "Yes"){
            x.USEFLAG = 'Y'
          }else{
            x.USEFLAG = 'N'
          }
          if(x.PUBLICFLAG == "Yes"){
            x.PUBLICFLAG = 'Y'
          }else{
            x.PUBLICFLAG = 'N'
          }
          if(x.DAYFLAG == "Yes"){
            x.DAYFLAG = 'Y'
          }else{
            x.DAYFLAG = 'N'
          }
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });   

        const dataDetail = this.gridDataFile
        .filter(x => x.rowStat == 'C')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

        if(dataDetail.length > 0){
        this.$refs['confirmPop'].title = "Check";
        this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00267')
        this.$refs['confirmPop'].callBack =()=> {
          this.saveBtnDetail();
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
      } else {        
        const validate = this.mesValidation(this.listParam.gridHeader, this.gridData);
        if (!validate.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); // 알림
          return;
        }      

        if(saveDataMaster.length == 0){
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
          return;
        }
        if (saveDataMaster.length > 0) {
          const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnDisplayManagement',
          sendParam: saveDataMaster,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getGridData();
              this.getGridDetailData();
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                'result :' + result.message
              );
            }
          });
        });
    }
      }
    },

    // 디테일 저장
    saveBtnDetail() {
        // 디테일 데이터
        const saveDataDetail = this.gridDataFile
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          if(x.USEFLAG == "Yes"){
            x.USEFLAG = 'Y'
          }else{
            x.USEFLAG = 'N'
          }
          if(x.PUBLICFLAG == "Yes"){
            x.PUBLICFLAG = 'Y'
          }else{
            x.PUBLICFLAG = 'N'
          }
          if(x.DAYFLAG == "Yes"){
            x.DAYFLAG = 'Y'
          }else{
            x.DAYFLAG = 'N'
          }
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });       
                 
      const fileList = [];
      this.gridDataFile.filter(x=> !this.isNullOrEmpty(x.FILEPATH) && x.FILECHANGE).map((x,idx)=>{
        fileList.push({
          file: x.UPLOADFILE,
          fileName: x.FILEPATH.substring(25,),
          fileLocation: x.FILELOCATION,
        })
      })

        const validateDetail = this.mesValidation(this.headerParam.gridHeader, this.gridDataFile);
        if (!validateDetail.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validateDetail.msg); // 알림
          return;
        } 
     console.log("fileList", fileList)
      if (saveDataDetail.length > 0) {
        if(this.mesFileUpload(fileList)){
          const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnDisplayManagement',
          sendParam: saveDataDetail,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getGridData();
              this.getGridDetailData();
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                'result :' + result.message
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
        return;
      }
    }  
      else {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* 알림, 저장할 데이터가 없습니다. */
        return;
      }
    },

    //마스터 추가버튼
    addBtn() {
      this.selectedProcessId = "";
      this.selectedEquipmentId = "";
      this.$refs.MasterGrid.skip = 0;
      this.disableAddBtn = false;      
      const dataItemMaster = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        PROCESSID:'',
        SEQUENCE: 1,
        idx: this.gridData.length,
        change:'button', // 검색 버튼 나오도록
        PROCESSNAME:'',
        EQUIPMENTID:'',
        EQUIPMENTNAME:'',
      }
      const detailLength = this.gridDataFile.filter(x => (x.rowStat != 'N'))
      if(detailLength != 0){
        this.$refs['confirmPop'].title = "info";
        this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00141');
        this.$refs['confirmPop'].callBack = ()=> {
          this.gridData.forEach(x => (x.selected = false));
          dataItemMaster[this.selectedField] = true;
          this.getGridDetailData();
          this.gridData.splice(0, 0, dataItemMaster);
          this.$nuxt.$emit('iccReset'); 
        };
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        
      } else {
        this.gridData.forEach(x => (x.selected = false));
        dataItemMaster[this.selectedField] = true;
        this.getGridDetailData();
        this.gridData.splice(0, 0, dataItemMaster);
        this.$nuxt.$emit('iccReset');     
      }   
    },

    // 디테일 추가 버튼
    addBtnDetail() {
      this.$refs.DetailGrid.skip = 0;
      let index = 0;
      let cSequence = 1;
      if(this.gridDataFile.length != 0){
         index = this.gridDataFile.length-1;
         cSequence = (Number) (this.gridDataFile[index].SEQUENCE) + 1;
      }
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        PROCESSID:   this.selectedProcessId,
        EQUIPMENTID: this.selectedEquipmentId,
        DISPLAYTYPE: '',
        FILEPATH : '',
        UPLOADFILE:'',
        SEQUENCE: cSequence,
        ORIGINALFILEPATH:'',
        DISPLAYPROCESSNAME:'',
        DISPLAYEQUIPMENTNAME:'',
        idx: this.gridDataFile.length,
        //파일 업로드시 저장되는 경로
        FILELOCATION: "\\\\172.31.15.21\\스마트 공장 Track A\\프로젝트관리\\98. 기타\\09.개인폴더\\이홍상\\TEST",
        FILECHANGE:false,
        LocalDownYN:false,
        OriginalUploadYN: true,
      };
      
      const checkNewRowLength = this.gridData
        .filter(x => x.rowStat == 'C')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });
        if(checkNewRowLength.length > 1){
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'), // 알림
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00265')   // 공정별 가능설비를 우선 등록해주세요
          );
          return;
        }
      this.gridDataFile.splice(this.gridDataFile.length, 0, dataItem);

      this.$nuxt.$emit('iccReset');
    },

    

    //공정별 가능설비 추가시 검색 버튼 클릭
    gridButtonClick(e,field, dataItem){
      this.masterData = this.gridData;
      this.btnClickIdx = dataItem.idx;
      this.selectedProcessId =  this.gridData.filter(x => x.idx == this.btnClickIdx)[0].PROCESSID
      this.selectedEquipmentId = this.gridData.filter(x => x.idx == this.btnClickIdx)[0].EQUIPMENTID
      this.initData = this.gridData.filter(x => x.idx == this.btnClickIdx);
      if(field === 'PROCESSID'){
        this.SelectProcessModalVisible = true;
      }else if(field === 'EQUIPMENTID'){
        if(this.selectedProcessId == "" || this.selectedProcessId == null){
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00262')   // 공정코드를 먼저 선택해주세요
          );
          return;
        }else if(dataItem.PROCESSID.lastIndexOf("Monitoring") == 0 || dataItem.PROCESSID.lastIndexOf(this.$i18n.t('MES_CommLang.MES_CommLang_00723')) == 0){
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00263')    //모니터링 및 지원라인 공정은 설비를 선택할 수 없습니다.
            );
            return;
        }
        this.SelectEquipmentModalVisible = true;
      }
    },
    
     // 검색버튼 선택
     selectedRow(row) {
      this.selectedProcessId = row.PROCESSID;
      this.gridData = this.gridData
      .map(item => {
        return {
          ...item,
          PROCESSID: item.idx === this.btnClickIdx ? row.PROCESSID : item.PROCESSID,
          PROCESSNAME:item.idx === this.btnClickIdx ? row.PROCESSNAME : item.PROCESSNAME,
          EQUIPMENTID: item.idx === this.btnClickIdx ? "" : item.EQUIPMENTID,
          EQUIPMENTNAME: item.idx === this.btnClickIdx ? "" : item.EQUIPMENTNAME,
        };
      })
      this.gridDataFile = this.gridDataFile.map(item => {
        return {
          ...item,
          PROCESSID: this.gridData[0].PROCESSID,
          PROCESSNAME: this.gridData[0].PROCESSNAME,
          
        };
      })

      if(row.PROCESSID.lastIndexOf("Monitoring") == 0 || row.PROCESSID.lastIndexOf(this.$i18n.t('MES_CommLang.MES_CommLang_00723')) == 0){
        this.selectedEquipmentId = "NONE";
        this.gridData = this.gridData
      .map(item => {
        return {
          ...item,
          EQUIPMENTID: item.idx === this.btnClickIdx ? "NONE" : item.EQUIPMENTID,
          EQUIPMENTNAME: item.idx === this.btnClickIdx ? "NONE" : item.EQUIPMENTNAME,
        };
      })
      this.gridDataFile = this.gridDataFile.map(item => {
        return {
          ...item,
          PROCESSID: this.gridData[0].PROCESSID,
          EQUIPMENTID: this.gridData[0].EQUIPMENTID,
          
        };
      })
      }
    },

    selectedRowEquipment(row){
      this.selectedEquipmentId = row.EQUIPMENTID
      this.gridData= this.gridData.map(item => {
        return {
          ...item,
          EQUIPMENTID: item.idx === this.btnClickIdx ? row.EQUIPMENTID : item.EQUIPMENTID,
          EQUIPMENTNAME: item.idx === this.btnClickIdx ? row.EQUIPMENTNAME : item.EQUIPMENTNAME,
        };
      });
      this.gridDataFile = this.gridDataFile.map(item => {
        return {
          ...item,
          EQUIPMENTID: this.gridData[0].EQUIPMENTID,
          EQUIPMENTNAME: this.gridData[0].EQUIPMENTNAME,
        };
      });
    },

    async pageChangeEvent(skip=0, take=20) {
      this.gridPageData = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridData();
      this.getGridDetailData();     
    },

    async pageMasterChangeEvent(skip=0, take=20) {
      this.gridPageDataMaster = {
        skip: skip,
        take: take
      }
      this.reSetPage = false;
      this.getGridDetailData();  
      
    },

    //checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridDataFile = this.gridDataFile.map(item => {
        return { ...item, selected: checked };
      });
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridDataFile));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      const file = this.gridDataFile[idx].UPLOADFILE;

      data.forEach((item, index) => {
        if ( this.gridDataFile[index].UPLOADFILE ) {
          item.UPLOADFILE = this.gridDataFile[index].UPLOADFILE; 
        }
      });
      /**************************** 시간 : 분 형식 시작 *****************/
      if(e.field === 'STARTTIME' || e.field === 'ENDTIME'){
        const hour = [];
        const min = [];
        e.value = e.value.replace(/[^0-9]/gi, '');
        if(e.value.length > 4){
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'),  this.$i18n.t('MES_MsgLang.MES_MsgLang_00266'));
        }
        for(let i = 2; i <= 3; i++ ){
          min[i-2] = e.value[i];
        }
        for(let i = 0; i <= 1; i++){
          hour[i] = e.value[i];

          if(min[i] == null){
            min[i] = '0';
          }
          if(hour[i] == null){
            hour[i] = '0'
          }
        }  
        e.value = hour[0] + hour[1] + ":" + min[0]+min[1]
      }
  /**************************** 시간 : 분 형식 끝 *****************/
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriDataFile, idx)
      ) {
        data[idx].rowStat = 'N';
      }
      data[idx].UPLOADFILE = file;
      this.gridDataFile = data;
    },
    selectProGroup(event) {
      this.value = event.value;
    },

    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },

    comboChange(nm, val) {
      this[nm] = val;
    },

   //그리드 인풋 제외 데이터 변경시
   rowDdChange(e, name, dataItem) { 
      const idx = this.gridDataFile.findIndex((x) => x.idx === dataItem.idx);
      const Data = JSON.parse(JSON.stringify(this.gridDataFile));

      Data.forEach((item, index) => {
        if ( this.gridDataFile[index].UPLOADFILE ) {
          item.UPLOADFILE = this.gridDataFile[index].UPLOADFILE;
        }
      });
      if (name === 'USEFLAG') {
          e.value = e.value ? 'Yes' : 'No';
        }
      if(name === 'PUBLICFLAG'){
        e.value = e.value ? 'Yes' : 'No';
      }
      if(name === 'DAYFLAG'){
        e.value = e.value ? 'Yes' : 'No';
      }

      if (this.gridDataFile)
        Data[idx] = { ...Data[idx], [name]: e.value };

      if (Data[idx].rowStat === "N") {
        Data[idx].rowStat = 'U';
      }

      if (
        Data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.headerParam.gridHeader, Data, this.gridOriDataFile, idx)
      ) {
        Data[idx].rowStat = 'N';
      }

      this.gridDataFile = Data;
    
    },

    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridDataFile));

      data.forEach((item, index) => {
        if ( this.gridDataFile[index].UPLOADFILE ) {
          item.UPLOADFILE = this.gridDataFile[index].UPLOADFILE;
        }
      });

      this.gridDataFile = data
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
      this.gridDataFile = this.gridOriDataFile.filter((x) => x.newRow !== true);
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.gridData.forEach(x => (x.selected = false));
      if(this.gridData.length == 0){
        this.disableAddBtn = true;
      }
      this.gridData[0].selected = true;
      this.getGridDetailData(this.gridData[0].PROCESSID, this.gridData[0].EQUIPMENTID)
      this.$nuxt.$emit('iccReset');
    },

    fileChange(e, field, dataItem){
          // const currentTime = Date.now();
          const fileName = e.target.files[0].name.substring(0,e.target.files[0].name.lastIndexOf("."));
          const ext = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".")+1);

          this.gridDataFile= this.gridDataFile.map(item => {
        return {
          ...item,
          ORIGINALFILEPATH: item.idx === dataItem.idx ? "/프로젝트관리/98. 기타/09.개인폴더/이홍상/TEST/".concat(fileName.concat(".").concat(ext)) : item.ORIGINALFILEPATH,
          FILEPATH: item.idx === dataItem.idx ? "D:\\DYPOWER\\FILE\\DYP_IMAGE\\".concat(fileName.concat(".").concat(ext)) : item.FILEPATH,
          UPLOADFILE: item.idx === dataItem.idx ? e.target.files[0] : item.UPLOADFILE,
          FILECHANGE : item.idx === dataItem.idx ? true : item.FILECHANGE,
          rowStat : (item.idx === dataItem.idx) && dataItem.rowStat === 'N' ? 'U' : item.rowStat,
          SEQUENCE: item.idx === dataItem.idx ? dataItem.SEQUENCE : item.SEQUENCE ,
          FILELOCATION: item.idx === dataItem.idx ? "\\\\172.31.15.21\\스마트 공장 Track A\\프로젝트관리\\98. 기타\\09.개인폴더\\이홍상\\TEST" : item.FILELOCATION,
        };
      });
    },

    downloadBtn(e, field, item){
      const filename = item.FILEPATH.substring(26,);  
        item.FILELOCATION = "///172.31.15.21/스마트 공장 Track A" + item.ORIGINALFILEPATH.substring(0,31)
        window.open("/api/mes/common/fileDownload?fileName="+filename+"&fileLocation="+item.FILELOCATION);
    },


    },
  }
const defaultData = {};
</script>
<style>
.dropdown-menu {
  min-width: 1rem !important;
}
</style>
