import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import ReactSelectDropdown from './ReactSelectDropdown'
const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});



class SignIn extends Component{
  // const { classes } = props;
  constructor(props) {
    super(props);
    this.state = { seconds: 0}
  }
  handleClick = () => { 
    console.log('click click')
    console.log('this.props', this.props.children)
    console.log("this.state", this.state)

    // let web3js = new Web3(window.web3.currentProvider); 
    // web3js.eth.sendTransaction({
    //     to: '0xE08aa75AAE695c4622Cd430FbeBF4B97689d4Ee3',
    //     from: '0xf59F88E6eA4A937e228E4aaf378e96EDfb646B14',
    //     value: web3js.utils.toWei('1', 'ether'), 
    // })      
  };
  render(){
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}style={{"padding-bottom": "70px"}}>
          <Avatar className={classes.avatar}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Totle Trading Widget
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <ReactSelectDropdown>Password</ReactSelectDropdown>
            </FormControl>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);