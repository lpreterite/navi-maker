const { yeah } = require('../..')
describe('navi_maker-test', () => {
    it('The show yeah!', () => {
        expect(yeah()).to.equal("yeah!")
    })
})
