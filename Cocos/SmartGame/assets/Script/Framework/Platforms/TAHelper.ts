import { Native } from "./Native";

export class TAHelper{


    private static _sdk : any;


    static init() : void{
        this._sdk = window['TA'];
    }

    static reportLogin(accountId : string) : void{
        try{

            if(cc.sys.isNative){
                Native.reportLogin(accountId);
            } else {
                this._sdk.login(accountId);
                this._sdk.setSuperProperties({"channel": "weixin"});
                this._sdk.init();
            }

            
        } catch(e){

        }
        
    }

    static reportEvent(eventKey : string, data : Object) : void{
    
        try{
            if(cc.sys.isNative){
                Native.reportEvent(eventKey, JSON.stringify(data));
            } else{
                this._sdk.track(eventKey,  data);
            }
        } catch(e){

        }
        
    }

    static userSetOnce(data : Object) : void{
        try{
            if(cc.sys.isNative){
                // Native.reportEvent(eventKey, JSON.stringify(data));
            } else{
                this._sdk.userSetOnce(data);
            }
        } catch(e){

        }
    }
}