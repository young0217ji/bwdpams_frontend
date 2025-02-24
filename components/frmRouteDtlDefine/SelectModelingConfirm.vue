<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="70%"
      height="650"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :sm="9" :lg="9">
          <div class="form-group-wrap">
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00542') }}</label
              ><!--제품그룹명-->
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
              <label>{{ $t('MES_CommLang.MES_CommLang_00264') }}</label
              ><!--제품구분-->
              <MesSelectBox
                :enumID="'ProductionType'"
                :allYN="true"
                :dataNm="'ProductionType'"
                @comboChange="comboChange"
              ></MesSelectBox>
            </div>
          </div>
          <div class="form-group-wrap">
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00263') }}</label
              ><!--제품코드-->
              <InputText
                ref="productid"
                :dataNm="'productid'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00260') }}</label
              ><!--제품명-->
              <InputText
                ref="productName"
                :dataNm="'productName'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
          </div>
        </v-col>
        <v-col :sm="3" :lg="3" align="right">
          <kbutton
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'search'"
            @click="searchBtn"
            >{{ $t('MES_CommLang.MES_CommLang_00277')
            }}<!--조회-->
          </kbutton>
          <kbutton
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'save'"
            @click="selectRow"
            >{{ $t('MES_CommLang.MES_CommLang_00169')
            }}<!--선택-->
          </kbutton>
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height: calc(100% - 94px)">
        <KendoGrid
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="gridData"
          :sortable="true"
          :columns="headerParam.gridHeader"
          :resizable="true"
          :edit-field="'inEdit'"
          :selected-field="selectedField"
          :disabledCheckHeaderArr="disabledCheckHeaderArr"
          :isPaging="true"
          :reSetPage="this.reSetPage"
          @gridrowclick="onRowClick"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import MesSelectBox from '@/components/common/select/MesSelectBox';
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    kbutton: Button,
    KendoGrid,
    InputText,
    FadeLoader,
    Card,
    CardBody,
    DropDownList,
    MesSelectBox,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: () => $t('MES_CommLang.MES_CommLang_00426'), //모델링설정목록
    },
    callBack: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridHeight: '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvSelectModelingConfirmList', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
      },
      disabledCheckHeaderArr: ['CONFIRMFLAG', 'ACTIVESTATE'],
      selectedID: null,
      productid: '',
      productName: '',
      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스
      value: {},
      productGroup: [],
      isLoading: true,
      reSetPage: false,
    };
  },
  computed: {},
  async mounted() {
    await this.getProductGroupData();
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getGridData();
  },
  methods: {
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    async searchBtn() {
      this.reSetPage = true;
      await this.getGridData();
    },
    selectProGroup(event) {
      this.value = event.value;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    //제품그룹명 combobox 가져오기
    async getProductGroupData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProdGrpList',
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
            this.productGroup.push({
              id: data[i].PRODUCTGROUPID,
              text: data[i].PRODUCTGROUPNAME,
            });
            this.value = this.productGroup[0];
          }
        }
      });
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetModelingConfirmDataList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          productid: this.productid,
          productName: this.productName,
          ProductionType: this.ProductionType,
          productGroupID: this.$refs['cmbProGroup'].value.id,
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
        this.$nuxt.$emit('iccReset');
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.gridData = data;
        this.isLoading = false;
      });
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      if (event.dataItem.PROCESSROUTEID === null) {
        this.$refs['alertPop'].show(
          $t('MES_CommLang.MES_CommLang_00456'),
          $t('MES_MsgLang.MES_MsgLang_00045')
        ); // 알림, 라우팅설정이 안되어 있습니다. 확인해주시기 바랍니다.
        return;
      }
      this.$emit('searchBtn', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      if (returnData.length === 0) {
        this.$refs['alertPop'].show(
          $t('MES_CommLang.MES_CommLang_00456'),
          $t('MES_MsgLang.MES_MsgLang_00085')
        ); // 알림, 선택된 제품이 없습니다.
        return;
      }

      if (returnData.PROCESSROUTEID === null) {
        this.$refs['alertPop'].show(
          $t('MES_CommLang.MES_CommLang_00456'),
          $t('MES_MsgLang.MES_MsgLang_00045')
        ); // 알림, 라우팅설정이 안되어 있습니다. 확인해주시기 바랍니다.
        return;
      }
      this.$emit('searchBtn', returnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
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
</script>
