'use strict'
if (!process.env.PRODUCTION){
    var config = require('./config.json');
}

var db = require('./db');
var scraper = require('./scraper');

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const tg = new Telegram.Telegram(process.env.TELEGRAMTOKEN || config.telegramToken);


class ShowDBController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    showDBHandler($) {
        db.show_db($.message.chat.id);
        
    }

    get routes() {
        return {
            '/show_db': 'showDBHandler'
        }
    }
}

class AddUrlDBController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    addUrlHandler($) {
        scraper.scrape($.query.url_to_track, function(last_url){
            db.add_url($.message.chat.id, $.query.url_to_track, last_url, function (result) {
                $.sendMessage(result);
            })
        })           
    }

    get routes() {
        return {
            '/add_url :url_to_track': 'addUrlHandler'
        }
    }
}


class RemoveUrlDBController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    removeUrlDBHandler($) {        
        db.remove_url($.message.chat.id, $.query.url_to_remove);        
    } 

    get routes() {
        return {
            '/remove_url :url_to_remove': 'removeUrlDBHandler'
        }
    }
}


class UpdateDBController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    updateDBHandler($) {
        db.update_db($.message.chat.id);        
    }

    get routes() {
        return {
            '/update_db': 'updateDBHandler'
        }
    }
}

tg.router
    .when(['/show_db'], new ShowDBController())
    .when(['/add_url :url_to_track'], new AddUrlDBController())
    .when(['/remove_url :url_to_remove'], new RemoveUrlDBController())
    .when(['/update_db'], new UpdateDBController())

var sendMessage = function (chatId, message) {
    tg.api.sendMessage(chatId, message);
}

exports.sendMessage = sendMessage;

