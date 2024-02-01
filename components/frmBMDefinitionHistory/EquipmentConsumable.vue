<template>
    <div>
      <span v-if="!visibleDialog">
        <Button @click="toggleDialog">Open Dialog</Button>
      </span>
      <Dialog
        v-if="visibleDialog"
        :title="title"
        width="60%"
        height="500"
        @close="toggleDialog"
      >
        <v-row no-gutters style="margin-bottom: 30px;">
            
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
            :readonly="false"
            :selected-field="selectedField"
            :isPaging="true"
            :reSetPage="this.reSetPage"
            @sortChangeHandler="sortChangeHandler"
          />
        </div>
      </Dialog>
      <AlertPop 
        ref="alertPop"
        :is="'alertPop'"
      />
      <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    </div>
  </template>
  <script>
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  import mixinGlobal from "@/mixin/global.js";
  import { DropDownList } from '@progress/kendo-vue-dropdowns';
  import MesSelectBox from '@/components/common/select/MesSelectBox';
  //import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
//   import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
  import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
  import KendoGrid from "@/components/common/KendoGrid";
  import InputText from "@/components/common/input/InputText";
  import FadeLoader from "vue-spinner/src/FadeLoader.vue";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  
  
  
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
        default: () =>""//모델링설정목록
      },
      callBack: {
        type: Function,
        default: () => true,
      },
      BMCode: {
        type: String,
        default: ()=>''
      }
    },
    data() {
      return {
        gridHeader: [],
        gridData: [],
        gridOriData: [],
        gridHeight: "400px",
        selectedField: "selected",
        headerParam: {
          gridid: "dgvEquipmentConsumable", // 그리드 ID
          rowStat: "", //rowStat 표시 여부
          noFirstCheck: true,
          noRowstat: true,
          gridHeader: [],
          enumComboBox: [],
        },
        selectedID: null,
        sparepartid: "",
        sparepartname: "",
        isLoading: true,
        reSetPage: false,
        disableGrid: false
      };
    },
    computed: {},
    async mounted() {
      await this.getGridData();
    },
    methods: {
      notPageReset(flag) {
        // flag : false
        this.reSetPage = flag;
      },
      
      //그리드 데이터 가져오기
      async getGridData() {
        console.log('BMCode', this.BMCode);
        this.gridData = [];
        this.gridOriData = [];
        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetBMConsumable",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            REQUESTID: this.BMCode,
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
              resizable: true,
            };
          });
          this.$nuxt.$emit("iccReset");
          this.gridData = data;
          this.gridOriData = data;
          this.isLoading = false;
        });
      },
      toggleDialog() {
        this.$emit("visibleDialog", !this.visibleDialog);
      },
    
    },
  };
  </script>