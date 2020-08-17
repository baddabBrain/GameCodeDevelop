export class TdUtil{

    private static tdgaSDK : any = null;


    /**
     * 初始化
     */
    public static init() : void{
        this.tdgaSDK = window['TDGA'];

        if(!this.tdgaSDK){
            cc.error("talking data sdk not load!");
            return;
        }

        // 注册、登录、切换帐户、唤醒游戏时传入玩家账户信息
        this.tdgaSDK.Account({
            accountId : this.tdgaSDK.getDeviceId()
        });

    }


    /**
     * 上报自定义事件
     */
     public static reportEvent(eventKey : string, data : Object) : void{
         
        if(!this.tdgaSDK){
            cc.error("talking data sdk not load!");
            return;
        }

        this.tdgaSDK.onEvent(eventKey, data);
     }


}