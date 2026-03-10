import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:3000/api/fruit/gql',
  documents: ['app/**/*.gql'],
  ignoreNoDocuments: true,
  generates: {
    './app/_codegen/types.ts': {
      plugins: ['typescript'],
    },
    './app/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '~~/_codegen/types.ts',
        importAllFragmentsFrom: '~types'
      },
      config: {
        useTypeImports: true,
      },
      plugins: ['typescript-operations', 'typed-document-node'],
    },
    './schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      }
    }
  }
}

export default config