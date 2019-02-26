import React from 'react';
import { Input } from '@material-ui/core';

class AmountInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {amount: 0};
  }

  handleChange(event){
    this.setState({amount: event.target.value})
  };

  render() {
    return(
      <Input
          label={"amount"}
          onChange={this.handleChange('amount')}
          value={this.state.amount}
      />
  )}
}

export default AmountInput;