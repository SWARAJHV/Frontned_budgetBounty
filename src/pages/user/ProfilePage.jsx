// import React, { useEffect, useMemo, useState } from 'react';
// import { Bar, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement,
// } from 'chart.js';
// import api from '../../api/client';
// import { normalize } from '../../utils/data';
// import './ProfilePage.css';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   PointElement,
//   LineElement
// );

// const SUCCESS_SPEND_STATUSES = new Set(['SUCCESS']);

// // ----- helpers -----
// const fmtPts = (v) => {
//   const n = Number(v) || 0;
//   if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
//   if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
//   return String(n);
// };

// const monthNames = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ];

// const toYMD = (d) => {
//   const dt = new Date(d);
//   if (isNaN(dt)) return null;
//   return dt.toISOString().slice(0,10);
// };

// const isWithinNDays = (dateStr, n) => {
//   const dt = new Date(dateStr);
//   if (isNaN(dt)) return false;
//   const now = new Date();
//   const diff = (now - dt) / (1000*60*60*24);
//   return diff >= 0 && diff < n;
// };

// export default function ProfilePage({ user }) {
//   const [currentPoints, setCurrentPoints] = useState(0);
//   const [rewards, setRewards] = useState([]);        // earned rows
//   const [redemptions, setRedemptions] = useState([]); // spent rows
//   const [loading, setLoading] = useState(true);

//   // controls
//   const [metric, setMetric] = useState('compare'); // 'earned' | 'spent' | 'net' | 'compare'
//   const [range, setRange] = useState('7d');        // '7d' | '30d' | 'year'

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         if (!user?.id) return;

//         // current points
//         const userRes = await api.get('/users', { params: { id: user.id } });
//         const userList = normalize(userRes.data);
//         if (mounted && userList.length > 0) {
//           setCurrentPoints(Number(userList[0].points) || 0);
//         }

//         // earned + spent
//         const [rewardsRes, redemptionsRes] = await Promise.all([
//           api.get(`/rewards/user/${user.id}`),
//           api.get(`/redemptions/user/${user.id}`),
//         ]);

//         const earnedRows = Array.isArray(rewardsRes.data)
//           ? rewardsRes.data
//           : rewardsRes.data.content || [];

//         const spentRows = Array.isArray(redemptionsRes.data)
//           ? redemptionsRes.data
//           : redemptionsRes.data.content || [];

//         if (mounted) {
//           setRewards(earnedRows);
//           setRedemptions(spentRows);
//         }
//       } catch (e) {
//         console.error('Failed to load profile data:', e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };
//     load();
//     return () => { mounted = false; };
//   }, [user?.id]);

//   // ====== Series builders ======
//   // 1) Daily series for 7/30 days
//   const makeDailyBuckets = (days) => {
//     const labels = [...Array(days)].map((_, i) => {
//       const d = new Date();
//       d.setDate(d.getDate() - (days - 1 - i));
//       return d.toISOString().slice(0,10);
//     });
//     const earnedMap = {};
//     rewards.forEach(r => {
//       const key = toYMD(r.earnedAt || r.earned_at);
//       if (!key || !isWithinNDays(key, days)) return;
//       earnedMap[key] = (earnedMap[key] || 0) + Number(r.points || 0);
//     });
//     const spentMap = {};
//     redemptions.forEach(r => {
//       const key = toYMD(r.redeemedAt || r.redeemed_at);
//       if (!key || !isWithinNDays(key, days)) return;
//       if (SUCCESS_SPEND_STATUSES.has(r.status || '')) {
//         spentMap[key] = (spentMap[key] || 0) + Number(r.pointsSpent || 0);
//       }
//     });
//     const earned = labels.map(d => earnedMap[d] || 0);
//     const spent  = labels.map(d => spentMap[d] || 0);
//     return { labels: labels.map(d => d.slice(5)), earned, spent, net: earned.map((v,i)=>v-spent[i]) };
//   };

//   // 2) Monthly series (this calendar year)
//   const makeMonthlyBuckets = () => {
//     const year = new Date().getFullYear();
//     const labels = monthNames;
//     const e = Array(12).fill(0);
//     const s = Array(12).fill(0);

//     rewards.forEach(r => {
//       const dt = new Date(r.earnedAt || r.earned_at);
//       if (isNaN(dt) || dt.getFullYear() !== year) return;
//       e[dt.getMonth()] += Number(r.points || 0);
//     });
//     redemptions.forEach(r => {
//       const dt = new Date(r.redeemedAt || r.redeemed_at);
//       if (isNaN(dt) || dt.getFullYear() !== year) return;
//       if (SUCCESS_SPEND_STATUSES.has(r.status || '')) {
//         s[dt.getMonth()] += Number(r.pointsSpent || 0);
//       }
//     });
//     return { labels, earned: e, spent: s, net: e.map((v,i)=>v-s[i]) };
//   };

//   const series = useMemo(() => {
//     if (range === '7d') return makeDailyBuckets(7);
//     if (range === '30d') return makeDailyBuckets(30);
//     return makeMonthlyBuckets();
//   }, [rewards, redemptions, range]);

//   // choose chart type: daily -> line, monthly -> bar
//   const useBar = range === 'year';

//   // datasets based on metric
//   const datasets = useMemo(() => {
//     const base = [];
//     const add = (label, data, colorRGB, dashed=false) => base.push({
//       label,
//       data,
//       borderColor: `rgba(${colorRGB},1)`,
//       backgroundColor: useBar ? `rgba(${colorRGB},0.7)` : `rgba(${colorRGB},0.2)`,
//       fill: !useBar,
//       borderDash: dashed ? [6,6] : undefined,
//       tension: 0.3,
//       borderWidth: 2
//     });

//     if (metric === 'earned') add('Earned', series.earned, '34,197,94');           // green
//     else if (metric === 'spent') add('Spent', series.spent, '239,68,68');        // red
//     else if (metric === 'net') add('Net', series.net, '168,85,247', true);       // purple
//     else { // compare
//       add('Earned', series.earned, '34,197,94');
//       add('Spent', series.spent, '239,68,68');
//     }
//     return base;
//   }, [metric, series, useBar]);

//   // ====== Axis with custom ticks: 20, 50, 100, 200, 500, 1000 (and more if needed) ======
//   const fixedTicks = [20, 50, 100, 200, 500, 1000];
//   const maxData = Math.max(
//     ...datasets.flatMap(d => d.data),
//     0
//   );
//   const yMax = Math.max(1000, Math.ceil(maxData / 100) * 100); // allow > 1000 if needed
//   const tickVals = fixedTicks.filter(t => t <= yMax);
//   if (yMax > 1000) {
//     // extend by 1500, 2000, 3000, 5000 steps if needed
//     const extras = [1500, 2000, 3000, 5000, 10000].filter(v => v <= yMax);
//     tickVals.push(...extras);
//   }

//   const commonOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: 'top' },
//       title: {
//         display: true,
//         text:
//           metric === 'compare'
//             ? (useBar ? 'Monthly Earned vs Spent' : 'Earned vs Spent')
//             : `${metric[0].toUpperCase()+metric.slice(1)} Points`,
//       },
//       tooltip: {
//         callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtPts(ctx.parsed.y)} pts` },
//       },
//     },
// scales: {
//   y: {
//     beginAtZero: true,
//     suggestedMax: yMax,
//     ticks: {
//       stepSize: yMax <= 1000 ? 100 : 200,   // ✅ even spacing
//       callback: (v) => fmtPts(v),
//     },
//   },
// },

//   };

//   const chartData = {
//     labels: series.labels,
//     datasets
//   };

//   return (
//     <div className="profile-page">
//       <h1>Profile - {user?.name || user?.email || 'User'}</h1>

//       <div className="points-summary">
//         <div className="points-label">Your Current Balance</div>
//         <div className="points-total">
//           {loading ? 'Loading...' : currentPoints.toLocaleString()} pts
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="chart-controls">
//         <div className="control">
//           <label htmlFor="metric">What to plot</label>
//           <select id="metric" value={metric} onChange={(e)=>setMetric(e.target.value)}>
//             <option value="compare">Earned vs Spent</option>
//             <option value="earned">Earned only</option>
//             <option value="spent">Spent only</option>
//             <option value="net">Net (Earned - Spent)</option>
//           </select>
//         </div>

//         <div className="control">
//           <label htmlFor="range">Time range</label>
//           <select id="range" value={range} onChange={(e)=>setRange(e.target.value)}>
//             <option value="7d">Last 7 days</option>
//             <option value="30d">Last 30 days</option>
//             <option value="year">This year (by month)</option>
//           </select>
//         </div>
//       </div>

//       {/* Single smart chart */}
//       <div className="chart-container" style={{ minHeight: 500 }}>
//         {useBar
//           ? <Bar data={chartData} options={commonOptions} />
//           : <Line data={chartData} options={commonOptions} />
//         }
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../api/client';
import { normalize } from '../../utils/data';
import './ProfilePage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SUCCESS_SPEND_STATUSES = new Set(['SUCCESS']);

// ---------- helpers ----------
const fmtPts = (v) => {
  const n = Number(v) || 0;
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
  return String(n);
};

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const toYMD = (d) => {
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  return dt.toISOString().slice(0,10);
};

const isWithinNDays = (dateStr, n) => {
  const dt = new Date(dateStr);
  if (isNaN(dt)) return false;
  const now = new Date();
  const diff = (now - dt) / (1000*60*60*24);
  return diff >= 0 && diff < n;
};

export default function ProfilePage({ user }) {
  const [currentPoints, setCurrentPoints] = useState(0);   // will be computed client-side
  const [displayUser, setDisplayUser] = useState(null);    // for name/email only
  const [rewards, setRewards] = useState([]);              // earned rows
  const [redemptions, setRedemptions] = useState([]);      // spent rows
  const [loading, setLoading] = useState(true);

  // controls
  const [metric, setMetric] = useState('compare'); // 'earned' | 'spent' | 'net' | 'compare'
  const [range, setRange] = useState('30d');       // '7d' | '30d' | 'year'

  // Load data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        if (!user?.id) return;

        // we still fetch /users for email/name, but we won't trust its points field
        const userRes = await api.get('/users', { params: { id: user.id } });
        const list = normalize(userRes.data);
        if (mounted && list.length > 0) {
          setDisplayUser(list[0]); // has email/name
        }

        const [rewardsRes, redemptionsRes] = await Promise.all([
          api.get(`/rewards/user/${user.id}`),
          api.get(`/redemptions/user/${user.id}`),
        ]);

        const earnedRows = Array.isArray(rewardsRes.data)
          ? rewardsRes.data
          : rewardsRes.data?.content || [];

        const spentRows = Array.isArray(redemptionsRes.data)
          ? redemptionsRes.data
          : redemptionsRes.data?.content || [];

        if (mounted) {
          setRewards(earnedRows);
          setRedemptions(spentRows);
        }
      } catch (e) {
        console.error('Failed to load profile data:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user?.id]);

  // Compute current balance on the client so the card is always correct
  useEffect(() => {
    if (loading) return;
    const earned = rewards.reduce((s, r) => s + (Number(r.points) || 0), 0);
    const spent = redemptions
      .filter(r => SUCCESS_SPEND_STATUSES.has((r.status || '').toUpperCase()))
      .reduce((s, r) => s + (Number(r.pointsSpent) || 0), 0);
    setCurrentPoints(Math.max(0, earned - spent));
  }, [loading, rewards, redemptions]);

  // ====== Series builders ======
  // 1) Daily buckets for 7/30 days
  const makeDailyBuckets = (days) => {
    const labels = [...Array(days)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return d.toISOString().slice(0,10);
    });
    const earnedMap = {};
    rewards.forEach(r => {
      const key = toYMD(r.earnedAt || r.earned_at);
      if (!key || !isWithinNDays(key, days)) return;
      earnedMap[key] = (earnedMap[key] || 0) + Number(r.points || 0);
    });
    const spentMap = {};
    redemptions.forEach(r => {
      const key = toYMD(r.redeemedAt || r.redeemed_at);
      if (!key || !isWithinNDays(key, days)) return;
      if (SUCCESS_SPEND_STATUSES.has((r.status || '').toUpperCase())) {
        spentMap[key] = (spentMap[key] || 0) + Number(r.pointsSpent || 0);
      }
    });
    const earned = labels.map(d => earnedMap[d] || 0);
    const spent  = labels.map(d => spentMap[d] || 0);
    return { labels: labels.map(d => d.slice(5)), earned, spent, net: earned.map((v,i)=>v-spent[i]) };
  };

  // 2) Monthly buckets (this calendar year)
  const makeMonthlyBuckets = () => {
    const year = new Date().getFullYear();
    const labels = monthNames;
    const e = Array(12).fill(0);
    const s = Array(12).fill(0);

    rewards.forEach(r => {
      const dt = new Date(r.earnedAt || r.earned_at);
      if (isNaN(dt) || dt.getFullYear() !== year) return;
      e[dt.getMonth()] += Number(r.points || 0);
    });
    redemptions.forEach(r => {
      const dt = new Date(r.redeemedAt || r.redeemed_at);
      if (isNaN(dt) || dt.getFullYear() !== year) return;
      if (SUCCESS_SPEND_STATUSES.has((r.status || '').toUpperCase())) {
        s[dt.getMonth()] += Number(r.pointsSpent || 0);
      }
    });
    return { labels, earned: e, spent: s, net: e.map((v,i)=>v-s[i]) };
  };

  const series = useMemo(() => {
    if (range === '7d') return makeDailyBuckets(7);
    if (range === '30d') return makeDailyBuckets(30);
    return makeMonthlyBuckets();
  }, [rewards, redemptions, range]);

  // datasets (bars in all cases)
  const datasets = useMemo(() => {
    const base = [];
    const add = (label, data, colorRGB) => base.push({
      label,
      data,
      backgroundColor: `rgba(${colorRGB},0.7)`,
      borderColor: `rgba(${colorRGB},1)`,
      borderWidth: 1,
      barThickness: 'flex',
      maxBarThickness: 24,
      categoryPercentage: 0.7,
      barPercentage: 0.9
    });

    if (metric === 'earned') add('Earned', series.earned, '34,197,94');           // green
    else if (metric === 'spent') add('Spent', series.spent, '239,68,68');        // red
    else if (metric === 'net') add('Net', series.net, '168,85,247');             // purple
    else { // compare
      add('Earned', series.earned, '34,197,94');
      add('Spent', series.spent, '239,68,68');
    }
    return base;
  }, [metric, series]);

  // axis ticks (even-ish)
  const maxData = Math.max(...datasets.flatMap(d => d.data), 0);
  const yMax = Math.max(1000, Math.ceil(maxData / 100) * 100);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text:
          metric === 'compare'
            ? (range === 'year' ? 'Monthly Earned vs Spent' : 'Earned vs Spent')
            : `${metric[0].toUpperCase()+metric.slice(1)} Points`,
      },
      tooltip: {
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${fmtPts(ctx.parsed.y)} pts` },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(0,0,0,0.06)' } },
      y: {
        beginAtZero: true,
        suggestedMax: yMax,
        ticks: {
          stepSize: yMax <= 1000 ? 100 : 200,
          callback: (v) => fmtPts(v),
        },
        grid: { color: 'rgba(0,0,0,0.08)' }
      },
    },
  };

  const chartData = { labels: series.labels, datasets };

  return (
    <div className="profile-page">
      <h1>Profile - {displayUser?.name || user?.name || displayUser?.email || user?.email || 'User'}</h1>

      <div className="points-summary">
        <div className="points-label">Your Current Balance</div>
        <div className="points-total">
          {loading ? 'Loading...' : currentPoints.toLocaleString()} pts
        </div>
      </div>

      {/* Controls */}
      <div className="chart-controls">
        <div className="control">
          <label htmlFor="metric">What to plot</label>
          <select id="metric" value={metric} onChange={(e)=>setMetric(e.target.value)}>
            <option value="compare">Earned vs Spent</option>
            <option value="earned">Earned only</option>
            <option value="spent">Spent only</option>
            <option value="net">Net (Earned - Spent)</option>
          </select>
        </div>

        <div className="control">
          <label htmlFor="range">Time range</label>
          <select id="range" value={range} onChange={(e)=>setRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="year">This year (by month)</option>
          </select>
        </div>
      </div>

      {/* Single rectangular (bar) chart */}
      <div className="chart-container" style={{ minHeight: 500 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
