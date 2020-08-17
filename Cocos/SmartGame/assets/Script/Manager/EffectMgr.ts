// import TeMap from "../Framework/Sys/TeMap";


// // Learn TypeScript:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
// //  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// const { ccclass, property } = cc._decorator;

// @ccclass("EffectGroupType")
// class EffectGroupConfig {

//     @property({ type: cc.Node, displayName: "特效显示容器(层级)" })
//     group: cc.Node = null;

//     @property({ type: [cc.Enum(eEffectType)], displayName: "加入此容器特效类型列表" })
//     effectTypes: Array<eEffectType> = [];
// }

// @ccclass
// export default class EffectMgr extends cc.Component {

//     private static _inst: EffectMgr = null;
//     public static get inst(): EffectMgr {
//         if (!this._inst) {
//             cc.error("Effect Manger not load yet!");
//         }
//         return this._inst;
//     }

//     @property({ type: [cc.Prefab], displayName: "特效列表" })
//     effectPrefabs: cc.Prefab[] = [];

//     @property({ type: [EffectGroupConfig], displayName: "特效显示层级配置" })
//     effectConfigs: Array<EffectGroupConfig> = [];

//     private _effectPrefabMap: TeMap<cc.Prefab> = new TeMap<cc.Prefab>();
//     private _effectGroupMap: TeMap<cc.Node> = new TeMap<cc.Node>();
//     private _effectPool: TeMap<cc.NodePool> = new TeMap<cc.NodePool>();


//     onLoad() {

//         EffectMgr._inst = this;

//         // 特效显示层级映射初始化
//         // 注意：一个类型的特效只能配置到一种类型的显示容器
//         for (let i: number = 0; i < this.effectConfigs.length; ++i) {
//             let config: EffectGroupConfig = this.effectConfigs[i];
//             let effectTypes: Array<eEffectType> = config.effectTypes;
//             for (let j: number = 0; j < effectTypes.length; ++j) {
//                 this._effectGroupMap.set(effectTypes[j], config.group);
//             }
//         }

//         // 先实例化每个类型的特效放入池子
//         for (let i: number = 0; i < this.effectPrefabs.length; ++i) {
//             let prefab: cc.Prefab = this.effectPrefabs[i];
//             for (let ii = 0; ii < 30; ii++) {
//                 let node: cc.Node = cc.instantiate(prefab);
//                 let effect: Effect = node.getComponent(Effect);

//                 if (!effect) {
//                     cc.error("Effect component not attached to prefab !");
//                     continue;
//                 }

//                 // 初始化
//                 effect.init(this);
//                 effect.setCompleteCallback(this.recovery.bind(this));

//                 // 创建一个对象放入池子
//                 let pool: cc.NodePool = this._effectPool.get(effect.effectType);
//                 if (!pool) {
//                     pool = new cc.NodePool();
//                     this._effectPool.set(effect.effectType, pool);
//                 }
//                 pool.put(node);

//                 // 保存映射
//                 this._effectPrefabMap.set(effect.effectType, prefab);
//             }
//         }
//     }

//     start() {

//     }

//     /**
//      * 在指定位置添加一个特效
//      * @param nType 
//      * @param worldPos 
//      */
//     public addEffect(nType: eEffectType, worldPos?: cc.Vec2): cc.Node {
//         let effect: cc.Node = this.createEffect(nType);
//         if (!effect) {
//             cc.error("add effect fail!");
//             return null;
//         }

//         let effectGroup: cc.Node = this._effectGroupMap.get(nType);
//         if (effectGroup) {
//             effectGroup.addChild(effect);
//             if (worldPos) {
//                 effect.setPosition(effectGroup.convertToNodeSpaceAR(worldPos));
//             }
//         }

//         return effect;
//     }

//     /**
//      * 创建一个指定类型的特效
//      * @param nType 
//      */
//     public createEffect(nType: eEffectType): cc.Node {

//         let node: cc.Node = null;

//         let pool: cc.NodePool = this._effectPool.get(nType);
//         if (pool && pool.size() > 0) {
//             node = pool.get();

//             let effect: Effect = node.getComponent(Effect);
//             if (effect) {
//                 effect.reuse();
//             }
//         }

//         if (!node) {
//             let prefab: cc.Prefab = this._effectPrefabMap.get(nType);
//             if (!prefab) {
//                 cc.error("effect prefab not found!");
//                 return null;
//             }
//             node = cc.instantiate(prefab);

//             let effect: Effect = node.getComponent(Effect);
//             if (effect) {
//                 effect.init(this);
//                 effect.setCompleteCallback(this.recovery.bind(this));
//             }
//         }

//         return node;
//     }


//     private recovery(nType: eEffectType, node: cc.Node): void {
//         if (node) {
//             node.parent && node.removeFromParent();
//         }

//         let pool: cc.NodePool = this._effectPool.get(nType);
//         if (!pool) {
//             pool = new cc.NodePool;
//             this._effectPool.set(nType, pool);
//         }
//         pool.put(node);
//     }

//     // update (dt) {}

//     onDestroy() {

//         // 清空池子

//         let keys: Array<string> = this._effectPool.keys;
//         for (let i: number = 0; i < keys.length; ++i) {
//             let pool: cc.NodePool = this._effectPool.get(keys[i]);
//             if (pool) {
//                 pool.clear();
//             }
//         }

//         this._effectPool.clear();

//         EffectMgr._inst = null;
//     }
// }
