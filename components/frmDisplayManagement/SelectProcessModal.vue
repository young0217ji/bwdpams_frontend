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
          </div>
          <div class="form-group-wrap">
            <div class="form-group">
              <label>{{ $t("MES_CommLang.MES_CommLang_00053") }}</label><!--공정ID-->
              <InputText
                ref="processId"
                :dataNm="'processId'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>{{ $t("MES_CommLang.MES_CommLang_00055") }}</label><!--공정명-->
              <InputText
                ref="processName"
                :dataNm="'processName'"
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
            >{{ $t("MES_CommLang.MES_CommLang_00277") }}<!--조회-->
          </kbutton> 
          <kbutton
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'save'"
            @click="selectRow"
            >{{ $t("MES_CommLang.MES_CommLang_00169") }}<!--선택-->
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
          :isPaging="true"
          :reSetPage="this.reSetPage"
          @gridrowclick="onRowClick"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import MesSelectBox from '@/components/common/select/MesSelectBox';
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import InputText from "@/components/common/input/InputText";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";

let loginInfo = JSON.parse(localStorage.getItem("LoginInfo"));

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
      default: () => $t("MES_CommLang.MES_CommLang_00426"),//모델링설정목록
    },
    callBack: {
      type: Function,
      default: () => true,
    },
    masterData: {

    }
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridHeight: "400px",
      selectedField: "selected",
      headerParam: {
        gridid: "dgvProcessDefinition2", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
      },
      selectedID: null,
      processid: '',
      processname: '',
      value : {},
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
    console.log("@", this.masterData)
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
      // localStorage의 LoginInfo 내용 가져오기
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
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessPopup",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          PROCESSID: this.processId,
          PROCESSNAME: this.processName,
        },
      }).then((res) => {
        console.log(res);
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        this.$nuxt.$emit("iccReset");
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.gridData = data;
        this.isLoading = false;
      });
    },
    toggleDialog() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      if(event.dataItem.PROCESSID.lastIndexOf("Monitoring") == 0 || event.dataItem.PROCESSID.lastIndexOf((this.$i18n.t('MES_CommLang.MES_CommLang_00723'))) == 0){
        for(let i = 0; i < this.masterData.length; i++){
          if(event.dataItem.PROCESSID == this.masterData[i].PROCESSID){
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_CommLang.MES_CommLang_00053') + ": " +event.dataItem.PROCESSID +" " +  this.$i18n.t('MES_CommLang.MES_CommLang_00177') + ": NONE " + this.$i18n.t('MES_MsgLang.MES_MsgLang_00269'));
           return;
          }
        }
      }
      this.$emit('selectedRow', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      if(returnData[0].PROCESSID.lastIndexOf("Monitoring") == 0 || returnData[0].PROCESSID.lastIndexOf((this.$i18n.t('MES_CommLang.MES_CommLang_00723'))) == 0){
        for(let i = 0; i < this.masterData.length; i++){
          if(returnData[0].PROCESSID == this.masterData[i].PROCESSID){
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_CommLang.MES_CommLang_00053') + ": " + returnData[0].PROCESSID +" " +  this.$i18n.t('MES_CommLang.MES_CommLang_00177') + ": NONE " + this.$i18n.t('MES_MsgLang.MES_MsgLang_00269'));
           return;
          }
        }
      }
      this.$emit('selectedRow', returnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
    sortChangeHandler(e) {
      const isAscending = e.sort[0]?.dir == "asc";
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