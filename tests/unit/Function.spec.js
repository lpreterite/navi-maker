const { default:naviMaker, debug, stuff, flat, combo } = require("../../");
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
    "route":{
      "path": "/",
      "meta": {
        "title": "首页",
      },
      "component": "../pages/commons/Layout.vue",
    },
    "children": [
      {
        "name": "dashboard",
        "route": {
          "path": "dashboard",
          "meta": {
            "title": "仪表盘",
          },
          "component": "../pages/Dashboard.vue",
        },
        "navi": {
          "title": "仪表盘",
          "path": "/dashboard?query=111"
        }
      },
      {
        "name":"+posts",
        "navi": {
          "title": "文章库",
          "path": "/posts/draf"
        },
        "children": [
          {
            "name":"posts/draf",
            "route": {
              "path": "/posts/draf",
              "meta": {
                "title": "草稿箱",
              },
              "component": "../pages/Dashboard.vue",
            },
            "navi": {
              "title": "草稿箱",
            }
          },
          {
            "name":"posts/publish",
            "route":{
              "path": "/posts/publish",
              "meta": {
                "title": "发布库",
              },
              "component": "../pages/Dashboard.vue",
            },
            "navi": {
              "title": "发布库",
            },
          },
          {
            "name":"+other",
            "navi": {
              "title": "其他",
            },
            "children": [
              {
                "name":"posts/trash",
                "route": {
                  "path": "/posts/trash",
                  "meta": {
                    "title": "垃圾桶",
                  },
                  "component": "../pages/Dashboard.vue"
                },
                "navi": {
                  "title": "垃圾桶",
                },
              },
            ]
          },
        ]
      },
    ]
	},
	{
		"name": "login",
    "route": {
      "path": "/auth/login",
      "meta": {
        "title": "登录",
      },
      "component": "../pages/Login.vue",
    }
	},
]

describe('NaviMaker', () => {
  naviMaker.debug(true)
  const navi = naviMaker.getNavi(_nodes)
  const routes = naviMaker.getRoute(_nodes)
  const sitemap = naviMaker.getSitemap(_nodes)

  /** 转化为路由配置 */
  // console.log(stuff(routes,[], {handler:({node},{handler,stuff})=>{
  //   return {
  //     name: node.name,
  //     path: node.route.path,
  //     meta: {
  //       title: (node.nav||{}).title,
  //       ...(node.nav?{nav:node.nav}:{})
  //     },
  //     component: node.route.component,
  //     children: stuff(node.children, [], {handler,stuff})
  //   }
  // }}))
  // console.group("combo")
  // // console.log(sitemap.filter(i=>typeof i.navi != 'undefined'))
  // console.log(combo(sitemap.filter(i=>typeof i.navi != 'undefined')))
  // // console.log(flat(navi).filter(i=>typeof i.route != 'undefined'))
  // // console.log(combo(flat(navi).filter(i=>typeof i.route != 'undefined')))
  // // console.log(JSON.stringify(combo(flat(navi))))
  // console.groupEnd("combo")

  const naviJSONPath = path.resolve(__dirname,"../navi.json")
  const routeJSONPath = path.resolve(__dirname,"../route.json")
  const sitemapJSONPath = path.resolve(__dirname,"../sitemap.json")
  fs.access(naviJSONPath, fs.constants.R_OK | fs.constants.W_OK, err=>{
    if(!err) fs.unlinkSync(naviJSONPath)
    fs.writeFile(naviJSONPath, JSON.stringify(navi), {flag:'a'}, ()=>{})
  })
  fs.access(routeJSONPath, fs.constants.R_OK | fs.constants.W_OK, err=>{
    if(!err) fs.unlinkSync(routeJSONPath)
    fs.writeFile(routeJSONPath, JSON.stringify(routes), {flag:'a'}, ()=>{})
  })
  fs.access(sitemapJSONPath, fs.constants.R_OK | fs.constants.W_OK, err=>{
    if(!err) fs.unlinkSync(sitemapJSONPath)
    fs.writeFile(sitemapJSONPath, JSON.stringify(sitemap), {flag:'a'}, ()=>{})
  })

  function hasSomeKeys(obj,keys){
    return keys.every(key=>obj.hasOwnProperty(key))
  }

  describe('navi属性对象', ()=>{
    it('节点必须包含name,navi,level,children', () => {
      expect(hasSomeKeys(
        navi[0],
        [
          'name',
          'navi',
          'level',
          'children'
        ]
      )).to.be.true;
    })
  })
  describe('route属性对象', ()=>{
    const drafNode = findNode('posts/draf', routes)
    it('节点必须包含name,route,level,children', () => {
      expect(hasSomeKeys(
        drafNode,
        [
          'name',
          'route',
          'level',
          'children'
        ]
      )).to.be.true;
    })
  })
  describe('sitemap属性对象', ()=>{
    const sitemap = naviMaker.getSitemap(_nodes)
    it('节点必须包含name，navi和route必定包含其一', () => {
      expect(
        hasSomeKeys(
          sitemap[0],
          [
            'name'
          ]
        ) && (sitemap[0].hasOwnProperty('navi') || sitemap[0].hasOwnProperty('route'))
      ).to.be.true;
    })
    it('输出结构为子节点至顶节点路径', () => {
      // expect(yeah()).to.equal("yeah!")
    })
  })
  describe('getCrumb()', ()=>{
    const crumb = naviMaker.getCrumb("posts/trash", navi)
    console.log(crumb)
    it('节点必须包含name, navi', () => {
      expect(hasSomeKeys(
        crumb[0],
        [
          'name',
          'navi'
        ]
      )).to.be.true;
    })
  })
})
