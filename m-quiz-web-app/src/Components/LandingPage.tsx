import SignIn from "./SignIn"
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { UserContext } from "../Services/UserContext";
import { useContext } from "react";

const LandingPage = () => {

    const userContext = useContext(UserContext)

    return (
        <>
            <div className='card'>
              <MusicNoteIcon  style={{ fontSize: 300 }}/>
            </div>
            <h1 className='center-text'>Welcome to Music Quiz App🎉</h1>
            {!userContext?.userToken && <SignIn></SignIn>}
        </>
        
    )
}

export default LandingPage
