<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00175") }}</li> <!-- 설비관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00633") }}</li> <!-- 긴급보전 이력조회 -->
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
                    <DropDownList ref="cmbLine" :style="{ width: '250px' }" :data-items="line" :text-field="'text'"
                      :data-item-key="'id'" :value="valueLine" @change="comboChange">
                    </DropDownList>
                  </div>
                  <div class="form-group" style="margin-left: 5px;">
                    <Label>WorkCenter</Label>
                    <DropDownList ref="cmbWorkCenter" :style="{ width: '200px' }" :data-items="workCenter"
                      :text-field="'text'" :data-item-key="'id'" :value="valueWorkcenter" @change="conboChangeWorkcenter">
                    </DropDownList>
                  </div>
                  <div class="form-group" style="margin-left: -5px;">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00177") }}</label> <!-- 설비코드 -->
                    <InputText ref="equipmentid" :boxWidth="'85%'" :dataNm="'equipmentid'" :disabled="false"
                      :defaultValue="equipmentid" :searchOption="true" :searchFunc="searchBtn"
                      @input-text-set="searchInput" />
                  </div>
                  <div class="form-group" style="margin-left: -40px;">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                    <InputText ref="equipmentname" :boxWidth="'85%'" :dataNm="'equipmentname'" :disabled="false"
                      :defaultValue="equipmentname" :searchOption="true" :searchFunc="searchBtn"
                      @input-text-set="searchInput" />
                  </div>
                  <div class="form-group" style="margin-top: 10px;">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!--조회 기간-->
                    <div class="form-datepicker">
                      <DatePicker ref="workFromDate" :default-value="new Date(workFromDate)" :dataNm="'workFromDate'"
                        :format="'yyyy-MM-dd'" @change="fromChange" />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker ref="workToDate" :default-value="new Date()" :dataNm="'workToDate'"
                        :format="'yyyy-MM-dd'" @change="toChange" />
                    </div>
                    <div class="form-group" style="margin-top: 10px;">
                      <Label>{{ $t("MES_CommLang.MES_CommLang_00634") }}</Label> <!-- 진행 상태 -->
                      <DropDownList ref="cmbENUM" :style="{ width: '100px' }" :data-items="status" :text-field="'text'"
                        :data-item-key="'id'" :value="valueEnum" @change="conboChangeEnum">
                      </DropDownList>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="2" :lg="2" align="right">
                <Button :theme-color="'primary'" icon="search" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277")
                }}</Button> <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="10" :lg="12" :style="{ height: '100%' }">
        <v-row :style="{ height: 'calc(50% - 5px)' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }" no-gutters>
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00635") }}</CardTitle>
                    <!-- 긴급보전 목록 -->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" icon="search" @click="add" style="margin-bottom: 10px;">{{ $t("MES_CommLang.MES_CommLang_00661") }}</Button> <!-- 소모자재조회 -->
                  </v-col>
                </v-row>
                <div ref="divWrapper1" style="height: calc(100% - 33px);">
                  <KendoGrid ref="BMList" :gridHeight="gridHeight" :gridItems="gridDataBMList" :sortable="true"
                    :columns="BMDefinition.gridHeader" :resizable="false" :edit-field="'inEdit'" :isPaging="true"
                    :selected-field="selectedField" @gridrowclick="BMListRowClick" />
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
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00636") }}</CardTitle> <!-- 긴급보전 요청이력 -->
                  </v-col>
                </v-row>
                <div ref="divWrapper2" style="height: calc(100% - 33px);">
                  <KendoGrid ref="BMDefinitionHistory" :gridHeight="gridHeight" :gridItems="BMHistory" :sortable="true"
                    :columns="BMDefinitionHistory.gridHeader" :resizable="false" :edit-field="'inEdit'" :isPaging="true"
                    :selected-field="selectedField" />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />

    <EquipmentConsumable ref="EquipmentConsumableModal" v-if="EquipmentConsumableVisible" :visibleDialog="EquipmentConsumableVisible"
    @visibleDialog="val => (EquipmentConsumableVisible = val)"
    :title="EquipmentConsumableTitle" :BMCode="BMCode"/>
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import WorkerGroup from "@/components/frmEquipmentWorker/WorkerGroup"
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import EquipmentConsumable from '@/components/frmBMDefinitionHistory/EquipmentConsumable.vue';

let myTitle;
let myMenuId;


const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일

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
    DatePicker,
    EquipmentConsumable
  },
  data() {
    return {
      workFromDate: Utility.setFormatDate(new Date(year, month, day - 7), 'YYYY-MM-DD'),
      workToDate: Utility.setFormatDate(new Date(), "YYYY-MM-DD"),
      gridHeight: '100px',
      selectedField: 'selected',
      reSetPage: false,
      line: [],
      status: [],
      columns: [],
      BMHistory: [],
      workCenter: [],
      gridDataBMList: [],
      valueEnum: {},
      valueWorkcenter: { id: '', text: '' }, /* WorkCenter */
      valueLine: '',                         /* Line */
      equipmentid: '',
      equipmentname: '',
      selectedRequestId: '',
      
      EquipmentConsumableTitle: '',
      EquipmentConsumableVisible: false,
      BMCode: '',

      BMDefinition: {
        gridid: "dgvEquipmentMaintenance",   // 그리드 ID
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
        xOverflowYn: true,
      },
      BMDefinitionHistory: {
        gridid: "dgvEquipmentMaintenanceHistory", // 그리드 ID
        rowStat: '',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
        xOverflowYn: true,
      },
    };
  },
  created() {
  },
  async mounted() {
    this.sparePartModalTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00595'); /* 예비품 선택/등록 */
    this.EquipmentConsumableTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00215'); //입고
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(this.BMDefinition, this.$refs.divWrapper1);
    await this.getHeaderMulti(this.BMDefinitionHistory, this.$refs.divWrapper2);
    await this.getEnum();
    await this.getComboData();
    await this.getBMDefinitionGridData();
    this.valueWorkcenter.text = this.$i18n.t('MES_CommLang.MES_CommLang_00501'); /* 전체 */
    
  },
  computed: {
  },
  watch: {
  },
  methods: {
    add() {
      this.EquipmentConsumableVisible = true;
      this.EquipmentConsumableTitle = "소모자재조회 (" + this.selectedRequestId + ")"; //입고
      this.BMCode = this.selectedRequestId;
      console.log('BMCode IN Add', this.BMCode);
    },




    BMListRowClick(event) {
      this.selectedRequestId = event.dataItem.REQUESTID;
      this.gridDataBMList.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.getBMDefinitionHistory(this.selectedRequestId);
    },

    // 긴급보전 요청 그리드 데이터 가져오기
    async getBMDefinitionGridData() {
      this.gridDataBMList = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetBMDefinitionAll',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WORKCENTER: this.$refs['cmbWorkCenter'].value.id,
          EQUIPMENTID: this.equipmentid,
          EQUIPMENTNAME: this.equipmentname,
          STARTTIME: this.workFromDate,
          ENDTIME: this.workToDate,
          STATUS: this.valueEnum.id
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
        this.gridDataBMList = data;
        if (data.length > 0) {
          this.gridDataBMList[0].selected = true;
          this.getBMDefinitionHistory(this.gridDataBMList[0].REQUESTID);
          this.selectedRequestId = this.gridDataBMList[0].REQUESTID;
          console.log('selected', this.selectedRequestId);
        }

      });
    },
    // 긴급보전 요청 이력(History) 그리드 데이터 불러오기
    async getBMDefinitionHistory(res) {
      console.log('res',res);
      this.BMHistory = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetBMDefinitionHistory',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          REQUESTID: res,
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
            //   EVENTNAME: x.EVENTNAME == 'TxnMaterialInput' ? this.$i18n.t('MES_CommLang.MES_CommLang_00215') : this.$i18n.t('MES_CommLang.MES_CommLang_00625'), /* 입고, 출고 */
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.BMHistory = data;
      });
    },
    async searchBtn() {
      if (this.valueEnum.id == 'All') {
        this.valueEnum.id = '';
      }
      this.getBMDefinitionGridData();

    },
    searchInput(nm, val) {
      this[nm] = val;
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
            this.valueLine = this.line[0];
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
        this.valueWorkcenter = this.workCenter[0];
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.workCenter.push({ id: data[i].CODE, text: data[i].NAME });
          }
        }
      });
    },

    // 검색조건 BM 상태 enum콤보 데이터 가져오기
    async getEnum() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValue',
        queryVersion: '00001',
        sendParam: {
          plantID: this.$auth.$state.user.plantId,
          ENUMID: 'BMStatus'
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
        this.status.push({id: '', text: this.$i18n.t('MES_CommLang.MES_CommLang_00501') });
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.status.push({ id: data[i].ENUMVALUE, text: data[i].ENUMVALUENAME });
            this.valueEnum = this.status[0];
          }
        }
      })
    },
    // 검색조건 Line 콤보 change 이벤트
    comboChange(event) {
      this.valueLine = event.value;
      // 검색조건 Line콤보박스 선택값에 따라 검색조건 WorkCenter 콤보 데이터 가져오기
      this.getWorkCenterComboList(event.value.id);
    },
    // 검색조건 WorkCenter 콤보 change 이벤트
    conboChangeWorkcenter(event) {
      this.valueWorkcenter = event.value;
      this.workCenterID = event.value.id;
    },

    conboChangeEnum(event) {
      this.valueEnum = event.value;
    
    },
    //검색조건 시작 날짜
    fromChange(e) {
      this.workFromDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
    },
    //검색조건 끝 날짜
    toChange(e) {
      this.workToDate = Utility.setFormatDate(e.value, "YYYY-MM-DD");
    },
  }
};
const defaultData = {
};
</script>
<style lang="scss"></style>