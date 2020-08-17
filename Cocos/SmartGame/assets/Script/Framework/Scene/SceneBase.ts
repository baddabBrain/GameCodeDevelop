import ResComponent from "../Res/ResComponent";
import { resLoader } from "../Res/ResLoader";
import { SceneType } from "../../Define/SceneDef";

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

@ccclass
export default class SceneBase extends ResComponent {

    @property({type:cc.Enum(SceneType),displayName:"场景类型"})
    sceneType : SceneType = SceneType.$Start;


    /**  静态变量，用于区分相同组件的不同实例 */
    private static sceneIndex: number = 0;

    // LIFE-CYCLE CALLBACKS:
    
    /**
     * 获取该Scene的资源占用key
     */
    public getUseKey(): string {
        if (!this.useKey) {
            this.useKey = resLoader.makeUseKey("SCENE_", SceneType[this.sceneType], `${++SceneBase.sceneIndex}`);
        }
        return this.useKey;
    }
}
