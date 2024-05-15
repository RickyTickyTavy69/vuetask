/* eslint-disable */
class DB{

  static async getDataBase(){
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

  static async saveItem(item: any) : Promise<any>{
    const db: any = await this.getDataBase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('items', 'readwrite');
      const store = transaction.objectStore('items');

      store.put(item);

      transaction.oncomplete = () => {
        resolve('Item successfully saved.');
      }

      transaction.onerror = (event: any) => {
        reject(event)
      }
    })
  }

  static async deleteItem(item: any){
    const db: any = await this.getDataBase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction('items', 'readwrite');
      const store = transaction.objectStore('items');

      store.delete(item.id);

      transaction.oncomplete = () => {
        resolve('Item successfully deleted.');
      }

      transaction.onerror = (event: any) => {
        reject(event);
      }
    })
  }
}

export default DB;
