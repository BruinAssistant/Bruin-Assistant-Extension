# Bruin Assistant

<img src='/assets/bruin_assistant_logo_full_right.png' alt='Bruin Assistant Full Logo'>

## Debugging

To add the extension to your Chrome browser:
1. Open extension settings
2. Toggle "Developer mode" to enabled
3. Press "Load unpacked" and load the root directory of this repository.

Other resources [debugging tutorial](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/)


## JSDoc

To generate JSDocs

```shell
npm install -g jsdoc
jsdoc *.js -d docs
```

## Directory structure

```
Bruin-Assistant-Extension     
├── LICENSE
├── README.md
├── assets
│   └── groupme.png
├── background.js
├── bruinwalk.css
├── bruinwalk.js
├── bruinwalkPopup.js
├── common
│   ├── config.js
│   └── observer.js
├── easter_egg.js
├── groupme.css
├── groupme.js
├── manifest.json
├── package.json
├── package-lock.json
├── parser.js
├── tests
│   ├── README.md
│   ├── groupme
│   │   └── unittest.js
│   ├── map-backend
│   │   ├── README.md
│   │   ├── imgs
│   │   │   ├── test1_result.jpg
│   │   │   ├── test1_succ.jpg
│   │   │   ├── test2_result.jpg
│   │   │   ├── test2_succ.jpg
│   │   │   ├── test3_result.jpg
│   │   │   └── test3_succ.jpg
│   │   ├── test1.js
│   │   ├── test2.js
│   │   └── test3.js
│   ├── bruinwalk
│   │   ├── README.md
│   │   ├── imgs
│   │   │   ├── test1.png
│   │   │   ├── test2.png
│   │   │   └── test3.png
│   │   └── test1.jss   
│   └── mutation
├── timedistance.js
└── topbar
```
