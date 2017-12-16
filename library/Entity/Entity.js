"use strict";

const {Validator} = require("jsonschema");

module.exports = ({gcds}, {kind, schema}) => {

	if(!(schema && kind)) throw new Error("Both schema and kind must be defined");

	const validator = new Validator();

	class Entity {

		static getKey (id) {
			return gcds.key([kind, parseInt(id)]);
		}

		static load (key){
			return gcds.get(key); //TODO: have it transform a bit
		}

		constructor(data) {
			this.validator = validator;
		}



	}

	return Entity;

};