import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState } from 'extensions/util'
import * as models from 'models'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { ApiState } from 'extensions/rematchApi'
import apiPlugin from 'extensions/rematchApi'


export const store = init({
	models,
	plugins: [immerPlugin(), selectPlugin(), apiPlugin()],
});

export type RootState = RematchRootState<typeof models> & ApiState<typeof models>;

export type RootDispatch = RematchRootDispatch<typeof models>;

export default store;