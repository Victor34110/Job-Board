const pool = require('../config/db');

class Company {
  static async create({ name, address, city }) {
    const query = `
      INSERT INTO companies (name, address, city)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, address, city];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM companies WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM companies ORDER BY name ASC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findWithJobCount() {
    const query = `
      SELECT 
        c.*,
        COUNT(ja.id) as job_count
      FROM companies c
      LEFT JOIN job_advertisements ja ON c.id = ja.company_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    const values = Object.values(updates);
    const query = `
      UPDATE companies
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM companies WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Company;
