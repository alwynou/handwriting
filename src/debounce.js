function debounce(fn, duration) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const context = this
  let timer = null
  return function debounced(...args) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, duration)
  }
}
const fn = debounce((a) => {
  console.log('run:', a)
}, 300)

fn(1)
fn(2)
fn(3)
setTimeout(() => {
  fn(3)
}, 300)
