<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="$i18n.t('MES_CommLang.MES_CommLang_00016')"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :sm="9" :lg="10">
          <div class="form-group-wrap">
            <div class="form-group">
              <label>Lot ID</label>
              <InputText
                ref="lotid"
                :dataNm="'lotid'"
                :disabled="false"
                :defaultValue="lotid"
                :searchOption="true"
                :searchFunc="getGridData"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00263') }}</label>
              <InputText
                ref="productid"
                :boxWidth="'98%'"
                :dataNm="'productid'"
                :disabled="false"
                :defaultValue="productid"
                :searchOption="true"
                :searchFunc="getGridData"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00199') }}</label>
              <div class="form-datepicker">
                <DatePicker
                  ref="fromdate"
                  :default-value="new Date(fromdate)"
                  :dataNm="'fromdate'"
                  :format="'yyyy-MM-dd'"
                  :disabled="!!lotstate"
                  @change="fromChange"
                />
              </div>
              <span class="i_tilde">~</span>
              <div class="form-datepicker">
                <DatePicker
                  ref="todate"
                  :default-value="new Date(todate)"
                  :dataNm="'todate'"
                  :format="'yyyy-MM-dd'"
                  :disabled="!!lotstate"
                  @change="toChange"
                />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00252') }}</label>
              <div class="form-chk">
                <Checkbox
                  ref="lotstate"
                  :dataNm="'lotstate'"
                  :disabled="false"
                  :defaultchecked="true"
                  @checkbox-set="chkVal"
                ></Checkbox>
              </div>
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
      <!--
      <v-row :style="{ 'margin-bottom': '10px' }">
        <v-col cols="5" align="left">
          <v-row class="search-box" align="center" no-gutters>
            <v-col :cols="2">
              <Label> Lot Id </Label>
            </v-col>
            <v-col :cols="4">
              <InputText
                ref="lotid"
                :boxWidth="'98%'"
                :dataNm="'lotid'"
                :disabled="false"
                :defaultValue="lotid"
                @input-text-set="searchInput"
              />
            </v-col>
            <v-col :cols="2">
              <Label> 제품코드 </Label>
            </v-col>
            <v-col :cols="4">
              <InputText
                ref="productid"
                :boxWidth="'98%'"
                :dataNm="'productid'"
                :disabled="false"
                :defaultValue="productid"
                @input-text-set="searchInput"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" align="left">
          <v-row class="search-box" align="center" no-gutters>
            <v-col :cols="2">
              <Label> 시작일자 </Label>
            </v-col>
            <v-col :cols="4">
              <DatePicker
                ref="fromdate"
                :default-value="new Date(fromdate)"
                :dataNm="'fromdate'"
                :format="'yyyy-MM-dd'"
                @change="fromChange"
              />
            </v-col>
            <v-col :cols="2">
              <Label> ~ </Label>
            </v-col>
            <v-col :cols="4">
              <DatePicker
                ref="todate"
                :default-value="new Date(todate)"
                :dataNm="'todate'"
                :format="'yyyy-MM-dd'"
                @change="toChange"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="1" align="left">
          <v-row class="search-box" align="center" no-gutters>
            <v-col cols="10">
              <Label> 재공 Lot </Label>
            </v-col>
            <v-col :cols="2">
              <Checkbox
                ref="lotstate"
                :dataNm="'lotstate'"
                :disabled="false"
                :defaultchecked="true"
                @checkbox-set="chkVal"
              ></Checkbox>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" align="right">
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            icon="search"
            @click="getGridData"
            >조회</Button
          >
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            icon="check"
            @click="selectRow"
            >선택</Button
          >
        </v-col>
      </v-row>
      -->
      <div ref="divWrapper" style="height: calc(100% - 44px)">
        <KendoGrid
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="items"
          :sortable="true"
          :columns="gridHeader"
          :resizable="true"
          :isPaging="true"
          :edit-field="'inEdit'"
          :selected-field="selectedField"
          :disabledCheckHeaderArr="disabledCheckHeaderArr"
          @selectionchange="onSelectionchange"
          @gridrowclick="onRowClick"
          @headerselectionchange="onHeaderSelectionChange"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import Utility from '~/plugins/utility';
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import Checkbox from '@/components/common/input/Checkbox';
import moment from 'moment';

export default {
  name: 'SearchModal',
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Utility,
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    DatePicker,
    Checkbox,
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
    chkNotReleaseLot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridHeight: '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvLotList', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
      },
      disabledCheckHeaderArr: ['ACTIVESTATE', 'CONFIRMFLAG', 'COMMONFLAG'],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      lotid: '',
      productid: '',

      fromdate: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
      todate: moment().format('YYYY-MM-DD'),
      lotstate: 'Released',
      // producttype: "",
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
        selected: item.LOTID === this.selectedID,
      }));
    },
  },
  async mounted() {
    this.fromdate = Utility.setFormatDate(this.fromdate, 'YYYYMMDD');
    this.todate = Utility.setFormatDate(this.todate, 'YYYYMMDD');
    await this.getGridData();
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      const sendParam = {
        plantid: this.$auth.$state.user.plantId,
        lotid: this.lotid,
        productid: this.productid,
        fromdate: !this.lotstate ? this.fromdate : '19000101',
        todate: !this.lotstate ? this.todate : '99991231',
        lotstate: this.lotstate,
        producttype: this.producttype,
      };

      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetLotSrchList',
        sendParam: sendParam,
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
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
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.selectedID = event.dataItem.LOTID;
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map(item => {
        return { ...item, selected: checked };
      });
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      if (this.chkNotReleaseLot && event.dataItem.LOTSTATE !== 'Released') {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00161')
        );
        return;
      }

      this.$emit('searchBtn', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const rerutnData = this.items.filter(x => x.selected);
      if (this.chkNotReleaseLot && rerutnData[0].LOTSTATE !== 'Released') {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00161')
        );
        return;
      }

      this.$emit('searchBtn', rerutnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
    toChange(e) {
      this.todate = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    fromChange(e) {
      this.fromdate = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    chkVal(nm, val) {
      this[nm] = val ? 'Released' : '';
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
