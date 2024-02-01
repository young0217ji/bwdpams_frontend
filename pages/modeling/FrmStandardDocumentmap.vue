<template>
  <div>
      <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00654") }}</li> <!-- 공정별 표준문서 관리 -->
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
      <v-col :cols="3"  :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col align="left">
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00056") }}</CardTitle><!--공정목록-->
              </v-col>
            </v-row>
            <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid1"
                :gridHeight="gridHeight"
                :gridItems="processGridData"
                :sortable="true"
                :columns="processHeaderParam.gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :isPaging="false"
                :scrollable="true"
                @gridrowclick="processGridClick"
              />           
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="9" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col cols="9">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00630") }}</label> <!-- 표준구분  -->
                    <MesSelectBox
                      :allYN="false"
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
              <v-col cols="3" align="right">
                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button>
                <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn" >undo</Button>
              </v-col>      
            </v-row>
            <v-row :cols="12" :style="{ height: 'calc(100% - 39px)' }">
              <v-col cols="5">
                <Card ref="gridCard" :style="{ height: '100%' }">
                  <CardBody :style="{ width: '100%', height: '100%' }">
                    <v-row>
                      <v-col cols="12" align="left">
                          <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00682") }}</CardTitle><!--시스템 등록 문서-->
                      </v-col>
                    </v-row>
                    <div ref="divWrapper2" style="height: calc(100% - 33px)">
                      <KendoGrid 
                        ref="rowGrid"
                        :gridHeight="gridHeight"
                        :gridItems="registGridData"
                        :sortable="true"
                        :columns="headerParam1.gridHeader"
                        :resizable="false"
                        :edit-field="'inEdit'"
                        :isPaging="false"
                        :selected-field="selectedField"
                        @gridrowclick="registGridClick"
                        @selectionchange="onRegistSelectionchange"
                        @headerselectionchange="onRegistHeaderSelectionChange"

                      />
                    </div>
                  </CardBody>
                </Card>
              </v-col>
            <v-col :cols="1" :style="{ height: '100%'}" align="center">
              <div class="between-opt-align" :style="{ height: '100%'}">
                <div>
                  <Button :theme-color="'secondary'" :icon="'arrow-chevron-right'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00522") }}</Button> <!-- 등록 -->
                </div>
                <div>
                  <Button :theme-color="'secondary'" :icon="'arrow-chevron-left'" @click="delBtn">{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                </div>
              </div>
            </v-col>
    
            <v-col :cols="6" :style="{ height: '100%' }">
              <Card ref="gridCard" :style="{ height: '100%' }">
                <CardBody :style="{ width: '100%', height: '100%' }">
                  <v-row>
                      <v-col cols="12" align="left">
                          <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00683") }}</CardTitle><!--현장 조회 문서-->
                      </v-col>
                    </v-row>
                  <div ref="divWrapper3" style="height: calc(100% - 33px)">
                    <KendoGrid 
                      ref="rowGrid"
                      :gridHeight="gridHeight"
                      :gridItems="standardGridData"
                      :sortable="true"
                      :columns="headerParam2.gridHeader"
                      :checkHeaderArr="headerParam2.checkBox"
                      :resizable="false"
                      :edit-field="'inEdit'"
                      :isPaging="false"
                      :selected-field="selectedField"
                      @gridrowclick="standardGridClick"
                      @selectionchange="onStandardSelectionchange"
                      @headerselectionchange="onStandardHeaderSelectionChange"
                    />
                  </div>
                </CardBody>
              </Card>
            </v-col>
          </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop
    ref="confirmPop"
    :visibleDialog="false"
    :callBack="() => {}"
    />
  </div>


</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import InputText from "@/components/common/input/InputText";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import MesSelectBox from '@/components/common/select/MesSelectBox';

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
  MesSelectBox,
},
data() {
  return {
    gridHeight: "100px",
    selectedField: "selected",
    processGridData: [],
    processSelected: {},
    processHeaderParam: {
      gridid: "dgvStandardDocumentProcess",
      noFirstCheck: true,
      noRowstat: true,
      header: {},
    },
    processList: [], // 공정명 콤보박스
    processValue: '',
    registOriData: [],
    standardOriData: [],
    registGridData:[],
    standardGridData:[],
    headerParam1:{   
      gridid: 'dgvRegistrationDocument', // 시스템 등록 문서
      gridHeader: [],
    },
    headerParam2:{
      gridid: 'dgvStandardDocumentmap', // 현장 조회 문서
      gridHeader: [],
      checkBox: ['USEFLAG',],
      xOverflowYn: true,
    },
    standardCategory: '',
    standardCategoryList: [], // 표준구분 콤보박스
    standardCategoryValue: '',
    documentId:'',
    documentName:'',
    STANDARDDOCUMENTID : '',
    selectedListId: '',
  }
},
created() {},
async mounted() {
  await this.getHeaderMulti(this.processHeaderParam, this.$refs.divWrapper1);
  await this.getHeaderMulti(this.headerParam1, this.$refs.divWrapper2);
  await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper3);
  await this.getProcessGridData();
  this.comboChange('standardCategory', 'WorkStandard');
},
computed: {

},
watch: {},
methods: {

  // 공정 목록 GRID 조회
  async getProcessGridData(){
    this.mesGet({
      apiKey: 'mes/common/customquery',
      queryId: 'GetProcessList',
      queryVersion: '00002',
      sendParam: {
        plantid: this.$auth.$state.user.plantId,
      },
    }).then(res => {
      const data = res.map((x, idx) => {
        return {
          ...x,
          selected: false,
          idx: idx,
          inEdit: false,
          newRow: false,
        };
      });
      this.processGridData = data;
    });

  },
  // 공정 목록 GRID 선택
  processGridClick(event){
    this.processSelected = event.dataItem;
    const selectedIdx = event.dataItem.idx;
    this.processGridData = this.processGridData.map(item => {
      return {
        ...item,
        selected: item.idx === selectedIdx ? true : false,
      };
    });
    this.selectedListId = event.dataItem.PROCESSID;
    this.getRegistrationGridData();
    this.getStandardDocumentGridData();
  },


  // 그리드 로우 클릭
  registGridClick(event){
    this.registGridData.forEach((x) => (x.selected = false));
        event.dataItem[this.selectedField] = true;
  },

  standardGridClick(event) {
    this.standardGridData.forEach((x) => (x.selected = false));
        event.dataItem[this.selectedField] = true;
  },

  // 맨앞 checkBox 클릭
  onRegistSelectionchange(event) {
    event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
  },

  onStandardSelectionchange(event) {
    event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
  },

  // header checkbox 클릭
  onRegistHeaderSelectionChange(event) {
    let checked = event.event.target.checked;
      this.registGridData = this.registGridData.map(item => {
        return { ...item, selected: checked };
    });
  },

  onStandardHeaderSelectionChange(event) {
    let checked = event.event.target.checked;
      this.standardGridData = this.standardGridData.map(item => {
        return { ...item, selected: checked };
      });
  },

  // 검색 ComboBox 변경 시
  comboChange(nm, val) {
        this[nm] = val;
        this.getRegistrationGridData();
        this.getStandardDocumentGridData();
  },

  // 검색 INPUT 변경 시
  searchInput(nm, val) {
        this[nm] = val;
  },


  // 조회 버튼 클릭
  searchBtn(){
    this.getRegistrationGridData();
  },


  // 시스템 등록 문서 그리드 데이터 가져오기
  async getRegistrationGridData() {
    this.mesGet({
      apiKey: 'mes/common/customquery',
      queryId: 'GetRegistrationDocumentList',
      sendParam: {
        plantID: this.$auth.$state.user.plantId,
        standardcategory: this.standardCategory,
        processid: this.selectedListId,
        documentid: this.documentId,
        documentname: this.documentName,
      },
    }).then(res => {
      const data = res.map((x, idx) => {
        return {
          ...x,
          rowStat: 'N',
          selected: false,
          idx: idx,
          inEdit: false,
          newRow: false,
        };
      });
      this.$nuxt.$emit("iccReset");
      this.registGridData = data;
    });

  },



  // 현장 조회 문서 그리드 데이터 가져오기
  async getStandardDocumentGridData() {
    this.standardOriData = [];
    this.standardGridData = [];
    this.mesGet({
      apiKey: 'mes/common/customquery',
      queryId: 'GetStandardDocumentmap',
      sendParam: {
        plantID: this.$auth.$state.user.plantId,
        standardcategory: this.standardCategory,
        processid: this.selectedListId,
      },
    }).then(res => {
      const data = res.map((x, idx) => {
        return {
          ...x,
          rowStat: 'N',
          selected: false,
          idx: idx,
          inEdit: false,
          newRow: false,
        };
      });
      this.$nuxt.$emit("iccReset");
      this.standardOriData = data;
      this.standardGridData = data;
    });

  },


  // 등록 버튼 클릭
  addBtn() {
    if (this.isEmptyObject(this.processSelected)) {
      this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00226')); /* 알림, 시작공정을 선택해주세요. */
    }else{
    const data = this.registGridData.filter(x => x.selected).map(x => {
      if(this.standardGridData.filter(y => 
        y.PROCESSID==this.processSelected.PROCESSID 
        && y.STANDARDCATEGORY==x.STANDARDCATEGORY 
        && y.DOCUMENTID== x.DOCUMENTID).length==0)
      {
        this.standardGridData.push({
          ...x,
          rowStat: 'C',
          AREAID: this.processSelected.WORKCENTER,
          PROCESSID : this.processSelected.PROCESSID,
          USEFLAG : 'Yes', 
          selected : false,
        });
        this.registGridData.map((z,idx) => {
          if(x.idx == z.idx){
            this.registGridData.splice(idx,1);
          }
        });


      }
    });
  }
  },

  // 삭제 버튼 클릭
  delBtn() {
      const data = JSON.parse(JSON.stringify(this.standardGridData));
      this.standardGridData = data
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


  // 저장 버튼 클릭
  saveBtn() {
      const saveData = this.standardGridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

        const validata = this.mesValidation(
          this.headerParam2.gridHeader,
          this.standardGridData
        );
        if(!validata.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validata.msg); /* 알림 */
          return;
        }

        if(saveData.length > 0) {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnStandardDocumentmap',
            sendParam: saveData,
          }).then(result => {
            this.$nextTick(() => {
            this.getStandardDocumentGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
              this.getRegistrationGridData();
              this.getStandardDocumentGridData();
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
        queryId: 'GetStandardDocumentmap',
        sendParam: {
          plantID: this.$auth.$state.user.plantId,
          standardcategory: this.standardCategory,
          processid: this.selectedListId,
          gridid: this.headerParam2.gridid,
          gridqueryversion: "00001",
        },
      });
    },
    

    //unbo 버튼 클릭
    undoBtn() {
      // this.standardGridData = this.standardOriData.filter((x) => x.newRow !== true);
      //   this.$nuxt.$emit("iccReset")
    },


  } 

}
</script>