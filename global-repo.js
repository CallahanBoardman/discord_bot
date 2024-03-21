const { forEach } = require('lodash');
const { log } = require('node:console');
const fs = require('node:fs');

class GlobalRepo {
    
    constructor() {
        this.id = 0;
        this.reminderMap = new Map();
    }

    addToMap (jsonData) {
        this.reminderMap.set(this.id, jsonData.toJSON())
        this.updateMap()
    }

    updateMap() {
        fs.writeFileSync('reminders.json', JSON.stringify(Object.fromEntries(this.reminderMap), null, 4), (error) => {
            if (error) throw error;
        });
    }

    readMap() {
        let jsonStr = fs.readFileSync('./reminders.json', 'utf8');
		let parsedStr = JSON.parse(jsonStr);
        this.reminderMap = new Map(Object.entries(parsedStr));
        this.id = this.reminderMap.size ? Math.max(...this.reminderMap.keys())+1 : 0;
    }

    removeFromList(dataToDelete){
        
        console.log(this.reminderMap); 
        for (let id of dataToDelete) {
            this.reminderMap.delete(id)
        }
        this.updateMap();
    }
}

let globalrepo = new GlobalRepo();
globalrepo.readMap();

module.exports.globalrepo = globalrepo;