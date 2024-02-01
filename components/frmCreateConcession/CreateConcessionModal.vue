<template>
  <div>
    <Dialog
      v-if="visibleDialog"
      title="특채 신청서"
      width="980px"
      height="820px"
      @close="toggleDialog"
    >
   <!------  특채 신청서 작성 ------------------------------------------>
    <v-row>
      <v-col :cols="12">
        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00756") }}</CardTitle> <!-- 특채 신청서 등록 -->
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters >
              <v-col :cols="5">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00788") }}</Label> <!-- 특채ID -->
                    <InputText
                      ref="concessionId"
                      :style="{ width: '200px' }"
                      :dataNm="'concessionId'"
                      :readonly="true"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00789") }}</Label> <!-- 접수자 -->
                    <InputText
                      ref="receiverUserName"
                      :style="{ width: '200px' }"
                      :dataNm="'receiverUserName'"
                      :readonly="true"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      @click="selectUserModal('receiver')">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00742") }}</label> <!-- 의뢰팀 -->
                    <DropDownList 
                      ref="cmbProGroup" 
                      :style="{ width: '200px' }" 
                      :data-items="deptGroup"
                      :text-field="'text'" 
                      :data-item-key="'id'" 
                      :value="deptGroupValue"
                      @change="selectDeptGroup">
                    </DropDownList>
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00743") }}</Label> <!-- 의뢰자 -->
                    <InputText
                      ref="requestUserName"
                      :style="{ width: '200px' }"
                      :dataNm="'requestUserName'"
                      :readonly="true"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      @click="selectUserModal('request')">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00545") }}</Label> <!-- 품번 -->
                    <InputText 
                      ref="productId" 
                      :style="{ width: '200px' }"
                      :dataNm="'productId'" 
                      :disabled="false" 
                      :readonly="true"
                      :searchOption="true"
                      @input-text-set="searchInput"
                      />
                    <Button 
                      :theme-color="'primary'" 
                      @click="SelectProductModalVisible = true">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</Label> <!-- 품명 -->
                    <InputText 
                      ref="productName" 
                      :style="{ width: '200px' }"
                      :dataNm="'productName'" 
                      :disabled="false" 
                      :readonly="true"
                      :searchOption="true"
                      @input-text-set="searchInput" 
                      />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00681") }}</label> <!-- Work Center  -->
                    <DropDownList
                      ref="cmbWorkCenter"
                      :style="{ width: '200px' }"
                      :data-items="workCenterList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="workCenterValue"
                      @change="workCenterChange"
                      >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00373") }}</label> <!-- 수량 -->
                    <InputText
                      ref="requestQuantity"
                      :style="{ width: '200px' }"
                      :dataNm="'requestQuantity'"
                      @input="insertInput"
                      :disabled="false"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00740") }}</label> <!-- 업체  -->
                    <DropDownList
                      ref="cmbCompanyGroup"
                      :style="{ width: '200px' }"
                      :data-items="companyList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value="companyValue"
                      @change="companyChange"
                      >
                    </DropDownList>
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00744") }}</label> <!-- 특채비용 -->
                    <InputText
                      ref="requestCost"
                      :style="{ width: '200px' }"
                      :dataNm="'requestCost'"
                      :disabled="false"
                      :searchOption="true"
                      @input="insertInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00745") }}</label> <!-- SAP재고현황 -->
                    <InputText
                      ref="sapStatus"
                      :style="{ width: '200px' }"
                      :dataNm="'sapStatus'"
                      :disabled="false"
                      :readonly="true"
                      :searchOption="true"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00746") }}</Label> <!-- 개선대책서  -->
                    <InputText
                      ref="improvementFileName" 
                      :dataNm="'improvementFileName'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :disabled="false"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" @click="fileUpload('improvementFile')"
                    >{{$t("MES_CommLang.MES_CommLang_00760")}}</Button> <!-- 첨부 -->
                    <Input 
                      v-model="improvementFile"
                      ref="improvementFile"
                      :type="'file'"
                      :style="{ display:'none' }"
                      @change="e => fileChange(e,'improvementFileName')"/>
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00747") }}</Label> <!-- 식별표부착  -->
                    <InputText
                      ref="identificationFileName" 
                      :dataNm="'identificationFileName'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :disabled="false"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" @click="fileUpload('identificationFile')"
                    >{{$t("MES_CommLang.MES_CommLang_00760")}}</Button> <!-- 첨부 -->
                    <Input 
                      v-model="identificationFile"
                      ref="identificationFile"
                      :type="'file'"
                      :style="{ display:'none' }"
                      @change="e => fileChange(e, 'identificationFileName')"/>
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00748") }}</Label> <!-- 기타1  -->
                    <InputText
                      ref="otherFile1Name" 
                      :dataNm="'otherFile1Name'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :disabled="false"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" @click="fileUpload('otherFile1')"
                    >{{$t("MES_CommLang.MES_CommLang_00760")}}</Button> <!-- 첨부 -->
                    <Input 
                      v-model="otherFile1"
                      ref="otherFile1"
                      :type="'file'"
                      :style="{ display:'none' }"
                      @change="e => fileChange(e, 'otherFile1Name')"/>
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00749") }}</Label> <!-- 기타2  -->
                    <InputText
                      ref="otherFile2Name" 
                      :dataNm="'otherFile2Name'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :disabled="false"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" @click="fileUpload('otherFile2')"
                    >{{$t("MES_CommLang.MES_CommLang_00760")}}</Button> <!-- 첨부 -->
                    <Input 
                      v-model="otherFile2"
                      ref="otherFile2"
                      :type="'file'"
                      :style="{ display:'none' }"
                      @change="e => fileChange(e, 'otherFile2Name')"/>
                  </div>    
                </div>
              </v-col>
              <v-col :cols="1"></v-col>
              <v-col :cols="6">
                <v-row class="search-box" align="center" no-gutters>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00751") }}</Label> <!-- 결함 원인 -->
                  <v-col :cols="12">
                      <TextArea ref="defectReason" :style="{ width: '100%', height: '153px', margin:'10px 0' }"
                          v-model="defectReason" ></TextArea>
                  </v-col>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00752") }}</Label> <!-- 특채 사유 -->
                  <v-col :cols="12">
                      <TextArea ref="concessionReason" :style="{ width: '100%', height: '153px', margin:'10px 0' }"
                          v-model="concessionReason" :dataNm="'concessionReason'"></TextArea>
                  </v-col>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00753") }}</Label> <!-- 개선 대책 -->
                  <v-col :cols="12">
                      <TextArea ref="improvementPlan" :style="{ width: '100%', height: '153px', margin:'10px 0'  }"
                          v-model="improvementPlan" :dataNm="'improvementPlan'"></TextArea>
                  </v-col>
                </v-row>
                <v-row no-gutters style="margin-bottom : 6px">
                  <v-col :cols="7" align="right">
                    <div class="form-group-wrap">
                      <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00750") }}</label> <!-- 중복특채ID -->
                      <Input
                        ref="verificationResult"
                        v-model="verificationResult"
                        :style="{ width: '155px' }"
                        :disabled="false" 
                        :readonly="true"
                        :class="'k-readonly'"
                      />   
                      </div> 
                    </div>
                  </v-col>
                  <v-col :cols="5" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="dupChkBtn" 
                    >{{ $t("MES_CommLang.MES_CommLang_00438") }}</Button> <!-- 중복확인 -->
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="insertBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00754") }}</Button> <!-- 신청 -->
                  </v-col>
                </v-row>
              </v-col>  
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    
    <GetUserModal
      ref="UserModal"
      v-if="UserModalVisible"
      :visibleDialog="UserModalVisible"
      @visibleDialog="(val) => UserModalVisible = val"
      @selectUser="selectUser"
    />
    <SelectProductModal
      ref="SelectProductModal"
      v-if="SelectProductModalVisible"
      :visibleDialog="SelectProductModalVisible"
      :title="$i18n.t('MES_CommLang.MES_CommLang_00262')"
      @visibleDialog="val => (SelectProductModalVisible = val)"
      @selectedRow="selectedRow"
    />
    <DupChkConcessionModal
      ref="dupChkModal"
      v-if="dupChkModalVisible"
      :visibleDialog="dupChkModalVisible"
      :productId="productId"
      :productName="productName"
      @visibleDialog="(val) => dupChkModalVisible = val"
      @selectedDupChkRow="selectedDupChkRow"
    />
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    </Dialog>
  </div>
</template>

<script>
import Utility from '~/plugins/utility';
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import AlertPop from "@/components/common/modal/AlertPop";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import { TextArea, Input } from '@progress/kendo-vue-inputs';
import GetUserModal from "@/components/common/modal/GetUserModal.vue";
import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';
import DupChkConcessionModal from '@/components/frmCreateConcession/DupChkConcessionModal.vue';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';

export default { 
  mixins: [mixinGlobal],
  components: {
    Utility,
    Dialog,
    Card,
    CardBody,
    CardTitle,
    AlertPop,
    DialogActionsBar,
    Button,
    InputText,
    MesSelectBox,
    MesVariableSelectBox,
    TextArea,
    Input,
    DropDownList,
    GetUserModal,  // 사용자 팝업
    SelectProductModal,  // 품번 팝업
    DupChkConcessionModal, // 중복체크 팝업
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    },
  },
  data() {
    return {
      loginInfo: "",
      plantID: this.$auth.$state.user.plantId,
      deptGroup: [],
      deptGroupValue: '',
      workCenterList: [],
      workCenterValue: '',
      companyList: [],
      companyValue: '',
      UserModalVisible: false, // 의뢰자 팝업
      SelectProductModalVisible: false, // 품번 팝업
      dupChkModalVisible: false, // 중복체크 팝업
      selectedField: "selected",
      selectedUserInput: '',
      // ====== 신청서 작성 데이터 =======
      concessionId: '',
      receiverUserId: '',
      receiverUserName: '',
      requestUserId: '',
      requestUserName: '',
      productId: '',
      productName: '',
      requestQuantity: '',
      requestCost: '',
      sapStatus: '',
      defectReason: '',
      concessionReason: '',
      improvementPlan: '', 
      improvementFile: '',  // 개선대책서 파일첨부
      improvementFileName: '', 
      identificationFile: '', // 식별표부착 파일첨부
      identificationFileName: '',
      otherFile1: '', // 기타1 파일첨부
      otherFile1Name: '',
      otherFile2: '', // 기타2 파일첨부
      otherFile2Name: '',
      verificationResult: '', // 중복특채ID
      fileList: [],
      fileNameList: [
        {name: 'improvementFileName', type: '개선대책서'},
        {name: 'identificationFileName', type: '식별표부착'},
        {name: 'otherFile1Name', type: '기타1'},
        {name: 'otherFile2Name', type: '기타2'},              
      ]
    }
  },
  computed: {
  },
  async mounted() {
    await this.getDeptGroupData();      // 의뢰팀 콤보 데이터
    await this.getCompanyListData();    // 업체목록 콤보
    await this.getWorkCenterListData(); // WorkCenter 콤보 
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },

    /********  특채 신청서 작성 **********/

    // 의뢰팀 콤보 change
    selectDeptGroup(event) {
      this.deptGroupValue = event.value;
    },
    // WorkCenter 콤보 change
    workCenterChange(event) {
      this.workCenterValue = event.value;
    },
    // 업체명 콤보 change 
    companyChange(event) {
      this.companyValue = event.value;
    },

    // 검색 인풋 변경시
    searchInput(name, val) {
      this[name] = val;
    },

    // 텍스트 변경시
    insertInput(e, name) {
      this[name] = e.value;
    },

    // 파일 첨부
    fileUpload(name){
      this.$refs[name]._input.click();
    },

    // 파일첨부 인풋 변경시
    fileChange(e, name){
      this[name] = this.fileTimestamp(e.target.files[0].name);
      this.$refs[name]._data.textVal = this.fileTimestamp(e.target.files[0].name);

      const fileName = this.fileTimestamp(e.target.files[0].name);
      const file = e.target.files[0];
      const fileLocation = this.fileNameList.filter(x => x.name == name)[0]?.type.concat('/');

      const data = {
        fileName: fileName,
        file: file,
        fileLocation : fileLocation
      }

      this.fileList = this.fileList.filter(x => x.fileLocation != fileLocation);
      this.fileList.push(data);
    },


    // 사용자 선택 팝업
    selectUserModal(name){
      this.UserModalVisible = true;
      this.selectedUserInput = name;

    },

    selectUser(data) {
      this.$refs[this.selectedUserInput.concat('UserName')].textVal = data.name;
      this[this.selectedUserInput.concat('UserId')] = data.userId;
    },


    // 품번
    selectedRow(data) {
      this.$refs['productId'].textVal = data.PRODUCTID;
      this.$refs['productName'].textVal = data.PRODUCTNAME;
    },

    
    // 중복체크 선택
    selectedDupChkRow(data) {
      this.verificationResult = data.CONCESSIONID;
    },


    // 의뢰팀 콤보 데이터 가져오기
    async getDeptGroupData() {
      this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetDeptCombo',
          sendParam: {
          },
      }).then(res => {
          for (let i = 0; i < res.length; i++) {
              if (i < res.length) {
                  this.deptGroup.push({ id: res[i].ID, text: res[i].NAME });
                  this.deptGroupValue = this.deptGroup[0];
              }
          }
      });
    },

    // WorkCenter 콤보 데이터 가져오기
    async getWorkCenterListData(){
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAreaList',
        queryVersion: '00003',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          AREATYPE: 'WorkCenter',
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        for(let i = 0; i < data.length; i++){
          if(i < data.length){
            this.workCenterList.push({ id : data[i].CODE, text : data[i].NAME });
            this.workCenterValue = this.workCenterList[0];
          }
        }
      });
    },

    // 업체 콤보 데이터 가져오기
    async getCompanyListData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetCompanyDefinitionList',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        for(let i = 0; i < data.length; i++){
          if(i < data.length){
            this.companyList.push({ id : data[i].COMPANYID, text : data[i].COMPANYNAME });
            this.companyValue = this.companyList[0];
          }
        }
      });
    },

    // 중복체크 버튼
    dupChkBtn() {
      this.productId = this.$refs.productId.textVal;
      this.productName = this.$refs.productName.textVal;
      this.dupChkModalVisible = true;
    },

    // 신청 버튼
    insertBtn() {
      if (this.receiverUserId == "" || this.receiverUserId == null) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00301')); // 알림, 접수자를 선택해주세요.
        return;
      }

      if (this.requestUserId == "" || this.requestUserId == null) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00302')); // 알림, 의뢰자를 선택해주세요.
        return;
      }

      if (this.$refs.productId.textVal == "" || this.$refs.productId.textVal == null) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00149')); // 알림, 품번코드를 선택해주세요.
        return;
      }
      
      const saveData = [
        {
          _ROWSTATUS: "C",
          PLANTID: this.$auth.$state.user.plantId,
          CONCESSIONSTATE: 'Create',
          RECEIVERUSERID: this.receiverUserId, // 접수자
          REQUESTDEPARTMENT: this.$refs.cmbProGroup.value.id, // 의뢰팀
          REQUESTUSERID: this.requestUserId, // 의뢰자
          REQUESTITEM: this.$refs.productId.textVal, // 품번
          WORKCENTER: this.$refs.cmbWorkCenter.value.id, //WorkCenter
          REQUESTQUANTITY: this.requestQuantity, // 수량
          REQUESTCOMPANY: this.$refs.cmbCompanyGroup.value.id, // 업체
          REQUESTCOST: this.requestCost, // 특채비용
          DEFECTREASON: this.defectReason, // 결함원인
          CONCESSIONREASON: this.concessionReason, // 특채사유
          IMPROVEMENTPLAN: this.improvementPlan,  // 개선대책
          VERIFICATIONRESULT: this.verificationResult,  // 중복특채ID
          TYPE:'CONCESSION',
        }
      ];

      
      
      this.fileNameList.map(x => {
        if(!this.isNullOrEmpty(this[x.name])){
          saveData.push({
            PLANTID: this.$auth.$state.user.plantId,
            FILENAME: this[x.name],
            FILETYPE: x.type
          })
        }
      });
  

      if(this.mesFileUpload(this.fileList)){
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnCreateConcession',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
            this.$emit('insert')
            } 
          });
        });
      }
            
    },
  },
};
</script>