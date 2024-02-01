<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00646") }}</li> <!-- 긴급보전 요청관리 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row ref="searchFilter" no-gutters>
                <v-col :sm="9" :lg="10">
                  <div class="form-group-wrap">
                    <!-- <div class="form-group form-calendar-month">
                        <Button :theme-color="'secondary'" :icon="'arrow-chevron-left'" :class="'btn-form'"
                            @click="leftBtn"></Button>
                        <div class="dp-calendar">
                            <span ref="labelYear" class="i-year" value="">{{ year }}</span>
                            <span class="i-hyphen">-</span>
                            <span ref="labelMonth" class="i-month">{{ month }}</span>
                        </div>
                        <Button :theme-color="'secondary'" :icon="'arrow-chevron-right'" :class="'btn-form'"
                            @click="rightBtn"></Button>
                    </div> -->
                    <div class="form-group">
                      <Label>Line</Label>
                      <DropDownList ref="cmbLine" :style="{ width: '250px' }" :data-items="line" :text-field="'text'"
                        :data-item-key="'id'" :value="value" @change="comboChange">
                      </DropDownList>
                    </div>
                    <div class="form-group" style="margin-left: 5px;">
                      <Label>WorkCenter</Label>
                      <DropDownList ref="cmbWorkCenter" :style="{ width: '200px' }" :data-items="workCenter"
                        :text-field="'text'" :data-item-key="'id'" :value="value2" @change="comboChange2">
                      </DropDownList>
                    </div>
                    <div class="form-group" style="margin-left: -5px;">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00177") }}</label> <!-- 설비코드 -->
                      <InputText ref="equipmentid" :boxWidth="'85%'" :dataNm="'equipmentid'" :disabled="false"
                        :defaultValue="equipmentid" :searchOption="true" :searchFunc="searchBtn"
                        @input-text-set="searchInput" />
                    </div>
                    <div class="form-group" style="margin-left: -50px;">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                      <InputText ref="equipmentname" :boxWidth="'85%'" :dataNm="'equipmentname'" :disabled="false"
                        :defaultValue="equipmentname" :searchOption="true" :searchFunc="searchBtn"
                        @input-text-set="searchInput" />
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
                <KendoGrid ref="equipmentGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                  :columns="equipmentHeaderParam.gridHeader" :resizable="false" :edit-field="'inEdit'" :isPaging="true"
                  :selected-field="selectedField" @gridrowclick="equipmentOnRowClick" />
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :sm="9" :lg="9" :class="'divListWapper'" :style="{ height: '50%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00638") }}</CardTitle> <!-- 긴급보전 요청목록 -->
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" icon="delete" @click="holdBtn">{{ $t("MES_CommLang.MES_CommLang_00475") }}</Button> <!-- 보류 -->
                  <Button :theme-color="'primary'" :size="'small'" icon="delete" @click="rejectBtn">{{ $t("MES_CommLang.MES_CommLang_00647") }}</Button> <!-- 반려 -->
                  <Button :theme-color="'primary'" :size="'small'" icon="save" @click="completeBtn">{{ $t("MES_CommLang.MES_CommLang_00495") }}</Button> <!-- 완료 -->
                </v-col>
              </v-row>
              <div ref="divWrapper2" style="height: calc(100% - 33px);">
                <KendoGrid ref="pmCodeGrid" :gridHeight="gridHeight" :gridItems="gridData2" :sortable="true"
                  :columns="EQMaintenanceHeaderParam.gridHeader"
                  :resizable="true" :edit-field="'inEdit'" :isPaging="true" :selected-field="selectedField"
                  :dateTimePickerList="EQMaintenanceHeaderParam.dateTimePickerList"
                  @gridButtonClick="gridButtonClick" @selectionchange="onSelectionchange" @gridrowclick="requestListOnRowclick"
                  @gridddchang="rowDdChange" @griditemchange="griditemchange" />
              </div>
            </CardBody>
          </Card>
  
          <v-col :style="{ margin: '15px 0 0 0', height: '100%', width: '100%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00648") }}</CardTitle> <!-- 작업 설명 -->
                  </v-col>
                  <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" icon="add" @click="sparePartBtn">{{ $t("MES_CommLang.MES_CommLang_00649") }}</Button> <!-- 사용자재 입력 --> 
                </v-col>
                </v-row>
                <div class="detail-area">
              <div class="left-area">
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00233") }}</label>  <!-- 작업자 -->
                  </div>
                  <div class="area-td area-full">
                    <!-- 3칸 : area-full -->
                    <InputText style="width: 110px;"
                    ref="workeruserid"
                    :searchOption="true"
                    :dataNm="'workeruserid'"
                    :default-value="workeruserid"
                    :boxWidth="'90%'"
                    :readonly="true"
                />
                    
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00650") }}</label> <!-- 요청시간 -->
                  </div>
                  <div class="area-td area-full">
                    <!-- 3칸 : area-full -->
                    <inputText
                      ref="intputRequestDateYYYYMMDD"
                      :dataNm="'intputRequestDateYYYYMMDD'"
                      :readonly="RequestDateReadonly"
                      :defaultValue="intputRequestDateYYYYMMDD"
                      @input-text-set="searchInput"
                      style="width: 100px"
                    />
                    <inputText
                      ref="intputRequestDateHHMMSS"
                      :dataNm="'intputRequestDateHHMMSS'"
                      :readonly="RequestDateReadonly"
                      :defaultValue="intputRequestDateHHMMSS"
                      @input-text-set="searchInput"
                      style="width: 80px"
                    />
                    <Button
                      :ref="nowDateBtn"
                      :theme-color="'secondary'"
                      :size="'medium'"
                      @click="nowDateBtn"
                      >{{ $t("MES_CommLang.MES_CommLang_00337") }}</Button 
                    > <!-- 현재일시 -->
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-area" style="margin-top: 5px;">
              <div class="area-form" style="height: 100px">
                <div class="area-th">
                  <label>{{ $t("MES_CommLang.MES_CommLang_00648") }}</label> <!-- 작업설명 -->
                </div>
                <div class="area-td" style="width: 100%;">
                  <TextArea
                    :auto-size="true"
                    :cols="12"
                    :readonly="workCommentReadonly"
                    v-model="workCmmentTextArea"
                  />
                </div>
              </div>
            </div>
            <div class="detail-area" style="margin-top: 5px;">
              <div class="area-form" style="height: 70px">
                <div class="area-th">
                  <label>{{ $t("MES_CommLang.MES_CommLang_00487") }}</label> <!-- 비고 -->
                </div>
                <div class="area-td" style="width: 100%;">
                  <TextArea
                    :auto-size="true"
                    :cols="12"
                    :readonly="descriptionReadonly"
                    v-model="descriptionTextArea"
                  />
                </div>
              </div>
            </div>
              </CardBody>
            </Card>
          </v-col>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
      <InputSparePartModal ref="RequestCancelModal" v-if="inputSparePartModalVisible" :visibleDialog="inputSparePartModalVisible"
        :title="inputSparePartModalTitle" :selected-field="selectedField"  :initData="initData"
        @visibleDialog="val => (inputSparePartModalVisible = val)" />
    </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid"
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import moment from "moment";
  import utils from "~/plugins/utils";
  //   import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";
  import { TextArea } from "@progress/kendo-vue-inputs";
  import WorkerGroup from "@/components/frmEquipmentWorker/WorkerGroup"
  import InputText from "@/components/common/input/InputText";
  import { DropDownList } from "@progress/kendo-vue-dropdowns";
  import InputSparePartModal from "@/components/frmEquipmentConsumable/InputSparePartModal.vue";
  import { DateTimePicker } from '@/static/kendo.all.min.js';
  
  let myTitle;
  let myMenuId;
  
  const d = new Date();
  let year = d.getFullYear(); // 년
  let month = d.getMonth();   // 월
  let day = d.getDate();      // 일
  let fromdate = new Date(year, month, day);
  let todate = d;
  let now = new Date();

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
      InputSparePartModal,
      DateTimePicker,
      TextArea
    },
    data() {
      return {
        gridHeight: '100px',
        columns: [],
        gridData: [],
        gridOriData: [],
  
        gridData2: [],
        gridOriData2: [],
  
        gridData3: [],
        gridOriData3: [],
  
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
        reasoncode:'',
        reasonCodeName: [],
        disableAddBtn: true,
        selectedEquipmentID: '',
        selectedPMCodeID: '',
        selectedPMCodeList: [],
        value: {}, /* Line */
        value2: { id: '', text: '' }, /* WorkCenter */
        value3:{}, /* reasonCodeName */
        equipmentSelectedIdx: '',
        btnClickIdx: '',
        equipmentHeaderParam: {
          gridid: "dgvEquipmentLisst_SparePart", // 그리드 ID
          gridHeader: [],
          noFirstCheck: true,
          noRowstat: true
        },
        EQMaintenanceHeaderParam: {
          gridid: "dgvEquipmentMaintenance", // 그리드 ID
          rowStat: '',
          gridHeader: [],
          noRowstat: true,
          enumComboBox: [],
          xOverflowYn: true,
          noFirstCheck: true,
          dateTimePickerList: ["REQUESTTIME",],
        //   gridDropDownList: [
        //     {
        //       dataVal: "REASONCODE",
        //       dataItem: [],
        //       disable: false,
        //     },
        //   ],
        },

        // customCell: ['MANAGERUSERID', 'WORKERUSERID'],
        customDropDown: true,
        intputEquipmentCode : "",
        intputRequestUser : "",
        intputRequestDateYYYYMMDD : "",
        intputRequestDateHHMMSS : "",
        RequestDateReadonly: false,
        workCommentReadonly: false,
        workCmmentTextArea: "",
        descriptionReadonly: false,
        descriptionTextArea: '',
        inputSparePartModalTitle: '',
        inputSparePartModalVisible: false,
        initData: {equipmentID : '', equipmentName: '', requestID: ''}
      };
    },
    created() {
        this.toyear = Utility.setFormatDate(todate, 'YYYY'),
        this.tomonth = Utility.setFormatDate(todate, 'MM'),
        this.today = Utility.setFormatDate(todate, 'DD'),
        // console.log("testdate:::::::::", this.testdate);
        this.intputYearMonthDefault = this.toyear + "-" + this.tomonth;
        this.setYYYYMM = Utility.setFormatDate(this.intputYearMonthDefault.replaceAll('-', ''), 'YYYYMM');

        this.setYYYYMMDD = todate;
    },
    async mounted() {
      this.inputSparePartModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00649'); /* 사용자재 입력 */
      this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
      await this.getHeaderMulti(this.equipmentHeaderParam, this.$refs.divWrapper1);
      await this.getHeaderMulti(this.EQMaintenanceHeaderParam, this.$refs.divWrapper2);
      this.getComboData();
      await this.getEquipmentGridData();
      this.getGridComboList();
      this.getReasonCodeComboData();
      this.value2.text = this.$i18n.t('MES_CommLang.MES_CommLang_00501'); /* 전체 */


    },
    computed: {
      areAllSelected() {
        return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
      },
      userInfo: (state) => state.$store.$auth.$state.user,
      
    },
    watch: {
    },
    methods: {
      // 설비목록 그리드 데이터 가져오기
      async getEquipmentGridData() {
        this.disableAddBtn = true;
        this.gridOriData = [];
        this.gridData = [];
        this.gridData2 = [];

        
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetEquipmentDefinitionList',
          queryVersion: '00002',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
            EQUIPMENTNAME: this.equipmentname,
            EQUIPMENTID: this.equipmentid
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
      // 요청리스트 그리드 데이터 불러오기
      async getRequestListData(res) {
        this.gridOriData2 = [];
        this.gridData2 = [];
        this.intputRequestDateYYYYMMDD = '';
        this.intputRequestDateHHMMSS = '';
        this.workCmmentTextArea = '';
        this.descriptionTextArea = '';
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetEquipmentMaintenance',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            EQUIPMENTID: res,
            // YYYYMM: this.setYYYYMM
          },
        }).then(res => {
          const data = res.map((x, idx) => {
            // const customCell = {

            // };
            return {
              ...x,
              rowStat: 'N',
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
              resizable: true,
              REQUESTTIME: Utility.setFormatDate(x.REQUESTTIME,"YYYY-MM-DD HH:mm:ss")

            //   PMPLANENDTIME: new Date(x.PMPLANENDTIME),
            //   customCell,
            };
          });
          //GIRD input v-model초기화, chkbox초기화 위해 추가
          this.$nuxt.$emit('iccReset');
          this.gridOriData2 = data;

          for(let i = 0; i < data.length; i++){
              
        }
        this.gridData2 = data;

          console.log(this.gridData2);
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
            AREATYPE: 'Line'
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
          for (let i = 0; i < data.length; i++) {
            if (i < data.length) {
              this.line.push({ id: data[i].CODE, text: data[i].NAME });
              this.value = this.line[0];
            }
          }
          // 검색조건 WorkCenter 콤보박스 데이터 가져오기
          this.getWorkCenterComboList(this.line[0].id);
        });
      },
  
      // 검색조건 WorkCenter 콤보박스 데이터 가져오기
      async getWorkCenterComboList(res) {
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
          this.workCenter.push({ id: '', text: this.$i18n.t('MES_CommLang.MES_CommLang_00501') }); /* 전체 */
          for (let i = 0; i < data.length; i++) {
            if (i < data.length) {
              this.workCenter.push({ id: data[i].CODE, text: data[i].NAME });
            }
          }
        });
      },
      
    async getReasonCodeComboData() {
        // 설비고장코드 콤보 데이터 가져오기
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetReasoncodeComboList',
          queryVersion: '00002',
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
          for (let i = 0; i < data.length; i++) {
            if (i < data.length) {
              this.reasonCodeName.push({ id: data[i].REASONCODE, text: data[i].DESCRIPTION });
            }
          }
        });
      },

      
      // 그리드 콤보박스 데이터 가져오기
      async getGridComboList() {
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetUserList',
          queryVersion: '00004',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
          },
        }).then(data => {
          const combo = data.map(x => {
            return {
              ENUMVALUE: x.USERID,
              ENUMVALUENAME: x.USERNAME,
            }
          })

        });
        
      },
      async getHaeder() {
        this.gridHeader = await this.getCustomHeader("dgvEquipmentStateChangeList", true, true);
      },
      async searchBtn() {
        this.getEquipmentGridData();
  
      },
    //   reuqestCancelData(data) {
    //     console.log(data);
    //     this.requestCancelModalVisible = false;
    //     this.cancelRequest(data);

    //   },
      // 보류
      holdBtn() {
        const holdData = this.gridData2
        .filter(x => x.selected === true)
        .map(x => {
        return {
            ...x,
            TARGETSTATUS: "Hold",
            WORKERUSERID: this.workeruserid,
            WORKCOMMENT: this.workCmmentTextArea,
            DESCRIPTION: this.descriptionTextArea
        };
        });

        const validate = this.mesValidation(
          this.EQMaintenanceHeaderParam.gridHeader,
          this.gridData2
        );
        if (!validate.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
          return;
        }

        if (holdData.length > 0) {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: "TxnEquipmentMaintenance",
            sendParam: holdData,
          }).then(result => {
            this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === '0') {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getRequestListData(this.selectedEquipmentID);
                this.gridData3 = [];
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

      // 반려
      rejectBtn() {
        const rejectData = this.gridData2
        .filter(x => x.selected === true)
        .map(x => {
        return {
            ...x,
            TARGETSTATUS: "Reject",
            WORKERUSERID: this.workeruserid,
            WORKCOMMENT: this.workCmmentTextArea,
            DESCRIPTION: this.descriptionTextArea
        };
        });

        const validate = this.mesValidation(
          this.EQMaintenanceHeaderParam.gridHeader,
          this.gridData2
        );
        if (!validate.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
          return;
        }

        if (rejectData.length > 0) {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: "TxnEquipmentMaintenance",
            sendParam: rejectData,
          }).then(result => {
            this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === '0') {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getRequestListData(this.selectedEquipmentID);
                this.gridData3 = [];
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

      // 완료
      completeBtn() {
        const completeData = this.gridData2
        .filter(x => x.selected === true)
        .map(x => {
        return {
            ...x,
            TARGETSTATUS: "Complete",
            WORKERUSERID: this.workeruserid,
            WORKCOMMENT: this.workCmmentTextArea,
            DESCRIPTION: this.descriptionTextArea,
            WORKTIME: this.intputRequestDateYYYYMMDD.replaceAll('-', '') + this.intputRequestDateHHMMSS.replaceAll(':', ''), // 작업시간
        };
        });

        const validate = this.mesValidation(
          this.EQMaintenanceHeaderParam.gridHeader,
          this.gridData2
        );
        if (!validate.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); /* 알림 */
          return;
        }

        if (completeData.length > 0) {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: "TxnEquipmentMaintenance",
            sendParam: completeData,
          }).then(result => {
            this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === '0') {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
                this.getRequestListData(this.selectedEquipmentID);
                this.gridData3 = [];
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

      //사용자재 입력 버튼 클릭
      sparePartBtn(){
        const selectedData = this.gridData2
        .filter(x => x.selected === true)

        if(selectedData.length > 0){
            this.inputSparePartModalVisible = true;
        }else{
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'),  this.$i18n.t('MES_MsgLang.MES_MsgLang_00253')); /* 알림, 요청 데이터를 선택해주세요. */
        }
      },
    //   cancelModalVisible(){
    //     this.inputSparePartModalVisible = true;
    //   },
    //   cancelRequest(data){
    //     const cancelData = this.gridData2
    //     .filter(x => x.selected === true)
    //     .map(x => {
    //     return {
    //         ...x,
    //         TARGETSTATUS: "Cancel",
    //         WORKERUSERID: data.workerUserID,
    //         WORKCOMMENT: data.workcomment,
    //         DESCRIPTION: data.description
    //     };
    //     });

    //     this.mesPost({
    //       apiKey: 'mes/common/manage',
    //       messagename: "TxnEquipmentMaintenance",
    //       sendParam: cancelData,
    //     }).then(result => {
    //       this.$nextTick(() => {
    //         if (result.returncode !== undefined && result.returncode === '0') {
    //           this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
    //           this.getRequestListData(this.selectedEquipmentID);
    //           this.gridData3 = [];
    //         } else {
    //           this.$refs.alertPop.show(
    //             'ERROR : ' + result.code,
    //             result.message
    //           );
    //         }
    //       });
    //     });
        
    //   },

    //   leftBtn() {
    //         // 좌측버튼 클릭
    //         let yearData;
    //         let monthData;

    //         if (parseInt(this.month) < 2) {
    //             // this.mCnt--;
    //             this.month = "13";
    //             this.month--;
    //             this.year--;
    //             this.inputYearMonth = this.year + "-" + this.month;
    //             this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
    //             // console.log("leftBtn testdate:::::::::", new Date(now.setMonth(now.getMonth() -1)));
    //             // console.log(":::::llll급합:::", this.setYYYYMM);
    //             // if (this.selected == 0) {
    //             //     // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() - 1));
    //             //     this.$refs.PMSchedule.search(this.setYYYYMM);
    //             // } else {
    //             //     this.$refs.PMWork.getGridData(this.setYYYYMM);
    //             // }
    //         } else {
    //             // console.log(this.selected);
    //             // console.log(this.tabs.title);
    //             // this.mCnt--;
    //             this.month--;
    //             this.year;
    //             this.inputYearMonth = this.year + "-" + this.month;
    //             this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
    //             // console.log(":::::llll급합12222233111:::", this.setYYYYMM);
    //             // console.log("leftBtn testdate:::::::::", new Date(now.setMonth(now.getMonth() -1)));
    //             // if (this.selected == 0) {
    //             //     // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() - 1));
    //             //     this.$refs.PMSchedule.search(this.setYYYYMM);
    //             // } else {
    //             //     this.$refs.PMWork.getGridData(this.setYYYYMM);
    //             // }
    //         }
    //     },
    //     rightBtn() {
    //         // 우측버튼 클릭
    //         let yearData;
    //         let monthData;
    //         // let now = new Date();
    //         if (parseInt(this.month) > 11) {
    //             this.month = "0";
    //             // this.pCnt++;
    //             this.month++;
    //             this.year++;
    //             this.inputYearMonth = this.year + "-" + this.month;
    //             this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
    //             // console.log(":::::rrrr급합111:::", this.setYYYYMM);
    //             // console.log(":::::급sdfsdfasf합:::", new Date(now.getFullYear(), now.getMonth() + 1));
    //             // if (this.selected == 0) {
    //             //     // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() + 1));
    //             //     this.$refs.PMSchedule.search(this.setYYYYMM);
    //             // } else {
    //             //     this.$refs.PMWork.getGridData(this.setYYYYMM);
    //             // }
    //         } else {
    //             // this.pCnt++;
    //             this.month++;
    //             this.year;
    //             this.inputYearMonth = this.year + "-" + this.month;
    //             this.setYYYYMM = Utility.setFormatDate(this.inputYearMonth.replaceAll('-', ''), 'YYYYMM');
    //             // console.log(":::::rrrr급합222:::", this.setYYYYMM);
    //             // console.log(":::::급sdfsdfasf합:::", new Date(now.getFullYear(), now.getMonth() + 1));
    //             // if (this.selected == 0) {
    //             //     // this.$refs.PMSchedule.search(new Date(now.getFullYear(), now.getMonth() + 1));
    //             //     this.$refs.PMSchedule.search(this.setYYYYMM);
    //             // } else {
    //             //     this.$refs.PMWork.getGridData(this.setYYYYMM);
    //             // }
    //         }
    //     },
      openAlert(title, message, visiable = true, width = "350px") {
        this.$refs.alertPop.title = title;
        this.$refs.alertPop.message = message;
        this.$refs.alertPop.visibleDialog = visiable;
        this.$refs.alertPop.modalWidth = width;
      },
      //설비목록 그리드 로우 클릭
      equipmentOnRowClick(event) {
        this.selectedEquipmentID = event.dataItem.EQUIPMENTID;

        this.reasoncode = '';
        this.value3 = {};
        this.requestCmmentTextArea = '';
        this.intputEquipmentCode = event.dataItem.EQUIPMENTID; /* 설비코드 인풋 */
        this.intputRequestUser = this.userInfo.userId;  /* 요청자 인풋 */


        this.equipmentSelectedIdx = event.dataItem.idx;
        this.disableAddBtn = false;
        this.gridData.forEach(x => (x.selected = false));
        event.dataItem[this.selectedField] = true;
        this.getRequestListData(this.selectedEquipmentID);
      },
      // 요청리스트 그리드 로우 클릭
      requestListOnRowclick(event) {
        this.initData.equipmentID = event.dataItem.EQUIPMENTID;
        this.initData.equipmentName = event.dataItem.EQUIPMENTNAME;
        this.initData.requestID = event.dataItem.REQUESTID;
        this.gridData2.forEach(x => (x.selected = false));
        event.dataItem[this.selectedField] = true;
        this.workeruserid = this.userInfo.userId;
        this.intputRequestDateYYYYMMDD = Utility.setFormatDate(new Date(), "YYYY-MM-DD"); /* 요청시간 */
        this.intputRequestDateHHMMSS = Utility.setFormatDate(new Date(), "HH:mm:ss");   /* 요청시간 */
      },
      searchInput(nm, val) {
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
      // 설비고장코드 콤보 change 이밴트
      comboChange3(event) {
        console.log(event);
        this.value3 = event.value;
        this.reasoncode = this.value3.id;
      },
      
      nowDateBtn() {
        // 현재시간 버튼클릭
        this.intputRequestDateYYYYMMDD = Utility.setFormatDate(new Date(), "YYYY-MM-DD");
        this.intputRequestDateHHMMSS = Utility.setFormatDate(new Date(), "HH:mm:ss");
      },
      
      
      //그리드 인풋 제외 데이터 변경시
      rowDdChange(e, name, dataItem) {
        const idx = this.gridData2.findIndex((x) => x.idx === dataItem.idx);
        const Data = JSON.parse(JSON.stringify(this.gridData2));
  
        if (this.gridOriData2)
          Data[idx] = { ...Data[idx], [name]: e.value };
  
        if (Data[idx].rowStat === "N") {
          Data[idx].rowStat = 'U';
        }
  
        if (
          Data[idx].rowStat === 'U' &&
          !this.gfn_ChkOriginalData(this.EQMaintenanceHeaderParam.gridHeader, Data, this.gridOriData2, idx)
        ) {
          Data[idx].rowStat = 'N';
        }
  
        this.gridData2 = Data;
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
  
        if (
          data[idx].rowStat === 'U' &&
          !this.gfn_ChkOriginalData(this.EQMaintenanceHeaderParam.gridHeader, data, this.gridOriData2, idx)
        ) {
          data[idx].rowStat = 'N';
        }
  
        this.gridData2 = data;
      },
     
      //검색버튼 선택
      selectedRow(row) {
        this.gridData2 = this.gridData2.map(item => {
  
          return {
            ...item,
            PARTID: item.idx === this.btnClickIdx ? row.SPAREPARTID : item.PARTID,
            PARTNAME: item.idx === this.btnClickIdx ? row.SPAREPARTNAME : item.PARTNAME,
  
          };
        });
      },
      // HH:MM String to Date 포맷 변환
      hhmmStringToDate(time) {
        const timeSplit = time.split(':');
        let dt = new Date();
        dt.setHours(timeSplit[0]);
        dt.setMinutes(timeSplit[1]);
        return dt;
      },
      //그리드 버튼 클릭 
      gridButtonClick(e, field, dataItem) {
        if (field === 'PARTIDBUTTON') {
          this.sparePartGridData = this.gridData2.filter(
            x => x.idx > dataItem.idx
          );
          this.btnClickIdx = dataItem.idx;
          // this.sparePartModalVisible = true;
        }
      },
    }
  };
  const defaultData = {
  };
  </script>
  <style lang="scss"></style>