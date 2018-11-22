// import { expect } from 'chai'
// import { shallowMount } from '@vue/test-utils'
// import HelloWorld from '@/components/HelloWorld.vue'

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       propsData: { msg }
//     })
//     expect(wrapper.text()).to.include(msg)
//   })
// })


import { assert } from "chai";
import { default as sitemap, concatArray } from "@/index";

describe('Testing', ()=>{
  it('export default is Array', ()=>{
    const a = [1,2,3]
    const b = [...sitemap]
    assert.isArray(concatArray(a, b));
  })
})