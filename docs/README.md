# vue-sitemap-mixin

## How to use

### set config

1. add sitemap config

```js
// in configs/sitemap.conf.js
export default [
    {
        name: "dashboard",
        title: "仪表盘",
        path: "/dashboard"
    },
    {
        name: "article+",
        title: "文章管理"
    },
    {
        name: "articles",
        title: "文章列表",
        path: "/articles"
    },
    {
        name: "article_detail",
        title: "文章详情"
    },
    {
        name: "article_type",
        title: "文章分类"
    },
    {
        name: "users",
        title: "用户列表",
        path: "/users"
    },
    {
        name: "user_detail",
        title: "用户详情"
    }
]
```

2. add navigation config

```js
// in configs/navigation.conf.js
export default [
    "dashboard",
    ["articles+", ["articles","article_type"]],
    "users"
]
```

### use Crumb.Mixin

1. create Crumb.vue

```html
<template>
    <iv-breadcrumb>
        <iv-breadcrumb-item
            v-for="(item,index) in list"
            :key="index"
            :to="item.to">{{ item.title }}</iv-breadcrumb-item>
    </iv-breadcrumb>
</template>
<script>
import sitemap from "./configs/sitemap.conf"

import CrumbMixin from "vue-sitemap-mixin/Crumb.Mixin"

export default {
    mixins: [CrumbMixin(sitemap)],
    data(){
        return {
            list: this.getCrumbs(this.$route)
        }
    },
    beforeRouteEnter(to, from, next){
        next(vm=>{
            vm.list = vm.getCrumbs(to);
        })
    },
    beforeRouteUpdate(to, from, next){
        this.list = this.getCrumbs(to);
        next();
    }
}
</script>
```

### use Navigation.Mixin

1. create Navigation.vue

```js
import navigation from "./configs/navigation.conf"
import sitemap from "./configs/sitemap.conf"

import NavigationMixin from "vue-sitemap-mixin/Navigation.Mixin"

export default {
    mixins: [NavigationMixin(navigation, sitemap)]
    props: {
        active: String,
        opens: Array
    },
}
```

2. use Navigation.vue

```html
<template>
    <section id="layout">
        <aside>
            <Navigation
                :active="active"
                :opens="opens" />
        </aside>
        <div>
            <Crumb />
            <router-view />
        </div>
    </section>
</template>
<script>
import Crumb from "./Crumb";
import Navigation from "./Navigation";
export default {
    components: { Navigation, Crumb },
    data(){
        return {
            active: "",
            opens: []
        }
    },
    beforeRouteEnter(to, from, next){
        next(vm=>{
            vm.updateNav(to);
        })
    },
    beforeRouteUpdate(to, from, next){
        this.updateNav(to);
        next();
    },
    methods: {
        updateNav(route){
            if(route.meta && route.meta.nav){
                this.active = !!route.meta.nav.active ? route.meta.nav.active : route.name;
                this.opens = !!route.meta.nav.open ? [route.meta.nav.open] : [];
            }else{
                this.active = route.name;
            }
        }
    }
}
</script>
```