import React, { Component, ImageBackground, View, Text } from "react";
import logo from "./logo.svg";
import "./App.css";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      modalOpened: false,
      streamList: {
        streams: []
      },
      selectedStream: {
        channel: {
          url: "",
          name: ""
        }
      },
      stream: undefined,
      isShown: false
    };
  }

  async getStreamList() {
    await fetch("https://api.twitch.tv/kraken/streams?limit=100", {
      method: "GET",
      headers: {
        "Client-ID": "8v16du2ag2ae8159yal4d0454hdt88"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ streamList: responseJson });
        console.log(this.state.streamList);
      })
      .catch(error => {
        console.log("Error");
        console.log(error);
      });
    await this.setState({ selectedStream: this.state.streamList.streams[0] });
  }

  async componentDidMount() {
    this.getStreamList()
  }

  async openStream(item) {
    console.log(item);
    // window.open(item.channel.url);
    await this.setState({ selectedStream: item });
    console.log(this.state.stream);
  }

  streamSource(item) {
    let src = "https://player.twitch.tv/?channel=" + item.channel.name;
    console.log(src);
    return src;
  }

  streamChat(item) {
    let src = "https://www.twitch.tv/embed/" + item.channel.name + "/chat?darkpopout"
    console.log(src)
    return src;
  }

  render() {
    const { data } = this.props;
    console.log(this.state.streamList.streams);
    this.state.streamList.streams.forEach(element => {
      console.log(element.game);
    });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="embeddedStream">
            <iframe
              className="currentStream"
              src={this.streamSource(this.state.selectedStream)}
              display="flex"
              height={'100%'}
              width={'100%'}
              frameborder="0"
              scrolling="no"
              allowfullscreen="true"
            />
            <iframe
              className="currentStreamChat"
              frameborder="0"
              scrolling="no"
              id="chat_embed"
              src={this.streamChat(this.state.selectedStream)}
              height={'100%'}
              width={'20%'}
            />
          </div>
        </header>

        <div className="streamListContainer">
          {this.state.streamList.streams.map(item => (
            <div key={item} className="gridContainer">
              <img
                className="tile"
                src={item.preview.large}
                onClick={() => this.openStream(item)}
                title={item.channel.display_name}
              >

              </img>
              <div class="streamDescription">
                <span className="streamTitle">{item.channel.display_name} </span>
                <span>
                  streaming {item.game} for {item.viewers} viewers!
                    </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
