# Bruin Assistant


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
jsdoc *.js
```

## Directory structure

Bruin-Assistant-Extension     
├── LICENSE
├── README.md
├── assets
│   └── groupme.png
├── background.js
├── bruinwalk.js
├── config.js
├── groupme.css
├── groupme.js
├── jquery-3.6.0.min.js
├── manifest.json
├── observer.js
├── package.json
├── settings.css
├── settings.html
├── settings.js
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
│   └── mutation
└── timedistance.js