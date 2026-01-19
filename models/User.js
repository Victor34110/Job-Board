const pool = require('../config/db');

class User {
  static async create({ first_name, last_name, email, password, role = 'user' }) {
    const query = `
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, role
    `;
    const values = [first_name, last_name, email, password, role];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, first_name, last_name, email, role FROM users ORDER BY created_at DESC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    const values = Object.values(updates);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = User;
