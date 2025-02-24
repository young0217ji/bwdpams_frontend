<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00449') }}</li>
      <!-- 설정 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00525') }}</li>
      <!-- 사용자 관리 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00132') }}</label
                    ><!-- 사용자ID -->
                    <InputText
                      ref="userid"
                      :dataNm="'userid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00134') }}</label
                    ><!-- 사용자명 -->
                    <InputText
                      ref="userName"
                      :dataNm="'userName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}
                  <!-- 조회 -->
                </kbutton>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="4" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="3" align="left">
                <CardTitle>{{ $t('UserRoleMngPage.label3') }}</CardTitle>
                <!-- 사용자 목록 -->
              </v-col>
              <v-col cols="9" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00414') }}
                  <!-- 저장 -->
                </kbutton>
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00411') }}
                  <!-- 추가 -->
                </kbutton>
                <kbutton
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="confirmDel"
                  >{{ $t('MES_CommLang.MES_CommLang_00412') }}
                  <!-- 삭제 -->
                </kbutton>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="items"
                :sortable="true"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                @gridrowclick="onRowClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>

      <v-col :cols="8" :class="'divList1'" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <cardBody :style="{ width: '100%' }">
            <CardTitle>{{ $t('MES_CommLang.MES_CommLang_00137') }}</CardTitle>
            <!-- 사용자상세 -->
            <div>
              <v-row>
                <v-col :cols="4">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="6">
                      <Label>
                        <v-icon x-small :color="'#fb8200'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00132') }}
                        <!-- 사용자ID -->
                      </Label>
                    </v-col>
                    <v-col :cols="6">
                      <InputText
                        ref="userId"
                        :required="true"
                        :boxWidth="'95%'"
                        :dataNm="'USERID'"
                        :disabled="itemDis"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="2">
                  <kbutton
                    ref="userIdChkBtn"
                    :disabled="idCheckDis"
                    :theme-color="'primary'"
                    @click="userIdChk"
                    >{{ $t('MES_CommLang.MES_CommLang_00438') }}</kbutton
                  >
                  <!-- 중복확인 -->
                </v-col>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'#fb8200'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00099') }}
                        <!-- 비밀번호 -->
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        :type="'password'"
                        ref="password"
                        :boxWidth="'95%'"
                        :dataNm="'NEWPASSWORD'"
                        @input-text-set="formInputValSet"
                      ></InputText>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'#fb8200'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00134') }}
                        <!-- 사용자명 -->
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="userName"
                        :boxWidth="'95%'"
                        :dataNm="'USERNAME'"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="4">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="6">
                      <Label>
                        <v-icon x-small :color="'#fb8200'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00076') }}
                        <!-- 권한 -->
                      </Label>
                    </v-col>
                    <v-col :cols="6">
                      <InputText
                        ref="roleList"
                        :required="true"
                        :boxWidth="'95%'"
                        :dataNm="'ROLENAME'"
                      />
                      <InputText
                        style="display: none"
                        ref="hideRoleID"
                        :required="true"
                        :boxWidth="'95%'"
                        :dataNm="'ROLEID'"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="2">
                  <kbutton
                    ref="roleBtn"
                    :theme-color="'primary'"
                    @click="[(searchModalVisible = true), getUserInfo()]"
                    >{{ $t('MES_CommLang.MES_CommLang_00522') }}</kbutton
                  >
                  <!-- 등록 -->
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00437') }}
                        <!-- 이메일 -->
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="email"
                        :boxWidth="'95%'"
                        :dataNm="'EMAIL'"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00439') }}
                        <!-- 전화번호 -->
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="phoneNumber"
                        :dataNm="'PHONE_NUMBER'"
                        :boxWidth="'95%'"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00469') }}
                        <!-- 등록자 -->
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="createUserID"
                        :boxWidth="'95%'"
                        :dataNm="'CREATEUSERID'"
                        :disabled="true"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00352') }}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="createTime"
                        :boxWidth="'95%'"
                        :dataNm="'CREATETIME'"
                        :disabled="true"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00189') }}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="lastUpdateUserID"
                        :boxWidth="'95%'"
                        :dataNm="'LASTUPDATEUSERID'"
                        :disabled="true"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1"
                          >mdi-record-circle</v-icon
                        >
                        {{ $t('MES_CommLang.MES_CommLang_00191') }}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="lastUpdateTime"
                        :boxWidth="'95%'"
                        :dataNm="'LASTUPDATETIME'"
                        :disabled="true"
                        @input-text-set="formInputValSet"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </cardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="confirmPop" :is="'confirmPop'" :visibleDialog="false" />

    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModal"
      :title="'title'"
      :message="'message'"
      v-bind:userData="userDataInfo"
      :callBack="() => {}"
      @visibleDialog="val => (searchModalVisible = val)"
      @searchBtn="searchBtn"
      @checkedUserRole="getSelectedRole"
    />
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
import { DropDownList, MultiSelect } from '@progress/kendo-vue-dropdowns';
import SelectModelingConfirm from '@/components/common/modal/UserRoleModal';
import { chevronDoubleLeftIcon } from '@progress/kendo-svg-icons';

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
    DropDownList,
    MultiSelect,
    SelectModelingConfirm,
  },
  data() {
    return {
      userid: '', // 사용자ID 검색
      userName: '', // 사용자명 검색
      ProductionType: '', //제품구분 콤보박스
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridOriRole: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvSFUser', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
      },
      gridHeader: [],
      reSetPage: false,
      role: [],
      selectedRole: [],
      roleID: {},
      roleListList: [],
      selectedID: 0,
      selectedData: [],
      baseData: [],
      btnDis: false,
      itemDis: true,
      searchModalVisible: false,
      userDataInfo: {},
      roleOriData: '',
      idCheckDis: true,
      idChecked: false,
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    this.getGridData();
  },
  computed: {
    items() {
      return this.gridData.map(item => ({
        ...item,
        selected: item.idx === this.selectedID,
      }));
    },
  },
  watch: {},
  methods: {
    getUserInfo() {
      this.userDataInfo = {
        userId: this.$refs['userId'].textVal,
        userName: this.$refs['userName'].textVal,
        roleId: this.$refs['hideRoleID'].textVal,
      };

      this.roleOriData = this.$refs['roleList'].textVal;
    },
    // 선택된 권한리스트를 콤마로 구분해서 문자열로 변환
    getSelectedRole(message) {
      let roleNmResult = '';
      let roleIDResult = '';

      for (let i = 0; i < message.length; i++) {
        if (i > 0) {
          roleNmResult += ',';
        }
        roleNmResult += message[i].ROLENAME;
      }
      for (let i = 0; i < message.length; i++) {
        if (i > 0) {
          roleIDResult += ',';
        }
        roleIDResult += message[i].ROLEID;
      }
      this.$refs['roleList'].textVal = roleNmResult;
      this.selectedData.ROLENAME = roleNmResult;
      this.selectedData.ROLEID = roleIDResult;

      if (this.roleOriData != roleNmResult) {
        const index = this.gridData.findIndex(
          p => p.idx === this.selectedData.idx
        );
        if (this.selectedData.rowStat == '') {
          this.selectedData.rowStat = 'U';
        }
        this.gridData.splice(index, 1, this.selectedData);
      }
    },
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.reSetPage = true;
      this.getGridData();
    },

    async saveBtn() {
      let alertMsg = this.$i18n.t('MES_CommLang.MES_CommLang_00456'); /* 알림 */
      let passwordMsg = this.$i18n.t(
        'MES_MsgLang.MES_MsgLang_00210'
      ); /* 비밀번호를 입력해주세요. */
      let saveMsg1 = this.$i18n.t(
        'MES_MsgLang.MES_MsgLang_00140'
      ); /* 저장되었습니다. */
      let saveMsg2 = this.$i18n.t(
        'MES_MsgLang.MES_MsgLang_00143'
      ); /* 저장할 데이터가 없습니다. */

      this.gridData.ROLEID = this.selectedRole;
      const saveData = this.gridData
        .filter(x => x.rowStat !== '')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });
      for (let i = 0; i < saveData.length; i++) {
        if (saveData[i].rowStat == 'C' && saveData[i].NEWPASSWORD == '') {
          this.$refs.alertPop.show(
            alertMsg,
            passwordMsg
          ); /* 알림, 비밀번호를 입력해주세요. */
          return;
        }
      }
      const validate = this.mesValidation(this.gridHeader, this.gridData);
      if (!validate.isValidate) {
        this.$refs.alertPop.show(alertMsg, validate.msg); /* 알림 */
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename:
            '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.getGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                alertMsg,
                saveMsg1
              ); /* 알림, 저장되었습니다. */
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show(
          alertMsg,
          saveMsg2
        ); /* 알림, 저장할 데이터가 없습니다. */
        return;
      }
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetUserList',
        sendParam: {
          userid: this.userid,
          userName: this.userName,
        },
        queryVersion: '00003',
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: '',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.gridData = data;
        this.gridOriData = JSON.parse(JSON.stringify(res));
        if (this.gridData.length > 0);
        this.onRowClick({ dataItem: this.gridData[0] });
      });
    },
    formInputValSet(nm, val) {
      if (this.idChecked == false) {
        this.selectedData[nm] = '';
      }

      this.selectedData[nm] = val;
      const index = this.gridData.findIndex(
        p => p.idx === this.selectedData.idx
      );
      if (this.selectedData.rowStat == '') {
        this.selectedData.rowStat = 'U';
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    searchModal() {
      searchModalVisible = true;
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map(item => {
        return { ...item, selected: checked };
      });
    },
    // 아이디 중복확인
    userIdChk() {
      let userIdArr = [];
      let count = 0;
      for (let i = 0; i < this.gridData.length; i++) {
        userIdArr.push(this.gridData[i].USERID);
      }
      for (let item of userIdArr) {
        if (item === this.$refs['userId'].textVal) {
          count++;
        }
      }

      if (count > 1) {
        this.$refs['alertPop'].title = this.$i18n.t(
          'MES_CommLang.MES_CommLang_00457'
        );
        this.$refs['alertPop'].message = this.$i18n.t(
          'MES_MsgLang.MES_MsgLang_00211'
        );
        this.$refs['alertPop'].modalWidth = '300px';
        this.$refs['alertPop'].visibleDialog = true;
      } else {
        this.$refs['alertPop'].title = this.$i18n.t(
          'MES_CommLang.MES_CommLang_00456'
        );
        this.$refs['alertPop'].message = this.$i18n.t(
          'MES_MsgLang.MES_MsgLang_00212'
        );
        this.$refs['alertPop'].modalWidth = '300px';
        this.$refs['alertPop'].visibleDialog = true;
      }

      this.idChecked = true;
    },
    onRowClick(event) {
      console.log(event);
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;

      this.selectedID = event.dataItem.idx;
      this.selectedData = event.dataItem;
      this.$refs['userId'].textVal = event.dataItem.USERID
        ? event.dataItem.USERID
        : '';
      this.$refs['userName'].textVal = event.dataItem.USERNAME
        ? event.dataItem.USERNAME
        : '';
      this.$refs['email'].textVal = event.dataItem.EMAIL
        ? event.dataItem.EMAIL
        : '';
      this.$refs['phoneNumber'].textVal = event.dataItem.PHONE_NUMBER
        ? event.dataItem.PHONE_NUMBER
        : '';
      this.$refs['password'].textVal = event.dataItem.NEWPASSWORD
        ? event.dataItem.NEWPASSWORD
        : '';
      this.$refs['createUserID'].textVal = event.dataItem.CREATEUSERID
        ? event.dataItem.CREATEUSERID
        : '';
      this.$refs['createTime'].textVal = event.dataItem.CREATETIME
        ? event.dataItem.CREATETIME
        : '';
      this.$refs['lastUpdateUserID'].textVal = event.dataItem.LASTUPDATEUSERID
        ? event.dataItem.LASTUPDATEUSERID
        : '';
      this.$refs['lastUpdateTime'].textVal = event.dataItem.LASTUPDATETIME
        ? event.dataItem.LASTUPDATETIME
        : '';
      this.$refs['roleList'].textVal = event.dataItem.ROLENAME
        ? event.dataItem.ROLENAME
        : '';
      this.$refs['hideRoleID'].textVal = event.dataItem.ROLEID
        ? event.dataItem.ROLEID
        : '';

      if (this.selectedData.rowStat == 'C') {
        this.itemDis = false;
        this.idCheckDis = false;
      } else {
        this.itemDis = true;
        this.idCheckDis = true;
      }
    },

    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.onRowClick({ dataItem: this.gridData[0] });
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      this.selectedID = '';
      const newRecord = {
        userId: '',
        userName: '',
        email: '',
        phone_Number: '',
        password: '',
        NEWPASSWORD: '',
        createUserID: '',
        createTime: '',
        lastUpdateUserID: '',
        lastUpdateTime: '',
        idx: this.gridData.length,
        roleId: '',
        rowStat: 'C',
      };

      const data = this.gridData.slice();
      data.unshift(newRecord);
      this.gridData = data;
      this.onRowClick({ dataItem: newRecord });
    },
    //삭제버튼
    confirmDel() {
      const index = this.gridData.findIndex(
        p => p.idx === this.selectedData.idx
      );
      const idx = this.selectedData.idx;
      console.log('aa', this.gridData[index]);
      this.gridData[idx].rowStat = 'D';
      // this.selectedData.rowStat = "D";
      this.baseData.splice(index, 1, this.selectedData);
    },
    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data
        .filter(x => !(x.selected && x.rowStat === 'C'))
        .map(x => {
          if (x.selected) {
            return {
              ...x,
              rowStat: 'D',
            };
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
      this[nm] = val ? 'Yes' : '';
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['PRODUCTQUANTITY', 'ESTIMATEDCYCLETIME'],
        ['ACTIVESTATE']
      );
    },
  },
};

const defaultData = {};
</script>
