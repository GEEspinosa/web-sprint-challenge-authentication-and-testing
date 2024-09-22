const db = require('../../data/dbConfig')

async function findByUsername(name) {
    const username = await db('users as u')
        .where('u.username', name)
    return username[0]
}

async function createUser (credentials) {
    const [id] = await db('users').insert(credentials)
    return await db('users').where('id', id).first()
}


module.exports = {
    findByUsername,
    createUser
}