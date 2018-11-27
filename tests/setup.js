require("babel-polyfill");

const chai = require("chai");

global.assert = chai.assert;
global.sitemap = [
    {
        name: "dashboard",
        title: "仪表盘",
        path: "/dashboard",
        component: () => require("./main.vue")
    },
    {
        name: "sys_setting+",
        title: "系统设置",
        children: [
            {
                name: "member",
                title: "系统成员",
                path: "/member",
                component: () => require("./main.vue"),
                children: [
                    {
                        name: "member-detail",
                        title: "系统成员详情",
                        path: "/member/detail/:id(\\d+)?",
                        component: () => require("./main.vue")
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
                        component: () => require("./main.vue")
                    },
                    {
                        name: "user-vip",
                        title: "付费会员",
                        path: "/users/vip",
                        component: () => require("./main.vue")
                    }
                ]
            }
        ]
    }
];

