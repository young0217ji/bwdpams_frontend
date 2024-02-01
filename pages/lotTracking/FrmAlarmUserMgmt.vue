<template>
    <div>
        <ol class="page-navigation">
            <li>{{ $t("MES_CommLang.MES_CommLang_00515") }}</li> <!-- 홈 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00665") }}</li> <!-- 공정관리 -->
            <li>{{ $t("MES_CommLang.MES_CommLang_00663") }}</li> <!-- 이상발생수신담당자관리 -->
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
                                        <InputText ref="s_RoleID" :dataNm="'s_RoleID'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                    <div class="form-group">
                                        <label>{{ $t("MES_CommLang.MES_CommLang_00078") }}</label> <!-- 권한명 -->
                                        <InputText ref="s_RoleName" :dataNm="'s_RoleName'" :disabled="false"
                                            :searchOption="true" :searchFunc="searchBtn" @input-text-set="searchInput" />
                                    </div>
                                </div>
                            </v-col>
                            <v-col :sm="3" :lg="2" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">
                                    {{ $t("MES_CommLang.MES_CommLang_00277") }}
                                </Button> <!-- 조회 -->
                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <v-row ref="contents">
            <v-col :sm="4" :lg="5" :class="'divListWapper'" :style="{ height: '100%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00083") }} <!-- 그룹코드목록 -->
                                    <span class="i-msg">{{
                                        this.t_RoleID
                                    }}</span>
                                </CardTitle>
                            </v-col>
                            <v-col cols="6" align="right">
                                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveRoleBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                                <Button :theme-color="'primary'" :size="'small'" icon="add" @click="addBtn">{{
                                    $t("MES_CommLang.MES_CommLang_00411") }}</Button> <!-- 추가 -->
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="confirmDel">{{
                                    $t("MES_CommLang.MES_CommLang_00412") }}</Button> <!-- 삭제 -->
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoRoleBtn">UNDO
                                </Button>
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" style="height: calc(100% - 33px)">
                            <KendoGrid ref="rowGridRole" :gridHeight="gridHeight" :gridItems="gridDataRole" :sortable="true"
                                :columns="roleHeaderParam.gridHeader" @griditemchange="griditemchange" :resizable="true"
                                :selected-field="selectedFieldRole" @gridrowclick="onRowClickRole">
                            </KendoGrid>
                        </div>
                    </CardBody>
                </Card>
            </v-col>
            <v-col :sm="8" :lg="7" :class="'divListWapper'" :style="{ height: '100%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%', height: '100%' }">
                        <v-row no-gutters>
                            <v-col cols="6" align="left">
                                <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00136") }}</CardTitle> <!-- 사용자목록 -->
                            </v-col>
                            <v-col cols="6" align="right">
                                <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveValidation">{{
                                    $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'"
                                    @click="undoBtn">UNDO</Button>
                            </v-col>
                        </v-row>
                        <div ref="divWrapper2" style="height: calc(100% - 33px)">
                            <KendoGrid ref="rowGrid" :gridHeight="gridHeight" :gridItems="gridData" :sortable="true"
                                :columns="headerParam.gridHeader" :resizable="true" :edit-field="'inEdit'" :isPaging="false"
                                :selected-field="selectedField" :gridDropDownList="headerParam.enumComboBox"
                                :checkHeaderArr="headerParam.checkBox" @selectionchange="onSelectionchange"
                                @gridrowclick="onRowClick" @sortChangeHandler="sortChangeHandler"
                                @headerselectionchange="onHeaderSelectionChange" />
                        </div>
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
// import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import utils from '~/plugins/utils';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';

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
        Button,
        CardBody,
        CardTitle,
        KendoTree,
        KendoGrid,
        InputText,
        MesSelectBox,
    },
    data() {
        return {
            s_RoleID: '', // 메뉴 ID 검색
            s_RoleName: '', // 메뉴명 검색
            treeData: [],
            columns: [],
            gridHeight: '100px',
            gridData: [],
            gridOriData: [],
            // gridRoleData: [],
            // gridRoleOriData: [],
            roleHeaderParam: {
                gridid: 'dgvSFRoleList2', // 그리드 ID
                rowStat: '', //rowStat 표시 여부
                noFirstCheck: true,
                gridHeader: [],
            },
            gridLastModIdx: null,
            selectedField: 'selected',
            roleID: '',
            t_RoleID: '',
            headerParam: {
                gridid: 'dgvSFRoleUserMap', // 그리드 ID
                rowStat: '', //rowStat 표시 여부
                gridHeader: [],
            },
            treeActiveItem: {},
            // 권한리스트 사용 변수
            gridDataRole: [],
            gridOriDataRole: [],
            columnsRole: [],
            selected: 0,
            selectedID: 0,
            selectedData: [],
            selectedFieldRole: 'selected',
            label1: this.$i18n.t("MES_CommLang.MES_CommLang_00077"), // 권한코드
            label2: this.$i18n.t("MES_CommLang.MES_CommLang_00078"), // 권한명
        };
    },

    created() { },
    async mounted() {
        this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
        await this.getHeaderMulti(this.roleHeaderParam, this.$refs.divWrapper);
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper2);
        await this.gridInit();
        await this.getGridData();
    },
    computed: {
        areAllSelected() {
            return (
                this.gridData.findIndex(x => x.checked === false) === -1 &&
                this.gridData.length !== 0
            );
        },
        gridItems() {
            return this.gridDataRole.map((item) => ({
                ...item,
                selected: item.idx === this.selectedID,
            }));
        },
        items() {
            return this.gridItems.map((item) => ({
                ...item,
                selected: item.ROLEID === this.t_RoleID,
            }));
        }
    },
    watch: {},
    methods: {
        searchBtn() {
            this.gridDataSelect();
            this.getGridData();
        },
        //검색 인풋 변경시
        searchInput(nm, val) {
            this[nm] = val;
        },
        saveValidation() {
            this.saveBtn();
        },
        // 권한리스트 저장
        saveRoleBtn() {
            const saveData = this.gridDataRole
                .filter(x => x.rowStat !== 'N')
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                    };
                });

            const validate = this.mesValidation(this.roleHeaderParam.gridHeader, this.gridDataRole);
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
                        this.gridInit();
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
        // 사용자목록 저장
        async saveBtn() {
            const saveData = this.gridData
                .filter(x => x.rowStat !== 'N')
                .map(x => {
                    return {
                        ...x,
                        _ROWSTATUS: x.rowStat,
                        CHECKFLAG: x.selected,
                        ROLEID: this.roleID
                    };
                });

            if (saveData.length > 0) {
                const res = await this.mesPost({
                    apiKey: 'mes/common/manage',
                    messagename: 'TxnSFRoleUserMap',
                    sendParam: saveData,
                });

                if (res?.returncode == '0') {
                    this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* ('저장', '저장되었습니다.') */
                    this.getGridData(this.roleID);
                } else {
                    this.openAlert('error', this.$i18n.t('MES_MsgLang.MES_MsgLang_00109')); /* ('오류가 발생했습니다.') */
                }
            } else {
                this.openAlert(this.$i18n.t('MES_CommLang.MES_CommLang_00414'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')); /* ('저장', '저장할 데이터가 존재하지 않습니다.') */
            }
        },
        gridInit() {
            // this.columnsRole = [
            //     { field: "ROLEID", editable: false, title: this.label1, width: this.setPer("divWrapper", 15) },
            //     { field: "ROLENAME", editable: false, title: this.label2, width: this.setPer("divWrapper", 15) },
            // ];
            this.gridDataSelect();
        },
        // 권한리스트 그리드 데이터 가져오기
        async gridDataSelect() {
            const res = await this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetSFRoleList',
                sendParam: {
                    // parentsID: '',
                    plantid: this.$auth.$state.user.plantId,
                    ROLEID: this.s_RoleID,
                    ROLENAME: this.s_RoleName,
                    ROLETYPE: 'ALARM',
                    USEFLAG: 'Yes'
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
                    };
                });
                this.$nuxt.$emit('iccReset');
                this.gridOriDataRole = data;
                this.gridDataRole = data;
            });

            // this.gridDataRole = res;
            // this.gridOriDataRole = JSON.parse(JSON.stringify(res));
            if (this.gridDataRole.length > 0) {
                this.onRowClickRole({ dataItem: this.gridDataRole[0] });
            }
        },
        async onRowClickRole(event) {
            this.gridDataRole.forEach(x => (x.selected = false));
            event.dataItem[this.selectedField] = true;
            // if (event.dataItem) {
            this.roleID = event.dataItem.ROLEID;
            this.t_RoleID = this.roleID;
            this.getGridData(event.dataItem.ROLEID); // 데이터 없을경우 NullPointerException
            // }
        },
        //사용자 목록 그리드 데이터 가져오기
        async getGridData(roleID = '') {
            if ( this.roleID == undefined || this.roleID == '' ) {
                return;
            }

            this.mesGet({
                apiKey: 'mes/common/getqueryresult',
                queryId: 'GetSFRoleUserMap',
                sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    ROLEID: this.roleID,
                    ROLETYPE: 'ALARM'
                },
            }).then(res => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: 'N',
                        selected: x.ROLEID ? true : false,
                        idx: idx,
                        inEdit: true,
                        newRow: false,
                    };
                });
                this.$nuxt.$emit('iccReset');
                this.gridOriData = data;
                this.gridData = data;
            });
        },
        //그리드 로우 클릭
        onRowClick(event) {
            const selectedIdx = event.dataItem.idx;
            this.gridData = this.gridData.map(item => {
                return {
                    ...item,
                    selected: item.idx === selectedIdx ? !item.selected : item.selected,
                    rowStat: item.idx === selectedIdx ? (item.rowStat === 'N' ? 'U' : 'N') : item.rowStat,
                };
            });
            this.selected = event.dataItem;

            event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        //맨앞 checkBox 클릭
        onSelectionchange(event) {
            const selectedIdx = event.dataItem.idx;
            this.gridData = this.gridData.map(item => {
                return {
                    ...item,
                    selected: item.idx === selectedIdx ? !item.selected : item.selected,
                    rowStat: item.idx === selectedIdx ? (item.rowStat === 'N' ? 'U' : 'N') : item.rowStat,
                };
            });
            this.selected = event.dataItem;

            event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        //그리드 인풋 데이터 변경시
        griditemchange(e) {
            const data = JSON.parse(JSON.stringify(this.gridDataRole));
            const idx = data.findIndex(x => x.idx === e.dataItem.idx);
            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === 'N') {
                data[idx].rowStat = 'U';
            }
            if (
                data[idx].rowStat === 'U' &&
                !this.gfn_ChkOriginalData(
                    this.roleHeaderParam.gridHeader,
                    data,
                    this.gridOriDataRole,
                    idx
                )
            ) {
                data[idx].rowStat = 'N';
            }

            this.gridDataRole = data;
        },
        //header checkbox 클릭
        onHeaderSelectionChange(event) {
            let checked = event.event.target.checked;

            // 전체 체크일 경우
            if (checked) {
                this.gridData = this.gridData.map(item => {
                    return {
                        ...item,
                        selected: checked,
                        rowStat: item.rowStat === 'N' ? (item.selected ? item.rowStat : 'U') : (item.selected ? item.rowStat : 'N'),
                    };
                });
            }
            else {
                this.gridData = this.gridData.map(item => {
                    return {
                        ...item,
                        selected: checked,
                        rowStat: item.rowStat === 'N' ? (item.selected ? 'U' : item.rowStat) : (item.selected ? 'N' : item.rowStat),
                    };
                });
            }
        },
        //삭제버튼
    confirmDel() {
      const delData = this.gridDataRole
        .filter(x => x.selected === true)
        .map(x => {
          return {
            ...x,
          };
        });
      if (delData.length > 0) {
        this.$refs['confirmPop'].title = 'info';
        this.$refs['confirmPop'].message = this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); //선택한 데이터를 삭제 하시겠습니까?
        if (delData.filter(x => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData.map(x => x.ROLEID);
          this.$refs[
            'confirmPop'
          ].message = selectedRow + ' - ' +  this.$i18n.t('MES_MsgLang.MES_MsgLang_00089'); /* 선택한 데이터를 삭제 하시겠습니까? */
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtn;
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00409'), //확인
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00088')//선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.
        );
        return;
      }
    },
    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridDataRole));
      this.gridDataRole = data
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
        //추가 버튼 클릭
        addBtn() {

            this.$refs.rowGridRole.skip = 0;

            const dataItem = {
                inEdit: true,
                newRow: true,
                selected: false,
                PLANTID: this.$auth.$state.user.plantId,
                ROLEID: '',
                ROLENAME: '',
                USEFLAG: 'Yes',
                ROLETYPE: 'ALARM',
                DESCRIPTION: '',
                rowStat: 'C',
                idx: this.gridDataRole.length,
            };
            this.gridDataRole.splice(0, 0, dataItem);
            this.$nuxt.$emit('iccReset');
        },
        //unbo 버튼 클릭
        undoRoleBtn() {
            this.gridDataRole = this.gridOriDataRole.filter(x => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
        },
        //unbo 버튼 클릭
        undoBtn() {
            this.gridData = this.gridOriData.filter(x => x.newRow !== true);
            this.$nuxt.$emit('iccReset');
        },
        openAlert(title, message, visiable = true, width = '350px') {
            this.$refs.alertPop.title = title;
            this.$refs.alertPop.message = message;
            this.$refs.alertPop.visibleDialog = visiable;
            this.$refs.alertPop.modalWidth = width;
        },
        sortChangeHandler(e) {
            this.gfn_sortChangeHandler(
                this.gridData,
                e,
                ['ROLEID']
            );
        },
    },
};

const defaultData = {};
</script>
<style lang="scss">
.textRight {
    text-align: right;
}

.textLeft {
    text-align: left;
}

.textCenter {
    text-align: center;
}
</style>
  