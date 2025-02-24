<template>
  <Dialog
    v-if="visibleDialog"
    :title="$i18n.t('MES_CommLang.MES_CommLang_00628')"
    @close="toggleDialog"
    height="380px"
    width="30%"
  >
    <v-row>
      <v-col :cols="12">
        <Input
          v-model.trim="password"
          type="password"
          :label="$i18n.t('MES_MsgLang.MES_MsgLang_00215')"
          :style="{ width: '100%' }"
          height="44"
        ></Input>
        <!-- 현재 비밀번호를 입력하세요 -->
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <Input
          v-model.trim="name"
          type="string"
          :style="{ width: '100%' }"
          :label="$i18n.t('UserRoleMngPage.label1')"
          height="44"
        ></Input>
        <!-- 사용자명 -->
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <Input
          v-model.trim="email"
          type="string"
          :label="$i18n.t('UserRoleMngPage.label6')"
          :style="{ width: '100%' }"
          height="44"
        ></Input>
        <!-- 이메일 -->
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <Input
          v-model.trim="phoneNumber"
          type="string"
          :label="$i18n.t('UserRoleMngPage.label7')"
          :style="{ width: '100%' }"
          height="44"
        ></Input>
        <!-- 전화번호 -->
      </v-col>
    </v-row>
    <v-row justify="end" justify-content="end">
      <v-col :cols="6">
        <Button :theme-color="'primary'" @click="saveBtn">
          {{ $t('MES_CommLang.MES_CommLang_00414') }}</Button
        >
        <Button :theme-color="'secondary'" @click="toggleDialog">
          {{ $t('MES_CommLang.MES_CommLang_00413') }}</Button
        >
      </v-col>
    </v-row>
  </Dialog>
</template>

<script>
import { mapState } from 'vuex';
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from '@progress/kendo-vue-inputs';
import mixinGlobal from '@/mixin/global.js';
import { validationDataIcon } from '@progress/kendo-svg-icons';
import { tableKeyboardNavigationHeaderAttributes } from '@progress/kendo-vue-data-tools';

export default {
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    Input,
  },
  props: {},
  data: function () {
    return {
      visibleDialog: false,
      message: null,
      password: '',
      name: '',
      email: '',
      phoneNumber: '',
    };
  },
  computed: {
    userInfo: state => state.$store.$auth.$state.user,
  },
  watch: {
    visibleDialog(val) {
      if (val) {
        this.initial();
      }
    },
  },
  mounted() {},
  created() {
    this.initial();
  },
  methods: {
    initial() {
      const {
        name: uname,
        email: uemail,
        phoneNumber: uphoneNumber,
      } = this.$auth.$state.user;
      this.name = uname;
      this.email = uemail;
      this.phoneNumber = uphoneNumber;
      this.password = '';
    },
    async toggleDialog() {
      this.visibleDialog = !this.visibleDialog;
    },
    async saveBtn() {
      if (!this.password) {
        alert(this.$i18n.t('MES_MsgLang.MES_MsgLang_00215'));
        return;
      }

      const res = await this.mesPost({
        apiKey: 'mes/common/manage',
        messagename:
          '(?1TransArea)(?2TransProdDefine)(?3TransProdGrpDefine)(?4TransWhouseDefinitio)(?5TransRO_Composition)(?6TransROC_Composition)(?7TransTPPolicy)(?8TransMdlingCofm)(?9TransAvailEqpt)(?10TransSubContUserMap)(?11TransRsnCd)(?12TransDispManagemen)(?13TransDispMngDtl)(?14TransEqptDefine)(?15TransWrkOrdMgmt)(?16TransPrtQtyUp)(?17TransSFUser)(?18TransDept)(?19TransSFMenu)(?20TransSFRole)(?21TransSFRoleMenuMap)(?22TransSFRoleUserMap)(?23TransEnumGrpDefine)(?24TransEnumDefine)(?25TransEnumValue)(?26TransGridDefine)(?27TransGridDtl)(?28TransCustQry)',
        sendParam: [
          {
            _ROWSTATUS: 'U',
            PLANTID: this.$auth.$state.user.plantId,
            USERID: this.userInfo.userId,
            USERNAME: this.name,
            CHECKPASSWORD: this.password,
            PHONE_NUMBER: this.phoneNumber,
            EMAIL: this.email,
          },
        ],
      });

      if (res?.returncode == '0') {
        await this.$emit('refreshUserInfo');
        alert(
          this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')
        ); /* ('저장되었습니다.') */
        this.toggleDialog();
      }
    },
  },
};
</script>
<style lang="scss">
.search-box {
  width: 100%;
}
</style>
