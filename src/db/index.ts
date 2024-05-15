// eslint-disable
class DB{

  public static async getDataBase(){
    return new Promise((resolve, reject) => {

      const  request = window.indexedDB.open('shopDB2', 1);

      request.onerror = (event) => {
        reject('Error');
      };

      request.onsuccess = (event: any) => {
        resolve(event!.target!.result);
      };

      request.onupgradeneeded = (event: any) => {
        const dataBase = event!.target!.result;
        dataBase.createObjectStore('items', {
          autoIncrement: true,
          keyPath: 'id',
        })
      };

    })
  }

  public static async getItems(): Promise<any>{
    const db: any = await this.getDataBase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('items', 'readonly');
      const store = transaction.objectStore('items');

      const itemsList: any[] = [];

      store.openCursor().onsuccess = (event: any) => {
        const cursor = event.target.result;
        if(cursor){
          itemsList.push(cursor.value);
          cursor.continue();
        }
      }

      transaction.oncomplete = () => {
        resolve(itemsList);
      }

      transaction.onerror = (event: any) => {
        reject(event)
      }
    })
  }
}

export default DB;
