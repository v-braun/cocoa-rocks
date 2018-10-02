# Contribution Guidelines


The Website [cocoa.rocks](https://cocoa.rocks) is generated from [data.json](https://github.com/v-braun/cocoa-rocks/blob/master/data.json).

When adding new records to that file please follow these instructions:

- Search for **duplicates**
- **Fork** this repository
- Create an individual **PR** for each record


You can validate your change with

```bash
npm run checkdata
```
This will validate the data.json file against a [JSON schema](https://github.com/v-braun/cocoa-rocks/blob/master/data.schema.json).
This step is optional and will be done as a verification CI build step for each PR.

# 💾 Format
The format of each record is pretty simple. Most of the data will be fetched automatically from GitHub.

```js
[
    {
        // REQUIRED: url of the GitHub repo
        "repo": "https://github.com/v-braun/VBRRollingPit", 

        // REQUIRED: url to the main image
        "banner": "https://github.com/v-braun/VBRRollingPit/raw/master/screen.gif", 

        // REQUIRED (could be empty): additional images
        "images": [ 
        ],

        // REQUIRED (min 1 / max 3 / allowed values see schema): tags 
        "tags": [ 
            "TabBar"
        ],

        // REQUIRED (min 1 / max 4 / allowed values see schema): supported platforms
        "paltforms": [
            "iOS"
        ]
    },
    // other ...
]

```

# 🤖 Generation
The *data.json* file will be parsed and enriched with additional information from GitHub.
Results of this process are stored in [src/data/data.compiled.json](https://github.com/v-braun/cocoa-rocks/blob/master/src/data/data.compiled.json).


# 📦 Build & Development
The following npm commands are supported:

```bash
# schema validation
npm run checkdata

# generate data.compiled.json
npm run updatedata

# generate cocoa.rocks website
npm run dist

# start watch tasks & livereload for development
npm run serve
```


# 🙅‍♀️ Not ineligible or deletion if
- Not actively maintained
- README is not clear
- Not work with the latest SDK


# 🚀 Contributions beside new controls

- Contributions to the existing schema file (new Tags / Platforms) are also welcome (create a [PR](https://github.com/v-braun/cocoa-rocks/pulls) or an [issue](https://github.com/v-braun/cocoa-rocks/issues)).
- Feedback or new features for [cocoa.rocks](https://cocoa.rocks) are welcome (create an [issue](https://github.com/v-braun/cocoa-rocks/issues)).


**Thank you for your suggestions!** ♥️