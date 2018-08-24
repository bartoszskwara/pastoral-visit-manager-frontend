export const environment = {
  production: true,
  server: {
    url: 'http://localhost:8090'
  },
  dateFormat: "YYYY-MM-DD HH:mm:ss ZZ",
  pastoralVisit: {
    status: {
      completed: '+',
      refused: '-',
      absent: '?',
      individually: 'ind.',
      not_requested: 'x'
    }
  }
};
