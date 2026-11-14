// Adapt the shared API's parameterised SQL to PostgreSQL without interpolating values.
export function makePostgresDB(execute, transaction) {
  function statement(query, values = []) {
    let index = 0;
    const sql = query.replace(/\b(FROM|INTO|UPDATE)\s+(content|bookings|sessions|attempts)\b/gi, '$1 hive.$2').replace(/\?/g, () => '$' + ++index);
    return {
      sql, values,
      bind(...next) { return statement(query, next); },
      async first() { return (await execute(sql, values)).rows[0] || null; },
      async all() { return { results: (await execute(sql, values)).rows }; },
      async run() { return { meta: { changes: (await execute(sql, values)).count } }; }
    };
  }
  return {
    prepare: query => statement(query),
    async batch(items) {
      return transaction(async run => {
        const results = [];
        for (const item of items) results.push({meta:{changes:(await run(item.sql,item.values)).count}});
        return results;
      });
    }
  };
}
