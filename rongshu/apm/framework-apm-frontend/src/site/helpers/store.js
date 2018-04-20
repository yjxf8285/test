// 带有持久化功能的简洁store
import Vue from 'vue'

const STORAGENAME = '_store_'

function getStorage () {
  if (!window.localStorage.getItem(STORAGENAME)) {
    window.localStorage.setItem(STORAGENAME, JSON.stringify({}))
  }
  return JSON.parse(window.localStorage.getItem(STORAGENAME))
}

function setItemToStorage (key, stuff, done) {
  // stuff 只能是字符串或者普通对象
  let store = getStorage()
  store[key] = stuff
  try {
    window.localStorage.setItem(STORAGENAME, JSON.stringify(store))
    done(true)
  } catch (e) {
    console.warn('Store: stuff can only be string or plain object!')
    done(false)
  }
}

function getItemFromStorage (key) {
  return getStorage()[key]
}

let store = new Vue({
  data: {
    statesGroup: []
  },
  methods: {
    set: function (key, stuff) {
      // if (this.statesGroup.indexOf(key) === -1) {
      //   console.warn('Store: you should addStates in store before set it')
      //   return
      // }
      setItemToStorage(key, stuff, (res) => {
        if (res) {
          this.emit(key, stuff)
        }
      })
    },
    get: function (key) {
      // if (this.statesGroup.indexOf(key) === -1) {
      //   console.warn('Store: you should addStates in store before get it')
      //   return
      // }
      return getItemFromStorage(key)
    },
    emit (key, stuff) {
      console.log(`trigger ${key}-change`)
      this.$emit(`${key}-change`, stuff)
      let store = getStorage()
      let statesGroup = {}
      for (let value of this.statesGroup) {
        if (!store[value]) return
        else statesGroup[value] = store[value]
      }
      console.log('trigger change')
      this.$emit(`change`, statesGroup)
    },
    addStatesGroup (statesGroup) {
      this.statesGroup = this.statesGroup.concat(statesGroup)
    },
    removeStatesGroup (state) {
      this.statesGroup = this.statesGroup.filter(s => s !== state)
    }
  }
})

export default store
