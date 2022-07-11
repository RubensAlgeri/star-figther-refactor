import { connection } from "../database.js";

export interface Figther {
  id: number;
  name: string;
  wins: number;
  losses: number;
  draws: number;
}

export async function find() {
  const result = await connection.query<Figther>(
    `
      SELECT * 
        FROM fighters 
      ORDER BY wins DESC, draws DESC;
    `
  );
  return result.rows;
}

export async function findByUsername(username: string) {
  const result = await connection.query<Figther>(
    `
    SELECT * FROM fighters WHERE username=$1
    `,
    [username]
  );
  return result.rows[0];
}

export async function insert(username: string) {
  const result = await connection.query<Figther>(
    `
    INSERT INTO fighters (username, wins, losses, draws) 
    VALUES ($1, 0, 0, 0)
    RETURNING id;
  `,
    [username]
  );

  return result.rows[0];
}

export async function updateStats(
  id: number,
  column: "wins" | "losses" | "draws"
) {
  connection.query<Figther>(
    `
    UPDATE fighters 
    SET ${column}=${column}+1
    WHERE id=$1
  `,
    [id]
  );
}
