export const getItem = item => Array.isArray(item) ? [...item].shift() : item
export const getSubs = (item, subKey = 'children') => {
    if (Array.isArray(item)) {
        return [...item].pop()
    } else {
        return !!item[subKey] ? item[subKey] : null
    }
}
export function deepEach(items, cb=()=>{}, options={}){
    options = {
        getSubs,
        getItem,
        ...options
    }
    const _deep = (items, parents=[])=> items.forEach(item=>{
        const _item = options.getItem(item)
        const _subs = options.getSubs(item)
        cb(_item, [...parents])
        if (!!_subs) _deep(_subs, [...parents, _item]);
    })
    _deep(items);
}

class Sitemap {
    constructor(map){
        this._map = map
        this._flatMap = []
        deepEach(this._map, (item, parents)=>{
            item.meta = { ...item.meta ? item.meta: {}, crumbs:[...parents] };
            this._flatMap.push({ ...item, children: [] })
        })
    }
    getRoutes(keys){
        const routes = []
        deepEach(keys, (node, parents) => {
            if(parents.length>0){
                const lastNode = [...parents].pop();
                if (!!lastNode) lastNode.children = [...lastNode.children, node];
            } else {
                routes.push(node);
            }
        }, {
            getItem: (key)=>{
                return {
                    children: [],
                    ...this._flatMap.find(node => node.name === getItem(key))
                }
            }
        });
        return routes
    }
    renderNavigation(keys, render){

    }
    getCrumb(metas){
        
    }
}

export default Sitemap;