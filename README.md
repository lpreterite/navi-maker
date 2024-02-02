# navi-maker

> 配一次导航生成路由、面包屑、网站地图数据

## 功能（Features）

配一次导航生成路由、面包屑、网站地图数据。解决零散的配置内容，用于辅佐项目的长期维护。

- 输入节点集合
- 根据路由结构输出路由配置
- 根据导航结构输出导航配置
- 根据节点名称输出面包屑

## 安装（Install）

```sh
# 安装依赖
$ npm i @packy-tang/navi-maker
```

## 使用（How to Use）

### 初次化

```js
import naviMaker from "@packy-tang/navi-maker"

const routeRule = [
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

const naviRule = [
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

naviMaker.init({
  nodes: [...],
  routes: routeRule,
  navi: naviRule
})
```

初次化数据，输入内容会保存至maker内部，用于后续其他函数使用。

| 变量名称 | 类型   | 描述                                 |
| -------- | ------ | ------------------------------------ |
| nodes | Array<Object> | 必要，无层级结构的节点集合 |
| routes | Array<String> |   可选，路由的层级结构规则 |
| navi | Array<String> | 可选，导航的层级结构规则 |

### 获取路由

```js
import naviMaker from "@packy-tang/navi-maker"

const routeRule = [
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

const naviRule = [
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

naviMaker.init({
  nodes: [...],
  routes: routeRule,
  navi: naviRule
})


const routes = naviMaker.getRoute()

console.log(routes)
/**
 * 输出结果：详情见 test/route.json
 * 
[
  {
    "name": "home",
    "path": "/",
    "meta": {
      "title": "首页"
    },
    "component": "../pages/commons/Layout.vue",
    "children": [
      {
        "name": "dashboard",
        "path": "dashboard",
        "meta": {
          "title": "仪表盘"
        },
        "component": "../pages/Dashboard.vue",
        "children": []
      },
      {
        "name": "posts/draf",
        "path": "/posts/draf",
        "meta": {
          "title": "草稿箱",
          "nav": {
            "open": "+posts",
            "active": "posts/draf"
          }
        },
        "component": "../pages/Dashboard.vue",
        "children": []
      },
      {
        "name": "posts/publish",
        "path": "/posts/publish",
        "meta": {
          "title": "发布库",
          "nav": {
            "open": "+posts",
            "active": "posts/publish"
          }
        },
        "component": "../pages/Dashboard.vue",
        "children": []
      },
      {
        "name": "posts/trash",
        "path": "/posts/trash",
        "meta": {
          "title": "垃圾桶",
          "nav": {
            "open": "+posts",
            "active": "posts/trash"
          }
        },
        "component": "../pages/Dashboard.vue",
        "children": []
      }
    ]
  },
  {
    "name": "login",
    "path": "/auth/login",
    "meta": {
      "title": "登录"
    },
    "component": "../pages/Login.vue",
    "children": []
  }
]
*/
```

获取完整的路由规则

| 变量名称 | 类型   | 描述                                 |
| -------- | ------ | ------------------------------------ |
| rules | Array<String> | 可选，层级规则，默认为初次化函数存入的规则内容 |
| handler | Function |   可选，[节点搜索函数](#节点搜索函数)，用于组织节点内容。默认为Maker内部的处理。 |

### 获取导航

```js
import naviMaker from "@packy-tang/navi-maker"

const routeRule = [
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

const naviRule = [
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

naviMaker.init({
  nodes: [...],
  routes: routeRule,
  navi: naviRule
})


const navi = naviMaker.getNavi()

console.log(navi)/**
 * 输出结果：详情见 test/navi.json
 * 
[
  {
    "name": "dashboard",
    "meta": {
      "title": "仪表盘"
    },
    "component": "../pages/Dashboard.vue",
    "level": 0,
    "type": 0,
    "title": "仪表盘",
    "children": []
  },
  {
    "name": "+posts",
    "meta": {
      "title": "文章库"
    },
    "level": 0,
    "type": 1,
    "title": "文章库",
    "children": [
      {
        "name": "posts/draf",
        "meta": {
          "title": "草稿箱",
          "nav": {
            "open": "+posts",
            "active": "posts/draf"
          }
        },
        "component": "../pages/Dashboard.vue",
        "level": 1,
        "type": 0,
        "title": "草稿箱",
        "children": []
      },
      {
        "name": "posts/publish",
        "meta": {
          "title": "发布库",
          "nav": {
            "open": "+posts",
            "active": "posts/publish"
          }
        },
        "component": "../pages/Dashboard.vue",
        "level": 1,
        "type": 0,
        "title": "发布库",
        "children": []
      },
      {
        "name": "+other",
        "meta": {
          "title": "其他"
        },
        "level": 1,
        "type": 1,
        "title": "其他",
        "children": [
          {
            "name": "posts/trash",
            "meta": {
              "title": "垃圾桶",
              "nav": {
                "open": "+posts",
                "active": "posts/trash"
              }
            },
            "component": "../pages/Dashboard.vue",
            "level": 2,
            "type": 0,
            "title": "垃圾桶",
            "children": []
          }
        ]
      }
    ]
  }
]
*/
```

获取完整的导航规则

| 变量名称 | 类型   | 描述                                 |
| -------- | ------ | ------------------------------------ |
| rules | Array<String> | 可选，层级规则，默认为初次化函数存入的规则内容 |
| handler | Function |  可选，[节点搜索函数](#节点搜索函数)，用于组织节点内容。默认为Maker内部的处理。 |


### 获取面包屑

```js
import naviMaker from "@packy-tang/navi-maker"

const routeRule = [
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

const naviRule = [
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

naviMaker.init({
  nodes: [...],
  routes: routeRule,
  navi: naviRule
})

const crumb = naviMaker.getCrumb("posts/trash")

console.log(crumb)
/**
 * 输出结果：
[
  {
    name: '+posts',
    meta: { title: '文章库' },
    level: 0,
    title: '文章库',
    path: undefined,
    children: [ [Object], [Object], [Object] ]
  },
  {
    name: '+other',
    meta: { title: '其他' },
    level: 1,
    title: '其他',
    path: undefined,
    children: [ [Object] ]
  },
  {
    name: 'posts/trash',
    level: 2,
    path: undefined,
    meta: { title: '垃圾桶', nav: [Object] },
    component: '../pages/Dashboard.vue',
    title: '垃圾桶'
  }
]
*/
```

获取面包屑，根据导航层级规则获取某节点至顶节点的路径。

| 变量名称 | 类型   | 描述                                 |
| -------- | ------ | ------------------------------------ |
| nodeName | String | 必须，节点名称，对应节点集合中的节点名称 |
| handler | Function |  可选，[节点搜索函数](#节点搜索函数)，用于组织节点内容。默认为Maker内部的处理。 |

### 获取网站地图

```js
import naviMaker from "@packy-tang/navi-maker"

const routeRule = [
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

const naviRule = [
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

naviMaker.init({
  nodes: [...],
  routes: routeRule,
  navi: naviRule
})

const sitemap = naviMaker.getSitemap()

console.log(sitemap)
/**
 * 输出结果与nodes节点集合一致。
*/
```

获取所有节点内容，实则返回的就是初次化时传入的节点集合内容。

### 节点搜索函数

```js
import naviMaker from "@packy-tang/navi-maker"
function handler({
  targetName,      //节点名称，用于搜索节点
  nodes,           //节点集合，用于搜索节点
  level,           //节点层级，
  type,            //层级结构的节点描述类型，0为字符串；1为数组，例如：`['+posts', ['posts/draf','posts/publish']]`；2为对象，例如：`{name:'dashboard'}`；
  node,            //节点内容，目前只有type为2时，这个才会有值，内容与层级结构节点一致，如：`{name:'dashboard'}`
}={}){
  let result = nodes.find(node=>node.name==targetName)
  return result
}

naviMaker.init({
  nodes: [...],
})
const navi = naviMaker.getNavi(['dashboard'], handler)
console.log(navi)
```

### 其他函数

- findNode 根据名称获得树中的节点。
- findNodePath 根据名称获得节点至顶节点完整路径。

## 开发（Develop）

本地开发

```sh
# 安装依赖
$ npm ci

# 本地构建
$ npm run build
# 本地构建并检测文件变化
$ npm run watch
# 运行测试
$ npm run test
```

## 来自（From）

本仓库是由 [lpreterite/sao-esm](https://github.com/lpreterite/sao-esm) 模板化生成。

## License

MIT &copy; lpreterite
