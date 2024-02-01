<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li><!--생산계획-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00612") }}</li><!--WorkOrder 관리-->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row ref="searchFilter" no-gutters>
                <v-col :sm="9" :lg="10" align="left">
                    <div class="form-group-wrap">
                      <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00544") }}</label> <!-- 품번그룹 -->
                          <DropDownList
                            ref="cmbProGroup"
                            :style="{ width: '250px' }"
                            :data-items="productGroup"
                            :text-field="'text'"
                            :data-item-key="'id'"
                            :value="value"
                            @change="selectProGroup"
                            >
                           </DropDownList>
                        </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00258") }}</label><!--품번-->
                            <InputText
                            :dataNm="'productId'"
                            @input-text-set="searchInput"
                            />
                        </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</label><!--품명-->
                            <InputText
                            :dataNm="'productName'"
                            @input-text-set="searchInput"
                            />
                        </div>
                        <div class="form-group">
                          <label>기간</label>
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
                          <span class="i_tilde">~</span>
                          <div class="form-datepicker">  
                            <DatePicker
                              ref="endDate"
                              :name="'endDate'"
                              :default-value="new Date()"
                              :value="endDate"
                              :format="'yyyy-MM-dd'"
                              @change="dateChange"
                            />
                          </div> 
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
        <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
                    <Card ref="gridCard1" :style="{ height: '44%', marginBottom:'1%' }">
                        <CardBody :style="{ width: '100%' }">
                            <v-row>
                                <v-col cols="12" align="left">
                                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00613") }}</CardTitle><!--WorkOrder 리스트-->
                                </v-col>
                            </v-row>
                            <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                                <KendoGrid
                                ref="grid"
                                :gridHeight="gridHeight"
                                :gridItems="gridData1"
                                :sortable="true"
                                :columns="headerParam1.gridHeader"
                                :resizable="true"
                                :edit-field="'inEdit'"
                                :selected-field="selectedField"
                                :isPaging="false"
                                @gridrowclick="onRowClick"
                                @sortChangeHandler="sortChangeHandler"
                                />
                            </div>
                        </CardBody>
                    </Card>
                    <Card ref="gridCard1" :style="{ height: '55%' }">
                        <CardBody :style="{ width: '100%' }">
                            <v-row>
                                <v-col cols="12" align="left">
                                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00614") }}</CardTitle><!--WorkOrder 이력-->
                                </v-col>
                            </v-row>
                            <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                                <KendoGrid
                                ref="grid"
                                :gridHeight="gridHeight"
                                :gridItems="gridData2"
                                :sortable="true"
                                :columns="headerParam2.gridHeader"
                                :resizable="true"
                                :edit-field="'inEdit'"
                                :selected-field="selectedField"
                                :isPaging="false"
                                @sortChangeHandler="sortChangeHandler"
                                />
                            </div>
                        </CardBody>
                    </Card>

        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
    </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import { DropDownList } from '@progress/kendo-vue-dropdowns';
  import { DatePicker } from "@progress/kendo-vue-dateinputs";
  
  
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
      DatePicker,
    },
    props: {
      gridHeight: {
        type: String,
        defaultData: "500px",
      },
    },
    data() {
      return {
        gridData1:[],
        gridData2:[],
        headerParam1:{
          gridid: 'dgvWorkOrder',
          gridHeader: [],
          noFirstCheck: true,
          noRowstat: true,
          xOverflowYn: true,
        },
        headerParam2:{
          gridid: 'dgvWorkOrderHistory',
          gridHeader: [],
          noFirstCheck: true,
          noRowstat: true,
          xOverflowYn: true,
        },
        gridHeader: [],
        selectedField: 'selected',
        productGroup: [{id:'', text:''}],
        value: '',
        productId: '',
        productName: '',
        startDate: new Date(),
        endDate: new Date(),
      };
    },
    created() {},
    async mounted() {
        await this.getProductGroupData();
        await this.getHeaderMulti(this.headerParam1, this.$refs.divWrapper1);
        await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    },
    computed: {
    },
    watch: {},
    methods: { 
        // ===== 검색조건 START =====
        // 품번그룹 Combobox list 
        async getProductGroupData() {
          this.mesGet({
            apiKey: 'mes/common/getqueryresult',
            queryId: 'GetProductGroupList',
            sendParam: {
              plantid: this.$auth.$state.user.plantId,
            },
          }).then(res => {
            for(let i = 0; i < res.length; i++){
              if(i < res.length){
                this.productGroup.push({ id : res[i].PRODUCTGROUPID, text : res[i].PRODUCTGROUPNAME });
                this.value = this.productGroup[0];
              }
            }
          });
        },
        selectProGroup(event) { 
          this.value = event.value;
        },
        // 검색 인풋 변경시
        searchInput(nm, val) {
          this[nm] = val;
        },
        // DatePicker 변경
        dateChange(e){
          this[e.target.name] = e.value;
        },
        // 검색버튼
        searchBtn(){
          this.getGridData();
        },
        // ===== 검색조건 END =====

        // ===== GRID START =====
        async getGridData() {
            this.mesGet({
            apiKey: "mes/common/getqueryresult",
            queryId: "GetWorkOrderList",
            queryVersion: "00003",
            sendParam: {
                plantid: this.$auth.$state.user.plantId,
                productgroupid: this.value.id,
                productid: this.productId,
                productname : this.productName,
                startdate: this.DateToYYYYMMDDString(this.startDate),
                enddate: this.DateToYYYYMMDDString(this.endDate),
            },
            }).then((res) => {
            const data = res.map((x, idx) => {
                return {
                ...x,
                rowStat: "N",
                selected: false,
                idx: idx,
                inEdit: true,
                newRow: false,
                };
            });
            this.$nuxt.$emit("iccReset");
            this.gridData1 = data;
            this.gridOriData = data;
            this.gridData2 = [];
            });
        },
        // Work Order 리스트 Row 클릭 - History 조회
        onRowClick(event) {
            const selectedIdx = this.$auth.$state.user.plantId;
            this.gridData1 = this.gridData1.map(item => {
                return {
                ...item,
                selected: item.idx === selectedIdx ? !item.selected : item.selected,
                };
            });
            
            this.mesGet({
              apiKey: "mes/common/getqueryresult",
              queryId: "GetWorkOrderHistoryList",
              sendParam: {
                  plantid: this.$auth.$state.user.plantId,
                  productorderid: event.dataItem.PRODUCTORDERID,
                  workorderid: event.dataItem.WORKORDERID,                 
              },
              }).then((res) => {
              const data = res.map((x, idx) => {
                  return {
                  ...x,
                  rowStat: "N",
                  selected: false,
                  idx: idx,
                  inEdit: true,
                  newRow: false,
                  };
              });
              this.$nuxt.$emit("iccReset");
              this.gridData2 = data;
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
  