export const wordLength = v => {
  let l = 0
  const hans = /[\u4e00-\u9fa5]+/
  for (let i of v) {
    if (hans.test(i)) {
      l += 2
    }
    else {
      l += 1
    }

  }
  return l
}
const lengthLimit = (v, length) => {
  if (wordLength(v) > length) {
    return false
  }
  return true
}

export default lengthLimit