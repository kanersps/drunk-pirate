import React from "react";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemText
} from "@material-ui/core";

import Random from "@nastyox/rando.js";
import PlayerSelect from "./PlayerSelect";
import Rules from "./Rules";
import Card from "./Card";
import {Gavel, LiveHelp, LocalBar, PanTool} from "@material-ui/icons";
import TruthOrDare from "./TruthOrDare.json"

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            started: false,
            rulesShown: false,
            captain: "",
            captainPoints: 0,
            crewPoints: 0,
            round: 0,
            turn: -1,
            crew: [],
            currentCard: {},
            ruleActive: false,
            restartDialogOpen: false
        }

        this.playCards = [
            {
                name: <span><LocalBar/> Drink</span>,
                points: 100,
                player: "",
                sips: 1,
                alreadyNew: false,
                addCaptain: (points) => {
                    this.setState({
                        captainPoints: this.state.captainPoints + points
                    })
                },
                addCrew: (points) => {
                    this.setState({
                        crewPoints: this.state.crewPoints + points
                    })
                },
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                initialize(player) {
                    this.player = player;
                    this.sips = Math.ceil(Math.random() * 5);
                    this.points = this.sips * 100;
                },
                getBody() {
                    return <div style={{padding: 5}}>
                        <p>Take {this.sips} sip{this.sips > 1 ? "s" : ""} of your drink</p>

                        <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCaptain(this.points)
                        }} variant="contained" color={"primary"}>OK</Button>

                        {this.player.counterCard ? <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCrew(this.points)
                            this.player.counterCard = false;
                            this.player.points += this.points;
                        }} variant="contained" style={{marginLeft: 20}} color={"secondary"}>Use Counter</Button> : ""}
                    </div>
                }
            },
            {
                name: <span><SettingsBackupRestoreIcon/> Counter</span>,
                player: "",
                alreadyNew: false,
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                initialize(player) {
                    this.player = player;
                },
                getBody() {
                    return <div>
                        <p>You have received a counter card, you can use this when you have to drink!</p>

                        <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.player.counterCard = true;
                        }} variant="contained" color={"primary"}>OK</Button>
                    </div>
                }
            },
            {
                name: <span><LiveHelp /> Trivia</span>,
                points: 100,
                player: "",
                sips: 1,
                alreadyNew: false,
                addCaptain: (points) => {
                    this.setState({
                        captainPoints: this.state.captainPoints + points
                    })
                },
                addCrew: (points) => {
                    this.setState({
                        crewPoints: this.state.crewPoints + points
                    })
                },
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                question: {},
                initialize(player, update) {
                    this.player = player;

                    fetch("https://opentdb.com/api.php?amount=1&type=boolean")
                        .then(response => response.json())
                        .then(data => { this.question = data.results[0]; console.log(this.question) });
                },
                answered: false,
                correct: false,
                getBody(update) {
                    if(!this.question.question)
                        setTimeout(update, 100);

                    return <div>
                        <p>{this.answered ? this.answered : <span><div dangerouslySetInnerHTML={{__html: this.question.question}} /></span>}</p>

                        {this.answered ? <div>
                            {this.correct ?
                            <Button onClick={() => {
                                this.newCard(this.alreadyNew);
                                this.addCrew(this.points)
                                this.player.points += this.points;
                            }} variant="contained" color={"primary"}>OK</Button> : <div>
                                    <Button onClick={() => {
                                        this.newCard(this.alreadyNew);
                                        this.addCaptain(this.points)
                                    }} variant="contained" color={"primary"}>OK</Button>

                                    {this.player.counterCard ? <Button onClick={() => {
                                        this.newCard(this.alreadyNew);
                                        this.addCrew(this.points)
                                        this.player.counterCard = false;
                                        this.player.points += this.points;
                                    }} variant="contained" style={{marginLeft: 20}} color={"secondary"}>Use Counter</Button> : ""}
                                </div>}
                        </div> :<div>
                            <Button onClick={() => {
                                if (this.question.correct_answer === "True") {
                                    this.correct = true;
                                    this.answered = "Correct!"
                                } else {
                                    this.correct = false;
                                    this.answered = "Incorrect, take 1 sip!"
                                }

                                update();
                            }} variant="contained" color={"primary"}>True</Button>

                            <Button style={{marginLeft: 20}} onClick={() => {
                                if(this.question.correct_answer === "False") {
                                    this.correct = true;
                                    this.answered = "Correct!"
                                } else {
                                    this.correct = false;
                                    this.answered = "Incorrect, take 1 sip!"
                                }

                                update();
                            }} variant="contained" color={"secondary"}>False</Button>
                        </div>
                        }
                    </div>
                }
            },
            {
                name: <span>🃏 Higher or Lower</span>,
                points: 100,
                player: "",
                sips: 1,
                alreadyNew: false,
                addCaptain: (points) => {
                    this.setState({
                        captainPoints: this.state.captainPoints + points
                    })
                },
                addCrew: (points) => {
                    this.setState({
                        crewPoints: this.state.crewPoints + points
                    })
                },
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                randomNumber: 0,
                higherOrLowerThan: 0,
                initialize(player) {
                    this.player = player;
                    this.sips = Math.ceil(Math.random() * 3);
                    this.points = this.sips * 100;
                    this.randomNumber = Random.rando(1, 20);
                    this.higherOrLowerThan = Random.rando(1, 20);
                    this.correct = 0;
                },
                correct: 0,
                getBody(update) {
                    return <div style={{padding: 5}}>
                        {this.correct === 0 ?
                        <div>
                            <p>What is {this.randomNumber} versus the secret numer?</p>

                            <Button onClick={() => {
                                this.correct = 4;
                                if(this.randomNumber > this.higherOrLowerThan)
                                    this.correct = 1;
                                update();
                            }} variant="contained" color={"primary"}>Higher</Button>

                            <Button style={{marginLeft: 20}} onClick={() => {
                                this.correct = 4;
                                if(this.randomNumber === this.higherOrLowerThan) {
                                    this.correct = 2;
                                    this.sips = 5;
                                    this.points = 500;
                                }
                                update();
                            }} variant="contained" color={"primary"}>The Same</Button>


                            <Button style={{marginLeft: 20}} onClick={() => {
                                this.correct = 4;
                                if(this.randomNumber < this.higherOrLowerThan)
                                    this.correct = 3;
                                update();
                            }} variant="contained" color={"primary"}>Lower</Button>
                        </div>

                            : <div>
                                {this.correct === 4 ? <div>
                                        <p>Incorrect ({this.randomNumber} vs {this.higherOrLowerThan}), take {this.sips} sip{this.sips > 1 ? "s" : ""} of your drink</p>
                                        <Button onClick={() => {
                                            this.newCard(this.alreadyNew);
                                            this.addCaptain(this.points)
                                        }} variant="contained" color={"primary"}>OK</Button>
                                        {this.player.counterCard ? <Button onClick={() => {
                                                this.newCard(this.alreadyNew);
                                                this.addCrew(this.points)
                                                this.player.counterCard = false;
                                                this.player.points += this.points;
                                            }} variant="contained" style={{marginLeft: 20}} color={"secondary"}>Use Counter</Button> : ""}
                                    </div>
                                    : <div>
                                        <p>Correct ({this.randomNumber} vs {this.higherOrLowerThan}) ! The captain takes {this.sips} sip{this.sips > 1 ? "s" : ""} of their drink</p>
                                        <Button onClick={() => {
                                            this.newCard(this.alreadyNew);
                                            this.addCrew(this.points)
                                            this.player.points += this.points;
                                        }} variant="contained" style={{marginLeft: 20}} color={"primary"}>OK</Button>
                                    </div> }
                            </div>}
                    </div>
                }
            },
            {
                name:  <span><PanTool/> Touch</span>,
                points: 100,
                player: "",
                sips: 1,
                alreadyNew: false,
                addCaptain: (points) => {
                    this.setState({
                        captainPoints: this.state.captainPoints + points
                    })
                },
                addCrew: (points) => {
                    this.setState({
                        crewPoints: this.state.crewPoints + points
                    })
                },
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                possible: ["nose", "eye", "chin", "cheek", "other Hand", "mouth"],
                possibleTouchers: ["left hand", "right hand"],
                touch: "",
                touchWith: "",
                initialize(player) {
                    this.player = player;
                    this.sips = Random.rando(1, 5);
                    this.points = this.sips * 100;

                    this.touch = this.possible[Random.rando(this.possible.length - 1)];
                    this.touchWith = this.possibleTouchers[Random.rando(this.possibleTouchers.length - 1)];
                },
                getBody() {
                    return <div style={{padding: 5}}>
                        <div style={{marginBottom: 20}}>Touch your <b>{this.touch}</b> with your <b>{this.touchWith}</b> <br/>The loser takes {this.sips} sip{this.sips > 1 ? "s" : ""} of their drink. Who lost?</div>

                        <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCrew(this.points)
                            this.player.counterCard = false;
                            this.player.points += this.points;
                        }} variant="contained" style={{marginLeft: 20}} color={"secondary"}>The Captain</Button>

                        <Button style={{marginLeft: 20}} onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCaptain(this.points)
                        }} variant="contained" color={"primary"}>The Crew</Button>
                    </div>
                }
            },
            {
                name: <span>😂 Joke</span>,
                points: 100,
                player: "",
                sips: 1,
                alreadyNew: false,
                addCaptain: (points) => {
                    this.setState({
                        captainPoints: this.state.captainPoints + points
                    })
                },
                addCrew: (points) => {
                    this.setState({
                        crewPoints: this.state.crewPoints + points
                    })
                },
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                initialize(player) {
                    this.player = player;
                    this.sips = Random.rando(1, 3);
                    this.points = this.sips * 100;
                },
                getBody() {
                    return <div style={{padding: 5}}>
                        <div style={{marginBottom: 20}}>Say something to make the captain laugh. <br/>The loser(the crew member if the captain didn't laugh) takes {this.sips} sip{this.sips > 1 ? "s" : ""} of their drink. Who lost?</div>

                        <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCrew(this.points)
                            this.player.counterCard = false;
                            this.player.points += this.points;
                        }} variant="contained" style={{marginLeft: 20}} color={"secondary"}>The Captain</Button>

                        <Button style={{marginLeft: 20}} onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCaptain(this.points)
                        }} variant="contained" color={"primary"}>The Crew</Button>
                    </div>
                }
            },
            {
                name: <span><Gavel/> Rule</span>,
                points: 100,
                player: "",
                sips: 1,
                alreadyNew: false,
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                activateRule: () => {
                    this.setState({
                        ruleActive: true
                    })
                },
                initialize: () => {
                },
                getBody() {
                    return <div style={{padding: 5}}>
                        <div style={{marginBottom: 20}}>The captain gets to make a rule all crew members have to follow. Every infraction means you have to take a sip, only the captain has to keep track of this.</div>

                        <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.activateRule();
                        }} variant="contained" style={{marginLeft: 20}} color={"primary"}>OK</Button>
                    </div>
                }
            },
            {
                name: <span>🤔 Truth</span>,
                points: 100,
                player: "",
                sips: 1,
                question: "",
                alreadyNew: false,
                addCaptain: (points) => {
                    this.setState({
                        captainPoints: this.state.captainPoints + points
                    })
                },
                addCrew: (points) => {
                    this.setState({
                        crewPoints: this.state.crewPoints + points
                    })
                },
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                possible: [],
                initialize(player) {
                    this.player = player;
                    this.sips = Random.rando(1, 3);
                    this.points = this.sips * 100;

                    this.question = TruthOrDare.truth[Random.rando(TruthOrDare.truth.length - 1)]
                },
                getBody() {
                    return <div style={{padding: 5}}>
                        <div style={{marginBottom: 20}}> {this.question} <br/><br/>If you answered honestly the captain takes {this.sips} sip{this.sips > 1 ? "s" : ""} of their drink, otherwise you do. Who had to drink?</div>

                        <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCrew(this.points)
                            this.player.counterCard = false;
                            this.player.points += this.points;
                        }} variant="contained" style={{marginLeft: 20}} color={"secondary"}>The Captain</Button>

                        <Button style={{marginLeft: 20}} onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCaptain(this.points)
                        }} variant="contained" color={"primary"}>The Crew</Button>
                    </div>
                }
            },/*
            {
                name: <span>😎 Dare</span>,
                points: 100,
                player: "",
                sips: 1,
                question: "",
                alreadyNew: false,
                addCaptain: (points) => {
                    this.setState({
                        captainPoints: this.state.captainPoints + points
                    })
                },
                addCrew: (points) => {
                    this.setState({
                        crewPoints: this.state.crewPoints + points
                    })
                },
                newCard: (alreadyNew) => {
                    if(!alreadyNew) {
                        alreadyNew = true;
                        this.newCard();
                    }
                },
                possible: [],
                initialize(player) {
                    this.player = player;
                    this.sips = Math.ceil(Math.random() * 3) + 2;
                    this.points = this.sips * 100;

                    this.question = TruthOrDare.dare[Random.rando(TruthOrDare.dare.length - 1)]
                },
                getBody() {
                    return <div style={{padding: 5}}>
                        <div style={{marginBottom: 20}}> {this.question} <br/><br/>If you did it the captain takes {this.sips} sip{this.sips > 1 ? "s" : ""} of their drink, otherwise you do. Who had to drink?</div>

                        <Button onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCrew(this.points)
                            this.player.counterCard = false;
                            this.player.points += this.points;
                        }} variant="contained" style={{marginLeft: 20}} color={"secondary"}>The Captain</Button>

                        <Button style={{marginLeft: 20}} onClick={() => {
                            this.newCard(this.alreadyNew);
                            this.addCaptain(this.points)
                        }} variant="contained" color={"primary"}>The Crew</Button>
                    </div>
                }
            },*/
        ]
    }

    startGame(players, possibleCaptain) {
        let captain = players[Random.rando(players.length - 1)];
        if(possibleCaptain) {
            captain = players.filter(player => player === possibleCaptain)[0]

        }

        const newCrew = []

        for(let crew of players) {
            if(crew !== captain) {
                newCrew.push({
                    name: crew,
                    points: 0,
                    counterCard: false
                })
            }
        }

        this.setState({
            started: true,
            captain: captain,
            captainPoints: 0,
            crewPoints: 0,
            turn: -1,
            round: 0,
            crew: newCrew
        }, () => {
            this.newCard();
        })
    }

    componentDidMount() {
        //this.startGame(["1", "2", "3"])
    }

    rulesRead() {
        this.setState({
            rulesShown: true
        })
    }

    newCard() {
        let turn = (this.state.turn + 1)
        let round = this.state.round;

        if(this.state.turn === (this.state.crew.length - 1)) {
            turn = 0;
        }

        if(turn === 0) {
            this.setState({
                ruleActive: false
            })
            round++;
        }


        let nextCard = {...this.playCards[Random.rando(this.playCards.length - 1)]};
        if(nextCard.name === "Counter" && this.state.crew[turn].counterCard)
            nextCard = {...this.playCards[0]}

        nextCard.alreadyNew = false;
        nextCard.question = {};
        nextCard.initialize(this.state.crew[turn])

        this.setState({
            currentCard: nextCard,
            turn: turn,
            round: round
        })
    }

    restart(captain) {
        const players = []
        for(let player of this.state.crew) {
            players.push(player.name)
        }

        players.push(this.state.captain)

        this.startGame(players, captain.name)
    }

    quit() {
        this.setState({
            started: false,
            rulesShown: false
        })
    }

    render() {
        if(!this.state.started)
            return <PlayerSelect startGame={(players) => { this.startGame(players) }} />

        if(!this.state.rulesShown || this.state.turn === -1 || this.state.crew.length <= 0)
            return <Rules rulesRead={() => {this.rulesRead()}} />

        return <Grid container>
            <Grid style={{textAlign: "right"}} item xs={3}>
                <h1>Captain</h1>
                <List>
                    <ListItem style={{textAlign: "right"}}>
                        <ListItemText primary={this.state.captain} secondary={<span>{this.state.captainPoints} Points</span>} />
                    </ListItem>
                </List>

                {this.state.ruleActive ? `Rule active for ${this.state.crew.length - this.state.turn} more turn${(this.state.crew.length - this.state.turn > 1) ? "s" : ""}` : ""}
            </Grid>
            <Grid item xs={6}>
                <h1 style={{textAlign: "center", fontStyle: "italic", color: "rgb(200, 200, 200)"}}> Round {this.state.round } </h1>

                <Card player={this.state.turn} card={this.state.currentCard} />

                <h1 style={{textAlign: "center"}}>It's {this.state.crew[this.state.turn].name}'s turn</h1>
            </Grid>
            <Grid style={{textAlign: "left"}} item xs={3}>
                <h1>Crew</h1>

                <ListItem>
                    <ListItemText primary={<b style={{fontSize: "1.2em"}}>Combined</b>} secondary={<span><b>{this.state.crewPoints}</b> Points</span>} />
                </ListItem>

                <List style={{height: 600, overflowY: "auto"}}>
                    {this.state.crew.map(crew => <ListItem>
                        <ListItemText primary={crew.name} secondary={<span><b>{crew.points}</b> Points<br/><SettingsBackupRestoreIcon opacity={crew.counterCard ? 1 : 0}/></span>} />
                    </ListItem>)}
                </List>
            </Grid>

            <Dialog
                open={(this.state.captainPoints >= 2000 || this.state.crewPoints >= 2000)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Game Over!</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.captainPoints >= 2000 ?
                            <div>
                                The captain won!
                                <br/><br/>
                                The worst crew member was {this.state.crew.sort((a, b) => a.points > b.points)[0].name} with {this.state.crew.sort((a, b) => a.points > b.points)[0].points} points
                            <br/><br/>
                                Would you like to restart with that person as the captain?
                            </div>
                            :
                            <div>
                                The crew won!<br/><br/>

                                The worst crew member was {this.state.crew.sort((a, b) => a.points > b.points)[0].name} with {this.state.crew.sort((a, b) => a.points > b.points)[0].points} points
                                <br/><br/>
                                Would you like to restart with that person as the captain?
                            </div>
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.restart(this.state.crew.sort((a, b) => a.points > b.points)[0]);
                    }} color="primary">
                        Restart
                    </Button>
                    <Button onClick={() => { this.quit() }} color="primary" autoFocus>
                        Quit
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    }
}

export default Game;