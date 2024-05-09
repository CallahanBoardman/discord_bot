import { forEach } from 'lodash';
import { log } from 'node:console';
import { writeFileSync, readFileSync } from 'node:fs';

class GlobalRepo {
    
    constructor() {
        this.id = 0;
        this.reminderMap = new Map();
    }

    addToMap (jsonData) {
        this.reminderMap.set(this.id, jsonData.toJSON())
        console.log(this.reminderMap);
        this.updateMap()
        this.id++;
    }

    updateMap() {
        writeFileSync('reminders.json', JSON.stringify(Object.fromEntries(this.reminderMap), null, 4), (error) => {
            if (error) throw error;
        });
    }

    readMap() {
        let jsonStr = readFileSync('./reminders.json', 'utf8');
		let parsedStr = JSON.parse(jsonStr);
        this.reminderMap = new Map(Object.entries(parsedStr));
        this.id = this.reminderMap.size ? Math.max(...this.reminderMap.keys())+1 : 0;
    }

    removeFromList(dataToDelete){
        for (let id of dataToDelete) {
            this.reminderMap.delete(id)
        }
        this.updateMap();
    }
}

let globalrepo = new GlobalRepo();
globalrepo.readMap();

const _globalrepo = globalrepo;
export { _globalrepo as globalrepo };