export function buildInsertQuery(table: string, data: Record<string, any>): {
    query: string;
    values: any[];
  } {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    return {
      query: `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`,
      values
    };
  }
  
  
  export function buildUpdateQuery(
    table: string, 
    data: Record<string, any>, 
    where: Record<string, any>
  ): {
    query: string;
    values: any[];
  } {
    const setClause = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');
    
    const whereClause = Object.keys(where)
      .map((key, i) => `${key} = $${i + Object.keys(data).length + 1}`)
      .join(' AND ');
    
    return {
      query: `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`,
      values: [...Object.values(data), ...Object.values(where)]
    };

    
  }