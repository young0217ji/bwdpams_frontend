<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li><!--홈-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00159") }}</li><!--생산계획-->
        <li>{{ $t("MES_CommLang.MES_CommLang_00550") }}</li><!--Shift기준정보-->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row ref="searchFilter" no-gutters>
                <v-col :sm="9" :lg="10" align="left">
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button><!--조회-->
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <v-row ref="contents">
        <v-col :cols="4" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%' }">
              <v-row>
                <v-col cols="4" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00551") }}</CardTitle><!--Shift목록-->
                </v-col>
                <v-col cols="8" align="right">
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn(list)">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                  <Button
                    ref="add"
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'add'"
                    @click="addBtn(list)"
                    >{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button
                  ><!--추가-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'delete'"
                    @click="delBtn(list)"
                    >{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button
                  ><!--삭제-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'undo'"
                    @click="undoBtn(list)"
                    >undo</Button
                  >
                </v-col>
              </v-row>
              <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="listGrid"
                  :gridHeight="gridHeight"
                  :gridItems="listGridData"
                  :sortable="true"
                  :columns="headerParam1.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :isPaging="false"
                  @sortChangeHandler="sortChangeHandler"
                  @gridrowclick="onListRowClick"
                  @gridddchang="listRowDdChange"
                  @griditemchange="listgriditemchange"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :cols="8" :style="{ height: '100%' }">
          <Card ref="gridCard2" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%' }">
              <v-row>
                <v-col cols="6" align="left">
                  <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00552") }}</CardTitle><!--Shift상세-->
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn(detail)">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'add'"
                    @click="addBtn(detail)"
                    >{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button
                  ><!--추가-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'delete'"
                    @click="delBtn(detail)"
                    >{{ $t("MES_CommLang.MES_CommLang_00412") }}</Button
                  ><!--삭제-->
                  <Button
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'undo'"
                    @click="undoBtn(detail)"
                    >undo</Button
                  >
                </v-col>
              </v-row>
              <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="detailGrid"
                  :gridHeight="gridHeight"
                  :gridItems="detailGridData"
                  :sortable="true"
                  :columns="headerParam2.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="headerParam2.enumComboBox"
                  :checkHeaderArr="headerParam2.checkBox"
                  :isPaging="false"
                  :timePickerList="headerParam2.timePickerList"
                  @sortChangeHandler="sortChangeHandler"
                  @gridrowclick="onDetailRowClick"
                  @gridddchang="detailRowDdChange"
                  @griditemchange="detailgriditemchange"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <AlertPop ref="alertPop" :is="'alertPop'" />
    </div>
  </template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
  import Checkbox from "@/components/common/input/Checkbox";
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  
  let myTitle;
  let myMenuId;
  
  
  export default {
    mixins: [mixinGlobal, multiGridHeaderMinin],
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
      Utility,
      Card,
      Button,
      CardBody,
      CardTitle,
      KendoGrid,
      InputText,
      Checkbox,
    },
    props: {
      gridHeight: {
        type: String,
        defaultData: "500px",
      },
    },
    data() {
      return {
        listGridData:[], //Shift목록 data
        listOriData:[],
        selectedListId: '',
        detailGridData:[], //Shift상세 data
        detailOriData:[],
        selectedDetailId: '',
        gridDropDownList: [],
        selectedField: "selected",
        headerParam1: {
          gridid: "dgvShiftList", // 그리드 ID
          rowStat: "", //rowStat 표시 여부
          gridHeader: [],
          noFirstCheck: true,
        },
        headerParam2: {
          gridid: "dgvShiftDetail", // 그리드 ID
          rowStat: "", //rowStat 표시 여부
          gridHeader: [],
          noFirstCheck: true,
          enumComboBox: ['WORKTYPENAME'],
          checkBox: ['ALLDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'],
          timePickerList: ['STARTTIME', 'ENDTIME'],
        },
        list:'list',
        detail:'detail',
        data:[],
        selectedList : "",
        selectedDetail : "",
      };
    },
    created() {},
    async mounted() {
        await this.getHeaderMulti(this.headerParam1, this.$refs.divWrapper1);
        await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
        await this.getListGridData();
    },
    computed: {
    },
    watch: {},
    methods: { 
      // Shift목록 그리드 데이터 가져오기
      async getListGridData() {
        this.mesGet({
          apiKey: "mes/common/customquery",
          queryId: "GetShiftList",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
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
          this.listOriData = data;
          this.listGridData = data;
          this.detailGridData = [];
          this.detailOriData = [];
          this.selectedListId === '';
        });
      },

      // Shift상세 그리드 데이터 가져오기
      async getDetailGridData() {
        this.mesGet({
          apiKey: "mes/common/customquery",
          queryId: "GetShiftDetailList",
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            shiftid: this.selectedListId,
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
              STARTTIME: this.hhmmStringToDate(x.STARTTIME),
              ENDTIME : this.hhmmStringToDate(x.ENDTIME),
              WORKTYPENAME: x.WORKTYPE,
            };
          });
          this.$nuxt.$emit("iccReset");
          this.detailOriData = data;
          this.detailGridData = data;
        });
      },


      //========================CRUD BUTTON START=====================================    

      // 조회
      searchBtn() {
        
      },

      // 저장(List)
      saveBtn(grid) {
        if(grid==='list'){
          if(!this.PKValidation(this.listGridData, "SHIFTID")){
            this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00230')//SHIFT ID가 중복되었습니다.
            );
            return;
          }

          const saveData = this.listGridData
            .filter((x) => x.rowStat !== "N")
            .map((x) => {
              return {
                ...x,
                _rowstatus: x.rowStat,
              };
            });
          const saveValidate = this.mesValidation(
            this.headerParam1.gridHeader,
            this.listGridData
          );
          if(!saveValidate.isValidate){
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), saveValidate.msg);//알림
            return;
          }
          if (saveData.length > 0) {
            const res = this.mesPost({
              apiKey: "mes/common/manage",
              messagename: "TxnShift",
              sendParam: saveData,
            }).then((result) => {
              this.$nextTick(() => {
                if (result.returncode !== undefined && result.returncode === "0") {
                  this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
                  );
                  this.getListGridData();
                } else {
                  this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
                }
              });
            });
          } else {
            this.$refs.alertPop.show(
              this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
              this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')//저장할 데이터가 없습니다.
            );
            return;
          }
        }else if(grid==='detail'){

          if(!this.PKValidation(this.detailGridData, "SEQUENCE")){
            this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00229')//순서가 중복되었습니다.
            );
            return;
          }

          const saveData = this.detailGridData
            .filter((x) => x.rowStat !== "N")
            .map((x) => {
              return {
                ...x,
                _rowstatus: x.rowStat,
                STARTTIME: this.dateTohhmmString(x.STARTTIME),
                ENDTIME: this.dateTohhmmString(x.ENDTIME),
              };
            });

          const saveValidate = this.mesValidation(
            this.headerParam2.gridHeader,
            this.detailGridData
          );
          if(!saveValidate.isValidate){
            this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), saveValidate.msg);//알림
            return;
          }
          if (saveData.length > 0) {
            const res = this.mesPost({
              apiKey: "mes/common/manage",
              messagename: "TxnShiftDetail",
              sendParam: saveData,
            }).then((result) => {
              this.$nextTick(() => {
                if (result.returncode !== undefined && result.returncode === "0") {
                  this.$refs.alertPop.show(
                    this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                    this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
                  );
                  this.getDetailGridData();
                } else {
                  this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
                }
              });
            });
          } else {
            this.$refs.alertPop.show(
              this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림
              this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')//저장할 데이터가 없습니다.
            );
            return;
          }



        }
      },

      //unbo 
      undoBtn(grid) {
        if(grid==='list'){
          this.listGridData = this.listOriData.filter((x) => x.newRow !== true);
          this.$nuxt.$emit("iccReset");
        }else if(grid==='detail'){
          this.detailGridData = this.detailOriData.filter((x) => x.newRow !== true);
          this.$nuxt.$emit("iccReset");
        }
        
      },

      //추가
      addBtn(grid) {
        const newRowUUid = Math.round(Math.random() * 1000000000).toString();
        if(grid==='list'){
            if(this.listGridData.filter(x=> x.rowStat==="C").length>0) return; // 한 번에 1줄만 추가
            this.listGridData.map(x=> (x.selected=false));
            this.$refs.listGrid.skip = 0;
            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: true,
                rowStat: "C",
                idx: this.listGridData.length,
                newRowUUid: newRowUUid,
                PLANTID: this.$auth.$state.user.plantId,
                SHIFTID: '',
                SHIFTTIME: '',
                SHIFTNAME: '',
                detail: [],    
            }
            this.listGridData.splice(0, 0, dataItem);
            this.detailGridData = []; 
            this.$nuxt.$emit("iccReset");
        }else  if(grid==='detail'){
          if(this.selectedListId === '' && this.listGridData.filter(x=> (x.selected==true && x.rowStat==='C')).length===0){
            this.$refs.alertPop.show(
              this.$i18n.t('MES_CommLang.MES_CommLang_00456'),// 알림
              this.$i18n.t('MES_MsgLang.MES_MsgLang_00228')// SHIFT를 선택해주세요.
            );
            return;
          }
          if(this.listGridData.filter(x=>(x.selected==true && x.rowStat==='C')).length>0){
            this.$refs.alertPop.show(
              this.$i18n.t('MES_CommLang.MES_CommLang_00456'),// 알림
              this.$i18n.t('MES_MsgLang.MES_MsgLang_00231')// SHIFT 목록 저장 후 진행해주세요.
            );
            return;
          }
            this.detailGridData.map(x=> (x.selected=false));
            this.$refs.detailGrid.skip = 0;
            const maxSeq = this.detailGridData.map(x=> {return x.SEQUENCE});
            const nextSeq = this.detailGridData.length>0? Math.max.apply(null,maxSeq)+1:1;
            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: true,
                rowStat: "C",
                idx: this.detailGridData.length,
                newRowUUid: newRowUUid,
                PLANTID: this.$auth.$state.user.plantId,
                SHIFTID: this.selectedListId,
                SEQUENCE: nextSeq,
                WORKTYPE: '',
                WORKTYPENAME: '',
                STARTTIME: this.hhmmStringToDate('0000'),
                ENDTIME: this.hhmmStringToDate('0000'),
                WORKTIME: '0',
                ALLDAY: 'No',
                MONDAY: 'No',
                TUESDAY: 'No',
                WEDNESDAY: 'No',
                THURSDAY: 'No',
                FRIDAY: 'No',
                SATURDAY: 'No',
                SUNDAY: 'No',
            };
            this.detailGridData.push(dataItem);
        }
      },

      // 삭제
      delBtn(grid) {
        if(grid==='list'){
          const data = JSON.parse(JSON.stringify(this.listGridData));
          this.listGridData = data.map(x => {
            if(x.selected){
              if(x.rowStat !== "C"){
                return {
                  ...x,
                  rowStat: "D"
                }
              }
            }
            else {
              return x;
            }
          }).filter(x => x !== undefined);
          if(this.selectedListId===''){
            this.detailGridData = [];
          }
          this.$nuxt.$emit('iccReset')
        }else if(grid==='detail'){
          const data = JSON.parse(JSON.stringify(this.detailGridData));
          this.detailGridData = data.map(x => {
            if(x.selected){
              if(x.rowStat !== "C"){
                return {
                  ...x,
                  rowStat: "D"
                }
              }
            }
            else {
              return x;
            }
          }).filter(x => x !== undefined);
        }
      },
      //========================CRUD BUTTON END=====================================  
  
      sortChangeHandler(e){
        return ;
        this.gfn_sortChangeHandler(this.gridData, e, ["POSITION"]);
      },
  
      //그리드 ROW 클릭
      onListRowClick(event) {
        this.row = { ...event.dataItem };
        this.listGridData.forEach(
          (item) => (item.selected = item.idx === event.dataItem.idx)
        );
        this.selectedListId = event.dataItem.SHIFTID;
        this.getDetailGridData();
      },
      onDetailRowClick(event) {
        this.row = { ...event.dataItem };
        this.detailGridData.forEach(
          (item) => (item.selected = item.idx === event.dataItem.idx)
        );
      },
      //그리드 인풋 제외 데이터 변경시
      listRowDdChange(e, name, dataItem) {
        
        const idx = this.listGridData.findIndex((x) => x.idx === dataItem.idx);
        const data = JSON.parse(JSON.stringify(this.listGridData));

        data[idx] = { ...data[idx], [name]: e.value };
        if (data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
        }
        if (data[idx].rowStat === "U" && !this.chkOriginalData(data, this.listOriData, idx)) {
          data[idx].rowStat = "N";
        }

        this.listGridData = data;
      },
      detailRowDdChange(e, name, dataItem) {
        
        const idx = this.detailGridData.findIndex((x) => x.idx === dataItem.idx);
        let data = JSON.parse(JSON.stringify(this.detailGridData));

        if (this.headerParam2.checkBox.indexOf(name)>-1) {
          e.value = e.value ? 'Yes' : 'No';
        }

        data[idx].STARTTIME = new Date(data[idx].STARTTIME);
        data[idx].ENDTIME = new Date(data[idx].ENDTIME);

        if(name==='WORKTYPENAME'){
          data[idx].WORKTYPE = e.value;
        }

        else if(name==="STARTTIME"){
          data[idx].WORKTIME = this.workTime(e.value, data[idx].ENDTIME);
          data[idx].STARTTIME = e.value;
        }

        else if(name==="ENDTIME"){
          data[idx].WORKTIME = this.workTime(data[idx].STARTTIME, e.value); 
          data[idx].ENDTIME = e.value;
        }

        data[idx] = { ...data[idx], [name]: e.value };
        if (data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
        }

        data = data.map((x)=> {
          return {
            ...x,
            STARTTIME: new Date(x.STARTTIME),
            ENDTIME: new Date(x.ENDTIME),
          }
        });

        if (data[idx].rowStat === "U" && !this.chkOriginalData(data, this.detailOriData, idx, true)) {
          data[idx].rowStat = "N";
        }

        
        this.detailGridData = data;
      },
  
      //그리드 인풋 데이터 변경시
      listgriditemchange(e) {
        const data = JSON.parse(JSON.stringify(this.listGridData));
        const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
        data[idx] = { ...data[idx], [e.field]: e.value };
        if (data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
        }
        if (data[idx].rowStat === "U" && !this.chkOriginalData(data, this.listOriData, idx)) {
          data[idx].rowStat = "N";
        }
  
        this.listGridData = data;
      },
      detailgriditemchange(e) {
        const data = JSON.parse(JSON.stringify(this.detailGridData));
        const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
        data[idx] = { ...data[idx], [e.field]: e.value };
        if (data[idx].rowStat === "N") {
          data[idx].rowStat = "U";
        }
        data = data.map((x)=> {
          return {
            ...x,
            STARTTIME: new Date(x.STARTTIME),
            ENDTIME: new Date(x.ENDTIME),
          }
        });

        if (data[idx].rowStat === "U" && !this.chkOriginalData(data, this.detailOriData, idx)) {
          data[idx].rowStat = "N";
        }
  
        this.detailGridData = data;
      },
  
      //데이터 원상복구시 "수정" 항목 제거
      chkOriginalData(gridData, gridOriData, idx) {
        const data = JSON.parse(JSON.stringify(gridData));
        const keys = Object.keys(data[idx]);
        const chkArr = keys.filter((x) => {
          if(x === 'STARTTIME' || x === 'ENDTIME'){
            data[idx][x] = new Date(data[idx][x]);
            return data[idx][x].getMinutes()!== gridOriData[idx][x].getMinutes() || data[idx][x].getHours() !== gridOriData[idx][x].getHours();
          }
          return this.parseNullOrUndefinedToBlank(data[idx][x]) !== this.parseNullOrUndefinedToBlank(gridOriData[idx][x]) && x !== "selected" && x !== "rowStat";
          // return data[idx][x] !== this.gridOriData2[idx][x] && x !== "rowStat";
        });
        return chkArr.length > 0;
      },

      // 소요시간 계산
      workTime(startTime, endTime){
        let start = this.dateTohhmmString(startTime);
        let end = this.dateTohhmmString(endTime);
        let strHour = Number(start.substring(0,2));
        let strMin = Number(start.substring(2,4));
        let endHour = Number(end.substring(0,2));
        let endMin = Number(end.substring(2,4));
        if(strMin>endMin){
          endMin += 60;
          strHour++;
        }
        if(strHour>endHour){
          endHour += 24;
        }
        return startTime==undefined||startTime===''||startTime==null||endTime==undefined||endTime===''||endTime==null ?'0':String((endHour-strHour)*60+endMin-strMin);
      },
      // DATE to HH:MM String 포맷 변환
      dateTohhmmString(dateTime){
        const inputDate = new Date(dateTime);
        return String(inputDate.getHours()>9?inputDate.getHours():'0'+inputDate.getHours()).concat(String(inputDate.getMinutes()>9?inputDate.getMinutes():'0'+inputDate.getMinutes()));
      },
      // HH:MM String to Date 포맷 변환
      hhmmStringToDate(time){
        let dt = new Date();
        dt.setHours(time.substring(0,2));
        dt.setMinutes(time.substring(2,4));
        return dt;
      },
      // PK Validation
      PKValidation(grid, column){
        const distinctSeq = [...new Set(grid.map(x => String(x[column])))];
        return grid.length === distinctSeq.length;
      },
    },
  };
  
  const defaultData = {};
  </script>
  <style lang="scss" scoped>
  @media (max-width: 1267px) {
    .divList1 {
      height: 339px !important;
    }
    .divList2 {
      height: auto !important;
    }
    .divList3 {
      height: 213px !important;
    }
  }
  </style>
  