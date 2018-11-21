# 设计构想

## 成因

日常开发管理后台当需要增加新的页面的时，在基于`vue+vue-router`的框架下需要改动好几个地方：

- 添加页面文件(pages/users.vue)
- 添加新路由
- 添加面包屑

单单一个页面需要管理多个文件，如能减少这部分的复杂性或维护相对简单些能否提高开发效率呢？

> **答案是肯定的，效率肯定能提高不少。**

出于写个想法重新理解一遍`导航`、`路由`、`面包屑`、`页面`等的关系：

- `导航`：人为提供的入口，显示时存在层级关系，划分逻辑一般是按业务需求或个人喜好设定。
- `路由`：控制页面根据怎样的地址显示的设置，在`vue-router`的帮助下还能在特定路由添加固有的数据(meta)
- `面包屑`：当前页面所在的位置，这个可说是承载网站地图主要效果的功能，往往页面的位置存在层级关系，和`导航`一样划分逻辑按业务需求或个人喜好设定
- `页面`：网站地图上的一个点，也是用户实际需要到达的位置。

这样总结下来，网站就是由很多的页面组成的，至于怎样组成是由路由决定的，导航则提供首要的入口，根据提供的面包屑便能知道当前的位置。实际编码下来却又遇到一些情况，路由层级并不是与业务需要的层级一一吻合的，这样导致的一种情况就是`面包屑`需要额外维护。

为解决这个问题，**这个组件诞生了**。

## 解决方案

怎样解决？

当然是需要一个完整的层级定义（完整网站地图），最好是设置一次然后在设置路由、导航、获取面包屑等地方都能通用的。

大概使用起来会像这样：

```js
// # sitemap.conf.js
export default [
    {
        name: "dashboard",
        title: "仪表盘",
        path: "/dashboard",
        component: () => import('@/pages/dashboard.vue')
    },
    {
        name: "sys_setting+",
        title: "系统设置",
        children: [
            {
                name: "member",
                title: "系统成员",
                path: "/member",
                component: () => import('@/pages/member/index.vue'),
                children: [
                    {
                        name: "member-detail",
                        title: "系统成员详情",
                        path: "/member/detail/:id(\\d+)?",
                        component: () => import('@/pages/member/detail.vue')
                    }
                ]
            }
        ]
    },
    {
        name: "operational-sys+",
        title: "运营系统",
        children: [
            {
                name: "vip_management-",
                title: "会员",
                children: [
                    {
                        name: "membership",
                        title: "会员权益",
                        path: "/membership",
                        component: ()=>import('@/pages/membership/index.vue')
                    },
                    {
                        name: "user-vip",
                        title: "付费会员",
                        path: "/users/vip",
                        component: ()=>import('@/pages/users/vip.vue')
                    }
                ]
            }
        ]
    }
]
//vue-router下的路由层级与网站地图不一致
//一般路由是摊平处理
sitemap
    .getRoutes([
        "dashboard",
        "member",
        "member-detail",
        "membership",
        "user-vip"
    ]) //to vue-router

// 导航只包含网站地图的部分入口，不包含所有关系
// 导航参考iview的menu，是包含三种样式的：MenuItem，Submenu，MenuGroup
const navi = sitemap
    .getNavigation([
        "dashboard",
        [
            //默认解析为Submenu，这里需解析成MenuGroup
            ["operational-sys+", "group"],
            // or
            { name: "operational-sys+", type: "group" },
            [
                "vip_management-",
                ["membership","user-vip"]
            ]
        ],
        //解析成Submemu
        ["sys_setting+",
            ["member"]
        ]
    ]) //to Navigation component

// on vue component render function
Vue.component('navi', {
    render(h){
        return h('iv-menu', {}, [
            ...sitemap.renderNavigation(navi, function(h, nodes, render){
                const components = {
                    'vip_management-':'iv-menu-group',
                    'operational-sys+':'iv-submenu',
                    'sys_setting+':'iv-submenu',
                }
                return nodes.map(node => {
                    const element = components[node.name]
                    const $title = h('span', {
                        ...(!element ? { slot: 'title' } : {})
                    }, [
                            node.icon ? <iv-icon type={node.icon} /> : '',
                            node.title
                        ])
                    return h(element, {
                        props: {
                            title: node.title,
                            name: node.name,
                            id: node.name
                        }
                    }, [
                        $title,
                        node.children ? render(h, node.children, render) : ''
                    ])
                })
            })
        ])
    }
})

sitemap.getCrumb($route) // to crumb component
```