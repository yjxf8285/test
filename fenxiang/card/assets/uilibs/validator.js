/**
 * fixed validator
 * 
 * 遵循seajs module规范
 * @author qisx
 */

define(function(require, exports, module) {
    var ValidatorCore=require('validator_core'),
        Widget=require('widget');
    var validators = [];

    var Validator=ValidatorCore.extend({
        setup:function(){
            //Validation will be executed according to configurations stored in items.
            var that = this;
            this.items = [];
            isForm = this.element.get(0).tagName.toLowerCase() == "form";
            if (isForm) {
                novalidate_old = this.element.attr("novalidate");
                //disable html5 form validation
                //ie6/7不支持通过jquery attr设置noValidate方法,
                //Fixed from https://github.com/jzaefferer/jquery-validation/issues/555
                if ('noValidate' in document.createElement('form')){
                    this.element.attr("novalidate", "novalidate");
                }
                //this.element.attr("novalidate", "novalidate");
                //If checkOnSubmit is true, then bind submit event to execute validation.
                if (this.get("checkOnSubmit")) {
                    this.element.submit(function(e) {
                        e.preventDefault();
                        that.execute(function(err) {
                            if (!err) {
                                that.get("autoSubmit") && that.element.get(0).submit();
                            }
                        });
                    });
                }
            }
            this.on("formValidate", function() {
                var that = this;
                $.each(this.items, function(i, item) {
                    that.query(item.element).get("hideMessage").call(that, null, item.element);
                });
            });
            this.on("itemValidated", function(err, message, element) {
                if (err) this.query(element).get("showMessage").call(this, message, element); else this.query(element).get("hideMessage").call(this, message, element);
            });
            if (this.get("autoFocus")) {
                this.on("formValidated", function(err, results) {
                    if (err) {
                        var firstEle = null;
                        $.each(results, function(i, args) {
                            var error = args[0], ele = args[2];
                            if (error) {
                                firstEle = ele;
                                return false;
                            }
                        });
                        that.trigger("autoFocus", firstEle);
                        firstEle.focus();
                    }
                });
            }
            validators.push(this);
        },
        destroy: function() {
            if (isForm) {
                if (novalidate_old == undefined) this.element.removeAttr("novalidate"); else this.element.attr("novalidate", novalidate_old);
                this.element.unbind("submit");
            }
            var that = this;
            $.each(this.items, function(i, item) {
                that.removeItem(item);
            });
            var j;
            $.each(validators, function(i, validator) {
                if (validator == this) {
                    j = i;
                    return false;
                }
            });
            validators.splice(j, 1);
            Widget.prototype.destroy.call(this);
        }
    });
    module.exports=Validator;
});