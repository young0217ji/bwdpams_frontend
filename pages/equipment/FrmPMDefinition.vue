<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00600") }}</li> <!--예방보전 항목등록-->
    </ol>
    <!-- 검색 카드 부분 시작-->
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00037") }}</label> <!-- PM코드 -->
                    <InputText ref="pmCodeId" :boxWidth="'90%'" :dataNm="'pmCodeId'" :disabled="false"
                      :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00598") }}</label> <!--PM코드명-->
                    <InputText ref="pmCodeName" :boxWidth="'90%'" :dataNm="'pmCodeName'" :disabled="false"
                      :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" icon="search" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277")
                }}</Button> <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <!------------------------------------------ 검색 카드 부분 끝--------------------------->

    <v-row ref="contents">
      <v-col :sm="10" :lg="12" :style="{ height: '100%' }">
        <v-row :style="{ height: 'calc(50% - 5px)' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }" no-gutters>
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00597") }}</CardTitle> <!-- 예방보전 항목 -->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn">{{
                      $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                    <Button ref="addBtn" :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="confirmAdd">{{
                      $t("MES_CommLang.MES_CommLang_00411") }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delConfirmMaster">{{
                      $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapperMaster" style="height: calc(100% - 33px);">
                  <KendoGrid ref="pmMaster" :gridHeight="gridHeight" :gridItems="gridDataMaster" :sortable="true"
                    :columns="PMCodeDefinitionHeaderParam.gridHeader"
                    :gridDropDownList="PMCodeDefinitionHeaderParam.enumComboBox" :resizable="false" :edit-field="'inEdit'"
                    :isPaging="true" :selected-field="selectedField" @gridrowclick="PMCodeDefinitionOnRowClick"
                    @griditemchange="griditemchangeMaster" @gridddchang="rowDdChangeMaster" />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row :style="{ margin: '10px 0 0 0', height: 'calc(50% - 5px)' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00599") }}</CardTitle> <!-- 점검항목 상세 -->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button ref="addBtnDetail" :theme-color="'secondary'" :size="'small'" :icon="'add'"
                      @click="addBtnDetail" :disabled="disableAddBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delConfirmDetail">{{
                      $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtnDetail">UNDO</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapperDetail" style="height: calc(100% - 33px);">
                  <KendoGrid ref="pmDetail" :gridHeight="gridHeight" :gridItems="gridDataDetail" :sortable="true"
                    :columns="PMCodeDetailHeaderParam.gridHeader" :resizable="false" :edit-field="'inEdit'"
                    :isPaging="true" :selected-field="selectedField" @gridrowclick="PMCodeDetailOnRowClick"
                    @gridddchang="rowDdChangeDetail" @griditemchange="griditemchangeDetail" />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
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
    menuId: myMenuId,
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
  },
  data() {
    return {
      gridHeight: '100px',
      columns: [],
      gridDataMaster: [], // 마스터
      GridOriMasterData: [],    // 마스터 Original Data
      gridDataDetail: [], // Detail
      GridOriDetailData: [],   // Detail Original Data
      selectedField: 'selected',
      gridHeader: [],
      reSetPage: false,
      rowInfo: {},
      headerParam: {},
      line: [],
      workCenter: [],
      pmCodeId: '', // 검색 PM 코드 text
      pmCodeName: '', // 검색 PM 명 text
      disableAddBtn: true,
      selectedPmcodeId: '',
      selectedCheckItem: '',
      sparePartModalVisible: false,


      PMCodeDefinitionHeaderParam: {
        gridid: "dgvPMMaster", // 그리드 ID
        gridHeader: [],
        enumComboBox: [],
        rowStat: '',
        noFirstCheck: true,
        noRowstat: false,
      },
      PMCodeDetailHeaderParam: {
        gridid: "dgvPMDetail", // 그리드 ID
        rowstat: '',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: false

      },
    };
  },
  created() {
  },
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(this.PMCodeDefinitionHeaderParam, this.$refs.divWrapperMaster);
    await this.getHeaderMulti(this.PMCodeDetailHeaderParam, this.$refs.divWrapperDetail);
    await this.getPMCodeDefinitionGridData();
  },
  computed: {
    areAllSelected() {
      return this.gridDataMaster.findIndex((x) => x.checked === false) === -1 && this.gridDataMaster.length !== 0
    },
  },
  watch: {
  },
  methods: {

    // PM목록 그리드 데이터 가져오기
    async getPMCodeDefinitionGridData() {
      this.disableAddBtn = true;
      this.GridOriMasterData = [];
      this.gridDataMaster = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPmCodeDefinition',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PMCODEID: this.pmCodeId, // 검색 input
          PMCODENAME: this.pmCodeName, // 검색 input
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
        this.GridOriMasterData = data;
        this.gridDataMaster = data;
        this.GridOriMasterData = JSON.parse(JSON.stringify(data));
        if(data.length > 0){
          this.gridDataMaster[0].selected = true;
          this.getPMCodeDetailData(this.gridDataMaster[0].PMCODEID);
        }else{
          this.getPMCodeDetailData("");
        }
      });
    },

    // 점검항목 그리드 데이터 불러오기
    async getPMCodeDetailData(result) {
      this.GridOriDetailData = [];
      this.gridDataDetail = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetPmCodeDetail',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PMCODEID: result,
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
        this.GridOriDetailData = data;
        this.gridDataDetail = data;
      });
    },

    // 조회
    async searchBtn() {
      this.getPMCodeDefinitionGridData();
    },

    // 저장
    async saveBtn() {

      // PM목록 데이터
      const saveDataMaster = this.gridDataMaster
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          }
        });

      // 점검항목 데이터
      const saveDataDetail = this.gridDataDetail
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          }
        });

      const validateMaster = this.mesValidation(
        this.PMCodeDefinitionHeaderParam.gridHeader,
        this.gridDataMaster,
      );

      const validateDetail = this.mesValidation(
        this.PMCodeDetailHeaderParam.gridHeader,
        this.gridDataDetail
      );

      if (!validateMaster.isValidate) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validateMaster.msg); /* 알림 */
        return;
      }
      if (!validateDetail.isValidate) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validateDetail.msg); /* 알림 */
        return;
      }
      for (let i = 0; i < saveDataMaster.length; i++) {

        if (saveDataMaster[i].PMCODEID == null || saveDataMaster[i].PMCODEID == '') {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00236')); /* 알림, PM코드는 필수 입력 값 입니다. */
        return;
      }
      if(saveDataMaster[i].PMCYCLETYPE != "None" && saveDataMaster[i].PMCYCLEVALUE == "" || saveDataMaster[i].PMCYCLEVALUE == null){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00274')); /* 알림, 점검주기를 입력해주세요 */      
          return;
        }
        
      }
      if (saveDataMaster.length > 0) {
        const res = await this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnPMCodeDefinition',
          sendParam: saveDataMaster,
        });
        if (res?.returncode == '0') {
          if (saveDataDetail.length > 0) {
            const resDetail = await this.mesPost({
              apiKey: 'mes/common/manage',
              messagename: 'TxnPMCodeDetail',
              sendParam: saveDataDetail,
            });

            if (resDetail?.returncode == '0') {
              this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* ('저장', '저장되었습니다.') */
            } else {
              this.openAlert('error', this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')); /* ('오류가 발생했습니다.') */
            }
          }
          this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* ('저장', '저장되었습니다.') */
        } else {
          this.openAlert('error', this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')); /* ('오류가 발생했습니다.') */
        }
      } else if (saveDataDetail.length > 0) {
        const resDetail = await this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnPMCodeDetail',
          sendParam: saveDataDetail,
        });

        if (resDetail?.returncode == '0') {
          this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* ('저장', '저장되었습니다.') */
        } else {
          this.openAlert('error', this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')); /* ('오류가 발생했습니다.') */
        }
      }
      else {
        this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* ('저장', '저장할 데이터가 존재하지 않습니다.') */
      }
      this.getPMCodeDefinitionGridData();
      this.getPMCodeDetailData(this.selectedPmcodeId);
    },

    openAlert(title, message, visiable = true, width = "350px") {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },

    //PM목록 그리드 로우 클릭
    PMCodeDefinitionOnRowClick(event) {
      this.selectedPmcodeId = event.dataItem.PMCODEID;
      this.disableAddBtn = false;
      this.gridDataMaster.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.getPMCodeDetailData(this.selectedPmcodeId);
    },

    // 점검항목 목록 그리드 로우 클릭
    PMCodeDetailOnRowClick(event) {
      this.gridDataDetail.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },

    searchInput(nm, val) {
      this[nm] = val;
    },

    //추가 버튼 클릭
    confirmAdd() {
      const data = this.gridDataMaster.filter(x => (x.selected == true && x.rowStat == "D") || x.rowStat == "C");
      const detailData = this.gridDataDetail.filter(x => (x.selected == true && x.rowStat == "D") || x.rowStat == "C");
      const len = data.length + detailData.length;
      if(len > 0) {
        this.$refs['confirmPop'].title = "info";
        this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00141');
        this.$refs['confirmPop'].callBack = ()=> {
          this.gridDataMaster.splice(0, data.filter(x => x.rowStat == "C").length);
          this.addBtn();
        };
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        
      } else {
        this.addBtn();
      }
    },


    //추가 버튼 기능(PM목록)
    addBtn() {
      this.$refs.pmMaster.skip = 0;
      const dataItemMaster = {
        inEdit: true,
        newRow: true,
        selected: false,
        rowStat: 'C',
        PLANTID: this.$auth.$state.user.plantId,
        PMCODEID: '',
        PMCODENAME: '',
        PMCYCLETYPE: '',
        PMCYCLEVALUE: '',
        DESCRIPTION: '',
        idx: this.gridDataMaster.length,
      };
      // 추가 버튼 클릭시 자동 selected
      this.disableAddBtn = false;
      this.gridDataMaster.forEach(x => (x.selected = false));
      dataItemMaster[this.selectedField] = true;
      this.getPMCodeDetailData("");

      this.gridDataMaster.splice(0, 0, dataItemMaster);
      this.$nuxt.$emit('iccReset');
    },

    //추가 버튼 클릭(점검항목)
    addBtnDetail() {

      const addData = this.gridDataMaster.filter(x => x.selected == true);
      const PMCodeId = addData[0].PMCODEID;
      if(PMCodeId == ""){
        this.getPMCodeDetailData("");
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00074')); /* 알림, 상단 그리드의 GridID 항목을 입력 후 추가하세요.  */
        return;
      }
      
      this.$refs.pmDetail.skip = 0;
      const dataItemDetail = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        PMCODEID: this.selectedPmcodeId,
        CHECKITEM: '',
        MEASURETOOL: '',
        UPPERLIMIT: '',
        LOWERLIMIT: '',
        DESCRIPTION: '',
        idx: this.gridDataDetail.length,
      };
      this.gridDataDetail.splice(0, 0, dataItemDetail);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    delConfirmMaster() {
      const delData = this.gridDataMaster
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
          selectedRow = delData.map(x => x.PMCODEID);
          this.$refs[
            'confirmPop'
          ].message = this.$i18n.t('MES_CommLang.MES_CommLang_00037') + '(' + selectedRow + ') : ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제 하시겠습니까? */
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtnMaster;

      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00409'), //확인
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')//선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.
        );
        return;
      }
    },
    //삭제
    delBtnMaster() {
      const data = JSON.parse(JSON.stringify(this.gridDataMaster));
      this.gridDataMaster = data
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
        
        this.gridDataDetail = [];a
    },



    //삭제버튼(Detail)
    delConfirmDetail() {
      const delData = this.gridDataDetail
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
          selectedRow = delData.map(x => x.CHECKITEM);
          this.$refs[
            'confirmPop'
          ].message = this.$i18n.t('MES_CommLang.MES_CommLang_00599') + '(' + selectedRow + ') : ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제 하시겠습니까? */
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtnDetail;
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00409'), //확인
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')//선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.
        );
        return;
      }
    },

    //삭제(Detail)
    delBtnDetail() {
      const data = JSON.parse(JSON.stringify(this.gridDataDetail));
      this.gridDataDetail = data
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
      this.gridDataMaster = this.GridOriMasterData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
      this.undoBtnDetail();
    },


    //unbo 버튼 클릭(detail)
    undoBtnDetail() {
      this.gridDataDetail = this.GridOriDetailData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
    },


    //그리드 인풋 제외 데이터 변경시(Master)
    rowDdChangeMaster(e, name, dataItemMaster) {
      const idx = this.gridDataMaster.findIndex((x) => x.idx === dataItemMaster.idx);
      const rowData = JSON.parse(JSON.stringify(this.gridDataMaster));
      rowData[idx] = { ...rowData[idx], [name]: e.value };
      if (rowData[idx].rowStat === 'C') {
        const rowDataDetail = JSON.parse(JSON.stringify(this.gridDataDetail));
        rowDataDetail.filter(x => x.rowStat === 'C')
          .map(x => {
            return {
              ...x,
              PMCODEID: x.PMCODEID = rowData[idx].PMCODEID,
            }
          });
        this.gridDataDetail = rowDataDetail;
        this.selectedPmcodeId = rowData[idx].PMCODEID;
      }


      if (rowData[idx].rowStat === 'N') {
        rowData[idx].rowStat = 'U';
      }
      if (
        rowData[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.PMCodeDefinitionHeaderParam.gridHeader, rowData, this.GridOriMasterData, idx)
      ) {
        rowData[idx].rowStat = 'N';
      }

      this.gridDataMaster = rowData;
      
    },

    //그리드 인풋 제외 데이터 변경시(Detail)
    rowDdChangeDetail(e, name, dataItemDetail) {
      const idx = this.gridDataMaster.findIndex((x) => x.idx === dataItemDetail.idx);
      const rowData = JSON.parse(JSON.stringify(this.gridDataDetail));

      rowData[idx] = { ...rowData[idx], [name]: e.value };
      if (rowData[idx].rowStat === 'N') {
        rowData[idx].rowStat = 'U';
      }
      if (
        rowData[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.PMCodeDefinitionHeaderParam.gridHeader, rowData, this.GridOriDetailData, idx)
      ) {
        rowData[idx].rowStat = 'N';
      }

      this.gridDataDetail = rowData;
    },

    //그리드 인풋 데이터 변경시(Master)
    griditemchangeMaster(e) {
      const data = JSON.parse(JSON.stringify(this.gridDataMaster));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.PMCodeDefinitionHeaderParam.gridHeader, data, this.GridOriMasterData, idx)) {

        data[idx].rowStat = "N";
      }

      this.gridDataMaster = data;
    },
    //데이터 원상복구시 "수정" 항목 제거(Master)
    chkOriginalDataMaster(gridDataMaster, idx) {
      const data = JSON.parse(JSON.stringify(gridDataMaster));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.GridOriMasterData[idx][x] && x !== 'rowStat';
      });

      return chkArr.length > 0;
    },


    //그리드 인풋 데이터 변경시(Detail)
    griditemchangeDetail(e) {
      const data = JSON.parse(JSON.stringify(this.gridDataDetail));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.PMCodeDetailHeaderParam.gridHeader, data, this.GridOriDetailData, idx)) {
        data[idx].rowStat = "N";
      }

      this.gridDataDetail = data;
    },
    //데이터 원상복구시 "수정" 항목 제거(Detail)
    chkOriginalDataDetail(gridDataDetail, idx) {
      const data = JSON.parse(JSON.stringify(gridDataDetail));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.GridOriDetailData[idx][x] && x !== 'rowStat';
      });

      return chkArr.length > 0;
    },
  }
};
const defaultData = {
};
</script>
<style lang="scss"></style>