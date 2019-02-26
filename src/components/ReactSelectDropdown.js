/* eslint-disable react/prop-types, react/jsx-handler-names */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import pollForTransaction from '../utils/pollForTransaction'
import { withStyles } from '@material-ui/core/styles';
import NoSsr from '@material-ui/core/NoSsr';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { Input, Paper, Chip, Button, Typography, MenuItem, TextField } from '@material-ui/core';
import supportedTokens from '../supportedTokens'
import axios from 'axios'
import { ethers } from 'ethers'
import shiftDecimal from '../utils/shiftDecimal'
// import web3 from 'web3'

const erc20JSON = require('../contractJson/ERC20.json')

const tokens = supportedTokens.map(token => ({
  label: token.name,
  value: token.address,
}));

const errorStyle = {
  color:'red',
  top:'5px'
}
const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class IntegrationReactSelect extends React.Component {
  state = {
    sellToken: null,
    buyToken: null,
    amount: null,
    orderIsAvailable: false,
    isApproved: false
  };

  handleChange = name => value => {
    console.log("changing", name, value, this.state.amount)
    this.setState({
      [name]: value,
    });
  };

  handleInputChange (e){
    console.log(this.state.amount)
    this.setState({
      amount: e.target.value
    })
  }

  async handleApproval(){
    //pollForTransaction approval transaction
    // pollForTransaction(txHash, interval) 
    console.log(this.state.amount)
    const erc20Contract =  window.web3.eth.contract(erc20JSON); //this.state.sellToken.value
    const ercInstance = erc20Contract.at(this.state.sellToken.value)
    console.log("SELL TOKEN~~~ ", this.state.sellToken.value)
    let approvalTransaction = ercInstance.approve(
      this.state.contractAddress, 100000000000000000000000000 , {
        // gasPrice: '20000000000' ,
        // gas: 500000
      }, ( err, response )=>{  
        if(err){
          console.log("Error approving~~~ ", err)
        }
        console.log("response~~~", response)
        this.pollTransaction(response)
      })
    console.log("handleApproval~~~", approvalTransaction)

  }
  async pollTransaction(hash){
    console.log("ethers", ethers)
    let provider = ethers.getDefaultProvider('homestead');
    let receipt = await provider.waitForTransaction(hash)
    console.log("receipt object", receipt)
    this.setState({ isApproved : true});
  }

  async handleBlur(){
    if(this.state.sellToken && this.state.buyToken && this.state.amount){
      this.setState({apiError: ''})
      console.log("amount~~~~", shiftDecimal(this.state.amount, true).toString())
      try {
        let response = await axios.post('https://services.totlesystem.com/swap', {
          "address": window.web3.eth.defaultAccount,
          "swap": {
            "from": this.state.sellToken.value,
            "to": this.state.buyToken.value,
            "amount": '10000000000000000', //this.state.amount,
            "minFillPercent": 100,
            "minSlippagePercent": 3
          },
          "breakdown": true 
        })
        if(response.data.response.summary.buys.length){
          console.log("response~~", response);
          this.setState({
            response: response.data.response.summary.buys[0],
            ethValue: response.data.response.ethValue,
            payload: response.data.response.payload.data,
            gas: response.data.response.gas, //limit and price
            contractAddress: response.data.response.contractAddress,
            orderIsAvailable: true
          })
        }
      }
      catch(err){
        this.setState({apiError: "No available orders for this token pair"})
        console.error("error requesting order", err)
      }
    }
    else{
      this.setState({apiError: "Please fill out all of the fields"})
    } 
  }

  async signAndSendTransaction(){
    console.log("this.state.response payload", this.state.payload)
    let demo = {
      from: window.web3.eth.defaultAccount,
      to: this.state.contractAddress,
      value: this.state.ethValue,
      gas: this.state.gas.limit,
      gasPrice: this.state.gas.price,
      data: this.state.payload
    }
    console.log("demo", demo)
    let signedPayload = await window.web3.eth.sendTransaction({
      from: window.web3.eth.defaultAccount,
      to: this.state.contractAddress,
      value: 0,
      gas: this.state.gas.limit,
      gasPrice: this.state.gas.price,
      data: this.state.payload
    }, ( err, response )=>{  
      if(err){
        console.log("Error signing~~~ ", err)
      }
      else{
        console.log("signature~~~", response)
      }
    }) 
    console.log("Reached1", signedPayload) 
  }

  render() {
    console.log("disabled? ", !this.state.isApproved && !this.state.orderIsAvailable)
    const { classes, theme } = this.props;
    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <NoSsr>
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: 'Selling',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={tokens}
            components={components}
            value={this.state.sellToken}
            onChange={this.handleChange('sellToken')}
            onBlur={this.handleBlur.bind(this)}
            placeholder="Select Token"
            isClearable
          />
          <div className={classes.divider} />
          <Select
            classes={classes}
            styles={selectStyles}
            textFieldProps={{
              label: 'Buying',
              InputLabelProps: {
                shrink: true,
              },
            }}
            options={tokens}
            components={components}
            value={this.state.buyToken}
            // onChange={this.handleChange('multi')}
            onChange={this.handleChange('buyToken')}
            placeholder="Select Token"
            onBlur={this.handleBlur.bind(this)}
            isClearable
          />
          <Input
            label={"amount"}
            value={this.state.amount}
            placeholder="Amount"
            onChange={this.handleInputChange.bind(this)}
            onBlur={this.handleBlur.bind(this)}
          />
          <p style={errorStyle}>{this.state.apiError}</p>
          <p>{this.state.orderIsAvailable ?
            `Best Available Order: Sell ${this.state.sellToken.label} for ${this.state.buyToken.label} at price: ${this.state.response.price.substring(0, 6)} on ${this.state.response.exchange} ` 
            : 'Best Available Order:'}
          </p>
          <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.submit}
              disabled={!this.state.isApproved && !this.state.orderIsAvailable}
              onClick={this.handleApproval.bind(this)}
            > {`Approve ${this.state.sellToken ? this.state.sellToken.label : '' } for Trading`}
          </Button>
          <p>{this.state.isApproved ? `${this.state.sellToken.label} is approved for trading `: ''}</p>
           <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={!this.state.isApproved && !this.state.orderIsAvailable}
              onClick={this.signAndSendTransaction.bind(this)}
            > Confirm Trade
            </Button>
        </NoSsr>
      </div>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(IntegrationReactSelect);
