<template>
  <div>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="1000px"
      height="800px"
      @close="toggleDialog"
    >
      <v-row :style="{ height: '90%' }">
        <v-col :cols="5" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ height: '100%' }">
              <div ref="divWrapper" :style="{ height: '100%' }">
                <KendoTree
                  :treeData="treeData"
                  :textField="LOCALECOLUMN"
                  :activeItem="treeActiveItem"
                  @onExpandChange="onExpandChange"
                  @onItemClick="onItemClick"
                >
                </KendoTree>
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :cols="2" align="center">
          <div class="between-opt-align" :style="{ height: '100%' }">
            <div>
              <Button
                :theme-color="'secondary'"
                :icon="'arrow-chevron-right'"
                @click="addBtn"
                >{{ $t('MES_CommLang.MES_CommLang_00522') }}</Button
              >
              <!-- 등록 -->
            </div>
            <div>
              <Button
                :theme-color="'secondary'"
                :icon="'arrow-chevron-left'"
                @click="delBtn"
                >{{ $t('MES_CommLang.MES_CommLang_00412') }}</Button
              >
              <!-- 삭제 -->
            </div>
          </div>
        </v-col>

        <v-col :cols="5">
          <div ref="divWrapper2" style="height: 90%">
            <KendoGrid
              ref="rowGrid"
              :gridHeight="gridHeight"
              :gridItems="gridData"
              :sortable="true"
              :columns="gridHeader"
              :resizable="false"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              @gridrowclick="onRowClick"
            />
          </div>
          <v-row>
            <v-col :cols="12" align="center">
              <Button
                :theme-color="'secondary'"
                :style="{ width: '48%', height: '100%' }"
                @click="upBtn"
                >▲</Button
              >
              <!-- 저장 -->
              <Button
                :theme-color="'secondary'"
                :style="{ width: '48%', height: '100%' }"
                @click="downBtn"
                >▼</Button
              >
              <!-- 닫기 -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12" align="right">
          <Button :theme-color="'primary'" @click="saveBtn">{{
            $t('MES_CommLang.MES_CommLang_00414')
          }}</Button>
          <!-- 저장 -->
          <Button :theme-color="'secondary'" @click="toggleDialog">{{
            $t('MES_CommLang.MES_CommLang_00413')
          }}</Button>
          <!-- 닫기 -->
        </v-col>
      </v-row>
    </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import utils from '~/plugins/utils';

let tmpI18n =
  localStorage.getItem('i18nVal') != null
    ? JSON.parse(localStorage.getItem('i18nVal'))
    : { text: 'Kor', id: 'ko', iso: 'ko-KR' };
let locale = tmpI18n.id == 'en' ? 'MENUNAME_EN' : 'MENUNAME';

export default {
  name: 'PlanningPopUp',
  mixins: [mixinGlobal],
  components: {
    Card,
    CardBody,
    CardTitle,
    Dialog,
    DialogActionsBar,
    Button,
    FadeLoader,
    DatePicker,
    KendoTree,
    KendoGrid,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Planning',
    },
  },
  data() {
    return {
      treeData: [],
      LOCALECOLUMN: locale,
      treeActiveItem: {},
      gridHeader: [{ field: 'menuName', title: '메뉴', width: 387 }],
      gridHeight: '100px',
      selectedField: 'selected',
      gridData: [],
      gridOriData: [],
    };
  },
  computed: {},
  async mounted() {
    await this.initTree();
    await this.getGridData();
  },
  methods: {
    // 트리 데이터 가져오기
    async initTree() {
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSFMenuList',
        sendParam: {
          parentsID: '',
          plantid: this.$auth.$state.user.plantId,
        },
      });
      const data = res.map(x => ({ ...x, expanded: true }));

      this.treeData = utils.makeTreeDataForMenu(data);
    },
    async getGridData() {
      const res = await this.getListReturn({
        apiKey: 'common/userMenu/list',
        sendParam: {
          plantId: this.$auth.$state.user.plantId,
          userId: this.$auth.$state.user.userId,
        },
      });
      this.gridOriData = res;
      this.gridData = res.map((x, idx) => {
        return {
          ...x,
          idx: idx,
          selected: false,
        };
      });
    },

    // 팝업 닫기
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },

    // 트리 클릭
    onItemClick(event) {
      this.treeActiveItem = event.item;
    },
    // 트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    // 등록 버튼
    addBtn() {
      const idxList = this.gridData.map(x => {
        return x.idx;
      });
      const nextIdx =
        this.gridData.length > 0 ? Math.max.apply(null, idxList) + 1 : 1;
      if (
        !this.isNullOrEmpty(this.treeActiveItem.URL) &&
        this.gridData.filter(x => x.menuId == this.treeActiveItem.MENUID)
          .length < 1
      ) {
        this.gridData.push({
          menuName: this.treeActiveItem.MENUNAME,
          menuId: this.treeActiveItem.MENUID,
          idx: nextIdx,
          selected: false,
        });
      } else if (
        this.gridData.filter(x => x.menuId == this.treeActiveItem.MENUID)
          .length > 0
      ) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00287')
        ); // 알림, 이미 등록된 메뉴입니다.
      } else if (!this.isNullOrEmpty(this.treeActiveItem.URL)) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00286')
        ); // 알림, 등록할 수 없는 메뉴입니다.
      }
    },
    // 삭제 버튼
    delBtn() {
      let selectedIdx = -1;
      this.gridData.map((x, idx) => {
        if (x.selected) {
          selectedIdx = idx;
        }
      });
      if (selectedIdx != -1) {
        this.gridData.splice(selectedIdx, 1);
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00295')
        ); // 알림, 삭제할 메뉴를 선택해주세요.
      }
    },
    // 즐겨찾기 메뉴 클릭
    onRowClick(event) {
      this.gridData.map(x => {
        x.selected = x.idx == event.dataItem.idx;
      });
    },
    // 순서 올리기
    upBtn() {
      let selectedIdx = '';
      this.gridData.map((x, idx) => {
        if (x.selected) {
          selectedIdx = idx;
        }
      });
      if (selectedIdx == 0 || this.isNullOrEmpty(selectedIdx)) {
        return;
      }
      const selectRow = JSON.parse(JSON.stringify(this.gridData[selectedIdx]));
      this.gridData.splice(selectedIdx, 1);
      this.gridData.splice(selectedIdx - 1, 0, selectRow);
    },
    // 순서 내리기
    downBtn() {
      let selectedIdx = '';
      this.gridData.map((x, idx) => {
        if (x.selected) {
          selectedIdx = idx;
        }
      });
      if (
        selectedIdx == this.gridData.length ||
        this.isNullOrEmpty(selectedIdx)
      ) {
        return;
      }
      const selectRow = JSON.parse(JSON.stringify(this.gridData[selectedIdx]));
      this.gridData.splice(selectedIdx, 1);
      this.gridData.splice(selectedIdx + 1, 0, selectRow);
    },
    async saveBtn() {
      const plantId = this.$auth.$state.user.plantId;
      const userId = this.$auth.$state.user.userId;
      const sendParam = [];
      const saveData = this.gridData.map((x, idx) => {
        return { ...x, menuSequence: idx + 1 };
      });
      saveData.map(x => {
        this.gridOriData.map(y => {
          if (x.menuId == y.menuId && x.menuSequence != y.menuSequence) {
            sendParam.push({
              ...x,
              plantId: plantId,
              userId: userId,
              flag: 'U',
            });
          }
        });
        if (this.gridOriData.filter(y => x.menuId == y.menuId).length < 1) {
          sendParam.push({ ...x, plantId: plantId, userId: userId, flag: 'C' });
        }
      });
      this.gridOriData.map(x => {
        if (saveData.filter(y => x.menuId == y.menuId).length < 1) {
          sendParam.push({ ...x, plantId: plantId, userId: userId, flag: 'D' });
        }
      });
      if (sendParam.length > 0) {
        await this.postInsertReturn({
          apiKey: 'common/userMenu/update',
          sendParam: sendParam,
        }).then(res => {
          if (sendParam.length == res) {
            this.$refs.alertPop.show(
              this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
              this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
            ); /* 알림, 저장되었습니다. */
            this.getGridData();
          } else {
          }
        });
      } else {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00143')
        ); /* 알림, 저장할 데이터가 없습니다.*/
      }
    },
  },
};
</script>
