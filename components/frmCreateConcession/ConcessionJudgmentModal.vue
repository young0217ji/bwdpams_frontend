<template>
  <div>
    <Dialog
      v-if="visibleDialog"
      title="특채 신청서"
      width="980px"
      height="810px"
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
                    <Input
                      ref="concessionId"
                      v-model="selectedConcessionRow.CONCESSIONID"
                      :style="{ width: '200px' }"
                      :readonly="true"
                      :class="'k-readonly'"
                    />                    
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00789") }}</Label> <!-- 접수자 -->
                    <Input
                      ref="receiverUserName"
                      v-model="selectedConcessionRow.RECEIVERUSERNAME"
                      :dataNm="'receiverUserName'"
                      :style="{ width: '200px' }"
                      :readonly="true"   
                      :class="'k-readonly'"
                    />
                    <Button 
                      :theme-color="'primary'"
                      :style="{ marginLeft: '5px' }" 
                      @click="selectUserModal('RECEIVER')">{{$t("MES_CommLang.MES_CommLang_00169")}}
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
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="selectedConcessionRow.REQUESTDEPARTMENT"
                      @change="selectDeptGroup"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00743") }}</Label> <!-- 의뢰자 -->
                    <Input
                      ref="requestUserName"
                      v-model="selectedConcessionRow.REQUESTUSERNAME"
                      :dataNm="'requestUserName'"
                      :style="{ width: '200px' }"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      :style="{ marginLeft: '5px' }" 
                      @click="selectUserModal('REQUEST')">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00545") }}</Label> <!-- 품번 -->
                    <Input 
                      ref="productId" 
                      v-model="selectedConcessionRow.REQUESTITEM"
                      :style="{ width: '200px' }"
                      :dataNm="'productId'" 
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      :style="{ marginLeft: '5px' }" 
                      @click="SelectProductModalVisible = true">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</Label> <!-- 품명 -->
                    <Input
                      ref="productName" 
                      v-model="selectedConcessionRow.REQUESTITEMNAME"
                      :style="{ width: '200px' }"
                      :dataNm="'productName'"
                      :readonly="true"
                      :class="'k-readonly'"
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
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="selectedConcessionRow.WORKCENTER"
                      @change="workCenterChange"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00373") }}</label> <!-- 수량 -->
                    <Input
                      ref="requestQuantity"
                      v-model="selectedConcessionRow.REQUESTQUANTITY"
                      :style="{ width: '200px' }"
                      :dataNm="'requestQuantity'"
                      :disabled="false"
                      :readonly="false"
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
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="selectedConcessionRow.REQUESTCOMPANY"
                      @change="companyChange"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00744") }}</label> <!-- 특채비용 -->
                    <Input
                      ref="requestCost"
                      v-model="selectedConcessionRow.REQUESTCOST"
                      :style="{ width: '200px' }"
                      :dataNm="'requestCost'"
                      :disabled="false"
                      :readonly="false"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00745") }}</label> <!-- SAP재고현황 -->
                    <Input
                      ref="sapStatus"
                      :style="{ width: '200px' }"
                      :dataNm="'sapStatus'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00746") }}</Label> <!-- 개선대책서  -->
                    <Input
                      ref="improvementFileName" 
                      v-model="selectedConcessionRow.IMPROVEMENTFILENAME"
                      :dataNm="'improvementFileName'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :class="'k-readonly'"
                      @input-text-set="searchInput"
                    />
                    <Button 
                    :theme-color="'primary'" :style="{ marginLeft: '5px'}" @click="fileUpload('improvementFile')"
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
                    <Input
                      ref="identificationFileName" 
                      v-model="selectedConcessionRow.IDENTIFICATIONFILENAME"
                      :dataNm="'identificationFileName'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :class="'k-readonly'"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px'}" @click="fileUpload('identificationFile')"
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
                    <Input
                      ref="otherFile1Name" 
                      v-model="selectedConcessionRow.OTHERFILE1NAME"
                      :dataNm="'otherFile1Name'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :class="'k-readonly'"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px'}" @click="fileUpload('otherFile1')"
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
                    <Input
                      ref="otherFile2Name" 
                      v-model="selectedConcessionRow.OTHERFILE2NAME"
                      :dataNm="'otherFile2Name'"
                      :readonly="true"
                      :style="{ width: '200px' }"
                      :class="'k-readonly'"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px'}" @click="fileUpload('otherFile2')"
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
                          v-model="selectedConcessionRow.DEFECTREASON" ></TextArea>
                  </v-col>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00752") }}</Label> <!-- 특채 사유 -->
                  <v-col :cols="12">
                      <TextArea ref="concessionReason" :style="{ width: '100%', height: '153px', margin:'10px 0' }"
                          v-model="selectedConcessionRow.CONCESSIONREASON" :dataNm="'concessionReason'"></TextArea>
                  </v-col>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00753") }}</Label> <!-- 개선 대책 -->
                  <v-col :cols="12">
                      <TextArea ref="improvementPlan" :style="{ width: '100%', height: '153px', margin:'10px 0'  }"
                          v-model="selectedConcessionRow.IMPROVEMENTPLAN" :dataNm="'improvementPlan'"></TextArea>
                  </v-col>
                </v-row>
                <v-row no-gutters style="margin-bottom : 6px">
                  <v-col :cols="9" align="right">
                    <div class="form-group-wrap">
                      <div class="form-group">
                      <label>{{ $t("MES_CommLang.MES_CommLang_00750") }}</label> <!-- 중복특채ID -->
                      <Input
                        ref="verificationResult"
                        v-model="selectedConcessionRow.VERIFICATIONRESULT"
                        :style="{ width: '155px' }"
                        :readonly="true"
                        :class="'k-readonly'"
                      />   
                      </div> 
                    </div>
                  </v-col>
                  <v-col :cols="3" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="updateBtn"
                    >{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 신청 -->
                  </v-col>
                </v-row>
              </v-col>  
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <br/>
    <!---------------- 특채 신청서 의견 취합 ------------------------------------->
    <v-row>
      <v-col :cols="12">
        <CardTitle>{{ $t("MES_CommLang.MES_CommLang_00790") }}</CardTitle> <!-- 특채 의견 취합-->
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <!----------- 제품개발부서 ----------------->
            <v-row no-gutters >
              <v-col :cols="5">
                <div class="form-group-wrap">
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00791") }}</Label> <!-- 제품개발부서 -->
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00792") }}</Label> <!-- 결재자 -->
                    <Input
                      ref="proEvelopmentUserName"
                      v-model="selectedConcessionRow.PRODUCTDEVELOPMENTUSERNAME"
                      :style="{ width: '200px' }"
                      :dataNm="'proEvelopmentUserName'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      :style="{ marginLeft : '5px' }"
                      @click="selectUserModal('PRODUCTDEVELOPMENT')">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00793") }}</label> <!-- 판정 -->
                    <DropDownList
                        ref="cmbProEvelopmentResult"
                        :style="{ width: '200px' }"
                        :data-items="resultTypeList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="selectedConcessionRow.PRODUCTDEVELOPMENTRESULT"
                        @change="selectProEvelopmentResult"
                      />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00797") }}</Label> <!-- 판정일자 -->
                    <Input
                      ref="proEvelopmentDate"
                      v-model="selectedConcessionRow.PRODUCTDEVELOPMENTDATE"
                      :style="{ width: '200px' }"
                      :dataNm="'proEvelopmentDate'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :cols="1"></v-col>
              <v-col :cols="6">
                <v-row class="search-box" align="center" no-gutters>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00141") }}</Label> <!-- 사유 -->
                  <v-col :cols="12">
                      <TextArea ref="proEvelopmentReason" :style="{ width: '100%', height: '110px', margin:'10px 0' }"
                          v-model="selectedConcessionRow.PRODUCTDEVELOPMENTREASON" :dataNm="'proEvelopmentReason'"></TextArea>
                  </v-col>
                </v-row>
                <v-row no-gutters style="margin-bottom : 6px">
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn1" 
                    >{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <br/>
            <!----------- 생산기술부서 ----------------->
            <v-row no-gutters >
              <v-col :cols="5">
                <div class="form-group-wrap">
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00794") }}</Label> <!-- 생산기술부서 -->
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00792") }}</Label> <!-- 결재자 -->
                    <Input
                      ref="proEngineerUserName" 
                      v-model="selectedConcessionRow.PRODUCTIONENGINEERINGUSERNAME"
                      :style="{ width: '200px' }"
                      :dataNm="'proEngineerUserName'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      :style="{ marginLeft : '5px' }"
                      @click="selectUserModal('PRODUCTIONENGINEERING')">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00793") }}</label> <!-- 판정 -->
                    <DropDownList
                        :style="{ width: '200px' }"
                        :data-items="resultTypeList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="selectedConcessionRow.PRODUCTIONENGINEERINGRESULT"
                        @change="selectProEngineerResult"
                      />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00797") }}</Label> <!-- 판정일자 -->
                    <Input
                      ref="proEngineerDate"
                      v-model="selectedConcessionRow.PRODUCTIONENGINEERINGDATE"
                      :style="{ width: '200px' }"
                      :dataNm="'proEngineerDate'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :cols="1"></v-col>
              <v-col :cols="6">
                <v-row class="search-box" align="center" no-gutters>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00141") }}</Label> <!-- 사유 -->
                  <v-col :cols="12">
                      <TextArea ref="proEngineerReason" :style="{ width: '100%', height: '110px', margin:'10px 0' }"
                          v-model="selectedConcessionRow.PRODUCTIONENGINEERINGREASON" :dataNm="'proEngineerReason'"></TextArea>
                  </v-col>
                </v-row>
                <v-row no-gutters style="margin-bottom : 6px">
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn2" 
                    >{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <br>
            <!----------- 생산부서 ----------------->
            <v-row no-gutters >
              <v-col :cols="5">
                <div class="form-group-wrap">
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00795") }}</Label> <!-- 생산부서 -->
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00792") }}</Label> <!-- 결재자 -->
                    <Input
                      ref="productionUserName"
                      v-model="selectedConcessionRow.PRODUCTIONUSERNAME"
                      :style="{ width: '200px' }"
                      :dataNm="'productionUserName'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      :style="{ marginLeft : '5px' }"
                      @click="selectUserModal('PRODUCTION')">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00793") }}</label> <!-- 판정 -->
                    <DropDownList
                        :style="{ width: '200px' }"
                        :data-items="resultTypeList"
                        :text-field="'text'"
                        :data-item-key="'id'"
                        :value-field="'id'"
                        :value-primitive="true"
                        :value="selectedConcessionRow.PRODUCTIONRESULT"
                        @change="selectProductionResult"
                      />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00797") }}</Label> <!-- 판정일자 -->
                    <Input
                      ref="productionDate"
                      v-model="selectedConcessionRow.PRODUCTIONDATE"
                      :style="{ width: '200px' }"
                      :dataNm="'productionDate'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :cols="1"></v-col>
              <v-col :cols="6">
                <v-row class="search-box" align="center" no-gutters>
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00141") }}</Label> <!-- 사유 -->
                  <v-col :cols="12">
                      <TextArea ref="productionReason" :style="{ width: '100%', height: '110px', margin:'10px 0' }"
                          v-model="selectedConcessionRow.PRODUCTIONREASON" :dataNm="'productionReason'"></TextArea>
                  </v-col>
                </v-row>
                <v-row no-gutters style="margin-bottom : 6px">
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn3" 
                    >{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <br/>
            <!----------- 품질부서 ----------------->
            <v-row no-gutters >
              <v-col :cols="5">
                <div class="form-group-wrap">
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00796") }}</Label> <!-- 품질부서 -->
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00792") }}</Label> <!-- 결재자 -->
                    <Input
                      ref="qualityUserName"
                      v-model="selectedConcessionRow.QUALITYUSERNAME"
                      :style="{ width: '200px' }"
                      :dataNm="'qualityUserName'"
                      :disabled="false" 
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                    <Button 
                      :theme-color="'primary'" 
                      :style="{ marginLeft : '5px' }"
                      @click="selectUserModal('QUALITY')">{{$t("MES_CommLang.MES_CommLang_00169")}}
                    </Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00793") }}</label> <!-- 판정 -->
                    <DropDownList
                      :style="{ width: '200px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="selectedConcessionRow.QUALITYRESULT"
                      @change="selectQualityResult"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00797") }}</Label> <!-- 판정일자 -->
                    <Input
                      ref="qualityDate"
                      v-model="selectedConcessionRow.CONCESSIONJUDGMENTDATE"
                      :style="{ width: '200px' }"
                      :dataNm="'qualityDate'"
                      :readonly="true"
                      :class="'k-readonly'"
                    />
                  </div>
                  <div class="form-group">
                    <label>{{ $t("MES_CommLang.MES_CommLang_00793") }}</label> <!-- 판정등급 -->
                    <DropDownList
                      :style="{ width: '200px' }"
                      :data-items="concessionGradeTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="selectedConcessionRow.CONCESSIONGRADE"
                      @change="selectConcessionGrade"
                    />
                  </div>            
                </div>
              </v-col>
              <v-col :cols="1"></v-col>
              <v-col :cols="6">
                <v-row class="search-box" align="center" no-gutters>         
                  <Label>{{ $t("MES_CommLang.MES_CommLang_00141") }}</Label> <!-- 사유 -->
                  <v-col :cols="12">
                      <TextArea ref="qualityReason" :style="{ width: '100%', height: '110px', margin:'10px 0'  }"
                          v-model="selectedConcessionRow.QUALITYREASON" :dataNm="'qualityReason'"></TextArea>
                  </v-col>
                </v-row>
                <v-row no-gutters style="margin-bottom : 6px">
                  <v-col :cols="12" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn4" 
                    >{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
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
    <ConfirmPop
      :is="'confirmPop'"
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
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
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import AlertPop from "@/components/common/modal/AlertPop";
import InputText from "@/components/common/input/InputText";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import { TextArea, Input } from '@progress/kendo-vue-inputs';
import GetUserModal from "@/components/common/modal/GetUserModal.vue";
import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';
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
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    selectedRowData:{
      type: Object ,
      defalut: {},
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
      selectedConcessionRow : {},
      fileList: [],
      fileNameList: [
        {name: 'improvementFileName', type: '개선대책서'},
        {name: 'identificationFileName', type: '식별표부착'},
        {name: 'otherFile1Name', type: '기타1'},
        {name: 'otherFile2Name', type: '기타2'},              
      ],
      // ====== 의견취합 데이터 ======
      proEvelopmentUserId: '',
      proEvelopmentUserName: '',
      proEngineerUserId: '',
      proEngineerUserName: '',
      productionUserId: '',
      productionUserName: '',
      qualityUserId: '',
      qualityUserName: '',
      proEvelopmentReason: '',
      proEngineerReason: '',
      productionReason: '',
      qualityReason: '',
      proEvelopmentResult: '',
      proEngineerResult: '',
      productionResult: '',
      qualityResult: '',
      resultTypeList: [],
      proEvelopmentResultValue:{},
      proEngineerResultValue:{},
      productionResultValue: {},
      qualityResultValue: {},
      concessionGradeTypeList: [], // 특채등급
      concessionGradeValue: {},
    }
  },
  computed: {
  },
  async mounted() {
    this.selectedConcessionRow = JSON.parse(JSON.stringify(this.selectedRowData));
    await this.getDeptGroupData();      // 의뢰팀 콤보 데이터
    await this.getCompanyListData();    // 업체목록 콤보
    await this.getWorkCenterListData(); // WorkCenter 콤보 
    await this.getResultTypeData(); // 판정 콤보
    await this.getConcessionGradeData(); // 특채등급 콤보

  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },

    /********  특채 신청서 작성 **********/

    // 의뢰팀 콤보 change
    selectDeptGroup(event) {
      this.selectedConcessionRow.REQUESTDEPARTMENT = event.value;
    },
    // WorkCenter 콤보 change
    workCenterChange(event) {
      this.selectedConcessionRow.WORKCENTER = event.value;
    },
    // 업체명 콤보 change 
    companyChange(event) {
      this.selectedConcessionRow.REQUESTCOMPANY = event.value;
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
      
      const data = {
        ...this.selectedConcessionRow,
      }
      data[name.toUpperCase()] = this.fileTimestamp(e.target.files[0].name);
      this.selectedConcessionRow = data;
    
      const fileName = this.fileTimestamp(e.target.files[0].name);
      const file = e.target.files[0];
      const fileLocation = this.fileNameList.filter(x => x.name == name)[0]?.type.concat('/');

      const fileList = {
        fileName: fileName,
        file: file,
        fileLocation : fileLocation
      }

      this.fileList = this.fileList.filter(x => x.fileLocation != fileLocation);
      this.fileList.push(fileList);

    },

    // 사용자 선택 팝업
    selectUserModal(name){
      this.UserModalVisible = true;
      this.selectedUserInput = name;

    },

    selectUser(data) {
      this.selectedConcessionRow[this.selectedUserInput.concat('USERNAME')] = data.name;
      //this.$refs[this.selectedUserInput.concat('UserName')].textVal = data.name;
      this.selectedConcessionRow[this.selectedUserInput.concat('USERID')] = data.userId;
      // this[this.selectedUserInput.concat('USERID')] = data.userId;
    },

    
    // 품번
    selectedRow(data) {
      this.selectedConcessionRow.REQUESTITEM = data.PRODUCTID;
      this.selectedConcessionRow.REQUESTITEMNAME = data.PRODUCTNAME;
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
        res.map(x=> {
          this.workCenterList.push({ id : x.CODE, text : x.NAME });
        })
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
          }
        }
      });
    },   

    // 신청한 내용 수정 버튼
    updateBtn() {
      const saveData = [
        {
          _ROWSTATUS: "U",
          PLANTID: this.$auth.$state.user.plantId,
          CONCESSIONSTATE: 'Create',
          CONCESSIONID: this.selectedRowData.CONCESSIONID,
          RECEIVERUSERID: this.selectedConcessionRow.RECEIVERUSERID,
          REQUESTDEPARTMENT: this.selectedConcessionRow.REQUESTDEPARTMENT, // 의뢰팀
          REQUESTUSERID: this.selectedConcessionRow.REQUESTUSERID, // 의뢰자
          REQUESTITEM: this.selectedConcessionRow.REQUESTITEM, // 품번
          WORKCENTER: this.selectedConcessionRow.WORKCENTER, //WorkCenter
          REQUESTQUANTITY: this.selectedConcessionRow.REQUESTQUANTITY, // 수량
          REQUESTCOMPANY: this.selectedConcessionRow.REQUESTCOMPANY, // 업체
          REQUESTCOST: this.selectedConcessionRow.REQUESTCOST, // 특채비용
          DEFECTREASON: this.selectedConcessionRow.DEFECTREASON, // 결함원인
          CONCESSIONREASON: this.selectedConcessionRow.CONCESSIONREASON, // 특채사유
          IMPROVEMENTPLAN: this.selectedConcessionRow.IMPROVEMENTPLAN,  // 개선대책
          VERIFICATIONRESULT: this.selectedConcessionRow.VERIFICATIONRESULT,  // 중복특채ID
          PRODUCTDEVELOPMENTUSERID: this.selectedConcessionRow.PRODUCTDEVELOPMENTUSERID, // 제품개발부서 결재자
          PRODUCTIONENGINEERINGUSERID: this.selectedConcessionRow.PRODUCTIONENGINEERINGUSERID, // 생산기술부서 결재자
          PRODUCTIONUSERID: this.selectedConcessionRow.PRODUCTIONUSERID, // 생산부서 결재자
          QUALITYUSERID: this.selectedConcessionRow.QUALITYUSERID, // 품질부서 결재자 
          IMPROVEMENTFILENAME: this.selectedConcessionRow.IMPROVEMENTFILENAME,  // 개선대책서 파일
          IDENTIFICATIONFILENAME: this.selectedConcessionRow.IDENTIFICATIONFILENAME,  // 식별표부착 파일
          OTHERFILE1NAME: this.selectedConcessionRow.OTHERFILE1NAME, // 기타1 파일
          OTHERFILE2NAME: this.selectedConcessionRow.OTHERFILE2NAME, // 기타2 파일
          TYPE:'CONCESSION',
        }
      ];


      
      this.fileList.map(x => {
          saveData.push({
            PLANTID: this.$auth.$state.user.plantId,
            CONCESSIONID: this.selectedRowData.CONCESSIONID,
            FILENAME: x.fileName,            
            FILETYPE: x.fileLocation.substring(0,x.fileLocation.lastIndexOf('/')),
            FILELOCATION: x.fileLocation
          })
      });


      if(this.mesFileUpload(this.fileList)){
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnCreateConcession',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
            this.$emit('save')
          } 
          });
        });
      } 
    },


    /********  의견 취합 작성 **********/

    // 판정 Combo 데이터 
    async getResultTypeData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValue',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          enumid: 'ResultType'
        }
      }).then(res => {
        res.map(x=>{
          this.resultTypeList.push({ id : x.ENUMVALUE, text : x.ENUMVALUENAME })
        })
      })
    },

    // 판정 Combo 선택
    selectProEvelopmentResult(event) {
      this.selectedConcessionRow.PRODUCTDEVELOPMENTRESULT = event.value;
    },
    selectProEngineerResult(event) {
      this.selectedConcessionRow.PRODUCTIONENGINEERINGRESULT = event.value;
    },
    selectProductionResult(event) {
      this.selectedConcessionRow.PRODUCTIONRESULT = event.value;
    },
    selectQualityResult(event) {
      this.selectedConcessionRow.QUALITYRESULT = event.value;
    },

    // 특채등급 Combo 선택
    selectConcessionGrade(event) {
      this.selectedConcessionRow.CONCESSIONGRADE = event.value;
    },

    // 특채 등급 combo
    async getConcessionGradeData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValue',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          enumid: 'ConcessionGrade'
        }
      }).then(res => {
        res.map(x=>{
          this.concessionGradeTypeList.push({ id : x.ENUMVALUE, text : x.ENUMVALUENAME })
        })
      })
    },

    

    // 제품개발부서 의견 저장 버튼
    saveBtn1() {
      if(this.$auth.$state.user.userId !== this.selectedConcessionRow.PRODUCTDEVELOPMENTUSERID) {
        this.$refs.alertPop.show("알림","권한이 없습니다.");
        return;
      }
      
      const saveData = [{
        ...this.selectedConcessionRow,
          _ROWSTATUS: "U",         
          PRODUCTDEVELOPMENTRESULT: this.selectedConcessionRow.PRODUCTDEVELOPMENTRESULT,  // 제품개발부서합불판정
          PRODUCTDEVELOPMENTREASON: this.selectedConcessionRow.PRODUCTDEVELOPMENTREASON, //제품개발부서사유
          TYPE:'CONCESSION',
          APPROVALTYPE: 'PD' // PD, PE, P, Q
      }];

      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnCreateConcession',
        sendParam: saveData,
      }).then(result => {
        this.$nextTick(() => {
        if (result.returncode !== undefined && result.returncode === '0') {
          this.$emit('save')
        } 
      });
      });
    },


    // 생산기술부서 의견 저장 버튼
    saveBtn2() {
      if(this.$auth.$state.user.userId !== this.selectedConcessionRow.PRODUCTIONENGINEERINGUSERID) {
        this.$refs.alertPop.show("알림","권한이 없습니다.");
        return;
      }

      const saveData = [{
        ...this.selectedConcessionRow,
        _ROWSTATUS: "U",
        PRODUCTIONENGINEERINGRESULT: this.selectedConcessionRow.PRODUCTIONENGINEERINGRESULT, // 생산기술부서합불판정
        PRODUCTIONENGINEERINGREASON: this.selectedConcessionRow.PRODUCTIONENGINEERINGREASON, //생산기술부서사유
        TYPE:'CONCESSION',
        APPROVALTYPE: 'PE' // PD, PE, P, Q
      }];

      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnCreateConcession',
        sendParam: saveData,
      }).then(result => {
        this.$nextTick(() => {
        if (result.returncode !== undefined && result.returncode === '0') {
          this.$emit('save')
        } 
        });
      });
    },


    // 생산부서 의견 저장 버튼
    saveBtn3() {
      if(this.$auth.$state.user.userId !== this.selectedConcessionRow.PRODUCTIONUSERID) {
        this.$refs.alertPop.show("알림","권한이 없습니다.");
        return;
      }

      const saveData = [{
        ...this.selectedConcessionRow,
        _ROWSTATUS: "U",
        PRODUCTIONRESULT: this.selectedConcessionRow.PRODUCTIONRESULT, // 생산부서합불판정
        PRODUCTIONREASON: this.selectedConcessionRow.PRODUCTIONREASON, // 생산부서사유
        TYPE:'CONCESSION',
        APPROVALTYPE: 'P' // PD, PE, P, Q
      }];

      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnCreateConcession',
        sendParam: saveData,
      }).then(result => {
        this.$nextTick(() => {
        if (result.returncode !== undefined && result.returncode === '0') {
          this.$emit('save')
        } 
        });
      });
    },

    
    // 품질부서 의견 저장 버튼
    saveBtn4() {
      if(this.$auth.$state.user.userId !== this.selectedConcessionRow.QUALITYUSERID) {
        this.$refs.alertPop.show("알림","권한이 없습니다.");
        return;
      }

      const saveData = [{
        ...this.selectedConcessionRow,
        _ROWSTATUS: "U",
        CONCESSIONSTATE: this.selectedConcessionRow.QUALITYRESULT == 'OK' ? 'Processing' : 'Finish',
        QUALITYRESULT: this.selectedConcessionRow.QUALITYRESULT, // 품질부서합불판정
        QUALITYREASON: this.selectedConcessionRow.QUALITYREASON, // 품질부서사유
        CONCESSIONGRADE: this.selectedConcessionRow.CONCESSIONGRADE, // 특채등급
        TYPE:'CONCESSION',
        APPROVALTYPE: 'Q' // PD, PE, P, Q
      }];

      const res = this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnCreateConcession',
        sendParam: saveData,
      }).then(result => {
        this.$nextTick(() => {
        if (result.returncode !== undefined && result.returncode === '0') {
          this.$emit('save')
        } 
        });
      });
    },

  },
};
</script>

