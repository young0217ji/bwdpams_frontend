<template>
    <div>
      <span v-if="!visibleDialog">
        <Button @click="toggleDialog">Open Dialog</Button>
      </span>
      <Dialog v-if="visibleDialog" :title="$i18n.t('MES_CommLang.MES_CommLang_00262')" width="60%" height="600"
        @close="toggleDialog">
        <v-row ref="searchFilter" class="search-box">
          <v-col :sm="9" :lg="10" align="left">
            <div class="form-group-wrap">
              <div class="form-group" style="margin-right: 34px;">
                <Label> {{ $t("MES_CommLang.MES_CommLang_00733") }} </Label> <!-- 회사 ID -->
                <InputText ref="companyid" :boxWidth="'100%'" :dataNm="'companyid'" :disabled="false" :searchOption="true"
                  :searchFunc="getGridData" @input-text-set="searchInput" />
              </div>
              <div class="form-group">
                <label>{{ $t("MES_CommLang.MES_CommLang_00366") }}</label> <!-- 회사명 -->
                <InputText ref="companyName" :dataNm="'companyName'" :disabled="false" :searchOption="true"
                  :searchFunc="searchBtn" @input-text-set="searchInput" />
              </div>
              <div class="form-group">
              <label>{{ $t("MES_CommLang.MES_CommLang_00264") }}</label> <!-- 회사구분 -->
              <MesSelectBox :enumID="'companyType'" :allYN="true" :dataNm="'companyType'"
                @comboChange="comboChange"></MesSelectBox>
            </div>
            </div>
          </v-col>
          <v-col :sm="3" :lg="2" align="right">
            <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="getGridData">{{
              $t("MES_CommLang.MES_CommLang_00277") }}</Button>
            <Button :theme-color="'primary'" :size="'medium'" icon="check" @click="selectRow">{{
              $t("MES_CommLang.MES_CommLang_00169") }}</Button>
          </v-col>
        </v-row>
        <v-row ref="contents">
          <v-col :cols="12" :class="'divListWapper'" :style="{ height: 'calc(100% - 33px)' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid :isPaging="true" ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                :columns="gridHeader" :resizable="false" :edit-field="'inEdit'" :selected-field="selectedField"
                @gridrowclick="onRowClick" @rowdblclick="rowdblclick" />
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
  import { DropDownList } from "@progress/kendo-vue-dropdowns";
  
  
  export default {
    name: 'FrmCompanysearch',
    mixins: [mixinGlobal, gridHeaderMinin],
    components: {
      Dialog,
      DialogActionsBar,
      Button,
      KendoGrid,
      InputText,
      MesSelectBox,
      DropDownList
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
        companyid: '', // 회사 ID 검색
        companyName: '', // 회사명 검색
        companyType: '', // 회사구분 검색
        value : {},
        columns: [],
  
        headerParam: {
          gridid: 'dgvCompanyDefinition',
          rowStat: '',
        },
        noFirstCheck: true,
        noRowstat: true,
        selectedID: null,
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
          selected: item.COMPANYID === this.selectedID,
        }));
      },
    },
    async mounted() {
      await this.getGridData();
    },
    methods: {
      async searchBtn(){
        this.getGridData();
      },
      //그리드 데이터 가져오기
      async getGridData() {
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetCompanyDefinitionList',
          sendParam: {
            PLANTID: this.$auth.$state.user.plantId,
            COMPANYID: this.companyid,
            COMPANYNAME: this.companyName,
            COMPANYTYPE: this.companyType,
          },
        }).then(res => {
          const data = res.map((x, idx) => {
            return {
              ...x,
              rowStat: 'N',
              selected: idx === 0,
              idx: idx,
              inEdit: false,
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
        const selectedIdx = event.dataItem.idx;
        this.gridData.forEach(item => {
          item.selected = item.idx === selectedIdx;
        });
        this.selectedID = event.dataItem.COMPANYID;
      },
  
      //그리드 더블 클릭
      rowdblclick(event) {
        this.$emit('companyCode', event.dataItem);
        this.$emit('visibleDialog', !this.visibleDialog);
      },
      //선택
      selectRow() {
        const returnData = this.gridData.filter(x => x.selected);
        this.$emit('companyCode', returnData[0]);
        this.$emit('visibleDialog', !this.visibleDialog);
        console.log(returnData[0]);
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
    