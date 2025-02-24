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
      <v-row no-gutters style="margin-bottom: 20px">
        <v-col :sm="7" :lg="7">
          <div class="form-group-wrap">
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00294') }}</label
              ><!--창고코드-->
              <InputText
                ref="warehouseCode"
                :dataNm="'warehouseCode'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('MES_CommLang.MES_CommLang_00293') }}</label
              ><!--창고명-->
              <InputText
                ref="warehouseName"
                :dataNm="'warehouseName'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
          </div>
        </v-col>
        <v-col :sm="5" :lg="5" align="right">
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
          :gridDropDownList="headerParam.enumComboBox"
          :resizable="true"
          :edit-field="'inEdit'"
          :readonly="false"
          :selected-field="selectedField"
          :isPaging="true"
          :reSetPage="this.reSetPage"
          @gridrowclick="onRowClick"
          @rowdblclick="rowdblclick"
        />
      </div>
    </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';

export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
      default: () => '',
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
      // gridOriData: [],
      gridHeight: '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvWarehouse', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: false,
        gridHeader: [],
        enumComboBox: [],
      },
      isLoading: true,
      reSetPage: false,
      disableGrid: false,
      warehouseCode: '',
      warehouseName: '',
    };
  },
  computed: {},
  async mounted() {
    await this.getGridData();
  },
  methods: {
    async searchBtn() {
      this.reSetPage = true;
      await this.getGridData();
    },
    selectProGroup(event) {
      this.value = event.value;
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridData = [];
      this.gridOriData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetWhouseList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          WAREHOUSEID: this.warehouseCode,
          WAREHOUSENAME: this.warehouseName,
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
      if (event.dataItem.rowStat != 'N') {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          '저장 후 선택해주세요.'
        ); /* 알림, 저장 후 선택해주세요. */
        return;
      }
      this.$emit('warehouseSelectedRow', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      if (returnData[0].rowStat != 'N') {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          '저장 후 선택해주세요.'
        ); /* 알림, 저장 후 선택해주세요. */
        return;
      }
      this.$emit('warehouseSelectedRow', returnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
  },
};
</script>
