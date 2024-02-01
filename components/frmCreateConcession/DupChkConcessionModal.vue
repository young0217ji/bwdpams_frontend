<template>
    <div>
    <Dialog
      v-if="visibleDialog"
      title="특채신청 중복체크"
      width="70%"
      height="720px"
      @close="toggleDialog"
    >  
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <div class="form-group-wrap">
          <div class="form-group">
            <Label>{{ $t("MES_CommLang.MES_CommLang_00545") }}</Label> <!-- 품번 -->
            <Input 
              ref="productId" 
              v-model="productId"
              :style="{ width: '200px' }"
              :disabled="false" 
              :readonly="true"
              :class="'k-readonly'"
              />
          </div>
          <div class="form-group">
            <Label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</Label> <!-- 품명 -->
            <Input 
              ref="productName" 
              v-model="productName"
              :style="{ width: '200px' }"
              :disabled="false" 
              :readonly="true"
              :class="'k-readonly'"
              />
          </div>
        </div>
      </v-col> 
    </v-row>
    <v-row ref="contents">
        <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :isPaging="true"
                    :scrollable="false"
                    @rowdblclick="dupChkRowclick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>  
      </v-row>
    </Dialog>
  </div>
</template>

<script>

import Utility from '~/plugins/utility';
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import { TextArea, Input } from '@progress/kendo-vue-inputs';
import KendoGrid from '@/components/common/KendoGrid';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';

export default { 
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Utility,
    Dialog,
    DialogActionsBar,
    InputText,
    KendoGrid,
    Card,
    CardBody,
    CardTitle,
    Button,
    Input,
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    },
    productId: {
      type: String,
      require: false,
      default : ''
    },
    productName: {
      type: String,
      require: false,
      default : ''
    },
  },
  data() {
    return {
      loginInfo: "",
      plantID: this.$auth.$state.user.plantId,
      selectedField: "selected",
      gridHeight: "100px",
      columns: [],
      gridData: [],
      gridOriData: [],
      headerParam: {
        gridid: "dgvConcessionList", // 그리드ID
        noFirstCheck: true,
        noRowstat: true,
        gridHeader:[],
        xOverflowYn: true,
      },
    }
  },
  computed: {
  },
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getGridData();
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },

    // 그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetDupChkConcession",
        sendParam: {
            plantid: this.$auth.$state.user.plantId,
            requestitem: this.productId,
        
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
        this.gridData = data;
        });
    },

    // 중복체크
    dupChkRowclick(event) {
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.$emit('selectedDupChkRow', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },

  },
};
</script>