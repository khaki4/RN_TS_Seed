import React, { Component } from "react";
import Counter from "../components/Counter";
import * as fromNavi from "../reducers/navigation";
import { connect } from "react-redux";

interface ConnectProps {
  count: number;
}

interface DispatchProps {
  requestIncrement: () => any;
  increment: () => any;
  decrement: () => any;
}

class CounterContainer extends Component<ConnectProps & DispatchProps, {}> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.requestIncrement();
  }

  render() {
    return <Counter {...this.props} />;
  }
}

const { requestIncrement, increment, decrement } = fromNavi;
export default connect<ConnectProps, DispatchProps>(
  (state: fromNavi.AppState) => ({
    count: state.counter.count
  }),
  { requestIncrement, increment, decrement }
)(CounterContainer);
