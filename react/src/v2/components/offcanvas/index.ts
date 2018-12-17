
import main from "./OffCanvas";
import body from "./OffCanvasBody";
import menu from "./OffCanvasMenu";

export const OffCanvas = main;
export const OffCanvasBody = body;
export const OffCanvasMenu = menu;

export interface OffCanvas extends main {}
export interface OffCanvasBody extends body {}
export interface OffCanvasMenu extends menu {}
