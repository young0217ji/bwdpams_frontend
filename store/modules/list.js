
import Utility from "~/plugins/utility";

const DOMAIN = "/api/";

export const state = () => Object.assign({}, INIT_URL_STATE);

export const mutations = {
}
export const actions = {
  async postApi({ state, commit }, payload) {
    const headers = {
      headers: {
        "X-Fems-MenuId":
          this.state.activeMenuInfo.menuId == undefined
            ? "0"
            : this.state.activeMenuInfo.menuId,
      },
    };
    const apiUrl = state[payload.apiKey];
    const params = { params: payload.sendParam || {} };
    const res = await this.$axios.post(DOMAIN + apiUrl, params, headers);
    commit(
      "setPageData",
      {
        [payload.dataKey]: payload.resKey
          ? res.data.dataset[payload.resKey]
          : res.data.dataset,
      },
      { root: true }
    );
  },

  async postApiReturn({ state }, payload) {
    const headers = {
      headers: {
        "X-Fems-MenuId":
          this.state.activeMenuInfo.menuId == undefined
            ? "0"
            : this.state.activeMenuInfo.menuId,
      },
    };
    const apiUrl = state[payload.apiKey];
    const params = { params: payload.sendParam || {} };
    const res = await this.$axios.post(DOMAIN + apiUrl, params, headers);
    if (Array.isArray(payload.resKey)) {
      const result = {};
      for (const item of payload.resKey) {
        result[item] = res.data.dataset[item];
      }
      return result;
    }
    return payload.resKey ? res.data.dataset[payload.resKey] : res.data.dataset;
  },

  async postUpdateApi({ state }, payload) {
    const headers = {
      headers: {
        "X-Fems-MenuId":
          this.state.activeMenuInfo.menuId == undefined
            ? "0"
            : this.state.activeMenuInfo.menuId,
      },
    };
    const apiUrl = state[payload.apiKey];
    const params = payload.sendParam;
    const res = await this.$axios.post(DOMAIN + apiUrl, params, headers);
    return res;
  },

  getDomain() {
    return DOMAIN;
  },

  setTree({ commit }, payload) {
    const res = payload.value;
    const treeKey = payload.treeKey;
    let tmpLsit = [];
    if (res.length > 0) {
      tmpLsit = res
        .map((item) => ({
          ...item,
          expanded: true,
          name: item[Utility.toCamelCase(treeKey + "_nm")],
          _attributes: {
            expanded: true,
          },
          _children: [],
        }))
        .reduce(
          (acc, it) => ({
            ...acc,
            [it[Utility.toCamelCase("up_" + treeKey)]]: acc[
              it[Utility.toCamelCase("up_" + treeKey)]
            ]
              ? [...acc[it[Utility.toCamelCase("up_" + treeKey)]], it]
              : [it],
          }),
          {}
        );
      Object.getOwnPropertyNames(tmpLsit)
        .reverse()
        .forEach(function (val, idx, array) {
          array.map((obj) => {
            tmpLsit[obj].filter((v) => {
              if (val === v[Utility.toCamelCase(treeKey)]) {
                v._children = tmpLsit[val];
              }
              if (val === obj && v._children.length === 0) {
                delete v._children;
              }
            });
          });
        });
    }
    return tmpLsit;
  },

  async getListReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = payload.sendParam;
    const res = await this.$axios.get(DOMAIN + apiUrl, { params });
    return res.data;
  },

  async postInsertReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = payload.sendParam;
    const res = await this.$axios.post(DOMAIN + apiUrl, params);
    return res.data;
  },

  async putUpdateReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = payload.sendParam;
    const res = await this.$axios.put(DOMAIN + apiUrl, params);
    return res.data;
  },

  async deleteDeleteReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = { data: payload.sendParam };
    const res = await this.$axios.delete(DOMAIN + apiUrl, params, {
      withCredentials: true,
    });
    return res.data;
  },

  async mesGet({ state }, payload) {
    const apiUrl = payload.apiKey;
    const param = getParamForBindV(
      payload.queryId,
      payload.sendParam,
      payload.queryVersion,
      this.state.auth.user
    );
    const res = await this.$axios.get(DOMAIN + apiUrl, { params: param });
    if (res.data.status === 400) {
      return [];
    }
    else if (res.data.returncode != "0") {
      // 에러 메세지 출력 부분
      let sErrorMessage = "ErrorCode : " + res.data.returncode + " \r\n" +
        "ErrorMessage : " + res.data.returnmessage + " \r\n";

      if (res.data.returndetailmessage != null && res.data.returndetailmessage != "") {
        sErrorMessage = sErrorMessage + "ErrorDetailMessage : " + res.data.returndetailmessage;
      }

      alert(sErrorMessage);

      return [];
    }
    else if (!res.data.body) {
      // 데이터가 null일 경우
      return [];
    }
    else {
      return res.data.body;
    }
    // try {
    //   const res = await this.$axios.get(DOMAIN + apiUrl, {params: param} );
    //   return res.data;
    // } catch (error) {
    //   return [];
    // }
  },

  async mesPost({ state }, payload) {
    const apiUrl = payload.apiKey;
    if (payload.sendParam != null) {
      payload.sendParam.map(x => { delete x['customCell'] });
    }
    const params = postParam(
      payload.messagename,
      payload.sendParam,
      payload.params2,
      this.state.auth.user
    );
    const res = await this.$axios.post(DOMAIN + apiUrl, params);
    // [2023.07.27-구자윤] MES Reply Message의 오류 Return 사용자 알림 적용
    if (res.data.returncode != "0") {

      if (res.data.code != null && res.data.code != undefined && res.data.code != '') {
        return res.data;
      }
      else {
        // 에러 메세지 출력 부분
        let sErrorMessage = "ErrorCode : " + res.data.returncode + " \r\n" +
          "ErrorMessage : " + res.data.returnmessage + " \r\n";

        if (res.data.returndetailmessage != null && res.data.returndetailmessage != "") {
          sErrorMessage = sErrorMessage + "ErrorDetailMessage : " + res.data.returndetailmessage;
        }

        alert(sErrorMessage);
      }
    }
    else {
      return res.data;
    }
  },

  async excelGet({ state }, payload) {
    const apiUrl = payload.apiKey;
    const param = getParamForBindV(
      payload.queryId,
      payload.sendParam,
      payload.queryVersion,
      this.state.auth.user
      );

    const { data, headers } = await this.$axios.get(DOMAIN + apiUrl, { params: param, responseType: "blob" });

    const blob = new Blob([data], {
      type: headers['content-type'],
    })
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    // file name 불러오기
    const filename = headers['content-disposition']
      .split('filename=')[1]
      .split('.')[0]
    link.download = filename
    link.click()
    URL.revokeObjectURL(blobUrl);
  },
  
  async mesFileUpload({ state }, fileList){
    if(fileList.length==0){
      return true; 
    }
    const url = "/mes/common/fileupload"
    const formData = new FormData();
    fileList.map( (x, idx) => {
      formData.append("fileList["+idx+"].file", x.file);
      formData.append("fileList["+idx+"].fileName", x.fileName);
      formData.append("fileList["+idx+"].fileLocation", x.fileLocation);
    });
    
    const res = await this.$axios.post("/api/" + url, formData,{
      headers: {'Content-Type' : 'multipart/form-data'}
    });
    
    if (res.data.returncode != "0") {
      return false;
    }

    return true;
  }
  
};

const getParamForBindV = (QUERYID, param, queryVersion = "00001", user) => {
  return {
    language: "ko",
    queryid: QUERYID,
    factoryid: user.factoryId,
    eventuser: user.userId,
    queryversion: queryVersion,
    loadingDisabled: param.loadingDisabled,
    bindv: param,
  };
};

const postParam = (messagename, param, params2 = {}, user) => {
  return {
    PLANTID: user.plantId,
    EVENTUSER: user.userId,
    DATALIST: {
      MESSAGENAME: messagename,
      PLANTID: user.plantId,
      EVENTUSER: user.userId,
      DATAINFO: param,
      id: "DATASET",
    },
    MESSAGENAME: messagename,
    ...params2,
    paramv: params2,
  };
};

const INIT_URL_STATE = {
};
