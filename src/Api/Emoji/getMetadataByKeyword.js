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
	Name: getMetadataByKeyword.js
	Project: FluentUI Emoji API
	Author: Tom
	Created: 14th August 2022
*/

import config from "../../config/index.js";
import {getEmojiByKeyword} from "../../Indexer/index.js";

export default function getMetadataByKeyword(req, res) {
	const keywords = req.query.keywords;

	if (keywords) {		
		if (Array.isArray(keywords)) {
			const maxKeywords = config.get("MAX_KEYWORDS");

			if (keywords.length <= maxKeywords) {
				let response = [];

				for (const keyword of keywords) {
					const emoji = getEmojiByKeyword(keyword);

					if (emoji) {
						response = Array.from([...response, ...emoji]
							.reduce((m, o) => m.set(o.cldr, o), new Map)
							.values()
						);
					}
				}
				
				if (response.length > 0) {
					res.json(response);
				}
				else {
					res.status(400).json({
						status: 400,
						message: `No emoji found with keywords: ${keywords}`
					});
				}
			}
			else {
				res.status(400).json({
					status: 400,
					message: `Exceeded the keyword query limit of ${maxKeywords}`
				});
			}
		}
		else if (typeof keywords === "string") {
			const emoji = getEmojiByKeyword(keywords);

			if (emoji) {
				res.json(emoji);
			}
			else {
				res.status(404).json({
					status: 404,
					message: `No emoji found with keyword: ${keywords}`
				});
			}
		}
		else {
			res.status(400).json({
				status: 400,
				message: `Keywords query must be an array or string`
			});
		}
	}
	else {
		res.status(400).json({
			status: 400,
			message: "Keyword query not provided"
		});
	}
}