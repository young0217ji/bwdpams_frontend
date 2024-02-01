<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00074") }}</li> <!-- 기준정보 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00273") }}</li> <!-- 제품라우팅확정 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00542") }}</label> <!-- 제품그룹명 -->
                    <DropDownList ref="cmbProGroup" :style="{ width: '250px' }" :data-items="productGroup"
                      :text-field="'text'" :data-item-key="'id'" :value="value" @change="selectProGroup">
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00264") }}</label> <!-- 제품구분 -->
                    <MesSelectBox :enumID="'ProductionType'" :allYN="true" :dataNm="'ProductionType'"
                      @comboChange="comboChange"></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00259") }}</label> <!-- 제품ID -->
                    <InputText ref="productid" :dataNm="'productid'" :disabled="false" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00260") }}</label> <!-- 제품명 -->
                    <InputText ref="productName" :dataNm="'productName'" :disabled="false" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00516") }}</label><!--확정여부-->
                    <MesSelectBox :enumID="'ConfirmStatus'" :allYN="true" :dataNm="'ConfirmStatus'"
                      @comboChange="comboChange2"></MesSelectBox>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
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
            <v-row no-gutters>
              <v-col cols="12" align="right" :style="{ marginBottom: '8px' }">
                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00414') }}</Button> <!-- 저장 -->
                <Button :theme-color="'secondary'" :size="'small'" @click="getExcel">전체EXCEL</Button>
                <Button :theme-color="'secondary'" :size="'small'" @click="getExcelPaging">페이지EXCEL</Button>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid :isPaging="true" @notPageReset="notPageReset" :reSetPage="this.reSetPage" ref="rowGrid" :gridPageData="gridPageData"
                :gridHeight="gridHeight" :gridItems="gridData" :sortable="true" :columns="gridHeader" :resizable="true"
                :selected-field="selectedField" :edit-field="'inEdit'" :checkHeaderArr="checkHeaderArr"
                :disabledCheckHeaderArr="disabledCheckHeaderArr" @sortChangeHandler="sortChangeHandler"
                @gridrowclick="onRowClick" @gridddchang="rowDdChange" @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange" />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop v-if="showModal" title="Confirm Item" message="Are you sure you want to confirm this item?"
      @confirm="onConfirm" @cancel="onCancel" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from '@progress/kendo-vue-inputs';
import InputText from '../../components/common/input/InputText.vue';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { DropDownList } from "@progress/kendo-vue-dropdowns";

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
    ConfirmPop,
    Input,
    gridLastModIdx: null,
    Utility,
    Button,
    CardBody,
    CardTitle,
    Card,
    InputText,
    KendoGrid,
    DropDownList,
    MesSelectBox
  },

  data() {
    return {
      gridHeight: '',
      noFirstCheck: true,
      showModal: false,
      parentAreaId: '',
      columns: [],
      gridData: [],
      selected: null,
      selectedField: 'selected',
      gridOriData: [],
      productid: '', // 제품ID 검색
      productName: '', // 제품명 검색
      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스
      productGroup: [],
      value: {},
      checkHeaderArr: ['CONFIRMFLAG'],
      disabledCheckHeaderArr: ['ACTIVESTATE'],
      gridHeader: [],
      headerParam: {
        gridid: 'dgvModelingConfirm', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
      },
      reSetPage: false,
      confirmComboL: '',
      gridPageData: {}
    };
  },
  created() { },
  async mounted() {
    await this.getProductGroupData();
    await this.getGridData();
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
  beforeCreate() { },

  methods: {
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, undefined, [
        'CONFIRMFLAG',
        'ACTIVESTATE',
      ]);
    },
    notPageReset(flag) {
      this.reSetPage = flag;
    },
    async getGridData() {
      const { skip = 0, take = 20 } = this.gridPageData;
      const params = {
        plantid: this.$auth.$state.user.plantId,
        productid: this.productid,
        productName: this.productName,
        ProductionType: this.ProductionType,
        productGroupID: this.$refs['cmbProGroup'].value.id,
        ACTIVESTATE: 'Active',
        CONFIRMFLAG: this.confirmCombo,
        skip: skip,
          take: take,
      };
      try {
        this.mesGet({
          apiKey: 'mes/common/customquerypaging',
          queryId: 'GetModelingConfirmDataList',
          sendParam: params,

        }).then(({ list, paging, ...x }) => {

          const data = list.map((x, idx) => {
            const isInactive =
              x.ACTIVESTATE === 'Inactive' || x.POLICYNAME === null;
            return {
              ...x,
              rowStat: 'N',
              selected: idx === 0,
              idx: idx,
              inEdit: true,
              newRow: false,
              disabled: isInactive,
            };
          });
          this.$nuxt.$emit('iccReset');
          this.gridPageData = paging;
          this.gridOriData = data;
          this.gridData = data;
        });
      } catch (error) {
        console.log(error);
      }
    },
    getExcel() {
      this.excelGet({
        apiKey: 'mes/excel/customquery',
        queryId: 'GetModelingConfirmDataList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          ProductionType: this.ProductionType,
          productGroupID: this.$refs['cmbProGroup'].value.id,
          ACTIVESTATE: 'Active',
          CONFIRMFLAG: this.confirmCombo,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
        },
      });
    },
    getExcelPaging() {
      const { skip = 0, take = 20 } = this.gridPageData;
      this.excelGet({
        apiKey: 'mes/excel/customquerypaging',
        queryId: 'GetModelingConfirmDataList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          ProductionType: this.ProductionType,
          productGroupID: this.$refs['cmbProGroup'].value.id,
          ACTIVESTATE: 'Active',
          CONFIRMFLAG: this.confirmCombo,
          gridid: this.headerParam.gridid,
          gridqueryversion: "00001",
          skip: skip,
          take: take,
        },
      });
    },

    // 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {

      this.gridOriData = [];
      this.gridData = [];
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
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.productGroup.push({ id: data[i].PRODUCTGROUPID, text: data[i].PRODUCTGROUPNAME });
            this.value = this.productGroup[0];
          }
        }
      });
    },
    selectProGroup(event) {
      this.value = event.value;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    comboChange2(nm, val) {
      this[nm] = val;
      this.confirmCombo = val;
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },

    //그리드 로우 클릭
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selected = event.dataItem;
    },

    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map(item => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'CONFIRMFLAG') {
        e.value = e.value ? 'Yes' : 'No';
      }
      data[idx] = { ...data[idx], [name]: e.value };

      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
      ) {
        data[idx].rowStat = 'N';
      }
      this.gridData = data;
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
        !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
      ) {
        data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      keys.forEach(e => {
        data[idx][e] = data[idx][e] === '' ? null : data[idx][e];
      });
      const chkArr = keys.filter(x => {
        return (
          data[idx][x] !== this.gridOriData[idx][x] &&
          x !== 'rowStat' &&
          x !== 'selected'
        );
      });
      return chkArr.length > 0;
    },

    async searchBtn() {
      this.reSetPage = true;
      await this.getGridData();
    },

    async saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => ({ ...x, _ROWSTATUS: x.rowStat }));

      if (!saveData.length) {
        return this.$refs.alertPop.show(
          '',
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        ); /* 저장할 데이터가 없습니다. */
      }

      const res = await this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnModelingConfirm',
        sendParam: saveData,
      });

      this.$refs.alertPop.show(
        res.returncode !== undefined && res.returncode === '0'
          ? this.$i18n.t('MES_CommLang.MES_CommLang_00456')
          : `ERROR : ${res.code}`,
        res.returncode !== undefined && res.returncode === '0'
          ? this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
          : res.message
      ); /* 알림 ,  저장되었습니다.*/
      await this.$nextTick();
      await this.getGridData();
    },
  },
};
</script>
<style lang="scss"></style>