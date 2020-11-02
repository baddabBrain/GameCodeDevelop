// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TeMap from "../Sys/TeMap";
import { UIEffectType } from "./UIEffectType";
import UIEffect from "./UIEffect";
import { ResUtil } from "../Res/ResUtil";
import { NodePool } from "../Res/NodePool";
import { Handler } from "../Sys/Handler";

const {ccclass, property} = cc._decorator;

/**
 *  显示层级组配置
 */
@ccclass("EffectGroupType")
class EffectGroupConfig{

    @property({type:cc.Node, displayName:"特效显示容器(层级)"})
    group: cc.Node = null;

    @property({type:[cc.Enum(UIEffectType)], displayName:"加入此容器特效类型列表"})
    effectTypes : Array<UIEffectType> = [];
}

/**
 *  perfab <--> effectType
 */
@ccclass("EffectPrefab")
class EffectPrefab{

    @property({type:cc.Enum(UIEffectType), displayName:"特效类型"})
    effectType: UIEffectType = UIEffectType.None;

    @property({type:cc.Prefab, displayName:"prefab"})
    prefab : cc.Prefab = null;
}


@ccclass
export default class UIEffectMgr extends cc.Component {

    private static _inst: UIEffectMgr = null;
    public static get inst(): UIEffectMgr {
        if (!this._inst) {
            cc.error("Effect Manger not load yet!");
        }
        return this._inst;
    }

    @property({type:[EffectPrefab], displayName:"特效列表"})
    effectPrefabs: EffectPrefab[] = [];

    @property({type:[EffectGroupConfig], displayName:"特效显示层级配置"})
    effectConfigs: Array<EffectGroupConfig> = [];

    private _effectPrefabMap : TeMap<cc.Prefab> = new TeMap<cc.Prefab>();
    private _effectGroupMap : TeMap<cc.Node> = new TeMap<cc.Node>();
    private _effectPool: TeMap<NodePool> = new TeMap<NodePool>();


    onLoad() {

        UIEffectMgr._inst = this;

        // 特效显示层级映射初始化
        // 注意：一个类型的特效只能配置到一种类型的显示容器
        for(let i : number = 0; i < this.effectConfigs.length; ++i){
            let config : EffectGroupConfig = this.effectConfigs[i];
            let effectTypes : Array<UIEffectType> = config.effectTypes;
            for(let j : number = 0; j < effectTypes.length; ++j){
                this._effectGroupMap.set(effectTypes[j], config.group);
            }
        }

        // 先实例化每个类型的特效放入池子
        for (let i: number = 0; i < this.effectPrefabs.length; ++i) {

            let prefabInfo : EffectPrefab = this.effectPrefabs[i];
            let prefab: cc.Prefab = prefabInfo.prefab;

            // 创建一个对象放入池子
            let pool: NodePool = new NodePool();
            pool.init(prefab);
            this._effectPool.set(prefabInfo.effectType, pool);

            // 保存映射
            this._effectPrefabMap.set(prefabInfo.effectType, prefab);
        }
    }

    /**
     * 在指定位置添加一个特效
     * @param nType 
     * @param worldPos 
     */
    public addEffect(nType: UIEffectType, autoPlay : boolean = true, worldPos ?: cc.Vec2, autoRecovery : boolean = true): UIEffect {
        let effect: cc.Node = this.createEffect(nType, autoPlay, autoRecovery);
        if (!effect) {
            cc.error("add effect fail!");
            return null;
        }

        let effectGroup : cc.Node = this._effectGroupMap.get(nType);
        if(effectGroup){
            effectGroup.addChild(effect);
            if(worldPos){
                effect.setPosition(effectGroup.convertToNodeSpaceAR(worldPos));
            }
        }

        let effectComp : UIEffect = effect.getComponent(UIEffect);
        
        return effectComp;
    }

    /**
     * 创建一个指定类型的特效
     * @param nType 
     */
    public createEffect(nType: UIEffectType, autoPlay : boolean = true, autoRecovery : boolean = true): cc.Node {

        let node: cc.Node = null;

        let pool: NodePool = this._effectPool.get(nType);
        if (pool) {
            node = pool.getNode();
        }

        if (!node) {
            let prefab: cc.Prefab = this._effectPrefabMap.get(nType);
            if (!prefab) {
                cc.error("effect prefab not found!");
                return null;
            }
            node = ResUtil.instantiate(prefab);
        }

        if(node){
            let effect: UIEffect = node.getComponent(UIEffect);
            if (effect) {
                effect.effectType = nType;
                
                if(autoRecovery){
                    effect.setCompleteCallback(new Handler(this, this.recovery, null, true));
                }

                if(autoPlay){
                    effect.playAni();
                }
            } else {
                cc.error("effect script not found!");
            }
        }

        return node;
    }


    private recovery(nType: UIEffectType, node: cc.Node): void {
        if (node) {
            node.parent && node.removeFromParent();
        }

        let pool: NodePool = this._effectPool.get(nType);
        if (!pool) {
            pool = new NodePool();
            this._effectPool.set(nType, pool);
        }
        pool.freeNode(node);
    }


    onDestroy() {

        // 清空池子

        let keys: Array<string> = this._effectPool.keys;
        for (let i: number = 0; i < keys.length; ++i) {
            let pool: NodePool = this._effectPool.get(keys[i]);
            if (pool) {
                pool.destory();
            }
        }

        this._effectPool.clear();

        UIEffectMgr._inst = null;
    }
}
