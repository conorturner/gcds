"use strict";

const {Validator} = require("jsonschema");

module.exports = ({gcds}, {kind, schema}) => {

	if (!(schema && kind)) throw new Error("Both schema and kind must be defined");

	const validator = new Validator();

	class Entity {

		static getKey(id) {
			return gcds.getCompleteKey(kind, parseInt(id));
		}

		static getIncompleteKey() {
			return gcds.getIncompleteKey(kind);
		}

		static get(key) {
			return gcds.get(key); //TODO: have it transform a bit
		}

		static delete(key) {
			return gcds.delete(key);
		}

		static save(entity) {
			let {key, data} = entity;
			let promise = Promise.resolve([key]);

			if (!entity.hasKey()) promise = gcds.allocateIds(Entity.getIncompleteKey(), 1);

			return promise.then(([key]) =>
				gcds.save({key, data}).then(result => Object.assign({}, result[0], {key})));
		}

		constructor({key, data}) {
			this.key = key;
			this.data = data;
		}

		hasKey() {
			return !!this.key;
		}

	}

	return Entity;

};