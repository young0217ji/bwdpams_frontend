<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li> <!-- 기준정보 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00700") }}</li> <!-- ERP BOM조회 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00263") }}</label> <!-- 품번코드 -->
                    <InputText ref="productid" :dataNm="'productid'" :disabled="false" :readonly="false"
                      :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                    <Button :theme-color="'primary'" @click="productListModalVisible = true">{{
                      $t("MES_CommLang.MES_CommLang_00169")
                    }}</Button> <!-- 선택 -->
                  </div>
                  <div class="form-group" style="margin-left: 5px;">
                    <InputText ref="productName" :dataNm="'productName'" :disabled="false" :readonly="true"
                      :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                  <!-- <div class="form-group">
                    <label>자재유형</label> 
                    <MesSelectBox ref="MaterialType" :enumID="'MaterialType'" :allYN="false" :dataNm="'MaterialType'"
                      :disabled="false" :defaultValue="MaterialType" @comboChange="comboChange"></MesSelectBox>
                  </div>
                  <div class="form-group" style="margin-left: 20px;">
                    <label>Alternative BOM</label>
                    <MesSelectBox ref="AlternativeBomType" :enumID="'AlternativeBomType'" :allYN="false" :dataNm="'AlternativeBomType'"
                      :defaultValue="AlternativeBomType" @comboChange="comboChange2"></MesSelectBox>
                  </div> -->
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t("MES_CommLang.MES_CommLang_00277") }}</kbutton> <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="3" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col align="left">
                <CardTitle></CardTitle>
              </v-col>
              <v-col align="right">
                <kbutton :style="{ width: '25px' }" :theme-color="'primary'" :size="'small'" @click="maximizeTree">
                  {{ this.treeBtn }}</kbutton>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: '96%' }">
              <KendoTree :treeData="treeData" :textField="'NAME'" :icon="'icon'" :activeItem="treeActiveItem"
                @onExpandChange="onExpandChange" @onItemClick="onItemClick">
              </KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="9" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '30%' }">
          <CardBody :style="{ height: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>{{
                  $t("MES_CommLang.MES_CommLang_00701") }}</CardTitle> <!-- BOM정보 -->
              </v-col>
              <v-col cols="6" align="right">

              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                :columns="headerParam.gridHeader" :resizable="true" :edit-field="'inEdit'" :selected-field="selectedField"
                :isPaging="false" :reSetPage="this.reSetPage" @gridddchang="rowDdChange" @griditemchange="griditemchange"
                @gridrowclick="onRowClick" @sortChangeHandler="sortChangeHandler" />
            </div>
          </CardBody>
        </Card>
        <!-- 하단 그리드 추가 -->
        <v-col :style="{ margin: '5px 0 0 0', height: '70%', width: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ height: '100%' }">
              <v-row>
                <v-col cols="6" align="left">
                  <CardTitle>{{
                  $t("MES_CommLang.MES_CommLang_00702") }}</CardTitle> <!-- 도면목록 -->
                </v-col>
                <v-col cols="6" align="right">
                  <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="getExcel"
                  >전체EXCEL</kbutton
                >
                </v-col>
              </v-row>
              <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid ref="rowGrid2" :gridHeight="gridHeight" :gridItems="gridData2" :sortable="true"
                  :columns="headerParam2.gridHeader" :resizable="true" :edit-field="'inEdit'"
                  :selected-field="selectedField" :gridDropDownList="headerParam2.enumComboBox" :isPaging="false"
                  :reSetPage="this.reSetPage" @gridddchang="rowDdChange" @griditemchange="griditemchange"
                  @gridrowclick="onRowClick" @sortChangeHandler="sortChangeHandler" @gridButtonClick="downloadBtn" />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-col>

    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <ProductListModal ref="ProductListModal" v-if="productListModalVisible" :visibleDialog="productListModalVisible"
      :title="'title'" :message="'message'" :callBack="() => { }" @visibleDialog="val => (productListModalVisible = val)"
      @productCode="productCode" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
// import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import utils from '~/plugins/utils';
import utils2 from '~/plugins/utils2';
import ProductListModal from '@/components/frmBOMDefinition/SelectProductListModal';
import { thumbnailsDownIcon } from '@progress/kendo-svg-icons';
import { mapState, mapMutations, mapActions } from 'vuex';

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
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    KendoTree,
    DropDownList,
    Button,
    ProductListModal
  },
  data() {
    return {
      treeData: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],

      gridData2: [],
      gridOriData2: [],
      gridLastModIdx: null,
      selectedWorkcenter: '',
      productid: '',
      productName: '',
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      value: {},
      // checkHeaderArr: ['ACTIVESTATE'],
      equipmentid: '',
      headerParam: {
        gridid: 'dgvIFBomDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        enumComboBox: [],
        checkBox: [],
        xOverflowYn: false,
        gridHeader: []
      },
      headerParam2: {
        gridid: 'dgvDrawInformation', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        enumComboBox: [],
        checkBox: [],
        gridHeader: []
      },
      treeActiveItem: {},
      reSetPage: false,
      gridTitle: '',
      menu: [],

      maximize: true,
      treeBtn: '-',
      currTreeData: {},

      productListModalVisible: false,



    };
  },
  created() { },
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    // await this.initTree();

    if (this.selectedProductID !== undefined && this.selectedProductID != '') {
      this.$refs['productid'].textVal = this.selectedProductID;
      this.productid = this.selectedProductID;
      this.searchBtn();
      this.setProductIDAction("");
    };
  },
  computed: {
    ...mapState({
      selectedProductID: state => state.modules.frmBOMD.selectedProductID,
    }),
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        if (this.selectedProductID !== undefined && this.selectedProductID != '') {
          this.$refs['productid'].textVal = this.selectedProductID;
          this.productid = this.selectedProductID;
          this.searchBtn();
          this.setProductIDAction("");
        };
      }
    },
  },
  methods: {
    ...mapActions({
      setProductIDAction: 'modules/frmBOMD/setProductIDAction',
    }),
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
      // this.getGridData();
    },

    //그리드 로우 클릭
    onRowClick(event) {
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
      this.selectedEquimentId = event.dataItem.EQUIPMENTID;

    },

    


    // 도면목록 그리드 데이터 가져오기
    async getGridData(productID) {
      this.gridOriData2 = [];
      this.gridData2 = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetDrawInformation',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PRODUCTID: productID
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
            // FILELOCATION: x.STANDARDCATEGORY + "/",
            FILEDOWNLOADYN: !this.isNullOrEmpty(x.DRAWFILENAME) ? true : false,
            FILECHANGE: false,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData2 = data;
        this.gridData2 = data;
        
      });
    },
    getExcel(){
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetDrawInformation',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PRODUCTID: productID,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
        },
      });
    },
  
    //트리 데이터 가져오기
    async initTree() {
      this.treeData = [];
      this.gridData = [];
      this.gridData2 = [];
      if(this.productid == ""){
        this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00260') // 품번코드를 입력해주세요.
          );
          return;
      }
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetBomTree',
        // queryVersion: '00005',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PRODUCTID: this.productid
        },

      });
      const data = res
        .map(x => ({ ...x, expanded: true }));
      this.currTreeData = data;
      this.treeData = utils.makeTreeData3(data);;
      if (this.treeData.length < 1) {
          this.$refs.alertPop.show(
            this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00261') // 조회된 데이터가 없습니다
          );
        }
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
      this.gridData = this.currTreeData.filter(x => x.ID == event.item.ID);
      this.getGridData(event.item.ID);
      console.log(this.currTreeData);
    },

    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['PMCYCLEVALUE'],
        ['ACTIVESTATE']
      );
    },
    selectMaterialType(event) {
      this.value = event.value;
    },
    productCode(data) {
      this.productid = data.PRODUCTID;
      this.productName = data.PRODUCTNAME;
      this.$refs['productid'].textVal = this.productid;
      this.$refs['productName'].textVal = this.productName;
      this.searchBtn();
    },
    //트리 전체접기 버튼
    maximizeTree() {
      this.treeBtn = this.treeBtn === '-' ? '+' : '-';
      this.maximize = !this.maximize;
      this.currTreeData = this.currTreeData.map(x => ({ ...x, expanded: this.maximize }));
      this.treeData = utils.makeTreeData3(this.currTreeData);
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    comboChange2(nm, val) {
      this[nm] = val;
    },
    downloadBtn(e, name, item) {
      console.log("1." ,item.DRAWFILENAME)
      console.log("2", item.DRAWLOCATION )
      window.open("/api/mes/common/fileDownload?fileName=" + item.DRAWFILENAME + "&fileLocation=" + item.DRAWLOCATION);
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
