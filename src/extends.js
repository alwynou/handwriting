// --------------------------------------------------------------------------------
//      寄生继承
// --------------------------------------------------------------------------------
console.log('----------寄生继承--------------')
// 父构造函数
function Parent2(name) {
  this.name = name // Parent property
}
Parent2.prototype.getName = function () { console.log(this.name) }

function creator(obj, name, sex) {
  /** 寄生 */
  function Children2() {}
  Children2.prototype = obj
  const children2 = new Children2()
  /** 属性增强 */
  children2.sex = sex
  children2.name = name
  children2.getSex = function () { console.log(this.sex) }
  return children2
}

const parent2 = new Parent2('parentName')

const children2 = creator(parent2, 'childrenName', 'male')

console.log(children2)
children2.getName()
children2.getSex()

// --------------------------------------------------------------------------------
//      组合继承
// --------------------------------------------------------------------------------
console.log('----------组合继承--------------')
// 父构造函数
function Parent(name) {
  this.name = name // Parent property
}
// 父类方法
Parent.prototype.getName = function () { console.log(this.name) }

// 子构造函数
function Children(name, sex) {
  // 第二次调用父类构造函数， 继承父类属性
  Parent.call(this, name)
  // 添加子类自己的私有属性
  this.sex = sex
}
// 第一次调用父类构造函数，子类原型继承父类
Children.prototype = new Parent()
// 将构造函数指向自己
Children.prototype.constructor = Children
// 添加子类自己的方法
Children.prototype.getsex = function () { console.log(this.sex) }

// 创建实例
const children1 = new Children('childrenName', 'male')

console.log(children1)
children1.getName()
children1.getsex()

// --------------------------------------------------------------------------------
//      寄生组合继承
// --------------------------------------------------------------------------------
console.log('----------寄生组合继承---------------')
// 父构造函数
function Parent3(name) {
  this.name = name // Parent property
}
// 父类方法
Parent3.prototype.getName = function () { console.log(this.name) }

// 子构造函数
function Children3(name, sex) {
  //  继承父类属性
  Parent3.call(this, name)
  // 添加子类自己的私有属性
  this.sex = sex
}
Children3.prototype = Object.create(Parent3.prototype) // 寄生
// 将构造函数指向自己
Children3.prototype.constructor = Children
// 添加子类自己的方法
Children3.prototype.getsex = function () { console.log(this.sex) }

// 创建实例
const children3 = new Children3('childrenName', 'male')

console.log(children3)
children3.getName()
children3.getsex()

// --------------------------------------------------------------------------------
//     ES6
// --------------------------------------------------------------------------------
console.log('-----------ES6 extends--------------')
class ClassParent {
  constructor(name) {
    this.name = name
  }

  getName() { console.log(this.name) }
}

class ClassChildren extends ClassParent {
  constructor(name, sex) {
    super(name)
    this.sex = sex
  }

  getsex() { console.log(this.sex) }
}
const children4 = new ClassChildren('childrenName', 'male')
console.log(children4)
children4.getName()
children4.getsex()

console.log(['原生ES6', '寄生组合', '组合', '寄生'].join(' > '))
