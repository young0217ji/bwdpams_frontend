<template>
  <div>
    <ol class="page-navigation">
      <li>{{ $t('MES_CommLang.MES_CommLang_00515') }}</li>
      <!-- 홈 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00074') }}</li>
      <!-- 기준정보 -->
      <li>{{ $t('MES_CommLang.MES_CommLang_00089') }}</li>
      <!-- 라우팅구성 -->
    </ol>
    <v-row ref="searchFilter" no-gutters>
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row class="search-box" align="center" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap" style="display: inline-block">
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00087') }}</label>
                    <!-- 라우팅ID -->
                    <InputText
                      ref="processrouteid"
                      :dataNm="'processrouteid'"
                      :readonly="true"
                      :defaultValue="processrouteid"
                    />
                    <Button
                      :theme-color="'primary'"
                      :class="'btn-form'"
                      @click="routingSearchModalVisible = true"
                      >{{ $t('MES_CommLang.MES_CommLang_00169') }}</Button
                    >
                    <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <label>{{ $t('MES_CommLang.MES_CommLang_00086') }}</label>
                    <!-- 라우팅명 -->
                    <InputText
                      ref="processroutename"
                      :boxWidth="'170%'"
                      :dataNm="'processroutename'"
                      :readonly="true"
                      :defaultValue="processroutename"
                    />
                  </div>
                  <div
                    class="form-group"
                    v-if="confirm"
                    style="display: inline-block; margin-left: 130px"
                  >
                    <div class="i-msg" style="color: red">
                      {{ $t('MES_MsgLang.MES_MsgLang_00173') }}
                      <!-- 확정된 데이터이므로 수정할 수 없습니다. -->
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <!-- <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :class="'btn-modal'"
                  @click="$refs.detailView.show('라우팅 상세보기')"
                ></Button> -->
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  icon="search"
                  @click="routingInfo(initData)"
                  >{{ $t('MES_CommLang.MES_CommLang_00277') }}</Button
                >
                <!-- 조회 -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="4" :lg="3" :style="{ height: '100%' }">
        <RouterTree></RouterTree>
      </v-col>
      <v-col :sm="8" :lg="9" :style="{ height: '100%' }">
        <v-row :style="{ height: 'calc(50% - 5px)' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <Process
                  ref="Process"
                  :gridHeight="gridHeight"
                  :gridOriData="processData"
                  :confirm="confirm"
                  @saveBtnBefore="saveBtnBefore"
                />
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row
          :style="{ margin: '10px 0 0 0', height: 'calc(50% - 5px)' }"
          no-gutters
        >
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <Step
                  ref="Step"
                  :gridHeight="gridHeight"
                  :gridOriData="stepData"
                />
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="ConfirmPop" :callBack="saveBtn" />
    <RoutingSearchModal
      ref="RoutingSearchModal"
      v-if="routingSearchModalVisible"
      :visibleDialog="routingSearchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="val => (routingSearchModalVisible = val)"
      @routingInfo="routingInfo"
    />
    <!-- <AlertPop ref="alertPop" :is="'alertPop'" /> -->
    <DetailView
      ref="detailView"
      :is="'detailView'"
      :header="gridHeader"
      :item="gridData[0]"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import RoutingSearchModal from '@/components/frmProcRouteCompo/RoutingSearchModal';
import Process from '@/components/frmProcRouteCompo/Process.vue';
import Step from '@/components/frmProcRouteCompo/Step.vue';
import RouterTree from '@/components/frmProcRouteCompo/RouterTree.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';
import DetailView from '@/components/common/DetailView';
import { arrayToTree } from 'performant-array-to-tree';

let myTitle;
let myMenuId;

export default {
  name: 'Routing',
  mixins: [mixinGlobal],
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
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    RoutingSearchModal,
    Process,
    Step,
    RouterTree,
    DetailView,
  },
  props: {},
  data() {
    return {
      gridHeader: [
        {
          field: 'CONFIRMFLAG',
          editable: false,
          title: this.$i18n.t('MES_CommLang.MES_CommLang_00516'),
          minWidth: 50,
          cell: 'CONFIRMFLAG',
          className: 'gridTextCenter',
          VISIBLEFLAG: 'Yes',
        }, //확정여부
        {
          field: 'PROCESSROUTEID',
          editable: false,
          title: this.$i18n.t('MES_CommLang.MES_CommLang_00087'),
          minWidth: 50,
          cell: 'PRIMARYKEYFLAG',
          className: 'gridTextCenter',
          VISIBLEFLAG: 'Yes',
        }, //라우팅ID
        {
          field: 'PROCESSROUTENAME',
          editable: false,
          title: this.$i18n.t('MES_CommLang.MES_CommLang_00086'),
          minWidth: 50,
          cell: '',
          className: 'gridTextCenter',
          VISIBLEFLAG: 'Yes',
        }, //라우팅명
        {
          field: 'PROCESSROUTETYPE',
          editable: false,
          title: this.$i18n.t('MES_CommLang.MES_CommLang_00464'),
          minWidth: 50,
          cell: '',
          className: 'gridTextCenter',
          VISIBLEFLAG: 'Yes',
        }, //구분
        {
          field: 'COMMONFLAG',
          editable: false,
          title: this.$i18n.t('MES_CommLang.MES_CommLang_00067'),
          minWidth: 50,
          cell: 'COMMONFLAG',
          className: 'gridTextCenter',
          VISIBLEFLAG: 'Yes',
        }, //공통라우팅
        {
          field: 'DESCRIPTION',
          editable: false,
          title: this.$i18n.t('MES_CommLang.MES_CommLang_00487'),
          minWidth: 50,
          cell: '',
          className: 'gridTextCenter',
          VISIBLEFLAG: 'Yes',
        }, //비고
      ],
      disabledCheckHeaderArr: ['CONFIRMFLAG', 'COMMONFLAG'],
      gridData: [],
      gridOriData: [],
      routingSearchModalVisible: false,
      processrouteid: '',
      processroutename: '',
      processroutetype: '',
      gridHeight: (window.innerHeight || document.body.clientHeight) / 4 + 'px',
      processData: [],
      stepData: [],
      plantid: '',
      initData: {},
      confirm: false,
      processSeqArr: [],
    };
  },
  created() {},
  async mounted() {},
  computed: {
    ...mapState({
      frmData: state => state.modules.frmPRC,
      dgvOperation: state => state.modules.frmPRC.dgvOperation,
      dgvRecipe: state => state.modules.frmPRC.dgvRecipe,
      isRoutingSetSave: state => state.modules.frmPRC.isRoutingSetSave,
      treeData: state => state.modules.frmPRC.treeData,
    }),
  },
  watch: {},
  methods: {
    ...mapActions({
      setDataAction: 'modules/frmPRC/setDataAction',
      setdgvOperationAction: 'modules/frmPRC/setdgvOperationAction', // 공정
      setDgvRecipeAction: 'modules/frmPRC/setDgvRecipeAction', // 스텝
      setTreeDataAction: 'modules/frmPRC/setTreeDataAction',
      setRoutingSetSaveAction: 'modules/frmPRC/setRoutingSetSaveAction',
      setSeqsAction: 'modules/frmPRC/setSeqsAction',
      setIsTreeChange: 'modules/frmPRC/setIsTreeChange',
      setIsTreeClicked: 'modules/frmPRC/setIsTreeClicked',
    }),
    showModal() {
      this.routingSearchModalVisible = true;
    },
    showModal2() {
      this.routingSearchModalVisible = false;
    },
    async routingInfo(data) {
      this.setIsTreeClicked(false);
      this.setIsTreeChange(false);
      if (Object.keys(data).length === 0) {
        this.$refs.alertPop.title = this.$i18n.t(
          'MES_CommLang.MES_CommLang_00277'
        ); //조회
        this.$refs.alertPop.message = this.$i18n.t(
          'MES_MsgLang.MES_MsgLang_00048'
        ); /* 라우팅코드를 선택 후 조회 하세요. */
        this.$refs.alertPop.modalWidth = '330px';
        this.$refs.alertPop.visibleDialog = true;
        this.$refs.alertPop.callBack2 = this.showModal;
        return;
      }
      this.confirm = data.CONFIRMFLAG === 'Yes' ? true : false;
      this.$refs.Process.processrouteid = data.PROCESSROUTEID;
      this.$refs.Process.confirmCheck = this.confirm;
      this.$nuxt.$emit('iccReset');
      this.initData = data;
      this.processrouteid = data.PROCESSROUTEID;
      this.processroutename = data.PROCESSROUTENAME;
      this.processroutetype = data.PROCESSROUTETYPE;
      this.plantid = data.PLANTID;
      this.gridData = [data];
      this.setDataAction([data]);
      this.setRoutingSetSaveAction(false);
      await this.processGrid();
      await this.stepGrid();
    },
    async processGrid() {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetRO_Composition',
        sendParam: {
          processrouteid: this.processrouteid,
          plantid: this.plantid,
        },
      }).then(res => {
        this.processData = res.map((x, idx) => {
          this.processSeqArr.push(x.PROCESSSEQUENCE);
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            parentSeq: `0_${idx}`,
            inEdit: true,
            newRow: false,
            DESCRIPTIONSET: this.$i18n.t('MES_CommLang.MES_CommLang_00287'), //지시사항등록
          };
        });
        this.setdgvOperationAction(this.processData);
        this.$refs.Process.initGrid();
      });
    },
    async stepGrid() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetROC_Composition',
        sendParam: {
          processrouteid: this.processrouteid,
          plantid: this.plantid,
        },
      }).then(res => {
        this.stepData = res.map((x, idx) => {
          const processIndx = this.processSeqArr.indexOf(x.PROCESSSEQUENCE);
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            parentSeq: `0_${processIndx}_${idx}`,
            CONCURRENCYPROCESSBUTTON: this.$i18n.t(
              'MES_CommLang.MES_CommLang_00042'
            ), //검색
            DESCRIPTIONSET: this.$i18n.t('MES_CommLang.MES_CommLang_00287'), //지시사항등록
          };
        });
        this.setDgvRecipeAction(this.stepData);
        this.$refs.Step.initGrid();
        const gd = this.gridData.map(x => ({
          ...x,
          id: 'routeGrid',
          label: x.PROCESSROUTEID,
          icon: 'PROCESSROUTE',
        }));
        const pd = this.processData.map(x => ({
          ...x,
          id: x.UIKEY,
          parentId: 'routeGrid',
          label: x.PROCESSNAME,
          icon: 'PROCESS',
        }));

        for (let i = 0; i < pd.length; i++) {
          for (let j = 0; j < this.stepData.length; j++) {
            if (
              pd[i].PROCESSID == this.stepData[j].PROCESSID &&
              pd[i].PROCESSSEQUENCE == this.stepData[j].PROCESSSEQUENCE
            ) {
              this.stepData[j].PROCESSROUTEID = pd[i].UIKEY;
            }
          }
        }
        const sd = this.stepData.map(x => ({
          ...x,
          parentId: x.PROCESSROUTEID,
          label: `[${x.RECIPERELATIONCODE}] - ${x.RECIPENAME}[${x.RECIPETYPE || ''}]`,
          icon: 'RECIPE',
        }));
        this.setTreeDataAction([...gd, ...pd, ...sd]);
      });
    },
    saveBtnBefore() {
      this.$refs.ConfirmPop.title = this.$i18n.t(
        'MES_CommLang.MES_CommLang_00414'
      ); //저장
      this.$refs.ConfirmPop.message = this.$i18n.t(
        'MES_MsgLang.MES_MsgLang_00142'
      ); /* 저장하시겠습니까? */
      this.$refs.ConfirmPop.modalWidth = '330px';
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.saveBtn;
    },
    async saveBtn() {
      const treeData = this.mkTreeData(
        this.frmData,
        this.dgvOperation,
        this.dgvRecipe
      );
      let dgvOperationData;
      let recipParam;
      const arrProcess = [];
      let arrStep = [];
      // 트리 데이터 있을 경우 저장
      if (treeData[0].items.length > 0) {
        treeData[0].items.forEach((x, idx) => {
          const PROCESSSEQUENCE = (idx + 1) * 100 + 100000;
          arrProcess.push({ ...x, PROCESSSEQUENCE: PROCESSSEQUENCE });
          arrStep = arrStep.concat(
            x.items.map(y => ({ ...y, PROCESSSEQUENCE: PROCESSSEQUENCE }))
          );
        });
        dgvOperationData = arrProcess.map((x, idx) => {
          let ENDOFROUTE = this.dgvOperation.length - 1 === idx ? 'Yes' : 'No';
          return {
            ...x,
            PROCESSROUTEID: this.processrouteid,
            ROCOMPOSITIONID: this.isRoutingSetSave ? '' : x.ROCOMPOSITIONID,
            UIKEY: this.isRoutingSetSave
              ? x.PROCESSID + moment().format('YYYYmmDDhhmmss')
              : x.UIKEY,
            ENDOFROUTE: ENDOFROUTE,
            // PROCESSSEQUENCE: ((idx + 1) * 100) + 100000
          };
        });
        recipParam = arrStep.map((x, idx) => {
          let sRecipeTypeCode = '0000';
          if (x.RECIPETYPE == 'Start') {
            sRecipeTypeCode = '0000';
          } else if (x.RECIPETYPE == 'End') {
            sRecipeTypeCode = '9999';
          } else if (x.RECIPETYPE == 'Change') {
            sRecipeTypeCode = '0001';
          }
          return {
            ...x,
            PROCESSROUTEID: this.processrouteid,
            RECIPETYPECODE: sRecipeTypeCode,
            RECIPESEQUENCE: (idx + 1) * 100 + 100000,
          };
        });
        await this.mesPost({
          apiKey: 'mes/common/manage',
          messagename:
            '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
          sendParam: dgvOperationData,
          params2: {
            plantid: this.$auth.$state.user.plantId,
            eventuser: 'manager',
          },
        });

        await this.mesPost({
          apiKey: 'mes/common/manage',
          messagename:
            '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
          sendParam: recipParam,
          params2: {
            plantid: this.$auth.$state.user.plantId,
            eventuser: 'manager',
            processrouteid: this.processrouteid,
          },
        }).then(() => {
          this.openAlert(
            this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
            this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
          ); /* 저장, 저장되었습니다. */
          this.routingInfo(this.initData);
        });
        // 트리 데이터 없을때 (공정 1개도 없을경우)
      } else {
        dgvOperationData = {
          PLANTID: this.$auth.$state.user.plantId,
          EVNETUSER: 'manager',
          PROCESSROUTEID: this.processrouteid,
        };
        recipParam = {
          PLANTID: this.$auth.$state.user.plantId,
          EVNETUSER: 'manager',
          PROCESSROUTEID: this.processrouteid,
        };
        await this.$axios
          .post('/api/mes/common/manage', {
            messagename:
              '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
            PLANTID: this.$auth.$state.user.plantId,
            EVENTUSER: 'manager',
            PROCESSROUTEID: this.processrouteid,
          })
          .then(res => {});
        await this.$axios
          .post('/api/mes/common/manage', {
            messagename:
              '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
            PLANTID: this.$auth.$state.user.plantId,
            EVENTUSER: 'manager',
            PROCESSROUTEID: this.processrouteid,
          })
          .then(res => {
            this.openAlert(
              this.$i18n.t('MES_CommLang.MES_CommLang_00414'),
              this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
            ); /* 저장, 저장되었습니다. */
            this.routingInfo(this.initData);
          });
      }
    },
    openAlert(title, message, visiable = true, width = '350px') {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
      this.$refs.alertPop.callBack2 = this.showModal2;
    },
    mkTreeData(route, process, step) {
      const gd = [route].map(x => ({
        ...x,
        id: 'routeGrid',
        label: x.PROCESSROUTEID,
        icon: 'PROCESSROUTE',
      }));
      const pd = process.map(x => ({
        ...x,
        id: x.PROCESSSEQUENCE,
        parentId: 'routeGrid',
        label: x.PROCESSNAME,
        icon: 'PROCESS',
      }));
      const sd = step.map(x => ({
        ...x,
        parentId: x.PROCESSSEQUENCE,
        label: x.ALIASRECIPENAME,
        icon: 'RECIPE',
      }));
      return arrayToTree([...gd, ...pd, ...sd], {
        dataField: null,
        childrenField: 'items',
      });
    },
  },
  beforeDestroy() {
    console.log('destroyStore');
    this.$nuxt.$emit('destroyStoreFPRC');
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
