<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
      <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li><!--기준정보-->
      <li>{{ $t("MES_CommLang.MES_CommLang_00272") }}</li><!--제품라우팅설정-->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00542") }}</label><!--제품그룹명-->
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
                    <label>{{ $t("MES_CommLang.MES_CommLang_00264") }}</label><!--제품구분-->
                    <MesSelectBox
                      :enumID="'ProductionType'"
                      :allYN="true"
                      :dataNm="'ProductionType'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00259") }}</label><!--제품ID-->
                    <InputText
                      ref="productid"
                      :dataNm="'productid'"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      :disabled="false"
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00260") }}</label><!--제품명-->
                    <InputText
                      ref="productName"
                      :dataNm="'productName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00087") }}</label><!--라우팅ID-->
                    <InputText
                      ref="processrouteid"
                      :dataNm="'processrouteid'"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      :disabled="false"
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00086") }}</label><!--라우팅명-->
                    <InputText
                      ref="processroutename"
                      :dataNm="'processroutename'"
                      :searchOption="true"
                      :disabled="false"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00660") }}</label><!--설정여부-->
                    <Checkbox
                      ref="includeCheck"
                      :dataNm="'includeCheck'"
                      :disabled="false"
                      :defaultchecked="false"
                      @checkbox-set="chkVal"
                  ></Checkbox>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  ref="search"
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}<!--조회-->
                </Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <v-row :style="{ height: '100%' }">
          <v-col
            :sm="12"
            :lg="6"
            :class="'divList1'"
            :style="{ height: '60%' }"
          >
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-col cols="6" align="left">
                <CardTitle>{{ $t('MES_CommLang.MES_CommLang_00258') }}</CardTitle><!--제품-->
                </v-col>
                <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                    ref="productG"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.product"
                    @sortChangeHandler="productSortChangeHandler"
                    :sortable="true"
                    :columns="productHeaderParam.gridHeader"
                    :disabledCheckHeaderArr="
                      productHeaderParam.disabledCheckHeaderArr
                    "
                    :resizable="true"
                    :selected-field="selectedField"
                    :edit-field="'inEdit'"
                    @gridrowclick="onProductRowClick"
                    :isPaging="true"
                    @notPageReset="notPageReset"
                    @selectionchange="onProductRowClick"
                    :reSetPage="this.reSetPage"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
          <v-col
            :sm="12"
            :lg="6"
            :class="'divList2'"
            :style="{ height: '60%' }"
          >
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <CardTitle>{{ $t('MES_CommLang.MES_CommLang_00085') }}</CardTitle><!--라우팅-->
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                    :isPaging="true"
                    @notPageReset="notPageReset"
                    :reSetPage="this.reSetPage"
                    ref="routingG"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.routing"
                    @sortChangeHandler="routingSortChangeHandler"
                    :sortable="true"
                    :columns="routingHeaderParam.gridHeader"
                    :disabledCheckHeaderArr="
                      routingHeaderParam.disabledCheckHeaderArr
                    "
                    :resizable="true"
                    :selected-field="selectedField"
                    :edit-field="'inEdit'"
                    @selectionchange="onRoutingRowClick"
                    @gridrowclick="onRoutingRowClick"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
          <v-col
            :sm="12"
            class="'divList3'"
            align="center"
            :style="{ height: '5%' }"
          >
            <div class="btn-cell-move-horizontal">
              <Button
                :theme-color="'secondary'"
                :class="'btn-cell-down'"
                @click="addBtn"
              ></Button>
              <Button
                :theme-color="'secondary'"
                :class="'btn-cell-up'"
                @click="confirmDel"
              ></Button>
            </div>
          </v-col>
          <v-col :sm="12" :class="'divList4'" :style="{ height: '35%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t('MES_CommLang.MES_CommLang_00520') }}</CardTitle><!--제품-라우팅-->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button
                      :theme-color="'primary'"
                      :size="'small'"
                      :icon="'save'"
                      @click="saveBtn"
                      >{{ $t('MES_CommLang.MES_CommLang_00414') }}<!--저장-->
                    </Button>
                    <Button
                      :theme-color="'secondary'"
                      :size="'small'"
                      :icon="'undo'"
                      @click="undoBtn"
                      >undo</Button
                    >
                  </v-col>
                </v-row>
                <div ref="divWrapper3" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                    :isPaging="false"
                    @notPageReset="notPageReset"
                    :reSetPage="this.reSetPage"
                    ref="policyG"
                    :pkNotEditArr="pkNotEditArr"
                    :gridHeight="gridHeight2"
                    :gridItems="gridData.policy"
                    :columns="policyHeaderParam.gridHeader"
                    :resizable="true"
                    :selected-field="selectedField"
                    :edit-field="'inEdit'"
                    :customCell="policyHeaderParam.customCell"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="onPolicyRowClick"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @headerselectionchange="onHeaderSelectionChange"
                    @sortChangeHandler="policySortChangeHandler"
                    :sortable="true"
                  /></div
              ></CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from '@progress/kendo-vue-inputs';
import InputText from '../../components/common/input/InputText.vue';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { ComboBox } from '@progress/kendo-vue-dropdowns';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import Checkbox from "@/components/common/input/Checkbox";
let myTitle;
let myMenuId;
let userId;


export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    userId = myState.userInfo.userId;
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
    ConfirmPop,
    MesSelectBox,
    combobox: ComboBox, // select box
    Input,
    gridLastModIdx: null,
    Utility,
    Button,
    CardBody,
    CardTitle,
    Card,
    InputText,
    DropDownList,
    KendoGrid,
    Checkbox
  },

  data() {
    return {
      //input data
      productid: '',
      productName: '',
      processrouteid: '',
      processroutename: '',

      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스
      value : {},
      productGroup: [],

      //grid
      gridHeight: '',
      gridHeight2: '',
      gridData: { policy: [], product: [], routing: [] },
      gridOriData: { policy: [], product: [], routing: [] },
      selectedField: 'selected',
      selected: { policy: null, product: null, routing: null },
      policyGetParams: {
        productName: this.productName,
        plantid: this.$auth.$state.user.plantId,
        productid: this.productid,
      },
      productGetParams: {
        productName: this.productName,
        processrouteid: this.processrouteid,
        plantid: this.$auth.$state.user.plantId,
        processroutename: this.processroutename,
        productid: this.productid,
      },

      // grid header
      productHeaderParam: {
        gridid: 'dgvproduct',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
        disabledCheckHeaderArr: ['ACTIVESTATE_PRODUCT'],
      },
      routingHeaderParam: {
        gridid: 'dgvProcessRoute_View',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
        disabledCheckHeaderArr: ['ACTIVESTATE', 'COMMONFLAG'],
      },
      policyHeaderParam: {
        gridid: 'dgvTPPolicy',
        rowStat: '', //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        gridDropDownList: [
          {
            dataVal: 'POLICYNAME',
            dataItem: [],
            disable: true,
          },
          {
            dataVal: 'POLICYVALUE',
            dataItem: [],
            disable: true,
          },
        ],
      },

      pkNotEditArr: ['PRODUCTID', 'BOMID', 'BOMVERSION', 'CONDITIONID', 'CONDITIONTYPE'],

      //row click data
      curproduct: null,
      currouting: null,
      curpolicy: null,
      gridinstance: null,
      reSetPage: false,
      includeCheck: false
    };
  },
  async mounted() {
    
    await this.getGridComboList();
    await this.getProductGroupData();
    await this.getHeaderMulti(this.productHeaderParam, this.$refs.divWrapper1);
    await this.getHeaderMulti(this.routingHeaderParam, this.$refs.divWrapper2);
    await this.getHeaderMulti(this.policyHeaderParam, this.$refs.divWrapper3);

    this.$refs.search.$listeners.click();
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.policy.findIndex(x => x.checked === false) === -1 &&
        this.gridData.policy.length !== 0
      );
    },
  },
  methods: {
    included(e, ref) {
      let parent = e.target.$parent;
      while (parent) {
        if (parent === this.$refs[ref]) {
          return true;
        }
        parent = parent.$parent;
      }
      return false;
    },

    //       gridData: { policy: [], product: [], routing: [] },
    productSortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData.product,
        e,
        ['STANDARDVALUE'],
        ['ACTIVESTATE_BOM']
      );
    },
    routingSortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData.routing, e, undefined, [
        'COMMONFLAG',
        'ACTIVESTATE',
      ]);
    },
    policySortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData.policy, e);
    },
    notPageReset(flag) {
      this.reSetPage = flag;
    },
    searchInputValSet(nm, val) {
      this[nm] = val;
    },
    selectProGroup(event) { 
      this.value = event.value;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },

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
            this.value = this.productGroup[0];
          }
        }
      });
    },

    async getGridData(id, queryId, params) {
      try {
        const res = await this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId,
          sendParam: params,
        });

        const data = res.map((x, idx) => {
          const defaultProperties = {
            rowStat: 'N',
            selected: idx === 0,
            idx,
            inEdit: true,
            newRow: false,
          };

          if (id === 'policy') {
            const customCell = {
              POLICYNAME: {
                type: 'combo',
                dataItem: this.policyHeaderParam.gridDropDownList[0].dataItem,
                disable: true,
              },
              POLICYVALUE: {
                type: 'combo',
                dataItem: this.policyHeaderParam.gridDropDownList[1].dataItem,
                disable: true,
              },
            };

            return {
              ...x,
              ...defaultProperties,
              customCell,
            };
          }

          return {
            ...x,
            ...defaultProperties,
          };
        });
        this.gridOriData[id] = JSON.parse(JSON.stringify(data));
        this.gridData[id] = data;
        this[`cur${id}`] = data[0];

        this.$nuxt.$emit('iccReset');
      } catch (error) {
        console.log(error);
      }
    },
    undoBtn() {
      this.gridData.policy = this.gridOriData.policy.filter(
        x => x.newRow !== true
      );

      this.$nuxt.$emit('iccReset');
    },

    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.policy.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData.policy));

      //생산방법일 시에는 활성화
      data[idx].customCell.POLICYVALUE.disable =
        name === 'POLICYNAME' && e.value !== 'ProductMethod';

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.policyHeaderParam.gridHeader,
          data,
          this.gridOriData.policy,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData.policy = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData.policy));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };

      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.policyHeaderParam.gridHeader,
          data,
          this.gridOriData.policy,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }
      this.gridData.policy = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      if (data[idx].DESCRIPTION === '') {
        data[idx].DESCRIPTION = null;
      }
      const chkArr = keys.filter(x => {
        return (
          data[idx][x] !== this.gridOriData.policy[idx][x] && //
          x !== 'rowStat' && //
          x !== 'selected' && //
          x !== 'customCell'
        );
      });
      return chkArr.length > 0;
    },

    async getGridComboList() {
      const data = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValueList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          enumid: 'PolicyName',
        },
      });
      const nameCombo = data
        .filter(x => x.ENUMID === 'PolicyName')
        .map(x => ({
          ENUMVALUE: x.ENUMVALUE,
          ENUMVALUENAME: x.ENUMVALUENAME,
        }));
      this.policyHeaderParam.gridDropDownList[0].dataItem = nameCombo;
      const valueCombo = data
        .filter(x => x.ENUMID === 'PolicyValue')
        .map(x => ({
          ENUMVALUE: x.ENUMVALUE,
          ENUMVALUENAME: x.ENUMVALUENAME,
        }));
      this.policyHeaderParam.gridDropDownList[1].dataItem = valueCombo;
    },

    //그리드 로우
    onProductRowClick(event) {
      this.curproduct = event.dataItem;
      this.getGridData('policy', 'GetTPPolicyList', {
        productName: this.curproduct.PRODUCTNAME,
        plantid: this.$auth.$state.user.plantId,
        productid: this.curproduct.PRODUCTID,
        conditionid: this.curproduct.ERPROUTINGCNT,
        conditiontype: this.curproduct.ERPROUTINGID,
      });
      this.gridData.product.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
    },

    onRoutingRowClick(event) {
      this.currouting = event.dataItem;
      this.gridData.routing.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
    },

    //Todo 동일하지 않음..
    onPolicyRowClick(event) {
      this.curpolicy = event.dataItem;
      this.gridData.policy.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
    },

    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridData.policy = this.gridData.policy.map(item => {
        return { ...item, selected: checked };
      });
    },

    addBtn() {
      if (!this.curproduct || !this.currouting) return;

      if(this.gridData.policy.length>0){
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00122')); /* 알림, 이미 라우팅이 연결된 품번입니다. */
        return;
      }
      const dataItem = {
        inEdit: true,
        selected: false,
        rowStat: 'C',
        newRow: true,
        _ROWSTATUS: 'C',
        idx: this.gridData.policy.length,
        BOMID: 'BOMID',
        BOMVERSION: '00001',
        CONDITIONID: this.curproduct.ERPROUTINGCNT,
        CONDITIONTYPE: this.curproduct.ERPROUTINGID,
        DESCRIPTION: null,
        LASTUPDATETIME: '',
        LASTUPDATEUSERID: userId,
        PLANTID: this.$auth.$state.user.plantId,
        POLICYNAME: 'None',
        POLICYVALUE: 'None',
        customCell: {
          POLICYNAME: {
            type: 'combo',
            dataItem: this.policyHeaderParam.gridDropDownList[0].dataItem,
            disable: false,
          },
          POLICYVALUE: {
            type: 'combo',
            dataItem: this.policyHeaderParam.gridDropDownList[1].dataItem,
            disable: true,
          },
        },
        PROCESSROUTEID: this.currouting.PROCESSROUTEID,
        PROCESSROUTETYPE: this.currouting.PROCESSROUTETYPE,
        PRODUCTID: this.curproduct.PRODUCTID,
        POLICYNAMEDISABLED: false,
        POLICYVALUEDISABLED: true,
      };
      this.$refs.policyG.skip = 0;
      this.gridData.policy.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },

    //조회 버튼
    async searchBtn() {
      this.reSetPage = true;
      console.log(this.includeCheck);
      const params = {
        productName: this.productName,
        processrouteid: this.processrouteid,
        plantid: this.$auth.$state.user.plantId,
        processroutename: this.processroutename,
        productid: this.productid,
        ProductionType: this.ProductionType,
        productGroupID: this.$refs['cmbProGroup'].value.id,
        SETCOUNT: this.includeCheck ? '1' : '0',
      };
      await this.getGridData('product', 'GetRouteSetProduct', params);
      await this.getGridData('routing', 'GetSelectProcessRoute', params);
      const poslicyParams = {
        productName: this.curproduct ? this.curproduct.PRODUCTNAME : '',
        plantid: this.$auth.$state.user.plantId,
        productid: this.curproduct ? this.curproduct.PRODUCTID : '',
        conditionid: this.curproduct ? this.curproduct.ERPROUTINGCNT : '',
        conditiontype: this.curproduct ? this.curproduct.ERPROUTINGID : '',
       };

      this.getGridData('policy', 'GetTPPolicyList', poslicyParams);
    },

    //저장버튼
    saveBtn() {
      const saveData = this.gridData.policy
        .filter(x => x.rowStat !== 'N')
        .map(x => ({ ...x, _ROWSTATUS: x.rowStat }));

      if (saveData.length > 0) {
        const validate = this.mesValidation(
          this.policyHeaderParam.gridHeader,
          this.gridData.policy
        );
        //validation
        if (!validate.isValidate) {
          this.$refs['alertPop'].show('', validate.msg);
          return;
        }
        //데이터 저장
        this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnTPPolicy',
          sendParam: saveData,
        }).then(res => {
          if (res.returncode !== undefined && res.returncode === '0') {
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* 알림, 저장되었습니다. */
            this.getGridData('policy', 'GetTPPolicyList', {
              productName: this.curproduct.PRODUCTNAME,
              plantid: this.$auth.$state.user.plantId,
              productid: this.curproduct.PRODUCTID,
              conditionid: this.curproduct.ERPROUTINGCNT,
              conditiontype: this.curproduct.ERPROUTINGID,
            });
          } else {
            this.$refs.alertPop.show(`ERROR : ${res.code}`, res.message);
          }
          this.$nextTick(() => {
            this.getGridData('policy', 'GetTPPolicyList', {
              productName: this.gridOriData.product[0].PRODUCTNAME,
              plantid: this.$auth.$state.user.plantId,
              productid: this.gridOriData.product[0].PRODUCTID,
              conditionid: this.gridOriData.product[0].ERPROUTINGCNT,
              conditiontype: this.gridOriData.product[0].ERPROUTINGID,
            });
          });
        });
      } else {
        this.$refs.alertPop.show('', this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /*저장할 데이터가 없습니다. */
      }
    },

    //삭제 버튼 클릭시 확인
    confirmDel() {
      this.$refs['confirmPop'].title = 'info';
      this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00071'); /* 삭제하시겠습니까? */
      this.$refs['confirmPop'].callBack = this.delBtn;
      this.$refs['confirmPop'].modalWidth = '300px';
      this.$refs['confirmPop'].visibleDialog = true;
    },


    //삭제
    delBtn() {
      const hasChecked =
        this.gridData.policy.filter(x => x.selected).length > 0;
      if (hasChecked) {
        const data = JSON.parse(JSON.stringify(this.gridData.policy));
        this.gridData.policy = data
          .filter(x => !(x.selected && x.rowStat === 'C'))
          .map(x => {
            if (x.selected) {
              return {
                ...x,
                rowStat: 'D',
                selected: false,
              };
            } else {
              return x;
            }
          });
      } else {
        this.$refs['alertPop'].show('', this.$i18n.t('MES_MsgLang.MES_MsgLang_00164')); /* 체크된 항목이 없습니다. */
      }
    },
    chkVal(nm, val) {
      this[nm] = val;
    },
  },
};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 365px !important;
  }
  .divList2 {
    height: 365px !important;
  }
  .divList3 {
    height: 50px !important;
  }
  .divList4 {
    height: 365px !important;
  }
}
</style>
