/// <reference types="cypress" />

export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  const newConfig = { ...config, video: false };
  return newConfig;
};
