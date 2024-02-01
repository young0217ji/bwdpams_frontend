<template>
  <div>
      <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li> <!-- 생산계획 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00662") }}</li> <!-- 생산계획 설정 -->
    </ol>
      <v-row ref="searchFilter">
      <v-col :cols="12">
          <Card>
          <CardBody>
              <v-row no-gutters>
              <v-col :sm="9" :lg="10" align="left">
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t('MES_CommLang.MES_CommLang_00277')
                  }}</Button> <!-- 조회 -->
              </v-col>
              </v-row>
          </CardBody>
          </Card>
      </v-col>
      </v-row>

      <v-row ref="contents">
    <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
      <v-row :style="{ height: '100%' }">
        <v-col :cols="12" :class="'divList1'" :style="{ height: '50%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ height: '100%' }">
              <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00725") }}</CardTitle> <!-- 공정정보 -->
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                  <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn(list)">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBtn(list)" >{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                  <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn(list)" >undo</Button>
                </v-col>
              </v-row>

              <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }"> 
                <KendoGrid
                      ref="rowGrid1"
                      :gridHeight="gridHeight"
                      :gridItems="listGridData"
                      :sortable="true"
                      :columns="headerParam.gridHeader"
                      :resizable="false"
                      :edit-field="'inEdit'"
                      :selected-field="selectedField"
                      :isPaging="false"
                      :scrollable="true"
                      :checkHeaderArr="headerParam.checkBox"
                      @selectionchange="onListSelectionchange"
                      @gridrowclick="onListRowClick"
                      @gridddchang="listRowDdChange"
                      @griditemchange="listgriditemchange"
                      @headerselectionchange="onListHeaderSelectionChange"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>

        <v-col :cols="12" :class="'divList2'" :style="{ height: '50%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ height: '100%' }">
              <v-row>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00726") }}</CardTitle> <!-- 생산라인 -->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcel2">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn(detail)">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBtn(detail)" >{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn(detail)" >undo</Button> 
                  </v-col>
                </v-row>
              <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                      ref="rowGrid2"
                      :gridHeight="gridHeight"
                      :gridItems="detailGridData"
                      :sortable="true"
                      :columns="headerParam2.gridHeader"
                      :resizable="false"
                      :edit-field="'inEdit'"
                      :selected-field="selectedField"
                      :isPaging="false"
                      :scrollable="true"
                      :checkHeaderArr="headerParam2.checkBox"
                      :customCell="customCell"
                      :pkNotEditArr="headerParam2.pk"
                      @selectionchange="onDetailSelectionchange"
                      @gridrowclick="onDetailRowClick"
                      @gridddchang="detailRowDdChange"
                      @griditemchange="detailgriditemchange"
                      @headerselectionchange="onDetailHeaderSelectionChange"
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
    />
    <ConfirmPop
      ref="ConfirmPop"
    />
</div>

</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '../../components/common/input/InputText.vue';
import Checkbox from "@/components/common/input/Checkbox";
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
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
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    InputText,
    Checkbox,
  },
  props: {},
  data() {
    return {
      columns: [],
      gridHeight: "100px",
      listOriData: [],
      listGridData: [],
      selectedListId:'',
      detailOriData: [],
      detailGridData: [],
      selectedField: "selected",
      customCell: [ 'WORKCENTER'],
      headerParam: {
        gridid: "dgvProductionPlanList",
        rowStat: "",
        checkBox: ["MAINEQUIPMENTFLAG","USEFLAG"],
        gridHeader: [],
      },
      headerParam2: {
        gridid: "dgvProductionPlanDetailList",
        rowStat: "",
        checkBox: ["USEFLAG"],
        pk: ["PLANOPERID"],
        gridHeader: [],
      },
      list:'list',
      detail:'detail',
      workcenterComboList:[
        {
          dataVal: "WORKCENTER",
          dataItem: [],
          disable: false,
        },
      ],
    };
  },
  created() {
  },
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper1);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getGridComboList();
    await this.getListGridData();
  },
  computed: {
    
  },
  watch: {},
  methods: {

    // 조회 버튼 클릭
    searchBtn() {
      this.selectedListId = '';
      this.getListGridData();
    },
    
    // 생산계획 기준정보 설정 그리드 데이터 가져오기
    async getListGridData() {
      this.listOriData = [];
      this.listGridData = [];
      this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetProductionPlanSetList',
        queryVersion: '00001',
        sendParam: {
          plantId: this.$auth.$state.user.plantId,
   
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: x.PLANOPERID==this.selectedListId,
            idx: idx,
            inEdit: true,
            newRow: false,
          }
        });

        this.$nuxt.$emit('iccReset');
        this.listOriData = data;
        this.listGridData = data;
      })

    },

    // 라인별 생산계획 기준정보 설정 그리드 데이터 가져오기
    async getDetailGridData() {
      this.detailOriData = [];
      this.detailGridData = [];
      this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetProductionPlanSetList',
        queryVersion: '00002',
        sendParam: {
          plantId: this.$auth.$state.user.plantId,
          PLANOPERID: this.selectedListId,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          const customCell = {
            WORKCENTER: {
              type: 'combo',
              dataItem: this.workcenterComboList[0].dataItem,
              disable: false,
              readonly: true
            },
          }
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            customCell,
          }
        });

        this.$nuxt.$emit('iccReset');
        this.detailOriData = data;
        this.detailGridData = data;
      })
    },

    //그리드 콤보박스 리스트가져오기
    async getGridComboList(){
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetAreaList",
        queryVersion: "00002",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
      }).then((data) => {
          const combo = data.map(x => {
          return {
              ENUMVALUE: x.CODE,
              ENUMVALUENAME: x.NAME,
          }
          })
          this.workcenterComboList[0].dataItem = combo;
      })
    },


    //header checkbox 클릭
    onListHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.listGridData = this.listGridData.map(item => {
        return { ...item, selected: checked };
      });
    },

    onDetailHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.detailGridData = this.detailGridData.map(item => {
        return { ...item, selected: checked }
      });
    },


    // 그리드 로우 클릭
    onListRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.listGridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selectedListId = event.dataItem.PLANOPERID;
      this.getDetailGridData();
    },
    onDetailRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.detailGridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      })
      
    },

    //맨앞 checkBox 클릭
    onListSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    onDetailSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    // 추가 버튼 클릭
    addBtn(grid) {
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      if(grid==='list') {
        this.$refs.rowGrid1.skip = 0;
        const dataItem = {
          inEdit: true, 
          newRow: true,
          selected: false, 
          PLANTID: this.$auth.$state.user.plantId, 
          rowStat: "C",
          newRowUUid: newRowUUid,
          idx: this.listGridData.length,
          PLANOPERID: '',
          PLANOPERNAME: '',
          DRUNFLAG: '',
          DRUNFBUFFER: '',
          EQUIPMENTCOUNT: 0,
          MAXOPERATINGTIME: '',
          STDOPERATINGTIME: '',
          CYCLETIME: '',
          LEADTIME: '',
          USEFLAG: 'Yes',

        };
        this.listGridData.splice(0, 0, dataItem);
        this.detailGridData = []; 
        
      } else if(grid==='detail') {
        if(this.isNullOrEmpty(this.selectedListId)){
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'), // 알림 
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00226')  // 공정을 선택해주세요
          );

          return;
        }

        this.$refs.rowGrid2.skip = 0;
        const dataItem = {
          inEdit: true, 
          newRow: true,
          selected: false, 
          PLANTID: this.$auth.$state.user.plantId, 
          rowStat: "C",
          newRowUUid: newRowUUid,
          idx: this.detailGridData.length,
          PLANOPERID: this.selectedListId,
          customCell: {
            WORKCENTER: {
            type: 'combo',
            dataItem: this.workcenterComboList[0].dataItem,
            disable: false,
            },
          },
          MAXOPERATINGTIME: '',
          STDOPERATINGTIME: '',
          CYCLETIME: '',
          LEADTIME: '',
          USEFLAG: 'Yes',
          EQUIPMENTCOUNT: 0,

  
        };
        this.detailGridData.splice(0, 0, dataItem)
      }
      this.$nuxt.$emit('iccReset')

    },

    //그리드 인풋 제외 데이터 변경시
    listRowDdChange(e, name, dataItem) { 
      const idx = this.listGridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.listGridData));

      if (name === 'USEFLAG') {
        e.value = e.value ? 'Yes' : 'No';
      }

      if (name === 'MAINEQUIPMENTFLAG') {
        e.value = e.value ? 'Yes' : 'No';
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.listOriData, idx)) {
        data[idx].rowStat = "N";
      }

      this.listGridData = data;
    },
    
    detailRowDdChange(e, name, dataItem) {
      const idx = this.detailGridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.detailGridData));

      if (name === 'USEFLAG') {
        e.value = e.value ? 'Yes' : 'No';
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
          data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' && !this.gfn_ChkOriginalData(this.headerParam2.gridHeader, data, this.detailOriData, idx)
      ) {
          data[idx].rowStat = 'N';
      }
    
    
      this.detailGridData = data;
    },



    //그리드 인풋 데이터 변경시
    listgriditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.listGridData));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.listOriData, idx)) {
        data[idx].rowStat = "N";
      }
        this.listGridData = data;
    },

    detailgriditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.detailGridData));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam2.gridHeader, data, this.detailOriData, idx)) {
        data[idx].rowStat = "N";
      }
        this.detailGridData = data;
    },



    //unbo 버튼 클릭
    undoBtn(grid) {
      if(grid==='list') {
        this.listGridData = this.listOriData.filter((x) => x.newRow !== true);
        this.$nuxt.$emit("iccReset");
      } else if(grid==='detail') {
        this.detailGridData = this.detailOriData.filter((x) => x.newRow !== true);
        this.$nuxt.$emit("iccReset");
      }
    },

    // 저장 버튼 클릭
    saveBtn() {
      const saveData = this.listGridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

        if(saveData.length > 0){
        const validate = this.mesValidation(this.headerParam.gridHeader, this.listGridData);
        if (!validate.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); // 알림
          return;
        }
        }

      const saveDetailData = this.detailGridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

        if(saveDetailData.length > 0){
        const validate2 = this.mesValidation(this.headerParam2.gridHeader, this.detailGridData);
        if (!validate2.isValidate) {
          this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate2.msg); // 알림
          return;
        }
        }

        

      const updateCnt = saveData.length + saveDetailData.length;
      if(updateCnt > 0) {
        if(saveData.length > 0){
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnProductionPlanSet",
            sendParam: saveData
          }).then((result) => {
            if(result.returncode !== undefined && result.returncode === "0"){
              if(saveDetailData.length > 0) {
                const res = this.mesPost({
                  apiKey: "mes/common/manage",
                  messagename: "TxnProductionPlanSetDetail",
                  sendParam: saveDetailData
                }).then((result) => {
                  this.$nextTick(() => {
                    if(result.returncode !== undefined && result.returncode === "0"){
                      this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); // 알림 / 저장되었습니다.
                      this.getListGridData();
                      this.getDetailGridData();
                      


                    } else {
                      this.$refs.alertPop.show("ERROR : " + result.code, result.message);
                    }
                  })
                })
              } else {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); // 알림 / 저장되었습니다.
                this.getListGridData();
                this.getDetailGridData();


              }
            } else {
              this.$refs.alertPop.show("Error : ", result.code, result.message);
            }
          })
        } else {
          if(saveDetailData.length > 0) {
              const res = this.mesPost({
                apiKey: "mes/common/manage",
                messagename: "TxnProductionPlanSetDetail",
                sendParam: saveDetailData
              }).then((result) => {
                this.$nextTick(() => {
                  if(result.returncode !== undefined && result.returncode === "0"){
                    this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); // 알림 / 저장되었습니다.
                    this.getListGridData();
                    this.getDetailGridData();


                  } else {
                    this.$refs.alertPop.show("Error : ", result.code, result.message);
                  }
                })
              })
          }
        }
      } else {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); // 알림 / 저장할 데이터가 없습니다.
        return;
      }
    },


    // 삭제 버튼 클릭
    delBtn(grid) {
      if(grid==='list'){
        const data = JSON.parse(JSON.stringify(this.listGridData));
        this.listGridData = data.map(x => {
          if(x.selected){
            if(x.rowStat !== "C"){
              return {
                ...x,
                rowStat: "D"
              }
            }
          }
          else {
            return x;
          }
        }).filter(x => x !== undefined);
        if(this.selectedListId===''){
          this.detailGridData = [];
        }
        this.$nuxt.$emit('iccReset')
      }else if(grid==='detail'){
        const data = JSON.parse(JSON.stringify(this.detailGridData));
        this.detailGridData = data.map(x => {
          if(x.selected){
            if(x.rowStat !== "C"){
              return {
                ...x,
                rowStat: "D"
              }
            }
          }
          else {
            return x;
          }
        }).filter(x => x !== undefined);
      }
    },


    getExcel(){
    this.excelGet({
      apiKey: 'mes/excel/customquery',
      queryId: 'GetProductionPlanSetList',
      sendParam: {
        processid: this.processid,
        gridid: this.headerParam.gridid,
        gridqueryversion: "00001",
      },
    });
    },


    getExcel2(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetProductionPlanSetList',
        queryVersion:'00002',
        sendParam: {
          processid: this.processid,
          planoperid: this.selectedListId,
          gridid: this.headerParam2.gridid,
        },
      });
    },


  },
}
</script>