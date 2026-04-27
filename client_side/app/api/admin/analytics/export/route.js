import { NextResponse } from 'next/server';
import pool from '@/lib/db';

function getDateRange(timeRange) {
  const end = new Date();
  const start = new Date();

  switch (timeRange) {
    case 'week':
      start.setDate(end.getDate() - 6);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
    default:
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  return { start, end };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'year';
    const format = searchParams.get('format') || 'csv';
    const { start, end } = getDateRange(timeRange);

    const connection = await pool.getConnection();

    try {
      const [users] = await connection.query(
        `SELECT 
          u.id,
          u.name,
          u.email,
          u.subscription_status,
          u.plan,
          u.created_at,
          SUM(CASE WHEN d.type = 'cv' THEN 1 ELSE 0 END) AS cvsCount,
          SUM(CASE WHEN d.type = 'motivation_letter' THEN 1 ELSE 0 END) AS lettersCount,
          COALESCE(SUM(d.downloads), 0) AS downloadsCount
         FROM users u
         LEFT JOIN documents d ON d.user_id = u.id
         WHERE u.created_at BETWEEN ? AND ?
         GROUP BY u.id, u.name, u.email, u.subscription_status, u.plan, u.created_at
         ORDER BY u.created_at DESC`,
        [start, end]
      );

      const [templates] = await connection.query(
        `SELECT template_name, COUNT(*) AS count
         FROM documents
         WHERE type = 'cv' AND created_at BETWEEN ? AND ?
         GROUP BY template_name
         ORDER BY count DESC`,
        [start, end]
      );

      const [[summary]] = await connection.query(
        `SELECT
          (SELECT COUNT(*) FROM users WHERE created_at BETWEEN ? AND ?) AS totalUsers,
          (SELECT COUNT(*) FROM users WHERE subscription_status = 'active') AS premiumUsers,
          (SELECT COALESCE(SUM(downloads), 0) FROM documents WHERE created_at BETWEEN ? AND ?) AS totalDownloads,
          (SELECT COUNT(*) FROM documents WHERE type = 'motivation_letter' AND created_at BETWEEN ? AND ?) AS totalLetters,
          (SELECT COALESCE(SUM(amount), 0) FROM premium_requests WHERE status = 'approved' AND created_at BETWEEN ? AND ?) AS totalRevenue`,
        [start, end, start, end, start, end, start, end]
      );

      if (format === 'json') {
        return NextResponse.json({
          timeRange,
          exportDate: new Date().toISOString(),
          summary,
          users,
          templateUsage: templates,
        });
      }

      const lines = [];
      lines.push('=== ANALYTICS SUMMARY ===');
      lines.push(`Time Range,${timeRange}`);
      lines.push(`Export Date,${new Date().toISOString()}`);
      lines.push(`Total Users,${summary.totalUsers}`);
      lines.push(`Premium Users,${summary.premiumUsers}`);
      lines.push(`Total Downloads,${summary.totalDownloads}`);
      lines.push(`Total Letters,${summary.totalLetters}`);
      lines.push(`Total Revenue,${summary.totalRevenue}`);
      lines.push('');
      lines.push('=== USERS ===');
      lines.push('ID,Name,Email,Premium,Plan,CVs,Letters,Downloads,Registered');

      users.forEach((u) => {
        lines.push(
          `${u.id},"${u.name || ''}","${u.email || ''}",${u.subscription_status === 'active'},${u.plan || ''},${Number(u.cvsCount || 0)},${Number(u.lettersCount || 0)},${Number(u.downloadsCount || 0)},${new Date(u.created_at).toISOString()}`
        );
      });

      lines.push('');
      lines.push('=== TEMPLATE USAGE ===');
      lines.push('Template,Count');

      templates.forEach((t) => {
        lines.push(`"${t.template_name || 'Unknown'}",${t.count}`);
      });

      return new NextResponse(lines.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics data', details: error.message },
      { status: 500 }
    );
  }
}