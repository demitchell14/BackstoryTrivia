import * as React from "react";
import {findIconDefinition, library} from "@fortawesome/fontawesome-svg-core";

import {faLock} from "@fortawesome/pro-solid-svg-icons";
import {faTimes, faPlay, faInfo, faUsers, faHistory} from "@fortawesome/pro-regular-svg-icons";
import {faBars, faSpinner} from "@fortawesome/pro-light-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default function() {
    //console.debug("FontAwesome Init");
    library.add(faBars, faTimes, faLock, faPlay, faInfo, faUsers, faHistory, faSpinner);
    //library.add(faSave, faCopy, faRedo, faListAlt);

    //library.add(faEdit, faTrash);

    //library.add(faFingerprint, faSpinner, faSpinnerThird, faAngleLeft, faAngleRight, faChevronUp, faChevronDown);
}

export function FAIcon (props:any) {
    let lookup = {} as any;
    if (props.icon) {
        if (props.icon instanceof Array) {
            lookup = {prefix: props.icon[0], iconName: props.icon[1]};
        }
    }

    if (lookup && findIconDefinition(lookup)) {
        return React.createElement(FontAwesomeIcon, {
            ...props
        })
    }
    return React.createElement("span");
}