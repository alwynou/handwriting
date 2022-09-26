function throttle(fn, duration) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const context = this
  let flag = true
  return function throttled(...args) {
    if (flag) {
      flag = false
      fn.apply(context, args)
      setTimeout(() => { flag = true }, duration)
    }
  }
}

const fn = throttle((a) => {
  console.log(a)
}, 300)

fn(1)
fn(2)
fn(3)
setTimeout(() => {
  fn(4)
}, 300)
