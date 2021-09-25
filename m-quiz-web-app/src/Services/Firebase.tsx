import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';



const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };


if (!app.apps.length) {
    app.initializeApp(config);
}

/* Firebase APIs */
const auth = app.auth();
const db = app.firestore();



type FirebaseDocumentReturnType<T> = [T | undefined, boolean, app.FirebaseError | undefined]

interface FirebaseContextModel {
    createGame: (playlistId:string, trackIds:Array<string>) => Promise<any>,
}

export interface GameModel {
    playlistId:string
    uid:string,
    createdAt: app.firestore.FieldValue,
    tracks: SpotifyTrack[],
    currentSong:string,
    score:number
}

export interface SpotifyTrack {
    id: string
    uri: string,
    name: string,
    artistName: string,
    albumName: string,
    albumId: string,
    albumCoverUrl: string
}


export const useGame  = (gameId:string):FirebaseDocumentReturnType<GameModel> => {
    const [value, loading, error] = useDocument<GameModel>(db.collection('games').doc(gameId));
    return  [value?.data(), loading, error] 
 }


    

export const doSignInAnonymously = () => {
    return auth.signInAnonymously()
}

export const createGame = async (tracks:Array<SpotifyTrack> | undefined) => {

    if(!tracks) {console.log('Tracks is null'); return}
    
    shuffleArray(tracks);
    
    tracks = tracks.slice(0, Math.min(tracks.length, 20))
    let uid = '';
    if(auth.currentUser) {
        uid = auth.currentUser?.uid;
    }


    return  db.collection('games').add({
        uid,
        createdAt: app.firestore.FieldValue.serverTimestamp(),
        tracks,
        currentSong:tracks[0],
        score:0
    });
}

   

function shuffleArray( array:Array<any> ){
    var count = array.length,
        randomnumber,
        temp;
    while( count ){
     randomnumber = Math.random() * count-- | 0;
     temp = array[count];
     array[count] = array[randomnumber];
     array[randomnumber] = temp
    }
   }