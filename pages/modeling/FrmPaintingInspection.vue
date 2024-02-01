<template>
    <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00856") }}</li> <!-- 도장 완성검사  -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col cols="12" align="right">
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
                      <CardTitle>&nbsp;</CardTitle>
                  </v-col>
                  <v-col cols="8" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00757") }}</Button> <!-- 신규등록 -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">{{ $t("MES_CommLang.MES_CommLang_00676") }}</Button> <!-- 전체Excel -->
                    <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">{{ $t("MES_CommLang.MES_CommLang_00677") }}</Button> <!-- 페이지Excel -->
                  </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="false"
                  :selected-field="selectedField"
                  :isPaging="true"
                  :scrollable="false"
                  :reSetPage="this.reSetPage"
                  @gridrowclick="onRowClick"
                  @pageChangeEvent="pageChangeEvent"
              />
              </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <CreatePaintingInspecionModal
    v-if="insertModalVisible"
    :visibleDialog="insertModalVisible"
    :selectedRowData="selectedRowData"
    @visibleDialog="(val) => insertModalVisible = val"
    @save="save"
    />
    <ConfirmPop
      :is="'confirmPop'"
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
    />
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import AlertPop from "@/components/common/modal/AlertPop";
import { Button } from '@progress/kendo-vue-buttons';
import InputText from "@/components/common/input/InputText";
import { TextArea, Input } from '@progress/kendo-vue-inputs';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import CreatePaintingInspecionModal from '@/components/frmPaintingInspection/CreatePaintingInspectionModal.vue'



let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
    AlertPop,
    KendoGrid,
    InputText,
    TextArea,
    Input,
    CreatePaintingInspecionModal,
  },
  data() {
    return {
      gridHeader: [],
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      gridPageData: {},
      selectedField: "selected",
      headerParam: {
        gridid: "dgvPaintingInspection", // 그리드ID
        noRowstat: true,
        noFirstCheck: true,
      },
      insertModalVisible: false,
      selectedRowData:{},
      reSetPage: false,
    }
  },
  created() {

  },
  async mounted() {
    await this.getGridData();
  },
  computed: {},
  watch: {},
  methods: {

    notPageReset(flag) {
      this.reSetPage = flag;
    },

    // 조회버튼
    async searchBtn() {
      this.reSetPage = true;
      this.getGridData();
    },

    // 신규등록 버튼
    addBtn() {
      const maxKey = this.gridData.map(x=> {return x.DATAKEY});
      const nextKey = this.gridData.length>0? Math.max.apply(null,maxKey)+1:1;
      this.selectedRowData = {
        DATAKEY:nextKey,
        flag:'insert'
      };
      this.insertModalVisible = true;
    },

    // 그리드 데이터 가져오기
    async getGridData() {
      const {skip=0, take=20} = this.gridPageData;
      this.mesGet({
        apiKey: "mes/common/customquerypaging",
        queryId: "GetPaintingInspecionList",
        queryVersion: "00001",
        sendParam: {
            plantid: this.$auth.$state.user.plantId,  
            skip: skip,
            take: take,
        },
        }).then(({list, paging, ...x}) => {
        const data = list.map((x, idx) => {
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
              INSPECTIONDATE: x.INSPECTIONDATE.substring(0,10),
            };
        });
        this.$nuxt.$emit("iccReset");
        this.gridPageData = paging;
        this.gridData = data;
        this.gridOriData = data;
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


    // 작성시 alertPop
    save() {
      this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
      this.insertModalVisible = false;
      this.getGridData();
    },


    // 그리드 로우 클릭
    onRowClick(event) {
      this.selectedRowData = event.dataItem;
      this.selectedRowData.flag = "update";
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.insertModalVisible = true;

      console.log(this.selectedRowData);
    },


    //전체excel
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetPaintingInspecionList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,  
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
        queryId: 'GetPaintingInspecionList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,  
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },
  },
}
</script>
