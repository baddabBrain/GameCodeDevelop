import { PlatformType, Platform } from "./Platform";

export class Goose{

    private static _sdk : any;


    public static init () : void {
        this._sdk = window['Sentry'];

        if(!this._sdk){
            cc.warn("Goose SDK not load!");
            return;
        }

        if(!window['pub_ver']){
            cc.warn("pub_ver not found!");
            return;
        }

        if(!window['goose_dsn']){
            cc.warn("goose dsn not found!");
            return;
        }

        this._sdk.init({
            dsn: window['goose_dsn'],
            release: window['pub_ver']
        });

        let plt : PlatformType = Platform.getPlatType();
        switch(plt){
            case PlatformType.None:
                this._sdk.setExtra("channel", "none");
                break;
            case PlatformType.TaoBao:
                this._sdk.setExtra("channel", "taobao");
                break;
            case PlatformType.WeiXin:
                this._sdk.setExtra("channel", "weixin");
                break;
        }
        
    }


    /**
     *
     *
     * @static
     * @param {Object} data
     * @memberof Goose
     */
    public static captureException(data : Object) : void {
        if(this._sdk){
            this._sdk.captureException(data);
        }
    }


    

}