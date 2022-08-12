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
	Created: 12th August 2022
*/

import config from "../Config/index.js";
import Git from "./Git.js";

import fs from "fs/promises";
import {promisify} from "util";

const timeout = promisify(setTimeout);

export default class Updater {
	static async initialize() {
		const updater = new Updater();
		await updater._verifyGitInstallation();
		return updater;
	}

	async isRepositoryCloned() {
		try {
			await fs.access(config.get("CLONE_LOCATION"));
			return true;
		}
		catch (err) {
			if (err.code !== "ENOENT") {
				console.error("The FluentUI emoji repository is inaccessible.", err);
				process.exit(1);
			}
			else {
				return false;
			}
		}
	}

	async isRepositoryUpToDate() {
		await this._git.fetch();

		const localCommit = await this._git.parseRevision("HEAD");
		const remoteCommit = await this._git.parseRevision("origin/HEAD");

		return localCommit === remoteCommit;
	}

	async pull() {
		let isPulling = true;

		this._git.pull()
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

		process.stdout.write("\n");
	}

	async clone() {
		let isCloning = true;

		this._git.clone(config.get("REPOSITORY_URL"), config.get("CLONE_LOCATION"))
			.then(() => isCloning = false)
			.catch((err) => {
				console.error("\nRepository clone failed.", err);
				process.exit(1);
			});

		process.stdout.write("Cloning from remote.");

		while (isCloning) {
			process.stdout.write(".");
			await timeout(1000);
		}

		process.stdout.write("\n");
	}

	async _verifyGitInstallation() {
		const git = await Git.initialize();

		if (git.isInstalled) {
			console.log(`Detected git version ${git.version}, proceeding.`);
			git.workingDirectory = config.get("CLONE_LOCATION");
			this._git = git;
		}
		else {
			console.error("git installation was not detected, please install git and try again.");
			process.exit(1);
		}
	}

	_git;
}