function call(fn, context, ...args) {
  const key = '__flag' // Symbol('')
  context[key] = fn
  const ret = context[key](...args)
  delete context[key]
  return ret
}

function apply(fn, context, args) {
  return call(fn, context, ...(args || []))
}

function bind(fn, context, ...args) {
  return function (...restArgs) {
    return fn.apply(context, args.concat(restArgs))
  }
}

const obj = {
  name: 'a',
}

function a(callName) {
  console.log(this.name, this, callName)
}

call(a, obj, 'call')
apply(a, obj, ['apply'])
bind(a, obj)('bind')
