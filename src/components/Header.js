import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import shortenAddress from '../utils/shortenAddress'

const addressStyle = {
  'background-color': 'rgba(255,255,255, .2)',
  'border-radius': '20px',
  'padding': '10px',
  'display': 'flex',
  'align-items': 'center',
}
const styles = {
  root: {
    flexGrow: 1,
  },
};
// componentDidMount(){
//   dbx.filesListFolder({path: ''})
//     .then((response) => {
//         let fileList = response.entries;
//         this.setState({
//             imageSource: fileList
//         });
//     })
// }
class SimpleAppBar extends Component {
  constructor() {
    super();
    this.state = {seed: null}
    // const { classes } = this.props;
  }
  // console.log("Props", props)
  componentDidMount(){
    setTimeout(()=> {
      if(window.web3.eth){
        console.log("reached~~~")
        this.setState({
          seed: window.web3.eth.defaultAccount ? jsNumberForAddress(window.web3.eth.defaultAccount) : '',
          address: window.web3.eth.defaultAccount
        })
      }
    }, 1000)

  }
  render() {
    return(
    <div >
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Totle Widget
          </Typography>
          <div align='right' style={addressStyle}>  
            <Jazzicon diameter={25} seed={this.state.seed} className="mr15" />
            <div>   Address: </div>
          </div>
          <Typography className='txt-white ml15'> {shortenAddress(this.state.address)} </Typography>

        </Toolbar>
      </AppBar>
    </div>
  );
  }
}

// SimpleAppBar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(SimpleAppBar);