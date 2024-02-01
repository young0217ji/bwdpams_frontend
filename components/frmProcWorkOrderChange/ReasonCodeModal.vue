<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="사유코드"
      width="40%"
      height="650"
      @close="toggleDialog"
    >
    <v-row ref="searchFilter">
      <v-col :sm="12" :lg="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :md="8" :sm="8">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00142") }}</label> <!--설비코드-->
                    <InputText
                      ref="reasonCode"
                      :dataNm="'reasonCode'"
                      :disabled="false"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00143") }}</label> <!-- 설비명 -->
                    <InputText
                      ref="description"
                      :dataNm="'description'"
                      :disabled="false"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :cols="4" align="right">
                <Button :theme-color="'primary'" icon="search" @click="searchBtn" >{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button> <!-- 조회 -->
                <Button :theme-color="'primary'" icon="check"  @click="selectRow">{{ $t("MES_CommLang.MES_CommLang_00169") }}</Button> <!-- 선택 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="12" :lg="12" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <div ref="divWrapper" style="height: calc(100%)">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :isPaging="true"
                @gridrowclick="onRowClick"
                @rowdblclick="rowdblclick"
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
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import InputText from "@/components/common/input/InputText";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  
  
  
  export default {
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    CardBody,
    CardTitle,
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
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
    initData: {

    }
  },
  data() {
    return {
      gridData: [],
      gridHeader: [],
      gridHeight: "400px",
      columns: [],
      selectedField: "selected",
      headerParam: {
        gridid: "dgvReasoncodeList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      noFirstCheck: true,
      noRowstat: true,
      defaultValue: "",
    };
  },
  computed: {

  },
  async mounted() {
    await this.getGridData();
  },
  methods: {
    toggleDialog() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },


    // 검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },

    // 조회 버튼 클릭시
    async searchBtn() {
      this.getGridData();
    },

    //그리드 로우 클릭
    onRowClick(event) {
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit("selectedRow", event.dataItem);
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      this.$emit('selectedRow', returnData[0]);
      this.$emit("visibleDialog", !this.visibleDialog);
    },

    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        queryVersion: "00003",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          reasonCode: this.reasonCode,
          description: this.description,
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
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit("iccReset");
        this.gridData = data;
      });
    },

  },
}

</script>
  
