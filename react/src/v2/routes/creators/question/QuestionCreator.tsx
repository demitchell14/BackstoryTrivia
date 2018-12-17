import * as React from "react";

import "./style.css";

class QuestionCreator extends React.Component<QuestionCreatorProps, QuestionCreatorState> {
    public constructor(props) {
        super(props);
        this.state = {} as QuestionCreatorState
    }

    componentDidMount(): void {
        console.log("Creator Mounted");
    }

    public render() {
        return (
            <div onClick={this.overlayClicked} className={"creator-container centered"}>
                <div onClick={this.containerClicked} className={"creator-body"}>
                    <div className={"card-body"}>
                        <h2>Question Creator</h2>
                        <p>I'm a body</p>

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consequat maximus purus lacinia posuere. Vestibulum fermentum ex magna, vitae ullamcorper elit tempor sed. Ut ultrices, nunc vitae congue maximus, est tortor molestie nunc, non pulvinar risus dui sed orci. Etiam convallis lectus ac tempus congue. Vestibulum cursus, sem ut ullamcorper cursus, dolor enim pellentesque enim, sit amet malesuada mi tortor id odio. Donec non enim ultricies, rhoncus massa lacinia, sodales nibh. Sed luctus iaculis magna eu commodo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas bibendum tincidunt quam gravida ornare.</p>

                        <p>Donec scelerisque augue nec est vehicula, aliquet scelerisque eros luctus. Sed venenatis fringilla ipsum ac blandit. Donec aliquet diam gravida nunc posuere pretium. Maecenas sapien ipsum, mollis vitae venenatis et, placerat sed libero. Donec vestibulum, lectus non dapibus eleifend, quam ante posuere nisi, et rhoncus est erat vel est. Sed mollis dolor tellus, nec pellentesque nulla porta sit amet. Nunc id elementum metus. Aenean at viverra neque, eu cursus nibh. Nunc vulputate sapien sem, nec semper neque aliquam a.</p>

                        <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc nulla lorem, gravida a lacinia ut, fringilla in elit. In nisi lacus, sodales at mauris non, mattis porta felis. Phasellus dolor felis, faucibus vitae congue quis, cursus ac quam. Fusce sed dui velit. Nullam lobortis, ex a congue pharetra, mi tortor efficitur eros, non rhoncus neque erat id leo. Fusce rhoncus quam vel dolor imperdiet, id ultrices nulla pulvinar. Donec diam mi, lacinia vel nisi at, faucibus elementum ipsum. Sed nisl magna, luctus eget viverra sit amet, eleifend sit amet ex.</p>

                        <p>Duis aliquam orci sit amet sapien porta, eu finibus erat imperdiet. Quisque sit amet consectetur ex. Fusce molestie tempus lectus sit amet ultrices. Integer viverra vestibulum porta. Pellentesque ut tellus elit. Sed nec eleifend erat. Curabitur tristique, dui eget bibendum porta, massa nisi egestas leo, sit amet accumsan nulla enim et leo. In in elit at mauris convallis luctus. In hac habitasse platea dictumst.</p>

                        <p>Curabitur aliquet leo felis, nec accumsan urna pellentesque at. Mauris purus sem, bibendum nec risus lobortis, sagittis elementum lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam non dolor et turpis pulvinar semper. Nullam eu molestie purus. Phasellus tempus ullamcorper est, non aliquam est scelerisque id. Integer dignissim, nisl non eleifend vulputate, lectus purus consequat arcu, et venenatis sapien quam ac eros. Nam ut justo massa. Sed non felis in elit mollis tincidunt at vitae nisi. Phasellus aliquam elit a sem aliquet, eu ullamcorper sem accumsan. Aliquam sit amet nisi nec ipsum semper rhoncus quis non lectus. Nam sit amet ante arcu. Maecenas a accumsan massa, eget mollis velit. Ut tempor, lorem at aliquam laoreet, dui quam sodales odio, a ultricies erat nisl eget ligula.</p>
                    </div>
                </div>
            </div>
        );
    }

    
    
    private containerClicked =(evt) => {
        evt.stopPropagation();
    }
    private overlayClicked =(evt) => {
        evt.preventDefault();
        this.props.history.goBack();
    }
}

interface QuestionCreatorProps {
    state?: QuestionCreatorState;
    onClose?: (callback:any) => void;
    history: {
        goBack: () => void;
        replace: (path:string) => void;
        push: (path:string) => void;
    }
}

interface QuestionCreatorState {

}

export default QuestionCreator