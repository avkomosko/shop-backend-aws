export const esBuildConfiguration = {
  bundle: true,
  minify: true,
  sourcemap: false,
  exclude: ['aws-sdk'],
  target: 'node14',
  define: { 'require.resolve': undefined },
  platform: 'node',
  concurrency: 10,
}
