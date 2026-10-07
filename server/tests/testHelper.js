const crypto = require('crypto');
const { setSupabaseClient } = require('../src/config/db');

class MockQueryBuilder {
  constructor(table, tableName, client) {
    this.table = table;
    this.tableName = tableName;
    this.client = client;
    this.action = 'select';
    this.insertPayload = null;
    this.filters = [];
    this.sortOption = null;
    this.selectedColumns = '*';
  }

  select(columns = '*') {
    this.selectedColumns = columns;
    return this;
  }

  insert(payload) {
    this.action = 'insert';
    this.insertPayload = payload;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column, value) {
    this.filters.push({ column, value });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.sortOption = { column, ascending };
    return this;
  }

  _execute(isSingle = false, isMaybeSingle = false) {
    if (this.action === 'insert') {
      // Check unique constraint on email for users table
      if (this.tableName === 'users' && this.insertPayload?.email) {
        const existing = this.table.find(
          (u) => u.email.toLowerCase() === this.insertPayload.email.toLowerCase()
        );
        if (existing) {
          return {
            data: null,
            error: {
              code: '23505',
              message: 'duplicate key value violates unique constraint "users_email_key"'
            }
          };
        }
      }

      const newRecord = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...this.insertPayload
      };

      this.table.push(newRecord);
      return { data: newRecord, error: null };
    }

    if (this.action === 'delete') {
      const index = this.table.findIndex((item) =>
        this.filters.every((f) => String(item[f.column]) === String(f.value))
      );

      if (index === -1) {
        return { data: null, error: null };
      }

      const [deleted] = this.table.splice(index, 1);
      return { data: deleted, error: null };
    }

    // Default: select
    let rows = this.table.filter((item) =>
      this.filters.every((f) => String(item[f.column]) === String(f.value))
    );

    if (this.sortOption) {
      const { column, ascending } = this.sortOption;
      rows = [...rows].sort((a, b) => {
        if (a[column] < b[column]) return ascending ? -1 : 1;
        if (a[column] > b[column]) return ascending ? 1 : -1;
        return 0;
      });
    }

    if (isSingle) {
      if (rows.length === 0) {
        return {
          data: null,
          error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' }
        };
      }
      return { data: rows[0], error: null };
    }

    if (isMaybeSingle) {
      return { data: rows[0] || null, error: null };
    }

    return { data: rows, error: null };
  }

  single() {
    return Promise.resolve(this._execute(true, false));
  }

  maybeSingle() {
    return Promise.resolve(this._execute(false, true));
  }

  then(resolve, reject) {
    try {
      const result = this._execute(false, false);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }
}

class MockSupabaseClient {
  constructor() {
    this.tables = {
      users: [],
      documents: []
    };
  }

  reset() {
    this.tables.users = [];
    this.tables.documents = [];
  }

  from(tableName) {
    if (!this.tables[tableName]) {
      this.tables[tableName] = [];
    }
    return new MockQueryBuilder(this.tables[tableName], tableName, this);
  }
}

const mockSupabaseClient = new MockSupabaseClient();
setSupabaseClient(mockSupabaseClient);

module.exports = {
  mockSupabaseClient
};
