import { createContext, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";


interface SpotifyWebApiContextModel {
  spotifyWebApi:SpotifyWebApi.SpotifyWebApiJs,
  setSpotifyWebApiAuthToken: (token:string | null) => void,
  token: string | null
}

export const SpotifyWebApiContext = createContext <SpotifyWebApiContextModel | null> (null);



export const getAuthUrl =  (scopes?:Array<string>): string => {
    const my_client_id = '925c29ce76ff40fe9c1b559623cb8d01'
    if (!scopes) {
         scopes = [
            'streaming',
            'user-read-email',
            'user-read-private',
            'user-read-currently-playing',
            'user-read-playback-state',
            'user-modify-playback-state',
            'playlist-read-private',
            'playlist-read-collaborative'
          ];
    }
    const redirect_uri = 'http://localhost:3000/create-game';

    return 'https://accounts.spotify.com/authorize' +
    '?response_type=token' +
    '&show_dialog=true'+
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes.join('%20')) : '') +
    '&redirect_uri=' + encodeURIComponent(redirect_uri);
}


const SpotifyProvider: React.FC<React.ReactNode> = ({children}) => {
  const [spotifyWebApi, setSpotifyWebApi] = useState(new SpotifyWebApi())
  const [token, setToken] = useState <string | null>(null);

  const setSpotifyWebApiAuthToken = (token:string | null) => {
    spotifyWebApi.setAccessToken(token);
    setSpotifyWebApi(spotifyWebApi)
    setToken(token);
  }

  return (
    <SpotifyWebApiContext.Provider value={{spotifyWebApi, setSpotifyWebApiAuthToken, token}}>
      {children}
    </SpotifyWebApiContext.Provider>
  )
}

export default SpotifyProvider



