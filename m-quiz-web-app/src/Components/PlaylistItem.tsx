import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    root: {
      
    },
    media: {
      height: 140,
    },
    title : {
        marginTop:'5px',
        textAlign: 'center'
    },
  });

const PlaylistItem: React.FC<{playlist:SpotifyApi.PlaylistObjectSimplified, onCreateGameClick:() =>any}> = ({playlist, onCreateGameClick}) => {
    const classes = useStyles();


    return (
        <Card className={classes.root}>
          {playlist.images[0] && <CardMedia
            className={classes.media}
            image={playlist.images[0]?.url}
            title="Playlist image"
          />}
            <Typography className={classes.title} variant="h5" component="h2">
              {playlist.name}
            </Typography>
        <CardActions>
          <Button onClick={onCreateGameClick} color="primary" fullWidth variant="contained">
            Start Game
          </Button>
        </CardActions>
      </Card>
    )

}

export default PlaylistItem
