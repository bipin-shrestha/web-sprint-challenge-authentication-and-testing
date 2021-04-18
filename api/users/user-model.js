const db = require('../../data/dbConfig.js')

function findByUsername(username) {
    return db("users").select("id","username","password").where("username",username).first();
}

function findById(id) {
    return db("users").select("id","username","password").where("id",id).first();
}

async function insert(user) {
    const [id] = await db("users").insert(user, "id");
    return findById(id);
}

function findUsername(username){
    return db("users").select("username").where("username", username).first();
}

module.exports = {
    findByUsername, findById, insert, findUsername
};