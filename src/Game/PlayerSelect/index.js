import React from "react";
import {Box, Button, Grid, List, ListItem, ListItemText, TextField} from "@material-ui/core";

class PlayerSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playersToAdd: [],
            currentName: ""
        }
    }

    addPlayer(name) {
        if(name.length <= 1)
            return;

        this.setState(state => {
            const players = [...state.playersToAdd];
            const index = players.indexOf(name);

            if(index !== -1)
                return {};

            players.push(name)

            return { playersToAdd: players, currentName: "" }
        })
    }

    removePlayer(name) {
        this.setState(state => {
            const players = [...state.playersToAdd];
            const index = players.indexOf(name);
            players.splice(index, 1);

            return { playersToAdd: players }
        })
    }

    setCurrentName(text) {
        this.setState({ currentName: text })
    }

    startGame() {
        this.props.startGame(this.state.playersToAdd);
    }

    render() {
        return <Box>
            <h1 style={{textAlign: "center"}}>Select Players</h1>

            <h2>Current Players</h2>

            <List style={{height: 500, maxHeight: 500, overflowY: "auto"}} component="nav" aria-label="secondary mailbox folders">
                {this.state.playersToAdd.map(player =>
                    <ListItem onClick={() => { this.removePlayer(player) }} key={player} button>
                        <ListItemText primary={player} />
                    </ListItem>
                )}
            </List>

            <Box>
                <Grid
                    container
                    direction="row"
                    justify="center"
                >
                        <TextField size={"small"} onKeyDown={e => { if(e.key === "Enter") this.addPlayer(this.state.currentName) } } value={this.state.currentName} style={{width: 300}} onChange={e => { this.setCurrentName(e.target.value); }} id="filled-basic" label="Name" variant="filled" />
                        <Button style={{width: 100}} onClick={() => { this.addPlayer(this.state.currentName) }} variant="contained">
                            Add
                        </Button>
                </Grid>

                <div style={{textAlign: "center", marginTop: 50}}>
                    {(3 - this.state.playersToAdd.length) > 0 ? <h2>Need { 3 - this.state.playersToAdd.length } more player{(3 - this.state.playersToAdd.length > 1) ? "s" : ""} to start</h2> : <Button loading style={{width: 300}} onClick={() => { this.startGame() }} variant="contained" color="primary">
                        Start Game!
                    </Button>}
                </div>
            </Box>

        </Box>
    }
}

export default PlayerSelect;