<template>
  <div>
    <v-row ref="contents" :style="{ height: '50%' }">
      <v-col :cols="6" :style="{ height: '100%' }" >
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <KendoGrid
              :ref="'rowGrid'"
              :gridHeight="gridHeight"
              :gridItems="items"
              :sortable="false"
              :columns="columns"
              :resizable="false"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              :isPaging="false"
              :scrollable="true"
              :dataItem="items">
            </KendoGrid>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="6" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <!-- 이미지삽입 -->
            <div class="img-1">&nbsp;</div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    
    <v-row ref="contents2" :style="{ height: '50%' }">
      <v-col :cols="6" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%', backgroundColor: '#333366'}">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle :style="{color: 'white'}">현재시간 15:58</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <label :style="{ backgroundColor: 'green', color: 'green', float: 'left'}">&nbsp; C </label> <!-- 색상 -->
                <label :style="{ fontWeight: 'bold', float: 'left', marginRight: '15px', color: 'white'}">&nbsp;: 98% 이상</label> <!-- 완료 -->
                <label :style="{ backgroundColor: 'blue', color: 'blue', float: 'left' }">&nbsp; C </label> <!-- 색상 -->
                <label :style="{ fontWeight: 'bold', float: 'left', marginRight: '15px', color: 'white'}">&nbsp;: 87~98% 미만</label> <!-- 진행중 -->
                <label :style="{ backgroundColor: 'red', color: 'red', float: 'left' }">&nbsp; C </label> <!-- 색상 -->
                <label :style="{ fontWeight: 'bold', float: 'left', marginRight: '15px', color: 'white' }">&nbsp;: 0~87% 미만</label> <!-- 미진행 -->
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }"> 
              <KendoGrid
              :ref="'rowGrid'"
              :gridHeight="gridHeight"
              :gridItems="items2"
              :sortable="false"
              :columns="columns2"
              :resizable="false"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              :isPaging="false"
              :scrollable="true"
              :dataItem="items2">
            </KendoGrid>
          </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="6" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <CardTitle>차트</CardTitle>
            <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }"> 
              <Chart :style="{ height: 'calc(100% - 33px)' }">
                <ChartSeries>
                  <ChartSeriesItem
                    :type="'donut'"
                    :data-items="donutData"
                    :category-field="'kind'"
                    :field="'share'"
                  >
                  <ChartSeriesLabels
                    :color="'#fff'"
                    :background="'none'"
                    :content="donutLabelContent"
                  />
                  </ChartSeriesItem>
                </ChartSeries>
                <ChartLegend :visible="false" />
              </Chart>
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
 </div>
</template>
<script>
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import {
  Chart,
  ChartTitle,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels
} from "@progress/kendo-vue-charts";
export default {
  components: {
    KendoGrid,
    Card,
    CardBody,
    CardTitle,
    Chart,
    ChartTitle,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem,
    ChartSeriesLabels
  },
 data () {
      return {
        gridHeight: "100px",
        selectedField: "selected",
        items: [],
        items2: [],
        columns: [
            { field: 'num', width: '80px', title: '순번' },
            { field: 'boardTitle', width: '300px', title: '제목'},
            { field: 'userNm', title: '작성자'},
            { field: 'date', title: '작성일' },
            { field: 'cnt', title: '조회수' }
        ],
        columns2: [
            { field: 'num', width: '80px', title: '순번' },
            { field: 'col1', title: '그리드컬림1'},
            { field: 'col2', title: '그리드컬림2' },
            { field: 'col3', title: '그리드컬림3' }
        ],
        donutLabelContent: labelContent,
        donutData: [ 
          { "kind": "Hydroelectric", "share": 80}, 
          { "kind": "Other", "share": 20}
        ],
      };
  },
  mounted() {
    this.items = this.createData('board', 10);
    this.items2 = this.createData('grid', 5);
  },
  unmounted() {
  },
  computed: {
  },
  methods: {
    createData(code, count) {
      if(code === 'board'){
        let boardTitle = '제목';
        let userNm = '작성자';
        return Array(count).fill({}).map((_, idx) => ({
          num: count-idx,
          boardTitle: boardTitle + idx,
          userNm: userNm + idx,
          date: '2024-01-12',
          cnt: Math.floor(Math.random() * 100)
        }));
      } else {
        return Array(count).fill({}).map((_, idx) => ({
          num: idx+1,
          col1: Math.floor(Math.random() * 100),
          col2: Math.floor(Math.random() * 100),
          col3: Math.floor(Math.random() * 100),
        }));
      }
    },
    pieLabelContent(props) {
      let formatedNumber = Number(props.dataItem.value).toLocaleString(
        undefined,
        {
          style: "percent",
          minimumFractionDigits: 2,
        }
      );
      return `${props.dataItem.category} years old: ${formatedNumber}`;
    },
  },
};

const labelContent = (e) => e.category;
</script>
<style lang="scss">
  .img-1 {
    // position: fixed;
    // z-index: 2;
    // left: 0;
    // top: 0;
    // bottom: 0;
    // right: 0;
    width: 100%;
    height: 100%;
    background: url("@/assets/images/MES-hierarchy.png") no-repeat center center;
    background-size: cover;
  }
</style>
