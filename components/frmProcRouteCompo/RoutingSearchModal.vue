<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="$t('MES_CommLang.MES_CommLang_00090')"
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
                  <Label>{{ $t('MES_CommLang.MES_CommLang_00087') }}</Label>
                  <!-- 라우팅ID -->
                  <InputText
                    ref="processrouteid"
                    :boxWidth="'90%'"
                    :dataNm="'processrouteid'"
                    :disabled="false"
                    :searchOption="true"
                    :searchFunc="getGridData"
                    @input-text-set="searchInput"
                  />
                </div>
                <div class="form-group">
                  <Label>{{ $t('MES_CommLang.MES_CommLang_00086') }}</Label>
                  <!-- 라우팅명 -->
                  <InputText
                    ref="processroutename"
                    :boxWidth="'90%'"
                    :dataNm="'processroutename'"
                    :disabled="false"
                    @input-text-set="searchInput"
                    :searchOption="true"
                    :searchFunc="getGridData"
                  />
                </div>
              </div>
            </v-col>
            <v-col :sm="4" :lg="3" align="right">
              <Button
                :theme-color="'primary'"
                :size="'medium'"
                icon="search"
                @click="getGridData"
                >{{ $t('CommLang.btn.selectBtn') }}</Button
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
              :gridItems="items"
              :sortable="true"
              :columns="gridHeader"
              :resizable="false"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              :disabledCheckHeaderArr="disabledCheckHeaderArr"
              :isPaging="true"
              @gridrowclick="onRowClick"
              @rowdblclick="rowdblclick"
              @sortChangeHandler="sortChangeHandler"
            />
          </div>
        </v-col>
      </v-row>
    </Dialog>

    <div
      v-if="isLoading"
      class="loading-container"
      :style="{ 'z-index': '999999', position: 'relative' }"
    >
      <div class="loading">
        <FadeLoader />
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';

export default {
  name: 'SearchModal',
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
      gridHeight: '100px',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvSelectProcessRoute', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
      },
      disabledCheckHeaderArr: ['ACTIVESTATE', 'CONFIRMFLAG', 'COMMONFLAG'],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      processrouteid: '',
      isLoading: true,
    };
  },
  computed: {
    items() {
      return this.gridData.map(item => ({
        ...item,
        selected: item.PROCESSROUTEID === this.selectedID,
      }));
    },
  },
  async mounted() {
    await this.getGridData();
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSelProcRoute',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processrouteid: this.processrouteid,
          processroutename: this.processroutename,
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
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridData = data;
        this.isLoading = false;
      });
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.selectedID = event.dataItem.PROCESSROUTEID;
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit('routingInfo', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const retuenData = this.items.filter(x => x.selected);
      this.$emit('routingInfo', retuenData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
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
