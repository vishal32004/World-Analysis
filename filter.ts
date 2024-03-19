import { pool } from "@/lib/db-config";
import { NextResponse } from "next/server";
export const GET = async (req: Request, res: NextResponse) => {
  const { searchParams } = new URL(req.url);
  const tableName = searchParams.get("tableName");
  const prefix = searchParams.get("prefix");
  const columns = JSON.parse(searchParams.get("columns") ?? "[]");
  const selectedYear = searchParams.get("selectedYear");
  const selectedMonth = searchParams.get("selectedMonth");

  if (!tableName || !prefix || !columns || !Array.isArray(columns)) {
    return new NextResponse("Invalid parameters", { status: 400 });
  }

  try {
    const columnAliases = columns.map(column => `${prefix}("${column}") as ${prefix}_${column}`).join(", ");
    let sql = `
      SELECT 
        year,
        ${columnAliases}
      FROM ${tableName}
      WHERE 1=1
    `;

    // Filter by selectedYear if provided
    if (selectedYear) {
      sql += ` AND year = ${selectedYear}`;
    }

    // Filter by selectedMonth if provided
    if (selectedMonth) {
      sql += ` AND month = ${selectedMonth}`;
    }

    sql += `
      GROUP BY year
      ORDER BY year;
    `;

    const result = await pool.query(sql);
    const data = result.rows;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
