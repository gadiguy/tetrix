console.log("Loading tetrix...");

class Tetrix extends React.Component {

  constructor(props) {
    super(props);

    this.KEYS = {
      DOWN_ARROW: 40,
      RIGHT_ARROW: 39,
      LEFT_ARROW: 37,
      UP_ARROW: 38
    };

    this.state = {
      game: null,
      highScore: this.props.highScore ? this.props.highScore : 0 
    };
  }

  startGame() {
    window.onkeydown = this.handleKeyDown.bind(this);
    this.tickHandle = setInterval(this.tick.bind(this), 500);
    this.setState({ game: new Tetrix.Game(+this.props.rows, +this.props.cols) });
  }

  onGameOver() {
    window.onkeydown = null;    
    clearInterval(this.tickHandle);
    if(this.state.game.score >= this.state.highScore) {
      this.setState({ highScore: this.state.game.score });
    }
  }

  handleKeyDown(e) {

    var game = this.state.game;

    // resolve key and call game methods
    e = e || window.event;
    switch(e.keyCode){
      case this.KEYS.DOWN_ARROW :
        game.moveDown();
        break;
      case this.KEYS.RIGHT_ARROW :
        game.moveRight();

        break;
      case this.KEYS.LEFT_ARROW :
        game.moveLeft();
        break;
      case this.KEYS.UP_ARROW:
        game.rotate();
        break;
    }
    this.setState({ game });
    return false;
  }

  tick() {

    var game = this.state.game;

    // advance game tick
    game.nextState();
    
    if (game.isGameOver()) {
      this.onGameOver();
    }

    this.setState({ game });
  }

  render() {
    var content;
    if(this.state.game && !this.state.game.isGameOver()) {
      content = <Tetrix.Grid className="grid" game={this.state.game} />
    } else {
      content = <input className="start" type="button" value="Start!" onClick={this.startGame.bind(this)} />
    }
    return (
      <div className="tetrix" >
        <div className="header" >
          <h1>Tetris</h1>
          <h2>highScore: {this.state.highScore} | score: {this.state.game ? this.state.game.score : 0}</h2>
        </div>
        <div className="body" >
          {content} 
        </div>
      </div>
    );
  }    
}

Tetrix.Grid = class extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var trs = [];
    var game = this.props.game;
    for(var i=0; i<game.rows; i++) {
      var tds = [];
      for(var j=0; j<game.cols; j++) {
        var c = game.getBox(i, j);
        tds.push(<td style={ c ? { backgroundColor: c } : {} } />);
      }
      trs.push(<tr>{tds}</tr>);      
    }
    return (
      <table>{trs}</table>
    );
  }
}
