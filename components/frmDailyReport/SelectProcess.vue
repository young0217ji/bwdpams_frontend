<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="$t('MES_CommLang.MES_CommLang_00058')"
      width="70%"
      height="700"
      @close="toggleDialog"
    >
      <v-row ref="searchFilter" no-gutters>
        <v-col :cols="12">
          <v-row class="search-box" align="center" no-gutters>
            <v-col :sm="6" :lg="7">
              <div class="form-group-wrap">
                <div class="form-group">
                  <label>{{ $t('MES_CommLang.MES_CommLang_00053') }}</label>
                  <!-- 공정ID -->
                  <InputText
                    ref="PROCESSID"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSID'"
                    :disabled="false"
                    @input-text-set="searchInput"
                  />
                </div>
                <div class="form-group">
                  <label>{{ $t('MES_CommLang.MES_CommLang_00055') }}</label>
                  <!-- 공정명 -->
                  <InputText
                    ref="PROCESSNAME"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSNAME'"
                    :disabled="false"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :sm="6" :lg="5" align="right">
              <Button
                :theme-color="'primary'"
                :size="'medium'"
                icon="search"
                @click="getGridData"
                >{{ $t('MES_CommLang.MES_CommLang_00277') }}</Button
              >
              <!-- 조회 -->
              <Button
                :theme-color="'primary'"
                :size="'medium'"
                icon="check"
                @click="selectRow"
                >{{ $t('MES_CommLang.MES_CommLang_00169') }}</Button
              >
              <!-- 선택 -->
              <Button
                :theme-color="'primary'"
                :size="'medium'"
                icon="close"
                @click="toggleDialog"
                >{{ $t('MES_CommLang.MES_CommLang_00413') }}</Button
              >
              <!-- 닫기 -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row ref="contents">
        <v-col :cols="12" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper1" style="height: calc(100% - 0px)">
                <KendoGrid
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="items"
                  :sortable="true"
                  :columns="sourceHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :isPaging="true"
                  :selected-field="selectedField"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
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
import KendoTree from '@/components/common/KendoTree';
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { TreeView } from '@progress/kendo-vue-treeview';
import { arrayToTree } from 'performant-array-to-tree';
import { mapState, mapMutations, mapActions } from 'vuex';
import customGridHeaderMixin from '@/mixin/customGridHeaderMixin';
import { DropDownList } from '@progress/kendo-vue-dropdowns';

export default {
  name: 'InsertOperation',
  mixins: [mixinGlobal, gridHeaderMinin, customGridHeaderMixin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
    CardTitle,
    TreeView,
    Card,
    CardBody,
    KendoTree,
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
    itemHierarchicalIndex: {
      type: String,
      require: true,
    },
    insertHierarchi: {
      type: Object,
      require: true,
    },
    initData: {},
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridHeight: '450px',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvOperationPop', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        xOverflowYn: false,
      },
      disabledCheckHeaderArr: ['ACTIVESTATE'],
      selectedID: null,
      selectedRow: [],
      plantid: '',
      PROCESSNAME: '',
      PROCESSID: '',
      targetData: [],
      noRowstat: true,
      sourceHeader: [],
      rowIdx: 0,
      value: [],
      value2: [],
      line: [],
      workCenter: [],
      AREAID: '',
      AREANAME: '',
    };
  },
  computed: {
    ...mapState({
      dgvOperation: state => state.modules.frmPRC.dgvOperation,
      dgvRecipe: state => state.modules.frmPRC.dgvRecipe,
      frmPRC_Data: state => state.modules.frmPRC.frmPRC_Data,
      seq: state => state.modules.frmPRC.seq,
    }),
    areAllSelected() {
      return (
        this.targetData.findIndex(x => x.checked === false) === -1 &&
        this.targetData.length !== 0
      );
    },
    items() {
      return this.gridData.map(item => ({
        ...item,
        selected: item.PROCESSID === this.selectedID,
      }));
    },
  },
  async mounted() {
    this.sourceHeader = await this.getCustomHeader(
      'dgvOperationPop',
      true,
      true
    );
    this.getGridData();
    console.log('process', this.initData);
  },
  methods: {
    ...mapActions({
      setdgvOperationAction: 'modules/frmPRC/setdgvOperationAction',
      setTreeDataAction: 'modules/frmPRC/setTreeDataAction',
      setSeqsAction: 'modules/frmPRC/setSeqsAction',
    }),

    //그리드 데이터 가져오기
    async getGridData() {
      this.isLoading = true;
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProcList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processid: this.PROCESSID,
          processname: this.PROCESSNAME,
          WORKCENTER: this.initData,
        },
      }).then(async res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            rowIdx: 0,
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridData = data;
      });
    },

    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      this.targetData = this.targetData.map(x => {
        if (event.dataItem.UUID === x.UUID) {
          return { ...x, selected: !x.selected };
        }
        return x;
      });
    },
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.targetData = this.targetData.map(item => {
        return { ...item, selected: checked };
      });
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.selectedID = event.dataItem.PROCESSID;
      this.plantid = event.dataItem.PLANTID;
      this.selectedRow = event.dataItem;
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      console.log(event.dataItem);
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit('selectedRow', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      console.log(this.gridData);
      this.$emit('selectedRow', this.selectedRow);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    onItemClick(event) {},
    addBtn() {
      if (this.selectedRow.length === 0) {
        return;
      }
      //const target = this.gridData.filter(x => x.selected).map(x => ({...x, selected: true}))
      this.processDataSet();
    },
    delBtn() {
      this.targetData = this.targetData.filter(x => !x.selected);
    },
  },
};
</script>
