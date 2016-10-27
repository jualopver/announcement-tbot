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
    scrape: function (urlToTrack, callback) {
        var header = { "User-Agent": "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410."}
        request({uri: urlToTrack , headers: header}, function(error, response, html){
            var completeUrl = '';
            if(!error){
                var $ = cheerio.load(html);

                var domain = extractDomain(urlToTrack);
                var lastUrl;
                switch (domain){
                    case 'www.milanuncios.com': 
                        lastUrl = $('.aditem-detail-title').attr('href');
                        completeUrl = domain + lastUrl;
                        break;

                    case 'www.idealista.com': 
                        lastUrl = $('article .item-link').attr('href');
                        completeUrl = domain + lastUrl;
                        break;
                    
                    case 'www.fotocasa.es': 
                        completeUrl = $('.expanded').attr('data-url')
                        break;

                    default:
                        completeUrl = undefined
                        break;
                }
            }else{
                completeUrl = error;
            }
            callback(completeUrl);
        })
    }
}
