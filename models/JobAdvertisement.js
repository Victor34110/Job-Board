const pool = require('../config/db');

class JobAdvertisement {
  static async create({ title, date_publication, description, salary, location, company_id }) {
    const query = `
      INSERT INTO job_advertisements (title, date_publication, description, salary, location, company_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, date_publication, description, salary, location, company_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT 
        ja.*,
        c.name as company_name,
        c.address as company_address,
        c.city as company_city
      FROM job_advertisements ja
      LEFT JOIN companies c ON ja.company_id = c.id
      WHERE ja.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findAll() {
    const query = `
      SELECT 
        ja.*,
        c.name as company_name,
        c.address as company_address,
        c.city as company_city
      FROM job_advertisements ja
      LEFT JOIN companies c ON ja.company_id = c.id
      ORDER BY ja.date_publication DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findAllWithCompany() {
    const query = `
      SELECT 
        ja.*,
        c.name as company_name,
        c.address as company_address,
        c.city as company_city
      FROM job_advertisements ja
      LEFT JOIN companies c ON ja.company_id = c.id
      ORDER BY ja.date_publication DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findByCompany(company_id) {
    const query = 'SELECT * FROM job_advertisements WHERE company_id = $1';
    const { rows } = await pool.query(query, [company_id]);
    return rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    const values = Object.values(updates);
    const query = `
      UPDATE job_advertisements
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM job_advertisements WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = JobAdvertisement;
