<template>
    <div>
      <span v-if="!visibleDialog">
        <Button @click="toggleDialog">Open Dialog</Button>
      </span>
      <Dialog
        v-if="visibleDialog"
        :title="$t('MES_CommLang.MES_CommLang_00597')"  
        width="50%"
        height="650"
        @close="toggleDialog"
      >
        <v-row ref="searchFilter" no-gutters>
          <v-col :cols="12">
            <v-row class="search-box" align="center" no-gutters>
              <v-col :sm="8" :lg="9">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00037") }}</Label> <!-- PM코드 -->
                    <InputText
                      ref="pmcodeid"
                      :boxWidth="'90%'"
                      :dataNm="'pmcodeid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="getGridData"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00598") }}</Label> <!-- PM코드명 -->
                    <InputText
                      ref="pmcodename"
                      :boxWidth="'90%'"
                      :dataNm="'pmcodename'"
                      :disabled="false"
                      @input-text-set="searchInput"
                      :searchOption="true"
                      :searchFunc="getGridData"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="4" :lg="3" align="right">
                <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="getGridData" >{{ $t("CommLang.btn.selectBtn") }}</Button> <!-- 조회 -->
                <Button :theme-color="'primary'" :size="'medium'" icon="check"  @click="selectRow">{{ $t("MES_CommLang.MES_CommLang_00169") }}</Button> <!-- 선택 -->
              </v-col>
            </v-row>
          </v-col>
        </v-row>
  
        <v-row ref="contents">
          <v-col :cols="12" :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
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
                :gridDropDownList="headerParam.enumComboBox"
                @gridrowclick="onRowClick"
                @rowdblclick="rowdblclick"
              />
            </div>
          </v-col>
        </v-row>
  
      </Dialog>
  
      <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
        <div class="loading">
          <FadeLoader />
        </div>
      </div>
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
  import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
  import KendoGrid from "@/components/common/KendoGrid"
  import InputText from "@/components/common/input/InputText";
  import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  
  
  
  export default { 
    name: "SearchModal",
    mixins: [mixinGlobal, gridHeaderMinin],
    components: {
      Dialog,
      DialogActionsBar,
      Button,
      KendoGrid,
      InputText,
      FadeLoader,
      Card,
      CardBody,
      CardTitle,
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
    },
    data() {
      return {
        gridData : [],
        gridHeight : '100px',
        selectedField: 'selected',
        headerParam: {
            gridid: "dgvPMMaster", // 그리드 ID
            noRowstat: true,
            gridHeader: [],
            noFirstCheck: true,
            enumComboBox: [],
            xOverflowYn: true
        },
        // disabledCheckHeaderArr: [ "ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG" ],
        noRowstat: true,
        selectedID: null,
        selectedCodeList: [],
        pmcodeid: "",
        pmcodename: "",
        isLoading: true,
        selectedPMCodeID: ''
      }
    },
    computed: {

    },
    async mounted() {
      await this.getGridData();
    },
    methods: {
      //그리드 데이터 가져오기
      async getGridData() {
        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetPmCodeDefinition",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            pmcodeid: this.pmcodeid,
            pmcodename: this.pmcodename
          }
        }).then((res) => {
           const data = res.map((x, idx) => {
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: false,
              newRow: false
            }
          });
          this.$nuxt.$emit('iccReset')
          this.gridData = data;
          this.isLoading = false
        })
      },
      openAlert(title, message, visiable=true, width="350px"){
        this.$refs.alertPop.title = title;
        this.$refs.alertPop.message = message;
        this.$refs.alertPop.visibleDialog = visiable;
        this.$refs.alertPop.modalWidth = width;
      },
      toggleDialog() {
        this.$emit('visibleDialog', !this.visibleDialog)
      },
      //그리드 로우 클릭
      onRowClick (event) {
        // this.selectedPMCodeID = event.dataItem.PMCODEID;
        // this.gridData.forEach(x => (x.selected = false));
        // event.dataItem[this.selectedField] = true;
        this.row = { ...event.dataItem };
          // console.log("this.row::::::", this.row);
          this.gridData.forEach(
            (item) => (item.selected = item.idx === event.dataItem.idx)
          );
          this.selected = event.dataItem;
      },
      //그리드 더블 클릭
      rowdblclick() {
        const returnData = this.gridData.filter(x => x.selected);
        this.$emit('selectedPMCode', returnData[0]);
        this.$emit('visibleDialog', !this.visibleDialog);
      },
      //row 선택
      selectRow() {
        const returnData = this.gridData.filter(x => x.selected);
        this.$emit('selectedPMCode', returnData[0]);
        this.$emit('visibleDialog', !this.visibleDialog);
      },
    //   //맨앞 checkBox 클릭
    //   onSelectionchange(event) {
    //     event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    //   },
      searchInput(nm, val){
        this[nm] = val;
      },
      
    },
  };
  </script>