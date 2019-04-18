import models, { sequelize } from '../database/models';

// eslint-disable-next-line import/prefer-default-export
export const createTables = () => {
  return sequelize.sync({ force: true, logging: true });
};

const truncateTable = modelName => {
  return models[modelName].destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true,
    },
    logging: false,
  });
};

export default async function truncate(model) {
  if (model) {
    return truncateTable(model);
  }

  return Promise.all(
    Object.keys(models).map(key => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return truncateTable(key);
    })
  );
}
