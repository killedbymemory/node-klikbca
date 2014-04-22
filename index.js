var util = require('util');

var request = require('request');

var cookie_jar = request.jar();

var base_options = {
  url: 'https://m.klikbca.com',
  headers: {
    'pragma': "no-cache",
    'host': "m.klikbca.com",
    'accept-language': "en-US,en;q=0.8",
    'user-agent': "User-Agent:Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; Nexus S Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    'cache-control': 'no-cache'
  },

  // enable Cookie jar while having a reference to it
  jar: cookie_jar
};

// login_page is a duplicate of base_options
var login_page = util._extend({}, base_options);
login_page.url += '/login.jsp';

// first of all, request the login page to initiate session
request(login_page, function(err, response, body) {
  if (err) {
    console.log(err);
    return;
  }

  debugger;

  // at this point we should have established a session
  // and have session identifier on cookie
  // console.log(arguments);

  // now, lets get logged in
  var authentication = util._extend({}, base_options);
  authentication.method           = "POST";
  authentication.url             += '/authentication.do';
  authentication.headers.origin   = "https://m.klikbca.com";
  authentication.headers.referer  = "https://m.klikbca.com/login.jsp";

  authentication.form = {
    'value(user_id)': 'useridhere',
    'value(pswd)'   : 'pin',
    'value(Submit)' : 'LOGIN',
    'value(actions)': 'login',
    'value(user_ip)': '114.79.12.23',
    'user_ip'       : '114.79.12.23',
    'value(mobile)' : 'true',
    'mobile'        : 'true'
  };

  request.post(authentication, function(err, authresponse, authbody) {
    if (err) {
      console.log(err);
      return;
    }

    debugger;

    // successfully logged in!
    // now, lets get our balance!
    var balanceInquiry = util._extend({}, base_options);
    balanceInquiry.method           = "POST";
    balanceInquiry.url             += '/balanceinquiry.do';
    balanceInquiry.headers.origin   = "https://m.klikbca.com";
    balanceInquiry.headers.referer  = "https://m.klikbca.com/accountstmt.do?value(actions)=menu";

    request.post(balanceInquiry, function(err, balanceResponse, balanceBody) {
      // yeehaw
      debugger;

      var jquery = require('fs').readFileSync("./jquery-1.9.1.js", "utf-8");
      var jsdom = require('jsdom');

      jsdom.env({
        html    : balanceBody,
        src     : [jquery],
        done    : function(err, window){
          debugger
          var $     = window.jQuery;
          var saldo = $("#pagebody table:nth-child(2)  td:nth-child(2)  tr:nth-child(2) td:nth-child(3) font > b").html();
          console.log(saldo);
      }});

      // now lets logout
      var logout = util._extend({}, base_options);
      logout.method           = "GET";
      logout.url             += '/authentication.do?value(actions)=logout';
      logout.headers.origin   = "https://m.klikbca.com";
      logout.headers.referer  = "https://m.klikbca.com/balanceinquiry.do";

      request.post(logout, function(err, logoutResponse, logoutBody) {
        if (err) {
          console.log(err);
          return;
        }

        // fin...
      });
    })
  });
});