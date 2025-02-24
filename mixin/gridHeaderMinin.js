const Headers = {
  props: {},
  data() {
    return {
      gridHeaderData: [],
    };
  },
  created() {},
  async mounted() {
    await this.getHeader();
  },
  methods: {
    async getHeader() {
      let gridHeaderMergeItem;
      let gridMultiHeader = [];
      let width = 0;

      let editorType = '';
      if (this.$refs.divWrapper.offsetWidth > 1000) {
        width = Math.round(this.$refs.divWrapper.offsetWidth / 100);
      } else {
        width = Math.round(this.$refs.divWrapper.offsetWidth / 50);
      }

      let noRowStat = false;
      let noFirstCheck = false;
      if (
        (this.headerParam.noRowstat !== undefined &&
          this.headerParam.noRowstat) ||
        (this.noRowstat !== undefined && this.noRowstat)
      ) {
        noRowStat = true;
      }
      if (
        (this.headerParam.noFirstCheck !== undefined &&
          this.headerParam.noFirstCheck) ||
        (this.noFirstCheck !== undefined && this.noFirstCheck)
      ) {
        noFirstCheck = true;
      }

      await this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetGridInit',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          userid: 'manager',
          menugrouptype: 'UI',
          gridid: this.headerParam.gridid,
        },
      })
        .then(res => {
          const data = res.sort((a, b) => a.POSITION - b.POSITION);
          let totalWidth = 0;
          let realWidth = 0;
          res
            .filter(x => x.VISIBLEFLAG === 'Yes')
            .forEach(x => (totalWidth += parseFloat(x.GRIDCOLUMNSIZE)));

          const header = data
            .filter(x => x.VISIBLEFLAG === 'Yes')
            .map(x => {
              if (
                x.PRIMARYKEYFLAG === 'Yes' ||
                x.PRIMARYKEYFLAG === 'Y' ||
                x.PRIMARYKEYFLAG === 'True' ||
                x.PRIMARYKEYFLAG === true
              ) {
                x.PRIMARYKEYFLAG = true;
              } else {
                x.PRIMARYKEYFLAG = false;
              }

              let draggable = false;
              let cell = '';
              //CELL_TYPE 정의
              if (!x.PRIMARYKEYFLAG && x.EDITFLAG === 'Yes') {
                if (
                  x.CELLTYPE === 'EnumComboBox' ||
                  x.CELLTYPE === 'ComboBox'
                ) {
                  //ComboBox
                  cell = x.GRIDCOLUMNID;
                } else if (
                  x.CELLTYPE === 'YesNo' ||
                  x.CELLTYPE === 'ActiveState'
                ) {
                  //CheckBox
                  cell = x.GRIDCOLUMNID;
                } else if (x.CELLTYPE === 'Button') {
                  // Button
                  cell = x.CELLTYPE;
                }
              }

              //수정불가 체크박스
              if (!x.PRIMARYKEYFLAG && x.EDITFLAG === 'No') {
                if (x.CELLTYPE === 'YesNo' || x.CELLTYPE === 'ActiveState') {
                  cell = x.GRIDCOLUMNID;
                }
              }

              if (x.PRIMARYKEYFLAG) {
                cell = 'PRIMARYKEYFLAG';
              } else if (x.CHANGECELLTYPE) {
                console.log('x.CHANGECELLTYPE ==> ', x.CHANGECELLTYPE);
                cell = x.GRIDCOLUMNID;
              }

              //콤보박스 자동생성
              if (x.CELLTYPE === 'EnumComboBox') {
                this.headerParam.enumComboBox = this.headerParam.enumComboBox
                  ? this.headerParam.enumComboBox
                  : [];
                this.headerParam.enumComboBox.push({
                  dataVal: x.GRIDCOLUMNID,
                  dataItem: [],
                });

                if (!this.isNullOrEmpty(x.COMBOENUMID)) {
                  this.mesGet({
                    apiKey: 'mes/common/customquery',
                    queryId: 'GetEnumValue',
                    sendParam: {
                      plantid: this.$auth.$state.user.plantId,
                      enumid: x.COMBOENUMID,
                    },
                  }).then(data => {
                    this.headerParam.enumComboBox.find(
                      item => item.dataVal === x.GRIDCOLUMNID
                    ).dataItem = data;
                  });
                }
              }
              //체크박스 자동생성
              else if (
                x.CELLTYPE === 'YesNo' ||
                x.CELLTYPE === 'ActiveState' ||
                x.CELLTYPE === 'TrueFalse'
              ) {
                this.headerParam.checkBox = this.headerParam.checkBox
                  ? this.headerParam.checkBox
                  : [];
                this.headerParam.checkBox.push(x.GRIDCOLUMNID);
              }
              //사용자정의 컬럼 자동생성(화면에서 정의 필요함.)
              else if (x.CELLTYPE === 'Custom') {
                this.headerParam.customCell = this.headerParam.customCell
                  ? this.headerParam.customCell
                  : [];
                this.headerParam.customCell.push(x.GRIDCOLUMNID);
                cell = x.GRIDCOLUMNID;
              } else if (
                x.CELLTYPE === 'datePicker' ||
                x.CELLTYPE === 'searchBtn' ||
                x.CELLTYPE === 'TimePicker' ||
                x.CELLTYPE === 'DateTimePicker' ||
                x.CELLTYPE === 'File' ||
                x.CELLTYPE === 'FileDownload' ||
                x.CELLTYPE === 'Draggable' ||
                x.CELLTYPE === 'Tooltip' ||
                x.CELLTYPE === 'TooltipForReadOnly'
              ) {
                cell = x.CELLTYPE;
              }

              if (
                x.CELLTYPE === 'Number' ||
                x.CELLTYPE === 'Double' ||
                x.CELLTYPE === 'Double2'
              ) {
                this.editorType = 'numeric';
              } else {
                this.editorType = '';
              }

              let sysColWidth = 0;
              if (!noRowStat) {
                sysColWidth += 70;
              }
              if (!noFirstCheck) {
                sysColWidth += 40;
              }

              let cellWidth = 0;
              if (!this.headerParam.xOverflowYn) {
                cellWidth = Math.floor(
                  ((this.$refs.divWrapper.offsetWidth - sysColWidth) / 100) *
                    ((x.GRIDCOLUMNSIZE / totalWidth) * 100)
                );
              } else {
                cellWidth = x.GRIDCOLUMNSIZE;
              }

              realWidth += cellWidth;

              let align = '';
              if (x.ALIGN == 'Center') {
                align = 'gridTextCenter';
              } else if (x.ALIGN == 'Right') {
                align = 'gridTextRight';
              } else {
                align = 'gridTextLeft';
              }

              if (!this.isNullOrEmpty(x.CHILDGRIDID)) {
                // Multi Grid 설정
                this.getGirdMultiHeader(this.headerParam, x.CHILDGRIDID)
                  .then(res => {
                    gridMultiHeader.push({
                      MultiHeaderCol: x.GRIDCOLUMNID,
                      MultiHeader: res,
                    });
                  })
                  .then(res => {
                    this.setGirdMultiHeader(gridMultiHeader, header);
                  });

                return {
                  field: x.GRIDCOLUMNID,
                  title: x.GRIDCOLUMNNAME,
                  width: cellWidth,
                };
              }

              if (!this.isNullOrEmpty(x.HEADERMERGENAME)) {
                if (gridHeaderMergeItem == undefined) {
                  gridHeaderMergeItem = [
                    {
                      field: x.HEADERMERGENAME,
                      title: x.HEADERMERGENAME,
                      children: [],
                    },
                  ];
                } else {
                  let setFlag = false;
                  gridHeaderMergeItem.forEach(y => {
                    if (y.field == x.HEADERMERGENAME) {
                      setFlag = true;
                    }
                  });

                  // 없는 경우 생성, 있는 경우 Skip
                  if (setFlag == false) {
                    gridHeaderMergeItem.push({
                      field: x.HEADERMERGENAME,
                      title: x.HEADERMERGENAME,
                      children: [],
                    });
                  }
                }
              }

              return {
                field: x.GRIDCOLUMNID,
                editable: !x.PRIMARYKEYFLAG && x.EDITFLAG === 'Yes',
                title: x.GRIDCOLUMNNAME,
                width: cellWidth,
                cell: cell,
                // draggable: draggable,
                className: align,
                VISIBLEFLAG: x.VISIBLEFLAG,
                PRIMARYKEYFLAG: x.PRIMARYKEYFLAG,
                NOTNULLFLAG: x.NOTNULLFLAG,
                GRIDCOLUMNSIZE: x.GRIDCOLUMNSIZE,
                IsBoolean:
                  x.CELLTYPE === 'YesNo' || x.CELLTYPE === 'ActiveState',
                editor: this.editorType,
                childGrid: gridMultiHeader,
                HEADERMERGENAME: x.HEADERMERGENAME,
                locked: x.HEADERLOCKFLAG === 'Yes',
              };
            });

          if (!noRowStat) {
            const rowstat = {
              field: 'rowStat',
              editable: false,
              title: ' ',
              width: 70,
              cell: 'crudCellTemplate',
              className: 'gridTextCenter',
            };
            header.unshift(rowstat);
            realWidth += 70;
          }
          if (!noFirstCheck) {
            const chk = {
              field: 'selected',
              editable: true,
              width: 40,
              headerSelectionValue: this.areAllSelected,
              className: 'gridTextCenter',
            };
            header.unshift(chk);
            realWidth += 40;
          }

          if (
            totalWidth < this.$refs.divWrapper.offsetWidth &&
            !this.headerParam.xOverflowYn
          ) {
            header[header.length - 1].width =
              header[header.length - 1].width +
              (this.$refs.divWrapper.offsetWidth - 7 - realWidth);
          }

          this.gridHeader = header;
          this.headerParam.gridHeader = header;
        })
        .then(res => {
          if (gridHeaderMergeItem != undefined) {
            gridHeaderMergeItem.forEach(x => {
              let firstIndex = 0;

              this.gridHeader.forEach((y, idx) => {
                if (x.field == y.HEADERMERGENAME) {
                  if (firstIndex == 0) {
                    firstIndex = idx;
                  }
                  x.children.push(y);
                }
              });

              this.gridHeader = this.gridHeader.filter(
                y => x.field != y.HEADERMERGENAME
              );
              this.gridHeader.splice(firstIndex, 0, x);
            });
          }
        });
    },

    async setGirdMultiHeader(gridMultiHeader, header) {
      header.forEach(x => {
        gridMultiHeader.forEach(item => {
          if (item.MultiHeaderCol == x.field) {
            x.children = item.MultiHeader;
            console.log(
              'MultiHeader 구성 - 상위 Header ID : ',
              item.MultiHeaderCol
            );
          }
        });
      });
    },

    async getGirdMultiHeader(headerParam, gridID) {
      let gridMultiHeader = [];

      let editorType = '';

      let MultiHeader = [];

      await this.mesGet({
        apiKey: 'mes/common/customquery',
        queryId: 'GetGridInit',
        sendParam: {
          plantid: this.$auth.$state.user.plantId,
          userid: 'manager',
          menugrouptype: 'UI',
          gridid: gridID,
        },
      }).then(res => {
        const data = res.sort((a, b) => a.POSITION - b.POSITION);
        let totalWidth = 0;
        let realWidth = 0;
        res
          .filter(x => x.VISIBLEFLAG === 'Yes')
          .forEach(x => (totalWidth += parseFloat(x.GRIDCOLUMNSIZE)));

        const header = data
          .filter(x => x.VISIBLEFLAG === 'Yes')
          .map(x => {
            if (
              x.PRIMARYKEYFLAG === 'Yes' ||
              x.PRIMARYKEYFLAG === 'Y' ||
              x.PRIMARYKEYFLAG === 'True' ||
              x.PRIMARYKEYFLAG === true
            ) {
              x.PRIMARYKEYFLAG = true;
            } else {
              x.PRIMARYKEYFLAG = false;
            }

            let cell = '';
            //CELL_TYPE 정의
            if (!x.PRIMARYKEYFLAG && x.EDITFLAG === 'Yes') {
              if (x.CELLTYPE === 'EnumComboBox' || x.CELLTYPE === 'ComboBox') {
                //ComboBox
                cell = x.GRIDCOLUMNID;
              } else if (
                x.CELLTYPE === 'YesNo' ||
                x.CELLTYPE === 'ActiveState'
              ) {
                //CheckBox
                cell = x.GRIDCOLUMNID;
              } else if (x.CELLTYPE === 'Button') {
                // Button
                cell = x.CELLTYPE;
              }
            }

            //수정불가 체크박스
            if (!x.PRIMARYKEYFLAG && x.EDITFLAG === 'No') {
              if (x.CELLTYPE === 'YesNo' || x.CELLTYPE === 'ActiveState') {
                cell = x.GRIDCOLUMNID;
              }
            }

            if (x.PRIMARYKEYFLAG) {
              cell = 'PRIMARYKEYFLAG';
            } else if (x.CHANGECELLTYPE) {
              console.log('x.CHANGECELLTYPE ==> ', x.CHANGECELLTYPE);
              cell = x.GRIDCOLUMNID;
            }

            //콤보박스 자동생성
            if (x.CELLTYPE === 'EnumComboBox') {
              headerParam.enumComboBox = headerParam.enumComboBox
                ? headerParam.enumComboBox
                : [];
              headerParam.enumComboBox.push({
                dataVal: x.GRIDCOLUMNID,
                dataItem: [],
              });

              if (!this.isNullOrEmpty(x.COMBOENUMID)) {
                this.mesGet({
                  apiKey: 'mes/common/customquery',
                  queryId: 'GetEnumValue',
                  sendParam: {
                    plantid: this.$auth.$state.user.plantId,
                    enumid: x.COMBOENUMID,
                  },
                }).then(data => {
                  headerParam.enumComboBox.find(
                    item => item.dataVal === x.GRIDCOLUMNID
                  ).dataItem = data;
                });
              }
            }
            //체크박스 자동생성
            else if (
              x.CELLTYPE === 'YesNo' ||
              x.CELLTYPE === 'ActiveState' ||
              x.CELLTYPE === 'TrueFalse'
            ) {
              headerParam.checkBox = headerParam.checkBox
                ? headerParam.checkBox
                : [];
              headerParam.checkBox.push(x.GRIDCOLUMNID);
            }
            //사용자정의 컬럼 자동생성(화면에서 정의 필요함.)
            else if (x.CELLTYPE === 'Custom') {
              headerParam.customCell = headerParam.customCell
                ? headerParam.customCell
                : [];
              headerParam.customCell.push(x.GRIDCOLUMNID);
              cell = x.GRIDCOLUMNID;
            } else if (
              x.CELLTYPE === 'datePicker' ||
              x.CELLTYPE === 'searchBtn' ||
              x.CELLTYPE === 'TimePicker' ||
              x.CELLTYPE === 'DateTimePicker' ||
              x.CELLTYPE === 'File' ||
              x.CELLTYPE === 'FileDownload' ||
              x.CELLTYPE === 'Draggable' ||
              x.CELLTYPE === 'Tooltip' ||
              x.CELLTYPE === 'TooltipForReadOnly'
            ) {
              cell = x.CELLTYPE;
            }

            if (
              x.CELLTYPE === 'Number' ||
              x.CELLTYPE === 'Double' ||
              x.CELLTYPE === 'Double2'
            ) {
              editorType = 'numeric';
            } else {
              editorType = '';
            }

            let cellWidth = x.GRIDCOLUMNSIZE;

            realWidth += cellWidth;

            let align = '';
            if (x.ALIGN == 'Center') {
              align = 'gridTextCenter';
            } else if (x.ALIGN == 'Right') {
              align = 'gridTextRight';
            } else {
              align = 'gridTextLeft';
            }

            if (!this.isNullOrEmpty(x.CHILDGRIDID)) {
              // Multi Grid 설정
              this.getGirdMultiHeader(this.headerParam, x.CHILDGRIDID)
                .then(res => {
                  gridMultiHeader.push({
                    MultiHeaderCol: x.GRIDCOLUMNID,
                    MultiHeader: res,
                  });
                })
                .then(res => {
                  this.setGirdMultiHeader(gridMultiHeader, header);
                });

              return {
                field: x.GRIDCOLUMNID,
                title: x.GRIDCOLUMNNAME,
              };
            }

            return {
              field: x.GRIDCOLUMNID,
              editable: !x.PRIMARYKEYFLAG && x.EDITFLAG === 'Yes',
              title: x.GRIDCOLUMNNAME,
              width: cellWidth,
              cell: cell,
              className: align,
              VISIBLEFLAG: x.VISIBLEFLAG,
              PRIMARYKEYFLAG: x.PRIMARYKEYFLAG,
              NOTNULLFLAG: x.NOTNULLFLAG,
              GRIDCOLUMNSIZE: x.GRIDCOLUMNSIZE,
              IsBoolean: x.CELLTYPE === 'YesNo' || x.CELLTYPE === 'ActiveState',
              editor: editorType,
              childGrid: gridMultiHeader,
              locked: x.HEADERLOCKFLAG === 'Yes',
            };
          });

        MultiHeader = header;
      });

      return MultiHeader;
    },
  },
  watch: {},
};

export default Headers;
