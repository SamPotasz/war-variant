# War Variant web game dev project :-)

Here's a little version of the classic game war with a twist. Each time there's a "war," you have a choice to make. You can choose how many cards to add to the war in order to get a higher score and increase your chances of winning. The sum of the point values of each card wagered makes up your total score.

*HOWEVER*, with this variant, there's not much of a decision. You should wager the most cards possible every time. And then when you have fewer cards than your opponent, it becomes even *harder* to come back than in regular war.

In my variant, I introduced a separate choice mechanic: The ability to _defend_ against large attacks. When a WAR occurs, you can either launch a BIG ATTACK, using all of your cards, a MID ATTACK, using 10 cards, a normal war (4 cards), or GUARD.

Guarding _automatically_ defeats a BIG ATTACK. So now there's some risk to mashing the BIG ATTACK button!

Additionally, GUARD comes with it's own risks. When you GUARD, you have to _sacrifice_ (trash) 5 cards. Permanently. So GUARD also comes with its own risks and makes it so when both players choose a defensive tactic, it's apparent they left gains on the table (had they chosen MID ATTACK).

## Technical Decisions

Architecturally, even though this game is only single player (you play locally against a bot who chooses randomly), it's architectured with an eye towards multiplayer.

Traditionally, a single player game would keep all the state on the client. 

In this game, the state is refactored out, as _if_ it were being stored on a server. This will prevent cheating when the game moves to multiplayer. It was an additional programming challenge, but I thought it'd be useful to mirror this paradigm for the exercise. 

`Referee.js` is the erstwhile server class, and it communicates only what is necessary to the client `GameScene.js` class. `GameScene.js` and related classes are rather pure display classes. They have absolutely no knowledge of the state of the game. They learn about each card one at a time when it's drawn as well as the size of the deck when the server tells it about it.

For an 8-hour challenge, this was maybe a silly idea because it left less time for visual effects, but it was what I decided to emphasize, architecture-wise.

## Missing pieces
Due to time constraints, I haven't been able to get in everything I want, and the UI moves pretty fast. There's definitely not enough info for the game to be intelligible as of yet. Here's what's missing:
- The score of each war is not shown to the player
- The bot's choice for each war isn't shown to the player
- The "trashed" cards when you choose "DEFENSE" aren't shown. Ideally, there'd be an animation that shows these cards being trashed. Did you just lose an Ace? That'd be a cool moment.
- A successful DEFENSE isn't animated with any verve.
- A whole bunch of polish (winning + losing screens, SFX, etc.)
- instructions, tutorial, rules, etc.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.


After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Customizing Template

### Babel
You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

  ```
  "browsers": [
    ">0.25%",
    "not ie 11",
    "not op_mini all"
  ]
  ```

### Webpack
If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create
new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code
After you run the `npm run build` command, your code will be built into a single bundle located at 
`dist/bundle.min.js` along with any other assets you project depended. 

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`), 
you should be able to open `http://mycoolserver.com/index.html` and play your game.
