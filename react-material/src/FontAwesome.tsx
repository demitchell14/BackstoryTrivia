// import * as React from "react";

import {library} from "@fortawesome/fontawesome-svg-core";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {
    faArrowFromRight,
    faChartNetwork,
    faClipboardListCheck,
    faClone,
    faCopy,
    faEdit,
    faEye,
    faFile,
    faFolderOpen,
    faHome,
    faPollH,
    faSignOutAlt,
    faSlidersVSquare,
    faTimes,
    faTrash,
    faUnlink, faUndo
} from "@fortawesome/pro-light-svg-icons";

import {
    faArrowFromLeft,
    faCheck,
    faExchange,
    faHome as farHome,
    faImage,
    faMinus,
    faPlus,
    faTimes as farTimes
} from "@fortawesome/pro-regular-svg-icons"

import {faCheckCircle, faPlusCircle, faTimesCircle, faCogs,
    faCaretUp, faCaretDown
} from "@fortawesome/pro-solid-svg-icons"

export async function init() {
    //
    library.add(faHome, faPollH, faSlidersVSquare, faSignOutAlt, faChartNetwork);
    library.add(faTrash, faCopy, faClone, faFolderOpen, faEye, faFile, faTimes);
    library.add(faUnlink, faEdit, faArrowFromRight, faClipboardListCheck);

    library.add(faArrowFromLeft, faCheck, farHome, faImage, faMinus, faPlus, faExchange, farTimes);

    library.add(faCaretUp, faCaretDown, faCogs, faUndo, faCheckCircle, faTimesCircle, faPlusCircle)

    // const fal = [
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faHome"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faPollH"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faSlidersVSquare"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faSignOutAlt"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faChartNetwork"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faClipboardListCheck"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faTrash"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faCopy"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faClone"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faFolderOpen"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faEye"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faFile"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faTimes"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faUnlink"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faEdit"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-light-svg-icons/faArrowFromRight"),
    // ];
    //
    // const far = [
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-regular-svg-icons/faArrowLeft"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-regular-svg-icons/faCheck"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-regular-svg-icons/faHome"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-regular-svg-icons/faImage"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-regular-svg-icons/faMinus"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-regular-svg-icons/faPlus"),
    // ];
    //
    // const fas = [
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-solid-svg-icons/faCheckCircle"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-solid-svg-icons/faTimesCircle"),
    //     import(/* webpackChunkName: "fa" */"@fortawesome/pro-solid-svg-icons/faPlusCircle"),
    // ];
    //
    // //@ts-ignore
    // await Promise.all([...fal, ...far, ...fas]).then(each => {
    //     library.add(...each.map(e => e.definition));
    // });
}
//
// export function FAIcon(props: any) {
//
//     let lookup = {} as any;
//     if (props.icon) {
//         if (props.icon instanceof Array) {
//             lookup = {prefix: props.icon[0], iconName: props.icon[1]};
//         }
//     }
//
//
//     if (lookup && findIconDefinition && findIconDefinition(lookup)) {
//         return React.createElement(FontAwesomeIcon, {
//             ...props
//         })
//     }
//     const spanProps = {} as any;
//     if (props.fixedWidth) {
//         spanProps.style = {
//             width: "1.25rem"
//         }
//     }
//     return React.createElement("span", spanProps);
// }
//
// export default FAIcon;