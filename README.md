# vue-sitemap

用于管理导航、面包屑及路由等基于vue的功能整合

## 起因

业务功能划分并不稳定，存在经常变化的情况，为满足面包屑的合理性，路由配置需跟着业务功能变化进行修改，然而路由层级较为复杂时异常情况将会频繁发生，这种情况将导致工作效率低下。为解决此问题，首先说一下我的理解：路由中层级的配置是固定不变（不是根据业务划分而变化，而已根据UI布局而变化），业务划分的层级不应该在路由层级表现出来，这样处理后业务划分的变化只会带来网站地图的改变（导航与面包屑）。

## 原理

把页面及其业务划分作为节点并记录到sitemap配置中，在面包屑中根据`vue-router`中的路由name或`meta`配置获取sitemap信息渲染面包屑。导航能使用sitemap中节点的`name`进行简单配置，这里支持配置成`分组`或`包含下级`两种形式。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
