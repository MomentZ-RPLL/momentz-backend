const dbPool = require('../config/database');


const getAllUsers = () => {
    const query = 'select * from users';
    
    return dbPool.execute(query);
}

module.exports = {
    getAllUsers,

}