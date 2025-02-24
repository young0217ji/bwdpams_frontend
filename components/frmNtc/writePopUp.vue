<template>
  <div>
    <Dialog
      v-if="visibleDialog"
      :title="$t('MES_CommLang.MES_CommLang_00916')"
      width="55%"
      height="500"
      @close="toggleDialog"
    >
      <v-row no-gutters style="margin-bottom: -7px">
        <v-col cols="6" align="left">
          <CardTitle
            :v-text="cardTitle"
            style="margin-bottom: -10px"
          ></CardTitle>
          <!-- 글작성 -->
        </v-col>
        <v-col cols="6" align="right">
          <Button
            :theme-color="'primary'"
            :size="'small'"
            :icon="'save'"
            @click="saveBtn"
            >{{ $t('MES_CommLang.MES_CommLang_00414') }}</Button
          >
          <!-- 저장 -->
        </v-col>
      </v-row>
      <v-row ref="searchFilter">
        <v-col :cols="12">
          <Card style="background-color: #f1f2f7">
            <CardBody style="padding: 20px">
              <v-row no-gutters>
                <v-col :cols="12">
                  <div class="form-group-wrap" style="margin-bottom: 5px">
                    <div class="form-group">
                      <label>
                        {{ $t('MES_CommLang.MES_CommLang_00920') }}
                      </label>
                      <!-- 제목 -->
                      <InputText
                        ref="title"
                        :dataNm="'title'"
                        :disabled="false"
                        :style="{ width: '400px' }"
                        :searchOption="true"
                      />
                    </div>
                  </div>
                  <div class="form-group-wrap" style="margin-bottom: 5px">
                    <div class="form-group">
                      <label>{{ $t('MES_CommLang.MES_CommLang_00921') }}</label>
                      <!-- 내용 -->
                      <TextArea
                        ref="contents"
                        :dataNm="'contents'"
                        :style="{ width: '800px', height: '200px' }"
                        :auto-size="false"
                        @input="textAreaChange"
                        v-model="textAreaData"
                      ></TextArea>
                    </div>
                  </div>
                  <div class="form-group-wrap" style="margin-bottom: 5px">
                    <div class="form-group">
                      <label>{{ $t('MES_CommLang.MES_CommLang_00922') }}</label>
                      <!-- 조회수 -->
                      <InputText
                        ref="searchCount"
                        :disabled="false"
                        :dataNm="'searchCount'"
                        :readonly="true"
                        :style="{ width: '50px' }"
                      ></InputText>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import mixinGlobal from '@/mixin/global.js';
import InputText from '@/components/common/input/InputText';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import AlertPop from '../common/modal/AlertPop.vue';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import Utility from '~/plugins/utility';
import { TextArea } from '@progress/kendo-vue-inputs';

export default {
  name: 'FrmNtc',
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    InputText,
    TextArea,
    Card,
    CardBody,
    MesSelectBox,
    CardTitle,
    KendoGrid,
    gridHeaderMinin,
    DropDownList,
    DatePicker,
    Utility,
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
    initData: {},
  },
  data() {
    return {
      isReadOnly: true,
      saveOriData: [],
      saveData: [],
      rowData: [],
      textAreaData: '',
      searchCount: '',
      cardTitle: this.$i18n.t('MES_CommLang.MES_CommLang_00917'),
    };
  },
  computed: {
    userInfo: state => state.$store.$auth.$state.user,
  },
  async mounted() {
    if (
      this.initData.SEARCHCOUNT == undefined ||
      this.initData.SEARCHCOUNT == null
    ) {
      this.$refs['searchCount'].textVal = '0';
    } else {
      this.$refs['searchCount'].textVal = this.initData.SEARCHCOUNT * 1 + 1;
    }
    this.$refs['title'].textVal = this.initData.TITLE;
    this.textAreaData = this.initData.CONTENTS;

    if (
      this.$refs['title'].textVal != null ||
      this.$refs['title'].textVal != undefined
    ) {
      this.cardTitle = '글수정';
    }
  },
  methods: {
    toggleDialog() {
      if (this.$refs['searchCount'].textVal != '0') {
        if (
          this.$refs['title'].textVal != this.initData.TITLE ||
          this.textAreaData != this.initData.CONTENTS
        ) {
          this.$refs['confirmPop'].title = 'info';
          this.$refs['confirmPop'].message = this.$i18n.t(
            'MES_MsgLang.MES_MsgLang_00141'
          );
          this.$refs['confirmPop'].callBack = this.closePopUp;

          this.$refs['confirmPop'].modalWidth = '300px';
          this.$refs['confirmPop'].visibleDialog = true;
        } else {
          this.closePopUp();
        }
      } else {
        this.$emit('visibleDialog', !this.visibleDialog);
      }
    },

    closePopUp() {
      this.saveOnlySearchCount();
    },

    saveOnlySearchCount() {
      this.saveData = [];
      this.saveData.push(this.initData);
      this.saveData = this.saveData.map(x => {
        return {
          ...x,
          SEARCHCOUNT: this.$refs['searchCount'].textVal,
          LASTUPDATEUSERID: this.saveData[0].LASTUPDATEUSERID,
          LASTUPDATETIME: this.saveData[0].LASTUPDATETIME,
        };
      });
      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TransNtc',
        sendParam: this.saveData,
      }).then(result => {
        this.$nextTick(() => {
          if (result.returncode != undefined && result.returncode == '0') {
            console.log(result.returncode == '0');
            this.$emit('returnCancel', true);
            this.$emit('visibleDialog', !this.visibleDialog);
          } else {
            this.$refs.alertPop.show('ERROR : ' + result.code, result.message);
          }
        });
      });
    },

    saveBtn() {
      console.log('id확인:', this.$auth.$state.user.userid);
      this.saveData = [];
      this.saveData.push(this.initData);
      this.saveData = this.saveData.map(x => {
        return {
          ...x,
          PLANTID: this.$auth.$state.user.plantId,
          NOTICEID: this.initData.NOTICEID,
          TITLE: this.$refs['title'].textVal,
          CONTENTS: this.textAreaData,
          TYPE: 'Notice', // 임시고정: 추후 수정예정
          SEARCHCOUNT: this.$refs['searchCount'].textVal,
          DISPLAYFLAG: 'Yes', // 임시고정: 추후 수정예정
          DESCRIPTION: this.initData.DESCRIPTION,
          CREATEUSERID: this.initData.CREATEUSERID,
          LASTUPDATETIME: Utility.setFormatDate(
            new Date(),
            'YYYY-MM-DD hh:mm:ss'
          ),
          LASTUPDATEUSERID: this.userInfo.userId,
        };
      });
      // 공백 Check
      if (
        this.saveData[0].TITLE.replace(/\s/g, '').length == 0 ||
        this.saveData[0].CONTENTS.replace(/\s/g, '').length == 0
      ) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00292')
        ); /* 알림, 제목 혹은 내용은 필수 입력입니다. */
        return;
      }

      if (
        this.saveData[0].TITLE == '' ||
        this.saveData[0].TITLE == undefined ||
        this.saveData[0].CONTENTS == '' ||
        this.saveData[0].CONTENTS == undefined
      ) {
        this.$refs.alertPop.show(
          this.$i18n.t('MES_CommLang.MES_CommLang_00456'),
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00292')
        ); /* 알림, 제목 혹은 내용은 필수 입력입니다. */
        return;
      }

      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TransNtc',
        sendParam: this.saveData,
      }).then(result => {
        this.$nextTick(() => {
          if (result.returncode != undefined && result.returncode == '0') {
            console.log(result.returncode == '0');
            console.log('saveData', this.saveData);
            this.$emit('returnSave', true);
            this.$emit('visibleDialog', !this.visibleDialog);
          } else {
            this.$refs.alertPop.show('ERROR : ' + result.code, result.message);
          }
        });
      });
    },

    toChange(e) {
      this.actionTime = Utility.setFormatDate(e.value, 'YYYY-MM-DD');
    },

    textAreaChange(e) {
      this.textAreaData = e.value;
    },
  },
};
</script>
<style lang="scss">
.search-box {
  width: 100%;
}
</style>
