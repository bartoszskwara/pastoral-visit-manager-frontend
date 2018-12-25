export const environment = {
  envName: 'heroku',
  production: true,
  server: {
    url: 'https://pastoral-visit-manager.herokuapp.com'
  },
  dateFormat: "YYYY-MM-DD HH:mm:ss ZZ",
  pastoralVisit: {
    status: {
      completed: '+',
      refused: '-',
      absent: '?',
      individually: 'ind',
      not_requested: 'x'
    }
  }
};
