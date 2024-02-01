<template>
    <div>
      <ol class="page-navigation">
        <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00560") }}</li> <!-- 품질관리 -->
        <li>{{ $t("MES_CommLang.MES_CommLang_00809") }}</li> <!-- 자주검사 성적서 -->
      </ol>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row no-gutters>
                <v-col :sm="9" :lg="10">
                    <div class="form-group-wrap" style="display: inline-block;">
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00681") }}</label> <!-- Work Center  -->
                          <DropDownList
                            :style="{ width: '200px' }"
                            :data-items="workCenterList"
                            :text-field="'text'"
                            :data-item-key="'id'"
                            :value-field="'id'"
                            :value-primitive="true"
                            :value="workCenter"
                            @change="selectWorkCenter"
                          />
                        </div>
                        <div class="form-group">
                          <Label>{{ $t("MES_CommLang.MES_CommLang_00532") }}</Label> <!-- 품번 -->
                          <Input 
                            v-model="workOrder"
                            :style="{ width: '200px' }"
                            :dataNm="'workOrder'"
                          />
                        </div>
                        <div class="form-group">
                            <label>{{ $t("MES_CommLang.MES_CommLang_00053") }}</label>  <!-- 공정ID -->
                            <Input 
                            v-model="processId"
                            :style="{ width: '200px' }"
                            :dataNm="'processId'"
                            :readonly="true"
                            :class="'k-readonly'"
                            />
                            <Button
                            :theme-color="'primary'"
                            :class="'btn-form'"
                            @click="selectProcessModal"
                            >{{ $t("MES_CommLang.MES_CommLang_00169") }}</Button 
                            > <!-- 선택 -->
                        </div>
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00171") }}</label> <!-- 설비명 -->
                          <DropDownList
                            :style="{ width: '200px' }"
                            :data-items="equipmentList"
                            :text-field="'text'"
                            :data-item-key="'id'"
                            :value-field="'id'"
                            :value-primitive="true"
                            :value="equipmentId"
                            @change="selectEquipment"
                          />
                        </div>
                    </div>
                    <div class="form-group-wrap" style="display: inline-block;">
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00544") }}</label> <!-- 품번그룹 -->
                          <DropDownList
                            :style="{ width: '200px' }"
                            :data-items="productGroupList"
                            :text-field="'text'"
                            :data-item-key="'id'"
                            :value-field="'id'"
                            :value-primitive="true"
                            :value="productGroupId"
                            @change="selectProductGroup"
                          />
                        </div>
                        <div class="form-group">
                          <Label>{{ $t("MES_CommLang.MES_CommLang_00545") }}</Label> <!-- 품번 -->
                          <Input 
                            v-model="productId"
                            :style="{ width: '200px' }"
                            :dataNm="'productId'"
                          />
                        </div>
                        <div class="form-group">
                          <label>{{ $t("MES_CommLang.MES_CommLang_00279") }}</label> <!-- 조회 기간 -->
                          <div class="form-datepicker">
                            <DatePicker
                              :format="'yyyy-MM-dd'"
                              :default-value="new Date()"
                              :value="startDate"
                              @change="selectStartDate"
                            />
                          </div>
                          <span class="i_tilde">~</span>
                          <div class="form-datepicker">
                            <DatePicker
                              :format="'yyyy-MM-dd'"
                              :default-value="new Date()"
                              :value="endDate"
                              @change="selectEndDate"
                            />
                          </div>
                        </div>
                    </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                  <Button
                    :theme-color="'primary'"
                    :size="'medium'"
                    :icon="'search'"
                    @click="searchBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00277") }}</Button 
                  > <!-- 조회 -->
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
  
      <v-row ref="contents">
        <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '40%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00902") }}</CardTitle><!--작업지시 목록-->
                  </v-col>
                  
                </v-row>
                <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                  ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="woGridData"
                    :sortable="true"
                    :columns="headerParam2.gridHeader"
                    :selected-field="selectedField"
                    :resizable="false"
                    :isPaging="false"
                    :scrollable="true"
                    @gridrowclick="selectWoGridRow"
                />
                </div>
            </CardBody>
          </Card>
          <Card ref="gridCard" :style="{ height: '60%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row>
                  <v-col cols="6" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00809") }}</CardTitle><!--자주검사 성적서-->
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button><!--저장-->
                  </v-col>
                  
                </v-row>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                  ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :resizable="false"
                    :isPaging="false"
                    :scrollable="true"
                    :gridDropDownList="enumComboBox"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @rowdblclick="rowdblclick"
                />
                </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <SelectProcessModal
        v-if="SelectProcessModalVisible"
        :visibleDialog="SelectProcessModalVisible"
        :title="$t('MES_CommLang.MES_CommLang_00056')"
        @visibleDialog="val => (SelectProcessModalVisible = val)"
        @selectedRow="selectedProcessId"
        />
      <AlertPop ref="alertPop" :is="'alertPop'" />
    </div>
</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import { Input } from '@progress/kendo-vue-inputs';
import SelectProcessModal from '@/components/frmSelfInspection/SelectProcessModal.vue';

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
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    DatePicker,
    SelectProcessModal,
    Input,

  },
  data() {
    return {
        gridHeight: "100px",
        gridData: [],
        gridOriData: [],
        headerParam: [],
        headerParam2: {
          gridid:'dgvWorkOrderList',
          gridHeader:[],
          noRowstat:true,
          noFirstCheck:true,
        },
        enumComboBox:[],
        selectedField: "selected",
        SelectProcessModalVisible: false,
        processId: '',
        searchedProcessId: '',
        recipeParameterIdList: [],
        workOrder:'',
        equipmentList:[],
        equipmentId:'',
        searchedEquipmentId: '',
        workCenterList:[{id:'', text:'-ALL-'}],
        workCenter:'',
        productGroupList: [{id:'', text:'-ALL-'}],
        productGroupId: '',
        productId: '',
        startDate : new Date(),
        endDate : new Date(),
        woGridData: [],
        selectedWorkOrder: '',
    }
  },
  async mounted() {
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper1)
    await this.getWorkCenterListData();
    await this.getProductGroupData();
    
  },
  computed: {

  },
  watch: {},
  methods: {
    // WORKCENTER COMBO 조회
    async getWorkCenterListData(){
      this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetAreaList',
        queryVersion: '00006',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        res.map(x=> {
          this.workCenterList.push({ id : x.CODE, text : x.NAME });
        })
      });
    },
    // WORKCENTER 선택
    selectWorkCenter(event) {
      this.workCenter = event.value;
    },

     // 공정 선택 팝업 열기
    selectProcessModal(){
        this.SelectProcessModalVisible = true;
    },
    // 공정ID 선택 팝업 CALLBACK
    async selectedProcessId(item){
        this.processId = item.PROCESSID;
        this.processName = item.PROCESSNAME;
        await this.getEquipmentListData(this.processId);
    },
    // 설비 COMBO 조회
    async getEquipmentListData(processId) {
      this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetOMProcessAvailableEquipment',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processId: processId
        },
      }).then(res => {
        this.equipmentList = res.map(x => {
          return {
            id: x.EQUIPMENTID,
            text : x.EQUIPMENTNAME
          }
        })
        console.log(this.equipmentList);
        this.equipmentId = this.equipmentList[0]?.id;
      });
    }, 
    // 설비 선택
    selectEquipment(event) {
      this.equipmentId = event.value;
    },
    // 제품그룹 콤보 데이터 가져오기
    async getProductGroupData() {
      this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetProductGroupList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        res.map(x => {
          this.productGroupList.push({
            id: x.PRODUCTGROUPID,
            text: x.PRODUCTGROUPNAME
          });
        })
      });
    },
    // 품번그룹 선택
    selectProductGroup(event){
      this.productGroupId = event.value;
    },
    // 기간 - 시작일 선택
    selectStartDate(event) {
        this.startDate = event.value;
    },

    // 기간 - 종료일 선택
    selectEndDate(event) {
        this.endDate = event.value;
    },
    // 조회 버튼
    async searchBtn(){
      if(this.isNullOrEmpty(this.processId)){
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00226')//"공정을 선택해주세요."
        );
        return;
      }

      await this.getWoGridData();
      await this.getHeaderData();
    },
    // 작업지시 목록 GRID 조회
    async getWoGridData(){
      this.searchedEquipmentId = this.equipmentId;
      this.searchedProcessId = this.processId;
      this.gridData = [];
      this.mesGet({
          apiKey: 'mes/common/customquery',
          queryId: 'GetWorkOrderList',
          sendParam: {
            PLANTID: this.$auth.$state.user.plantId,
            WORKCENTER: this.workCenter,
            WORKORDER: this.workOrder,
            EQUIPMENTID: this.equipmentId,
            PRODUCTGROUPID: this.productGroupId,
            PRODUCTID: this.productId,
            FROMDATE: this.DateToYYYYMMDDString(this.startDate),
            TODATE: this.DateToYYYYMMDDString(this.endDate)
          }
        }).then((res) => {
          const data = res.map((x, idx)=> {
            return {
              ...x,
              inEdit:false,
              newRow:false,
              idx:idx,
              selected:false,
            }
          });
          this.woGridData = data;
        });
        
    },
    // 작업지시 목록 ROW 클릭
    async selectWoGridRow(event){
      this.woGridData.map(x => {
        x.selected = x.idx==event.dataItem.idx;
      });
      this.selectedWorkOrder = event.dataItem.WORKORDER;
      await this.getSelfInspectionGridData(event.dataItem.WORKORDER);
    },

    // HEADER 세팅
    async getHeaderData(){
        this.headerParam = [];
        this.enumComboBox = [];
        this.recipeParameterIdList = [];
        await this.mesGet({
          apiKey: 'mes/common/customquery',
          queryId: 'GetSelfInspectionHeader',
          sendParam: {
            plantid: this.$auth.$state.user.plantId,
            processid: this.processId,
          }
        }).then(res => {
            res.map(x => {
                if(x.HEADERLEVEL=='1'){
                    const data = { id:x.HEADERID, title: x.HEADERNAME };
                    if(res.filter(y => y.PARENTHEADERID == x.HEADERID).length>0){
                        data.children = [];
                    }else{
                        // LAST DEPTH
                        data.field = x.RECIPEPARAMETERID;
                        data.editable = true;
                        data.width = this.isNullOrEmpty(x.CELLWIDTH)?'100px':x.CELLWIDTH.concat('px');
                        this.recipeParameterIdList.push(x.RECIPEPARAMETERID);
                        // CELL TYPE SETTING
                        if(x.CELLTYPE == 'COMBO'){
                          data.cell = x.RECIPEPARAMETERID;
                          this.enumComboBox.push({
                            dataVal: x.RECIPEPARAMETERID,
                            dataItem: [],
                            enumId: x.ENUMID
                          })
                        }
                    }
                    this.headerParam.push(data);
                }
                else if(x.HEADERLEVEL=='2'){
                    const data = { id:x.HEADERID, title: x.HEADERNAME };
                    if(res.filter(y => y.PARENTHEADERID == x.HEADERID).length>0){
                        data.children = [];
                    }else{
                        // LAST DEPTH
                        data.field = x.RECIPEPARAMETERID;
                        data.editable = true;
                        data.width = this.isNullOrEmpty(x.CELLWIDTH)?'100px':x.CELLWIDTH.concat('px');
                        this.recipeParameterIdList.push(x.RECIPEPARAMETERID);
                        // CELL TYPE SETTING
                        if(x.CELLTYPE == 'COMBO'){
                          data.cell = x.RECIPEPARAMETERID;
                          this.enumComboBox.push({
                            dataVal: x.RECIPEPARAMETERID,
                            dataItem: [],
                            enumId: x.ENUMID
                          })
                        }
                    }
                    this.headerParam.filter(y => y.id == x.PARENTHEADERID)[0]?.children.push(data);
                }else if(x.HEADERLEVEL=='3'){
                    // LAST DEPTH
                    const data = { field:x.RECIPEPARAMETERID, title:x.HEADERNAME, editable:true, width:this.isNullOrEmpty(x.CELLWIDTH)?'100px':x.CELLWIDTH.concat('px') };
                    this.recipeParameterIdList.push(x.RECIPEPARAMETERID);
                    this.headerParam.map(y => {
                        y.children?.filter(y => y.id == x.PARENTHEADERID)[0]?.children.push(data);
                    })
                    // CELL TYPE SETTING
                    if(x.CELLTYPE == 'COMBO'){
                      data.cell = x.RECIPEPARAMETERID;
                      this.enumComboBox.push({
                        dataVal: x.RECIPEPARAMETERID,
                        dataItem: [],
                        enumId: x.ENUMID
                      })
                    }
                }
            })
        });

        this.enumComboBox.map(x => {
          this.mesGet({
            apiKey: "mes/common/customquery",
            queryId: "GetEnumValue",
            sendParam: {
                plantid: this.$auth.$state.user.plantId,
                enumid: x.enumId
            },
          }).then((res) => {
              x.dataItem = res;
          });
        })
    },
    // 조회
    async getSelfInspectionGridData(workorder){
      let result = '';
      if(this.headerParam.length<1){
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00288')//"자주검사 성적서 Header가 존재하지 않는 공정입니다."
        );
        return;
      }
      console.log('----------------------');
      console.log('QUERY START')
      console.log(new Date());
      await this.mesGet({
        apiKey: "mes/common/customquery",
        queryId: "GetSelfInspectionDataResult",
        queryVersion: "00002",
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          processid: this.processId,
          workorder: workorder,
        }
      }).then((res) => {
        res.map((x, idx) => {
          x.inEdit = false;
          x.idx = idx;
          this.recipeParameterIdList.map(y => {
            if(this.isNullOrEmpty(x[y])){
              x[y] = '';
            }
          })
        })
        this.gridOriData = JSON.parse(JSON.stringify(res));
        this.gridData = res;
      })
      
    },
    // 추가 버튼
    addBtn(){
      const data = {
        PLANTID: this.$auth.$state.user.plantId,
        PROCESSID: this.processId,
        LOTID: '',
        EQUIPMENTID: '',
        inEdit: true,
      };

      this.recipeParameterIdList.map(x=> {
        data[x] = '';
      })
      data.PROCESSID = this.processId;

      this.gridData.push(data);
    },
    // 저장 버튼
    saveBtn(){
      const saveData = [];

      this.recipeParameterIdList.map(x => {
        this.gridData.map((y, idx) => {
          if(y[x] != this.gridOriData[idx][x]){
            saveData.push({
              PLANTID: y.PLANTID,
              LOTID: y.LOTID,
              PROCESSID: this.isNullOrEmpty(y.PROCESSID)?this.searchedProcessId:y.PROCESSID,
              EQUIPMENTID: this.isNullOrEmpty(y.EQUIPMENTID)?this.searchedEquipmentId:y.EQUIPMENTID,
              RECIPEPARAMETERID: x,
              RESULTVALUE: y[x]
            })
          }
        });
      });
      if(saveData.length>0){
        this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnSelfInspection",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'),//알림 
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')//저장되었습니다.
              );
              this.getSelfInspectionGridData(this.selectedWorkOrder);
            } else {
              this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);   
            }
          });
        });
      }else{
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), // 알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143') // 저장할 데이터가 존재하지 않습니다.
          );
        return;
      }
      
      

    },
    // 삭제 버튼
    delBtn(){

    },
    // UNDO
    undoBtn(){

    },

    // GRID INPUT 제외 변경
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      data[idx] = { ...data[idx], [name]: e.value };

      this.gridData = data;

    },
    griditemchange(e, name, dataItem){
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };

      this.gridData = data;
    },
    // GRID ROW 더블클릭시 
    rowdblclick(event){
      this.gridData.filter(x => x.idx == event.dataItem.idx).map(x => {
        x.inEdit = true;
      })
    },


  },






}

</script>
<style>
.dateAlignRight{
  text-align-last: right;
}
</style>