// src/components/VouchersTable.tsx (versão com paginação)

import { useState } from 'react'; // Importe o useState
import './VouchersTable.css';

// A interface para um único voucher (não muda)
interface VoucherData {
  credencial: string;
  date: string;
  name: string;
  number: string;
  voucher_id: string;
}


interface VouchersTableProps {
  data: VoucherData[];
}

const formatPhoneNumber = (raw: string): string => {
  const match = raw.match(/^55(\d{2})(\d+)\@c\.us$/);
  if (!match) return raw;
  const [, ddd, num] = match;
  return `(${ddd}) ${num}`;
};

function VouchersTable({ data }: VouchersTableProps) {

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; 

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };


  if (!data || data.length === 0) {

  }

  return (
    <section className="table-container">
      <h3>📄 Todos os Vouchers</h3>
      <div className="table-wrapper">
        <table>
          <thead>

          </thead>
          <tbody>

            {currentItems.map((voucher, index) => (
              <tr key={`<span class="math-inline">\{voucher\.voucher\_id\}\-</span>{index}`}> {/* Usar uma chave mais única */}
                <td>{voucher.date}</td>
                <td>{voucher.name}</td>
                <td>{formatPhoneNumber(voucher.number)}</td>
                <td>{voucher.credencial}</td>
                <td>{voucher.voucher_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Próxima
        </button>
      </div>
    </section>
  );
}

export default VouchersTable;