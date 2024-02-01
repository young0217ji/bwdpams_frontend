<template>
  <div>
    <k-dialog v-if="visibleDialog" :title="$i18n.t('MES_CommLang.MES_CommLang_00104')" height="'320px'" width="30%"
      @close="toggleDialog"> <!-- 비밀번호변경 -->
      <v-row align="center">
        <v-col :cols="12">
          <KInput v-model.trim="password" ref="password" type="password" :dataNm="'password'" :label="$i18n.t('MES_MsgLang.MES_MsgLang_00215')"
            @keypress.enter="focusNew()"
            :style="{ width: '100%' }" height="44"></KInput> <!-- 현재 비밀번호를 입력하세요 -->
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col :cols="12">
          <KInput v-model.trim="newpassword" ref="newpassword" type="password" :dataNm="'newpassword'" :style="{ width: '100%' }"
            @keypress.enter="focusChange()"
            :label="$i18n.t('MES_MsgLang.MES_MsgLang_00216')" height="44"></KInput> <!-- 변경할 비밀번호를 입력하세요 -->
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col :cols="12">
          <KInput v-model.trim="changepassword" ref="changepassword" type="password" :dataNm="'changepassword'"
            :label="$i18n.t('MES_MsgLang.MES_MsgLang_00217')" :style="{ width: '100%' }" height="44"></KInput>
          <!-- 변경할 비밀번호를 다시 입력하세요 -->
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="6"></v-col>
        <v-col :cols="6" align="right">
          <dialog-actions-bar>
            <kbutton :theme-color="'primary'" @click="saveBtn">{{ $t('MES_CommLang.MES_CommLang_00409') }}</kbutton>
            <!-- 확인 -->
            <kbutton @click="toggleDialog">{{ $t('MES_CommLang.MES_CommLang_00413') }}</kbutton> <!-- 닫기 -->
          </dialog-actions-bar>
        </v-col>
      </v-row>
    </k-dialog>
  </div>
</template>

<script>

import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from "@progress/kendo-vue-inputs";
import mixinGlobal from '@/mixin/global.js';



export default {
  mixins: [mixinGlobal],
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    'kbutton': Button,
    KInput: Input,
  },
  props: {
  },
  data: function () {
    return {
      visibleDialog: false,
      message: null,
      password: "",
      newpassword: "",
      changepassword: "",
    };
  },
  computed: {
    userInfo: (state) => state.$store.$auth.$state.user,
  },
  watch: {
  },
  mounted() {
   },
  methods: {
    toggleDialog() {
      this.visibleDialog = !this.visibleDialog;
    },
    focusNew() {
      this.$refs.newpassword.focus();
    },
    focusChange() {
      this.$refs.changepassword.focus();
    },
    async saveBtn() {

      if (this.password == this.newpassword) {
        alert(this.$i18n.t('MES_MsgLang.MES_MsgLang_00218')); /* ('동일한 비밀번호로 변경은 불가능합니다. 다시 확인 후 입력하세요.') */
        this.focusNew();
        return;
      }

      if (this.newpassword != this.changepassword) {
        alert(this.$i18n.t('MES_MsgLang.MES_MsgLang_00218')); /* ('변경할 비밀번호와 재입력된 값이 일치하지 않습니다. 다시 확인 후 입력하세요.') */
        this.focusNew();
        return;
      }

      const res = await this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnChangePassWord',
        params2: { 
          PLANTID: this.$auth.$state.user.plantId, 
          USERID: this.userInfo.userId, 
          USERPASSWORD: this.password, 
          CHANGEPASSWORD: this.changepassword,
        },
      });

      if (res?.returncode == '0') {
        alert(this.$i18n.t('MES_MsgLang.MES_MsgLang_00140')); /* ('저장되었습니다.') */

        this.toggleDialog();
      };
    },
  }
}
</script>
<style lang="scss">
  .search-box {
    width: 100%;
  }
</style>