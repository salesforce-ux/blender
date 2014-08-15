blender
========

A tool for converting media assets from svg format to png format in a specified array of sizes. This module is perfect for genreating icons to be used on a variety of screen sizes. Output folder structure, output sizes, icon types, and output icon names can be configured via a JSON object input.

## Usage

You can use _blender_ either via command line or as a node library.

### Command line

	$ npm install -g blender
	$ ulimit -n 2048

To convert assets:

	blender ./path_to_output_folder ./relative_path_to_config.json

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
	  ],
	  "iconTypes": [
	    { "name": "utility",   "unitSize": 18, "longestDimension": 64,  "src": "./test/icons/utility"},
	    { "name": "doctype",   "unitSize": 18, "longestDimension": 64,  "src": "./test/icons/doctype"},
	    { "name": "custom",    "suffix": "_anchor",  "unitSize": 48, "longestDimension": 120, "src": "./test/icons/custom"},
	    { "name": "custom",    "suffix": "_list",    "unitSize": 32, "longestDimension": 120, "src": "./test/icons/custom"},
	  ]
	}

	blender("./output", config);

This will create the following icons and folder structure:

	--output
		--android
			--utility
				--mdpi
					icon_U.png
				--hdpi
					icon_U.png
			--doctype
				--mdpi
					icon_D.png
				--hdpi
					icon_D.png
			--custom
				--mdpi
					icon_C_list.png
					icon_C_anchor.png
				--mdpi
					icon_C_list.png
					icon_C_anchor.png
		--ios
			--utility
				icon_U.png
				icon_U@2x.png
			--doctype
				icon_D.png
				icon_D@2x.png
			--custom
				icon_list_C.png
				icon_anchor_C.png
				icon_list_C@2x.png
				icon_anchor_C@2x.png
		--api
			--utility
				icon_U_60.png
				icon_U_120.png
			--doctype
				icon_D_60.png
				icon_D_120.png
			--custom
				icon_C_60.png
				icon_C_120.png

###About the config JSON object:

* = optional input

config: { formats, iconTypes }

formats: [ { name, *ignoreTypeSuffix, sizes } ]

-------- name: e.g. ios

-------- ignoreSuffixType: (default: false) if true, output icon names will not include typeSuffix

-------- sizes: [ { *scale, *constant, *suffix, *sizeDirectory } ]

---------------- scale: (default: 1.0) scale of output image

---------------- constant: (default none) set a constant size for output image

---------------- suffix: (default: none) suffix for renaming related to size (e.g. @2x)

---------------- sizeDirectory: (default: none) e.g. mdpi

***

iconTypes: [ { name, unitSize, longestDimension, src, *suffix } ]

-------- name: e.g. utility

-------- unitSize: base output size for this type of icon

-------- longestDimension: max. dimension of the icon

-------- src: source directory for this type of icon

-------- suffix: (default: none) suffix related to icon type, will be added to output names




## License

Copyright (c) 2014, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.