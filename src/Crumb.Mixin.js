export default function (sitemap){
    return {
        methods: {
            getCrumbs(route) {
                const result = [];
                route.matched.forEach(sub => {
                    if (sub.name === 'home') {
                        return;
                    } else if (!!sub.meta.crumb) {
                        sub.meta.crumb.forEach(crumb => {
                            const node = sitemap.find(page => page.name === crumb);
                            if (!node) return;
                            const { title, name, path } = node;
                            result.push({
                                title,
                                to: { path }
                            });
                        })
                    }
                    const node = sitemap.find(page => page.name === sub.name);
                    if (!node) return;
                    const { title, name } = node;
                    result.push({
                        title,
                        to: { name }
                    });
                })
                return result;
            }
        }
    }
}