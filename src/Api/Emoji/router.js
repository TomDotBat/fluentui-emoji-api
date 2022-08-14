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
	Name: router.js
	Project: FluentUI Emoji API
	Author: Tom
	Created: 12th August 2022
*/

import config from "../../config/index.js";
import {getEmojiByUnicode} from "../../Indexer/index.js";
import EmojiStyle from "../../Emoji/EmojiStyle.js";

import express from "express";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

const emojiRouter = express.Router();

emojiRouter.get("/:unicode", async (req, res) => {
	const unicode = req.params.unicode;
	const emoji = getEmojiByUnicode(unicode);

	if (emoji) {
		res.json(emoji);
	}
	else {
		res.status(404).json({
			status: 404,
			message: `Emoji not found with unicode: ${unicode}`
		});
	}
});

const determineEmojiStyle = (style) => (style && EmojiStyle[style.toUpperCase()])
	? style.toUpperCase() : config.get("DEFAULT_STYLE");

const styleFileTypes = {
	"3D": "png",
	"COLOR": "svg",
	"FLAT": "svg",
	"HIGH_CONTRAST": "svg"
};

const getEmojiImagePath = (emoji, style) => {
	let assetsPath = `${config.get("CLONE_LOCATION")}/assets`;

	if (!path.isAbsolute(assetsPath)) {
		assetsPath = process.cwd() + "/" + assetsPath;
	}

	const imageFile = `${emoji.cldr.replace(/\s/g, '_')}_${style.toLowerCase()}.${styleFileTypes[style]}`;

	return `${assetsPath}/${emoji.folderName}/${EmojiStyle[style]}/${imageFile}`;
};

emojiRouter.get("/:unicode/image", async (req, res) => {
	const unicode = req.params.unicode;
	const emoji = getEmojiByUnicode(unicode);

	if (emoji) {
		const style = determineEmojiStyle(req.query.style);

		if (styleFileTypes[style] === "svg" && !req.query.png) {
			res.sendFile(getEmojiImagePath(emoji, style));
		}
		else {
			let size = parseInt(req.query.size) || config.get("DEFAULT_SIZE");

			if (size > config.get("MAX_SIZE") || size < config.get("MIN_SIZE")) {
				size = config.get("DEFAULT_SIZE");
			}

			const image = sharp(await fs.readFile(getEmojiImagePath(emoji, style)))
				.resize(size, size)
				.png();
	
			res.set("Content-Type", "image/png");
			res.send(await image.toBuffer());
		}
	}
	else {
		res.status(404).json({
			status: 404,
			message: `Emoji not found with unicode: ${unicode}`
		});
	}
});

export default emojiRouter;