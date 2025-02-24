<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="$i18n.t('MES_CommLang.MES_CommLang_00262')"
      width="60%"
      height="600"
      @close="toggleDialog"
    >
      <v-row ref="searchFilter" class="search-box">
        <v-col :sm="9" :lg="10" align="left">
          <div class="form-group-wrap">
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00542') }}</label>
              <!-- 제품그룹명 -->
              <DropDownList
                ref="cmbProGroup"
                :style="{ width: '200px' }"
                :data-items="productGroup"
                :text-field="'text'"
                :data-item-key="'id'"
                :value="value"
                @change="selectProGroup"
              >
              </DropDownList>
            </div>
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00264') }}</label>
              <!-- 제품구분 -->
              <MesSelectBox
                :enumID="'ProductionType'"
                :allYN="true"
                :dataNm="'ProductionType'"
                @comboChange="comboChange"
              ></MesSelectBox>
            </div>
          </div>
          <div class="form-group-wrap">
            <div class="form-group" style="margin-right: 34px">
              <Label> {{ $t('MES_CommLang.MES_CommLang_00263') }} </Label>
              <!-- 품번코드 -->

              <InputText
                ref="productid"
                :boxWidth="'100%'"
                :dataNm="'productid'"
                :disabled="false"
                :searchOption="true"
                :searchFunc="getGridData"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00260') }}</label>
              <!-- 품번명 -->
              <InputText
                ref="productName"
                :dataNm="'productName'"
                :disabled="false"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
          </div>
        </v-col>
        <v-col :sm="3" :lg="2" align="right">
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            icon="search"
            @click="getGridData"
            >{{ $t('MES_CommLang.MES_CommLang_00277') }}</Button
          >
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            icon="check"
            @click="selectRow"
            >{{ $t('MES_CommLang.MES_CommLang_00169') }}</Button
          >
        </v-col>
      </v-row>
      <v-row ref="contents">
        <v-col
          :cols="12"
          :class="'divListWapper'"
          :style="{ height: 'calc(100% - 33px)' }"
        >
          <div ref="divWrapper" :style="{ height: '100%' }">
            <KendoGrid
              :isPaging="true"
              ref="rowGrid"
              :gridHeight="gridHeight"
              :gridItems="gridData"
              :sortable="true"
              :columns="gridHeader"
              :resizable="false"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              @gridrowclick="onRowClick"
              @rowdblclick="rowdblclick"
            />
          </div>
        </v-col>
      </v-row>
    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { DropDownList } from '@progress/kendo-vue-dropdowns';

export default {
  name: 'SearchModal',
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    MesSelectBox,
    DropDownList,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
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
      gridOriData: [],
      gridHeight: '',
      selectedField: 'selected',
      productid: '', // 제품ID 검색
      productName: '', // 제품명 검색
      ProductionType: '', //제품구분 콤보박스
      productGroupID: '', //제품그룹 콤보박스
      value: {},
      productGroup: [],
      columns: [],

      headerParam: {
        gridid: 'dgvProductListModal',
        rowStat: '',
      },
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      lotid: '',
      selected: null,
    };
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
    items() {
      return this.gridData.map(item => ({
        ...item,
        selected: item.PRODUCTID === this.selectedID,
      }));
    },
  },
  async mounted() {
    // await this.getGridData();
    await this.getProductGroupData();
  },
  methods: {
    async searchBtn() {
      this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProductList',
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
            selected: idx === 0,
            idx: idx,
            inEdit: true,
            newRow: false,
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
      });
    },
    // 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {
      // localStorage의 LoginInfo 내용 가져오기
      this.gridOriData = [];
      this.gridData = [];
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
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selectedID = event.dataItem.PRODUCTID;
    },

    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit('productCode', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      this.$emit('productCode', returnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
      console.log(returnData[0]);
    },
    selectProGroup(event) {
      this.value = event.value;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
  },
};
</script>
