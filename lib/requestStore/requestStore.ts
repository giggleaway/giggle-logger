import CLS from 'cls-hooked';

const requestStore = CLS.createNamespace('request');

export const get = <T>(key: string): T => requestStore.get(key) as T;

export const set = <T>(key: string, value: T): T => requestStore.set(key, value);

export const getStore = (): CLS.Namespace => requestStore;
