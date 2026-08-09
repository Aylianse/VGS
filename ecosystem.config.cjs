/** PM2 config for Hostinger VPS */
module.exports = {
  apps: [
    {
      name: "vitaglow",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 0.0.0.0 -p 3000",
      cwd: "/var/www/vitaglow",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
