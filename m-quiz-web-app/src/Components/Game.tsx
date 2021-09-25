import Typography from "@material-ui/core/Typography"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useGame } from "../Services/Firebase"
import SpotifyPlayerComponent from "./SpotifyPlayerComponent"
import AutocompleteField from "./AutoCompleteField";
import axios from "axios";
import Button from "@material-ui/core/Button";

const Game = () => {

    const songAutocompleteURL = 'https://mquizappautocompleteservice.azurewebsites.net/song/';
    const artistAutocompleteURL = 'https://mquizappautocompleteservice.azurewebsites.net/artist/';

    const gameId = (useParams() as any).id as string;


    const [artistAutoCompleteNames, setartistAutoCompleteNames] = useState([])
    const [songAutoCompleteNames, setsongAutoCompleteNames] = useState([])

    const [songGuess, setSongGuess] = useState('')
    const [artistgGuess, setArtistGuess] = useState('')

    const [game, loading, error] = useGame(gameId);
    

    



    useEffect(() => {
        //spotifyWebApi?.getPlaylistTracks()
        //spotifyWebApi?.getTrack(game?.trackIds[0])
    }, []);

    const getSongAutoCompleteOptions = (query:string) => {
        return axios.get<{song:Array<string[]>}>(songAutocompleteURL + query).then((res) => res.data.song.map(name => name[0]));
    }
    const getArtistAutoCompleteOptions = (query:string) => {
        return axios.get<{artists:Array<string[]>}>(artistAutocompleteURL + query).then((res) => res.data.artists.map(name => name[0]));
    } 

    const onFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log()

    }

    return (
        <div>
            {game && <SpotifyPlayerComponent trackURIs={game.tracks.map(track => track.uri)}></SpotifyPlayerComponent>}
            <form noValidate autoComplete="off" onSubmit={onFormSubmit}>
                <Typography variant='h5'>Guess name & artist</Typography>

                <AutocompleteField
                 style={{marginBottom:'10px'}} 
                 text='Song Name' 
                 getOptions={getSongAutoCompleteOptions}
                 value={songGuess}
                 setValue={setSongGuess}
                 ></AutocompleteField>
                <AutocompleteField 
                text='Aritst Name' 
                getOptions = {getArtistAutoCompleteOptions}
                value={artistgGuess}
                setValue={setArtistGuess}
                > </AutocompleteField>
                <Button variant='outlined' type='submit'>Submit!</Button>
            </form>

        </div>
    )
}

export default Game
