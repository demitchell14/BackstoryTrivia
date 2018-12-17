import * as React from "react";
import AdminAuthorization from "../../handlers/authorization/AdminAuthorization";
//import QuestionsV1 from "./QuestionsV1";
import {Provider, Subscribe} from "unstated";
import {OffCanvas, OffCanvasBody, OffCanvasMenu} from "../../components/offcanvas";
import QuestionsContainer from "../../handlers/questions/QuestionsContainer";
import InputGroupComponent from "../../../components/InputGroupComponent";
import { RefObject,} from "react";
//import {SyntheticEvent} from "react";
import QuestionListGroup from "./QuestionListGroup";
import {CSSTransition, TransitionGroup} from "react-transition-group";
//import {OffCanvas, OffCanvasBody, OffCanvasMenu} from "react-offcanvas";

import "./style.css";
import {Link} from "react-router-dom";
import QuestionCreator from "../creators/question/QuestionCreator";

class Questions extends React.Component<QuestionProps, QuestionState> {
    questionContainer: QuestionsContainer;

    private references: {
        hamburger: RefObject<HTMLDivElement>;
        sticky: RefObject<HTMLDivElement>;
        test: RefObject<any>;
    }


    public constructor(props) {
        super(props);

        this.questionContainer = new QuestionsContainer();
        this.state = {
            isMenuActive: window.innerWidth >= 768,
            menuWidth: window.innerWidth >= 425 ? 300 : window.innerWidth,
            creatorActive: false,
            stickyMenu: false,
        } as QuestionState;
        this.references = {
            hamburger: React.createRef(),
            sticky: React.createRef(),
            test: React.createRef()
        }

        //console.log(this.props)
    }

    public componentDidMount(): void {

    }


    public componentWillUnmount(): void {
       //window.removeEventListener('scroll', this.stickyScrollListener);
    }

    public componentWillMount(): void {
        //const obj = this.questionContainer;
        this.componentWillUpdate(this.props, this.state, {});

    }


    public componentWillUpdate(nextProps: Readonly<QuestionProps>, nextState: Readonly<QuestionState>, nextContext: any): void {


        if (nextProps.location.hash === "#/creator" && !nextState.creatorActive) {
            const body = document.body;
            body.classList.add("creator-block")
            this.setState({creatorActive: true});
        }
        if (nextProps.location.hash !== "#/creator" && nextState.creatorActive) {
            const body = document.body;
            body.classList.remove("creator-block");
            this.setState({creatorActive: false});
        }
    }

    public render() {
        //console.log(this.state)
        return (
            <Provider inject={[this.questionContainer]}>
                <Subscribe to={[AdminAuthorization, QuestionsContainer]}>
                    {(admin:AdminAuthorization, questions:QuestionsContainer) => this._render(admin, questions)}
                </Subscribe>
            </Provider>
        );
    }
    
    private _render(admin:AdminAuthorization, questions:QuestionsContainer) {

        //console.log(questions)
        const {isMenuActive, menuWidth, creatorActive} = this.state;
        //console.log(questions.state.questions.length, questions.state.filter)

        if (creatorActive) {

        }

        return (
            <div className={`questions`}>
                <div className={"alert alert-bs rounded-0 mb-0 shadow-sm blocker"}>
                    <h4 className={"alert-title"}>What is this?</h4>
                    <div className={"alert-body"}>
                        <p>This is a list of all questions that you have entered into the system.
                            This is to make it easier for you to manage, add, duplicate, and even categorize your questions.
                            This is directly linked to the Games Management page, so when you add a question over there,
                            you will also be adding it to the list here.</p>
                    </div>
                </div>
                <TransitionGroup className={`creator-wrapper`}>
                    {creatorActive ? (
                        <CSSTransition unmountOnExit={true} mountOnEnter={true} timeout={350} classNames={"creator"} key={"creator"}>
                            <QuestionCreator history={this.props.history} />
                        </CSSTransition>
                    ) : undefined}
                </TransitionGroup>

                    <div id={"sticky-1"} className={`alert alert-dark rounded-0 d-flex align-items-center shadow-sm filter-nav `}>
                        <div ref={this.references.hamburger} onClick={this.toggleMenu}
                             title={"Show/Hide search criteria"}
                             className={`hamburger py-0 pl-0 hamburger--elastic ${isMenuActive ? "is-active" : ""}`}>
                            <div className="hamburger-box">
                                <div className="hamburger-inner"/>
                            </div>
                            <span className={"pl-1"}>Filters</span>
                        </div>
                        <form className={"alert-body flex-grow-1"}>
                            <InputGroupComponent>
                                <label className={"form-control-plaintext"}>Question:</label>
                                <input type={"text"}
                                       className={"form-control"}
                                       ref={questions.filters.question}
                                       name={"question"}
                                       onChange={questions.filterChanged} />
                            </InputGroupComponent>
                        </form>
                    </div>

                <div className={``}>
                    <OffCanvas isMenuOpen={isMenuActive} width={menuWidth} transitionDuration={350}>
                        <OffCanvasMenu>
                            <div id={"sticky-2"}>
                                <div className={"mx-2 mb-2"}>
                                    <Link to={"#/creator"} className={"btn btn-success btn-block"}>Create a Question</Link>
                                </div>
                                <div className={"card"}>
                                    <div className={"card-body"}>
                                        <h5 className={"card-heading"}>Search Criteria</h5>
                                        <form>
                                            <InputGroupComponent type={"block"}>
                                                <label>Category:</label>
                                                <select ref={questions.filters.category}
                                                        name={"category"}
                                                        onChange={questions.filterChanged}
                                                        className={"form-control"}>
                                                    <option value={""}>all categories</option>
                                                    <option>example</option>
                                                    <option>example2</option>
                                                </select>
                                            </InputGroupComponent>

                                            <button className={"btn btn-bs btn-block my-3"} onClick={(evt) => evt.preventDefault()}>Apply</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </OffCanvasMenu>
                        <OffCanvasBody>
                            <div className={"container"}>

                                <QuestionListGroup {...questions.state}
                                                   onCategory={questions.filterChanged}/>

                            </div>
                        </OffCanvasBody>
                    </OffCanvas>
                </div>
            </div>
        )
    }

    private toggleMenu = (evt) => {
        this.setState({isMenuActive: !this.state.isMenuActive});
    }

}

interface QuestionProps {
    state?: QuestionState;
    history: {
        goBack: () => void;
        replace: (path:string) => void;
        push: (path:string) => void;
    }
    location: {
        hash: string;
        pathname: string;
    }
    match: {
        path: string;
        url: string;
    }
}

interface QuestionState {
    isMenuActive: boolean;
    menuWidth: number;
    creatorActive: boolean;
    stickyMenu: boolean;
    _stickyMenu?: number;
    _stickySidebar?: number;
}



export default Questions;

