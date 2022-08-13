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

import config from "../config/index.js";
import EmojiGroup from "./EmojiGroup.js";

import fs from "fs/promises";

let emojiList, groups;
let glyphToEmoji, groupNameToGroup, keywordToEmojiList, unicodeToEmoji;

const clearIndexes = () => {
	emojiList = [];
	groups = [];

	glyphToEmoji = new Map();
	groupNameToGroup = new Map();
	keywordToEmojiList = new Map();
	unicodeToEmoji = new Map();
};

const getGroup = (name) => {	
	let group = groupNameToGroup.get(name);

	if (!(group instanceof EmojiGroup)) {
		group = new EmojiGroup(name);
		groups.push(group);
		groupNameToGroup.set(name, group);
	}

	return group;
};

const addKeywords = (emoji, keywords) => {
	for (const keyword in keywords) {
		let list = keywordToEmojiList.get(keyword);

		if (Array.isArray(list)) {
			list.push(emoji);
		}
		else {
			list = [emoji];
		}

		keywordToEmojiList.set(keyword, list);
	}
};

const formatUnicode = (unicode) => unicode.replace(/\s/g, '').toLowerCase();

const processEmoji = async (assetsPath, folderName) => {
	const emoji = JSON.parse(
		await fs.readFile(`${assetsPath}/${folderName}/metadata.json`, 'utf8')
	);

	emoji.folderName = folderName;

	glyphToEmoji.set(emoji.glyph, emoji);
	unicodeToEmoji.set(formatUnicode(emoji.unicode), emoji);

	getGroup(emoji.groupName).addEmoji(emoji);
	addKeywords(emoji, emoji.keywords);

	return emoji;
};

export async function index() {
	clearIndexes();

	console.log("Indexing FluentUI emoji assets...")

	const assetsPath = config.get("CLONE_LOCATION") + "/assets/";
	const folders = await fs.readdir(assetsPath);

	const processes = [];

	for (const folderName of folders) {
		const stat = await fs.stat(`${assetsPath}/${folderName}`);

		if (stat.isDirectory()) {
			processes.push(processEmoji(assetsPath, folderName));
		}
	}

	await Promise.all(processes);
	console.log(`Processed ${processes.length} emoji assets.`);
}

export function getEmojiList() {
	return emojiList;
}

export function getEmojiGroups() {
	return groups;
}

export function getEmojiGroupByName(name) {
	return groupNameToGroup.get(name);
}

export function getEmojiByGlyph(glyph) {
	return glyphToEmoji.get(glyph);
}

export function getEmojiByKeyword(keyword) {
	return keywordToEmojiList.get(keyword);
}

export function getEmojiByUnicode(unicode) {
	return unicodeToEmoji.get(formatUnicode(unicode));
}