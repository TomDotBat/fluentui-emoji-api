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
	Name: index.js
	Project: FluentUI Emoji API
	Author: Tom
	Created: 11th August 2022
*/

import config from "./Config/index.js";
import Updater from "./Updater/index.js";

const autoUpdate = async () => {
	const updater = await Updater.initialize();

	if (await updater.isRepositoryCloned()) {
		if (config.get("AUTO_UPDATE")) {
			console.log("FluentUI emoji repository found, checking for updates...");
		
			if (await updater.isRepositoryUpToDate()) {
				console.log(`The local repository is up-to-date with the remote.`);
			}
			else {
				console.log("The local repository is not up-to-date with the remote:");
				await updater.pull();
				console.log("The local repository is now up-to-date.");
			}
		}
		else {
			console.log("FluentUI emoji repository found.");
		}
	}
	else {
		console.log("FluentUI emoji repository not found.");
		await updater.clone();
		console.log("Repository clone complete.");
	}
};

await autoUpdate();