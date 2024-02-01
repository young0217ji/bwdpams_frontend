import { mapState, mapMutations, mapActions } from "vuex";
import 'hammerjs';
import AlertPop from "@/components/common/modal/AlertPop";
import ConfirmPop from "@/components/common/modal/ConfirmPop";
import Utility from "~/plugins/utility";
import XLSX from 'xlsx';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      drawer: state => state.drawer,
      // gridHeader: state => state.modules.gridHeader
    }),
  },
  watch: {
  },
  components:{
    AlertPop,
    ConfirmPop,
    Utility,
    XLSX,
    saveAs,
  },
  beforeCreate() {},
  created() {
    this.$nuxt.$on('destroyStore', () => {
      this.resetAction()
    });
    this.$nuxt.$on('destroyStoreFPRC', () => {
      this.resetPRCAction()
    });
  },
  mounted() {
    this.layoutInit();
  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
      postApi: "modules/list/postApi",
      postUpdateApi: "modules/list/postUpdateApi",
      postApiReturn: "modules/list/postApiReturn",
      setTree: "modules/list/setTree",
      getListReturn: "modules/list/getListReturn",
      postInsertReturn: "modules/list/postInsertReturn",
      putUpdateReturn: "modules/list/putUpdateReturn",
      deleteDeleteReturn: "modules/list/deleteDeleteReturn",
      mesGet: "modules/list/mesGet",
      mesPost: "modules/list/mesPost",
      excelGet: "modules/list/excelGet",
      mesFileUpload: "modules/list/mesFileUpload",
      resetAction: "modules/frmRouteEvent/lotInfoAction",
      resetPRCAction: "modules/frmPRC/resetPRCAction"
      // getHader: "modules/gridHeader/getHaderAction",
    }),
    layoutInit() {
      if(this.$refs.searchFilter){
        if(this.$refs.contents){
          const searchFilterHeight = this.$refs.searchFilter.offsetHeight;
          this.$refs.contents.style.height = `calc(100% - ${searchFilterHeight}px)`;
        }
      }else if(this.$refs.contents){
        this.$refs.contents.style.height = `calc(100%)`;
      }
    },
    setPer(warp, percentage){
      return Math.round(this.$refs[warp].offsetWidth / 100) * percentage;
    },
    //mes 저장시 정합성 체크 함수
    //input : gridHeader(그리드 헤더/columns), gridData(그리드 데이터/gridItems)
    mesValidation(gridHeader, gridData){      
      let inputvalue = this.$i18n.t('MES_MsgLang.MES_MsgLang_00115');
      let overlapvalue = this.$i18n.t('MES_MsgLang.MES_MsgLang_00116');
      let result = {
        isValidate: true,
        code: "0",
        msg: "",
        field: [],
        title: []
      };

      const pkCol = gridHeader.filter(x => x.PRIMARYKEYFLAG);
      const notNullCol = gridHeader.filter(x => x.NOTNULLFLAG);

      //검사할 컬럼이 없음
      if((pkCol === undefined || pkCol.lenght === 0)
       && (notNullCol === undefined || notNullCol.lenght === 0)){
        return result;
      }

      //검사할 데이터가 없음
      if(gridData === undefined || gridData.lenght === 0){
        return result;
      }
  
      gridData.filter(x => x.rowStat === "C" || x.rowStat === "U").some(function (item) {
        pkCol.some(function (col) {
          //pk항목이 없거나 데이터 세팅이 되지 않음
          if(item[col.field] === undefined || item[col.field] === null || item[col.field].toString() === "") {
            result.isValidate = false;
            result.code = "1";
            result.msg = col.title + inputvalue;
            result.field.push(col.field);
            result.title.push(col.title);
  
            return true;
          }
        });
  
        if(!result.isValidate) {
          return true;
        }
  
        notNullCol.some(function (col) {
          //not null 항목이 없거나 데이터 세팅이 되지 않음
          if(item[col.field] === undefined || item[col.field] === null || item[col.field].toString() === "") {
            result.isValidate = false;
            result.code = "2";
            result.msg = col.title + inputvalue;
            result.field.push(col.field);
            result.title.push(col.title);
  
            return true;
          }
        });
  
        if(!result.isValidate) {
          return true;
        }
        
        //pk중복 체크는 pk컬럼이 있어야 수행한다.
        if(pkCol.length === 0) {
          return true;
        }

        gridData.filter(x => x.rowStat !== "D").some(function (item2) {
          if(item !== item2){
            let temp = {
              field: [],
              title: []
            };
            pkCol.some(function (col) {
              //pk항목의 값이 동일한 경우
              if(item[col.field] === item2[col.field]) {
                temp.field.push(col.field);
                temp.title.push(col.title);
              }
            });
  
            //총 pk컬럼의 수와 중복되는 pk컬럼의 수가 동일한 경우
            if(pkCol.length === temp.field.length) {
              result.isValidate = false;
              result.code = "3";
  
              result.msg = temp.title.join("/ ") + overlapvalue;
              result.field = temp.field;
              result.title = temp.title;
  
              return true;
            }
          }
          
        });
      });
  
      return result;
    },
    resizeGridWidth(gridRef, headerParam) {
      let totalWidth = 0;
      const offsetWidth = gridRef.offsetWidth;

      const data = headerParam.gridHeader.filter(x => x.field !== "rowStat" && x.field !== "selected");
      data.forEach((x => totalWidth += parseFloat(x.GRIDCOLUMNSIZE)));

      data.forEach((x) => {
        
        let sysColWidth = 0;
        if(!headerParam.noRowstat){
          sysColWidth += 70;
        }
        if(!headerParam.noFirstCheck){
          sysColWidth += 40;
        }
        
        const cellWidth = Math.floor(((offsetWidth - sysColWidth - 10) / 100) * ((x.GRIDCOLUMNSIZE / totalWidth) * 100));

        x.width = cellWidth;
      });
    },
    isEmptyObject(obj) {
      return Object.keys(obj).length === 0;
    },
    isNullOrEmpty(val) {
      if(val === undefined || val === null || val.toString() === "") {
        return true;
      }
      else {
        return false;
      }
    },
    parseChkValToTF(val) {
      if(val === true || val === "Yes" || val === "Active" || val === "True") {
        return true;
      }
      else {
        return false;
      }
    },
    parseTFToYN(val) {
      if(val === true || val === "Yes") {
        return "Yes";
      }
      else {
        return "No";
      }
    },
    parseTFToAIA(val) {
      if(val === true || val === "Active") {
        return "Active";
      }
      else {
        return "Inactive";
      }
    },
    parseNullOrUndefinedToBlank(val) {
      if(val === undefined || val === null) {
        return "";
      }
      else {
        return val;
      }
    },
    //데이터 원상복구시 "수정" 항목 제거
    gfn_ChkOriginalData(gridHeader, gridData, gridOriData, idx) {
      const newRow = gridData.filter(x => x.rowStat === "C").length;
      const realIdx = idx - newRow < 0 ? 0: idx - newRow;
      const data = JSON.parse(JSON.stringify(gridData.filter(x => x.rowStat !== "C")));

      function parseNullOrUndefinedToBlank(val) {
        if(val === undefined || val === null) {
          return "";
        }
        else {
          return val;
        }
      }

      function parseChkValToTF(val) {
        if(val === true || val === "Yes" || val === "Active" || val === "True") {
          return true;
        }
        else {
          return false;
        }
      }

      const chkArr = gridHeader.filter((x) => {
        if(x.IsBoolean) {
          return parseChkValToTF(data[realIdx][x.field]) !== parseChkValToTF(gridOriData[realIdx][x.field]);
        }
        else if(x.cell === 'DateTimePicker'){
          return parseNullOrUndefinedToBlank(Utility.setFormatDate(data[realIdx][x.field]), "YYYYMMDDHHmmss") !== parseNullOrUndefinedToBlank(Utility.setFormatDate(gridOriData[realIdx][x.field]), "YYYYMMDDHHmmss") && x.field !== "selected" && x.field !== "rowStat";
        }
        else {
          return parseNullOrUndefinedToBlank(data[realIdx]?.[x.field]) !== parseNullOrUndefinedToBlank(gridOriData[realIdx]?.[x.field]) && x.field !== "selected" && x.field !== "rowStat";
        }
      });
      return chkArr.length > 0;
    },
    gfn_sortChangeHandler(gridData, e, numberColumns = [], checkColumns = []) {
      const isAscending = e.sort[0]?.dir == "asc";

      function parseValueSortable(val, field, numberColumns = [], checkColumns = []) {
        if(numberColumns.includes(field) && $.isNumeric(val)) {
          const result = parseFloat(val);
          return result;
        }
        else if(checkColumns.includes(field)) {
          if(val === true || val === "Yes" || val === "Active" || val === "True") {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return val;
        }
      }

      if(isAscending){
        gridData = gridData.sort(
          (a,b) => parseValueSortable(a[e.event?.field], e.event?.field, numberColumns, checkColumns) < parseValueSortable(b[e.event?.field], e.event?.field, numberColumns, checkColumns) ? -1 : parseValueSortable(a[e.event?.field], e.event?.field, numberColumns, checkColumns) > parseValueSortable(b[e.event?.field], e.event?.field, numberColumns, checkColumns) ? 1 : 0)
      }else{
        gridData = gridData.sort(
          (a,b) => parseValueSortable(a[e.event?.field], e.event?.field, numberColumns, checkColumns) > parseValueSortable(b[e.event?.field], e.event?.field, numberColumns, checkColumns) ? -1 : parseValueSortable(a[e.event?.field], e.event?.field, numberColumns, checkColumns) < parseValueSortable(b[e.event?.field], e.event?.field, numberColumns, checkColumns) ? 1 : 0)
      }
    },
    init() {},
    DateToYYYYMMDDString(date){
      const returnDate = new Date(date);
      returnDate.setHours(returnDate.getHours()+9);
      return returnDate.toISOString().substring(0,4)+returnDate.toISOString().substring(5,7)+returnDate.toISOString().substring(8,10);
    },

    reorderData(event, items, activeItem, moveStat) {

      let dropPosition = "";
      let reorderedData = items;
      let dropItemId = event.originalEvent.target.parentElement.rowIndex;
      if(dropItemId === undefined){
        dropItemId = event.originalEvent.target.parentElement.parentElement.rowIndex; // 아이콘영역의 부모 rowIdx
      }

      if (dropItemId || dropItemId === 0) { // dropItemId가 0이면 false 던져서 조건추가
        const activeItemIndex = activeItem.idx;
        const hoveredItemIndex = reorderedData.findIndex(
          (i) => i.idx === dropItemId
        );
        if (activeItemIndex !== hoveredItemIndex || (moveStat === "move" || moveStat === "org")) {
          if(moveStat === "org") {
            reorderedData.splice(activeItemIndex, 1);
          } else {
            if (moveStat === "none") {
              reorderedData.splice(activeItemIndex, 1);
            }
            if (activeItemIndex > hoveredItemIndex) {
              dropPosition = "above";
            } else if(activeItemIndex < hoveredItemIndex) {
              dropPosition = "below";
            } else if(activeItemIndex === hoveredItemIndex && moveStat === "move") {
              dropPosition = "below";
            }
            if (
              dropPosition === "above" &&
              hoveredItemIndex !== 0 &&
              hoveredItemIndex < activeItemIndex
              ) {
              reorderedData.splice(hoveredItemIndex, 0, {
                ...activeItem,
              });
            } else if (dropPosition === "above" && hoveredItemIndex === 0) {
              reorderedData.unshift({ ...activeItem });
            } else if (
              dropPosition === "above" &&
              hoveredItemIndex !== 0 &&
              hoveredItemIndex > activeItemIndex
              ) {
              reorderedData.splice(hoveredItemIndex - 1, 0, {
                ...activeItem,
              });
            } else if (
              dropPosition === "below" &&
              hoveredItemIndex !== 0 &&
              hoveredItemIndex < activeItemIndex
              ) {
              reorderedData.splice(hoveredItemIndex + 1, 0, {
                ...activeItem,
              });
            } else if (
              dropPosition === "below" &&
              hoveredItemIndex !== 0 &&
              hoveredItemIndex > activeItemIndex
              ) {
              reorderedData.splice(hoveredItemIndex, 0, {
                  ...activeItem,
              });
            } else if (
              dropPosition === "below" &&
              hoveredItemIndex === activeItemIndex &&
              moveStat === "move"
              ) {
              reorderedData.splice(hoveredItemIndex, 0, {
                  ...activeItem,
              });
            }
          }
        }
      }
      return reorderedData;
    },
    
    getTargetTopOffSet(event) {
      if (
        event.originalEvent.target.className !== "k-drop-hint-line" &&
        event.originalEvent.target.className !== "k-drop-hint k-drop-hint-h"
      ) {
      return event.offsetY >=
        event.originalEvent.target.parentElement.clientHeight / 2
        ? event.originalEvent.target.parentElement.offsetTop +
          document.querySelector(".k-grid-header").offsetHeight +
          document.querySelector(".k-grid").offsetTop +
          event.originalEvent.target.parentElement.clientHeight
        : event.originalEvent.target.parentElement.offsetTop +
          document.querySelector(".k-grid-header").offsetHeight +
          document.querySelector(".k-grid").offsetTop;
      }
    },

    // PIVOT 동적 컬럼 EXCEL 다운로드
    getPivotExcel(gridHeader, gridData, fileName){ // HEADER, DATA, 다운로드할 파일명
      const header = [];
      gridHeader.filter(x=> x.field!='selected' && x.field!='rowStat').map(x => {
        header.push({
          field:x.field,
          name:x.title
        })
      });

      const excelData = [];
      gridData.map(x => {
        const excelRow = {};
        header.map(y => {
          excelRow[y.name] = x[y.field]
        });
        excelData.push(excelRow);
      })
        
      const sheet = XLSX.utils.json_to_sheet(excelData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet);

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(excelBlob, fileName.concat('.xlsx'));


    },
    currentTimeStamp(){
      const format = (num) => {
        return num < 10 ? '0'.concat(String(num)) : String(num);
      }
      const date = new Date();
      return String(date.getFullYear())
           + format(date.getMonth()+1)
           + format(date.getDate())
           + format(date.getHours())
           + format(date.getMinutes())
           + format(date.getSeconds());
    },
    fileTimestamp(fileName){
      const orgName = fileName.substring(0,fileName.lastIndexOf("."));
      const ext = fileName.substring(fileName.lastIndexOf(".")+1);
      return orgName.concat("_").concat(this.currentTimeStamp()).concat(".").concat(ext);
    }
  }
};
