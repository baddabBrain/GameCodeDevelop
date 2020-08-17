// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property,executeInEditMode, disallowMultiple, requireComponent, menu} = cc._decorator;

cc.macro.ENABLE_WEBGL_ANTIALIAS = true;

@ccclass()
//@ts-ignore
@executeInEditMode(true)
//@ts-ignore
@disallowMultiple(true)
@requireComponent(cc.Mask)
@menu("Renderer Component/Mask(RoundRect)")
export default class RoundRectMask extends cc.Component {

    @property
    private _radius: number = 11;

    @property({tooltip: "圆角半径:\n0-1之间为最小边长比例值, \n>1为具体像素值"})
    public get radius(): number {
        return this._radius;
    }


    public set radius(r: number) {
        this._radius = r;
        this.updateMask(r);
    }

    protected mask: cc.Mask = null;

    protected onEnable(): void {
        this.mask = this.getComponent(cc.Mask);
        this.updateMask(this.radius);
    }

    private updateMask(r: number) {
        let _radius = r >= 0 ? r : 0;
        if (_radius < 1) {
            _radius = Math.min(this.node.width, this.node.height) * _radius;
        }
        this.mask["radius"] = _radius;
        this.mask["onDraw"] = this.onDraw.bind(this.mask);
        this.mask["_updateGraphics"] = this._updateGraphics.bind(this.mask);
        this.mask.type = cc.Mask.Type.RECT;
    }

    private _updateGraphics() {

        // @ts-ignore.
        let graphics = this._graphics;
        if (!graphics) {
            return;
        }
        this.onDraw(graphics);
    }

    /**
     * mask 用于绘制罩子的函数.
     * this 指向mask 对象,需要特别注意.
     * @param graphics
     */
    protected onDraw(graphics: cc.Graphics) {
        // Share render data with graphics content
        graphics.clear(false);
        let node = this.node;
        let width = node.width;
        let height = node.height;
        let x = -width * node.anchorX;
        let y = -height * node.anchorY;
        graphics.roundRect(x, y, width, height, this.radius || 0);
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            graphics.stroke();
        } else {
            graphics.fill();
        }
    }
}
