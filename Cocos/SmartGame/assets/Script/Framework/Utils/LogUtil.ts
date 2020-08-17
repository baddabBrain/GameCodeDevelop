export class LogUtil{
    
// console.log('%c this is a message','color:#0f0;')
// console.log('%c this %c is a %c message','color:#f00;','font-size:20px;','color:blue;background:yellow;')

    public static logInfo(msg: string|any, ...subst: any[]){

        if(typeof msg == 'string'){
            msg = '%c' + msg;
            cc.log(msg,'color:#0f0;')
        } else {
            cc.log(msg, subst);
        }
    }

    public static logWarn(msg: string|any, ...subst: any[]){
        if(typeof msg == 'string'){
            msg = '%c' + msg;
            cc.log(msg,'color:#FFD700;')
        } else {
            cc.log(msg, subst);
        }
    }


    public static  logError(msg: string|any, ...subst: any[]){
        if(typeof msg == 'string'){
            msg = '%c' + msg;
            cc.log(msg,'color:#FF3030;')
        } else {
            cc.log(msg, subst);
        }
    }
}