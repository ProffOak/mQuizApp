import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from "@material-ui/styles/makeStyles"
import { useContext } from "react"
import { UserContext } from "../Services/UserContext"
import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme:any) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

const NavBar = () => {
    const classes = useStyles();

    const userContext = useContext(UserContext)

    return (
        <div className={classes.root}>
            <AppBar position="static" color='transparent'>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                    </IconButton>
                    <div className={classes.title}>
                    <Button component={Link} to="/">
                    <Typography variant="h6" className={classes.title}>
                    Music Quiz App
                    </Typography>
                    </Button>
                    </div>
                    { userContext?.userToken && <Button component={Link} to="/" onClick={userContext.logoutUser} color="secondary">Logout</Button>}
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default NavBar
