const util2 = {
  makeTreeData(items, itemid, parentid, expanded = true) {
    items = items.map(x => {
      return {
        ...x,
        id: x[itemid],
        children: [],
      };
    });
    const rootItems = [];
    const lookup = {};
    for (const item of items) {
      const itemId = item[itemid];
      const parentId = item[parentid];

      if (!lookup[itemId]) {
        lookup[itemId] = { ['children']: [] };
      }

      lookup[itemId] = { ...item, ['children']: lookup[itemId]['children'] };
      const TreeItem = lookup[itemId];
      if (parentId === null || parentId === undefined || parentId === '') {
        rootItems.push(TreeItem);
      } else {
        if (!lookup[parentId]) {
          lookup[parentId] = { ['children']: [] };
        }

        lookup[parentId]['children'].push(TreeItem);
      }
    }

    setDepth(rootItems);

    return rootItems;
  },
};

function setDepth(items, parentDepth) {

  items.forEach(function (item, idx) {
    item.depthValue = "middle";

    if (parentDepth !== undefined) {
      item.depth = parentDepth + 1;
    }
    else {
      item.depthValue = "first";
      item.depth = 0;
    }

    if (item.children && item.children.length > 0) {
      setDepth(item.children, item.depth);
    }
    else {
      item.depthValue = "last";
    }
  });
}
export default util2;
