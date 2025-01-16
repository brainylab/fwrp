import nodeConfig from '@brainylab/eslint-config-node';
import { typescriptConfig } from '@brainylab/eslint-config-typescript';

export default [...typescriptConfig, ...nodeConfig];
