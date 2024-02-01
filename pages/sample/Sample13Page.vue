<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00798") }}</li> <!-- 생산 계획 현황 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="11">                
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00681") }}</label> <!-- Work Center  -->
                    <DropDownList
                        ref="cmbWorkCenter"
                        :style="{ width: '240px' }"
                        :data-items="workCenterList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value="workCenterValue"
                        @change="workCenterChange"
                        >
                    </DropDownList>
                  </div>

                  <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                      <DropDownList
                      ref="cmbEquipmentType"
                      :style="{ width: '240px' }"
                      :data-items="equipmentList"
                      :text-field="'EQUIPMENTNAME'"
                      :data-item-key="'EQUIPMENTID'"
                      :value="equipmentValue"
                      @change="selectEquipmentCombo"
                      />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00706")}}</label>
                    <div class="form-datepicker">  
                      <DatePicker
                        ref="startDate"
                        :name="'startDate'"
                        :default-value="new Date()"
                        :value="startDate"
                        :format="'yyyy-MM-dd'"
                        @change="dateChange"
                      />
                    </div>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        ref="colunmFix"
                        :dataNm="'colunmFix'"
                        :disabled="false"
                        :defaultchecked="false"
                        @checkbox-set="chkVal"
                      ></Checkbox>
                    </div>
                    <InputText
                      ref="colunmFixInput"
                      :dataNm="'colunmFixInput'"
                      :style="{ width: '30px', marginLeft: '5px'}"
                      @input-text-set="setColunmFixInput"
                    />
                    <label>&nbsp;개 열 고정(고정열에서 끌어서 이동하기 안됨)</label>
                  </div>
                  <div class="form-group">
                    <label>찾기</label> <!-- 찾기 -->
                    <InputText 
                        ref="nextSearc" 
                        :dataNm="'nextSearc'" 
                        :disabled="false"
                        :readonly="isReadOnly" 
                        :searchOption="true" 
                        @input-text-set="nextSearchBtnInput" />
                    <Button :theme-color="'primary'" @click="nextSearchBtn">다음찾기</Button>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '35px'}">
                    <Button :theme-color="'primary'" :style="{ marginLeft : '5px'}" @click="selectBtn">선택하기</Button>
                    <Button :theme-color="'primary'" :style="{ marginLeft : '5px'}" @click="moveBtn">이동하기</Button>
                    <Button :theme-color="'primary'" :style="{ marginLeft : '5px'}" @click="unSelectBtn">선택취소</Button>
                    <Button :theme-color="'primary'" :style="{ marginLeft : '5px'}" @click="undoBtn">미지정</Button>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '170px'}">
                    <Button :theme-color="'primary'" :style="{ marginLeft : '5px'}" @click="resetBtn">새로고침</Button>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        ref="resetCycle"
                        :dataNm="'resetCycle'"
                        :disabled="false"
                        :defaultchecked="false"
                        @checkbox-set="chkVal"
                      ></Checkbox>
                    </div>
                    <InputText
                      ref="resetCycleInput"
                      :dataNm="'resetCycleInput'"
                      :style="{ width: '30px', marginLeft: '5px'}"
                      @input-text-set="setResetCycleInput"
                    />
                    <label>&nbsp;분, 간격 새로고침(1분에서 99분사이)</label>
                  </div>
                  <div class="form-group" :style="{ marginLeft : '10px'}">
                    <div class="form-chk">
                      <Checkbox
                        ref="inspectionHis"
                        :dataNm="'inspectionHis'"
                        :disabled="false"
                        :defaultchecked="false"
                        @checkbox-set="chkVal"
                      ></Checkbox>
                    </div>
                    <label>&nbsp;점검 이력 보기</label>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="1" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                >{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
        <v-col :cols="12" :lg="12" :class="'divListWapper'" :style="{ height: '60%' }">
          <Card ref="gridCard" :style="{ height: '100%' }"> <!-- ref변수명으로 들어간 index는 나중에 다른값으로 변경? -->
            <CardBody :style="{ width: '100%', height: '100%' }">
                <!-- <v-row>
                    <v-col cols="2" align="left">
                        <CardTitle>장비명칭</CardTitle>
                    </v-col>
                </v-row> -->
              <div :ref="'GridFir'" :style="{ height: 'calc(100% - 33px)' }">
                <div :ref="'gridArea'+index" v-for="(gridDataList, index) in gridDataList[0]" :key="index"
                  :style="{ width: '20%',height: 'calc(100% - 33px)', float:'left', marginBottom: '45px'}">

                  <CardTitle>{{ index+"번 장비" }}</CardTitle>
                  <KendoGrid 
                    :ref="'rowGrid'+index"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.GridFir"
                    :sortable="true"
                    :columns="GridFirHeaderParam.gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :isPaging="false"
                    :scrollable="true"
                    :cell-render="'myTemplate'"
                    :dataItem="gridData.GridFir+index"
                    :dropPosition="dropPosition"
                    :class="isDragging"
                    :style="{ width: '100%' }"
                    @gridddchang="rowDdChange"
                    @gridrowclick="onRowClick"
                    @griditemchange="griditemchange"
                    @dragHandler="dragHandler"
                    @pressHandler="pressHandler"
                    @releaseHandler="releaseHandler"
                    >
                  </KendoGrid>
                </div>
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :cols="12" :lg="12" :class="'divListWapper2'" :style="{ height: '40%' }">
          <Card ref="gridCard" :style="{ height: '100%' }"> <!-- ref변수명으로 들어간 index는 나중에 다른값으로 변경? -->
            <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row>
                    <v-col cols="2" align="left">
                        <CardTitle>장비명칭</CardTitle>
                    </v-col>
                </v-row>
                <div :ref="'GridSec'" :style="{ height: 'calc(100% - 33px)'}">
                  <KendoGrid
                    ref="rowGridSec"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.GridSec"
                    :sortable="true"
                    :columns="GridSecHeaderParam.gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :isPaging="false"
                    :scrollable="true"
                    :cell-render="'myTemplate'"
                    :dataItem="gridData.GridSec"
                    :dropPosition="dropPosition"
                    :class="isDragging"
                    :style="{float:'left'}"
                    @gridddchang="rowDdChange"
                    @gridrowclick="onRowClick"
                    @griditemchange="griditemchange"
                    @dragHandler="dragHandler"
                    @pressHandler="pressHandler"
                    @releaseHandler="releaseHandler">
                  </KendoGrid>
                </div>
            </CardBody>
          </Card>
        </v-col>
    </v-row>

    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import Checkbox from "@/components/common/input/Checkbox";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";

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
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    DatePicker,
    Checkbox
  },
  data() {
    return {
      columns: [],
      gridHeight: "100%",
      gridData: {
        GridFir:[],
        GridSec:[],
      },
      gridOriData: {
        GridFir:[],
        GridSec:[],
      },
      workCenterList: [
        {
          text: '전체',
          id: '',
        }
      ],
      equipmentList: [],
      equipmentValue: '',
      startDate: new Date(),
      colunmFix: "Fix",
      colunmFixInput: "",
      nextSearc: "",
      isReadOnly: false,
      resetCycle: "Reset",
      resetCycleInput: "",
      inspectionHis: "IptHis",
      selectedField: "selected",
      selected: { 
        GridFir: null,
        GridSec: null
      },
      GridFirHeaderParam: {
        gridid: 'dgvProductionPlanStatus',
        gridHeader: [],
        noFirstCheck: true,
      },
      GridSecHeaderParam: {
        gridid: 'dgvProductionPlanStatus',
        gridHeader: [],
        noFirstCheck: true,
      },
      workCenterValue: '',
      certificationType: '',
      certificationSubType: '',
      certificationId: '',
      userName: '',
      workCenter: '',

      top: 0,
      left: 0,
      targetTopOffset: null,
      targetLeftOffset: null,
      showDropHints: false,
      dropPosition: '',
      dropPosition2: '',
      activeItem: {},
      targetId: 0,
      orgTargetRowIdx: '',
      gridIndex: '', // 그리드 가변용 test
      customIdx: 2, // 그리드 가변용 test
      gridDataList: [], // 그리드 가변용 test
      };
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("create");
  },
  async beforeMount() {
    // this.getGridData();
    console.log("beforeMount");
    
  },
  async mounted() {
    console.log("mounted::::", this.gridDataList);

    await this.getWorkCenterListData();
    await this.getHeaderMulti(
      this.GridFirHeaderParam, 
      this.$refs.GridFir,
    );
    await this.getHeaderMulti(
      this.GridSecHeaderParam,
      this.$refs.GridSec
    );
    await this.getGridData();

    // await this.getGridData('mount'); 
    
    // await this.setGridData();

    const gridBody = document.getElementsByClassName("k-grid-content")[0];
    gridBody.addEventListener("mouseover", this.gridMouseover, false);
    gridBody.addEventListener("mouseout", this.gridMouseout, false);

  },
  async updated() {
    console.log("updated 그리드 가변용:::",this.gridDataList)
    // this.gridDataList[0].forEach((item, index) => {
    //   console.log(`Index: ${index}, Data:`, item);
    //   const gridDataNm = "rowGrid"+index;
    //   console.log("forEach gridDataNm:::::::", gridDataNm);
    //   this.$refs[gridDataNm].gridData.GridFir.push(item);
    //   console.log("forEach:::this.$refs[gridDataNm]::::", this.$refs[gridDataNm].gridData.GridFir);
    //   // this.gridData[gridDataNm].push(data);
    //   // this.gridOriData[gridDataNm] = JSON.parse(JSON.stringify(this.gridData.GridFir));
    //   // console.log("Index:: ", index + "Data:: ", item);
    //   // 여기서 item은 현재 항목의 데이터를 나타냅니다.
    //   // 필요한 작업을 수행할 수 있습니다.
    // });
  },
  unmounted() {
      const gridBody = document.getElementsByClassName("k-grid-content")[0];
      gridBody.removeEventListener("mouseover", this.gridMouseover, false)
      gridBody.removeEventListener("mouseout", this.gridMouseout, false)
  },

  computed: {
    async setGridData() {
      console.log("setGridData:::::::func:::");
    },

    isDragging() {

      const element = document.getElementsByClassName("k-grid k-grid-md")[0];
      const reElement = document.getElementsByClassName("k-grid k-grid-md dragging")[0];
      if(element !== undefined) {
        if(reElement !== undefined) {
          element.classList.remove('dragging');
        } else {
          element.classList.add('dragging');
        }
      }
      // console.log("isDragging:::::::", this.activeItem.idx);
      return {
        'dragging': this.activeItem.idx
      };
    }
  },
  watch: {},
  methods: {

    // WorkCenter 콤보 change
    workCenterChange(event) {
      this.workCenterValue = event.value;
    },

    // 설비 Combobox 선택
    selectEquipmentCombo(event) {
      this.equipmentValue = event.value;
    },

    // DatePicker 변경
    dateChange(e){
      this[e.target.name] = e.value;
    },

    // 검색 ComboBox 변경 시
    comboChange(nm, val) {
        this[nm] = val;
    },

    // 검색 INPUT 변경 시
    searchInput(nm, val) {
        this[nm] = val;
    },

    // 열 고정 INPUT 변경 시
    setColunmFixInput(nm, val) {
        this[nm] = val;
    },

    // 찾기 INPUT 변경 시
    nextSearchBtnInput(nm, val) {
        this[nm] = val;
    },

    //찾기 BUTTON 클릭시
    nextSearchBtn() {
        alert(this.nextSearc);
    },

    // 선택 버튼 클릭시
    selectBtn() {
        alert("선택!");
    },

    // 이동 버튼 클릭시
    moveBtn() {
        alert("이동!");
    },

    // 선택취소 버튼 클릭시
    unSelectBtn() {
        alert("선택취소!");
    },

    // 미지정 버튼 클릭시
    undoBtn() {
        alert("미지정!");
        // this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
        // this.$nuxt.$emit("iccReset");
    },

    // 새로고침 버튼 클릭시
    resetBtn() {
      alert("새로고침!");  
    },

    // 새로고침 주기 INPUT 변경시
    setResetCycleInput(nm, val) {
        this[nm] = val;
    },

    // 조회 버튼
    async searchBtn() {
      this.getGridData();
      // this.setGridData();
    },

    

    chkVal(nm, val) {
        // nm : Fix / Reset / IptHis
        if(this[nm] === "Fix") {
            alert("열고정:::" + val);
        } else if(this[nm] === "Reset") {
            alert("새로고침:::" + val);
        } else {
            alert("점검이력:::" + val);
        }
    },

    saveBtn() {
      const saveData = this.gridData.GridFir.filter(x => x.rowStat !== 'N').map(x => {
          return {
            ...x,
            _rowstatus: x.rowStat,
            CERTIFICATIONDATE: Utility.setFormatDate(x.CERTIFICATIONDATE, "YYYYMMDD"),
            CHANGEOPERDATE: Utility.setFormatDate(x.CHANGEOPERDATE, "YYYYMMDD"),
            WORKCENTER: x.rowStat == 'C' ? x.WORKCENTER : x.WORKCENTERID,
            CERTIFICATIONTYPE: x.rowStat == 'C' ? x.CERTIFICATIONTYPENAME : x.CERTIFICATIONTYPE,
            CERTIFICATIONSUBTYPE: x.rowStat == 'C' ? x.CERTIFICATIONSUBTYPENAME : x.CERTIFICATIONSUBTYPE,
            CERTIFICATIONSTATE: this.isNullOrEmpty(x.DISQUALIFICATIONDATE)? "RUN" : "DEL",
          };
        });

        if(saveData.length > 0) {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnCertificationManagement',
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

    // 검색조건 WorkCenter 콤보박스 데이터 가져오기
    async getWorkCenterListData(){
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00003',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          AREATYPE: 'WorkCenter',
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
            this.workCenterList.push({ id : data[i].CODE, text : data[i].NAME });
            this.workCenterValue = this.workCenterList[0];
          }
        }
      });
    },

    // 설비 Combobox
    async getEquipmentListData(res) {
        this.mesGet({
            apiKey: 'mes/common/getqueryresult',
            queryId: 'GetOMProcessAvailableEquipment',
            sendParam: {
            plantid: this.$auth.$state.user.plantId,
            processId: res
            },
        }).then(res => {
            this.equipmentList = res;
            this.equipmentValue = '';
        });
    },
    // getGridDataInit() {
    //   this.columns = [
    //     { field: 'reorder',  editable: false, title: '', width: '50px', cell:"myTemplate"},
    //   ];
    //   this.getGridDataInit();
    // },
    // ========================================================================================================================


    // 그리드 데이터 가져오기
    async getGridData(idx) {
      // this.gridOriData.GridFir = [];
      // this.gridData.GridFir = [];
      this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetProductionPlanStatus',
          sendParam: {
              plantID: this.$auth.$state.user.plantId,
              certificationType: this.certificationType,
              certificationSubType: this.certificationSubType,
              certificationId: this.certificationId,
              userName: this.userName,
              workcenter: this.workCenterValue.id
          },
      }).then(res => {
          const data = res.map((x, idx) => {
              return {
                  ...x,
                  rowStat: 'N',
                  selected: false,
                  idx: idx,
                  inEdit: true,
                  textOnly: true,
                  newRow: false,
                  resizable: true,
                  disable: true,
                  disabledDate: true,
                  WORKCENTERID: x.WORKCENTER,
                  // WORKCENTER: this.headerParam.enumComboBox[0].dataItem.filter(y=>x.WORKCENTER == y.ENUMVALUE)[0].ENUMVALUENAME,
                  CERTIFICATIONSTATE: x.CERTIFICATIONSTATE == 'DEL' ? '자격상실' : '',
              }; 

              
          });

        // this.$nuxt.$emit('iccReset');
        // console.log("그리드 gridFlag:::",gridFlag)

        this.gridData.GridFir = data;
        this.gridOriData.GridFir = JSON.parse(JSON.stringify(this.gridData.GridFir));
        this.gridData.GridSec = data;
        this.gridOriData.GridSec = JSON.parse(JSON.stringify(this.gridData.GridSec));
        this.gridDataList.push(data); // 그리드 가변용

        
        console.log("그리드 가변용:::",this.gridDataList)
      });
    }, 

    //그리드아이템 가변용
    // async setGridData() {
    //   console.log("setGridData:::::::func:::");
    //   await this.gridDataList[0].forEach((item, index) => {
    //   console.log(`Index: ${index}, Data:`, item);
    //   const gridDataNm = "rowGrid"+index;
    //   const gridDataItems = this.$refs[gridDataNm];
    //   console.log("forEach:::::::", gridDataItems);
    //   // this.gridData[gridDataNm].push(data);
    //   // this.gridOriData[gridDataNm] = JSON.parse(JSON.stringify(this.gridData.GridFir));
    //   // console.log("Index:: ", index + "Data:: ", item);
    //   // 여기서 item은 현재 항목의 데이터를 나타냅니다.
    //   // 필요한 작업을 수행할 수 있습니다.
    // });
    // },

    

    // 그리드 INPUT 제외 수정
    rowDdChange(e, name, dataItem){
      const idx = this.gridData.GridFir.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData.GridFir));

      if(name == 'CHANGEOPERDATE') {
        data[idx][name] = e.value
        
        const expectDate = new Date(e.value);

        expectDate.setFullYear(expectDate.getFullYear() + 1);
        
        data[idx].DISQUALIFICATIONEXPECTDATE = Utility.setFormatDate(expectDate, "YYYYMMDD")
        // console.log(expectDate);
      }


      
      data[idx] = { ...data[idx], [name]: e.value };
      if(data[idx].rowStat === 'N') {
          data[idx].rowStat = 'U';
      }
      
      if(data[idx].rowStat === 'U' && !this.gfn_ChkOriginalData(this.GridFirHeaderParam.gridHeader, data, this.gridOriData, idx)) {
          // data[idx].rowStat = 'N';
      }
      this.gridData.GridFir = data;
    },


    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData.GridFir));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.GridFirHeaderParam.gridHeader, data, this.gridOriData, idx)) {
        data[idx].rowStat = "N";
      }
        this.gridData.GridFir = data;
    },


    
    // 그리드 ROW 선택
    onRowClick(event){
      const selectedIdx = event.dataItem.idx;
        this.gridData.GridFir = this.gridData.GridFir.map(item => {
            return {
            ...item,
            selected: item.idx === selectedIdx ? true : false,
            };
        });

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

    dragHandler(dataItem, event) {
      if(this.orgTargetRowIdx === undefined || this.orgTargetRowIdx == "") { // 최초 rowIdx를 설정
        this.orgTargetRowIdx = event.originalEvent.target.parentElement.rowIndex; 
      }
      this.top = event.pageY + 10;
      this.left = event.pageX;
      this.targetLeftOffset = this.getGridReference().offsetLeft + this.getGridReference().offsetLeft/2;
      this.targetTopOffset = this.getTargetTopOffSet(event);
      this.dropPosition = this.getDropPosition(event)
      
      this.showDropHints = true;
    },
    getDropPosition: function(event){
      const targetRowIdx = event.originalEvent.target.parentElement.rowIndex; // 셀영역 rowIdx
      const iconRowIdx = event.originalEvent.target.parentElement.parentElement.rowIndex; // 아이콘영역의 부모 rowIdx
      
      /* targetRowIdx나 iconRowIdx의 값이 있으면 이동한것. 
        따라서 this.orgTargetRowIdx(최초row)와 targetRowIdx 혹은 iconRowIdx 를 비교하여 
        below인지 above인지 설정
      */
      // console.log("targetRowIdx >>>>>", targetRowIdx);
      // console.log("iconRowIdx >>>>>>", iconRowIdx);
      // console.log("orgTargetRowIdx >>>>>>", this.orgTargetRowIdx);
      // if(targetRowIdx !== undefined && targetRowIdx != this.orgTargetRowIdx) {
      //   return this.dropPosition = targetRowIdx > this.orgTargetRowIdx? "below":"above";
      // } else if(iconRowIdx !== undefined && iconRowIdx != this.orgTargetRowIdx) {
      //   return this.dropPosition = iconRowIdx > this.orgTargetRowIdx? "below":"above";
      // } else {
      //   return this.dropPosition = "below";
      // }
      // return this.dropPosition = event.offsetY >= event.originalEvent.target.parentElement.clientHeight/2? "below":"above";
    },
    pressHandler(dataItem) {
      this.activeItem = dataItem;
      // console.log(dataItem)
    },
    releaseHandler(dataItem, event) {
  
      const targetIndex = event.originalEvent.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('k-card-title')[0].innerText.match(/\d+/)[0];
      console.log("releaseHandler>>>>>>>>>", this.$refs['rowGrid'+targetIndex] + "index>>>>>>>", targetIndex);
      console.log("releaseHandler>>>>>>>>>", event);
      this.showDropHints = false;
      // console.log("dropPosition >>>>>>", this.dropPosition);
      const gridItems = this.$refs['rowGrid'+targetIndex][0]._props.gridItems;
      const reorderedData = this.reorderData(event, gridItems, this.activeItem);
      this.gridData.GridFir = reorderedData;
      console.log(reorderedData)
      this.activeItem = {};
      this.orgTargetRowIdx = "";
    },
    // gridMouseover(e) {
    //      this.showDragClueContent = true;
    // },
    // gridMouseout(e){
    //     this.showDragClueContent = false;
    // },
    getGridReference(){
      return document.querySelector(".k-grid");
    },

    // 핸들러 테스트중 ======================================
    // reorder(dataItem) {
    //   console.log("reorder>>>>>>>>>>>>>>",dataItem);
    //   let that = this;

    //   if (that.activeItem === dataItem) {
    //       return;
    //   }

    //   let reorderedData = this.items.slice();
    //   let reorderedDataItemsArr = this.items2.slice();
    //   let prevIndex = reorderedData.findIndex((p) => p === that.activeItem);
    //   let nextIndex = reorderedData.findIndex((p) => p === dataItem);

    //   if (prevIndex !== -1) {
    //       reorderedData.splice(prevIndex, 1);
    //       reorderedData.splice(nextIndex, 0, this.activeItem);
    //   } else {
    //       reorderedData.push(this.activeItem);
    //       const itemsArrAcriveElementIndex = reorderedDataItemsArr.findIndex(
    //           (p) => p === that.activeItem
    //       );
    //       reorderedDataItemsArr.splice(itemsArrAcriveElementIndex, 1);
    //   }
    //   that.items = reorderedData;
    //   that.items2 = reorderedDataItemsArr;
    // },
    // setActive(dataItem) {
    //   console.log("setActive>>>>>>>>>>>>>>",dataItem);
    //   this.activeItem = dataItem;
    // },
    // updateRemote() {
    //   console.log(
    //       'Drag end. Send request to remote to update the source order'
    //   );

    //   // Send request to remote to update the source order
    // },

    // addRecordToEmptyGrid: function (dataItem) {
    //     const that = this;
    //     this.items2.push(this.activeItem);

    //     let reorderedDataItemsArr = this.items.slice();
    //     const itemsArrAcriveElementIndex = reorderedDataItemsArr.findIndex(
    //         (p) => p === that.activeItem
    //     );
    //     reorderedDataItemsArr.splice(itemsArrAcriveElementIndex, 1);
    //     this.items = reorderedDataItemsArr;
    // },
  },
};

const defaultData = {};
</script>
<style>
.dropdown-menu {
    min-width: 1rem !important;
}

html .k-grid.dragging tbody tr:hover td {
    /* background-color: #f5a3a3 !important; */
    /* border-bottom-color: red;
    border-bottom-width: 3px; */
    background-color: rgb(240, 200, 200);
}

</style>