<template>
  <form method="post" ref="form">
    <input v-for="(value, name) in params" :key="name" type="hidden" :name="name" :value="value">

  </form>
</template>

<script>

export default {
  name: "WindowPop",
  model: {

  },
  props: {
    formName: {
      type: String,
      require: false,
      default: () => {
        return "";
      }
    },
    width: {
      type: Number,
      require: false,
      default: () => {
        return 1000;
      }
    },
    height: {
      type: Number,
      require: false,
      default: () => {
        return 800;
      }
    },

  },
  watch: {
  },
  mounted() {

  },
  data() {
    return {
      windowRef: null,
      projectName: "MES",
      uri: process.env.UBIFORM_URL,
      datasetList: {},
      paramList: {},
      params: {},
    }
  },
  methods: {
    async show(datasetList, paramList) {

      if (this.windowRef != null) {
        this.hide();
      }

      this.datasetList = datasetList;
      this.paramList = paramList;

      const left = (screen.width) ? (screen.width - this.width) / 2 : 0;
      const top = (screen.height) ? (screen.height - this.height) / 2 : 0;
      console.log("show - datasetList", datasetList)
      const attr = 'top=' + top + ', left=' + left + ', width=' + this.width + 'px, height=' + this.height + 'px, toolbar=0,menubar=0,location=no,status=no';
      this.windowRef = window.open('', "windowRef", attr);
      this.$refs.form.action = this.uri;
      this.$refs.form.target = 'windowRef';
      await this.binding()
      this.$refs.form.submit();
    },

    hide() {

      if (this.windowRef) {
        this.windowRef.close();
        this.windowRef = null;
        this.datasetList = {};
        this.paramList = {};
      }
    },

    async binding() {
      let temp = {};

      console.log("binding - this.datasetList", this.datasetList)
      for (const key in this.datasetList) {
        temp[key] = encodeURIComponent(JSON.stringify(this.datasetList[key]));
      }
      console.log("binding - this.paramList", this.paramList)
      for (const key in this.paramList) {
        temp[key] = this.paramList[key];
      }
      this.params = {
        "projectName": this.projectName
        , "formName": this.formName
        , ...temp
      };

    },
  }
};
</script>
