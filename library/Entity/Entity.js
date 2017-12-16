"use strict";

const {Validator} = require("jsonschema");

module.exports = ({gcds}, {kind, schema}) => {

	if(!(schema && kind)) throw new Error("Both schema and kind must be defined");

	const validator = new Validator();

	class Entity {

		static getKey (id) {
			return gcds.key([kind, parseInt(id)]);
		}

		constructor(data) {
			this.validator = validator;
		}

		load(key) {
			this.key = key;
			//TODO: go get shit
		}



	}

	return Entity;

};