// 基础Promise 不处理所有情况
function PromiseImpl(executor) {
  this.resolveCallbacks = []
  this.rejectCallBacks = []
  this.state = 0 // -1 | 0 | 1
  this.result = null
  try {
    executor(resolver.bind(this), rejector.bind(this))
  }
  catch (error) {
    resolver.call(this, error)
  }
}
PromiseImpl.prototype.then = then
PromiseImpl.prototype.catch = catchFn
PromiseImpl.prototype.finally = finallyFn

PromiseImpl.resolve = function (ret) {
  if (ret instanceof PromiseImpl) return ret
  if (ret && typeof ret.then === 'function') {
    return new PromiseImpl((resolve, reject) => {
      ret.then(resolve, reject)
    })
  }
  return new PromiseImpl(resolve => resolve(ret))
}
PromiseImpl.reject = function (ret) {
  return new PromiseImpl((_, reject) => reject(ret))
}
// 有一个reject则直接整个reject ，所有 resolve 了则 resolve 所有结果
PromiseImpl.all = function (promises) {
  if (!Array.isArray(promises)) return PromiseImpl.reject(new Error('need Array.'))

  const ret = new Array(promises.length).fill(null)

  return new PromiseImpl((resolve, reject) => {
    promises.forEach((p, index) => {
      PromiseImpl.resolve(p).then(
        (r) => {
          ret[index] = r
          if (index === promises.length - 1)
            resolve(ret)
        },
        reject,
      )
    })
  })
}
// 有一个 resolve 或者 reject 则整个 resolve 或者 reject
PromiseImpl.race = function (promises) {
  if (!Array.isArray(promises)) return PromiseImpl.reject(new Error('need Array.'))
  return new PromiseImpl((resolve, reject) => {
    promises.forEach((p) => {
      PromiseImpl.resolve(p).then(resolve, reject)
    })
  })
}

function then(resolveCallback, rejectCallBack) {
  const innerPromise = new PromiseImpl((resolve, reject) => {
    nextTick(() => {
      switch (this.state) {
        case 0: { // padding
          if (resolveCallback) {
            this.resolveCallbacks.push(() => nextTick(() => {
              innerExector(resolveCallback, this.result, innerPromise, resolve, reject)
            }))
          }
          if (rejectCallBack) {
            this.rejectCallBacks.push(() => nextTick(() => {
              innerExector(rejectCallBack, this.result, innerPromise, resolve, reject, true)
            }))
          }
          break
        }
        case 1: { // fullfill
          innerExector(resolveCallback, this.result, innerPromise, resolve, reject)
          break
        }
        case -1: { // rejected
          innerExector(rejectCallBack, this.result, innerPromise, resolve, reject, true)
          break
        }
      }
    })
  })
  return innerPromise
}

function catchFn(err) {
  return then.call(this, undefined, err)
}

function finallyFn(fn) {
  return then.call(this, fn, fn)
}

function resolver(ret) {
  if (this.state !== 0) return
  this.state = 1
  this.result = ret
  this.resolveCallbacks.forEach((fn) => {
    fn(ret)
  })
}

function rejector(err) {
  if (this.state !== 0) return
  this.state = -1
  this.result = err
  this.rejectCallBacks.forEach((fn) => {
    fn(err)
  })
}

function resolvePromise(innerP, ret, resolve, reject) {
  if (innerP === ret) // 反回自己 报错
    throw new TypeError('cycle reference')

  if (ret instanceof PromiseImpl) { // 反回 Promise
    ret.then((r) => {
      resolvePromise(innerP, r, resolve, reject)
    }, reject)
  }
  else if (ret !== null && ((typeof ret === 'object' || (typeof ret === 'function')))) {
    // ...
    try {
      const then = ret.then
      if (typeof then === 'function') {
        let isCalled = false
        then.call(ret, (r) => {
          if (isCalled) return
          isCalled = true
          resolvePromise(innerP, r, resolve, reject)
        }, (e) => {
          if (isCalled) return
          isCalled = true
          reject(e)
        })
      }
      else { resolve(ret) }
    }
    catch (error) {
      reject(error)
    }
  }
  else {
    resolve(ret)
  }
}

function innerExector(callback, ret, innerP, resolve, reject, isReject) {
  try {
    if (typeof callback !== 'function') {
      isReject ? reject(ret) : resolve(ret)
    }
    else {
      const _ret = callback(ret)
      resolvePromise(innerP, _ret, resolve, reject)
    }
  }
  catch (error) {
    reject(error)
  }
}

function nextTick(fn) {
  if (typeof queueMicrotask === 'function')
    queueMicrotask(fn)
  else
    setTimeout(fn)
}

console.log('start')
const p1 = new PromiseImpl((resolve) => {
  console.log('inner sync exec.')
  setTimeout(() => {
    resolve(1)
  }, 1000)
})
p1.then((r) => {
  console.log('promise async then called.')
  console.log('promise then get value:', r)
  return new PromiseImpl((r) => {
    setTimeout(() => {
      r(2000)
    }, 4000)
  })
}).then((r) => {
  console.log('then return promise then called. and get value:', r)
}).finally(() => {
  console.log('finally.')
})
console.log('promise end.')
console.log('promise instance', p1)

PromiseImpl.race([
  PromiseImpl.reject(new Error('xx')),
  2,
]).then((r) => {
  console.log('rrr', r)
}).catch((e) => {
  console.log(e)
})
