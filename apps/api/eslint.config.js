import { configApp } from '@adonisjs/eslint-config'

export default configApp({
  name: 'Disable prettier rule',
  files: ['**/*.{js,ts,mjs,cjs}'],
  rules: {
    'prettier/prettier': 'off',
  },
})
