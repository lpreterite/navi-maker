const { default:naviMaker, NaviMaker } = require("../../");
const fs = require('fs')
const path = require('path')

function findNode(target, nodes = []) {
  return nodes
    .map((node) =>
      node.name == target ? node : findNode(target, node.children)
    )
    .find((node) => (node || {}).name == target);
}

const _nodes = [
	{
		"name": "home",
		"path": "/",
    "meta": {
      "title": "首页",
    },
		"component": "../pages/commons/Layout.vue",
	},
	{
		"name": "dashboard",
		"path": "dashboard",
    "meta": {
      "title": "仪表盘",
    },
		"component": "../pages/Dashboard.vue",
	},
	{
		"name": "login",
		"path": "/auth/login",
    "meta": {
      "title": "登录",
    },
		"component": "../pages/Login.vue",
	},
	{
		"name":"posts/draf",
		"path": "/posts/draf",
    "meta": {
      "title": "草稿箱",
      "nav": {
        "open": "+posts",
        "active": "posts/draf"
      }
    },
		"component": "../pages/Dashboard.vue",
	},
	{
		"name":"posts/publish",
		"path": "/posts/publish",
    "meta": {
      "title": "发布库",
      "nav": {
        "open": "+posts",
        "active": "posts/publish"
      }
    },
		"component": "../pages/Dashboard.vue",
	},
	{
		"name":"+posts",
    "meta": {
      "title": "文章库",
    },
	},
	{
		"name":"+other",
    "meta": {
      "title": "其他",
    },
	},
	{
		"name":"posts/trash",
		"path": "/posts/trash",
    "meta": {
      "title": "垃圾桶",
      "nav": {
        "open": "+posts",
        "active": "posts/trash"
      }
    },
		"component": "../pages/Dashboard.vue",
	},
]

const _navi = [
  "dashboard",
  [
    "+posts",
    [
      "posts/draf",
      "posts/publish",
      ["+other",["posts/trash"]]
    ]
  ]
]
const _route = [
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

describe('NaviMaker', () => {
  naviMaker.init({
    navi:_navi,
    routes:_route,
    nodes:_nodes
  })
  const navi = naviMaker.getNavi()
  const routes = naviMaker.getRoute()
  const sitemap = naviMaker.getSitemap()

  const naviJSONPath = path.resolve(__dirname,"../navi.json")
  const routeJSONPath = path.resolve(__dirname,"../route.json")
  fs.access(naviJSONPath, fs.constants.R_OK | fs.constants.W_OK, err=>{
    if(!err) fs.unlinkSync(naviJSONPath)
    fs.writeFile(naviJSONPath, JSON.stringify(navi), {flag:'a'}, ()=>{})
  })
  fs.access(routeJSONPath, fs.constants.R_OK | fs.constants.W_OK, err=>{
    if(!err) fs.unlinkSync(routeJSONPath)
    fs.writeFile(routeJSONPath, JSON.stringify(routes), {flag:'a'}, ()=>{})
  })

  describe('getNavi()', ()=>{
    it('节点必须包含name,title,type,path,children', () => {
      expect(navi[0]).to.include.all.keys(
        'name',
        'title',
        'path',
        'type',
        'level',
        'children'
      )
    })
    it('输出结构必须与输入结构一致', () => {
      // expect(yeah()).to.equal("yeah!")
    })
    it('找不到节点时，应提示错误', () => {
      const naviMaker2 = new NaviMaker()
      naviMaker2.init({
        navi:['fff'],
        routes:['fff'],
        nodes:[{ name:'abc' }]
      })
      expect(naviMaker2.getNavi).to.throw('找不到')
    })
  })
  describe('getRoute()', ()=>{
    const drafNode = findNode('posts/draf', routes)
    it('节点必须包含name,path,meta,component,children', () => {
      expect(drafNode).to.include.all.keys(
        'name',
        'path',
        'meta',
        'component',
        'children'
      )
    })
    it('节点必须包含meta.title', () => {
      expect(drafNode.meta||{}).to.include.all.keys(
        'title'
      )
    })
    it('节点保留meta内容，如：nav.open, nav.active', () => {
      expect(drafNode.meta||{}).to.all.keys(
        'title',
        'nav',
      )
    })
    it('输出结构必须与输入结构一致', () => {
      // expect(yeah()).to.equal("yeah!")
    })
    it('找不到节点时，应提示错误', () => {
      const naviMaker2 = new NaviMaker()
      naviMaker2.init({
        navi:['fff'],
        routes:['fff'],
        nodes:[{ name:'abc' }]
      })
      expect(naviMaker2.getRoute).to.throw('找不到')
    })
  })
  describe('getCrumb()', ()=>{
    const crumb = naviMaker.getCrumb("posts/trash")
    it('节点必须包含name,title', () => {
      expect(crumb[0]).to.include.all.keys(
        'name',
        'title',
      )
    })
    it('输出结构为子节点至顶节点路径', () => {
      // expect(yeah()).to.equal("yeah!")
    })
    it('找不到节点时，应提示错误', () => {
      const naviMaker2 = new NaviMaker()
      naviMaker2.init({
        navi:['fff'],
        routes:['fff'],
        nodes:[{ name:'abc' }]
      })
      expect(naviMaker2.getCrumb).to.throw('找不到')
    })
  })
  describe('getSitemap()', ()=>{
    const sitemap = naviMaker.getSitemap()
    it('节点必须包含name,path,title', () => {
      expect(sitemap[0]).to.include.all.keys(
        'name',
        'path',
      )
    })
    it('输出结构为子节点至顶节点路径', () => {
      // expect(yeah()).to.equal("yeah!")
    })
  })
})
