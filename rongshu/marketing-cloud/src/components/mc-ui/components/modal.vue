/*
 * @Author: AnThen
 * @Date: 2017-08-18 11:00:34
 * @Last Modified by: AnThen
 * @Last Modified time: 2017-08-18 16:26:40
 */
<style lang="scss" scoped>
  @import '~vars';
  .admin-modal-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .75);
  }
  .admin-modal {
    position: relative;
    top: 50%;
    margin: -129px auto 0 auto;
    width: 432px;
    height: 298px;
    background-color: #fff;
  }
  .admin-modal-header {
    height: 56px;
    margin: 0;
    overflow: hidden;
    .admin-modal-header-title {
      float: left;
      margin: 20px 0 0 28px;
      font-size: 16px;
      font-weight: bold;
      color: $greyDarken;
    }
    .admin-modal-header-close {
      float: right;
      width: 26px;
      height: 26px;
      margin: 16px 14px 0 0;
      cursor: pointer;
      background: url("../images/mc_modal_header_close.png") no-repeat center;
    }
    .admin-modal-header-close:hover{
      background: url("../images/mc_modal_header_close_hover.png") no-repeat center $grayBrighten;
    }
  }
  .admin-modal-content {
    height: 185px;
    overflow: auto;
  }
  .admin-modal-operations {
    padding-top: 12px;
    text-align: right;
    height: 44px;
    overflow: hidden;
  }
  .admin-modal-button:not(:last-child) {
    margin-right: 8px;
  }
</style>
<template>
  <div
    class="admin-modal-container"
    v-show="localDisplay"
    ref="modal"
    @click="maskClick">
    <div class="admin-modal" @click.stop="() => {}" :style="modalStyle">
      <div class="admin-modal-header" v-show="title">
        <div class="admin-modal-header-title">{{ title }}</div>
        <div class="admin-modal-header-close" @click="maskClick">&nbsp;</div>
      </div>
      <div class="admin-modal-content" ref="content">
        <slot></slot>
      </div>
      <div class="admin-modal-operations" v-show="buttonList.length" ref="operations">
        <button
          class="admin-modal-button"
          v-for="button in buttonList"
          :key="button"
          :class="button.buttonClass"
          :style="{ 'background-color': button.bgColor }"
          @click="operate(button.name, button.handler)">{{ button.text }}</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { getElementSize } from '../helpers/common'
  export default {
    name: 'mc-modal',
    mounted () {
      // document.body.appendChild(this.$refs.modal)
      this.calModalContentStyle()
    },
    // destroyed () {
    //   // document.body.removeChild(this.$refs.modal)
    // },
    data () {
      return {
        builtInButtons: {
          confirm: {
            text: '确定',
            name: 'confirm',
            buttonClass: 'mc-primary'
          },
          cancel: {
            text: '取消',
            name: 'cancel',
            buttonClass: 'mc-auxiliary'
          }
        },
        localDisplay: this.display
      }
    },
    props: {
      display: {
        type: Boolean,
        require: true
      },
      title: {
        type: String
      },
      buttons: {
        type: [Object, Array, String]
      },
      width: {
        type: [String, Number]
      },
      height: {
        type: [String, Number],
        valodator (v) {
          if (!/^\d+(px)*$/g.test(v)) {
            console.warn('mc-modal: height can not be percentage because we need absolute height value to put it in middle of the window')
            return false
          }
          return true
        }
      }
    },
    watch: {
      display (v) {
        this.localDisplay = v
        if (v) {
          this.calModalContentStyle()
        }
      },
      localDisplay (v) {
        this.$emit('mc-modal-' + (v ? 'on' : 'off'))
      }
    },
    computed: {
      buttonList () {
        let buttons = this.buttons
        let buttonList = []
        if (typeof buttons === 'string') { // build-in buttons
          if (this.builtInButtons[buttons]) buttonList.push(this.builtInButtons[buttons])
        } else if (typeof buttons === 'object') {
          if (buttons instanceof Array) { // if array, multipal buttons
            buttons.forEach(button => {
              if (typeof button === 'string') {
                if (this.builtInButtons[button]) buttonList.push(this.builtInButtons[button])
              } else if (typeof button === 'object') {
                buttonList.push(button)
              }
            })
          } else { // if object，single button
            buttonList.push(buttons)
          }
        }
        return buttonList
      },
      modalStyle () {
        let { width, height } = this
        // width can be form like 30% or 45px
        // height can only be form like 45px
        if (height === '') height = 298
        height = height < 140 ? 140 : height
        // if not given width
        if (!width) width = ''
        else width = width + ''
        return {
          width: width.indexOf('%') === -1 ? width.indexOf('px') ? width : parseInt(width) + 'px' : width,
          height: parseInt(height) + 'px',
          marginTop: parseInt(height) / 2 * -1 + 'px'
        }
      }
    },
    methods: {
      maskClick () {
        this.localDisplay = false
      },
      operate (name, handler) {
        if (name) this.$emit('mc-modal-' + name)
        let handlerRes = null
        if (handler && typeof handler === 'function') {
          handlerRes = handler()
          if (!handlerRes) this.localDisplay = false
        } else {
          this.localDisplay = false
        }
      },
      calModalContentStyle () {
        let { height, title } = this
        height = height || 298
        height = height < 140 ? 140 : height
        let operationHeight = 0
        if (this.buttons && this.buttons.length && this.$refs.operations) {
          operationHeight = getElementSize(this.$refs.operations, true).height
        }
        this.$refs.content.style.height = parseInt(height) - 64 - operationHeight - (title ? 31 : 0) + 'px'
      }
    }
  }
</script>
