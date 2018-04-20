/**
 * Created by liuxiaofan on 2017/1/4.
 */
const str = 'ES61';
console.log(`Hello ${str}`);

const Dog = require('./../shared/dog');

const toby = new Dog('Toby');

console.log(toby.bark());