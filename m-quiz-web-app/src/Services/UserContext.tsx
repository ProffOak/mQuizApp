import axios from "axios";
import React, { createContext, useState, useEffect, useContext, useCallback } from "react"
import { SpotifyWebApiContext } from "./Spotify";

interface UserContextModel {
    userToken : UserToken | null
    logoutUser : () => void
}

export const UserContext  = createContext <UserContextModel | null>(null);

interface Props {
    children?: React.ReactNode;
  }

interface UserToken {
    access_token: string,
    expires: number
}
  

const UserProvider : React.FC<Props> = ({ children }) => {
    const [userToken, setUserToken] = useState<UserToken | null>(null)

    const spotifyWebApiContext = useContext(SpotifyWebApiContext)

    const setAuthorizationHeader = useCallback((token:{access_token:string, expires:number} | null) => {
        const headerToken = `Bearer ${token?.access_token}`;
        axios.defaults.headers.common["Authorization"] = headerToken;
        spotifyWebApiContext?.setSpotifyWebApiAuthToken(token?.access_token as string | null);
    }, [spotifyWebApiContext]);

    const logoutUser = useCallback(() => {
        console.log("försöker logga ut");
        //window.location.href = "/";
        localStorage.removeItem("SpotifyToken")
        setUserToken(null);
        setAuthorizationHeader(null);
    },[setAuthorizationHeader]);


    useEffect(() => {
        //Check if new user returned from url else check if user was stored in local storage 
        const spotifyUserTokenFromUrl = handleTokenUrlResponse();
        if (spotifyUserTokenFromUrl) {
            localStorage.setItem("SpotifyToken", JSON.stringify(spotifyUserTokenFromUrl));
            setAuthorizationHeader(spotifyUserTokenFromUrl);
            setUserToken(spotifyUserTokenFromUrl);
        } else {
            const localRawToken = localStorage.getItem("SpotifyToken");
            if(localRawToken && localRawToken!=='undefined') {
                const localParsedToken =  JSON.parse(localRawToken) as UserToken;
                if (localParsedToken.expires < Date.now()) {
                    logoutUser()
                    return
                }
                setUserToken(localParsedToken);
                setAuthorizationHeader(localParsedToken);
            }
        }
        
    }, [setAuthorizationHeader, logoutUser])

  
    
 
    
  
    
    return (
    <UserContext.Provider value={{userToken, logoutUser}}>
      {children}
    </UserContext.Provider>
  )
}


const handleTokenUrlResponse = () => {
    // Get the token from the response Url
    const hash = getSpotifyAuthRes();
    if (hash.access_token) {
        // Set token
        const spotifyToken = {
            access_token: hash.access_token,
            expires: Date.now() + hash.expires_in * 1000
        };
        return spotifyToken;
    } 
    return null
}

const getSpotifyAuthRes = () => {
    // Get the hash of the url
    const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function(initial:any, item) {
        if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});
    window.location.hash = "";
    return hash;
}


export default UserProvider