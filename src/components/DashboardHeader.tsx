
import { type User } from 'firebase/auth';
import './DashboardHeader.css';
import ThemeToggler from './ThemeToggler';

const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18m-3-12h18M3 12h18m-3 6h-12c-1.104 0-2-.896-2-2V8c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2v8c0 1.104-.896 2-2 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.239-.636.354-.963l.001-.006a6.375 6.375 0 01-6.98-1.766M15 19.128a9.37 9.37 0 01-8.947-5.454M12 12.75a3 3 0 110-6 3 3 0 010 6z" />
  </svg>
);


interface DashboardHeaderProps {
  user: User | null | undefined;
  totalVouchers: number;
  vouchersToday: number;
  uniqueUsers: number;
  onLogout: () => void;
}

function DashboardHeader({ user, totalVouchers, vouchersToday, uniqueUsers, onLogout }: DashboardHeaderProps) {
  const displayName = user?.displayName?.split(' ')[0] || user?.email || 'Utilizador';

  return (
    <header className="dashboard-header">
      <div className="header-greeting">
        <h1>Bem-vindo, {displayName}!</h1>
        <p>Aqui está o resumo da atividade de vouchers.</p>
      </div>
      
      <div className="header-kpis">
        <div className="kpi-card">
          <div className="kpi-icon total"><TicketIcon /></div>
          <div className="kpi-info">
            <span className="kpi-value">{totalVouchers}</span>
            <span className="kpi-label">Vouchers Totais</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon today"><TicketIcon /></div>
          <div className="kpi-info">
            <span className="kpi-value">{vouchersToday}</span>
            <span className="kpi-label">Vouchers Hoje</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon users"><UsersIcon /></div>
          <div className="kpi-info">
            <span className="kpi-value">{uniqueUsers}</span>
            <span className="kpi-label">Utilizadores Ativos</span>
          </div>
        </div>
      </div>

      <div className="header-user-menu">
        <ThemeToggler />
        <img 
          src={user?.photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=random`} 
          alt="Foto do perfil" 
          className="user-avatar"
        />
        <button onClick={onLogout} className="logout-button">Sair</button>
      </div>
    </header>
  );
}

export default DashboardHeader;