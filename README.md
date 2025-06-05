# Dashboard BotVoucher

Dashboard BotVoucher é uma aplicação web desenvolvida com React, TypeScript e Vite para visualização e análise de dados de vouchers gerados por um bot. O sistema utiliza autenticação via Google e integra-se ao Firebase Realtime Database para exibir métricas e gráficos interativos.

## Funcionalidades

- **Login com Google**: Apenas usuários autorizados podem acessar o dashboard.
- **Resumo de Atividades**: Exibe total de vouchers, vouchers do dia e usuários únicos.
- **Gráficos Interativos**:
  - Vouchers por dia (linha)
  - Top 5 números que mais solicitaram vouchers (barra e pizza)
  - Distribuição de vouchers por DDD (barra)
- **Responsivo**: Layout adaptável para desktop e dispositivos móveis.
- **Rodapé com informações de contato e versão.**

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Firebase Auth & Realtime Database](https://firebase.google.com/)
- [Recharts](https://recharts.org/) (gráficos)
- [ESLint](https://eslint.org/) (qualidade de código)

## Como rodar o projeto

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/bot-voucher-dashboard.git
   cd bot-voucher-dashboard
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Configure o Firebase:**
   - Renomeie `.env.example` para `.env` (ou edite o `.env` existente).
   - Preencha as variáveis com as credenciais do seu projeto Firebase.

4. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run dev
   ```

5. **Acesse:**  
   Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Estrutura de Pastas

```
src/
  components/         # Componentes React reutilizáveis
  firebaseConfig.ts   # Configuração do Firebase
  App.tsx             # Componente principal
  main.tsx            # Ponto de entrada
public/
  vite.svg            # Ícone
```

## Permissões de Usuário

O acesso ao dashboard é restrito. Apenas e-mails cadastrados em `allowed_users` no Firebase Realtime Database podem acessar.

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera build de produção
- `npm run preview` — pré-visualiza o build
- `npm run lint` — executa o ESLint

## Licença

Este projeto é privado e de uso interno da AD Promotora.

---

Desenvolvido por AD Promotora.


