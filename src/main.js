function NaviMaker() {
  let _nodes = [],
    _naviRelation,
    _routeRelation;

  function findNode(target, nodes = []) {
    return nodes
      .map((node) =>
        node.name == target ? node : findNode(target, node.children)
      )
      .find((node) => (node || {}).name == target);
  }

  function findNodePath(target, nodes = []) {
    return nodes
      .map((node) =>
        node.name == target
          ? [node]
          : [node, findNodePath(target, node.children)].flat(Infinity)
      )
      .filter((nodes) => nodes.find((node) => node.name == target));
  }

  function stuff(tree, nodes){
    return tree.map(nodeName=>{
      const getNode = (nodeName)=>nodes.find(node=>node.name==nodeName)
      const type = typeof nodeName == 'string' ? 0 : [String,Array,Object].findIndex(constructor=>nodeName instanceof constructor)
      let node;
      switch(type){
        case 0:
          node = getNode(nodeName)
          break;
        case 1:
          node = getNode(nodeName[0])
          node&&(node.children = stuff(nodeName[1], nodes))
          break;
        case 2:
          node = {...getNode(nodeName.key)||{},...nodeName}
          node&&(node.children = stuff(nodeName.children, nodes))
          break;
      }
      return node
    })
  }

  const rules = {
    navi: {
      handler({ nodes, navi, routes } = {}) {
        return stuff(navi, nodes)
      },
    },
    route: {
      handler({ nodes, navi, routes } = {}) {
        return stuff(routes, nodes)
      },
    },
    crumb: {
      handler(nodeName, { nodes, navi } = {}) {
        const naviNodes = stuff(navi, nodes)
        return findNodePath(nodeName, naviNodes)
      },
    },
  };

  function init({ navi = [], routes = [], nodes = [] }={}) {
    _nodes = nodes;
    _naviRelation = navi;
    _routeRelation = routes;
  }

  const ctx = {
    init,
    getNavi(handler = rules.navi.handler) {
      return rules.navi.handler({nodes:_nodes,navi:_naviRelation, routes:_routeRelation})
    },
    getRoute(handler = rules.route.handler) {
      return rules.route.handler({nodes:_nodes,navi:_naviRelation, routes:_routeRelation})
    },
    getCrumb(nodeName, handler = rules.crumb.handler) {
      return rules.crumb.handler(nodeName, {nodes:_nodes,navi:_naviRelation, routes:_routeRelation})
    },
    getSitemap() {
      return _nodes;
    },
  };
  return Object.freeze(ctx);
}

// export default new NaviMaker();
module.exports = new NaviMaker()
