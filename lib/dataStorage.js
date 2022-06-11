const fs = require('fs');

class DataStorage {
    strikes = {}
    mutes = {}
    bans = {}
    serverData = {}

    constructor(client) {
        this.client = client;
        this.loadFromDisk();
        // this.migrateOldData();
        this.saveData();
    }

    // migrateOldData() {
    //     try {
    //         this.strikes = Object.assign(this.strikes, JSON.parse(fs.readFileSync('./strikes.json', 'utf8')));
    //         fs.rename('./strikes.json', './strikes.json.migrated', (ex) => {
    //             if (ex) return;
    //             console.log('Migrated old warning file.');
    //         });
    //     } catch (err) { /*File does not exist, ignore it*/
    //     }
    // }

    loadFromDisk() {
        try {
            this.strikes = JSON.parse(fs.readFileSync('./data/strikes.json', 'utf8'));
        } catch (err) { /*File does not exist, ignore it*/
        }
        try {
            this.mutes = JSON.parse(fs.readFileSync('./data/mutes.json', 'utf8'));
        } catch (err) { /*File does not exist, ignore it*/
        }
        try {
            this.bans = JSON.parse(fs.readFileSync('./data/bans.json', 'utf8'));
        } catch (err) { /*File does not exist, ignore it*/
        }
        try {
            this.serverData = JSON.parse(fs.readFileSync('./data/serverData.json', 'utf8'));
        } catch (err) { /*File does not exist, ignore it*/
        }
    }

    saveData() {
        fs.mkdir('./data', ex => {
        });
        fs.writeFile('./data/strikes.json', JSON.stringify(this.strikes), err => {
            if (err) console.log('Error while saving file', err)
        });
        fs.writeFile('./data/mutes.json', JSON.stringify(this.mutes), err => {
            if (err) console.log('Error while saving file', err)
        });
        fs.writeFile('./data/bans.json', JSON.stringify(this.bans), err => {
            if (err) console.log('Error while saving file', err)
        });
        fs.writeFile('./data/serverData.json', JSON.stringify(this.serverData), err => {
            if (err) console.log('Error while saving file', err)
        });
    }

    // addUserMute(userId, guildId, expirationTime) {
    //     if (!this.mutes[guildId]) this.mutes[guildId] = {};
    //     this.mutes[guildId][userId] = Date.now() + expirationTime;
    //     this.saveData();
    // }
    //
    // removeMute(userId, guildId) {
    //     if (!this.mutes[guildId]) return;
    //     delete this.mutes[guildId][userId];
    //     this.saveData();
    // }
    //
    // isUserMuted(userId, guildId) {
    //     return this.mutes[guildId] && this.mutes[guildId][userId]
    // }

    addUserBan(userId, guildId, expirationTime) {
        if (!this.bans[guildId]) this.bans[guildId] = {};
        this.bans[guildId][userId] = Date.now() + expirationTime;
        this.saveData();
    }

    removeBan(userId, guildId) {
        if (!this.bans[guildId]) return;
        delete this.bans[guildId][userId];
        this.saveData();
    }

    isUserBanned(userId, guildId) {
        return this.bans[guildId] && this.bans[guildId][userId]
    }

}

module.exports = DataStorage;