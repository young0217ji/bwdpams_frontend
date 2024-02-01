<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00162") }}</li> <!-- 생산관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00530") }}</li> <!-- Lot 생성 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <!-- <div class="form-group">
                    <label>Plant</label>
                    <InputText
                      ref="plantid"
                      :dataNm="'plantid'"
                      :readonly="true"
                      :defaultValue="plantID"
                    />
                  </div>
                  <div class="form-group" style="margin-left: 66px">
                    <label>Work Center</label>
                    <InputText
                      ref="workcenter"
                      :dataNm="'workcenter'"
                      :defaultValue="workcenter"
                    />
                  </div> -->
                  <div class="form-group">
                <Label>Line</Label>
                <DropDownList
                  ref="cmbLine"
                  :style="{ width: '250px' }"
                  :data-items="line"
                  :text-field="'text'"
                  :data-item-key="'id'"
                  :value="value"
                  @change="comboChange"
                  >
                </DropDownList>
              </div>
              <div class="form-group">
                <Label>WorkCenter</Label>
                <DropDownList
                  ref="cmbWorkCenter"
                  :style="{ width: '250px' }"
                  :data-items="workCenter"
                  :text-field="'text'"
                  :data-item-key="'id'"
                  :value="value2"
                  @change="comboChange2"
                  >
                </DropDownList>
              </div>
              <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회 기간 -->
                    <div class="form-datepicker">
                      <DatePicker
                        ref="fromdate"
                        :name="'fromdate'"
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date(fromdate)"
                        :searchOption="true"
                        @change="dateChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="todate"
                        :name="'todate'"
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date(todate)"
                        :searchOption="true"
                        @change="dateChange"
                      />
                    </div>
                  </div>
                </div>
                <div class="form-group-wrap" style="margin-top: 0">

                  <!-- <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00263") }}</Label> 
                    <InputText
                      ref="productid"
                      :boxWidth="'98%'"
                      :dataNm="'productid'"
                      :disabled="false"
                      :defaultValue="productid"
                      @input-text-set="searchInput"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                    /> -->
                    <!-- <v-col :cols="2">
                    <Button :theme-color="'secondary'" :size="'medium'" @click="searchModalVisible = true" >선택</Button>
                  </v-col> -->
                  <!-- </div> -->
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00542") }}</label> <!-- 제품그룹명 -->
                    <DropDownList
                      ref="cmbProGroup"
                      :style="{ width: '250px' }"
                      :data-items="productGroup"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="value3"
                      @change="comboChange3"
                      >
                  </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00264") }}</label> <!-- 제품구분 -->
                    <MesSelectBox
                      :enumID="'ProductionType'"
                      :allYN="true"
                      :dataNm="'ProductionType'"
                      @comboChange="comboChange4"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00259") }}</label> <!-- 제품ID -->
                    <InputText
                      ref="productid"
                      :dataNm="'productid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00260") }}</label> <!-- 제품명 -->
                    <InputText
                      ref="productName"
                      :dataNm="'productName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
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
      <v-col :cols="12" :style="{height : '100%'}">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="12" :class="'divList1'" :style="{ height: '40%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00529") }}</CardTitle> <!-- W/O 정보 -->
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid 
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :resizable="true"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :selected-field="selectedField"
                    :gridDropDownList="gridDropDownList"
                    :checkHeaderArr="checkHeaderArr"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="onRowClick"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @headerselectionchange="onHeaderSelectionChange"
                    @sortChangeHandler="sortChangeHandler"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
          <v-col :cols="12" :class="'divList2'" :style="{ height: '60%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00022") }}</CardTitle> <!-- Lot목록 -->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" icon="add" @click="lotCreateModalVisible = true" :disabled="confirm">
                      {{ $t("MES_CommLang.MES_CommLang_00166") }}
                    </Button> <!-- 생성 -->
                    <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="delBtn">
                      {{ $t("MES_CommLang.MES_CommLang_00537") }}
                    </Button> <!-- 생성취소 -->
                  </v-col>
                </v-row>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid 
                    ref="rowGrid2"
                    :gridHeight="gridHeight2"
                    :gridItems="gridData2"
                    :sortable="true"
                    :columns="headerParam2.gridHeader"
                    :resizable="true"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :selected-field="selectedField"
                    :gridDropDownList="gridDropDownList"
                    :checkHeaderArr="checkHeaderArr"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="onRowClick2"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @headerselectionchange="onHeaderSelectionChange"
                    @sortChangeHandler="sortChangeHandler2"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
      :callBack="() => searchModalVisible = true"
    />
    <AlertPop 
      ref="alertPop2"
      :is="'alertPop'"
    />
    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="()=>{}"
      @visibleDialog="(val) => searchModalVisible = val"
      @productCode="productCode"
    />
    <LotCreateModal
      ref="LotCreateModal"
      v-if="lotCreateModalVisible"
      :visibleDialog="lotCreateModalVisible"
      :title="'title'"
      :message="'message'"
      :initData=initData
      :initData2="initData2"
      :callBack="()=>{}"
      @visibleDialog="(val) => lotCreateModalVisible = val"
      @saveBtn="saveBtn"
    />
  </div>
</template>
<script>
import Utility from "~/plugins/utility";
import DateUtility from '~/plugins/dateUtility';
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
// import { Input } from '@progress/kendo-vue-inputs';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import SelectModelingConfirm from "@/components/frmCreateLot/SelectModelingConfirm";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import LotCreateModal from "@/components/frmCreateLot/LotCreateModal";

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
    menuId : myMenuId,
    closable: true
  },
  components: {
    Card,
    Button,
    CardBody, 
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    Checkbox,
    SelectModelingConfirm,
    MesVariableSelectBox,
    DropDownList,
    MesSelectBox,
    LotCreateModal,
    DatePicker
  },
  data() {
    return {
      fromdate: '',
      todate: '',
      gridHeight : '100px',
      gridHeight2 : '100px',
      gridData : [],
      gridOriData : [],
      gridData2 : [],
      gridOriData2 : [],
      gridLastModIdx: null,
      gridDropDownList:[{
        dataVal : 'AREATYPE',
        dataItem: []
      }],
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      checkHeaderArr: ["GOINORDERREQUIRED"],
      parentAreaId: "",
      searchModalVisible: false,
      lotCreateModalVisible: false,
      productid: "",
      productNameL: "",
      departmentid: "",
      areaid: "",
      workcenter: "",
      headerParam: {
        gridid: "dgvWorkOrderList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      headerParam2: {
        gridid: "dgvLotList_Create3", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: false,
        noRowstat: true
      },
      initData: { },
      initData2: { 
        LINE: '',
        PRODUCTGROUPNAME: ''
      },
      inputcol: ["DEPARTMENT", "DEPARTMENTNAME"],
      inputcol2: ["AREAID", "AREANAME"],
      selectedID:null,
      confirm:true,
      sortField: [{}],
      loginInfo: "",
      plantID: this.$auth.$state.user.plantId,
      value: [], /* Line */
      value2: [], /* WorkCenter */
      value3: [], /* 제품그룹 */
      line: [],
      workCenter: [],
      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스
      productGroup: [],
    };
    
  },
  created() {
    this.todate = Utility.setFormatDate(new Date(), 'YYYY-MM-DD');
    this.fromdate = Utility.setFormatDate(
      DateUtility.addDate(-7, null, new Date()),
      'YYYY-MM-DD'
    );
  },
  async mounted() {
    this.gridHeight = ((this.$refs.contents.offsetHeight * 0.23) - 70) +'px';
    this.gridHeight2 = ((this.$refs.contents.offsetHeight  * 0.77) - 70) +'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper);
    await this.getComboData();
    await this.getProductGroupData();
    this.$refs['plantid'].textVal = this.plantID;
    // this.departmentid = this.$refs.comboDepartment.value;
    // this.$refs.comboArea.sendParam.department = this.departmentid;
    // await this.$refs.comboArea.getComboList();
  },
  computed: {
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.PRODUCTORDERID === this.selectedID }));
    },
  },
  watch: {
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData(data) {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetWorkOrderList",
        queryVersion: "00002",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          todate: Utility.setFormatDate(this.todate, 'YYYYMMDD'),
          fromdate: Utility.setFormatDate(this.fromdate, 'YYYYMMDD'),
          AREAID: this.value.id, 
          WORKCENTER: this.value2.id, 
          productGroupID: this.value3.id, 
          productid: this.productid,
          productName: this.productName,
        }
      }).then((res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: false,
            newRow: false
          }
        });
        this.gridOriData = data;
        this.gridData = data;
        this.confirm = true;
        if(this.gridData.length < 1){
          this.gridData2 = [];
        }
        
      })
    },

    //그리드 데이터 가져오기
    async getGridData2() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotInfoList3",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.initData.PRODUCTID,
          workorder: this.initData.WORKORDER,
        }
      }).then((res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
          }
        });
        this.gridOriData2 = data;
        this.gridData2 = data;
      })
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
          AREATYPE : 'Line'
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
            this.line.push({ id : data[i].CODE, text : data[i].NAME });
            this.value = this.line[0];
            this.initData2.LINE = this.value.text;
          }
        }
        // 검색조건 WorkCenter 콤보박스 데이터 가져오기
        this.getWorkCenterComboList(this.line[0].id);
      });
    },
    // 검색조건 WorkCenter 콤보박스 데이터 가져오기
    async getWorkCenterComboList(res){
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
      for(let i = 0; i < data.length; i++){
        if(i < data.length){
          this.workCenter.push({ id : data[i].CODE, text : data[i].NAME });
        }
      }
      this.value2 = [];
    });
    },
    // 검색조건 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProductGroupList',
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
            this.productGroup.push({ id : data[i].PRODUCTGROUPID, text : data[i].PRODUCTGROUPNAME });
            this.value3 = this.productGroup[0];
            this.initData2.PRODUCTGROUPNAME = this.value3.text;
          }
        }
      });
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.confirm = false;
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.initData = event.dataItem;
      this.getGridData2();
    },
    //그리드 로우 클릭
    onRowClick2 (event) {
      //그리드 로우 클릭시 라인표시 유무 확인필요
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange (event) {
      let checked = event.event.target.checked;
      this.gridData2 = this.gridData2.map((item) => {
        return { ...item, selected: checked };
      });
    },
    dateChange(e) {
      this[e.target.name] = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name === "GOINORDERREQUIRED") {
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
    // 검색조건 Line 콤보 change 이벤트
    comboChange(event) { 
      this.value = event.value;
      this.initData2.LINE = this.value.text;
      // 검색조건 Line콤보박스 선택값에 따라 검색조건 WorkCenter 콤보 데이터 가져오기
      this.getWorkCenterComboList(event.value.id);
    },
    // 검색조건 WorkCenter 콤보 change 이벤트
    comboChange2(event) { 
      this.value2 = event.value;
    },
    // 검색조건 제품그룹 콤보 change 이벤트
    comboChange3(event) { 
      this.value3 = event.value;
      this.initData2.PRODUCTGROUPNAME = this.value3.text;
    },
    // 검색조건 제품구분 콤보 change 이벤트
    comboChange4(nm, val) {
      this[nm] = val;
    },
    //그리드 인풋 데이터 변경시
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

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx){
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat"
      });
      return chkArr.length > 0;
    },

    //삭제버튼
    delBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData2));
      this.gridData2 = data.map(x => {
          return {
            ...x,
            rowStat: x.selected? "D" : "N",
          }
      });

      const saveData = this.gridData2.filter(x => x.rowStat !== "N")
      .map(x => {
        return { 
          ...x,
          _ROWSTATUS: x.rowStat,
        }
      });

      if(saveData.length > 0){
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnCreatedLotCancel",
          sendParam: saveData
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
                this.$refs.alertPop2.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00221')); /* 알림, 생성취소가 완료되었습니다. */
                this.getGridData2();
              }
          })
        })
      } else {
        this.$refs.alertPop2.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00087')); /* 알림, 선택한 데이터가 없습니다. */
      }


    },
        selectRow() {
      const returnData = this.items.filter((x) => x.selected);
    },
    // comboChange(nm, val){
    //   this[nm] = val;
    //   if(nm === "departmentid" ){
    //     this.$refs.comboArea.sendParam.department = this.departmentid;
    //     this.$refs.comboArea.getComboList();
    //   }
    // },
    searchInput(nm, val){
      this[nm] = val;
    },
    productCode(data){
      // if(Object.keys(data).length === 0){
      //   this.$refs.alertPop.title = ""
      //   this.$refs.alertPop.message = "제품코드를 선택 후 조회 하세요";
      //   this.$refs.alertPop.modalWidth = "330px";
      //   this.$refs.alertPop.visibleDialog = true;
      //   return;
      // }
      this.productid = data.PRODUCTID;
      // this.confirm = data.CONFIRMFLAG === "Yes" ? true : false;
      // this.$refs.Process.confirmCheck = this.confirm;
      this.$nuxt.$emit('iccReset');
      // this.initData = data;
      // this.$refs.rowGrid.gridItems = data;
      // this.initTree();
      this.getGridData(data);
      // this.areaid = this.$refs.comboArea.value;
      // this.departmentid = this.$refs.comboDepartment.value;
      this.getGridData2();
    },
    saveBtn(data){
      if (data !== undefined && data === '0') {
          this.$refs.alertPop2.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00222')); /* 알림, 생성이 완료되었습니다. */
          this.getGridData2();
      }
    },
    //필터정렬
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    },
    sortChangeHandler2(e){
      this.gfn_sortChangeHandler(this.gridData2, e);
    },

    //조회버튼
    searchBtn(productid) {
      this.$refs.rowGrid.skip = 0;
      this.$refs.rowGrid.sortField = [{}];
        this.getGridData();
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>