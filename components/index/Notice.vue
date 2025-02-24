<template>
  <div>
    <Card ref="gridCard" :style="{ height: '100%' }">
      <CardBody :style="{ height: '100%', width: '100%' }">
        <div ref="divWrapper" :style="{ height: '100%' }">
          <KendoGrid
            ref="rowGrid"
            :gridItems="gridData"
            :gridHeight="gridHeight"
            :sortable="true"
            :columns="headerParam.gridHeader"
            :edit-field="'inEdit'"
            :selected-field="selectedField"
            :isPaging="false"
            :gridDropDownList="headerParam.enumComboBox"
            @sortChangeHandler="sortChangeHandler"
            @rowdblclick="rowDoubleClick"
          />
        </div>
      </CardBody>
    </Card>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <writePopUp
      ref="writePopUp"
      v-if="writePopupVisible"
      :visibleDialog="writePopupVisible"
      :title="writePopupTitle"
      :selected-field="selectedField"
      :initData="initData"
      :callBack="returnCancel"
      @visibleDialog="val => (writePopupVisible = val)"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import writePopUp from '@/components/index/writePopUp';

let myTitle;
let myMenuId;

const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일

export default {
  mixins: [mixinGlobal, gridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit('setActiveMenuInfo', myState.menuData[myMenuId]);
    myTitle = await myState.activeMenuInfo.menuName;
  },
  meta: {
    title: () => {
      return myTitle;
    },
    menuId: myMenuId,
    closable: true,
  },
  components: {
    Utility,
    Card,
    CardBody,
    CardTitle,
    KendoGrid,
    writePopUp,
  },
  data() {
    return {
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvMainNotice', // 그리드 ID
        gridHeader: [],
        rowStat: '',
        noRowstat: true,
        noFirstCheck: true,
        xOverflowYn: true,
        enumComboBox: [],
      },
      title: '',
      startDate: Utility.setFormatDate(
        new Date(year - 1, month, day),
        'YYYY-MM-DD'
      ),
      endDate: Utility.setFormatDate(new Date(), 'YYYY-MM-DD'),
      writePopupTitle: '',
      writePopupVisible: false,
      initData: {},
      gridPageData: {},
    };
  },
  created() {},
  async mounted() {
    this.writePopupTitle = this.$i18n.t('MES_CommLang.MES_CommLang_00917');
    //await this.getGridData();
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
  },
  watch: {},
  methods: {
    // 조회버튼 클릭
    searchBtn() {
      this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      const { skip = 0, take = 20 } = this.gridPageData;
      this.mesGet({
        apiKey: 'mes/common/customquerypaging',
        queryId: 'GetNtcList',
        queryVersion: '00001',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          TITLE: this.title,
          STARTDATE: Utility.setFormatDate(this.startDate, 'YYYY-MM-DD'),
          ENDDATE:
            Utility.setFormatDate(this.endDate, 'YYYY-MM-DD') + ' 23:59:59',
          skip: skip,
          take: take,
        },
      }).then(({ list, paging, ...x }) => {
        const data = list.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          };
        });
        this.gridOriData = JSON.parse(JSON.stringify(data));
        this.gridPageData = paging;
        this.gridData = data;
        this.$refs.rowGrid.skip = 0;
      });
    },
    rowDoubleClick(event) {
      this.initData = event.dataItem;
      this.writePopupVisible = true;
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
    returnCancel(res) {
      if (res) {
        this.getGridData();
      }
    },
  },
};

const defaultData = {};
</script>
