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
	Name: getImage.js
	Project: FluentUI Emoji API
	Author: Tom
	Created: 14th August 2022
*/

import config from "../../config/index.js";
import {getEmojiByIdentifiable} from "../../Indexer/index.js";
import EmojiStyle from "./EmojiStyle.js";
import SkinTone from "./SkinTone.js";

import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

const determineEmojiStyle = (style) => (typeof style === "string" && EmojiStyle[style.toUpperCase()])
	? style.toUpperCase() : config.get("DEFAULT_STYLE");

const determineEmojiSize = (size) => {
	size = parseInt(size) || config.get("DEFAULT_SIZE");

	if (size > config.get("MAX_SIZE") || size < config.get("MIN_SIZE")) {
		size = config.get("DEFAULT_SIZE");
	}

	return size;
};

const determineEmojiSkinTone = (skinTone, style) => {
	skinTone = typeof skinTone === "string" ? skinTone : config.get("DEFAULT_SKIN_TONE");
	skinTone = SkinTone[skinTone.toUpperCase()]
		? skinTone.toUpperCase()
		: config.get("DEFAULT_SKIN_TONE");

	if (style === "HIGH_CONTRAST") {
		skinTone = "DEFAULT";
	}

	return skinTone;
};

const styleFileTypes = {
	"3D": "png",
	"COLOR": "svg",
	"FLAT": "svg",
	"HIGH_CONTRAST": "svg"
};

const getEmojiImageFileName = (emoji, skinTone, style) => {
	let imageFile = `${emoji.cldr.replace(/\s/g, "_").replace(/:/g, "")}_${style.toLowerCase()}`;

	if (skinTone) {
		imageFile += "_" + SkinTone[skinTone].toLowerCase();
	}

	return `${imageFile}.${styleFileTypes[style]}`;
}

const getEmojiImagePath = (emoji, skinTone, style) => {
	let assetsPath = `${config.get("CLONE_LOCATION")}/assets`;

	if (!path.isAbsolute(assetsPath)) {
		assetsPath = process.cwd() + "/" + assetsPath;
	}

	let emojiFolder = emoji.cldr.charAt(0).toUpperCase() + emoji.cldr.slice(1).replace(/:/g, "");

	if (skinTone) {
		emojiFolder += "/" + SkinTone[skinTone];
	}

	return `${assetsPath}/${emojiFolder}/${EmojiStyle[style]}/${getEmojiImageFileName(emoji, skinTone, style)}`;
};

export default async function getImage(req, res) {
	const id = req.params.id;
	const emoji = getEmojiByIdentifiable(id);

	if (emoji) {
		const style = determineEmojiStyle(req.query.style);

		let skinTone;
		if (!!emoji.unicodeSkintones) {
			skinTone = determineEmojiSkinTone(req.query.skinTone, style);
		}

		if (styleFileTypes[style] === "svg" && req.query.png !== "true") {
			res.sendFile(getEmojiImagePath(emoji, skinTone, style));
		}
		else {
			const size = determineEmojiSize(req.query.size);

			const image = sharp(await fs.readFile(getEmojiImagePath(emoji, skinTone, style)))
				.resize(size, size)
				.png();

			res.set("Content-Type", "image/png");
			res.send(await image.toBuffer());
		}
	}
	else {
		res.status(404).json({
			status: 404,
			message: `Emoji not found with identifiable: ${id}`
		});
	}
}