const db = require('../../data/dbConfig')


async function createUser (credentials) {
    const [id] = await db('users').insert(credentials)
    return await db('users').where('id', id).first()
}



module.exports = {
    createUser
}