
class MenuNode {
    constructor({ id, title, path, type, icon, children }) {
        this.id = id || '';
        this.title = title || '';
        this.type = type || 'item';
        this.icon = icon || '';
        this.path = path || '';
        if (['group', 'sub'].indexOf(type) > -1) {
            this.children = children || [];
        }
    }
}

export default function (navigations, sitemap){

    function getNavItem(navName) {
        const pageConf = sitemap.find(pageConf => pageConf.name === navName);
        return new MenuNode({
            id: pageConf.name,
            title: pageConf.title,
            path: pageConf.path
        });
    }
    function getNavigations(navigations) {
        const result = [];
        navigations.forEach(nav => {
            if (nav.constructor === Array) {
                const parentNode = getNavItem(nav[0]);
                parentNode.type = "sub";
                parentNode.children = getNavigations(nav[1])
                result.push(parentNode);
            } else if (typeof nav === 'object') {
                let parentNode
                if (!nav.key) parentNode = new MenuNode({
                    id: nav.name,
                    title: nav.title
                })
                else parentNode = getNavItem(nav.key)
                parentNode.type = "group";
                parentNode.children = getNavigations(nav.children)
                result.push(parentNode);
            } else {
                result.push(getNavItem(nav));
            }
        });
        return result;
    }

    function renderNavi(h, items) {
        return (vm) => {
            return items.map(node => {
                const element = vm.components[vm.types.indexOf(node.type)]
                const $title = h('span', {
                    ...(node.type !== 'item' ? { slot: 'title' } : {})
                }, [
                        node.icon ? <iv-icon type={node.icon} /> : '',
                        node.title
                    ])
                return h(element, {
                    props: {
                        title: node.title,
                        name: node.id,
                        id: node.id
                    }
                }, [
                        $title,
                        node.children ? renderNavi(h, node.children)(vm) : ''
                    ])
            })
        }
    }


    return {
        render(h) {
            return h('iv-menu', {
                ref: 'menu',
                props: {
                    "theme": "dark",
                    "width": "auto",
                    "active-name": this.activeName,
                    "open-names": this.openNames
                },
                class: "adm-navi",
                on: {
                    'on-select': (name) => {
                        this.onSelect(name)
                    }
                }
            },
                [
                    h('div', this.$slots.logo),
                    renderNavi(h, this.items)(this)
                ])
        },
        data() {
            return {
                activeName: "",
                openNames: [],
                types: ['sub', 'group', 'item'],
                components: ['iv-submenu', 'iv-menu-group', 'iv-menu-item'],
                items: getNavigations(navigations)
            }
        },
        watch: {
            active(val) {
                this.activeName = val;
            },
            opens(val) {
                this.openNames = val || [];
                this.$nextTick(() => {
                    this.$refs.menu.updateOpened();
                });
            }
        },
        methods: {
            onSelect(name) {
                const activeNode = this.$$deepFind({ id: name }, this.items);
                this.jump(activeNode);
            },
            jump(node) {
                if (node.type !== 'item') return;
                const path = node.path || `/${node.id}`;
                this.$router.push({ path });
            }
        }
    }
}