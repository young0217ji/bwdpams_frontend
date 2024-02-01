const util = {
  makeTreeData(items, expanded=true) {
    items = items.map((x) => {
      return {
        ...x,
        id: x.AREAID,
        text: x.AREANAME,
        children: [],
        // expanded: expanded 
      }
    })
    
    const rootItems = [];
    const lookup = {};
    for (const item of items) {
      const itemId   = item["AREAID"];
      const parentId = item["PARENTAREAID"];
      if (! lookup[itemId]) lookup[itemId] = { ["children"]: [] }
      lookup[itemId] = { ...item, ["children"]: lookup[itemId]["children"] }
      const TreeItem = lookup[itemId];
      if (parentId === null || parentId === undefined || parentId === "") {
          rootItems.push(TreeItem);
      } else {
        if (! lookup[parentId]) lookup[parentId] = { ["children"]: [] };
        lookup[parentId]["children"].push(TreeItem);
      }
    }

    setDepth(rootItems);

    return rootItems;
  },

  makeTreeData2(items, expanded=true) {
    items = items.map((x) => {
      return {
        ...x,
        id: x.REASONCODE,
        text: x.REASONCODENAME,
        children: [],
        // expanded: expanded 
      }
    })
    
    const rootItems = [];
    const lookup = {};
    for (const item of items) {
      const itemId   = item["REASONCODE"];
      const parentId = item["PARENTREASONCODE"];
      if (! lookup[itemId]) lookup[itemId] = { ["children"]: [] }
      lookup[itemId] = { ...item, ["children"]: lookup[itemId]["children"] }
      const TreeItem = lookup[itemId];
      console.log(TreeItem);
      if (parentId === null || parentId === undefined || parentId === "") {
          rootItems.push(TreeItem);
      } else {
        if (! lookup[parentId]) lookup[parentId] = { ["children"]: [] };
        lookup[parentId]["children"].push(TreeItem);
      }
    }
    console.log(rootItems);
    setDepth(rootItems);

    return rootItems;
  },

  makeTreeData3(items, expanded=true) {
    items = items.map((x) => {
      return {
        ...x,
        id: x.ID,
        text: x.NAME,
        children: [],
        // expanded: expanded 
      }
    })
    
    const rootItems = [];
    const lookup = {};
    for (const item of items) {
      const itemId   = item["ID"];
      const parentId = item["PARENTID"];
      if (! lookup[itemId]) lookup[itemId] = { ["children"]: [] }
      lookup[itemId] = { ...item, ["children"]: lookup[itemId]["children"] }
      const TreeItem = lookup[itemId];
      if (parentId === null || parentId === undefined || parentId === "") {
          rootItems.push(TreeItem);
      } else {
        if (! lookup[parentId]) lookup[parentId] = { ["children"]: [] };
        lookup[parentId]["children"].push(TreeItem);
      }
    }

    setDepth(rootItems);

    return rootItems;
  },

  makeTreeDataForMenu(items, expanded=true) {
    items = items.map((x) => {
      return {
        ...x,
        id: x.MENUID,
        text: x.MENUNAME,
        children: [],
        // expanded: expanded 
      }
    })
    
    const rootItems = [];
    const lookup = {};
    for (const item of items) {
      const itemId   = item["MENUID"];
      const parentId = item["PARENTMENUID"];
      if (! lookup[itemId]) lookup[itemId] = { ["children"]: [] }
      lookup[itemId] = { ...item, ["children"]: lookup[itemId]["children"] }
      const TreeItem = lookup[itemId];
      if (parentId === null || parentId === undefined || parentId === "") {
          rootItems.push(TreeItem);
      } else {
        if (! lookup[parentId]) lookup[parentId] = { ["children"]: [] };
        lookup[parentId]["children"].push(TreeItem);
      }
    }

    setDepth(rootItems);

    return rootItems;
  }
};

function setDepth(items, parentDepth) {

  items.forEach (function (item, idx) {
    item.depthValue = "middle";

    if(parentDepth !== undefined) {
      item.depth = parentDepth + 1;
    }
    else {
      item.depthValue = "first";
      item.depth = 0;
    }

    if(item.children && item.children.length > 0) {
      setDepth(item.children, item.depth);
    }
    else {
      item.depthValue = "last";
    }
  });
}
export default util;
