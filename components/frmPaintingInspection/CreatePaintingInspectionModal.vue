<template>
  <div>
    <Dialog
      v-if="visibleDialog"
      title="도장 완성검사 성적서"
      width="600px"
      height="810px"
      @close="toggleDialog"
    >
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters>
              <v-col :cols="12">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00857") }}</Label> <!-- 검사일자 -->
                    <DatePicker            
                      :value="sendParam.INSPECTIONDATE?new Date(sendParam.INSPECTIONDATE):new Date()"
                      :format="'yyyy-MM-dd'"
                      @change="selectInspectionDate"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00858") }}</Label> <!-- 검사자 -->
                    <Input
                      ref="inspectionUserName" 
                      v-model="sendParam.INSPECTIONUSERNAME" 
                      dataNm="inspectionUserName"
                      :readonly="true"
                      :class="'k-readonly'"
                      :style="{ width: '200px' }" />
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px' }" @click="selectUserModal('INSPECTION')">{{$t("MES_CommLang.MES_CommLang_00169")}}</Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00898") }}</Label> <!-- LOT수 -->
                    <Input ref="lotCount" v-model="sendParam.LOTCOUNT" :style="{ width: '200px' }" />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00545") }}</Label> <!-- 품번 -->
                    <Input 
                      ref="productId" 
                      v-model="sendParam.PRODUCTID" 
                      :readonly="true"
                      :class="'k-readonly'"
                      :style="{ width: '200px' }" />
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px' }" @click="SelectProductModalVisible = true">{{$t("MES_CommLang.MES_CommLang_00169")}}</Button> <!-- 선택 -->
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00553") }}</Label> <!-- 품명 -->
                    <Input 
                      ref="productName" 
                      v-model="sendParam.PRODUCTNAME" 
                      :readonly="true"
                      :class="'k-readonly'"
                      :style="{ width: '200px' }" />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00859") }}</Label> <!-- 도장호기 -->
                    <Input 
                      ref="equipmentId" 
                      v-model="sendParam.EQUIPMENTNAME" 
                      :readonly="true"
                      :class="'k-readonly'"
                      :style="{ width: '200px' }" />
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px' }" @click="SelectEquipmentModalVisible = true">{{$t("MES_CommLang.MES_CommLang_00169")}}</Button> <!-- 선택 -->
                  </div>
                </div>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
    <!---------------------------------- ASS'Y외관 --------------------------------------->
      
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00860") }}</CardTitle> <!-- 자산정보 -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters>
              <v-col :cols="12">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00861") }}</Label> <!-- TUBE 크랙, 찍힘, 요철 확인 -->
                    <DropDownList
                      ref="ITEM001"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="sendParam.ITEM001"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00862") }}</Label> <!-- 주,단조부의 찍힘,패임,균열 확인 -->
                    <DropDownList
                      ref="ITEM002"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="sendParam.ITEM002"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00863") }}</Label> <!-- 용접비드 확인(2㎜ 이하, 오버랩부 3㎜ 이하) -->
                    <DropDownList
                      ref="ITEM003"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="sendParam.ITEM003"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00864") }}</Label> <!-- 용접부의 스패터, 슬래그 확인 -->
                    <DropDownList
                      ref="ITEM004"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="sendParam.ITEM004"
                      @change="comboChange"
                    /> 
                  </div>
                </div>  
              </v-col>
            </v-row>
          </CardBody>
        </Card> 
    <!---------------------------------- 도장면 --------------------------------------->
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00865") }}</CardTitle> <!-- 자산정보 -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters >
              <v-col :cols="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00866") }}</Label> <!-- 색상, 광택 확인 -->
                    <DropDownList
                      ref="ITEM005"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value-primitive="true"
                      :value="sendParam.ITEM005"
                      @change="comboChange"

                    />  
                    <Input ref="ITEM006" v-model="sendParam.ITEM006" :style="{ width: '100px' }" />  
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00867") }}</Label> <!-- 이물질, 부풀음 확인 -->
                    <DropDownList
                      ref="ITEM007"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM007"
                      :value-primitive="true"
                      @change="comboChange"
                    />   
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00868") }}</Label> <!--  흐름, 주름, 은폐 확인 -->
                    <DropDownList
                      ref="ITEM008"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM008"
                      :value-primitive="true"
                      @change="comboChange"
                    />   
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00869") }}</Label> <!-- 곰보, 박리 확인 -->
                    <DropDownList
                      ref="ITEM009"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM009"
                      :value-primitive="true"
                      @change="comboChange"
                    />   
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00870") }}</Label> <!-- 구멍, 균열 확인 -->
                    <DropDownList
                      ref="ITEM010"
                      :style="{ width: '90px' }"
                      :data-items="inspectionResultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM010"
                      :value-primitive="true"
                      @change="comboChange"
                    />    
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00871") }}</Label> <!-- 하도: 도막두께 30㎛↑ 만족할것 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM011" v-model="sendParam.ITEM011" :style="{ width: '90px' }" />
                    <Input ref="ITEM012" v-model="sendParam.ITEM012" :style="{ width: '90px' }" /> 
                    <Input ref="ITEM013" v-model="sendParam.ITEM013" :style="{ width: '90px' }" /> 
                    <Input ref="ITEM014" v-model="sendParam.ITEM014" :style="{ width: '90px' }" /> 
                    <Input ref="ITEM015" v-model="sendParam.ITEM015" :style="{ width: '90px' }" /> 
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00872") }}</Label> <!-- TUBE,HC,KL 임의3개소 Min.측정 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM016" v-model="sendParam.ITEM016" :style="{ width: '90px' }" />
                    <Input ref="ITEM017" v-model="sendParam.ITEM017" :style="{ width: '90px' }" /> 
                    <Input ref="ITEM018" v-model="sendParam.ITEM018" :style="{ width: '90px' }" /> 
                    <Input ref="ITEM019" v-model="sendParam.ITEM019" :style="{ width: '90px' }" /> 
                    <Input ref="ITEM020" v-model="sendParam.ITEM020" :style="{ width: '90px' }" /> 
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00873") }}</Label> <!-- 상도:도막두께 80㎛↑ 만족할것 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM021" v-model="sendParam.ITEM021" :style="{ width: '90px' }"  />
                    <Input ref="ITEM022" v-model="sendParam.ITEM022" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM023" v-model="sendParam.ITEM023" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM024" v-model="sendParam.ITEM024" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM025" v-model="sendParam.ITEM025" :style="{ width: '90px' }"  /> 
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00872") }}</Label> <!-- TUBE,HC,KL 임의3개소 Min.측정 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM026" v-model="sendParam.ITEM026" :style="{ width: '90px' }"  />
                    <Input ref="ITEM027" v-model="sendParam.ITEM027" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM028" v-model="sendParam.ITEM028" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM029" v-model="sendParam.ITEM029" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM030" v-model="sendParam.ITEM030" :style="{ width: '90px' }"  /> 
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00874") }}</Label> <!-- 비도장부 상태(도장 유,무) -->
                  </div>
                  <div class="form-group">
                    <DropDownList
                      ref="ITEM031"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM031"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM032"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM032"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM033"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM033"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM034"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM034"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM035"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM035"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                </div> 
              </v-col>
            </v-row> 
          </CardBody>
        </Card> 
     
    <!---------------------------------- 치수 --------------------------------------->
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00875") }}</CardTitle> <!-- 자산정보 -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters >
              <v-col :cols="12">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00876") }}</Label> <!-- KL 측 내경 Pin Gauge -->
                  </div>
                  <div class="form-group">
                    <DropDownList
                      ref="ITEM036"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM036"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM037"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM037"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM038"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM038"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM039"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM039"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM040"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM040"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00877") }}</Label> <!-- HC 측 내경 Pin Gauge -->
                  </div>
                  <div class="form-group">
                    <DropDownList
                      ref="ITEM041"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM041"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM042"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM042"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM043"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM043"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM044"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM044"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM045"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM045"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00878") }}</Label> <!-- KL 측 이면폭 치수 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM046" v-model="sendParam.ITEM046" :style="{ width: '90px' }"  />
                    <Input ref="ITEM047" v-model="sendParam.ITEM047" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM048" v-model="sendParam.ITEM048" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM049" v-model="sendParam.ITEM049" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM050" v-model="sendParam.ITEM050" :style="{ width: '90px' }"  /> 
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00879") }}</Label> <!-- HC 측 이면폭 치수 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM051" v-model="sendParam.ITEM051" :style="{ width: '90px' }"  />
                    <Input ref="ITEM052" v-model="sendParam.ITEM052" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM053" v-model="sendParam.ITEM053" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM054" v-model="sendParam.ITEM054" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM055" v-model="sendParam.ITEM055" :style="{ width: '90px' }"  /> 
                  </div>
                </div> 
              </v-col>
            </v-row> 
          </CardBody>
        </Card> 
      
    <!---------------------------------- 조립 --------------------------------------->
  
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00880") }}</CardTitle> <!-- 자산정보 -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters >
              <v-col :cols="12">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00881") }}</Label> <!-- WIPER PIN 조립유무,역조립 확인 -->
                  </div>
                  <div class="form-group">
                    <DropDownList
                      ref="ITEM056"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM056"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM057"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM057"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM058"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM058"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM059"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM059"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM060"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM060"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00882") }}</Label> <!-- NIPPLE TYPE, 각도 확인 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM061" v-model="sendParam.ITEM061" :style="{ width: '90px' }"  />
                    <Input ref="ITEM062" v-model="sendParam.ITEM062" :style="{ width: '90px' }"  />


                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00883") }}</Label> <!-- PIN BUSH 압입 깊이 확인 -->
                  </div>
                  <div class="form-group">
                    <Input ref="ITEM063" v-model="sendParam.ITEM063" :style="{ width: '90px' }"  />
                    <Input ref="ITEM064" v-model="sendParam.ITEM064" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM065" v-model="sendParam.ITEM065" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM066" v-model="sendParam.ITEM066" :style="{ width: '90px' }"  /> 
                    <Input ref="ITEM067" v-model="sendParam.ITEM067" :style="{ width: '90px' }"  /> 
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00884") }}</Label> <!-- 고객품번타각 : 명확하고 누락없을 것 -->
                    <DropDownList
                      ref="ITEM068"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM068"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00885") }}</Label> <!-- SER.NO 타각 : 명확하고 누락없을 것 -->
                    <Input ref="ITEM069" v-model="sendParam.ITEM069" :style="{ width: '90px' }"  />
                  </div>
                </div> 
              </v-col>
            </v-row> 
          </CardBody>
        </Card> 
      
    <!---------------------------------- 방청 --------------------------------------->
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00886") }}</CardTitle> <!-- 방청 -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters >
              <v-col :cols="12">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00887") }}</Label> <!-- HC, KL, NIPPLE 방청상태 확인 -->
                    <Input ref="ITEM070" v-model="sendParam.ITEM070" :style="{ width: '90px' }"  />
                    <DropDownList
                      ref="ITEM071"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM071"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00888") }}</Label> <!-- 방청유 도포 위치 및 상태 확인 -->
                  </div>
                  <div class="form-group">
                    <DropDownList
                      ref="ITEM072"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM072"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM073"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM073"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM074"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM074"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM075"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM075"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM076"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM076"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                </div> 
              </v-col>
            </v-row> 
          </CardBody>
        </Card> 
     
    <!---------------------------------- 포장 --------------------------------------->
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00889") }}</CardTitle> <!-- 포장 -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters >
              <v-col :cols="12">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00890") }}</Label> <!-- 이종품 스티커, 라벨 부착유무 확인 -->
                  </div>
                  <div class="form-group">
                    <DropDownList
                      ref="ITEM077"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM077"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM078"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM078"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM079"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM079"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM080"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM080"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                    <DropDownList
                      ref="ITEM081"
                      :style="{ width: '90px' }"
                      :data-items="resultTypeList"
                      :text-field="'text'"
                      :data-item-key="'id'"
                      :value-field="'id'"
                      :value="sendParam.ITEM081"
                      :value-primitive="true"
                      @change="comboChange"
                    />
                  </div>
                </div> 
              </v-col>
            </v-row> 
          </CardBody>
        </Card> 
      
    <!-------------------------------- 밀착력 TEST --------------------------------------->
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00891") }}</CardTitle> <!-- 밀착력 TEST -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row no-gutters >
              <v-col :cols="12">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00892") }}</Label> <!-- SER.NO -->
                    <Input ref="ITEM082" v-model="sendParam.ITEM082" :style="{ width: '100px' }"  />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00893") }}</Label> <!-- TUBE -->
                    <Input ref="ITEM086" v-model="sendParam.ITEM086" :readonly="true" :style="{ width: '200px' }" :class="'k-readonly'" />                    
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px'}" @click="fileUpload('ITEM086')"
                    > {{$t("MES_CommLang.MES_CommLang_00760")}}</Button> <!-- 첨부 -->
                    <Input 
                      ref="ITEM086File"
                      :type="'file'"
                      :style="{ display:'none' }"
                      @change="e => fileChange(e, 'ITEM086')"
                    />
                  </div>
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00894") }}</Label> <!-- 도막두께 -->
                    <Input ref="ITEM083" v-model="sendParam.ITEM083" :style="{ width: '100px' }"  />
                  </div> 
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00895") }}</Label> <!-- 시편 -->
                    <Input ref="ITEM088" v-model="sendParam.ITEM088" :readonly="true" :style="{ width: '200px' }" :class="'k-readonly'" />
                    <Button :theme-color="'primary'" :style="{ marginLeft: '5px'}" @click="fileUpload('ITEM088')"
                    >{{$t("MES_CommLang.MES_CommLang_00760")}}</Button> <!-- 첨부 -->
                    <Input 
                      ref="ITEM088File"
                      :type="'file'"
                      :style="{ display:'none' }"
                      @change="e => fileChange(e, 'ITEM088')"
                    />
                  </div> 
                  <div class="form-group">
                    <Label>{{ $t("MES_CommLang.MES_CommLang_00894") }}</Label> <!-- 도막두께 -->
                    <Input ref="ITEM084" v-model="sendParam.ITEM084" :style="{ width: '100px' }"  />
                  </div> 
                </div>         
              </v-col>
            </v-row> 
          </CardBody>
        </Card> 
     
    <!-------------------------------- 특이사항 --------------------------------------->
        <v-col cols="6" align="left">
            <CardTitle style="margin-bottom: 0px; margin-top: 10px">{{ $t("MES_CommLang.MES_CommLang_00896") }}</CardTitle> <!-- 특이사항 -->
        </v-col>
        <Card ref="gridCard">
          <CardBody :style="{ width: '100%'}">
            <v-row class="search-box" align="center" no-gutters>  
              <v-col :cols="12">
                <TextArea ref="ITEM085" v-model="sendParam.ITEM085" :style="{ width: '100%', height: '153px', margin:'10px 0' }"
                      ></TextArea>
              </v-col> 
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-col :cols="12" :class="'divListWapper'" style="margin-top: 8px; height: 40%;">
      <v-row no-gutters>
          <v-col cols="6" align="left">
              <CardTitle style="margin-bottom: 10px;">{{ $t("MES_CommLang.MES_CommLang_00897") }}</CardTitle> <!-- 세부내역 -->
          </v-col>
          <v-col cols="6" align="right">
            <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">{{ $t("MES_CommLang.MES_CommLang_00411") }}</Button>
          </v-col>
      </v-row>
      <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
            <KendoGrid
            ref="rowGrid"
            :gridHeight="gridHeight"
            :gridItems="gridData"
            :sortable="true"
            :columns="gridHeader"
          :resizable="false"
            :edit-field="'inEdit'"
            :selected-field="selectedField"
            @gridButtonClick="gridButtonClick"
            @gridddchang="rowDdChange"
            @griditemchange="griditemchange"
          />
      </div>
    </v-col>
    <v-col align="right">
      <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn">{{ $t("MES_CommLang.MES_CommLang_00414") }}</Button> <!-- 저장 -->
      <Button :theme-color="'primary'" :size="'medium'" @click="showUbiform">{{ $t("MES_CommLang.MES_CommLang_00854") }}</Button> <!-- 출력 -->
    </v-col>

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
    <SelectEquipmentModal
      ref="SelectEquipmentModal"
      v-if="SelectEquipmentModalVisible"
      :visibleDialog="SelectEquipmentModalVisible"
      @visibleDialog="(val) => (SelectEquipmentModalVisible = val)"
      @selectedRow="selectedEquipment"
    />
    <WindowPop ref="windowPop" :formName="'PaintingInspectionReport'"></WindowPop>
    </Dialog>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import Utility from '~/plugins/utility';
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import KendoGrid from "@/components/common/KendoGrid";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import AlertPop from "@/components/common/modal/AlertPop";
import InputText from "@/components/common/input/InputText";
import { TextArea, Input } from '@progress/kendo-vue-inputs';
import { DatePicker, TimePicker, DateTimePicker } from "@progress/kendo-vue-dateinputs";
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import GetUserModal from "@/components/common/modal/GetUserModal.vue";
import SelectProductModal from '@/components/frmInspectionReportDefinition/SelectProductModal.vue';
import SelectEquipmentModal from '@/components/frmPaintingInspection/SelectEquipmentModal.vue';
import WindowPop from '@/components/common/WindowPop';

export default { 
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Utility,
    Dialog,
    Card,
    CardBody,
    CardTitle,
    AlertPop,
    DialogActionsBar,
    Button,
    DropDownList,
    InputText,
    TextArea,
    Input,
    DatePicker,
    KendoGrid,
    GetUserModal,  // 사용자 팝업
    SelectProductModal,  // 품번 팝업
    SelectEquipmentModal, // 설비 팝업
    WindowPop,
   
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
      gridData: [],
      gridHeader: [],
      gridHeight: "400px",
      columns: [],
      selectedField: "selected",
      headerParam: {
        gridid: "dgvPaintingInspectionDetail", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      noFirstCheck: true,
      noRowstat: true,
      defaultValue: "",
      selectedField: "selected",
      UserModalVisible: false, // 의뢰자 팝업
      SelectProductModalVisible: false, // 품번 팝업
      SelectEquipmentModalVisible: false, // 설비 팝업
      inspectionResultTypeList: [], // 검사결과 유/무 콤보 리스트
      resultTypeList: [], // 검사결과 OK/NG 콤보 리스트
      uploadFile: '',
      selectedUserInput: '',
      inspectionUserId: '',
      inspectionUserName: '',
      productId: '',
      productName: '',
      lotCount: '',
      equipmentId: '',
      inspectionDate: '',
      fileList: [],
      // =========== 검사결과 ==============
      sendParam: {
        ITEM001: '',
        ITEM002: '',
        ITEM003: '',
        ITEM004: '',
        ITEM005: '',
        ITEM006: '',
        ITEM007: '',
        ITEM008: '',
        ITEM009: '',
        ITEM010: '',
        ITEM011: '',
        ITEM012: '',
        ITEM013: '',
        ITEM014: '',
        ITEM015: '',
        ITEM016: '',
        ITEM017: '',
        ITEM018: '',
        ITEM019: '',
        ITEM020: '',
        ITEM021: '',
        ITEM022: '',
        ITEM023: '',
        ITEM024: '',
        ITEM025: '',
        ITEM026: '',
        ITEM027: '',
        ITEM028: '',
        ITEM029: '',
        ITEM030: '',
        ITEM031: '',
        ITEM032: '',
        ITEM033: '',
        ITEM034: '',
        ITEM035: '',
        ITEM036: '',
        ITEM037: '', 
        ITEM038: '',
        ITEM039: '',
        ITEM040: '',
        ITEM041: '',
        ITEM042: '',
        ITEM043: '',
        ITEM044: '',
        ITEM045: '',
        ITEM046: '',
        ITEM047: '',
        ITEM048: '',
        ITEM049: '',
        ITEM050: '',
        ITEM051: '',
        ITEM052: '',
        ITEM053: '',
        ITEM054: '',
        ITEM055: '',
        ITEM056: '',
        ITEM057: '',
        ITEM058: '',
        ITEM059: '',
        ITEM060: '',
        ITEM061: '',
        ITEM062: '',
        ITEM063: '',
        ITEM064: '',
        ITEM065: '',
        ITEM066: '',
        ITEM067: '',
        ITEM068: '',
        ITEM069: '',
        ITEM070: '',
        ITEM071: '',
        ITEM072: '',
        ITEM073: '',
        ITEM074: '',
        ITEM075: '',
        ITEM076: '',
        ITEM077: '',
        ITEM078: '',
        ITEM079: '',
        ITEM080: '',
        ITEM081: '',
        ITEM082: '',
        ITEM083: '',
        ITEM084: '',
        ITEM085: '',
        ITEM086: '',
        ITEM087: 'PaintingInspection/TUBE/',
        ITEM088: '',
        ITEM089: 'PaintingInspection/SP/',
        ITEM090: '',
        ITEM091: '',
        ITEM092: '',
        ITEM093: '',
        ITEM094: '',
        ITEM095: '',
        ITEM096: '',
        ITEM097: '',
        ITEM098: '',
        ITEM099: '',
        ITEM100: '',
      },
      // ======= 개정내용 작성 =======
      confirmUserName: '',
      changeComment: '',
    }
  },
  computed: {

  },
  async mounted() {
    this.sendParam = JSON.parse(JSON.stringify(this.selectedRowData));
    this.sendParam.INSPECTIONDATE = this.isNullOrEmpty(this.sendParam.INSPECTIONDATE)?new Date():this.sendParam.INSPECTIONDATE;
    await this.getInspectionResultTypeData();
    await this.getResultTypeData();
    await this.getGridData();
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },

    // 사용자 선택 팝업
    selectUserModal(name){
      this.UserModalVisible = true;
      this.selectedUserInput = name;
    },

    // 사용자 선택
    selectUser(data) {
      if(this.selectedUserInput=='grid'){
        this.gridData.filter(x => x.idx == this.selectedIndex).map(x => {
          x.CONFIRMUSERID = data.userId;
          x.CONFIRMUSERNAME = data.name;
        })
      }else{
        this.sendParam.INSPECTIONUSERNAME = data.name;
        this.sendParam.INSPECTIONUSERID = data.userId;
      }
    },


    // 그리드 사용자 검색 버튼
    gridButtonClick(e, name, item){
      this.UserModalVisible = true;
      this.selectedUserInput = 'grid';
      this.selectedIndex = item.idx;
    },

    // 품번 선택
    selectedRow(data) {
      this.sendParam.PRODUCTID = data.PRODUCTID;
      this.sendParam.PRODUCTNAME = data.PRODUCTNAME;
    },

    // 설비 선택
    selectedEquipment(data) {
      this.sendParam.EQUIPMENTID = data.EQUIPMENTID;
      this.sendParam.EQUIPMENTNAME = data.EQUIPMENTNAME; 
    },
    

    // combo change 이벤트
    comboChange(event){
      this.sendParam[event.component.$vnode.data.ref] = event.value;
    },

    // 검사일자 선택
    selectInspectionDate(event) {
      const data = {
        ...this.sendParam,
        INSPECTIONDATE: event.value,
      }
      this.sendParam = data;
    },

    // 개정일자 선택
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name == 'CHANGEDATE') {
        data[idx][name] = e.value
 
      }

      this.gridData = data;
    },


    // 인풋 데이터 변경
    griditemchange(e){
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value};
      this.gridData = data;
      this.gridData.map(x => {
        x.CHANGEDATE = new Date(x.CHANGEDATE);
      })
    },

    // 검사결과 유/무 Combo 데이터 
    async getInspectionResultTypeData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValue',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          enumid: 'InspectionResultType'
        }
      }).then(res => {
        this.inspectionResultTypeList = [{id: '' , text: ''}]
        res.map(x=>{
          this.inspectionResultTypeList.push({ id : x.ENUMVALUE, text : x.ENUMVALUENAME })
        })
      })
    },


    // 검사결과 OK/NG Combo 데이터 
    async getResultTypeData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValue',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          enumid: 'ResultType'
        }
      }).then(res => {
        this.resultTypeList = [{ id: '' , text: '' }]
        res.map(x=>{
          this.resultTypeList.push({ id : x.ENUMVALUE, text : x.ENUMVALUENAME })
        })
      })
    },

    // 파일 첨부
    fileUpload(name){
      this.$refs[name+'File']._input.click();
    },

    // 파일첨부 인풋 변경시
    fileChange(e, name){
      console.log(this.sendParam);
      const data = {
        ...this.sendParam
      };
      data[name] = this.fileTimestamp(e.target.files[0].name);
      this.sendParam = data;

      const fileList = {
        fileName: data[name],
        file: e.target.files[0],
        fileLocation: name == 'ITEM086'? 'PaintingInspection/TUBE/': 'PaintingInspection/SP/'
      }

      this.fileList = this.fileList.filter(x => x.fileLocation != fileList.fileLocation);
      this.fileList.push(fileList);
      console.log(this.fileList);
    },

    // 그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetPaintingInspecionDetailList",
        queryVersion: "00001",
        sendParam: {
            plantid: this.$auth.$state.user.plantId,  
            DATAKEY: this.sendParam.DATAKEY,
        },
        }).then((res) => {
        const data = res.map((x, idx) => {
            return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: false,
            newRow: false,
            disabledDate:true,
            CHANGEDATE: x.CHANGEDATE.substring(0,10),
            };
        });
        this.$nuxt.$emit("iccReset");
        this.gridData = data;
        this.gridOriData = data;
        });
    },

    saveBtn() {
      if (this.sendParam.INSPECTIONUSERID == "" || this.sendParam.INSPECTIONUSERID == null) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00299')); // 알림, 검사자를 선택해주세요.
        return;
      }

      if (this.sendParam.LOTCOUNT == "" || this.sendParam.LOTCOUNT == null) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00300')); // 알림, LOT수를 입력해주세요.
        return;
      }

      if (this.sendParam.PRODUCTID == "" || this.sendParam.PRODUCTID == null) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00149')); // 알림, 품번코드를 선택해주세요.
        return;
      }

      if (this.sendParam.EQUIPMENTID == "" || this.sendParam.EQUIPMENTID == null) {
        this.$refs.alertPop.show(this.$i18n.t('MES_CommLang.MES_CommLang_00456'), this.$i18n.t('MES_MsgLang.MES_MsgLang_00090')); // 알림, 설비를 선택해주세요.
        return;
      }

      const saveData = [{
        ...this.sendParam,
        _ROWSTATUS: this.sendParam.flag=="insert"?"C":"U",
        PLANTID: this.$auth.$state.user.plantId,
        INSPECTIONUSERID: this.sendParam.INSPECTIONUSERID, // 검사자
        LOTCOUNT: this.sendParam.LOTCOUNT,
        PRODUCTID: this.sendParam.PRODUCTID, // 품번
        EQUIPMENTID: this.sendParam.EQUIPMENTID, // 도장호기
        ITEM087: 'PaintingInspection/TUBE/',
        ITEM089: 'PaintingInspection/SP/',
        INSPECTIONDATE: new Date(this.sendParam.INSPECTIONDATE).getTime(),
        
        TYPE:'INSPECTION'
        }
      ];     

      this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          saveData.push({
            ...x,
            _ROWSTATUS: x.rowStat,
            DATAKEY: this.sendParam.DATAKEY,
            CHANGEDATE: x.CHANGEDATE.getTime(),
          });
        });

      
      if(this.mesFileUpload(this.fileList)){
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnPaintingInspection',
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

    // *********************   도장 완성검사 성적서 세부내역 작성 **********************


    addBtn() {
      const maxKey = this.gridData.map(x=> {return x.DATACOUNT});
      const dataCount = this.gridData.length>0? Math.max.apply(null,maxKey)+1:1;

      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = {
        inEdit: true, 
        newRow: true,
        selected: false, 
        PLANTID: this.$auth.$state.user.plantId, 
        rowStat: "C",
        _ROWSTATUS: "C",
        newRowUUid: newRowUUid,
        idx: this.gridData.length,
        change: true, // 검색 버튼 나오도록
        DATACOUNT: dataCount,
        CHANGEDATE: new Date(),
        CHANGECOMMENT: '',
        CONFIRMUSERID:'',
        CONFIRMUSERNAME: '',
      };
      this.gridData.push(dataItem);
      this.$nuxt.$emit('iccReset')
    },

    // 레포트 출력
    showUbiform(){
      const datasetList = {};
      const paramList = {};
      datasetList.dataset_0 = this.sendParam;

      this.gridData.map((x, idx) => {
        datasetList["dataset_"+Number(idx+1)] = x;
      })

      this.$refs.windowPop.show(datasetList, paramList);    
    }
    
  

  },
}

</script>