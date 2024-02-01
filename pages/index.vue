<template>
  <div>
    <!-- 신규-->
    <v-row ref="contents" :style="{ height: 'calc(50% - 5px)' }">
      <v-col :cols="6" :style="{ height: '100%' }">
        <!-- <ProductPlanPerformanceRate
          ref="ProductPlanPerformanceRate"
          :gridHeight="gridHeight"
        /> -->
        <Notice 
          ref="Notice"
          :style="{ height: '100%' }"
        />
      </v-col>
      <v-col :cols="6" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <!-- <ScrapQtyRate 
              ref="ScrapQtyRate" 
              :style="{ height: '100%' }"
            /> -->
            <div class="img-1">&nbsp;</div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents2" :style="{ height: 'calc(50% - 5px)' }">
      <v-col :cols="6" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <ProvisionReport
              ref="ProvisionReport"
              :style="{ height: '100%' }"
            />
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="6" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <PerformanceReport
              ref="PerformanceReport"
              :style="{ height: '100%' }"
            />
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <!-- 임시주석 필요없을시 추후 삭제 가능
    <v-row :style="{ height: '100%' }">
      <v-col :cols="12">
        <Splitter
          :style="{ height: '100%' }"
          :panes="panes"
          :orientation="'vertical'"
          @change="onChange"
        >
          <template v-slot:first>
            <Splitter :panes="innerPanes1" @change="onInnerChange">
              <template v-slot:1>
                <div class="pane-content">
                  <h3>생산계획대비실적(주간)</h3>
                  <p>
                    <Card :style="{ height: '100%' }">
                      <CardBody :style="{ height: '100%' }">
                        <ProductPlanPerformanceRate
                          ref="ProductPlanPerformanceRate"
                          :gridHeight="gridHeight"
                        />
                      </CardBody>
                    </Card>
                  </p>
                </div>
              </template>
              <template v-slot:2>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠2</h3>
                  <p>
                    <Card :style="{ height: '100%' }">
                      <CardBody :style="{ height: '100%' }">
                        <ScrapQtyRate
                          ref="ScrapQtyRate"
                          :gridHeight="gridHeight"
                        />
                      </CardBody>
                    </Card>
                  </p>
                </div>
              </template>
              <template v-slot:3>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠3</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
              <template v-slot:4>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠4</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
            </Splitter>
          </template>
          <template v-slot:second>
              <Splitter :panes="innerPanes3" @change="onInnerChange3">
              <template v-slot:1>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠5</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
              <template v-slot:2>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠6</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
            </Splitter>
          </template>
           <template v-slot:third>
            <Splitter :panes="innerPanes2" @change="onInnerChange2">
              <template v-slot:1>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠7</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
              <template v-slot:2>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠8</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
              <template v-slot:3>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠9</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
              <template v-slot:4>
                <div class="pane-content">
                  <h3>메인화면 콘텐츠10</h3>
                  <p>컨텐츠 내용</p>
                </div>
              </template>
            </Splitter>
          </template>
        </Splitter>
      </v-col>
    </v-row>  -->
  </div>
</template>

<script>
import { mapState } from "vuex"; // , mapActions
import { Splitter } from "@progress/kendo-vue-layout";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import ProductPlanPerformanceRate from "@/components/index/ProductPlanPerformanceRate.vue";
import ScrapQtyRate from "@/components/index/ScrapQtyRate.vue";
import ProvisionReport from "@/components/index/ProvisionReport.vue";
import PerformanceReport from "@/components/index/PerformanceReport.vue";
import Notice from "@/components/index/Notice.vue";

let myTitle;
const myMenuId = "myIndex";
export default {
  layout: "default",
  asyncData(context) {
    const myState = context.store.state;
    context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
    myTitle = "Index";
  },
  meta: {
    title: () => {
      return myTitle;
    },
    menuId: myMenuId,
    closable: false,
  },
  computed: {
    ...mapState({
      isDarkMode: "isDarkMode",
      myHome: "myHome",
    }),
  },
  components: {
    Splitter,
    Card,
    CardBody,
    CardTitle,
    ProductPlanPerformanceRate,
    ScrapQtyRate,
    ProvisionReport,
    PerformanceReport,
    Notice,
  },
  data() {
    return {
      gridHeight: "500px",
      /* 임시주석 필요없을시 추후 삭제 가능
      panes: [
        {
          size: "100%",
          resizable: false,
          containsSplitter: true,
          content: "first",
        },
        { resizable: false, content: "second" },
        // { size: '30%', resizable: true, content: 'third' },
      ],
      innerPanes1: [
        {
          resizable: false,
          size: "50%",
          min: "20px",
          collapsible: true,
          content: "1",
        },
        { resizable: false, content: "2" },
        //{ resizable: true, size: '30%', min: '20px', collapsible: true, content: '3' },
        // { resizable: true, size: '30%', min: '20px', collapsible: true, content: '4' },
      ],
       innerPanes2: [
        { resizable: true, size: '20%',  collapsible: true, content: '1' },
        { resizable: true, content: '2' },
        { resizable: true, size: '30%',  collapsible: true, content: '3' },
        { resizable: true, size: '30%',  collapsible: true, content: '4' },
      ], 
      innerPanes3: [
        { resizable: true, size: '50%',  collapsible: true, content: '1' },
        { resizable: true, content: '2' }
      ],*/
    };
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    /* onChange(event) {
      this.panes = event.newState;
    },
    onInnerChange(event) {
      this.innerPanes1 = event.newState;
    },
    onInnerChange2(event) {
      this.innerPanes2 = event.newState;
    },
    onInnerChange3(event) {
      this.innerPanes3 = event.newState;
    }, */
  },
};
</script>

<style lang="scss">
.pane-content {
  padding: 10px;
}
.k-splitter-flex {
  height: 100% !important;
}
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
