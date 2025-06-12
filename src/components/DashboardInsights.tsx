import { useEffect, useState, useMemo } from 'react';
import { ref, onValue } from "firebase/database";
import { database, auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import DashboardHeader from './DashboardHeader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import './DashboardInsights.css';
import VouchersTable from './VouchersTable';

interface VoucherData {
  id: string;
  credencial: string;
  date: string;
  name: string;
  number: string;
  voucher_id: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const formatPhoneNumber = (raw: string): string => {
  const match = raw.match(/^55(\d{2})(\d+)\@c\.us$/);
  if (!match) return raw;
  const [, ddd, num] = match;
  return `(${ddd}) ${num}`;
};

function DashboardInsights() {
  const [data, setData] = useState<VoucherData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, loadingAuth, authError] = useAuthState(auth);

  useEffect(() => {
    setLoadingData(true);
    const dbRef = ref(database, 'vouchers');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();
        const formattedData: VoucherData[] = Object.keys(rawData).map(key => ({
          id: key,
          ...rawData[key]
        }));
        setData(formattedData);
      } else {
        setData([]);
      }
      setLoadingData(false);
    }, 
    (error) => {
      setError(`Falha ao carregar dados em tempo real: ${error.message}`);
      setLoadingData(false);
    });

    return () => {
      unsubscribe();
    };
  }, []); 

  const vouchersToday = useMemo(() => {
    if (!data.length) return 0;
    const todayString = new Date().toLocaleDateString('pt-BR');
    return data.filter(item => item.date.startsWith(todayString)).length;
  }, [data]);

  const sortedData = useMemo(() => {
    const dataCopy = [...data];

    const parseUniversalDate = (dateString: string): Date => {
      if (typeof dateString === 'string' && /^\d{2}\/\d{2}\/\d{4}/.test(dateString)) {
        const dateParts = dateString.split(',');
        const [day, month, year] = dateParts[0].trim().split('/');
        if (day && month && year) {
          const timeParts = dateParts[1] ? dateParts[1].trim().split(':') : ['0', '0', '0'];
          const hours = parseInt(timeParts[0] || '0', 10);
          const minutes = parseInt(timeParts[1] || '0', 10);
          const seconds = parseInt(timeParts[2] || '0', 10);
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, minutes, seconds);
        }
      }
      const standardDate = new Date(dateString);
      if (!isNaN(standardDate.getTime())) {
        return standardDate;
      }
      return new Date(0); 
    };

    dataCopy.sort((a, b) => {
      const dateA = parseUniversalDate(a.date);
      const dateB = parseUniversalDate(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return dataCopy;
  }, [data]);

  const uniqueUsers = useMemo(() => {
    if (!data.length) return 0;
    const userSet = new Set(data.map(item => item.number));
    return userSet.size;
  }, [data]);

  const vouchersPerDay = useMemo(() => {
    const counts: { [key: string]: number } = {};
    data.forEach(item => {
      const day = item.date.split(',')[0];
      counts[day] = (counts[day] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([day, count]) => ({ day, count }))
      .sort((a, b) => {
        const [dA, mA, yA] = a.day.split('/').map(Number);
        const [dB, mB, yB] = b.day.split('/').map(Number);
        return new Date(yA, mA - 1, dA).getTime() - new Date(yB, mB - 1, dB).getTime();
      });
  }, [data]);

  const topUsers = useMemo(() => {
    const counts: { [key: string]: number } = {};
    data.forEach(item => {
      counts[item.number] = (counts[item.number] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([number, count]) => ({
        number: formatPhoneNumber(number),
        count
      })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [data]);

  const vouchersByDDD = useMemo(() => {
    const counts: { [ddd: string]: number } = {};
    data.forEach(item => {
      const clean = item.number.replace(/\D/g, ''); 
      if (clean.length >= 4) {
        const ddd = clean.slice(2, 4);
        counts[ddd] = (counts[ddd] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([ddd, count]) => ({ ddd: `(${ddd})`, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const handleLogout = () => {
    signOut(auth).catch(error => {});
  };

  if (loadingData || loadingAuth) return <p className="loading-message">Carregando dashboard...</p>;
  if (error || authError) return <p className="error-message">Erro: {error || authError?.message}</p>;

  return (
    <div className="dashboard-container has-header">
      <DashboardHeader
        user={user}
        totalVouchers={data.length}
        vouchersToday={vouchersToday}
        uniqueUsers={uniqueUsers}
        onLogout={handleLogout}
      />

      <section>
        <h3>📈 Vouchers Pedidos por Dia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={vouchersPerDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="Vouchers" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h3>🏆 Top 5 Números</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topUsers} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="number" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Vouchers" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h3>📊 Distribuição por DDD</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={vouchersByDDD}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ddd" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" name="Total" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h3>🥧 Top 5 Usuários - Pizza</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topUsers}
              dataKey="count"
              nameKey="number"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {topUsers.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>
      <VouchersTable data={sortedData} />
    </div>
  );
}

export default DashboardInsights;