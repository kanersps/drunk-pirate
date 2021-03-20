import React from "react";

class Card extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            flipped: false,
            newCard: false,
            first: true,
            title: "",
            body: "",
            newLoaded: true
        }
    }

    flipCard(bool) {
        if(bool)
            this.setState({ flipped: bool })
        else {
            this.setState({flipped: !this.state.flipped})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.player !== this.props.player) {
            this.setState({
                first: false,
                newLoaded: false
            })

            if(this.state.flipped)
                this.flipCard(false)

            if(this.oldTimeout)
                clearTimeout(this.oldTimeout)

            this.oldTimeout = setTimeout(() => {
                this.setState({
                    title: this.props.card.name,
                    body: this.props.card.getBody(() => this.updateBody()),
                    newLoaded: true
                })
            }, 400)
        }
    }

    updateBody() {
        this.setState({
            body: this.props.card.getBody(() => this.updateBody())
        })
    }

    render() {
        let cardValue = <div onClick={e => e.stopPropagation()}>
            <h1>{this.state.title}</h1>
            <p>{this.state.body}</p>
        </div>;

        if(this.state.first) {
            cardValue = <div onClick={e => e.stopPropagation()}>
                <h1>{this.props.card.name}</h1>
                <p>{this.props.card.getBody(() => this.updateBody())}</p>
            </div>
        }

        return <div style={{height: 400}}>
            <div onClick={() => {
                this.flipCard();
            }} className={"flip-card " + (this.state.flipped ? "flipped-card" : "")}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <h1>Cool Card</h1>

                        <h3>Click to turn</h3>
                    </div>
                    <div className="flip-card-back">
                        {cardValue}
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Card;