<template>
    <div>
      <span v-if="!visibleDialog">
        <Button @click="toggleDialog">Open Dialog</Button>
      </span>
      <Dialog
      v-if="visibleDialog"
          :title="$i18n.t('MES_CommLang.MES_CommLang_00410')"
          width="30%"
          height="360"
          @close="toggleDialog"
      >
      <v-row ref="searchFilter" no-gutters>
          <v-col :sm="9" :lg="9" align="left">
            <div class="form-group-wrap" >
                <div class="form-group" >
                <Label style="text-align: left;">
                  {{ $t("MES_CommLang.MES_CommLang_00651") }} <!-- BM요청번호 -->
              </Label>
              <InputText style="margin-left: -15px;"
                ref="requestid"
                :searchOption="true"
                :dataNm="'requestid'"
                :default-value="requestid"
                :boxWidth="'90%'"
                :readonly="true"
              />
            </div>
            <div class="form-group" >
                <Label style="text-align: left;">
                  {{ $t("MES_CommLang.MES_CommLang_00233") }} <!-- 작업자 -->
              </Label>
              <InputText style="margin-left: -15px;"
                ref="workeruserid"
                :searchOption="true"
                :dataNm="'workeruserid'"
                :default-value="workeruserid"
                :boxWidth="'90%'"
                :readonly="true"
              />
            </div>
            </div>
            <div class="form-group-wrap">
            <div class="form-group">
                <Label style="text-align: left;">
                  {{ $t("MES_CommLang.MES_CommLang_00652") }} <!-- 취소내용 -->
              </Label>
              <div class="area-td" style="width: 350px; margin-left: -15px;">
                  <TextArea style="height: 100px;"
                    :auto-size="true"
                    :cols="12"
                    :readonly="requestCommentReadonly"
                    v-model="requestCmmentTextArea"
                  />
                </div>
                </div>
            </div>
            <div class="form-group-wrap">
            <div class="form-group">
                <Label style="text-align: left;">
                  {{ $t("MES_CommLang.MES_CommLang_00487") }} <!-- 비고 -->
              </Label>
              <div class="area-td" style="width: 350px; margin-left: -15px;">
                  <TextArea style="height: 40px;"
                    :auto-size="true"
                    :cols="12"
                    :readonly="descriptionReadOnly"
                    v-model="descriptionTextArea"
                  />
                </div>
                </div>
            </div>
          </v-col>
          <v-col :sm="4" :lg="3" align="right">
              <kbutton :theme-color="'primary'" icon="check"  @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</kbutton> <!-- 저장 -->
          </v-col>
        </v-row>
        
      </Dialog>
    </div>
  </template>
  <script>
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  import mixinGlobal from "@/mixin/global.js";
  //import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
  import InputText from "@/components/common/input/InputText";
  import { TextArea } from "@progress/kendo-vue-inputs";
  import FadeLoader from "vue-spinner/src/FadeLoader.vue";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  
  
  
  export default {
    name: "RequestCancelModal",
    mixins: [mixinGlobal],
    components: {
      Dialog,
      DialogActionsBar,
      kbutton: Button,
      InputText,
      FadeLoader,
      kbutton: Button,
      Card,
      CardBody,
      CardTitle,
      TextArea
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
      // userData : {
      //   type: String,
      //   required: true
      // },
      initData : {

      }
    },
    data() {
      return {
        selectedID: null,
        selectedRole: [],
        isLoading: true,
        reSetPage: false,
        requestid: '',
        workeruserid: '',
        reasoncode: '',
        reasoncodename: '',
        requestid: '',
        requestCommentReadonly: false,
        requestCmmentTextArea: '',
        descriptionReadOnly : false,
        descriptionTextArea : '',
        cancelData : {workerUserID : '', workcomment : '', description : ''}
      };
    },
    computed: {
        userInfo: (state) => state.$store.$auth.$state.user,
    },
    async mounted() {
      // await this.setUserInfo();
      await this.setData();
    },
    methods: {
      setData(){
        this.workeruserid = this.userInfo.userId;
        this.requestid = this.initData;
        console.log(this.workeruserid);
        console.log(this.requestid);
      },
      saveBtn(){
        this.cancelData.workerUserID = this.workeruserid;
        this.cancelData.workcomment = this.requestCmmentTextArea;
        this.cancelData.description = this.descriptionTextArea;
        this.$emit("reuqestCancelData", this.cancelData);
      },
      notPageReset(flag) {
        // flag : false
        this.reSetPage = flag;
      },

      toggleDialog() {
        this.$emit("visibleDialog", !this.visibleDialog);
      },
 
      searchInput(nm, val) {
        this[nm] = val;
      },
      sortChangeHandler(e) {
        const isAscending = e.sort[0]?.dir == "asc";
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