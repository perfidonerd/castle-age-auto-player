///////////////////////////
// Define our global object
///////////////////////////

global = {
    gameName            : 'castle_age',
    discussionURL       : 'http://senses.ws/caap/index.php',
    newVersionAvailable : false,
    documentTitle       : document.title,
    is_chrome           : navigator.userAgent.toLowerCase().indexOf('chrome') !== -1 ? true : false,
    is_firefox          : navigator.userAgent.toLowerCase().indexOf('firefox') !== -1  ? true : false,
    // Object separator - used to separate objects
    os                  : '\n',
    // Value separator - used to separate name/values within the objects
    vs                  : '\t',
    // Label separator - used to separate the name from the value
    ls                  : '\f',

    AddCSS: function () {
        try {
            var href = window.location.href;

            if (!$('link[href*="jquery-ui-1.8.1.custom.css"').length) {
                $("<link>").appendTo("head").attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: "http://cloutman.com/caap/jquery-ui-1.8.1/css/smoothness/jquery-ui-1.8.1.custom.css"
                });
            }

            if (!$('link[href*="farbtastic.css"').length) {
                $("<link>").appendTo("head").attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: "http://cloutman.com/caap/farbtastic12/farbtastic/farbtastic.css"
                });
            }

            if (gm.getValue("fbFilter", false) && (href.indexOf('apps.facebook.com/reqs.php') >= 0 || href.indexOf('apps.facebook.com/home.php') >= 0 || href.indexOf('filter=app_46755028429') >= 0)) {
                $("<style type='text/css'>#contentArea div[id^='div_story_']:not([class*='46755028429']) {\ndisplay:none !important;\n}</style>").appendTo("head");
            }

            return true;
        } catch (err) {
            this.error("ERROR in AddCSS: " + err);
            return false;
        }
    },

    alert_id: 0,

    alert: function (message) {
        try {
            global.alert_id += 1;
            var id = global.alert_id;
            $('<div id="alert_' + id + '" title="Alert!"><p>' + message + '</p></div>').appendTo(document.body);
            $("#alert_" + id).dialog({
                buttons: {
                    "Ok": function () {
                        $(this).dialog("close");
                    }
                }
            });

            return true;
        } catch (err) {
            this.error("ERROR in alert: " + err);
            return false;
        }
    },

    logLevel: 1,

    log: function (level, text) {
        if (console.log !== undefined) {
            if (this.logLevel && !isNaN(level) && this.logLevel >= level) {
                var message = 'v' + caapVersion + ' (' + (new Date()).toLocaleTimeString() + ') : ' + text;
                if (arguments.length > 2) {
                    console.log(message, Array.prototype.slice.call(arguments, 2));
                } else {
                    console.log(message);
                }
            }
        }
    },

    warn: function (text) {
        if (console.warn !== undefined) {
            var message = 'v' + caapVersion + ' (' + (new Date()).toLocaleTimeString() + ') : ' + text;
            if (arguments.length > 1) {
                console.warn(message, Array.prototype.slice.call(arguments, 1));
            } else {
                console.warn(message);
            }
        } else {
            if (arguments.length > 1) {
                this.log(1, text, Array.prototype.slice.call(arguments, 1));
            } else {
                this.log(1, text);
            }
        }
    },

    error: function (text) {
        if (console.error !== undefined) {
            var message = 'v' + caapVersion + ' (' + (new Date()).toLocaleTimeString() + ') : ' + text;
            if (arguments.length > 1) {
                console.error(message, Array.prototype.slice.call(arguments, 1));
            } else {
                console.error(message);
            }
        } else {
            if (arguments.length > 1) {
                this.log(1, text, Array.prototype.slice.call(arguments, 1));
            } else {
                this.log(1, text);
            }
        }
    },

    ReloadCastleAge: function () {
        // better than reload... no prompt on forms!
        if (window.location.href.indexOf('castle_age') >= 0 && !gm.getValue('Disabled') && (gm.getValue('caapPause') === 'none')) {
            if (global.is_chrome) {
                CE_message("paused", null, gm.getValue('caapPause', 'none'));
            }

            window.location.href = "http://apps.facebook.com/castle_age/index.php?bm=1";
        }
    },

    ReloadOccasionally: function () {
        var reloadMin = gm.getNumber('ReloadFrequency', 8);
        if (!reloadMin || reloadMin < 8) {
            reloadMin = 8;
        }

        nHtml.setTimeout(function () {
            if (caap.WhileSinceDidIt('clickedOnSomething', 5 * 60)) {
                global.log(1, 'Reloading if not paused after inactivity');
                if ((window.location.href.indexOf('castle_age') >= 0 || window.location.href.indexOf('reqs.php#confirm_46755028429_0') >= 0) &&
                        !gm.getValue('Disabled') && (gm.getValue('caapPause') === 'none')) {
                    if (global.is_chrome) {
                        CE_message("paused", null, gm.getValue('caapPause', 'none'));
                    }

                    window.location.href = "http://apps.facebook.com/castle_age/index.php?bm=1";
                }
            }

            global.ReloadOccasionally();
        }, 1000 * 60 * reloadMin + (reloadMin * 60 * 1000 * Math.random()));
    },

    hashStr: [
        '41030325072',
        '4200014995461306',
        '2800013751923752',
        '55577219620',
        '65520919503',
        '2900007233824090',
        '2900007233824090',
        '3100017834928060',
        '3500032575830770',
        '32686632448',
        '2700017666913321'
    ]
};
