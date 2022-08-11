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

import config from "./config.js";
import Git from "./Git.js";

import fs from "fs/promises";
import {promisify} from "util";

const timeout = promisify(setTimeout);

const git = await Git.initialize();

if (git.isInstalled) {
	console.log(`Detected git version ${git.version}, proceeding.`)
}
else {
	console.error("git installation was not detected, please install git and try again.")
	process.exit(1);
}

try {
	await fs.access(config.get("CLONE_LOCATION"));
	console.log("FluentUI emoji repository found, checking for updates...");

	git.workingDirectory = config.get("CLONE_LOCATION");

	git.fetch();

	const localCommit = await git.parseRevision("HEAD");
	const remoteCommit = await git.parseRevision("origin/HEAD");

	if (localCommit === remoteCommit) {
		console.log(`The local repository is up-to-date with the remote (${localCommit}).`)
	}
	else {
		console.log("The local repository is not up-to-date with the remote:");
		console.log("Local Revision: " + localCommit);
		console.log("Remote Revision: " + remoteCommit);

		let isPulling = true;
	
		git.pull()
			.then(() => isPulling = false)
			.catch((err) => {
				console.error("\nUpdate failed.", err);
				process.exit(1);
			});
		
		process.stdout.write("Pulling latest changes from the remote.");
		
		while (isPulling) {
			process.stdout.write(".");
			await timeout(1000);
		}

		console.log("The local repository is now up-to-date.")
	}
}
catch (err) {
	if (err.code !== "ENOENT") {
		console.error("The FluentUI emoji repository is inaccessible.", err)
		process.exit(1);
	}

	let isCloning = true;
	
	git.clone(config.get("REPOSITORY_URL"), config.get("CLONE_LOCATION"))
		.then(() => isCloning = false)
		.catch((err) => {
			console.error("\nRepository clone failed.", err);
			process.exit(1);
		});
	
	process.stdout.write("FluentUI emoji repository not found, cloning from remote.");
	
	while (isCloning) {
		process.stdout.write(".");
		await timeout(1000);
	}
	
	console.log("Repository clone complete.");
}