let domain = 'http://localhost:8001';

switch (process.env.NODE_ENV) {
  case 'development':
  domain = 'http://10.200.32.70:8001';
  break;
  case 'production':
  domain = 'http://10.200.32.70:8001';
  break;
  case 'proATM':
  domain = 'http://mcjourney.ruixuesoft.com/api';
  break;
  default:
  domain = 'http://localhost:8001';
  break;
}

const WEB = {
  LOGIN: `${domain}/login`,
  JOURNEY_LIST: `${domain}/journeyList`,
  JOURNEY_DETAIL: `${domain}/journey/showNodes`,
  JOURNEY_INDICATOR: `${domain}/journey/indicators`,
  JOURNEY_CONTRAST: `${domain}/journey/node/contrast`,
  LOSS_SORT: `${domain}/behavior/lossSort`,
};

module.exports = {
  WEB
};

