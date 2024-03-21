let _debug=false;

function findNode(target, nodes = []) {
  for (let node of nodes) {
    if (node.name === target) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNode(target, node.children);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function findNodePath(target, nodes = [], path = []) {
  for (let node of nodes) {
    path.push(node);
    if (node.name === target) {
      return path;
    }
    if (node.children) {
      let result = findNodePath(target, node.children, path);
      if (result.length>0) {
        return result;
      }
    }
    path.pop();
  }
  return [];
}

function serialize(input){
  const nodeTypes = ['string','array', 'object']
  const type = typeof input == 'string' ? 0 : [String,Array,Object].findIndex(constructor=>input instanceof constructor)
  let node;
  switch(type){
    case 0:
      node = { name: input, nodeType:nodeTypes[type], children:[] }
      break;
    case 1:
      node = { name: input[0], nodeType:nodeTypes[type], children:input[1]||[]  }
      break;
    case 2:
      node = {
        ...input,
        children:input.children||[],
        nodeType:nodeTypes[type],
      }
      if(typeof node.name === 'undefined'){ throw new Error("树节点为Object时，必须带上name属性") }
      break;
  }
  return node
}

const stuffDefaultHandler = ({node,targetName,level,nodes}, {stuff,handler}={})=>{
  const result = nodes.find(node=>node.name==targetName)
  return {
    ...node,
    ...result,
    level,
    children: stuff(node.children, nodes, {level:level+1, handler})
  }
}
/**
 * 填充数据函数
 *
 * @param {Array} tree 目标树
 * @param {Array} nodes 查找节点集合
 * @param {Object} [opts={}]
 * @param {Function} opts.handler 填充函数
 * @returns 返回目标树结构
 */
function stuff(tree, nodes, opts={}){
  const {
    handler=stuffDefaultHandler,
    level=0
  } = opts
  return tree.map(nodeName=>{
    const node = serialize(nodeName)
    let result = handler({targetName:node.name,level,nodes,node}, {stuff, handler});
    // result&&(result.children = stuff(node.children, nodes, {level:level+1, handler}))
    // if(!result) throw new Error(`在Nodes资源中找不到名为${nodeName}的节点！`)
    return result
  })
}
stuff.stuffDefaultHandler = stuffDefaultHandler

/**
 * 扁平树状结构
 *
 * @param {Array} tree 树状结构
 * @returns 输出扁平结构
 */
function flat(tree = []) {
  if (!Array.isArray(tree)) {
    throw new Error("Input must be an array");
  }

  return tree.flatMap(node => {
    const children = node.children || [];
    const newNode = { ...node, children: undefined };
    const childNodes = flat(children.map(child => ({ ...child, parentName: child.parentName || node.name })));
    return [newNode, ...childNodes];
  });
}

/**
 * 组合函数
 *
 * @description 根据父级节点的离散数据再组合
 * @param {*} nodes 扁平结构
 * @returns tree输出树状结构
 */
function combo(nodes, tree){
  if(_debug) console.group("combo")
  //TODO:自上往下找，父节点不具有路由属性时，会被整个剪肢；搜索需要改为自下而上搜索。
  //解决剪枝问题：找到落单节点，然后找到他们所有父辈，判断最近一代父辈后，在填充过程添加落单节点。

  const bePruned = nodes
    .filter(i=>nodes.findIndex(n=>i.parentName==n.name)==-1)
    .map(i=>{
      const nodePaths = findNodePath(i.parentName, tree)
      const parentName = nodePaths.map(i=>i.name).reduce((result,name)=>nodes.find(i=>i.name==name) ? name : result,'')
      return { parentName, name: i.name }
    })

  //跟新节点父级标记
  nodes = nodes.map(node=>{
    const pruned = bePruned.find(i=>i.name==node.name)
    const parentName = pruned ? pruned.parentName : node.parentName // 更新父级节点
    const level = pruned && pruned.parentName=='' ? 0 : node.level // 没有父级时为根节点，level设为0
    return { ...node, parentName, level }
  })

  if(_debug) console.log("bePruned",bePruned, nodes)

  const minLevel = nodes.reduce((result, next)=>Math.min(result,next.level),Infinity)
  const handler = ({node,targetName,level,nodes}, {stuff,handler}={})=>{
    const children = nodes.filter(i=>i.parentName == targetName)
    node.children = stuff(children, nodes, { handler })
    return node
  }

  if(_debug) console.groupEnd("combo")

  return stuff(nodes, nodes, { handler }).filter(i=>i.level<=minLevel)
}


function markTree(nodes, opts={}){
  const { stuffHandler=stuffDefaultHandler, filterHandler=()=>true } = opts
  const tree = stuff(nodes, [], {handler:stuffHandler})
  const sitemap = flat(tree)
  const result = combo(sitemap.filter(filterHandler), tree)
  if(_debug) console.log("markTree", result)
  return result
}

function getNavi(nodes) {
  if(_debug) console.group("navi")
  const tree = markTree(nodes, {
    stuffHandler: ({node,targetName,level,nodes}, {stuff,handler}={})=>{
      /** 当navi项有自定义的父级时保留设置。在combo阶段会根据父级组合起来。 */
      const { navi={} } = node
      const result = {
        ...node,
        ...(!!navi.parentName?{parentName:navi.parentName}:{}),
        level,
        children: stuff(node.children, nodes, {level:level+1, handler})
      }
      return result
    },
    filterHandler: i=>typeof i.navi != 'undefined'
  })
  if(_debug) console.groupEnd("navi")
  return tree
}

function getRoute(nodes) {
  if(_debug) console.group("route")
  const tree = markTree(nodes, {
    stuffHandler: ({node,targetName,level,nodes}, {stuff,handler}={})=>{
      /** 当route项有自定义的父级时保留设置。在combo阶段会根据父级组合起来。 */
      const { route={} } = node
      return {
        ...node,
        ...(!!route.parentName?{parentName:route.parentName}:{}),
        level,
        children: stuff(node.children, nodes, {level:level+1, handler})
      }
    },
    filterHandler: i=>typeof i.route != 'undefined'
  })
  if(_debug) console.groupEnd("route")
  return tree
}

function getCrumb(nodeName, navi) {
  return findNodePath(nodeName, navi)
}

function getSitemap(tree){
  return flat(tree)
}

function debug(val){
  _debug = val
}

const ctx = {
  debug,
  getNavi,
  getRoute,
  getCrumb,
  getSitemap,
}

export {
  debug,
  stuff,
  flat,
  combo,
  findNode,
  findNodePath,
  markTree,
  getNavi,
  getRoute,
  getCrumb,
  getSitemap,
}
export default ctx;
