"use strict";

const MAX_PER_REQ = 500;

class GCDS {

	constructor({ GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV = "develop" }, { Datastore = require("@google-cloud/datastore") } = {}) {
		this.Datastore = Datastore;
		this.datastore = Datastore({ projectId: GCLOUD_PROJECT_ID, keyFilename: KEY_FILENAME });
		this.namespace = NODE_ENV;
	}

	getIncompleteKey(kind) {
		const path = Array.isArray(kind) ? kind : [kind];
		return this.getKey(path);
	}

	getKey(path) {
		return this.datastore.key({ namespace: this.namespace, path });
	}

	getCompleteKey(entityName, id) {
		return this.getKey([entityName, parseInt(id)]);
	}

	allocateIds(incompleteKey, n) {
		if (n < MAX_PER_REQ + 1) return this.datastore.allocateIds(incompleteKey, n).then(([keys]) => keys);
		else {
			const nRequests = Math.ceil(n / MAX_PER_REQ);
			const lastRequestSize = n - (nRequests - 1) * MAX_PER_REQ;

			const promiseArray = new Array(nRequests).fill(null).map((_, index) => {
				const reqSize = index === nRequests - 1 ? lastRequestSize : MAX_PER_REQ;
				return this.datastore.allocateIds(incompleteKey, reqSize).then(([keys]) => keys);
			});

			return Promise.all(promiseArray)
				.then(result => result.reduce((acc, arr) => acc.concat(arr), []));
		}
	}

	save(entity) {
		if (!Array.isArray(entity) || entity.length < MAX_PER_REQ + 1) return this.datastore.save(entity);
		else {
			let chunks = [];
			for (let i = 0; i < entity.length; i += MAX_PER_REQ) {
				chunks.push(entity.slice(i, i + MAX_PER_REQ));
			}

			return Promise.all(chunks.map(chunk => this.datastore.save(chunk)))
				.then(result => result.reduce((acc, arr) => acc.concat(arr), []));
		}
	}

	upsert(entity) {
		return this.datastore.upsert(entity);
	}

	get(key) {
		return this.datastore.get(key).then(result => Array.isArray(key) ? result : result[0]);
	}

	delete(key) {
		return this.datastore.delete(key);
	}

	query(kind) {
		return this.datastore.createQuery(this.namespace, kind);
	}

}

module.exports = GCDS;