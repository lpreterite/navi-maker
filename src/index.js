const a = [1,2,3]
const b = [4,5]

export function concatArray(...arrays){
    return [].concat(...arrays)
}

export default concatArray(a, b);