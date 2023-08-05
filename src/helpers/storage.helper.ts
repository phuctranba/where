import {MMKV} from 'react-native-mmkv'
import {Storage} from 'redux-persist'
import {parseJson} from "helpers/object.helper";

const storage = new MMKV()

export function getStorageString(key: string, defaultValue?: string) {
    let value = storage.getString(key)
    return value !== undefined ? value : defaultValue
}

export function getStorageBoolean(key: string, defaultValue?: boolean) {
    let value = storage.getBoolean(key)
    return value !== undefined ? value : defaultValue
}

export function getStorageBuffer(key: string, defaultValue?: Uint8Array) {
    let value = storage.getBuffer(key)
    return value !== undefined ? value : defaultValue
}

export function getStorageNumber(key: string, defaultValue?: number) {
    let value = storage.getNumber(key)
    return value !== undefined ? value : defaultValue
}

export function getStorageObject(key: string, defaultValue?: Object) {
    let value = storage.getString(key)
    return parseJson(value) || defaultValue
}

export function getStorageArray(key: string, defaultValue?: any[]) {
    let value = storage.getString(key)
    return Array.isArray(parseJson(value)) ? parseJson(value) : defaultValue
}

export function setStorageString(key: string, value: any) {
    storage.set(key, value.toString())
}

export function setStorageBoolean(key: string, value: any) {
    storage.set(key, Boolean(value))
}

export function setStorageNumber(key: string, value: any) {
    storage.set(key, !Number.isNaN(Number(value)) ? Number(value) : 0)
}

export function setStorageObject(key: string, value: any) {
    storage.set(key, typeof value === 'object' ? JSON.stringify(value) : "{}")
}

export function setStorageArray(key: string, value: any[]) {
    storage.set(key, Array.isArray(value) ? JSON.stringify(value) : "[]")
}

export function getStorageAllKeys(defaultValue?: string[]) {
    let value = storage.getAllKeys()
    return value.length > 0 ? value : defaultValue
}

export function deleteStorageKey(key: string) {
    storage.delete(key)
}

export function clearAllStorage() {
    storage.clearAll()
}

export const reduxStorage: Storage = {
    setItem: (key, value) => {
        storage.set(key, value)
        return Promise.resolve(true)
    },
    getItem: (key) => {
        const value = storage.getString(key)
        return Promise.resolve(value)
    },
    removeItem: (key) => {
        storage.delete(key)
        return Promise.resolve()
    },
}

export default storage
