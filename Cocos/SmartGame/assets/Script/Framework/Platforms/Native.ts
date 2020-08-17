
export class Native{

    /**
     * 获取设备ID
     */
    public static getDeviveId() : string{
        let deviceId : string;
        if(cc.sys.isNative){
            if(cc.sys.OS_IOS == cc.sys.os){ 
                // jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showAds', '(Ljava/lang/String;)V', '945010616');
            } else if(cc.sys.OS_ANDROID == cc.sys.os) {
                deviceId = jsb.reflection.callStaticMethod('org/cocos2dx/javascript/DeviceIdUtil', 'getDeviceId', '()Ljava/lang/String;');
            }
        }

        return deviceId;
    }


  /**
   * 上报登录
   * @param userId 
   */
    public static reportLogin(userId : string) : void{
        if(cc.sys.isNative){
            if(cc.sys.OS_IOS == cc.sys.os){ 
                // jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showAds', '(Ljava/lang/String;)V', '945010616');
            } else if(cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('org/cocos2dx/javascript/TgaUtil', 'login', '(Ljava/lang/String;)V', userId);
            }
        }
    }


    /**
     * 上报自定义事件
     * @param key 
     * @param data 
     */
    public static reportEvent(key : string, data : string){
        if(cc.sys.isNative){
            if(cc.sys.OS_IOS == cc.sys.os){ 
                // jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'showAds', '(Ljava/lang/String;)V', '945010616');
            } else if(cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('org/cocos2dx/javascript/TgaUtil', 'reportEvent', '(Ljava/lang/String;Ljava/lang/String;)V', key, data);
            }
        }
    }
}