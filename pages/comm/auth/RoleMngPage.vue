<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00449") }}</li> <!-- 설정 -->
      <li>{{ $t("MES_CommLang.MES_CommLang_00518") }}</li> <!-- 권한 관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00077") }}</label> <!-- 권한코드 -->
                    <InputText ref="s_RoleId" :dataNm="'s_RoleId'" :disabled="false" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00078") }}</label> <!-- 권한명 -->
                    <InputText ref="s_RoleName" :dataNm="'s_RoleName'" :disabled="false" :searchOption="true"
                      :searchFunc="searchBtn" @input-text-set="searchInput" />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">
                  {{ $t("MES_CommLang.MES_CommLang_00277") }}
                </kbutton> <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="5" :class="'divList1'" :style="{ height: '100%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="3" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00079") }}</CardTitle> <!-- 권한리스트 -->
                  </v-col>
                  <v-col cols="9" align="right">
                    <kbutton :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}
                    </kbutton> <!-- 저장 -->
                    <kbutton :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}
                    </kbutton> <!-- 추가 -->
                    <kbutton :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="confirmDel">{{ $t("MES_CommLang.MES_CommLang_00412") }}
                    </kbutton>  <!-- 삭제 -->
                    <kbutton :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">
                      UNDO
                    </kbutton>
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="items" :sortable="true"
                    :columns="gridHeader" :resizable="false" :edit-field="'inEdit'" :selected-field="selectedField"
                    :gridDropDownList="headerParam.enumComboBox" :checkHeaderArr="headerParam.checkBox" :isPaging="true"
                    :gridPageData="gridPageData"
                    :reSetPage="this.reSetPage" @gridrowclick="onRowClick" @sortChangeHandler="sortChangeHandler"
                    @pageChangeEvent="pageChangeEvent" />
                </div>

              </CardBody>
            </Card>
          </v-col>
          <v-col :cols="7" :class="'divList1'" :style="{ height: '100%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="4" align="left">
                    <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00080") }}</CardTitle> <!-- 권한상세 -->
                  </v-col>
                </v-row>
                <div>
                  <v-row>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00077") }}
                          </Label> <!-- 권한코드 -->
                        </v-col>
                        <v-col :cols="8">
                          <InputText 
                          ref="roleId" 
                          :disabled="itemDis"
                          :required="true" 
                          :boxWidth="'90%'" 
                          :dataNm="'ROLEID'"
                            @input-text-set="formInputValSet" />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00078") }}
                          </Label> <!-- 권한명 -->
                        </v-col>
                        <v-col :cols="8">
                          <InputText ref="roleName" :required="true" :boxWidth="'90%'" :dataNm="'ROLENAME'"
                            @input-text-set="formInputValSet" />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4"></v-col>
                        <v-col :cols="8"></v-col>
                      </v-row>
                    </v-col>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00129") }}
                          </Label> <!-- 사용여부 -->
                        </v-col>
                        <v-col :cols="8">
                          <MesVariableSelectBox :style="{ width: '90%' }"
                            :ref="'comboUseFlag'"
                            :allYN="false"
                            :dataNm="'useFlag'"
                            :queryId="'GetEnumValue'"
                            :inputcol="inputcol"
                              :sendParam="{
                               plantid: plantID,
                               ENUMID: enumID,
                              }"
                            @comboChange="comboChange">
                            </MesVariableSelectBox>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00469") }}
                          </Label> <!-- 등록자 -->
                        </v-col>
                        <v-col :cols="8">
                          <InputText ref="Cuer" :boxWidth="'90%'" :dataNm="'CREATEUSER'" :disabled="true"
                            @input-text-set="formInputValSet" />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00352") }}
                          </Label> <!-- 등록일시 -->
                        </v-col>
                        <v-col :cols="8">
                          <InputText ref="CTime" :boxWidth="'90%'" :dataNm="'CREATETIME'" :disabled="true"
                            @input="formInputValSet" />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00189") }}
                          </Label> <!-- 수정자 -->
                        </v-col>
                        <v-col :cols="8">
                          <InputText ref="LastUser" :boxWidth="'90%'" :dataNm="'LASTUPDATEUSER'" :disabled="true"
                            @input-text-set="formInputValSet" />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col :cols="6">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00191") }}
                          </Label> <!-- 수정일시 -->
                        </v-col>
                        <v-col :cols="8">
                          <InputText ref="LastTime" :boxWidth="'90%'" :dataNm="'LASTUPDATETIME'" :disabled="true"
                            @input-text-set="formInputValSet" />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col :cols="12">
                      <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="2">
                          <Label>
                            <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                            {{ $t("MES_CommLang.MES_CommLang_00487") }}
                          </Label> <!-- 비고 -->
                        </v-col>
                        <v-col :cols="10">
                          <InputText ref="Description" :dataNm="'DESCRIPTION'" :boxWidth="'95%'"
                            @input-text-set="formInputValSet" />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>

<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { Button } from '@progress/kendo-vue-buttons';
import { Label } from "@progress/kendo-vue-labels";
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";

let myTitle;
let myMenuId;


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
    InputText,
    MesSelectBox,
    Utility,
    Card,
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    Label,
    DropDownList,
    MesVariableSelectBox,
  },
  data() {
    return {
      s_RoleId: '', // 권한 ID 검색
      s_RoleName: '', // 권한명 검색
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedID: 0,
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvSFRoleList', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true
      },
      gridHeader: [],
      reSetPage: false,
      selectedData: [],
      itemDis: true,
      btnDis: false,
      baseData: [],
      useFlag: "",
      useFlagList: [],
      plantID: this.$auth.$state.user.plantId,
      enumID: 'FlagYesNo',
      inputcol: ["ENUMVALUE", "ENUMVALUENAME"],
      gridPageData: {},
    };
  },
  created() { },
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    this.getGridData();
    this.useFlag = this.$refs.comboUseFlag.value;
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.idx === this.selectedID,
    }));

},
  },
  watch: {},
  methods: {
    onRowClick(event) {
      if (event.dataItem) {

        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;

        this.$refs["roleId"].textVal = event.dataItem.ROLEID ? event.dataItem.ROLEID : "";
        this.$refs["roleName"].textVal = event.dataItem.ROLENAME ? event.dataItem.ROLENAME : "";
        this.$refs["Description"].textVal = event.dataItem.DESCRIPTION ? event.dataItem.DESCRIPTION : "";
        this.$refs["Cuer"].textVal = event.dataItem.CREATEUSERID;
        this.$refs["CTime"].textVal = event.dataItem.CREATETIME;
        this.$refs["LastUser"].textVal = event.dataItem.LASTUPDATEUSERID;
        this.$refs["LastTime"].textVal = event.dataItem.LASTUPDATETIME;

        this.$refs.comboUseFlag.value = event.dataItem.USEFLAG;

        if ( this.$refs["roleId"].textVal == "" ) {
          this.itemDis = false;
        }
        else {
          this.itemDis = true;
        }
      }
    },
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.reSetPage = false;
      this.getGridData();
    },
    // 저장
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== '')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      const validate = this.mesValidation(this.gridHeader, this.gridData);
      if (!validate.isValidate) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), validate.msg);
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnSFRole',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.getGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* ('알림', '저장되었습니다.') */
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* ('알림', '저장할 데이터가 존재하지 않습니다.') */
        return;
      }
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSFRoleList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          roleId: this.s_RoleId,
          roleName: this.s_RoleName
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: '',
            selected: false,
            idx: idx,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridData = data;
        this.gridOriData = JSON.parse(JSON.stringify(res));
        if (this.gridData.length > 0);
        this.onRowClick({ dataItem: this.gridData[0] });
      });
    },
    formInputValSet(nm, val) {
      this.selectedData[nm] = val;
      const index = this.gridData.findIndex(
        (p) => p.idx === this.selectedData.idx
      );
      if (this.selectedData.rowStat == "") {
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = JSON.parse(JSON.stringify(this.gridOriData));
      this.search();
    },
    //추가 버튼 클릭
    addBtn() {
      this.selectedID = "";
      const newRecord = {
        PLANTID: this.$auth.$state.user.plantId,
        ROLEID: '',
        ROLENAME: '',
        ROLETYPE: 'MENU',
        USEFLAG: 'Yes',
        DESCRIPTION: '',
        rowStat: 'C',
        idx: this.gridData.length + 1,
      };
      const data = this.gridData.slice();
      data.unshift(newRecord);
      this.gridData = data;
      this.onRowClick({ dataItem: newRecord });
    },
    //삭제버튼
    confirmDel() {
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      this.selectedData.rowStat = "D";
      this.gridData.splice(index, 1, this.selectedData);
    },
    search() {
      this.getGridData();
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
      this.search();
    },
    comboChange(nm, val){
      if(nm == 'useFlag') {
        this.selectedData['USEFLAG'] = val;

        const index = this.gridData.findIndex(
          (p) => p.idx === this.selectedData.idx
        );
        
        if (this.selectedData.rowStat == "") {
          this.selectedData.rowStat = "U";
        }
        this.gridData.splice(index, 1, this.selectedData);
      }
    },
    chkVal(nm, val) {
      this[nm] = val ? 'Yes' : '';
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e);
    },
    async pageChangeEvent(skip = 0, take = 20) {
            this.gridPageData = {
                skip: skip,
                take: take
            }
            this.reSetPage = false;
            this.getGridData();

        },
  },
};

const defaultData = {};
</script>