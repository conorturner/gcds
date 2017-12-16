"use strict";

const {expect} = require("chai");

const {Entity} = require("../../index");

describe("TDD - Entity", () => {

	it("Create a subclass", (done) => {

		const imageSchema = {
			"type": "object",
			"properties": {
				"file_id": {
					"type": "string",
					"required": true
				},
				"size": {
					"type": "number",
					"required": true
				},
				"height": {
					"type": "number",
					"required": true
				},
				"width": {
					"type": "number",
					"required": true
				},
				"type": {
					"type": "string",
					"enum": ["jpg", "png"],
					"required": true
				}
			}
		};
		const photoSchema = {
			"type": "object",
			"properties": {
				"user_id": {
					"type": "string",
					"pattern": "^[a-f\\d]{24}$",
					"required": true
				},
				"exposure": {
					"type": "object",
					"properties": {
						"ExposureTime": {
							"type": "number",
						},
						"FNumber": {
							"type": "number",
						},
						"ISO": {
							"type": "number",
						},
						"FocalLength": {
							"type": "number",
						}
					}
				},
				"images": {
					"type": "object",
					"properties": {
						"original": imageSchema,
						"large": imageSchema,
						"medium": imageSchema,
						"small": imageSchema,
						"thumbnail": imageSchema,
					}
				}
			}
		};

		class Photo extends Entity {
			constructor(data) {
				super(photoSchema, data);
			}
		}

		const photo = new Photo({
			"user_id": "59bbcaa4a7a2ed001189ddec",
			"exposure": {
				"ExposureTime": 0.016666666666666666,
				"FNumber": 4,
				"ISO": 200,
				"FocalLength": 18.5
			},
			"images": {
				"original": {
					"file_id": "60b90125-fc20-469d-ae5f-1e1d247631f7-test-image-2.jpg",
					"size": 3167236,
					"height": 2000,
					"width": 1573,
					"type": "jpg"
				}
			}
		});


		done();

	});

});