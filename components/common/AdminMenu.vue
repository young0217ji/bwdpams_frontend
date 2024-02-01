<template>
  <v-menu offset-y nudge-bottom="8" :left="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="btn-tf-admin"
        v-bind="attrs"
        v-on="on"
        depressed
        :ripple="false"
        :title="$t('MES_CommLang.MES_CommLang_00135')"
      > <!-- 사용자정보 -->
        <span class="admin-name">
          <span>{{ name }}</span>
          <i>{{ $t('MES_CommLang.MES_CommLang_00466') }}</i> <!-- 님 -->
        </span>
      </v-btn>
    </template>

    <v-list class="pa-2">
      <!--
      <v-list-item style="color:#fff; border-bottom: 2px solid #fff;">
        <div style="color:#fff;">
          <v-icon class="mr-1" size="20" style="color:#fff">mdi-account-outline</v-icon>
          <span class="body-2">{{name}}</span>
        </div>
      </v-list-item>
      -->
      <v-list-item>
        <v-btn @click="IPCDown" small elevation="0">
          <v-icon class="mr-1" size="20">mdi-lock-outline</v-icon>
          <span class="body-2">{{ $t("MES_CommLang.MES_CommLang_00653") }}</span> <!-- IPC 내려받기 -->
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn @click="pswdChange" small elevation="0">
          <v-icon class="mr-1" size="20">mdi-lock-outline</v-icon>
          <span class="body-2">{{ $t("MES_CommLang.MES_CommLang_00104") }}</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn @click="userInfoChange" small elevation="0">
          <v-icon class="mr-1" size="20">mdi-lock-outline</v-icon>
          <span class="body-2">{{ $t("MES_CommLang.MES_CommLang_00628") }}</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn @click="logout" small elevation="0">
          <v-icon class="mr-1" size="20">mdi-logout</v-icon>
          <span class="body-2">{{ $t("MES_CommLang.MES_CommLang_00101") }}</span>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { mapState } from "vuex";
import { Avatar } from "@progress/kendo-vue-layout";
import mixinGlobal from "@/mixin/global.js"
export default {
  mixins: [mixinGlobal],
  props: {
    miniVariant: Boolean,
    userNm: {
      type: String,
      require: true,
    },
    comId: {
      type: String,
      require: true,
    },
  },
  components: {
    avatar: Avatar,
  },
  data() {
    return {
      logoutUrl: "/login",
      item: {},
      name:
        this.$auth.$state.user == undefined
          ? this.$i18n.t('MES_CommLang.MES_CommLang_00531') /* 비로그인 */
          : this.$auth.$state.user.name,
    };
  },
  computed: {
    ...mapState(["isDarkMode"]),
    btnStyle() {
      return this.isDarkMode
        ? { color: "#fff", width: "auto" }
        : { color: "#111", width: "auto" };
    },
  },
  async mounted() {
  },
  methods: {
        async logout() {
      await this.$auth
        .logout()
        .then((result) => {
          this.$session.destroy();
          localStorage.clear();
          this.$nextTick(() => {
            this.$router.push({ path: "/login" });
          });
        })
        .catch((err) => {});
    },
    pswdChange() {
      this.$emit("open");
    },
    userInfoChange(){
      this.$emit("openChangeUserInfoPop");
    },
    async refreshUserInfo(){
      let res = await this.getListReturn({
        apiKey: "common/user/myinfo"
      });
      this.$auth.setUser(res);
      this.name = res.name;
    },
    IPCDown(){
      this.$emit("openIPCDownload");
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/var.scss";
@each $theme in dark, light {
  .v-application.#{$theme}-mode {
    .mdi-account {
      color: map-deep-get(
        $config,
        #{$theme},
        "tui-datepicker-calendar-color"
      ) !important;
    }

    .v-menu__content {
      z-index: 9 !important;
      border-radius: 0;
      box-shadow: none;

      .v-list {
        padding: 0 !important;
        border-width: 1px;
        border-style: solid;
        border-radius: 0;
        box-shadow: none;
        background-color: map-deep-get($config, #{$theme}, "bg-color-input");
        border-color: map-deep-get($config, #{$theme}, "bd-color-basic");

        .v-list-item {
          min-height: 100%;
          height: 31px;
          align-items: flex-start;
          border-top-width: 1px;
          border-top-style: solid;
          border-color: map-deep-get($config, #{$theme}, "bd-color-basic");

          &:first-of-type {
            border-top: 0;
          }

          .v-btn {
            padding: 0 9px !important;
            margin-bottom: 0;
            height: 100%;
            color: map-deep-get($config, #{$theme}, "ft-color-listbox");
            justify-content: flex-start;

            .v-icon {
              display: none;
            }

            &:hover {
              color: map-deep-get($config, #{$theme}, "ft-color-listbox-hover");
            }
          }
        }
      }
    }
  }
}

.v-btn {
  width: 100%;
  min-width: auto !important;
  display: flex;

  &,
  &:before {
    background-color: transparent !important;
  }

  :deep(.v-btn__content) {
    justify-content: flex-start;
  }

  &.miniVariant {
    :deep(.v-btn__content > .body-1, .v-btn__content > .mdi-chevron-down) {
      display: none;
    }
  }
}
</style>