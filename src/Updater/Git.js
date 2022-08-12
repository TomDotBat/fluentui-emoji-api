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
	Name: Git.js
	Project: FluentUI Emoji API
	Author: Tom
	Created: 11th August 2022
*/

import {exec} from "child_process";
import {promisify} from "util";

const cmd = promisify(exec);

export default class Git {
	static async initialize() {
		const git = new Git();
		await git._determineVersion();
		return git;
	}

	get isInstalled() {
		return !!this._version;
	}

	get version() {
		return this._version;
	}

	get workingDirectory() {
		return this._execOptions.cwd;
	}

	set workingDirectory(workingDirectory) {
		this._execOptions.cwd = workingDirectory;
	}

	async clone(url, destination = "") {
		await cmd(`git clone ${url} ${destination}`);
	}

	async fetch() {
		await cmd("git fetch", this._execOptions);
	}

	async parseRevision(revision) {
		const {stdout} = await cmd(`git rev-parse ${revision}`, this._execOptions);
		return stdout.trim();
	}

	async pull(remote = "", branch = "") {
		await cmd(`git pull ${remote} ${branch}`, this._execOptions);
	}

	async _determineVersion() {
		try {
			const {stdout} = await cmd("git --version");

			if (!stdout.startsWith("git version")) {
				throw new Error("Unexpected output");
			}

			this._version = stdout.trim().substring(12);
		}
		catch (err) {}
	}

	_version;
	_execOptions = {};
}