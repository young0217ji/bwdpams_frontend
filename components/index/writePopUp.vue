<template>
  <div>
    <Dialog
      v-if="visibleDialog"
      :title="$t('MES_CommLang.MES_CommLang_00916')"
      width="55%"
      height="410"
      @close="closePopUp"
    >
      <v-row ref="contents">
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
                        :readonly="true"
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
                        :readonly="true"
                        :style="{ width: '800px', height: '200px' }"
                        :auto-size="false"
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
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import mixinGlobal from '@/mixin/global.js';
import InputText from '@/components/common/input/InputText';
import { TextArea } from '@progress/kendo-vue-inputs';

export default {
  name: 'FrmNtc',
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    InputText,
    TextArea,
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
    initData: {},
  },
  data() {
    return {
      isReadOnly: true,
      saveData: [],
      rowData: [],
      textAreaData: '',
      searchCount: '',
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
  },
  methods: {
    closePopUp() {
      this.$emit('visibleDialog', !this.visibleDialog);
      this.saveOnlySearchCount();
    },

    saveOnlySearchCount() {
      this.saveData = [];
      this.saveData.push(this.initData);
      this.saveData = this.saveData.map(x => {
        return {
          ...x,
          SEARCHCOUNT: this.$refs['searchCount'].textVal,
        };
      });
      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnNotice',
        sendParam: this.saveData,
      }).then(result => {
        this.$nextTick(() => {
          if (result.returncode != undefined && result.returncode == '0') {
            this.callBack(true);
            this.$emit('visibleDialog', !this.visibleDialog);
          } else {
            this.$refs.alertPop.show('ERROR : ' + result.code, result.message);
          }
        });
      });
    },
  },
};
</script>
<style lang="scss">
.search-box {
  width: 100%;
}
</style>
