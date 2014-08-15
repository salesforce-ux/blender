blender
========

A tool for converting media assets from svg format to png format in a specified array of sizes. This module is perfect for genreating icons to be used on a variety of screen sizes. Output folder structure, output sizes, icon types, and output icon names can be configured via a JSON object input.

## Usage

You can use _blender_ either via command line or as a node library.

### Command line

	npm install -g blender

	ulimit -n 2048

To convert assets:

	blender ./path_to_output_folder ./relative_path_to_config.json

### Library

	$ npm install blender --save-dev

	blender = require 'blender'

	var config = { 
	  "formats": [
	    {
	      "name": "android",
	      "sizes": [
	        { "sizeDirectory" : "mdpi", "scale": 1 },
	        { "sizeDirectory" : "hdpi",   "scale": 1.5 }
	      ], 
	      "ignoreTypeSuffix": false
	    },
	    {
	      "name": "ios",
	      "sizes": [
	        { "scale": 1 },
	        { "scale": 2, "suffix": "@2x" }
	      ],
	      "ignoreTypeSuffix": false
	    },
	    {
	      "name": "api",
	      "sizes": [
	        { "constant": 60, "suffix": "_60" },
	        { "constant": 120, "suffix": "_120"}
	      ], 
	      "ignoreTypeSuffix": true
	    }
	  ],
	  "iconTypes": [
	    { "name": "utility",   "unitSize": 18, "longestDimension": 64,  "src": "./test/icons/utility"},
	    { "name": "doctype",   "unitSize": 18, "longestDimension": 64,  "src": "./test/icons/doctype"},
	    { "name": "custom",    "suffix": "_anchor",  "unitSize": 48, "longestDimension": 120, "src": "./test/icons/custom"},
	    { "name": "custom",    "suffix": "_list",    "unitSize": 32, "longestDimension": 120, "src": "./test/icons/custom"},
	  ]
	}

	blender("./output", config);


## License

Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.