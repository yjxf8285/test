/**
 * Created by liuxiaofan on 2017/1/5.
 */
class Dog {
    constructor(name) {
        this.name = name;
    }

    bark() {
        return `Wah wah, I am ${this.name}`;
    }
}
console.info('lxf');

module.exports = Dog;