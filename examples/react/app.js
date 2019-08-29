const React = require('react');
const superagent = require('superagent');
require('babel-polyfill');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: null,
      num: '',
      error: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange({ target: { value }}) {
    this.setState({ num: value });
  }

  async onSubmit(e) {
    e.preventDefault();
    const { num } = this.state;
    this.setState({ error: null, output: null });

    try {
      const res = await superagent.post('/fibonacci', { num });
      this.setState({ output: res.body.value });
    } catch(res) {
      let error = 'Something went wrong';
      if(res.statusCode === 400) {
        error = 'Invalid position!';
      }

      this.setState({ error });
    }
  }

  render() {
    const { error, num, output } = this.state;

    return (
      <form onSubmit={this.onSubmit} name="fibonacci">
        {error && <div className="error">{error}</div>}
        <input type="text" value={num} onChange={this.onChange} />
        <button type="submit">Submit</button>
        {output && <div className="output">Value: {output}</div>}
      </form>
    );
  }
}

module.exports = {
  App,
};
