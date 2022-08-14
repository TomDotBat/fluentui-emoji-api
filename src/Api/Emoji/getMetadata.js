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
	Name: getMetadata.js
	Project: FluentUI Emoji API
	Author: Tom
	Created: 14th August 2022
*/

import {getEmojiByGlyph, getEmojiByKeyword, getEmojiByUnicode} from "../../Indexer/index.js";

const searchMethods = {getEmojiByGlyph, getEmojiByKeyword, getEmojiByUnicode};

const getEmojiByIdentifiable = (id) => {
	let emoji;

	for (const method in searchMethods) {
		emoji = method();
		if (emoji) return emoji;
	}
};

export default async function getMetadata(req, res) {
	const id = req.params.id;

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
}