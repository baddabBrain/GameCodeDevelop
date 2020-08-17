import { PageTabType } from "../../Scene/MainScene";

const { ccclass, property } = cc._decorator;

export const moveDirection = {
    left: -1,
    middle: 0,
    right: 1,
}

@ccclass
export default class PageIcon {
    // private static choose_Pos: Array<number> = [-250, -125, 0, 125, 250];
    private static choose_Pos: Array<number> = [-200, 0, 200];
    private static default_y: number = 20;

    public static move_Page(page_node: cc.Node, pageType: PageTabType, move_Direction: number, scaleAct: cc.ActionInterval): void {
        let act: cc.ActionInterval = cc.moveTo(0.033 * 5, this.choose_Pos[pageType] + 75 * move_Direction, 0).easing(cc.easeCubicActionOut());
        let act2: cc.ActionInterval = cc.moveTo(0.033 * 5, 0, move_Direction == moveDirection.middle ? this.default_y + 75 : this.default_y).easing(cc.easeCubicActionOut());
        page_node.runAction(act);
        page_node.getChildByName("Background").runAction(cc.spawn(act2, scaleAct));
        // if (pageType == PageTabType.Task || pageType == PageTabType.Team) {
        //     page_node.getChildByName("tips").runAction(act2)
        // }
    }

    public static move_bg(bg_node: cc.Node, move_page: PageTabType) {
        let act: cc.ActionInterval = cc.moveTo(0.033 * 15, this.choose_Pos[move_page], 0).easing(cc.easeCubicActionOut());
        bg_node.runAction(cc.sequence(act));
    }

}
