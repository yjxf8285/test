Component({
    externalClasses: ['i-class'],
    properties: {
        visible: {
            type: Boolean,
            value: false
        },

        mask: {
            type: Boolean,
            value: true
        },

        maskClosable: {
            type: Boolean,
            value: false
        },

        mode: {
            type: String,
            value: 'left' // left right
        }
    },
    data: {},
    methods: {
        handleMaskClick() {
            if (!this.data.maskClosable) {
                return;
            }
            this.triggerEvent('close', {});
        },
        myCatchTouch: function () {
            console.log('stop user scroll it!');
            return;
          },
    }
});