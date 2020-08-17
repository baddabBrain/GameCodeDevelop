// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/*

const {ccclass, property} = cc._decorator;


@ccclass
export default class MXVideComponent extends cc.VideoPlayer{

    private __video : HTMLVideoElement;
    private __texture : cc.Texture2D;
    private __canvasImage : HTMLCanvasElement;
    private __canvasCtx : CanvasRenderingContext2D;
    private __sprite : cc.Sprite;
    // private _updateOptions : any;

    onLoad(){
        super.onLoad();


        let impl : any = this['_impl'];
        if(!impl){
            cc.error("cocos engine updated, no _impl member found!");
            return;
        }

        let video : HTMLVideoElement =impl._video;
        if(!video){
            cc.error("cocos engine updated, no _video member found!");
            return;
        }
        this.__video = video;
        this.__video.style.display = 'none';

        let canvas : HTMLCanvasElement = document.createElement('canvas');
        canvas.width = this.node.width;
        canvas.height = this.node.height;
        this.__canvasImage = canvas;
        this.__canvasCtx = canvas.getContext('2d');
        this.__sprite = this.node.getComponent(cc.Sprite);


        // this._texture = new cc.Texture2D();
        // this._texture.initWithElement(this._canvasImage);
        // this.sprite.spriteFrame = new cc.SpriteFrame(this._texture);
        this.schedule(this.updateTexture, 1 / 25, cc.macro.REPEAT_FOREVER);

        // this._updateOptions = {
        //     width : this.node.width,
        //     height : this.node.height,
        //     minFilter: 1,
        //     magFilter: 1,
        //     wrapS: 33071,
        //     wrapT: 33071,
        //     format: 16,
        //     mipmap: undefined,
        //     images: [canvas],
        //     image: canvas,
        //     flipY: false,
        //     premultiplyAlpha: false,
        //     hasMipmap: false,
        //     anisotropy: undefined,
        //     mipFilter: undefined
        // }
    }


    private updateTexture() : void{

        if(!this.__texture){
            this.__canvasCtx.drawImage(this.__video, 0, 0, this.__video.videoWidth, this.__video.videoHeight); 
            this.__texture = new cc.Texture2D();
            this.__texture.initWithElement(this.__canvasImage);
            // this.sprite.spriteFrame = new cc.SpriteFrame(this._texture);
            this.__sprite.spriteFrame = new cc.SpriteFrame(this.__texture);
        } else {
            this.__canvasCtx.drawImage(this.__video, 0, 0, this.__video.videoWidth, this.__video.videoHeight); 
            // this._texture.update(this._updateOptions);
            // let texture2d_js = this._texture['_texture'];
            // if(texture2d_js && texture2d_js['updateImage']){
            //     texture2d_js['updateImage']({width : this.node.width, height: this.node.height, level : 0, image:this._canvasImage, flipY : false, premultiplyAlpha : false});
            // }
            // this._texture.releaseTexture();
            // this._texture.destroy();
            this.__texture = new cc.Texture2D();
            this.__texture.initWithElement(this.__canvasImage);
            // this.sprite.spriteFrame = new cc.SpriteFrame(this._texture);
            this.__sprite.spriteFrame = new cc.SpriteFrame(this.__texture);
        }

    }

}

*/