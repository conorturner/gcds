"use strict";

const { Validator } = require("jsonschema");

const operatorMap = [
	{ key: "$eq", operator: "=" },
	{ key: "$lt", operator: "<" },
	{ key: "$gt", operator: ">" },
	{ key: "$lte", operator: "<=" },
	{ key: "$gte", operator: ">=" },
];

const getFilter = (key, field) => {
	if (typeof field === "object") {
		return Object.keys(field)
			.map(fieldKey => operatorMap.filter(({ key }) => key === fieldKey)[0])
			.map(({ key: fieldKey, operator }) => [key, operator, field[fieldKey]])
	}
	else {
		return [[key, field]]
	}
};

module.exports = ({ gcds }, { kind, schema }) => {

	if (!(schema && kind)) throw new Error("Both schema and kind must be defined");

	const validator = new Validator();

	class Entity {

		static validate(data) {
			const arr2obj = (arr) => arr.reduce((acc, { key, value }) => Object.assign(acc, { [key]: value }), {});

			if (!data) return { valid: false, reason: "Nothing to validate" };
			const { errors } = validator.validate(Array.isArray(data) ? arr2obj(data) : data, schema);
			if (errors.length === 0) return { valid: true };
			else return { valid: false, reason: errors.map(({ property, message }) => `${property} ${message}`) };
		}

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

		static saveMany(entity) {
			const entityArray = Array.isArray(entity) ? entity : [entity];

			return gcds.allocateIds(Entity.getIncompleteKey(), entityArray.length)
				.then(keys => {
					const rows = entityArray.map(({ key, data, excludeFromIndexes }, index) =>
						({ key: key || keys[index], data, excludeFromIndexes }));

					return gcds.save(rows).then(() => rows);
				});
		}

		static find({ fields = {}, cursor, limit, sort } = {}) {
			return Entity._find({ fields, cursor, limit, sort })
				.then(([result, cursor]) =>
					({ result: result.map(record => ({ Key: record[gcds.Datastore.KEY], data: record })), cursor }));
		}

		static findStream({ fields = {}, cursor, limit, sort } = {}) {
			const useStream = true;
			return Entity._find({ fields, cursor, limit, useStream, sort });
		}

		static _find({ fields = {}, cursor, limit, sort, useStream = false }) {
			let query = Object
				.keys(fields)
				.reduce((query, field) => {
					const filter = getFilter(field, fields[field]);
					return filter.reduce((query, filter) => query.filter.apply(query, filter), query);
				}, gcds.query(kind));

			if (cursor !== undefined) query = query.start(cursor);
			if (limit !== undefined) query = query.limit(limit);
			if (sort) {
				const sorts = Entity.parseSort(sort);
				sorts.forEach(({ key, descending }) => query.order(key, { descending }));
			}

			if (useStream) return query.runStream();
			else return query.run();
		}

		static parseSort(sort) {
			return Object.keys(sort)
				.map(key => ({ key, descending: sort[key] === -1 }));
		}

		constructor({ key, data, excludeFromIndexes }) {
			const validation = Entity.validate(data, schema);
			if (!validation.valid) throw validation;
			this.key = key;
			this.data = data;
			this.excludeFromIndexes = excludeFromIndexes;
		}

		hasKey() {
			return !!this.key;
		}

	}

	return Entity;

};