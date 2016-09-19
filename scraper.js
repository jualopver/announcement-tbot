'use strict'
var request = require('request');
var cheerio = require('cheerio');


function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

module.exports = { 
    scrape: function (url_to_track, callback) {
        request(url_to_track, function(error, response, html){
            var result = '';
            if(!error){
                var $ = cheerio.load(html);

                var domain = extractDomain(url_to_track);
                var last_url;
                switch (domain){
                    case 'www.milanuncios.com': 
                        last_url = $('.x1 .x7 .cti').attr('href');
                        break;

                    case 'www.idealista.com': 
                        last_url = $('article .item-link').attr('href');
                        break;
                    
                    default:
                        last_url = undefined
                        break;
                }
                result = domain + last_url;
            }else{
                result = error;
            }
            callback(result);
        })
    }
}
