const pool = require("../config/db");

async function executeQuery(query, params) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows, fields] = await connection.execute(query, params);

    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

module.exports = {
  executeQuery,
};
