<template>
  <div :style="{ height: '100%' }">
      <v-row ref="contents" no-gutters :style="{ height: '100%' }">
          <v-col :cols="12" :style="{ height: '100%' }">


              <v-row no-gutters :style="{ margin: '10px 0 0 0', height: 'calc(100% - 5px)' }">
                  <v-col cols="12" :style="{ height: '100%' }">
                      <div ref="divWrapper" :style="{ height: '100%' }">
                          <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                              :columns="gridHeader" :resizable="false" :edit-field="'inEdit'"
                              :selected-field="selectedField" :gridDropDownList="gridDropDownList"
                              :checkHeaderArr="checkHeaderArr" :isPaging="true" @selectionchange="onSelectionchange"
                              @gridrowclick="onRowClick" @gridddchang="rowDdChange" @griditemchange="griditemchange"
                              @sortChangeHandler="sortChangeHandler" @headerselectionchange="onHeaderSelectionChange" />
                      </div>
                  </v-col>
              </v-row>
          </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <ConfirmPop ref="ConfirmPop" />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
// import { Input } from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import DateUtility from '~/plugins/dateUtility';



export default {
  name: "Routing",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
      Card,
      Button,
      CardBody,
      CardTitle,
      TreeView,
      KendoGrid,
      InputText,
      Checkbox,
      MesSelectBox,
      DropDownList
  },
  props: {
      gridHeight: {
          type: String,
          default: "500px"
      },
      confirm: {
          type: Boolean,
          default: false,
      },
      searchData: {

      }
  },
  data() {
      return {
          gridHeader: [],
          gridData: [],
          gridOriData: [],
          gridDropDownList: [{
              dataVal: 'PROCESSROUTETYPE',
              dataItem: []
          }],
          selectedField: 'selected',
          checkHeaderArr: ["COMMONFLAG", "ACTIVESTATE"],
          processrouteid: "",
          processroutename: "",
          processroutetype: "",
          commonflag: "",
          headerParam: {
              gridid: "dgvResultCTProduct", // 그리드 ID
              rowStat: "", //rowStat 표시 여부,
              xOverflowYn: true
          },
          newRowChk: [],
          gridPageData: {},
      };
  },
  created() {
  },
  async mounted() {
      await this.getGridComboList();
      // await this.getGridData();
  },
  computed: {
      areAllSelected() {
          return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
      },
  },
  watch: {
  },
  methods: {
      routingId() {

      },
      searchBtn() {
          this.getGridData();
      },
      
      
      //그리드 데이터 가져오기
      async getGridData() {
          console.log(this.searchData);
          if(this.searchData.EQUIPMENTID == '' || this.searchData.EQUIPMENTID == undefined || this.searchData.PROCESSID == '' || this.searchData.PROCESSID == undefined){
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00283')); /* 알림, 공정ID와 설비코드를 선택해주세요. */
              return;
          }

          this.gridOriData = [];
          this.gridData = [];
          const { skip = 0, take = 20 } = this.gridPageData;
          this.mesGet({
              apiKey: 'mes/common/customquerypaging',
              queryId: "GetResultCTProduct",
              queryVersion: '00001',
              sendParam: {
                  plantid: this.$auth.$state.user.plantId,
                  EQUIPMENTID: this.searchData.EQUIPMENTID,
                  PROCESSID: this.searchData.PROCESSID,
                  STARTTIME: this.searchData.STARTTIME + ' 00:00:00',
                  ENDTIME: this.searchData.ENDTIME + ' 23:59:59',
                  skip: skip,
                  take: take,
              }
          }).then(({ list, paging, ...x }) => {

              const data = list.map((x, idx) => {
                  return {
                      ...x,
                      rowStat: "N",
                      selected: false,
                      idx: idx,
                      inEdit: true,
                      newRow: false
                  }
              });
              //GIRD input v-model초기화, chkbox초기화 위해 추가
              // this.$nuxt.$emit('vmodelReset');
              this.$nuxt.$emit('iccReset')
              this.gridPageData = paging;
              this.gridOriData = JSON.parse(JSON.stringify(data));
              this.gridData = data;
          })
      },
      //그리드 로우 클릭
      onRowClick(event) {
          console.log("===========onRowClick==============")
          //그리드 로우 클릭시 라인표시 유무 확인필요
          // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      },
      //맨앞 checkBox 클릭
      onSelectionchange(event) {
          console.log("===========onSelectionchange==============")
          event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      },
      //header checkbox 클릭
      onHeaderSelectionChange(event) {
          console.log("===========onHeaderSelectionChange==============")
          let checked = event.event.target.checked;
          this.gridData = this.gridData.map((item) => {
              return { ...item, selected: checked };
          });
      },
      //그리드 인풋 제외 데이터 변경시
      rowDdChange(e, name, dataItem) {
          // console.log("===rowDdChange===",e)
          const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
          const data = JSON.parse(JSON.stringify(this.gridData));
          if (name === "COMMONFLAG") {
              e.value = e.value ? "Yes" : "No";
          }
          if (name === "ACTIVESTATE") {
              e.value = e.value ? "Active" : "Inactive";
          }

          data[idx] = { ...data[idx], [name]: e.value }
          if (data[idx].rowStat === "N") {
              data[idx].rowStat = "U";
          }
          if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)) {
              data[idx].rowStat = "N";
          }

          this.gridData = data;
      },

      //그리드 인풋 데이터 변경시
      griditemchange(e) {
          console.log("===griditemchange===", e)

          const data = JSON.parse(JSON.stringify(this.gridData));
          const idx = data.findIndex(x => x.idx === e.dataItem.idx);
          data[idx] = { ...data[idx], [e.field]: e.value };
          if (data[idx].rowStat === "N") {
              data[idx].rowStat = "U";
          }
          if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)) {
              data[idx].rowStat = "N";
          }

          this.gridData = data;
      },

      //그리드 콤보박스 리스트가져오기
      async getGridComboList() {
          await this.mesGet({
              apiKey: "mes/common/getqueryresult",
              queryId: "GetEnumValue",
              sendParam: {
                  plantid: this.$auth.$state.user.plantId,
                  enumid: "ProcessRouteType"
              }
          }).then((data) => {
              this.gridDropDownList[0].dataItem = data;
          })
      },
      //unbo 버튼 클릭
      undoBtn() {
          this.gridData = JSON.parse(JSON.stringify(this.gridOriData))
          this.$nuxt.$emit('iccReset')
      },
      //추가 버튼 클릭
      addBtn() {
          this.$refs.rowGrid.skip = 0;
          const newRowUUid = Math.round(Math.random() * 1000000000).toString()
          const dataItem = {
              inEdit: true,
              newRow: true,
              selected: false,
              PLANTID: this.$auth.$state.user.plantId,
              rowStat: "C",
              _ROWSTATUS: "C",
              newRowUUid: newRowUUid,
              idx: this.gridData.length,
              PROCESSROUTEID: "",
              PROCESSROUTECODE: "",
              PROCESSROUTENAME: "",
              COMMONFLAG: "No",
              PROCESSROUTETYPE: "Main",
              ACTIVESTATE: "Active",
              DESCRIPTION: "",
          };
          this.gridData.splice(0, 0, dataItem)
          this.$nuxt.$emit('iccReset')
      },
      delConfirm() {
          const chk = [];
          this.newRowChk = [];
          let message;
          this.gridData.forEach(e => {
              if (e.selected) {
                  if (e.PROCESSROUTEID != '') {
                      chk.push(e.PROCESSROUTEID);
                  } else {
                      this.newRowChk.push(e.idx);
                  }
              }
          });

          if (chk.length == 0 && this.newRowChk.length == 0) { // 체크한 행 없을 때
              this.$refs.alertPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00412'); /* 삭제 */
              this.$refs.alertPop.message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00088'); /* 선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다. */
              this.$refs.alertPop.visibleDialog = true;
          } else {
              if (chk.length != 0) { // 기존 행 삭제시에만 ID 값 Set
                  message = `(${chk.join()})`;
              } else {
                  message = '';
              }
              this.$refs.ConfirmPop.title = this.$i18n.t('MES_CommLang.MES_CommLang_00412'); /* 삭제 */
              this.$refs.ConfirmPop.message = message + ' - ' + this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제하시겠습니까? */
              this.$refs.ConfirmPop.modalWidth = "330px";
              this.$refs.ConfirmPop.visibleDialog = true;
              this.$refs.ConfirmPop.callBack = this.delBtn;
          }
      },
      //삭제버튼
      delBtn() {
          let data = JSON.parse(JSON.stringify(this.gridData));

          data = data.filter((data, index, source) => { // 새로운 행은 Grid 에서 바로 삭제 처리
              return this.newRowChk.indexOf(data.idx) < 0;
          });
          this.gridData = data.map(x => {
              if (x.selected) {
                  return {
                      ...x,
                      rowStat: "D"
                  }
              }
              return x;
          });
      },
      //검색 인풋 변경시
      searchInput(nm, val) {
          this[nm] = val;
      },
      comboChange(nm, val) {
          this[nm] = val;
      },
      chkVal(nm, val) {
          this[nm] = val ? "Yes" : "";
      },
      openAlert(title, message, visiable = true, width = "350px") {
          this.$refs.alertPop.title = title;
          this.$refs.alertPop.message = message;
          this.$refs.alertPop.visibleDialog = visiable;
          this.$refs.alertPop.modalWidth = width;
      },
      sortChangeHandler(e) {
          const isAscending = e.sort[0]?.dir == "asc";
          if (isAscending) {
              this.gridData = this.gridData.sort((a, b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
          } else {
              this.gridData = this.gridData.sort((a, b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
          }
      }
  }
};

const defaultData = {
};
</script>
<style lang="scss"></style>