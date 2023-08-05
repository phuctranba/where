import {openDatabase} from "react-native-sqlite-storage";

export const TABLE_NAME = "TABLE_NAME";

export const DB = openDatabase({
    name: "ai_law.db",
    location: "default",
    createFromLocation: 2
}, () => console.log("Open DB success"), (error) => console.log("Open DB error: ", error));

export async function insertSomething(data: any) {
    try {
        await DB.transaction(function (tx) {
            tx.executeSql(`INSERT OR REPLACE INTO ${TABLE_NAME} (id, create_at, data) VALUES (?,?,?)`,
                [data?._id, new Date().getTime(), JSON.stringify(data)]);
        }, function (error) {
            console.log(`insertSomething ${TABLE_NAME} ERROR: ${error.message}`);
        }, function () {
            console.log(`insertSomething ${TABLE_NAME} SUCCESS`);
        });
    } catch (error) {
    }
}

export async function getAllData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        try {
            DB.transaction(async (tx) => {
                await tx.executeSql(`SELECT * FROM ${TABLE_NAME} ORDER BY create_at DESC`, [], (tx, results) => {
                    let datas: any[] = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        try {
                            let data: any = JSON.parse(results.rows.item(i).data);
                            datas = [...datas, data]
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    resolve(datas);
                });
            }, function (error) {
                console.log(`getAllData ${TABLE_NAME} ERROR: ${error.message}`);
                reject(error)
            }, function () {
                console.log(`getAllData ${TABLE_NAME} SUCCESS`);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export async function getDataById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            DB.transaction(async (tx) => {
                await tx.executeSql(`SELECT * FROM ${TABLE_NAME} WHERE id = '${id}'`, [], (tx, results) => {
                    if (results.rows.item?.(0)) {
                        resolve(JSON.parse(results.rows.item(0).data));
                    } else {
                        reject()
                    }
                });
            }, function (error) {
                console.log(`getDataById ${TABLE_NAME} ERROR: ${error.message}`);
                reject(error)
            }, function () {
                console.log(`getDataById ${TABLE_NAME} SUCCESS`);
            });
        } catch (error) {
            reject(error);
        }
    });
}

export async function deleteDataById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            DB.transaction(async (tx) => {
                await tx.executeSql(`DELETE FROM ${TABLE_NAME} WHERE id = '${id}'`, [], () => {
                });
            }, function (error) {
                console.log(`deleteDataById ${TABLE_NAME} ERROR: ${error.message}`);
                reject(error)
            }, function () {
                console.log(`deleteDataById ${TABLE_NAME} SUCCESS`);
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Table for sqlite
 */


export async function createDB() {
    return new Promise((resolve, reject) => {
        DB.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS " + TABLE_NAME + " (id PRIMARY KEY, create_at, lawyer)");
        }, function (error) {
            console.log("Populated database ERROR: " + error.message);
        }, function () {
            console.log("Populated database OK");
        });
    });
}


export async function deleteDataTable() {
    return new Promise((resolve, reject) => {
        DB.transaction(function (tx) {
            tx.executeSql("DROP TABLE IF EXISTS " + TABLE_NAME);
            return true;
        }, function (error) {
            console.log("DELETE ERROR: " + TABLE_NAME + " " + error.message);
            resolve(false);
        }, function () {
            console.log("DELETE OK " + TABLE_NAME);
            createDB();
            resolve(true);
        });
    });
}

export async function clearDB() {
    await DB.transaction(async (tx) => {
        await tx.executeSql(`SELECT name FROM sqlite_master WHERE type='table'`, [], async (tx, results) => {
            try {
                for (let i = 0; i < results.rows.length; i++) {
                    let table = results.rows.item(i);
                    await tx.executeSql("DROP TABLE IF EXISTS " + table?.name);
                }
            } catch (error) {
                console.log(error, "delete table");
            }
        });
    }, function (error) {
        console.log(`Drop table ERROR: ${error.message}`);
    }, function () {
        console.log(`Drop table SUCCESS`);
    });

    createDB().catch((error) => console.log(error, "re-create DB error"));
}

export async function checkTableIsExists(tableNameNeedCheck: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        await DB.transaction(async (tx) => {
            await tx.executeSql(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableNameNeedCheck}'`, [], async (tx, results) => {
                resolve(results.rows.length > 0);
            });
        }, function (error) {
            console.log(`checkTableIsExists table ERROR: ${error.message}`);
            resolve(false);
        });
    });
}
