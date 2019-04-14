import { sequelize } from '../database/models';

// eslint-disable-next-line import/prefer-default-export
export const resetDB = () => {
  return sequelize.sync({ force: true, logging: false });
};
