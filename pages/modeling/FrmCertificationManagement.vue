<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00695") }}</li> <!-- 자격 인증관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00696") }}</label><!-- 인증번호 -->
                    <InputText
                    :dataNm="'certificationId'"
                    @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00697") }}</label> <!-- 인증명  -->
                    <MesSelectBox
                      :allYN="true"
                      :enumID="'certificationType'"
                      :dataNm="'certificationType'"
                      :style="{ width: '160px' }"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00698") }}</label> <!-- 인증구분  -->
                    <MesSelectBox
                      :allYN="true"
                      :enumID="'certificationSubType'"
                      :dataNm="'certificationSubType'"
                      :style="{ width: '160px' }"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00681") }}</label> <!-- Work Center  -->
                    <DropDownList
                      ref="cmbWorkCenter"
                      :style="{ width: '250px' }"
                      :data-items="workCenterList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="workCenterValue"
                      @change="workCenterChange"
                      >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00699") }}</label><!-- 인증자 -->
                    <InputText
                    :dataNm="'userName'"
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
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row>
                  <v-col cols="4" align="left">
                      <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00695") }}</CardTitle><!-- 자격인증관리 -->
                  </v-col>
                  <v-col cols="8" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" @click="dateUpdateBtn">{{ $t("MES_CommLang.MES_CommLang_00724") }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" @click="linkBtn">링크</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn" >undo</Button>
                  </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :gridPageData="gridPageData"
                  :sortable="true"
                  :columns="headerParam.gridHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :isPaging="true"
                  :reSetPage="this.reSetPage"
                  :scrollable="false"
                  :gridDropDownList="headerParam.enumComboBox"
                  :pkNotEditArr="headerParam.pkColumn"
                  @pageChangeEvent="pageChangeEvent"
                  @gridddchang="rowDdChange"
                  @gridrowclick="onRowClick"
                  @griditemchange="griditemchange"
                  @gridButtonClick="gridButtonClick"
              />
              </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <GetUserModal
        ref="UserModal"
        v-if="UserModalVisible"
        :visibleDialog="UserModalVisible"
        @visibleDialog="(val) => UserModalVisible = val"
        @selectUser="selectUser"
      />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import MesSelectBox from '@/components/common/select/MesSelectBox';
import GetUserModal from "@/components/common/modal/GetUserModal.vue";

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
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    DropDownList,
    MesSelectBox,
    DatePicker,
    GetUserModal,
  },
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      workCenterList: [
        {
          text: '전체',
          id: '',
        }
      ],
      selectedField: "selected",
      headerParam: {
        gridid: 'dgvCertificationManagement',
        gridHeader: [],
        noFirstCheck: true,
        enumComboBox: [ {dataVal:'WORKCENTER', dataItem:[]},'CERTIFICATIONTYPE', 'CERTIFICATIONSUBTYPE',],
        pkColumn: ['CERTIFICATIONID']
      },
      workCenterValue: '',
      certificationType: '',
      certificationSubType: '',
      certificationId: '',
      userName: '',
      workCenter: '',
      UserModalVisible: false,
      selectedIndex: '', 
      selectedColumn: '',
      reSetPage: false,
      
    }
  },
  created() {
  },
  async mounted() {
    await this.getWorkCenterListData();
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getGridData();
  },
  computed: {

  },
  watch: {},
  methods: {

    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },

    // 검색 ComboBox 변경 시
    comboChange(nm, val) {
          this[nm] = val;
    },

    // 검색 INPUT 변경 시
    searchInput(nm, val) {
          this[nm] = val;
    },


    // WorkCenter 콤보 change
    workCenterChange(event) {
      this.workCenterValue = event.value;
    },

    // 그리드 사용자 검색 버튼
    gridButtonClick(e, name, item){
      this.UserModalVisible = true;
      this.selectedIndex = item.idx;
      this.selectedColumn = name;
    },

    // 사용자 검색 팝업 사용자 선택
    selectUser(data){
      this.gridData.map(x => {
        if(x.idx == this.selectedIndex){
          x[this.selectedColumn] = data.userId;
          x.USERNAME = data.name;
        }
      })
    },

    // 조회 버튼
    async searchBtn() {
      this.reSetPage = true;
      this.getGridData();
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
        this.headerParam.enumComboBox[0].dataItem = res.map(x => {
          return {
            ENUMVALUE : x.CODE,
            ENUMVALUENAME : x.NAME
          }
        });
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

    // 그리드 데이터 가져오기
    async getGridData() {

      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
          apiKey: 'mes/common/customquerypaging',
          queryId: 'GetCertificationManagement',
          sendParam: {
              plantID: this.$auth.$state.user.plantId,
              certificationType: this.certificationType,
              certificationSubType: this.certificationSubType,
              certificationId: this.certificationId,
              userName: this.userName,
              workcenter: this.workCenterValue.id,
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
                  textOnly: true,
                  newRow: false,
                  resizable: true,
                  disable: true,
                  disabledDate: true,
                  CERTIFICATIONID: x.CERTIFICATIONID.concat("호"), 
                  WORKCENTERID: x.WORKCENTER,
                  WORKCENTER: this.headerParam.enumComboBox[0].dataItem.filter(y=>x.WORKCENTER == y.ENUMVALUE)[0].ENUMVALUENAME,
                  CERTIFICATIONSTATE: x.CERTIFICATIONSTATE == 'DEL' ? '자격상실' : '',
              }; 

              
          });

        this.$nuxt.$emit('iccReset');
        this.gridPageData = paging;
        this.gridData = data;
        this.gridOriData = JSON.parse(JSON.stringify(this.gridData));
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
    
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const today = new Date().toJSON().slice(0,10).replace(/-/g,'');
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = {
        inEdit: true, 
        newRow: true,
        selected: false, 
        PLANTID: this.$auth.$state.user.plantId, 
        rowStat: "C",
        newRowUUid: newRowUUid,
        idx: this.gridData.length,
        change: true, // 검색 버튼 나오도록
        CERTIFICATIONTYPE: '',
        CERTIFICATIONSUBTYPE: '',
        WORKCNETERNAME: '',
        CERTIFICATIONSTATE: '',
        CERTIFICATIONDATE: today,  
        CERTIFICATIONWORKER: '',
        USERNAME:'',
        disabledDate: true,

      };
      this.gridData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },

    // 날짜 입력 버튼
    dateUpdateBtn(){
      this.gridData.filter(x => x.selected).map(x=> {
        x.CHANGEOPERDATE = this.isNullOrEmpty(x.CHANGEOPERDATE)?
                            new Date():x.CHANGEOPERDATE.substring(0,4)+'-'+x.CHANGEOPERDATE.substring(4,6)+'-'+x.CHANGEOPERDATE.substring(6,8);
        x.disabledDate = false;
      })
    },

    saveBtn() {
      const saveData = this.gridData.filter(x => x.rowStat !== 'N').map(x => {
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

    //전체excel
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetCertificationManagement',
        sendParam: {
          plantID: this.$auth.$state.user.plantId,
          workCenter:this.workCenterValue.id,
          certificationType: this.certificationType,
          certificationSubType: this.certificationSubType,
          certificationId: this.certificationId,
          userName: this.userName,
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
        queryId: 'GetCertificationManagement',
        sendParam: {
          plantID: this.$auth.$state.user.plantId,
          workCenter:this.workCenterValue.id,
          certificationType: this.certificationType,
          certificationSubType: this.certificationSubType,
          certificationId: this.certificationId,
          userName: this.userName,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },

    linkBtn() {

    },

    undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
    },

    // 그리드 INPUT 제외 수정
    rowDdChange(e, name, dataItem){
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name == 'CHANGEOPERDATE') {
        data[idx][name] = e.value
        
        const expectDate = new Date(e.value);

        expectDate.setFullYear(expectDate.getFullYear() + 1);
        
        data[idx].DISQUALIFICATIONEXPECTDATE = Utility.setFormatDate(expectDate, "YYYYMMDD")
        console.log(expectDate);
      }


      
      data[idx] = { ...data[idx], [name]: e.value };
      if(data[idx].rowStat === 'N') {
          data[idx].rowStat = 'U';
      }
      
      if(data[idx].rowStat === 'U' && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)) {
          // data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },


    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)) {
        data[idx].rowStat = "N";
      }
        this.gridData = data;
    },


    
    // 그리드 ROW 선택
    onRowClick(event){
      const selectedIdx = event.dataItem.idx;
        this.gridData = this.gridData.map(item => {
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


    

    

  },
}
</script>