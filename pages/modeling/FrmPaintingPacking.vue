<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li><!--생산계획-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00601") }}</li><!--제품 포장사양 관리-->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row ref="searchFilter" no-gutters>
                <v-col :sm="9" :lg="10" align="left">
                    <div class="form-group-wrap">
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00258") }}</label><!--품번-->
                            <InputText
                            :dataNm="'productId'"
                            @input-text-set="searchInputValSet"
                            />
                        </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</label><!--품명-->
                            <InputText
                            :dataNm="'productName'"
                            @input-text-set="searchInputValSet"
                            />
                        </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00609") }}</label><!--고객-->
                            <DropDownList
                            ref="cmbCompany"
                            :style="{ width: '250px' }"
                            :data-items="companyList"
                            :text-field="'ENUMVALUENAME'"
                            :data-item-key="'ENUMVALUE'"
                            :value="companyId"
                            @change="selectCustomer"
                            />
                        </div>
                    </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button><!--조회-->
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <v-row ref="contents">
        <v-col :cols="12" :style="{ height: '100%' }">
          <Card ref="gridCard2" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%' }">
              <v-row>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00601") }}</CardTitle><!--제품 포장사양 관리-->
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'add'"
                    @click="addBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button
                  ><!--추가-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'delete'"
                    @click="delBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button
                  ><!--삭제-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'undo'"
                    @click="undoBtn"
                    >undo</Button
                  >
                </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="grid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="headerParam.enumComboBox"
                  :customCell="headerParam.customCell"
                  :isPaging="false"
                  @gridddchang="rowDdChange"
                  @griditemchange="griditemchange"
                  @gridrowclick="onRowClick"
                  @gridButtonClick="gridProductSearch"
                  @sortChangeHandler="sortChangeHandler"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <SelectProductModal
        ref="SelectProductModal"
        v-if="SelectProductModalVisible"
        :visibleDialog="SelectProductModalVisible"
        :title="productModalTitle"
        :selected-field="selectedField"
        @visibleDialog="val => (SelectProductModalVisible = val)"
        @selectedRow="selectedRow"
       />
    </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import { DropDownList } from '@progress/kendo-vue-dropdowns';
  import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';
  
  
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
      KendoGrid,
      InputText,
      DropDownList,
      SelectProductModal,
    },
    props: {
      gridHeight: {
        type: String,
        defaultData: "500px",
      },
    },
    data() {
      return {
        gridData:[],
        gridOriData:[],
        headerParam:{
            gridid: 'dgvPackingDefinition', // 그리드 ID
            rowStat: '', //rowStat 표시 여부
            enumComboBox: ['PAINTINGCOLOR','PACKINGTYPE'],
            customCell : ['COMPNAYID'],
        },
        gridHeader: [],
        selectedField: 'selected',
        productId: '',
        productName: '',
        productList: [],
        companyId: '',
        companyList: [],
        searchIdx: '',
        SelectProductModalVisible: false,
        productModalTitle: this.$i18n.t('MES_CommLang.MES_CommLang_00262'), /* 품번목록 */
      };
    },
    created() {},
    async mounted() {
        await this.getCustomerList();
    },
    computed: {
    },
    watch: {},
    methods: { 
        // ===== 검색조건 START =====
        // 검색조건 고객 ComoboBox List 가져오기
        async getCustomerList(){
            this.mesGet({
                apiKey: 'mes/common/customquery',
                queryId: 'GetCustomerList',
                sendParam: {
                plantid: this.$auth.$state.user.plantId,
                },
            }).then(res => {
                this.companyList = res;
                this.companyId = this.companyList[0];
            });
        },
        // 검색조건 고객 선택
        selectCustomer(e){
            this.companyId = e.value;
        },
        // 검색조건 TEXT 입력
        searchInputValSet(nm, val) {
            this[nm] = val;
        },
        // 검색버튼
        searchBtn(){
            this.getGridData();

        },
        
        // ===== 검색조건 END =====

        // ===== GRID START =====
        async getGridData() {
            this.mesGet({
            apiKey: "mes/common/customquery",
            queryId: "GetPaintingPackingList",
            sendParam: {
                plantid: this.$auth.$state.user.plantId,
                productid: this.productId,
                productname : this.productName,
                companyid : this.companyId.ENUMVALUE,
            },
            }).then((res) => {
            const data = res.map((x, idx) => {
                const customCell = {
                    COMPANYID: {
                        type: 'combo',
                        dataItem: this.companyList,
                        readonly: true,
                    },
                }

                return {
                ...x,
                rowStat: "N",
                selected: false,
                idx: idx,
                inEdit: true,
                newRow: false,
                customCell: customCell,
                };
            });
            this.$nuxt.$emit("iccReset");
            this.gridData = data;
            this.gridOriData = data;
            });
        },
        // 추가버튼
        addBtn(){
            this.$refs.grid.skip = 0;

            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: false,
                rowStat: 'C',
                _ROWSTATUS: 'C',
                idx: this.gridData.length,
                customCell: {
                    COMPANYID: {
                        type: 'combo',
                        dataItem: this.companyList,
                    },
                },
                PLANTID: this.$auth.$state.user.plantId,
                PRODUCTID:'',
                PRODUCTNAME:'',
                COMPANYID:'',
                PAINTINGCOLOR:'',
                PACKINGTYPE:'',
                PACKINGQUANTITY:'',
                DESCRIPTION:'',
                change:true,
            };
            
            this.gridData.splice(0, 0, dataItem);

            this.$nuxt.$emit('iccReset');
            console.log(this.gridData);
        },
        // 저장버튼
        saveBtn(){
            const saveData = this.gridData.filter(x => x.rowStat !== 'N').map(x => {
                return {
                    ...x,
                    _ROWSTATUS: x.rowStat,
                };
            });

            const validate = this.mesValidation(this.headerParam.gridHeader, this.gridData);
            if (!validate.isValidate) {
                this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg); // 알림
                return;
            }

            if (saveData.length > 0) {
                const res = this.mesPost({
                apiKey: 'mes/common/manage',
                messagename: 'TxnPaintingPackingInfomation',
                sendParam: saveData,
                }).then(result => {
                this.$nextTick(() => {
                    if (result.returncode !== undefined && result.returncode === '0') {
                    this.$refs.alertPop.show(
                        this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
                        this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); //저장되었습니다.
                        this.getGridData();
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
        // 삭제버튼
        delBtn(){
            const data = JSON.parse(JSON.stringify(this.gridData));
            this.gridData = data.filter(x => !(x.selected && x.rowStat === 'C')).map(x => {
                if (x.selected) {
                    return {
                    ...x,
                    rowStat: 'D',
                    };
                }
                return x;
            });
        },
        // UNDO 버튼
        undoBtn(){
            this.gridData = this.gridOriData.filter(x => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
        },
        // GRID Input Text 제외 변경
        rowDdChange(e, name, dataItem) {
            const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
            const rowData = JSON.parse(JSON.stringify(this.gridData));

            rowData[idx] = { ...rowData[idx], [name]: e.value };
            if (rowData[idx].rowStat === 'N') {
                rowData[idx].rowStat = 'U';
            }
            if (rowData[idx].rowStat === 'U' && !this.gfn_ChkOriginalData(this.gridHeader, rowData, this.gridOriData, idx)
            ) {
                rowData[idx].rowStat = 'N';
            }
            
            console.log(this.gridData[idx]);
            console.log(this.gridOriData[idx]);

            this.gridData = rowData;
        },
        // GRID Input Text 변경
        griditemchange(e) {
            const data = JSON.parse(JSON.stringify(this.gridData));
            const idx = data.findIndex(x => x.idx === e.dataItem.idx);
            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === 'N') {
                data[idx].rowStat = 'U';
            }
            if (data[idx].rowStat === 'U' && !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)) {
                data[idx].rowStat = 'N';
            }
            this.gridData = data;
        },
        // GRID 품번 검색 버튼
        gridProductSearch(e, name, item){
            this.searchIdx = item.idx;
            this.SelectProductModalVisible = true;
        },
        // 팝업에서 품번 선택시
        selectedRow(select){
            this.gridData = this.gridData.map(x => {
                return {
                    ...x,
                    PRODUCTID: x.idx === this.searchIdx ? select.PRODUCTID : x.PRODUCTID,
                    PRODUCTNAME: x.idx === this.searchIdx ? select.PRODUCTNAME : x.PRODUCTNAME,
                };
            });
        },
        onRowClick(event) {
            const selectedIdx = event.dataItem.idx;
            this.gridData = this.gridData.map(item => {
                return {
                ...item,
                selected: item.idx === selectedIdx ? !item.selected : item.selected,
                };
            });
        },

        sortChangeHandler(e) {
            const isAscending = e.sort[0]?.dir == 'asc';
            if (isAscending) {
                this.gridData = this.gridData.sort((a, b) =>
                a[e.event?.field] < b[e.event?.field]
                    ? -1
                    : a[e.event?.field] > b[e.event?.field]
                    ? 1
                    : 0
                );
            } else {
                this.gridData = this.gridData.sort((a, b) =>
                a[e.event?.field] > b[e.event?.field]
                    ? -1
                    : a[e.event?.field] < b[e.event?.field]
                    ? 1
                    : 0
                );
            }
        },
    },
  };
  
  const defaultData = {};
  </script>
  <style lang="scss" scoped>
  @media (max-width: 1267px) {
    .divList1 {
      height: 339px !important;
    }
    .divList2 {
      height: auto !important;
    }
    .divList3 {
      height: 213px !important;
    }
  }
  </style>
  