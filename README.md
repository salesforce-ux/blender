blender
========

[![Greenkeeper badge](https://badges.greenkeeper.io/salesforce-ux/blender.svg)](https://greenkeeper.io/)

Blender is tool for converting media assets from svg format to png format in a specified array of sizes. This module is perfect for genreating icons to be used on a variety of screen sizes. Output folder structure, output sizes, icon types, and output icon names can be configured via a JSON object input.

## Usage

You can use _blender_ either via command line or as a node library.

### Command line

	$ npm install -g blender
	$ ulimit -n 2048

To convert assets:

	blender input output --config --size [platform(s)]

	example uses: 
		blender ./input/svg ./output --config ./config.json --size 30 android api
		blender ./input/svg ./output --config ./config.json all
		blender ./input/svg ./output --size 30 

### Command Line Documentation
	
	input: 				relative path to folder
	output: 			relative path to folder, will create if does not exist
	--config: 		relative path to config file [optional, default: ./config.json]
	--size: 			desired 1X size of generated PNG (e.g. --size 18 would yield a png of longest dimension 36 with scale factor of 2) [optional, default: 18]
	platforms:		space delimited list of standardized platforms to generate png's for [optional, default: all]

### Library

	$ npm install blender --save-dev
	$ ulimit -n 2048

Example:

	blender = require 'blender'

	var config = { 
	  "formats": [
	    {
	      "name": "android",
	      "sizes": [
	        { "sizeDirectory" : "mdpi", "scale": 1 },
	        { "sizeDirectory" : "hdpi",   "scale": 1.5 }
	      ]
	    },
	    {
	      "name": "ios",
	      "sizes": [
	        { "scale": 1 },
	        { "scale": 2, "suffix": "@2x" }
	      ]
	    },
	    {
	      "name": "api",
	      "sizes": [
	        { "constant": 60, "suffix": "_60" },
	        { "constant": 120, "suffix": "_120"}
	      ], 
	      "ignoreTypeSuffix": true
	    }
	  ]
	}

	blender.convert("./input/svg", "./output", config, 18, 'all', function() {
		console.log('done');
	});

### About the config JSON object:

* = optional input

config: { formats }

formats: [ { name, *ignoreTypeSuffix, sizes } ]

-------- name: e.g. ios

-------- ignoreSuffixType: (default: false) if true, output icon names will not include typeSuffix

-------- sizes: [ { *scale, *constant, *suffix, *sizeDirectory } ]

---------------- scale: (default: 1.0) scale of output image

---------------- constant: (default none) set a constant size for output image

---------------- suffix: (default: none) suffix for renaming related to size (e.g. @2x)

---------------- sizeDirectory: (default: none) e.g. mdpi


## License

Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.