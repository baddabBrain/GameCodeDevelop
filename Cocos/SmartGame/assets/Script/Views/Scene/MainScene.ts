import UIMgr from "../../Framework/UI/UIMgr";
import PageIcon, { moveDirection } from "../UI/tabPage/pageIcon";
import SceneBase from "../../Framework/Scene/SceneBase";
const { ccclass, property } = cc._decorator;

/**
 * 切页类型
 */
export enum PageTabType {
    Task,
    Home,
    Levels,
    Team,
}

@ccclass
export class ToggleButton {
    @property({ type: cc.Enum(PageTabType) })
    type: PageTabType = PageTabType.Home;

    @property(cc.Toggle)
    toggleBtn: cc.Toggle = null;
}


@ccclass
export default class MainScene extends SceneBase {

    private _currentPage: PageTabType = null;
    private _tabUIMap: Map<PageTabType, cc.Node> = new Map();
    private _ischangePage: boolean = false;


    @property({ type: [ToggleButton] })
    toggleBtns: Array<ToggleButton> = [];

    @property({ type: [cc.Node] })
    page_icon: Array<cc.Node> = [];

    @property(cc.Node)
    page_bg: cc.Node = null;


    @property(cc.Prefab)
    taskPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    mainPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    levelPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    teamPrefab: cc.Prefab = null;

    onLoad() {
        
    }

    start() {

    }

    private getToggleBtn(type: PageTabType): cc.Toggle {
        for (let i: number = 0; i < this.toggleBtns.length; ++i) {
            if (this.toggleBtns[i].type == type) {
                return this.toggleBtns[i].toggleBtn;
            }
        }
        return null;
    }


    private async onTabBtnClick(event: cc.Touch, btnName: string) {

        if (this._currentPage == null) {
            let btn: cc.Toggle = this.getToggleBtn(PageTabType.Home);
            if (btn) {
                btn.isChecked = true;
            }
            this._currentPage = PageTabType.Home;
            return;
        }
  

        let toPageType: PageTabType = PageTabType[btnName];
        if (toPageType == undefined) {
            return;
        }

        if (this._ischangePage) {
            let btn: cc.Toggle = this.getToggleBtn(this._currentPage);
            if (btn) {
                btn.isChecked = true;
            }
            return;
        }

        let queryInfoRes: boolean = false;
        switch (toPageType) {
            case PageTabType.Home:
                queryInfoRes = true;
                break;
            case PageTabType.Levels:
                queryInfoRes = true;
                break;
            case PageTabType.Task:
                queryInfoRes = true;
                break;
            case PageTabType.Team:
                queryInfoRes = true;
                break;
        }
        if (queryInfoRes) {
            this.goTab(toPageType);
        }
    }


    private async goTab(type: PageTabType) {

        if (this._currentPage == type) {
            cc.log("current == type" + type)
            return;
        }

        let preUI: cc.Node = this.getUI(this._currentPage, false);
        if (preUI) {
            preUI.active = false;
        }

       // this.TabChangeAction(type);
        this._currentPage = type;

        let toUI: cc.Node = this.getUI(type, true);
        toUI && (toUI.active = true);

        let btn: cc.Toggle = this.getToggleBtn(type);
        if (btn) {
            btn.isChecked = true;
        }
    }

    private getUI(type: PageTabType, isCreate: boolean = false): cc.Node {
        let uiNode: cc.Node = this._tabUIMap.get(type);
        if (!uiNode && isCreate) {

            switch (type) {
                case PageTabType.Task: {
                    uiNode = cc.instantiate(this.taskPrefab);
                }
                    break;
                case PageTabType.Home: {
                    uiNode = cc.instantiate(this.mainPrefab);
                }
                    break;
                case PageTabType.Levels: {
                    uiNode = cc.instantiate(this.levelPrefab);
                }
                    break;
            }

            if (uiNode) {
                this._tabUIMap.set(type, uiNode);
                // UI适配
                let canvasSize: cc.Size = UIMgr.inst.getCanvasSize();
                uiNode.width = canvasSize.width;
                uiNode.height = canvasSize.height;
            }
        }
        return uiNode;
    }


    // private TabChangeAction(gotoPage: PageTabType): void {

    //     this._ischangePage = true;
    //     let start_node: number = this._currentPage > gotoPage ? gotoPage : this._currentPage;
    //     let finish_node: number = this._currentPage > gotoPage ? this._currentPage : gotoPage;
    //     let move_type: number = this._currentPage > gotoPage ? moveDirection.right : moveDirection.left;
    //     for (let i = start_node; i <= finish_node; i++) {
    //         let type: number = move_type;
    //         let act: cc.ActionInterval = null;
    //         let scale: number = 0.75;
    //         // this.page_line[i].active = true;
    //         act = cc.scaleTo(0.033 * 5, 0.75);
    //         if (i == gotoPage) {
    //             type = moveDirection.middle;
    //             act = cc.sequence(cc.scaleTo(0.033 * 5, 1.05), cc.scaleTo(0.033 * 2, 1));
    //             scale = 1;
    //         }
    //         PageIcon.move_Page(this.page_icon[i], i, type, act);
    //     }
    //     PageIcon.move_bg(this.page_bg, gotoPage);
    // }

    
}
