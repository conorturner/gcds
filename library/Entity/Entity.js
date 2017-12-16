"use strict";

const {Validator} = require("jsonschema");

const operatorMap = [
	{key: "$eq", operator: "="},
	{key: "$lt", operator: "<"},
	{key: "$gt", operator: ">"},
	{key: "$lte", operator: "<="},
	{key: "$gte", operator: ">="},
];

const getFilter = (key, field) => {
	if (typeof field === "object") {
		return Object.keys(field)
			.map(fieldKey => operatorMap.filter(({key}) => key === fieldKey)[0])
			.map(({key: fieldKey, operator}) => [key, operator, field[fieldKey]])
	}
	else {
		return [[key, field]]
	}
};

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
			const entityArray = Array.isArray(entity) ? entity : [entity];

			const promiseArray = entityArray.map(entity => {
				let {key, data} = entity;
				let promise = Promise.resolve([key]);

				if (!entity.hasKey()) promise = gcds.allocateIds(Entity.getIncompleteKey(), 1);

				return promise.then(([key]) =>
					gcds.save({key, data}).then(result => Object.assign({}, result[0], {key})));
			});

			return Promise.all(promiseArray).then(resultArray => Array.isArray(entity) ? resultArray : resultArray[0]);
		}

		static find(fields = {}, cursor, limit) {
			let query = Object
				.keys(fields)
				.reduce((query, field) => {
					const filter = getFilter(field, fields[field]);
					return filter.reduce((query, filter) => query.filter.apply(query, filter), query);
				}, gcds.query(kind));

			if (cursor) query = query.start(cursor);
			if (limit) query = query.offset(limit);

			return query.run().then(([result, cursor]) =>
				({result: result.map(record => ({Key: record[gcds.Datastore.KEY], data: record})), cursor}));
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