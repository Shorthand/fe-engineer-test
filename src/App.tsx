import React from "react";
import "./App.css";

export default class App extends React.Component<any, any> {
  input: any;

  constructor(props: any) {
    super(props);

    this.state = {
      query: "",
      isLoading: false,
      shows: [],
      selectedShow: null,
    };

    this.onSearchClick = this.onSearchClick.bind(this);
    this.onShowClick = this.onShowClick.bind(this);
    this.renderShowIndex = this.renderShowIndex.bind(this);
  }

  onSearchClick() {
    this.setState(
      {
        query: this.input.value,
        isLoading: true,
        shows: [],
        selectedShow: null,
      },
      () => {
        fetch("https://api.tvmaze.com/search/shows?q=" + this.state.query)
          .then((r: any) => r.json())
          .then((json: any) => {
            this.setState({
              isLoading: false,
              shows: json.map((r: any) => r.show),
            });
          });
      }
    );
    this.input.value = "";
  }

  onShowClick(show: any) {
    this.setState({
      isLoading: true,
    });
    fetch("https://api.tvmaze.com/shows/" + show.id + "?embed=cast")
      .then((r: any) => r.json())
      .then((json: any) => {
        this.setState({
          isLoading: false,
          selectedShow: json,
        });
      });
  }

  renderShowIndex() {
    return (
      <div>
        {this.state.query && (
          <div className="results-meta">
            {this.state.shows.length} results for "{this.state.query}"
          </div>
        )}

        <div className="show-list">
          {this.state.shows.map((show: any) => {
            return (
              <div
                className="show-preview"
                onClick={() => this.onShowClick(show)}
              >
                {show.image && <img src={show.image.medium} />}
                <span>{show.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    )
  }

  renderShow() {
    const show = this.state.selectedShow;
    const cast = show._embedded.cast;

    return (
      <React.Fragment>
        <div className="show-back">
          <button onClick={() => this.setState({ selectedShow: null })}>Back to list</button>
        </div>
        <div className="show">
          <div className="show-image">
            {show.image && <img src={show.image.original} />}
          </div>
          <div className="show-details">
            <h2>{show.name}</h2>
            <div className="show-meta">
              {show.premiered
                ? "Premiered " + show.premiered
                : "Yet to premiere"}
            </div>
            <div dangerouslySetInnerHTML={{ __html: show.summary }} />
            <h3>Cast</h3>
            <ul className="cast">
              {cast.map((member: any) => {
                return (
                  <li>
                    <div className="cast-member">
                      <div className="cast-member-image">
                        {member.person.image && (
                          <img src={member.person.image.medium} />
                        )}
                      </div>
                      <strong>{member.person.name}</strong>&nbsp;as&nbsp;
                      {member.character.name}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="app">
        <h1>TV Database</h1>
        <div className="search">
          <input
            autoFocus
            ref={(el) => (this.input = el)}
            placeholder="Enter the name of a TV show..."
          />
          <button onClick={this.onSearchClick}>Search</button>
        </div>
        <div>
          <Loading isLoading={this.state.isLoading}>
            {this.state.selectedShow ? this.renderShow() : this.renderShowIndex()}
          </Loading>
        </div>
      </div>
    );
  }
}

function Loading({ isLoading, children }: any) {
  return isLoading ? <div>Loading...</div> : children;
}