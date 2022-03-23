var React = require('react');
var ReactDOMServer = require('react-dom/server');

class MyComponent extends React.Component {
  render() {
    const lol = "lololol"
    return <div>Hello World {lol}</div>;
  }
}