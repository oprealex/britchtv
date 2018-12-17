import React, { Component, ImageBackground, View, Text } from "react";
import logo from "./logo.svg";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Iframe from "react-iframe";
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

  async componentDidMount() {
    await fetch("https://api.twitch.tv/kraken/streams", {
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

  streamChat(item){
    let src = "https://www.twitch.tv/embed/" + item.channel.name + "/chat"
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
              src={this.streamSource(this.state.selectedStream)}
              display="flex"
              height="720"
              width="1280"
              frameborder="0"
              scrolling="no"
              allowfullscreen="true"
            />
            <iframe
              frameborder="0"
              scrolling="no"
              id="chat_embed"
              src={this.streamChat(this.state.selectedStream)}
              height="720"
              width="350"
            />
          </div>
        </header>

        <div className="App-header">
          <GridList cellHeight={200} spacing={10} cols={5} className="grid">
            {this.state.streamList.streams.map(item => (
              <GridListTile key={item}>
                <img
                  src={item.preview.large}
                  onClick={() => this.openStream(item)}
                  title={item.channel.display_name}
                />

                <GridListTileBar
                  title={item.channel.display_name}
                  subtitle={
                    <span>
                      is streaming {item.game} for {item.viewers} viewers!
                    </span>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      </div>
    );
  }
}