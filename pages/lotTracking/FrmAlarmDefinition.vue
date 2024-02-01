<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00665") }}</li> <!-- 공정관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00663") }}</li> <!-- 이상발생기준정보관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :cols="12" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t("MES_CommLang.MES_CommLang_00277") }}</kbutton
                >   <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col
        :cols="3"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col align="left">
                <CardTitle></CardTitle>
              </v-col>
              <v-col align="right">
                <kbutton :style="{ width:'25px' }" :theme-color="'primary'" :size="'small'" @click="maximizeTree">{{this.treeBtn}}</kbutton>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: '96%' }">
              <KendoTree
                :treeData="treeData"
                :textField="'AREANAME'"
                :icon="'icon'"
                :activeItem="treeActiveItem"
                @onExpandChange="onExpandChange"
                @onItemClick="onItemClick"
              >
              </KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :cols="9"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00664") }}</CardTitle> <!-- 이상발생 목록 -->
              </v-col>
              <v-col cols="6" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t("MES_CommLang.MES_CommLang_00414") }}</kbutton
                > <!-- 저장 -->
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  >{{ $t("MES_CommLang.MES_CommLang_00411") }}</kbutton
                > <!-- 추가 -->
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="confirmDel"
                  >{{ $t("MES_CommLang.MES_CommLang_00412") }}</kbutton
                > <!-- 삭제 -->
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >UNDO</kbutton
                >
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
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                :customCell="customCell" 
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @gridrowclick="onRowClick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
          </CardBody>
        </Card>

        <!-- 하단 그리드 추가 -->
        <!-- <v-col :style="{ margin: '15px 0 0 0', height: '53%', width: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }" >
                <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                    <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00591") }}</CardTitle>
                     예비품 목록
                    </v-col>
                </v-row>
                <div ref="divWrapper2" style="height: calc(100% - 33px);">
                    <KendoGrid 
                    ref="equipmentBomGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridDataEquipment"
                    :sortable="true"
                    :columns="sparePartHeaderParam.gridHeader"
                    :gridDropDownList="sparePartHeaderParam.enumComboBox"
                    :resizable="true"
                    :edit-field="'inEdit'"
                    :isPaging="false"
                    :selected-field="selectedField"
                    />
                </div>
            </CardBody>
        </Card>
      </v-col> -->
      </v-col>

        <!-- 하단 그리드 추가 끝-->
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
//   import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import utils from '~/plugins/utils';

let myTitle;
let myMenuId;


export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    KendoTree,
    gridHeaderMinin
  },
  data() {
    return {
      treeData: [],
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedWorkcenter: '',
      // gridDropDownList: [
      //   {
      //     dataVal: 'EQUIPMENTTYPE',
      //     dataItem: [],
      //   },
      //   {
      //     dataVal: 'EQUIPMENTDETAILTYPE',
      //     dataItem: [],
      //   },
      //   {
      //     dataVal: 'COMMUNICATIONSTATE',
      //     dataItem: [],
      //   },
      //   {
      //     dataVal: 'PMCYCLETYPE',
      //     dataItem: [],
      //   },
      // ],
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      // checkHeaderArr: ['ACTIVESTATE'],
      equipmentid: '',
      headerParam: {
        gridid: 'dgvAlarmDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        enumComboBox: [],
        checkBox: [],
        gridDropDownList: [
          {
              dataVal: "ALARMID",
              dataItem: [],
              disable: false,
          },
          {
              dataVal: "ROLEID",
              dataItem: [],
              disable: false,
          },
          ],
      },
      treeActiveItem: {},
      reSetPage: false,
      gridTitle: '',
      menu: [],

      maximize: true,
      treeBtn: '-',
      currTreeData:{},
     
        customCell: ['ALARMID', 'ROLEID'],
        selectedEquipmentId: '',
        gridOriDataEquipment:[],
        gridDataEquipment: [],

      
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
  //   await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
  //   await this.getHeaderMulti(this.sparePartHeaderParam, this.$refs.divWrapper2);
    await this.initTree();
    await this.getGridComboList();
    // await this.getGridComboList();
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
  },
  watch: {},
  methods: {
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.reSetPage = true;
      this.initTree();
      this.getGridData();
    },
    // 저장
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      const validate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridData
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); // 알림
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnAlarmDefinition',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.initTree();
            this.getGridData(this.selectedWorkcenter);
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); //저장되었습니다.
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); //저장할 데이터가 없습니다.
        return;
      }
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
      this.selectedEquimentId = event.dataItem.EQUIPMENTID;
      console.log("selectedEquimentId",this.selectedEquimentId);
      this.getEquipmentBomData(this.selectedEquimentId);

    },

    //이상발생목록 그리드 데이터 가져오기
        async getEquipmentBomData(res) {
      // this.gridOriDataEquipment = [];
      // this.gridDataEquipment = [];
      // this.mesGet({
      //   apiKey: 'mes/common/getqueryresult',
      //   queryId: 'GetAlarmDefinition',
      //   sendParam: {
      //     plantid: this.$auth.$state.user.plantId,
      //     WORKCENTER: res,
      //   },
      // }).then(res => {
      //   const data = res.map((x, idx) => {
      //     return {
      //       ...x,
      //       rowStat: 'N',
      //       selected: false,
      //       idx: idx,
      //       inEdit: true,
      //       newRow: false,
      //       resizable: true,
      //       // changeCellType: 'button',
      //       // PARTIDBUTTON: this.$i18n.t('MES_CommLang.MES_CommLang_00042'), // 검색
      //     };
      //   });
      //   //GIRD input v-model초기화, chkbox초기화 위해 추가
      //   this.$nuxt.$emit('iccReset');
      //   this.gridOriDataEquipment = data;
      //   this.gridDataEquipment = data;
      // });
    },


    //이상발생목록 그리드 데이터 가져오기
    async getGridData(treeId = '') {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAlarmDefinition',
        sendParam: {
          WORKCENTER: treeId,
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          const customCell = {
          ALARMID: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[0].dataItem,
            disable: false,
          },
          ROLEID: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[1].dataItem,
            disable: false,
          },
        };
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
            customCell
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.gridData = data;
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'ACTIVESTATE') {
        e.value = e.value ? 'Active' : 'Inactive';
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          data,
          this.gridOriData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData = data;
    },
    async getGridComboList() {
      this.mesGet({
      apiKey: 'mes/common/getqueryresult',
      queryId: 'GetAlarmComboList',
      sendParam: {
        plantid: this.$auth.$state.user.plantId,
      },
    }).then(data => {
      const combo = data.map(x => {
        return {
          ENUMVALUE: x.ALARMID,
          ENUMVALUENAME: x.ALARMNAME,
        }
      })
      console.log(combo);
      this.headerParam.gridDropDownList[0].dataItem = combo;
    });
      this.getGridComboList2();
    
  },

  async getGridComboList2(){
      this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetSFRoleList',
          sendParam: {
          plantid: this.$auth.$state.user.plantId,
          ROLETYPE: 'ALARM',
          },
      }).then(data => {
          const combo = data.map(x => {
          return {
              ENUMVALUE: x.ROLEID,
              ENUMVALUENAME: x.ROLENAME,
          }
          })
          this.headerParam.gridDropDownList[1].dataItem = combo;
      });
      
  },
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          data,
          this.gridOriData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData = data;
    },
    //데이터 원상복구시 "수정" 항목 제거
    // chkOriginalData(gridData, idx) {
    //   const data = JSON.parse(JSON.stringify(gridData));
    //   const keys = Object.keys(data[idx]);
    //   const chkArr = keys.filter((x) => {
    //     return (
    //       this.parseNullOrUndefinedToBlank(data[idx][x]) !==
    //         this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) &&
    //       x !== "selected" &&
    //       x !== "rowStat"
    //     );
    //   });
    //   return chkArr.length > 0;
    // },
    //트리 데이터 가져오기
    async initTree() {
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00005',
        sendParam: {
          SUPERAREAID: '',
          plantid: this.$auth.$state.user.plantId,
        },
      });
      const data = res
        .map(x => ({ ...x, expanded: true }));
        // .sort((a, b) => (a.POSITION || '').localeCompare(b.POSITION || ''));
      data.map(x=> {
        if(x.AREATYPE==='WorkCenter'){
          x.icon = 'WORKCENTER';
        }
        this.currTreeData = data;
      });

      this.treeData = utils.makeTreeData(data);
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    isChanged() {
      const saveData = this.gridData.filter(x => x.rowStat !== 'N');
      return saveData.length > 0;
    },
    // 트리 클릭
    onItemClick(event) {
      console.log(this.gridData);
      if(event.item.AREATYPE === "WorkCenter") {
        this.getGridData(event.item.AREAID); // 데이터 없을경우 NullPointerException
        this.gridTitle = event.item.AREANAME;
      }
      this.treeActiveItem = event.item;
      this.selectedWorkcenter = event.item.AREAID;
      
    },
    // 트리 클릭 시 그리드 타이틀
    setGridTitle() {
      let title = '';
      if (this.curTree.PARENTEQUIPMENTID === '') {
        title = '[' + this.curTree.EQUIPMENTID + ']' + this.$i18n.t('MES_CommLang.MES_CommLang_00172'); //설비목록
      } else {
        title =
          '[' +
          this.curTree.PARENTEQUIPMENTID +
          ']'+this.$i18n.t('MES_CommLang.MES_CommLang_00172')+'[' + //설비목록
          this.curTree.EQUIPMENTID +
          '] ' +
          this.curTree.EQUIPMENTNAME;
      }

      this.gridTitle = title;
    },
  
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      if(this.treeActiveItem.AREATYPE!=='WorkCenter'){
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00225')); //설비를 추가할 WorkCenter를 선택해주세요.
        return;
      }

      this.$refs.rowGrid.skip = 0;

      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        DESCRIPTION: '',
        idx: this.gridData.length,
        WORKCENTER: this.selectedWorkcenter,
        customCell: {
          ALARMID: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[0].dataItem,
            disable: false,
          },
          ROLEID: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[1].dataItem,
            disable: false,
          },
        },
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    confirmDel() {
      const delData = this.gridData
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
          selectedRow = delData.map(x => x.EQUIPMENTID);
          this.$refs[
            'confirmPop'
          ].message = selectedRow + ' - ' +  this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제 하시겠습니까? */
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtn;
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00409'), //확인
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')//선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.
        );
        return;
      }
    },
    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data
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
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['PMCYCLEVALUE'],
        ['ACTIVESTATE']
      );
    },

        //트리 전체접기 버튼
    maximizeTree(){
      this.treeBtn = this.treeBtn==='-'?'+':'-';
      this.maximize = !this.maximize;
      this.currTreeData = this.currTreeData.map(x => ({ ...x, expanded: this.maximize}));
      this.treeData = utils.makeTreeData(this.currTreeData);
    }
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
