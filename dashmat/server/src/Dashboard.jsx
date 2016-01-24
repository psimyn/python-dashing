import styles from "./Dashboard.css";
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import WidgetBox from './WidgetBox.jsx';
import {digattr} from './utils.js';

class UnknownWidget extends Component {
  render() {
    return (
      <WidgetBox className={styles.unknown} color="#C0392B">
        Unknown widget&nbsp;{this.props.type}
      </WidgetBox>
    );
  }
}

UnknownWidget.propTypes = {
  type: PropTypes.string.isRequired,
};


export class Dashboard extends Component {
    constructor(props) {
      super(props);
      this.state = {data: props.data || {}};
    }
    refresh() {
      fetch('/data.json')
        .then(data => data.json())
        .then(data => {
          this.setState({data: data});
        })
    }
    componentDidMount() {
      setInterval(this.refresh.bind(this), 2000);
    }
    render() {
      const widgets = this.props.widgets.map((widget, idx) => {
        if (!(widget.type in (window.widgets || {}))) {
          return (<UnknownWidget key={idx} type={widget.type}/>);
        }
        let data = null;
        if (widget.data) {
          data = digattr(this.state.data, widget.data);
        }
        const Widget = window.widgets[widget.type];
        return (<Widget key={idx} data={data} />);
      });
      return (
        <div className={styles.dashboard}>
          {widgets}
        </div>
      )
    };
}

Dashboard.propTypes = {
  widgets: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      data: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.object,
};
