import React from "react";
import {
    Button,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";

class Rules extends React.Component {
    render() {
        const rules = [
            "For every sip a crew member has to take, the captain gets 100 points",
            "For every sip the captain has to take, the crew members get 100 points",
            "First side to 2000 points wins and the opposite side has to down their drink",
            "The Captain is randomly selected",
        ]

        const cards = [
            {
                card: "Drink",
                rule: <span>Take <b>X</b> number of sips.</span>
            },
            {
                card: "Trivia",
                rule: <span>Answer the question with true or false, if you are correct a drinking card appears for the captain, otherwise for you.</span>
            },
            {
                card: "Counter",
                rule: <span>You get to keep this card and when you get a drink card you can use this to force the captain to drink instead of you</span>
            },
            {
                card: "High Low",
                rule: <span>You get a number, is the next one that comes up higher or lower? (Between 1 & 20)</span>
            },
            {
                card: "Touch",
                rule: <span>First side to touch (& hold until it's done) their <b>X</b> (example: nose, chin etc) wins, other side drinks</span>
            },
            {
                card: "Joke",
                rule: <span>Say something to make the captain laugh, if the captain doesn't laugh you drink, otherwise the captain does</span>
            },
            {
                card: "Rule",
                rule: <span>Unlucky! The captain gets to decide a rule all crew members have to abide by for 1 round. Every infraction is one sip</span>
            },
            {
                card: "Truth",
                rule: <span>You have to answer truthfully or drink</span>
            },
            {
                card: "Dare",
                rule: <span>You have to do what the card says or drink</span>
            },
        ]

        return <div>
            <h1>Rules</h1>

            <h2>General Rules</h2>
            <List dense>
                {rules.map((rule, key) =>
                    <ListItem style={{fontSize: "1.2em"}} key={key}>
                        <span><b>Rule {key + 1}:</b> {rule}</span>
                    </ListItem>
                )}
            </List>

            <h2>Cards</h2>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{fontSize: "1.4em"}} width={150}>Card</TableCell>
                        <TableCell style={{fontSize: "1.4em"}}>Rule</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cards.map((row, key) => (
                        <TableRow key={key}>
                            <TableCell style={{fontSize: "1.2em"}} component="th" scope="row">
                                {row.card}
                            </TableCell>
                            <TableCell style={{fontSize: "1.2em"}}>{row.rule}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div style={{textAlign: "center", marginTop: 20}}>
                <Button onClick={this.props.rulesRead} style={{width: "50%", fontSize: "1.6em"}} variant="contained" color={"primary"}>OK</Button>
            </div>
        </div>
    }
}

export default Rules;