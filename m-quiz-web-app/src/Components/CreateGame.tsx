import { useEffect, useContext, useState } from "react"
import { SpotifyWebApiContext } from "../Services/Spotify"
import PlaylistItem from "./PlaylistItem"
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import  Container  from "@material-ui/core/Container";
import { createGame } from "../Services/Firebase";
import { useHistory } from "react-router-dom";



const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      padding:'1vh'
    }
  });

const CreateGame = () => {

    
    const [playlists, setPlaylists] = useState <SpotifyApi.PlaylistObjectSimplified[]>([])
    const spotifyWebApiContext = useContext(SpotifyWebApiContext)
    const history = useHistory()



    const classes = useStyles();


    useEffect(() => {
        const spotifyWebApi = spotifyWebApiContext?.spotifyWebApi;
        if(spotifyWebApi?.getAccessToken()){
            spotifyWebApi?.getUserPlaylists().then(res => {
                setPlaylists(res.items);
            }).catch(error => console.log(error))
        } 

    }, [spotifyWebApiContext]) 


    const createNewGame = async (playlistId:string) => {
        const playlistItems = await spotifyWebApiContext?.spotifyWebApi.getPlaylistTracks(playlistId)
        const trackIds = playlistItems?.items.map(item => item.track.id).slice(0, Math.min(playlistItems.items.length, 20))
        if(trackIds) {
            const tracksWithArtist = await spotifyWebApiContext?.spotifyWebApi.getTracks(trackIds);
            const tracks = tracksWithArtist?.tracks.map((track) => { 
                return {
                    id: track.id,
                    uri: track.uri,
                    name: track.name,
                    artistName: track.artists[0].name,
                    albumName:track.album.name,
                    albumId: track.album.id,
                    albumCoverUrl: track.album.images[0].url }
                });
            createGame(tracks).then((docRef) => {
                history.push(`game/${docRef?.id}`);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        }
    }

    

    return (
            <Container>
                <Grid className={classes.root} container spacing={2} direction="row" justifyContent="center" alignItems="center">
                {playlists.map(playlist => 
                <Grid key={playlist.id} item xs={12} sm={6} >
                    <PlaylistItem onCreateGameClick={ () => createNewGame(playlist.id)}  playlist={playlist}></PlaylistItem></Grid>)}
                </Grid>
            </Container>
    )
}

export default CreateGame
