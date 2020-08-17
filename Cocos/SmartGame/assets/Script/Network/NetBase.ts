import { NetApi } from "./NetApi";
import { HttpRequest } from "../Framework/Net/HttpRequest";
import { ErrorCode } from "./Net";
import { UIFacade } from "../Framework/UI/UIFacade";
import { PlayerModel } from "../Model/PlayerModel";
import { Platform, PlatformType } from "../Framework/Platforms/Platform";

export class NetBase {

    protected static get sBaseURL(): string {
        let type : PlatformType = Platform.getPlatType();
        let url : string = "";
        switch(type){
            case PlatformType.WeiXin:
                url = 'https://' + Platform.getServerAddr();
                break;
            default:
                url = (window.location.protocol || "http:") + '//' + Platform.getServerAddr();
                break;
        }

        // TODO: 测试
        if(cc.sys.isNative){
            url = 'http://' + Platform.getServerAddr();
        }
        
        return url;
    }


    protected static get(url: string, params: Object, data: Object, header: Object = { "Content-Type": "application/json" }, timeout: number = 5): Promise<any> {
        return this.sendRequset("get", url, params, data, header, timeout);
    }

    protected static post(url: string, params: Object, data: Object, header: Object = { "Content-Type": "application/json" }, timeout: number = 5): Promise<any> {
        url = this.sBaseURL + url;
        
        let gameId : string  = PlayerModel.inst.getGameId();
        let token : string = PlayerModel.inst.getToken();
        if(!data){
            data = {};
        }
        if(gameId && gameId.length > 0 && token && token.length > 0){
            data['gameId'] = gameId;
            data['token'] = token;
        }
        return this.sendRequset("post", url, params, data, header, timeout);
    }

    private static async  sendRequset(method: string, url: string, params: Object, data: Object, header: Object, timeout: number): Promise<any> {
        let promise: Promise<{}>;
        switch (method.toLocaleLowerCase()) {
            case "get":
                promise = HttpRequest.get(url, params, header, timeout);
                break;
            case "post":
                promise = HttpRequest.post(url, params, data, header, timeout);
                break;
            default:
                cc.error("unkonw  http request method!");
                break;
        }

        // 通用的错误异常处理
        
        let ret : any = await promise;
        // 通用错误码处理
        if (ret.code == 0) {
            return ret;
        } else {
            this.onErrorCode(ret.code, ret.errMsg);
            throw ret.code;
        }
    }

    /**
     * 错误码处理
     * 不发给上层逻辑处理了吧
     * @param nCode 
     */
    private static onErrorCode(nCode: ErrorCode, errMsg ?: string): void {
        if(errMsg){
            UIFacade.showToast(`${errMsg}`);
        }
        
    }

}