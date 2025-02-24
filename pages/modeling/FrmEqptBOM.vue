<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00074') }}</li>
      <!-- 기준정보홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00180') }}</li>
      <!-- 공장기본설정 -->
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :cols="12" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}</kbutton
                >
                <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="3" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col align="left">
                <CardTitle></CardTitle>
              </v-col>
              <v-col align="right">
                <kbutton
                  :style="{ width: '25px' }"
                  :theme-color="'primary'"
                  :size="'small'"
                  @click="maximizeTree"
                >
                  {{ this.treeBtn }}</kbutton
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: '96%' }">
              <KendoTree
                :treeData="treeData"
                :textField="'AREANAME'"
                :icon="'icon'"
                :activeItem="treeActiveItem"
                @onExpandChange="onExpandChange"
                @onItemClick="onItemClick"
              >
              </KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="9" :class="'divListWapper2'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row no-gutters style="margin-bottom: -7px">
              <v-col cols="12" align="right">
                <Button
                  v-show="saveBtnVisible"
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00414') }}</Button
                >
                <!-- 저장 -->
                <Button
                  v-show="addBtnVisible"
                  :theme-color="'secondary'"
                  :size="'small'"
                  icon="add"
                  @click="addBtn"
                  >{{ $t('MES_CommLang.MES_CommLang_00411') }}</Button
                >
                <!-- 추가 -->
                <Button
                  v-show="delBtnVisible"
                  :theme-color="'secondary'"
                  :size="'small'"
                  icon="delete"
                  @click="confirmDel"
                  >{{ $t('MES_CommLang.MES_CommLang_00412') }}</Button
                >
                <!-- 삭제 -->
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" align="left">
                <CardTitle style="margin-bottom: -10px">{{
                  $t('MES_CommLang.MES_CommLang_00180')
                }}</CardTitle>
                <!-- 설비기준정보 -->
              </v-col>
            </v-row>
            <Card ref="gridCard" style="height: 24%; margin: 20px">
              <CardBody :style="{ width: '100%' }">
                <v-row no-gutters>
                  <v-col :cols="12">
                    <div class="form-group-wrap" style="margin-bottom: 5px">
                      <!-- <div class="form-group">
                        <label>WorkCenter</label>
                        <InputText ref="workcenter" :dataNm="'workcenter'" :disabled="false" :readonly="true"
                          :searchOption="true" />
                      </div> -->

                      <div class="form-group">
                        <label>{{
                          $t('MES_CommLang.MES_CommLang_00177')
                        }}</label>
                        <!-- 설비코드 -->
                        <InputText
                          ref="equipmentid"
                          :dataNm="'equipmentid'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="form-group">
                        <label>{{
                          $t('MES_CommLang.MES_CommLang_00171')
                        }}</label>
                        <!-- 설비명 -->
                        <InputText
                          ref="equipmentName"
                          :dataNm="'equipmentName'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="form-group" style="justify-content: right">
                        <label>설비 이미지</label>
                        <!-- <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" /> -->
                        <InputText
                          ref="fileName"
                          :dataNm="'fileName'"
                          :disabled="inputReadOnly"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                          :style="{ width: '200px' }"
                        />
                        <!-- <Button @click="openFileExplorer" :disabled="inputReadOnly">파일 선택</Button> -->
                      </div>
                    </div>
                    <div class="form-group-wrap" style="margin-bottom: 5px">
                      <div class="form-group">
                        <label>{{
                          $t('MES_CommLang.MES_CommLang_00176')
                        }}</label>
                        <!-- 설비구분 -->
                        <DropDownList
                          ref="cmbEquipmentType"
                          :style="{ width: '165px' }"
                          :data-items="equipmentType"
                          :disabled="false"
                          :text-field="'text'"
                          :data-item-key="'id'"
                          :value="equipmentTypeValue"
                          @change="changeEquipmentType"
                        >
                        </DropDownList>
                      </div>
                      <div class="form-group">
                        <label>설비상세</label>
                        <!-- 설비상세 -->
                        <DropDownList
                          ref="cmbEquipmentDetail"
                          :style="{ width: '165px' }"
                          :data-items="equipmentDetail"
                          :disabled="false"
                          :text-field="'text'"
                          :data-item-key="'id'"
                          :value="equipmentDetailValue"
                          @change="changeEquipmentDetail"
                        >
                        </DropDownList>
                      </div>
                      <div class="form-group">
                        <label>설비등급</label>
                        <!-- 설비등급 -->
                        <DropDownList
                          ref="cmbEquipmentGrade"
                          :style="{ width: '200px' }"
                          :data-items="equipmentGrade"
                          :disabled="false"
                          :text-field="'text'"
                          :data-item-key="'id'"
                          :value="equipmentGradeValue"
                          @change="changeEquipmentGrade"
                        >
                        </DropDownList>
                      </div>
                    </div>
                    <div class="form-group-wrap" style="margin-bottom: 5px">
                      <div class="form-group">
                        <label>사용상태</label>
                        <!-- 사용상태 -->
                        <DropDownList
                          ref="cmbUseflag"
                          :style="{ width: '165px' }"
                          :data-items="activestate"
                          :disabled="false"
                          :text-field="'text'"
                          :data-item-key="'id'"
                          :value="activestateValue"
                          @change="changeUseflag"
                        >
                        </DropDownList>
                      </div>
                      <div class="form-group">
                        <label>설비 SPEC</label>
                        <!-- 설비 SPEC -->
                        <InputText
                          ref="equipmentSpec"
                          :dataNm="'equipmentSpec'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </CardBody>
            </Card>

            <v-row no-gutters>
              <v-col cols="12" align="left">
                <CardTitle style="margin-bottom: -10px">{{
                  $t('MES_CommLang.MES_CommLang_00768')
                }}</CardTitle>
                <!-- 설비기준정보 -->
              </v-col>
            </v-row>
            <Card ref="gridCard" style="height: 31%; margin: 20px">
              <CardBody :style="{ width: '100%' }">
                <v-row no-gutters>
                  <v-col :cols="12">
                    <div class="form-group-wrap" style="margin-bottom: 5px">
                      <div class="form-group">
                        <label>자산번호(CCTR)</label>
                        <InputText
                          ref="accetno"
                          :dataNm="'accetno'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                        />
                      </div>
                      <div class="form-group" style="justify-content: right">
                        <label>내용년수</label>
                        <InputText
                          ref="assetYear"
                          :dataNm="'assetYear'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="form-group">
                        <label>{{
                          $t('MES_CommLang.MES_CommLang_00775')
                        }}</label>
                        <!-- 제작회사 -->
                        <InputText
                          ref="maker"
                          :dataNm="'maker'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                    </div>
                    <div class="form-group-wrap" style="margin-bottom: 5px">
                      <div class="form-group" style="margin-left: 5px">
                        <label>메모</label>
                        <!-- 메모 -->
                        <InputText
                          ref="memo"
                          :dataNm="'memo'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="form-group">
                        <label>{{
                          $t('MES_CommLang.MES_CommLang_00770')
                        }}</label>
                        <!-- 취득가액 -->
                        <InputText
                          ref="acquisitionAmount"
                          :dataNm="'acquisitionAmount'"
                          :disabled="false"
                          :readonly="false"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="form-group">
                        <label>{{
                          $t('MES_CommLang.MES_CommLang_00771')
                        }}</label>
                        <!-- 잔존가액 -->
                        <InputText
                          ref="residualAmount"
                          :dataNm="'residualAmount'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                    </div>
                    <div class="form-group-wrap" style="margin-bottom: 5px">
                      <div class="form-group" style="margin-left: 5px">
                        <label>취득일자</label>
                        <!-- 취득일자 -->
                        <InputText
                          ref="acquisitionTime"
                          :dataNm="'acquisitionTime'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="form-group">
                        <label>취득근거번호</label>
                        <!-- 취득근거번호 -->
                        <InputText
                          ref="acquisitionReasoneNo"
                          :dataNm="'acquisitionReasoneNo'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                    </div>
                    <div
                      class="form-group-wrap"
                      style="margin-bottom: 5px; margin-left: 5px"
                    >
                      <div class="form-group">
                        <label>폐기일자</label>
                        <!-- 폐기일자 -->
                        <InputText
                          ref="deposeTime"
                          :dataNm="'deposeTime'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="form-group">
                        <label>폐기근거번호</label>
                        <!-- 폐기근거번호 -->
                        <InputText
                          ref="deposeReasoneNo"
                          :dataNm="'deposeReasoneNo'"
                          :disabled="false"
                          :readonly="inputReadOnly"
                          :searchOption="true"
                          @input-text-set="searchInput"
                        />
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </CardBody>
            </Card>
            <v-col
              :cols="12"
              :class="'divList1'"
              style="margin-top: 8px; height: 25%"
            >
              <v-row no-gutters>
                <v-col cols="6" align="left">
                  <CardTitle style="margin-bottom: 10px"
                    >하위설비 리스트</CardTitle
                  >
                  <!-- 계측기 상태관리 -->
                </v-col>
                <v-col cols="6" align="right">
                  <Button
                    v-show="gridBtnShow"
                    :theme-color="'secondary'"
                    :size="'small'"
                    icon="add"
                    @click="addBtn2"
                    >{{ $t('MES_CommLang.MES_CommLang_00411') }}</Button
                  >
                  <!-- 추가 -->
                  <Button
                    v-show="gridBtnShow"
                    :theme-color="'secondary'"
                    :size="'small'"
                    icon="delete"
                    @click="confirmDel2"
                    >{{ $t('MES_CommLang.MES_CommLang_00412') }}</Button
                  >
                  <!-- 삭제 -->
                  <Button
                    v-show="gridBtnShow"
                    :theme-color="'secondary'"
                    :size="'small'"
                    :icon="'undo'"
                    @click="undoBtn2"
                    >UNDO</Button
                  >
                </v-col>
              </v-row>
              <div ref="divWrapper" style="height: 100%">
                <KendoGrid
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="headerParam.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :isPaging="false"
                  :gridDropDownList="headerParam.enumComboBox"
                  :selected-field="selectedField"
                  @gridrowclick="onRowClick"
                  @griditemchange="griditemchange"
                  @gridddchang="rowDdChange"
                />
              </div>
            </v-col>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import utils from '~/plugins/utils';
import InputText from '@/components/common/input/InputText';
import { DropDownList } from '@progress/kendo-vue-dropdowns';

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
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
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    KendoTree,
    Button,
    InputText,
    DropDownList,
  },
  data() {
    return {
      treeData: [],
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,

      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      // checkHeaderArr: ['ACTIVESTATE'],
      headerParam: {
        gridid: 'dgvEquipmentBominfo', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        enumComboBox: [],
        checkBox: [],
      },
      treeActiveItem: {},
      reSetPage: false,
      gridTitle: '',
      menu: [],

      maximize: true,
      treeBtn: '-',
      currTreeData: {},

      selectedEquipmentId: '',
      gridOriDataEquipment: [],
      gridDataEquipment: [],

      workcenter: '',
      fileName: '',
      equipmentid: '',
      equipmentName: '',
      equipmentType: [],
      equipmentTypeValue: {},
      equipmentDetail: [],
      equipmentDetailValue: {},
      equipmentGrade: [],
      equipmentGradeValue: {},
      activestate: [],
      activestateValue: {},
      equipmentSpec: '',
      accetno: '',
      assetYear: '',
      maker: '',
      memo: '',
      acquisitionAmount: '',
      residualAmount: '',
      acquisitionTime: '',
      acquisitionReasoneNo: '',
      deposeTime: '',
      deposeReasoneNo: '',
      addBtnVisible: false,
      delBtnVisible: false,
      saveBtnVisible: false,
      inputReadOnly: true,
      gridBtnShow: false,
      saveRowstat: 'U',
      selectedWorkcenter: '',
      changeInfoFlag: false,
      uploadFile: {},
      fileLocation: '',
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.initTree();
    await this.getComboList();
    // await this.getGridComboList();
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
    openFileExplorer() {
      // 버튼 클릭 시 파일 입력 필드를 클릭
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      // 파일이 선택되면 실행되는 로직을 여기에 추가
      const selectedFile = event.target.files[0];
      this.$refs.fileName.textVal = this.fileTimestamp(
        event.target.files[0].name
      );
      this.fileName = this.fileTimestamp(event.target.files[0].name);
      this.uploadFile = event.target.files[0];
      this.fileLocation =
        '/프로젝트관리/98. 기타/09.개인폴더/이홍상/TEST/'.concat(this.fileName);
      this.changeInfoFlag = true;
      console.log('Selected file:', selectedFile);
      console.log('event:', event);
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.reSetPage = true;
      this.initTree();
    },
    // 저장
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      const validate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridData
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          validate.msg
        ); // 알림
        return;
      }

      if (this.delBtnVisible) {
        this.saveRowstat = 'U';
      } else {
        this.saveRowstat = 'C';
      }

      const fileList = [];
      fileList.push({
        file: this.uploadFile,
        fileName: this.fileName,
        fileLocation:
          '\\\\172.31.15.21\\스마트 공장 Track A\\프로젝트관리\\98. 기타\\09.개인폴더\\이홍상\\TEST\\\\',
      });

      console.log('fileList : ', fileList);
      if (saveData.length > 0 || this.changeInfoFlag == true) {
        // if (this.mesFileUpload(fileList)) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename:
            '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
          sendParam: saveData,
          params2: {
            plantid: this.$auth.$state.user.plantId,
            EQUIPMENTID: this.equipmentid,
            EQUIPMENTNAME: this.equipmentName,
            EQUIPMENTTYPE: this.equipmentTypeValue.id,
            EQUIPMENTDETAILTYPE: this.equipmentDetailValue.id,
            ACTIVESTATE: this.activestateValue.id,
            AREAID: this.selectedWorkcenter,
            ROWSTATUS: this.saveRowstat,
            FILENAME: this.fileName,
            FILELOCATION: this.fileLocation,
          },
        }).then(result => {
          this.$nextTick(() => {
            this.initTree();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); //저장되었습니다.
              this.getGridData(this.equipmentid);
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
        // }else{
        //   this.$refs.alertPop.show(
        //     this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
        //     this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); //저장할 데이터가 없습니다.
        //   return;
        // }
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        ); //저장할 데이터가 없습니다.
        return;
      }
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
      this.selectedEquimentId = event.dataItem.EQUIPMENTID;
    },

    //그리드 데이터 가져오기
    async getGridData(equipmentID) {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEqptList',
        queryVersion: '00002',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          SUPEREQUIPMENTID: equipmentID,
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
            resizable: true,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.gridData = data;
      });
    },

    async getComboList() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumItemType',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          ENUMID: 'EquipmentType',
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
            resizable: true,
          };
        });
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.equipmentType.push({
              id: data[i].ENUMVALUE,
              text: data[i].ENUMVALUENAME,
            });
          }
        }
      });
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumItemType',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          ENUMID: 'EquipmentDetailType',
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
            resizable: true,
          };
        });
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.equipmentDetail.push({
              id: data[i].ENUMVALUE,
              text: data[i].ENUMVALUENAME,
            });
          }
        }
      });

      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumItemType',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          ENUMID: 'ActiveState',
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
            resizable: true,
          };
        });
        for (let i = 0; i < data.length; i++) {
          if (i < data.length) {
            this.activestate.push({
              id: data[i].ENUMVALUE,
              text: data[i].ENUMVALUENAME,
            });
          }
        }
      });
    },

    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'ACTIVESTATE') {
        e.value = e.value ? 'Active' : 'Inactive';
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          data,
          this.gridOriData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData = data;
    },
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          data,
          this.gridOriData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData = data;
    },
    //트리 데이터 가져오기
    async initTree() {
      this.$refs['equipmentid'].textVal = '';
      this.$refs['equipmentName'].textVal = '';
      this.equipmentTypeValue = '';
      this.equipmentDetailValue = '';
      this.activestateValue = '';

      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumItemType',
        queryVersion: '00001',
        sendParam: {
          SUPERAREAID: '',
          plantid: this.$auth.$state.user.plantId,
        },
      });
      const data = res.map(x => ({ ...x, expanded: true }));
      // .sort((a, b) => (a.POSITION || '').localeCompare(b.POSITION || ''));
      data.map(x => {
        if (x.AREATYPE === 'WorkCenter') {
          x.icon = 'WORKCENTER';
        }
        this.currTreeData = data;
      });

      this.treeData = utils.makeTreeData(data);
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    isChanged() {
      const saveData = this.gridData.filter(x => x.rowStat !== 'N');
      return saveData.length > 0;
    },
    // 트리 클릭
    onItemClick(event) {
      this.changeInfoFlag = false;
      this.selectedEquipmentId = event.item.EQUIPMENTID;
      this.selectedWorkcenter = event.item.WORKCENTER;
      if (event.item.AREATYPE === 'WorkCenter') {
        this.gridTitle = event.item.AREANAME;
        this.addBtnVisible = true;
        this.delBtnVisible = false;
        this.saveBtnVisible = false;
        this.$refs['equipmentid'].textVal = '';
        this.$refs['equipmentName'].textVal = '';
        this.$refs['fileName'].textVal = '';
        this.$refs['cmbEquipmentGrade'].textVal = '';
        this.$refs['equipmentSpec'].textVal = '';
        this.$refs['fileName'].textVal = '';
        this.gridData = [];
        this.inputReadOnly = true;
        this.gridBtnShow = false;
      } else if (event.item.AREATYPE === 'EQUIPMENT') {
        this.getGridData(event.item.EQUIPMENTID);
        this.addBtnVisible = false;
        this.delBtnVisible = true;
        this.saveBtnVisible = true;
        this.workcenter = event.item.WORKCENTER;
        this.$refs['equipmentid'].textVal = event.item.EQUIPMENTID;
        this.equipmentid = event.item.EQUIPMENTID;
        this.$refs['equipmentName'].textVal = event.item.EQUIPMENTNAME;
        this.equipmentName = event.item.EQUIPMENTNAME;
        this.equipmentTypeValue = this.equipmentType.filter(
          x => x.id == event.item.EQUIPMENTTYPE
        )[0];
        this.equipmentDetailValue = this.equipmentDetail.filter(
          x => x.id == event.item.EQUIPMENTDETAILTYPE
        )[0];
        this.activestateValue = this.activestate.filter(
          x => x.id == event.item.ACTIVESTATE
        )[0];
        this.$refs['fileName'].textVal = event.item.FILENAME;
        this.inputReadOnly = false;
        this.gridBtnShow = true;
      } else {
        this.addBtnVisible = false;
        this.delBtnVisible = false;
        this.saveBtnVisible = false;
        this.$refs['equipmentid'].textVal = '';
        this.$refs['equipmentName'].textVal = '';
        this.$refs['fileName'].textVal = '';
        this.$refs['cmbEquipmentGrade'].textVal = '';
        this.$refs['equipmentSpec'].textVal = '';
        this.$refs['fileName'].textVal = '';
        this.gridData = [];
        this.inputReadOnly = true;
        this.gridBtnShow = false;
      }
      this.treeActiveItem = event.item;
    },
    // 트리 클릭 시 그리드 타이틀
    setGridTitle() {
      let title = '';
      if (this.curTree.PARENTEQUIPMENTID === '') {
        title =
          '[' +
          this.curTree.EQUIPMENTID +
          ']' +
          this.$i18n.t('MES_CommLang.MES_CommLang_00172'); //설비목록
      } else {
        title =
          '[' +
          this.curTree.PARENTEQUIPMENTID +
          ']' +
          this.$i18n.t('MES_CommLang.MES_CommLang_00172') +
          '[' + //설비목록
          this.curTree.EQUIPMENTID +
          '] ' +
          this.curTree.EQUIPMENTNAME;
      }

      this.gridTitle = title;
    },

    //unbo 버튼 클릭
    undoBtn() {
      this.$nuxt.$emit('iccReset');
    },
    undoBtn2() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      this.saveBtnVisible = true;
      this.inputReadOnly = false;
      this.gridBtnShow = true;
    },
    addBtn2() {
      this.$refs.rowGrid.skip = 0;

      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: this.$auth.$state.user.plantId,
        rowStat: 'C',
        AREAID: this.treeActiveItem.AREAID,
        EQUIPMENTGROUPID: '',
        EQUIPMENTID: '',
        EQUIPMENTNAME: '',
        EQUIPMENTTYPE: '', // 설비구분
        EQUIPMENTDETAILTYPE: '', //설비 상세구분
        COMMUNICATIONSTATE: '', //통신상태
        ACTIVESTATE: 'Active',
        PMCYCLEVALUE: '',
        PMCYCLETYPE: '', //PM주기구분
        MODELNUMBER: '',
        SERIALNUMBER: '',
        LASTMAINTENANCEUSERID: '',
        LASTMAINTENANCETIME: '',
        DESCRIPTION: '',
        idx: this.gridData.length,
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },

    //삭제
    confirmDel() {
      const validate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridData
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          validate.msg
        ); // 알림
        return;
      }

      if (!this.isNullOrEmpty(this.equipmentid)) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename:
            '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
          sendParam: this.gridData,
          params2: {
            plantid: this.$auth.$state.user.plantId,
            EQUIPMENTID: this.equipmentid,
            EQUIPMENTNAME: this.equipmentName,
            AREAID: this.selectedWorkcenter,
            ROWSTATUS: 'D',
          },
        }).then(result => {
          this.$nextTick(() => {
            this.initTree();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show(
                this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
                this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
              ); //저장되었습니다.
              this.getGridData(this.equipmentid);
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
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'), //알림
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        ); //저장할 데이터가 없습니다.
        return;
      }
    },
    confirmDel2() {
      const delData = this.gridData
        .filter(x => x.selected === true)
        .map(x => {
          return {
            ...x,
          };
        });
      if (delData.length > 0) {
        this.$refs['confirmPop'].title = 'info';
        this.$refs['confirmPop'].message = this.$i18n.t(
          'MES_MsgLang.MES_MsgLang_00089'
        ); //선택한 데이터를 삭제 하시겠습니까?
        if (delData.filter(x => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData.map(x => x.EQUIPMENTID);
          this.$refs['confirmPop'].message =
            selectedRow +
            ' - ' +
            this.$i18n.t(
              'MES_MsgLang.MES_MsgLang_00089'
            ); /* 선택한 데이터를 삭제 하시겠습니까? */
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtn2;
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00409'), //확인
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088') //선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.
        );
        return;
      }
    },
    //삭제
    delBtn2() {
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

    changeEquipmentType(event) {
      this.equipmentTypeValue = event.value;
      this.changeInfoFlag = true;
    },

    changeEquipmentDetail(event) {
      this.equipmentDetailValue = event.value;
      this.changeInfoFlag = true;
    },

    changeEquipmentGrade(event) {
      this.equipmentGradeValue = event.value;
      this.changeInfoFlag = true;
    },

    changeUseflag(event) {
      this.activestateValue = event.value;
      this.changeInfoFlag = true;
    },

    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['PMCYCLEVALUE'],
        ['ACTIVESTATE']
      );
    },

    searchInput(nm, val) {
      this[nm] = val;
      this.changeInfoFlag = true;
    },
    //트리 전체접기 버튼
    maximizeTree() {
      this.treeBtn = this.treeBtn === '-' ? '+' : '-';
      this.maximize = !this.maximize;
      this.currTreeData = this.currTreeData.map(x => ({
        ...x,
        expanded: this.maximize,
      }));
      this.treeData = utils.makeTreeData(this.currTreeData);
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
