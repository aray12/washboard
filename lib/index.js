require('isomorphic-fetch');

const React = require('react');
const { render } = require('react-dom');


const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TIMES_API_KEY = process.env.TIMES_API_KEY;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      weather: { main: { temp: '' } },
      news: [],
      datetime: new Date(),
    }
  }

  fetchWeatherData = () =>
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=94109&units=imperial&APPID=${WEATHER_API_KEY}`)
      .then(res => res.json())
      .then(res => this.setState(Object.assign({}, this.state, { weather: res })));

  fetchNewsData = () => {
    fetch(`http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json?api-key=${TIMES_API_KEY}`)
      .then(res => res.json())
      .then(res => res.results.filter(article => article.type === 'Article'))
      .then(res => this.setState(Object.assign({}, this.state, { news: res })));
  }

  setCurrentTime = () => this.setState(Object.assign({}, this.state, { datetime: new Date() }));

  componentDidMount() {
    this.fetchWeatherData();
    this.fetchNewsData();
    this.setCurrentTime();
    this.weatherInterval = setInterval(this.fetchWeatherData, 10000);
    this.newsInterval = setInterval(this.fetchNewsData, 120000);
    this.datetimeInterval = setInterval(this.setCurrentTime, 100);
  }

  componentWillUnmount() {
    clearInterval(this.weatherInterval);
    clearInterval(this.newsInterval);
    clearInterval(this.datetimeInterval);
  }

  render() {
    const { weather, news, datetime } = this.state;
    return (
      <div>
        <div>{weather.main.temp}&deg;</div>
        <div>{datetime.toDateString()}</div>
        <div>{datetime.toLocaleTimeString()}</div>
        {news.map(article => (
          <div>
            <div>{article.title}</div>
            <div>{article.abstract}</div>
            <br />
            <br />
            <br />
            <br />
          </div>
        ))}
      </div>
    );
  }
}

const rootElement = document.querySelector('#app');

render(React.createElement(App), rootElement);
