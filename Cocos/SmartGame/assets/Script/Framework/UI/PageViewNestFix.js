// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

// @ccclass
// // export default class PageViewNestFix extends cc.PageView {

// //     //this is for nested scrollview
// //     _hasNestedViewGroup (event, captureListeners) {
// //         if(event.eventPhase !== cc.Event.CAPTURING_PHASE) return;

// //         var touch = event.touch;
// //         if(!touch) return;
// //         let endPt : cc.Vec2 = touch.getLocation();
// //         let startPt : cc.Vec2 = touch.getStartLocation();
// //         var deltaMove = endPt.sub(startPt);
// //         if (deltaMove.x > 7 || deltaMove.x < -7)
// //             return false;
// //        // if (deltaMove.y > 7 || deltaMove.y < -7)
// //        //     return false;
// //         if(captureListeners) {
// //             //captureListeners are arranged from child to parent
// //             for(var i = 0; i < captureListeners.length; ++i){
// //                 var item = captureListeners[i];

// //                 if(this.node === item) {
// //                     if(event.target.getComponent(cc.ViewGroup)) {
// //                         return true;
// //                     }
// //                     return false;
// //                 }

// //                 if(item.getComponent(cc.ViewGroup)) {
// //                     return true;
// //                 }
// //             }
// //         }

// //         return false;
// //     }
// // }


cc.Class({
    extends: cc.PageView,
    //this is for nested scrollview
    _hasNestedViewGroup: function (event, captureListeners) {
        if(event.eventPhase !== cc.Event.CAPTURING_PHASE) return;

        var touch = event.touch;
        if(!touch) return;
        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        if (deltaMove.x > 7 || deltaMove.x < -7)
            return false;
       // if (deltaMove.y > 7 || deltaMove.y < -7)
       //     return false;
        if(captureListeners) {
            //captureListeners are arranged from child to parent
            for(var i = 0; i < captureListeners.length; ++i){
                var item = captureListeners[i];

                if(this.node === item) {
                    if(event.target.getComponent(cc.ViewGroup)) {
                        return true;
                    }
                    return false;
                }

                if(item.getComponent(cc.ViewGroup)) {
                    return true;
                }
            }
        }

        return false;
    },
});