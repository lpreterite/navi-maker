const naviMaker = require("./src/main")

// 假设堆是一个数组，每个元素是一个对象，包含节点名称和子节点
var heap = [
  { name: "A", children: [{name: "B"}, {name:"C"}] },
  { name: "B", children: [{name:"D"}, {name:"E"}] },
  { name: "C", children: [{name:"F"}, {name:"P", children:[{name:"G"}]}] },
  { name: "D", children: [] },
  { name: "E", children: [] },
  { name: "F", children: [] },
  { name: "Z", children: [] },
];

var target = "G";

function findNode(target, nodes=[]) {
  return nodes
    .map(node=>node.name==target?node:findNode(target,node.children))
    .find(node=>(node||{}).name==target)
}

function findNodePath(target, nodes=[]){
  return nodes
    .map(node=>node.name==target?[node]:[node,findNodePath(target,node.children)].flat(Infinity))
    .filter(nodes=>nodes.find(node=>node.name==target))
}

// 调用函数，打印结果
console.log(findNode(target, heap));
console.log(findNodePath(target, heap));

const nodes = [
	{
		"name": "home",
		"path": "/",
		"title": "首页",
		"component": "../pages/commons/Layout.vue",
	},
	{
		"name": "posts/draf",
		"path": "/posts/draf",
		"title": "草稿箱",
		"component": "../pages/Dashboard.vue",
	},
	{
		"name": "dashboard",
		"path": "dashboard",
		"title": "仪表盘",
		"component": "../pages/Dashboard.vue",
	},
	{
		"name": "login",
		"path": "/auth/login",
		"title": "登录",
		"component": "../pages/Login.vue",
	},
	{
		"name":"posts/draf",
		"title":"草稿箱",
		"path": "/posts/draf",
		"component": "../pages/Dashboard.vue",
	},
	{
		"name":"posts/publish",
		"title":"发布库",
		"path": "/posts/publish",
		"component": "../pages/Dashboard.vue",
	},
	{
		"name":"posts",
		"title":"文章库",
	},
	{
		"name":"+other",
		"title":"其他",
	},
	{
		"name":"posts/trash",
		"title":"垃圾桶",
		"path": "/posts/trash",
		"component": "../pages/Dashboard.vue",
	},
]

const navi = [
  "dashboard",
  [
    "posts",
    [
      "posts/draf",
      "posts/publish",
      ["+other",["posts/trash"]]
    ]
  ]
]
const route = [
  [
    "home",
    [
      "dashboard",
      "posts/draf",
      "posts/publish",
      "posts/trash",
    ]
  ],
  "login"
]

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
    // console.log(type, nodeName,node, getNode('dashboard'))
    return node
  })
}

console.log(stuff(navi, nodes))


naviMaker.init({
  navi,
  routes:route,
  nodes
})

console.group("naviMaker")
console.log(naviMaker.getRoute())
console.log(naviMaker.getNavi())
console.log(naviMaker.getCrumb("posts/trash"))
console.groupEnd("naviMaker")
