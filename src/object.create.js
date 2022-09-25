function objectCreate(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

const obj = {
  name: 'name',
  sub: 'sub',
}

console.log('objectCreate:', objectCreate(obj))
console.log('Object.create:', Object.create(obj))
// eslint-disable-next-line no-new-object
console.log('new Object:', new Object(obj))
