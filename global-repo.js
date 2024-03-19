const fs = require('node:fs');

class GlobalRepo {
    constructor(reminderList) {
        this.reminderList = reminderList;
    }

    updateList(obj) {
        jsonStr = fs.readFileSync('./reminders.json', 'utf8');
		let obj = JSON.parse(jsonStr);
		obj['reminders'].push(jsonData.toJSON());
        fs.writeFile('reminders.json', JSON.stringify(obj), (error) => {
            if (error) throw error;
        });
    }

    readList() {
        jsonStr = fs.readFileSync('./reminders.json', 'utf8');
		let obj = JSON.parse(jsonStr);
        this.reminderList = obj;
    }
}

exports.GlobalRepo = GlobalRepo