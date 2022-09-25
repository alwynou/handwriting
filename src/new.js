function newImpl(fn, ...args) {
  // 拷贝原型
  const obj = Object.create(fn.prototype)
  const ctx = fn.apply(obj, args)
  // 有返回值且是对象直接返回 否则返回原型
  return ctx instanceof Object ? ctx : obj
}

function ConstructorFn(name) {
  this.name = name
}
ConstructorFn.prototype.getName = function () { console.log(this.name) }
ConstructorFn.static = function () { console.log('static') }

console.log(newImpl(ConstructorFn, 'newImpl'))
console.log(new ConstructorFn('new'))
