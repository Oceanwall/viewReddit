
<h1 align="center">
  <br>
    <a href="">
      <img src="https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/logo.png" alt="ViewReddit" width="200">
    </a>
  <br>
  ViewReddit
  <br>
</h1>

<h4 align="center">A web application built on <a href="https://reactjs.org" target="_blank">React</a> that provides real-time, dynamic visualization of comments from various subreddits.

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#demos">Demos</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Key Features

* Simple user interface
* Supports all public subreddits
* Subreddit Error Handling
  - Prevents invalid subreddits from being entered, and will indicate to user if an entered subreddit is invalid.
* Does not require a Reddit account for use  
* Interactive loading screen
  - Ensures that the user does not stare at a blank screen while comments are loading.
* Consistent comment updates
  - Comment retrieval and updating will only end when the user chooses to do so.
* Comments are formatted randomly
  - Different comments get different backgrounds and fonts.
* Dynamic Resizing
  - Works for multiple screen sizes
* Works across multiple browsers
  - Google Chrome, Internet Explorer, and Firefox, among many others.
  
## Demos

![screenshot](https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/Loading.gif)
![screenshot](https://raw.githubusercontent.com/Oceanwall/viewReddit/master/images/ShowComments.gif)

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

## Credits

This software has dependencies on / uses code from several open source packages and projects.

- [Node.js](https://nodejs.org/)
- [Create React App](https://github.com/facebook/create-react-app)
- [React FitText](http://softwarepsychonaut.com/react-fittext/)
- [Classnames](https://github.com/JedWatson/classnames)
- [SnooWrap](https://github.com/not-an-aardvark/snoowrap)
- [SnooStorm](https://github.com/MayorMonty/Snoostorm)
- [Hover.css](http://ianlunn.github.io/Hover/)
- [uiGradients](https://uigradients.com/)
- [Animate.css](https://daneden.github.io/animate.css/)
- README formatting was inspired by <a href="https://github.com/amitmerchant1990/electron-markdownify/blob/master/README.md">/u/amitmerchant1990's Markdownify</a>

## License

MIT

---

> [(Outdated) Personal Website](http://www.cs.utexas.edu/~mzhao/) &nbsp;&middot;&nbsp;
> GitHub [@oceanwall](https://github.com/oceanwall) &nbsp;&middot;&nbsp;
