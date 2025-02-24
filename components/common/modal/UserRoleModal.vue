<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="$i18n.t('MES_CommLang.MES_CommLang_00526')"
      width="40%"
      height="600"
      @close="toggleDialog"
    >
      <v-row ref="searchFilter" no-gutters>
        <v-col :sm="9" :lg="9">
          <div class="form-group-wrap">
            <div class="form-group">
              <Label>
                {{ $t('MES_CommLang.MES_CommLang_00132') }}
              </Label>
              <InputText
                ref="selectUserId"
                :searchOption="true"
                :dataNm="'searchUserId'"
                :boxWidth="'90%'"
                :readonly="isReadOnly"
              />
            </div>
            <div class="form-group">
              <Label>
                {{ $t('MES_CommLang.MES_CommLang_00134') }}
              </Label>
              <InputText
                ref="selectUserName"
                :searchOption="true"
                :dataNm="'searchUserNm'"
                :boxWidth="'90%'"
                :readonly="isReadOnly"
              />
            </div>
          </div>
        </v-col>
        <v-col :sm="4" :lg="3" align="right">
          <kbutton
            :theme-color="'primary'"
            icon="check"
            @click="[selectRow(), sendUserRole()]"
            >{{ $t('MES_CommLang.MES_CommLang_00414') }}</kbutton
          >
        </v-col>
      </v-row>

      <v-row ref="contents">
        <v-col :cols="12" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper" :style="{ height: '100%' }">
                <KendoGrid
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="headerParam.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :checkHeaderArr="headerParam.checkBox"
                  :isPaging="true"
                  :reSetPage="this.reSetPage"
                  @gridrowclick="onRowClick"
                  @sortChangeHandler="sortChangeHandler"
                  @selectionchange="onSelectionchange"
                  @headerselectionchange="onHeaderSelectionChange"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';

export default {
  name: 'UserRoleModal',
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    kbutton: Button,
    KendoGrid,
    InputText,
    FadeLoader,
    kbutton: Button,
    Card,
    CardBody,
    CardTitle,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true,
    },
    userData: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridHeight: '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvSFRoleList', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noRowstat: true,
        enumComboBox: [],
        checkBox: [],
      },
      selectedID: null,
      selectedRole: [],
      productid: '',
      productName: '',
      isLoading: true,
      reSetPage: false,
      searchUserId: '',
      searchUserNm: '',
    };
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
  },
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getGridData();
    await this.setUserInfo();
  },
  methods: {
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    setUserInfo() {
      console.log('this.userData', this.userData);
      this.$refs['selectUserId'].textVal = this.userData.userId;
      this.$refs['selectUserName'].textVal = this.userData.userName;
      this.isReadOnly = !this.isReadOnly;
    },
    async searchBtn() {
      this.reSetPage = true;
      await this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSFRoleList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          useFlag: 'Yes',
        },
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
        this.$nuxt.$emit('iccReset');
        // if (data !== undefined && data.length > 0) {
        //   data[0][this.selectedField] = true;
        // }
        console.log(data);
        let arrayRoleList = this.userData.roleId.split(',');
        for (let i = 0; i < arrayRoleList.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].ROLEID == arrayRoleList[i]) {
              data[j][this.selectedField] = true;
            }
          }
        }

        this.gridData = data;
        this.isLoading = false;
      });
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData = this.gridData.map(item => {
        return {
          ...item,
          selected: item.idx === selectedIdx ? !item.selected : item.selected,
        };
      });
      this.selected = event.dataItem;
    },
    // 체크된 권한 가져오기
    sendUserRole() {
      this.$emit('checkedUserRole', this.selectedRole);
    },
    //row 선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      this.$emit('modelingInfo', returnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
      this.selectedRole = returnData;
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
    searchInput(nm, val) {
      this[nm] = val;
    },
    sortChangeHandler(e) {
      const isAscending = e.sort[0]?.dir == 'asc';
      if (isAscending) {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] < b[e.event?.field]
            ? -1
            : a[e.event?.field] > b[e.event?.field]
              ? 1
              : 0
        );
      } else {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] > b[e.event?.field]
            ? -1
            : a[e.event?.field] < b[e.event?.field]
              ? 1
              : 0
        );
      }
    },
  },
};
</script>
