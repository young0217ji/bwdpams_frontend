require('dotenv').config()

module.exports = {
  ssr: false,
  head: {
    titleTemplate: "%s",
    title: "MES",
    htmlAttrs: {
      lang: "ko"
    },
    meta: [
      {charset: "utf-8"},
      {name: "viewport", content: "width=device-width, initial-scale=1"},
      {hid: "description", name: "description", content: ""}
    ],
    link: [
      {rel: "icon", type: "image/x-icon", href: "/favicon.ico"}
    ],
    script:[
      {type: "text/javascript", src:'/jquery-1.12.3.min.js'},
      {type: "text/javascript", src:'/kendo.all.min.js'}
    ]
  },  
  env: {
    ENV: process.env.ENV,
    BASE_URL: process.env.BASE_URL,
    UBIFORM_URL: process.env.UBIFORM_URL
  },
  css: [
    "~assets/css/SpoqaHanSansNeo.css",
  ],

  plugins: [
    "~/plugins/axios",
    "~/plugins/jqxGrid",
    "~/plugins/routerTab",
    "~/plugins/session",
    "~/plugins/eChart",
  ],
  router: {
    middleware: ["middleRouter", "auth"],
    extendRoutes(routes, resolve) {
      routes.push({
        name: "iframe",
        path: "/iframe/:src/:title?/:icon?",
        component: resolve(__dirname, "pages/-Iframe.js"),
        props: true
      });
    },
  },

  components: true,

  buildModules: [
    "@nuxtjs/vuetify",
    "@nuxt/postcss8",
  ],

  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/dayjs",
    "@nuxtjs/style-resources",
    "@nuxtjs/i18n",
    "@nuxtjs/auth-next"
  ],

  auth: {
    watchLoggedIn:true,
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    },
    fullPathRedirect : true,
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'accessToken',
          maxAge: 1800, // 초단위, 토큰만료시간이 없을 경우 사용할 만료시간. 토큰에 있는 만료시간이 우선적용됨.
          required: true,

        },
        refreshToken: {
          property: 'refreshToken',
          data: 'refreshToken',
          required: true,
          tokenRequired: true
        },
        user: {
          property: false,
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/common/auth/signin', method: 'post' },
          refresh: { url: '/api/common/auth/refresh', method: 'post'},
          user: { url: '/api/common/user/myinfo', method: 'get' },
          logout: { url: '/api/common/auth/signout', method: 'get' },
        },
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", {targets: "defaults"}]],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        }
      }
    ]
  },

  styleResources: {
    scss: ["~assets/scss/common.scss", "./assets/scss/*.scss"]
  },
  proxy: {
    '/api/': {
      target: process.env.BASE_URL,
      changeOrigin: true
    },
  },
  axios: {
    proxy: true,
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true
    },
    headers: {
      common: {
        "X-Requested-With": "XMLHttpRequest"
      }
    }
  },

  dayjs: {
    locales: ["ko", "en"],
    defaultLocale: "ko",
    defaultTimeZone: "Asia/Seoul",
    plugins: [
      "utc",
      "timezone"
    ]
  },

  i18n: {
    locales: [
      { code: 'ko', name: 'Korean', iso: 'ko-KR', file: 'ko/ko.js' },
      { code: 'en', name: 'English', iso: 'en-US', file: 'en/en.js' },
    ],
    defaultLocale: 'ko',
    langDir: 'locales/',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'ko',
    },
    lazy: false,
    vueI18nLoader: true,
    vuex: false,
  },

  vuetify: {
    lang: {
      locales: ["ko", "en"],
      current: "ko"
    },
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    optionsPath: "~/plugins/vuetify.js"
  },

  build: {
    babel: {
      compact: true,
     },
    transpile: [/echarts/, /zrender/, /vue-router-tab/],
    styleResources: {
      scss: "./assets/scss/**/*.scss"
    },
    publicPath: '/_nuxt/'
  },
  server: {
    host: "0.0.0.0"
  }
};
