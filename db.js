'use strict'
if (!process.env.PRODUCTION){
    var config = require('./config.json');
}

var tbot = require('./bot.js');
var scraper = require('./scraper');
var mysql      = require('mysql');

var pool = mysql.createPool({
    host     : process.env.MYSQLHOST || config.mysqlhost,
    user     : process.env.MYSQLUSER || config.mysqluser,
    password : process.env.MYSQLPASSWORD || config.mysqlpassword,
    database : process.env.MYSQLDATABASE || config.mysqldatabase,
    port     : process.env.MYSQLPORT || config.mysqlport
});

function show_db(chat_id, callback) {
    pool.getConnection(function(err, conn) {

        var sql = "SELECT * FROM announcements WHERE chat_id=?";        

        conn.query(sql, [chat_id], function(err, results) {
            tbot.sendMessage(chat_id, JSON.stringify(results))
        });

        conn.release();
    });
}


function add_url(chat_id, url, last_url, callback){
    pool.getConnection(function(err, conn) {
        var sql = "SELECT last_url FROM announcements WHERE chat_id=? and url=?";

        var query = conn.query(sql, [chat_id, url]);

        conn.query(sql, [chat_id, url], function(err, results) {
            if (results.length > 0){
                var msg = "URL already registered"
                tbot.sendMessage(chat_id, msg)
            }else{
                var insert_sql = "INSERT INTO announcements (chat_id, url, last_url) VALUES (?,?,?)";
                var values = [chat_id, url, last_url];
                conn.query(insert_sql, values);
                var msg = 'Added!!';
                tbot.sendMessage(chat_id, msg);
            }
        });

        conn.release();
    });
}

function remove_url(chat_id, url, callback){
    pool.getConnection(function(err, conn) {
        var sql = "SELECT last_url FROM announcements WHERE chat_id=? AND url=?";

        var query = conn.query(sql, [chat_id, url]);

        conn.query(sql, [chat_id, url], function(err, results) {
            if (results.length > 0){
                var delete_sql = "DELETE FROM announcements WHERE chat_id=? AND url=?";
                var values = [chat_id, url];
                conn.query(delete_sql, values);
                var msg = "URL removed"
                tbot.sendMessage(chat_id, msg)
            }else{
                var msg = 'URL does not exist';
                tbot.sendMessage(chat_id, msg);
            }
        });

        conn.release();
    });
}


function update_db(chat_id, callback) {
    pool.getConnection(function(err, conn) {

        var query;
        if (chat_id){
            query = conn.query("SELECT * FROM announcements WHERE chat_id=?", [chat_id]);
        }else{
           query = conn.query("SELECT * FROM announcements"); 
        }
        
        query
            .on('error', function(err){
                throw err;
            })
            .on('result', function(row){
                conn.pause();

                scraper.scrape(row.url, function(last_url){
                    console.log("Last URL found in DB for " + row.url + " --> " +row.last_url);
                    console.log("Last URL scraped for "+ row.url + " --> " +last_url);
                    if (row.last_url != last_url){
                        tbot.sendMessage(row.chat_id, last_url)
                        console.log("Launching --> UPDATE")
                        conn.query("UPDATE announcements SET last_url=? WHERE chat_id=? and url=?", [last_url, row.chat_id, row.url]);
                    }
                });
                conn.resume();
            });
        conn.release();
    });      
}

module.exports = {
    show_db: show_db, 
    add_url: add_url, 
    remove_url: remove_url,
    update_db: update_db,
};

setInterval(function() {
    update_db();
}, 900000); // every 15 minutes (900000)