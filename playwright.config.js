const config = {
  use: {
    channel: 'chromium',
    ignoreHTTPSErrors: true,
    // Artifacts
    // screenshot: 'only-on-failure',
    // video: 'retry-with-video'
  },
  projects: [
    {
      name: 'nebulantBuilder',
      testDir: './src/tests-e2e/',
      use: { baseUrl: 'http://nebulant_builder' },
    },
  ],
};

module.exports = config;
