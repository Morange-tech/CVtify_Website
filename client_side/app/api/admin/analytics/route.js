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

function getLabels(timeRange) {
  switch (timeRange) {
    case 'week':
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    case 'month':
      return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    case 'quarter':
      return ['Month 1', 'Month 2', 'Month 3'];
    case 'year':
    default:
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }
}

function calcChange(current, previous) {
  if (!previous) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function buildMonthArray(rows, labelsLength, valueKey = 'count') {
  const arr = new Array(labelsLength).fill(0);
  rows.forEach((row) => {
    const idx = Number(row.month) - 1;
    if (idx >= 0 && idx < labelsLength) {
      arr[idx] = Number(row[valueKey] || 0);
    }
  });
  return arr;
}

function formatTimeAgo(dateValue) {
  const date = new Date(dateValue);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TEMPLATE_COLORS = {
  Modern: '#667eea',
  Professional: '#10b981',
  Creative: '#ec4899',
  Simple: '#f59e0b',
  Executive: '#8b5cf6',
  Academic: '#06b6d4',
  Minimalist: '#14b8a6',
  Bold: '#f43f5e',
};

const ACTIVITY_COLORS = {
  user: '#667eea',
  cv: '#10b981',
  premium: '#f59e0b',
  letter: '#ec4899',
  download: '#3b82f6',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'year';
    const { start, end } = getDateRange(timeRange);
    const labels = getLabels(timeRange);

    const periodMs = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - periodMs);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const connection = await pool.getConnection();

    try {
      const [[{ totalUsers }]] = await connection.query(
        `SELECT COUNT(*) AS totalUsers FROM users`
      );

      const [[{ premiumUsers }]] = await connection.query(
        `SELECT COUNT(*) AS premiumUsers
         FROM users
         WHERE subscription_status = 'active'`
      );

      const [[{ totalCvs }]] = await connection.query(
        `SELECT COUNT(*) AS totalCvs
         FROM documents
         WHERE type = 'cv'`
      );

      const [[{ totalLetters }]] = await connection.query(
        `SELECT COUNT(*) AS totalLetters
         FROM documents
         WHERE type = 'motivation_letter'`
      );

      const [[{ totalDownloads }]] = await connection.query(
        `SELECT COALESCE(SUM(downloads), 0) AS totalDownloads
         FROM documents`
      );

      const [[{ totalRevenue }]] = await connection.query(
        `SELECT COALESCE(SUM(amount), 0) AS totalRevenue
         FROM premium_requests
         WHERE status = 'approved'`
      );

      const [[{ currentPeriodUsers }]] = await connection.query(
        `SELECT COUNT(*) AS currentPeriodUsers
         FROM users
         WHERE created_at BETWEEN ? AND ?`,
        [start, end]
      );

      const [[{ prevPeriodUsers }]] = await connection.query(
        `SELECT COUNT(*) AS prevPeriodUsers
         FROM users
         WHERE created_at BETWEEN ? AND ?`,
        [prevStart, start]
      );

      const [[{ currentPeriodPremium }]] = await connection.query(
        `SELECT COUNT(*) AS currentPeriodPremium
         FROM users
         WHERE subscription_status = 'active'
         AND updated_at BETWEEN ? AND ?`,
        [start, end]
      );

      const [[{ prevPeriodPremium }]] = await connection.query(
        `SELECT COUNT(*) AS prevPeriodPremium
         FROM users
         WHERE subscription_status = 'active'
         AND updated_at BETWEEN ? AND ?`,
        [prevStart, start]
      );

      const [[{ currentPeriodCvs }]] = await connection.query(
        `SELECT COUNT(*) AS currentPeriodCvs
         FROM documents
         WHERE type = 'cv' AND created_at BETWEEN ? AND ?`,
        [start, end]
      );

      const [[{ prevPeriodCvs }]] = await connection.query(
        `SELECT COUNT(*) AS prevPeriodCvs
         FROM documents
         WHERE type = 'cv' AND created_at BETWEEN ? AND ?`,
        [prevStart, start]
      );

      const [[{ currentPeriodLetters }]] = await connection.query(
        `SELECT COUNT(*) AS currentPeriodLetters
         FROM documents
         WHERE type = 'motivation_letter' AND created_at BETWEEN ? AND ?`,
        [start, end]
      );

      const [[{ prevPeriodLetters }]] = await connection.query(
        `SELECT COUNT(*) AS prevPeriodLetters
         FROM documents
         WHERE type = 'motivation_letter' AND created_at BETWEEN ? AND ?`,
        [prevStart, start]
      );

      const [[{ currentPeriodDownloads }]] = await connection.query(
        `SELECT COALESCE(SUM(downloads), 0) AS currentPeriodDownloads
         FROM documents
         WHERE created_at BETWEEN ? AND ?`,
        [start, end]
      );

      const [[{ prevPeriodDownloads }]] = await connection.query(
        `SELECT COALESCE(SUM(downloads), 0) AS prevPeriodDownloads
         FROM documents
         WHERE created_at BETWEEN ? AND ?`,
        [prevStart, start]
      );

      const [[{ currentPeriodRevenue }]] = await connection.query(
        `SELECT COALESCE(SUM(amount), 0) AS currentPeriodRevenue
         FROM premium_requests
         WHERE status = 'approved' AND created_at BETWEEN ? AND ?`,
        [start, end]
      );

      const [[{ prevPeriodRevenue }]] = await connection.query(
        `SELECT COALESCE(SUM(amount), 0) AS prevPeriodRevenue
         FROM premium_requests
         WHERE status = 'approved' AND created_at BETWEEN ? AND ?`,
        [prevStart, start]
      );

      const [monthlyUserGrowth] = await connection.query(
        `SELECT MONTH(created_at) AS month, COUNT(*) AS count
         FROM users
         WHERE created_at BETWEEN ? AND ?
         GROUP BY MONTH(created_at)
         ORDER BY MONTH(created_at)`,
        [start, end]
      );

      const [monthlyPremiumGrowth] = await connection.query(
        `SELECT MONTH(updated_at) AS month, COUNT(*) AS count
         FROM users
         WHERE subscription_status = 'active'
           AND updated_at BETWEEN ? AND ?
         GROUP BY MONTH(updated_at)
         ORDER BY MONTH(updated_at)`,
        [start, end]
      );

      const [monthlyCvData] = await connection.query(
        `SELECT MONTH(created_at) AS month, COUNT(*) AS count
         FROM documents
         WHERE type = 'cv' AND created_at BETWEEN ? AND ?
         GROUP BY MONTH(created_at)
         ORDER BY MONTH(created_at)`,
        [start, end]
      );

      const [monthlyLetterCreated] = await connection.query(
        `SELECT MONTH(created_at) AS month, COUNT(*) AS count
         FROM documents
         WHERE type = 'motivation_letter' AND created_at BETWEEN ? AND ?
         GROUP BY MONTH(created_at)
         ORDER BY MONTH(created_at)`,
        [start, end]
      );

      const [monthlyLetterDownloaded] = await connection.query(
        `SELECT MONTH(created_at) AS month, COALESCE(SUM(downloads), 0) AS count
         FROM documents
         WHERE type = 'motivation_letter' AND created_at BETWEEN ? AND ?
         GROUP BY MONTH(created_at)
         ORDER BY MONTH(created_at)`,
        [start, end]
      );

      const [monthlyRevenue] = await connection.query(
        `SELECT MONTH(created_at) AS month, COALESCE(SUM(amount), 0) AS total
         FROM premium_requests
         WHERE status = 'approved' AND created_at BETWEEN ? AND ?
         GROUP BY MONTH(created_at)
         ORDER BY MONTH(created_at)`,
        [start, end]
      );

      const [weeklyCvRows] = await connection.query(
        `SELECT DAYOFWEEK(created_at) AS day_of_week, COUNT(*) AS count
         FROM documents
         WHERE type = 'cv' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DAYOFWEEK(created_at)
         ORDER BY DAYOFWEEK(created_at)`
      );

      const [weeklyDownloadRows] = await connection.query(
        `SELECT DAYOFWEEK(created_at) AS day_of_week, COALESCE(SUM(downloads), 0) AS count
         FROM documents
         WHERE type = 'cv' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DAYOFWEEK(created_at)
         ORDER BY DAYOFWEEK(created_at)`
      );

      const buildWeeklyArray = (rows) => {
        const arr = new Array(7).fill(0);
        rows.forEach((row) => {
          const dow = Number(row.day_of_week);
          // MySQL DAYOFWEEK: 1=Sunday ... 7=Saturday
          const idx = dow === 1 ? 6 : dow - 2;
          if (idx >= 0 && idx < 7) {
            arr[idx] = Number(row.count || 0);
          }
        });
        return arr;
      };

      const [templateUsageRows] = await connection.query(
        `SELECT template_name AS name, COUNT(*) AS count
         FROM documents
         WHERE type = 'cv' AND template_name IS NOT NULL AND template_name != ''
         GROUP BY template_name
         ORDER BY count DESC
         LIMIT 10`
      );

      const [recentActivityRows] = await connection.query(
        `SELECT al.type, al.description, al.created_at, u.name
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         ORDER BY al.created_at DESC
         LIMIT 8`
      );

      const [[{ todayUsers }]] = await connection.query(
        `SELECT COUNT(*) AS todayUsers
         FROM users
         WHERE created_at >= ?`,
        [todayStart]
      );

      const [[{ todayCvs }]] = await connection.query(
        `SELECT COUNT(*) AS todayCvs
         FROM documents
         WHERE type = 'cv' AND created_at >= ?`,
        [todayStart]
      );

      const [[{ todayLetters }]] = await connection.query(
        `SELECT COUNT(*) AS todayLetters
         FROM documents
         WHERE type = 'motivation_letter' AND created_at >= ?`,
        [todayStart]
      );

      const [[{ todayCvsDownloaded }]] = await connection.query(
        `SELECT COALESCE(SUM(downloads), 0) AS todayCvsDownloaded
         FROM documents
         WHERE type = 'cv' AND created_at >= ?`,
        [todayStart]
      );

      const [[{ todayLettersDownloaded }]] = await connection.query(
        `SELECT COALESCE(SUM(downloads), 0) AS todayLettersDownloaded
         FROM documents
         WHERE type = 'motivation_letter' AND created_at >= ?`,
        [todayStart]
      );

      const [[{ todayRevenue }]] = await connection.query(
        `SELECT COALESCE(SUM(amount), 0) AS todayRevenue
         FROM premium_requests
         WHERE status = 'approved' AND created_at >= ?`,
        [todayStart]
      );

      const [[{ todayPremiums }]] = await connection.query(
        `SELECT COUNT(*) AS todayPremiums
         FROM premium_requests
         WHERE status = 'approved' AND created_at >= ?`,
        [todayStart]
      );

      const [[{ yesterdayUsers }]] = await connection.query(
        `SELECT COUNT(*) AS yesterdayUsers
         FROM users
         WHERE created_at >= ? AND created_at < ?`,
        [yesterdayStart, todayStart]
      );

      const [[{ thisMonthCvs }]] = await connection.query(
        `SELECT COUNT(*) AS thisMonthCvs
         FROM documents
         WHERE type = 'cv' AND created_at >= ?`,
        [monthStart]
      );

      const [[{ thisMonthLetters }]] = await connection.query(
        `SELECT COUNT(*) AS thisMonthLetters
         FROM documents
         WHERE type = 'motivation_letter' AND created_at >= ?`,
        [monthStart]
      );

      const [[{ usersWithCv }]] = await connection.query(
        `SELECT COUNT(DISTINCT user_id) AS usersWithCv
         FROM documents
         WHERE type = 'cv'`
      );

      const [[{ usersWithDownload }]] = await connection.query(
        `SELECT COUNT(DISTINCT user_id) AS usersWithDownload
         FROM documents
         WHERE downloads > 0`
      );

      const [[{ activeUsers }]] = await connection.query(
        `SELECT COUNT(DISTINCT user_id) AS activeUsers
         FROM documents
         WHERE created_at >= ?`,
        [last30Days]
      );

      const [[{ usersOlderThan30Days }]] = await connection.query(
        `SELECT COUNT(*) AS usersOlderThan30Days
         FROM users
         WHERE created_at <= ?`,
        [last30Days]
      );

      const [[{ retainedUsers }]] = await connection.query(
        `SELECT COUNT(DISTINCT d.user_id) AS retainedUsers
         FROM documents d
         INNER JOIN users u ON d.user_id = u.id
         WHERE u.created_at <= ? AND d.created_at >= ?`,
        [last30Days, last30Days]
      );

      const totalTemplateCount =
        templateUsageRows.reduce((sum, row) => sum + Number(row.count || 0), 0) || 1;

      const templateUsage = templateUsageRows.map((row) => ({
        name: row.name || 'Unknown',
        value: Math.round((Number(row.count) / totalTemplateCount) * 100),
        color: TEMPLATE_COLORS[row.name] || '#94a3b8',
      }));

      const topTemplates = templateUsageRows.slice(0, 5).map((row) => ({
        name: row.name || 'Unknown',
        uses: Number(row.count || 0),
        growth: 0,
        color: TEMPLATE_COLORS[row.name] || '#94a3b8',
      }));

      const recentActivity = recentActivityRows.map((row) => {
        const lowerType = String(row.type || '').toLowerCase();

        let mappedType = 'user';
        if (lowerType.includes('cv') || lowerType.includes('document')) mappedType = 'cv';
        if (lowerType.includes('premium') || lowerType.includes('subscription')) mappedType = 'premium';
        if (lowerType.includes('letter') || lowerType.includes('motivation')) mappedType = 'letter';
        if (lowerType.includes('download') || lowerType.includes('view')) mappedType = 'download';

        return {
          type: mappedType,
          text: row.description || `${row.name || 'User'} activity`,
          time: formatTimeAgo(row.created_at),
          color: ACTIVITY_COLORS[mappedType] || '#94a3b8',
        };
      });

      const premiumPercentage =
        Number(totalUsers) > 0
          ? Math.round((Number(premiumUsers) / Number(totalUsers)) * 1000) / 10
          : 0;

      const avgCvsPerUser =
        Number(totalUsers) > 0
          ? Math.round((Number(totalCvs) / Number(totalUsers)) * 10) / 10
          : 0;

      const downloadRate =
        Number(totalCvs) > 0
          ? Math.round((Number(totalDownloads) / Number(totalCvs)) * 100)
          : 0;

      const avgRevenuePerUser =
        Number(premiumUsers) > 0
          ? Math.round(Number(totalRevenue) / Number(premiumUsers))
          : 0;

      const lettersPerUser =
        Number(totalUsers) > 0
          ? Math.round((Number(totalLetters) / Number(totalUsers)) * 10) / 10
          : 0;

      const monthlyGrowthRate = calcChange(Number(currentPeriodUsers), Number(prevPeriodUsers));

      const activeRate =
        Number(totalUsers) > 0
          ? Math.round((Number(activeUsers) / Number(totalUsers)) * 100)
          : 0;

      const retentionRate =
        Number(usersOlderThan30Days) > 0
          ? Math.round((Number(retainedUsers) / Number(usersOlderThan30Days)) * 100)
          : 0;

      const keyMetrics = [
        { label: 'Avg CVs / User', value: String(avgCvsPerUser), color: '#10b981' },
        { label: 'Premium Rate', value: `${premiumPercentage}%`, color: '#f59e0b' },
        { label: 'Download Rate', value: `${downloadRate}%`, color: '#3b82f6' },
        { label: 'Avg Revenue / User', value: `$${avgRevenuePerUser}`, color: '#10b981' },
        { label: 'Letter / User', value: String(lettersPerUser), color: '#ec4899' },
        {
          label: 'Monthly Growth',
          value: `${monthlyGrowthRate >= 0 ? '+' : ''}${monthlyGrowthRate}%`,
          color: '#667eea',
        },
        { label: 'Active Rate', value: `${activeRate}%`, color: '#8b5cf6' },
        { label: 'Retention', value: `${retentionRate}%`, color: '#f59e0b' },
      ];

      const visitors = Number(totalUsers) * 8;

      const response = {
        summary: {
          totalUsers: Number(totalUsers),
          premiumUsers: Number(premiumUsers),
          totalCvs: Number(totalCvs),
          totalLetters: Number(totalLetters),
          totalDownloads: Number(totalDownloads),
          totalRevenue: Number(totalRevenue),
          totalUsersChange: calcChange(Number(currentPeriodUsers), Number(prevPeriodUsers)),
          premiumUsersChange: calcChange(Number(currentPeriodPremium), Number(prevPeriodPremium)),
          totalCvsChange: calcChange(Number(currentPeriodCvs), Number(prevPeriodCvs)),
          totalLettersChange: calcChange(Number(currentPeriodLetters), Number(prevPeriodLetters)),
          totalDownloadsChange: calcChange(Number(currentPeriodDownloads), Number(prevPeriodDownloads)),
          totalRevenueChange: calcChange(Number(currentPeriodRevenue), Number(prevPeriodRevenue)),
          cvsThisMonth: Number(thisMonthCvs),
          lettersThisMonth: Number(thisMonthLetters),
          premiumPercentage,
        },

        userGrowth: {
          labels,
          totalUsers: buildMonthArray(monthlyUserGrowth, labels.length, 'count'),
          premiumUsers: buildMonthArray(monthlyPremiumGrowth, labels.length, 'count'),
        },

        cvWeekly: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          cvs: buildWeeklyArray(weeklyCvRows),
          downloads: buildWeeklyArray(weeklyDownloadRows),
        },

        cvMonthly: {
          labels,
          cvs: buildMonthArray(monthlyCvData, labels.length, 'count'),
        },

        letters: {
          labels,
          created: buildMonthArray(monthlyLetterCreated, labels.length, 'count'),
          downloaded: buildMonthArray(monthlyLetterDownloaded, labels.length, 'count'),
        },

        revenue: {
          labels,
          revenue: buildMonthArray(monthlyRevenue, labels.length, 'total'),
        },

        templateUsage,
        topTemplates,
        recentActivity,

        conversionFunnel: [
          {
            label: 'Visitors',
            value: visitors,
            percentage: 100,
            color: '#94a3b8',
          },
          {
            label: 'Registered Users',
            value: Number(totalUsers),
            percentage: Math.round((Number(totalUsers) / Math.max(visitors, 1)) * 1000) / 10,
            color: '#667eea',
          },
          {
            label: 'Created CV',
            value: Number(usersWithCv),
            percentage: Math.round((Number(usersWithCv) / Math.max(Number(totalUsers), 1)) * 1000) / 10,
            color: '#10b981',
          },
          {
            label: 'Downloaded CV',
            value: Number(usersWithDownload),
            percentage: Math.round((Number(usersWithDownload) / Math.max(Number(usersWithCv), 1)) * 1000) / 10,
            color: '#3b82f6',
          },
          {
            label: 'Upgraded to Premium',
            value: Number(premiumUsers),
            percentage: Math.round((Number(premiumUsers) / Math.max(Number(usersWithDownload), 1)) * 1000) / 10,
            color: '#f59e0b',
          },
        ],

        keyMetrics,

        todayStats: {
          newUsers: Number(todayUsers),
          newUsersDiff: `${Number(todayUsers) >= Number(yesterdayUsers) ? '+' : ''}${Number(todayUsers) - Number(yesterdayUsers)} vs yesterday`,
          cvsCreated: Number(todayCvs),
          cvsDownloaded: Number(todayCvsDownloaded),
          lettersCreated: Number(todayLetters),
          lettersDownloaded: Number(todayLettersDownloaded),
          revenueToday: Number(todayRevenue),
          newPremiums: Number(todayPremiums),
        },
      };

      return NextResponse.json(response, {
        headers: {
          'Cache-Control': 'private, max-age=60',
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}