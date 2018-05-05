
<h1 align="center">
  <br>
    <a href="">
      <img src="https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/logo.png" alt="ViewReddit" width="200">
    </a>
  <br>
  ViewReddit
  <br>
</h1>

<h4 align="center">A web application built on <a href="https://reactjs.org" target="_blank">React</a> that analyzes comments from selected subreddits to provide both an attractive, real-time visual overlay and data-based tables and graphs.

<br>
<br>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#demos">Demos</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Key Features

* Simple and elegant user interface
* Beautiful data-based visualizations
  - Intuitive and attractive tables and graphs
* Excel compatibility
  - Offers the option to download all word data as an excel .xlsx file
* Subreddit Error Handling
  - Prevents invalid subreddits from being entered, and will indicate to user if an entered subreddit is invalid.
* Interactive loading screen
  - Ensures that the user does not stare at a blank screen while comments are loading.
* Consistent comment updates
  - Comment retrieval and updating will only end when the user chooses to do so.
* Comments are formatted randomly
  - Different comments get different backgrounds and fonts.
* Interactive Comments
  - Comments can be clicked on to provide a permalink linking to the comment on Reddit

## Demos

![Subreddit Selector](https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/selector.png) <br>
![Comment Details](https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/detailsPage.png) <br>
![Main Comment View Page](https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/mainPage.png) <br> <br>
**Click the image below to access a YouTube clip demoing the features of viewReddit.** <br> <br>
[![viewReddit Video Demo](https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/videoDemo.png)](https://www.youtube.com/watch?v=YEYDvOTiTXo) <br> <br>

**More images of viewReddit can be found <a href="https://imgur.com/a/NBf6C2C" target="_blank">here</a>**

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. I personally recommend using [Yarn](https://yarnpkg.com/en/) as a faster alternative to npm. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Oceanwall/viewReddit.git

# Go into the repository
$ cd viewReddit

# Install dependencies
$ npm install
# Or, depending on your choice of package manager
$ yarn install

# Run the app
$ npm start
# Or, depending on your choice of package manager
$ yarn start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

You will also need a Reddit account, obtainable <a href="https://www.reddit.com/">here</a>, to create a .env file, which is (currently) needed for the app to work with Reddit's API. You will also need to go <a href="https://www.reddit.com/prefs/apps/">here</a> and click the "create another app" button, which will then provide you with an application id and secret.

The .env file should go into the main folder of viewReddit and should be structured as follows:
```
REACT_APP_CLIENT_ID = randomnumbersandletters
REACT_APP_CLIENT_SECRET = morerandomnumbersandletters
REACT_APP_REDDIT_USER = Username
REACT_APP_REDDIT_PASS = Password
```

## Credits

This software has dependencies on / uses code from several open source packages and projects.

- [Node.js](https://nodejs.org/)
- [Create React App](https://github.com/facebook/create-react-app)
- [SheetJS](https://github.com/SheetJS/js-xlsx)
- [SweetAlert](https://github.com/t4t5/sweetalert)
- [react-chartjs-2](https://github.com/jerairrest/react-chartjs-2)
- [Classnames](https://github.com/JedWatson/classnames)
- [SnooWrap](https://github.com/not-an-aardvark/snoowrap)
- [SnooStorm](https://github.com/MayorMonty/Snoostorm)
- [React FitText](http://softwarepsychonaut.com/react-fittext/)
- [Hover.css](http://ianlunn.github.io/Hover/)
- [uiGradients](https://uigradients.com/)
- [Animate.css](https://daneden.github.io/animate.css/)
- README formatting was inspired by <a href="https://github.com/amitmerchant1990/electron-markdownify/blob/master/README.md">/u/amitmerchant1990's Markdownify</a>

## License

MIT

---

**Last updated: 5/04/2018**
<br>

> [(Outdated) Personal Website](http://www.cs.utexas.edu/~mzhao/) &nbsp;&middot;&nbsp;
> GitHub [@oceanwall](https://github.com/oceanwall) &nbsp;&middot;&nbsp;
> LinkedIn [@atreides](https://www.linkedin.com/in/atreides/)
<br>
Made with ❤ in Austin, Texas
