import Sitemap from "@/index.js";

describe('sitemap testing...', () => {
    var _sitemap;
    before(()=>{
        _sitemap = new Sitemap(sitemap);
    })

    describe('getRoutes', () => {
        it('result is Array', () => {
            assert.isArray(_sitemap.getRoutes([
                "dashboard",
                "member",
                "member-detail",
                "membership",
                "user-vip"
            ]));
        })
    })
})