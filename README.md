# navi-maker

> 配一次导航生成路由、面包屑、网站地图数据

## 功能（Features）

一次配置可生成导航、路由、面包屑或网站地图等数据。解决零散的配置内容，用于辅佐项目的长期维护。

## 安装（Install）

```sh
# 安装依赖
$ npm i @packy-tang/navi-maker
```

## 使用（How to Use）

### 使用例子

```js
import VueRouter from "vue-router";
import {stuff,findNode,getRoute,getNavi,getSitemap,getCrumb} from "@packy-tang/navi-maker"

//网站节点树
const tree = [
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

//获取路由配置
const routes = stuff(getRoute(nodes), [], { handler:({node},{handler,stuff})=>{
  //输出Vue-Router的数据格式
  const rotue = (node.route||{})
  return {
    name: node.name,
    ...route,
    children: stuff(node.children, [], {handler,stuff})
  }
} })

//创建Vue路由
const router = new VueRouter({
  routes,
  strict: conf.debug
});

//获取导航配置
const navi = stuff(getNavi(nodes), [], { handler:({node,level},{handler,stuff})=>{
  //输出导航组件使用的数据格式
  const navi = node.navi||{}
  const route = router.getRoutes().find(i=>i.name==node.name)
  const routeNode = router.resolve({ name: node.name })

  return {
    name: node.name,
    title: navi.title,
    path: navi.path || (route?routeNode.route.path:''),
    shown: typeof navi.shown == 'undefined' ? true : navi.shown,
    children: stuff(node.children, [], {handler,stuff})
  }
} })

//获取全站节点
const sitemap = getSitemap(nodes)

//获取
const crumb = getCrumb("posts/trash", navi)

```

配置的树节点说明，以下是包含的字段：

| 字段 | 类型   | 描述                                 |
| -------- | ------ | ------------------------------------ |
| name | String | 必要，路由或是导航的标记（请用英文） |
| route | Object | 可选，路由字段。`getRoute()`方法根据此字段存在与否来获取节点。 |
| navi | Object | 可选，导航字段。`getNavi()`方法根据此字段存在与否来获取节点。 |
| level | Number | 保留字段，内部使用。记录和计算节点所在层级。 |
| children | Array<Node> | 保留字段，内部使用。子节点集合。 |

### 获取路由

```js
import {getRoute} from "@packy-tang/navi-maker"

const routes = getRoute(tree)
```

获取路由树，输入网站节点树，返回只包含路由属性的树。


### 获取导航

```js
import {getNavi} from "@packy-tang/navi-maker"

const navi = getNavi(tree)
```

获取导航树，输入网站节点树，返回只包含导航属性的树。


### 获取面包屑

```js
import {getCrumb} from "@packy-tang/navi-maker"

const crumb = getCrumb("posts/trash", navi)

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
| tree | Array<Node> | 必须，节点树，用于在节点树中查找内容。 |

### 获取网站地图

```js
import {getSitemap} from "@packy-tang/navi-maker"

const sitemap = getSitemap(tree)
```

获取所有节点内容。

| 变量名称 | 类型   | 描述                                 |
| -------- | ------ | ------------------------------------ |
| tree | Array<Node> | 必须，节点树，所有输出节点均来自这棵树。 |

### 其他函数

- `stuff(tree, nodes, {handler()})` 遍历并填充内容的函数，可递归使用。
- `flat(tree)` 扁平树状结构，将树状结构压平为数组。
- `combo(nodes, tree)` 组合函数，根据父级节点的离散数据再组合。
- `findNode()` 根据名称获得树中的节点。
- `findNodePath()` 根据名称获得节点至顶节点完整路径。

stuff 使用例子

```js
import { stuff, getRoute } from "@packy-tang/navi-maker"
function handler({
  targetName,      //节点名称，用于搜索节点
  nodes,           //节点集合，用于搜索节点
  level,           //节点层级，
  type,            //层级结构的节点描述类型，0为字符串；1为数组，例如：`['+posts', ['posts/draf','posts/publish']]`；2为对象，例如：`{name:'dashboard'}`；
  node,            //节点内容，目前只有type为2时，这个才会有值，内容与层级结构节点一致，如：`{name:'dashboard'}`
}={},{
  handler,         //填充函数，用于递归处理
  stuff            //函数，用于递归处理
}){
  const rotue = (node.route||{})
  return {
    name: node.name,
    ...route,
    children: stuff(node.children, [], {handler,stuff})
  }
}

const routes = stuff(getRoute(nodes), [], {handler})

console.log(navi)
```

## 数据定义

### 节点定义

```json
{
  "name": "dashboard",
  "route": {...},
  "navi": {...},
  "parentName": "",
  "level": 2,
  "children": [...],
}
```

| 字段 | 类型   | 描述                                 |
| -------- | ------ | ------------------------------------ |
| name | String | 必要，路由或是导航的标记（请用英文） |
| route | Object | 可选，路由字段。`getRoute()`方法根据此字段存在与否来获取节点。 |
| navi | Object | 可选，导航字段。`getNavi()`方法根据此字段存在与否来获取节点。 |
| parentName | String | 可选，用于配合父级节点使用。一般情况下通过层级自动匹配。自定义设置后，将按配置优先。|
| level | Number | 保留字段，内部使用。记录和计算节点所在层级。 |
| children | Array<Node> | 保留字段，内部使用。子节点集合。 |

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
