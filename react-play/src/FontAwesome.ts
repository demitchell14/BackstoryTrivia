import { library} from "@fortawesome/fontawesome-svg-core";

import {faLock} from "@fortawesome/pro-solid-svg-icons";
import {faTimes, faPlay, faInfo, faUsers, faHistory} from "@fortawesome/pro-regular-svg-icons";
import {
    faBars,
    faCalendarDay,
    faUsers as faUsersLt,
    faQuestionCircle,
    faSpinnerThird,
    faCircleNotch,
    faPauseCircle,
    faStopCircle,
    faSpinner
} from "@fortawesome/pro-light-svg-icons";


async function init() {
    //logger.debug("FontAwesome Init");
    library.add(faBars, faTimes, faLock, faPlay, faInfo, faUsers, faHistory, faCalendarDay, faUsersLt, faQuestionCircle, faSpinner, faSpinnerThird, faCircleNotch);
    library.add(faPauseCircle, faStopCircle)
    //library.add(faSave, faCopy, faRedo, faListAlt);

    //library.add(faEdit, faTrash);

    //library.add(faFingerprint, faSpinner, faSpinnerThird, faAngleLeft, faAngleRight, faChevronUp, faChevronDown);
    return library;
}
export default init;