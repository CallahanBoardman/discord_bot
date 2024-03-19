class ReminderData {
    constructor(date, users, message) {
        this.date = date;
        this.users = users;
        this.message = message
    }

    toJSON() {
        return {
          ReminderDate: this.date,
          UsersList:  this.users,
          ReminderMessage:   this.message
        };
      }
}

exports.ReminderData = ReminderData