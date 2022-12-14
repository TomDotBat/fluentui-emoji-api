/*
	COPYRIGHT NOTICE:
	© 2022 Thomas O'Sullivan - All rights reserved.

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

	FILE INFORMATION:
	Name: defaultConfig.js
	Project: FluentUI Emoji API
	Author: Tom
	Created: 11th August 2022
*/

export default {
	LISTEN_PORT: 8000,

	DEFAULT_STYLE: "3D",
	DEFAULT_SKIN_TONE: "DEFAULT",

	MAX_KEYWORDS: 5,

	DEFAULT_SIZE: 256,
	MIN_SIZE: 16,
	MAX_SIZE: 2048,

	REPOSITORY_URL: "https://github.com/microsoft/fluentui-emoji.git",
	CLONE_LOCATION: "./fluentui-emoji",
	AUTO_UPDATE: true,
};