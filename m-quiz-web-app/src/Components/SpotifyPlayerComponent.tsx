import { SpotifyWebApiContext } from "../Services/Spotify"
import { useContext } from "react"
import SpotifyPlayer from 'react-spotify-web-playback';




const SpotifyPlayerComponent:React.FC<{trackURIs:string[]}> = ({trackURIs: trackURIs}) => {
    const token = useContext(SpotifyWebApiContext)?.token

    return (
        <div>
            { token && <SpotifyPlayer 
                initialVolume={0.01}
                token={token}
                uris={trackURIs}/>};
        </div>
    )
}

export default SpotifyPlayerComponent
