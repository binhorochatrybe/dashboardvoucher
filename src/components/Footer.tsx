// src/components/Footer.tsx

import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span>© {currentYear} AD Promotora. Todos os direitos reservados.</span>
          <span className="version-tag">Versão 1.0.0</span>
        </div>
        <div className="footer-right">
          <a href="mailto:fabiano.sales@adpromotora.com">Precisa de ajuda?</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;