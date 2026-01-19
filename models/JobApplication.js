const pool = require('../config/db');

class JobApplication {
  static async create({ user_id, advertisement_id, status = 'pending', message }) {
    const query = `
      INSERT INTO job_applications (user_id, advertisement_id, status, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [user_id, advertisement_id, status, message];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT 
        japp.*,
        u.first_name,
        u.last_name,
        u.email,
        ja.title as job_title,
        c.name as company_name
      FROM job_applications japp
      LEFT JOIN users u ON japp.user_id = u.id
      LEFT JOIN job_advertisements ja ON japp.advertisement_id = ja.id
      LEFT JOIN companies c ON ja.company_id = c.id
      WHERE japp.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async findByUser(user_id) {
    const query = `
      SELECT 
        japp.*,
        ja.title as job_title,
        ja.location,
        ja.salary,
        c.name as company_name,
        c.city as company_city
      FROM job_applications japp
      LEFT JOIN job_advertisements ja ON japp.advertisement_id = ja.id
      LEFT JOIN companies c ON ja.company_id = c.id
      WHERE japp.user_id = $1
      ORDER BY japp.created_at DESC
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
  }

  static async findByAdvertisement(advertisement_id) {
    const query = `
      SELECT 
        japp.*,
        u.first_name,
        u.last_name,
        u.email
      FROM job_applications japp
      LEFT JOIN users u ON japp.user_id = u.id
      WHERE japp.advertisement_id = $1
      ORDER BY japp.created_at DESC
    `;
    const { rows } = await pool.query(query, [advertisement_id]);
    return rows;
  }

  static async findAll() {
    const query = `
      SELECT 
        japp.*,
        u.first_name,
        u.last_name,
        u.email,
        ja.title as job_title,
        c.name as company_name
      FROM job_applications japp
      LEFT JOIN users u ON japp.user_id = u.id
      LEFT JOIN job_advertisements ja ON japp.advertisement_id = ja.id
      LEFT JOIN companies c ON ja.company_id = c.id
      ORDER BY japp.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async update(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    const values = Object.values(updates);
    const query = `
      UPDATE job_applications
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM job_applications WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = JobApplication;
