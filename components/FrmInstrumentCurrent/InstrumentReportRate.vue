<template>
  <div>
    <link rel="stylesheet" href="https://kendo.cdn.telerik.com/2023.1.117/styles/kendo.default-nordic.min.css">
    <Chart>
      <ChartTitle :text="'계측기 Report 현황'" />
      <ChartLegend :position="'bottom'" />
      <ChartSeries>
        <ChartSeriesItem
          :type="'pie'"
          :data-items="pieData"
          :field="'value'"
          :category-field="'category'"
          :labels="{ visible: true, content: labelContent }"
        />
      </ChartSeries>
    </Chart>
  </div>
</template>

<script>
let myTitle;
let myMenuId;
import mixinGlobal from "@/mixin/global.js";
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
} from "@progress/kendo-vue-charts";

export default {
  mixins: [mixinGlobal],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
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
    Chart,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem,
    ChartTitle,
  },
  data() {
    return {
      pieData: []
    }
  },
  async created(){
      this.searchData();
  },
  methods: {
    async searchData(){
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetInstrumentChart",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        }
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            category: x.DEPARTMENTNAME,
            value: x.ITEM_PERCENT
          };
        });
        this.pieData = data;
      });
      //console.log('pie', this.pieData)
    },
    labelContent(props) {
      let formatedNumber = Number(props.dataItem.value).toLocaleString(
        
        {
          style: "percent",
          //minimumFractionDigits: 2,
        }
      );
      return `${formatedNumber}%`;
    },
  },
};
</script>
<style lang="scss">
</style>