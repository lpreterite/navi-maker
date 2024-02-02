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
    .filter((nodes) => nodes.find((node) => node.name == target))
    .flat();
}

function stuff(tree, nodes, opts={}){
  const nodeTypes = ['string','array', 'object']
  const {
    handler=({targetName,nodes})=>nodes.find(node=>node.name==targetName),
    level=0
  } = opts
  return tree.map(nodeName=>{
    const getNode = opts=>handler(opts)
    const type = typeof nodeName == 'string' ? 0 : [String,Array,Object].findIndex(constructor=>nodeName instanceof constructor)
    let result, node;
    switch(type){
      case 0:
        node = { name: nodeName, nodeType:nodeTypes[type] }
        result = getNode({targetName:nodeName,level,nodes,node})
        break;
      case 1:
        node = { name: nodeName[0], nodeType:nodeTypes[type], children:nodeName[1]  }
        result = getNode({targetName:nodeName[0],level,nodes, node})
        result&&(result.children = stuff(nodeName[1], nodes, {level:level+1, handler}))
        break;
      case 2:
        node = { nodeType:nodeTypes[type], children:[], ...(nodeName||{}) }
        if(typeof node.name === 'undefined'){ throw new Error("树节点为Object时，必须带上name属性") }
        result = getNode({targetName:node.name,level,nodes, node})
        result&&(result.children = stuff(node.children, nodes, {level:level+1, handler}))
        break;
    }
    if(!result) throw new Error(`在Nodes资源中找不到名为${nodeName}的节点！`)
    return result
  })
}

function NaviMaker() {
  let _nodes = [],
    _naviRelation,
    _routeRelation;

  const rules = {
    navi: {
      //遍历节点，并处理输出的方法
      handler({node,targetName,nodes,level,type}){
        let result = nodes.find(node=>node.name==targetName)
        if(!!result){
          const { title,redirect } = result.meta
          result = {
            ...result,
            ...(node||{}),
            level,
            type,
            title,
            path: (node||{}).path || redirect,
            children: result.children||[],
          }
        }
        return result ? result : undefined
      }
    },
    route: {
      //遍历节点，并处理输出的方法
      handler({targetName,nodes}){
        let node = nodes.find(node=>node.name==targetName)
        return node ? { ...node, children:node.children||[] } : undefined
      }
    },
    crumb: {
      //遍历节点，并处理输出的方法
      handler({node,targetName,nodes,level}){
        let result = nodes.find(node=>node.name==targetName)
        if(!!result){
          const {title,redirect} = result.meta||{}
          result = {
            ...result,
            ...(node||{}),
            level,
            title,
            path: (node||{}).path || redirect
          }
        }
        return result ? result : undefined
      }
    },
    sitemap: {
      handler(node){
        return node
      }
    }
  };

  function init({ navi = [], routes = [], nodes = [] }={}) {
    _nodes = nodes;
    _naviRelation = navi;
    _routeRelation = routes;
  }

  const ctx = {
    init,
    getNavi(navi=_naviRelation, handler = rules.navi.handler) {
      const args = Array.from(arguments)
      if(args.length == 1 && typeof args[0]=='function'){
        [navi,handler] = [_naviRelation,...args]
      }
      return stuff(navi, _nodes, {handler: handler})
    },
    getRoute(route=_routeRelation, handler = rules.route.handler) {
      const args = Array.from(arguments)
      if(args.length == 1 && typeof args[0]=='function'){
        [route,handler] = [_routeRelation,...args]
      }
      return stuff(route, _nodes, {handler: handler})
    },
    getCrumb(nodeName, handler = rules.crumb.handler) {
      const naviNodes = stuff(_naviRelation, _nodes, {handler: handler})
      return findNodePath(nodeName, naviNodes)
    },
    getSitemap(handler = rules.sitemap.handler) {
      return _nodes.map(handler);
    },
  };

  Object.defineProperties(ctx, {
    navi:{
      get:()=>_naviRelation,
      set:val=>_naviRelation=val
    },
    routes:{
      get:()=>_routeRelation,
      set:val=>_routeRelation=val
    },
    notes:{
      get:()=>_nodes
    },
  })

  return ctx;
}

const naviMaker = new NaviMaker()

export {
  naviMaker,
  NaviMaker,
  stuff,
  findNode,
  findNodePath
}
export default naviMaker;
