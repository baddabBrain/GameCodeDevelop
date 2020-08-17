// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// import { Platform, PlatformType } from "./Platform";

// const {ccclass, property} = cc._decorator;

// @ccclass
// export default class PlatformVisibility extends cc.Component {


//     @property({type: cc.Enum(PlatformType), displayName:"选择隐藏平台"})
//     platForm :PlatformType = PlatformType.WeiXin;


//     // LIFE-CYCLE CALLBACKS:

//     onLoad () {

//         this.node.active = !(this.platForm === Platform.getPlatType());
//     }


//     // update (dt) {}
// }
