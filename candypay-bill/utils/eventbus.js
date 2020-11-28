/* 简易的观察者实现
 * @Author: Liuxiaofan 
 * @Date: 2018-10-25 16:24:51 
 * @Last Modified by: Liuxiaofan
 * @Last Modified time: 2018-10-25 17:24:17
 */
class EventBus {
    constructor() {
        this.events = {}
    }
    getEvents() {
        return this.events || (this.events = {});
    }
    getListeners(eventName) {
        let events = this.getEvents();
        return events[eventName] || (events[eventName] = []);
    }
    on(eventName, fn, time) {
        time = typeof (time) == 'number' ? time : -1;
        time = time >= -1 ? time : -1;
        var listeners = this.getListeners(eventName);
        var listenerWrapper = {
            listener: fn,
            time: time,
        };
        listeners.push(listenerWrapper);
        return this;
    }
    off(eventName) {
        var events = this.getEvents();
        events[eventName] = [];
    }
    removeListener(eventName, listener) {
        var listeners = this.getListeners(eventName);
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i].listener == listener) {
                delete listeners[i];
            }
        }
    }
    trigger(eventName, args) {
        var listeners = this.getListeners(eventName);
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];
            if (listener.time != -1) {
                listener.time--;
            }
            if (listener.time == 0) {
                this.removeListener(eventName, listener.listener);
            }

            listener.listener.apply(this, args || []);
        }
    }
    emit(eventName) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.trigger(eventName, args);
    }
}
export default EventBus