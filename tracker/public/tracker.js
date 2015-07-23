(function (window, document) {
    "use strict";

    var data = [],
        gif  = '//localhost:4000/tracker/public/index.php/img.gif',
        xhr,
        queryString = '';

    // 1. gather data
    // See: https://panopticlick.eff.org to understand why these data matter
    data['screen_width']   = window.screen.width;
    data['screen_height']  = window.screen.height;
    data['screen_scope']   = window.screen.colorDepth;
    data['browser_plugin'] = [];
    var navigatorPluginsLength = navigator.plugins.length;
    for (var i = 0; i < navigatorPluginsLength; i++) {
        data['browser_plugin'].push(navigator.plugins[i].name);
    }
    data['browser_plugin'] = data['browser_plugin'].join();
    data['time_zone']      = new Date().getTimezoneOffset();
    data['cookie_enabled'] = navigator.cookieEnabled;
    data['system_fonts'] = [];
    var d = new Detector();
    var fontListLength = fontlist.length;
    for (var i = 0; i < fontListLength; i++) {
        if(d.detect(fontlist[i])) {
            data['system_fonts'].push(fontlist[i]);
        }
    }
    data['system_fonts'] = data['system_fonts'].join();

    var _d = [];
    for (var name in data) {
        _d.push([ name, '=', encodeURIComponent(data[name]) ].join(''));
    }

    queryString = _d.join('&');

    // 2. trigger a GET request
    // See: https://themouette.github.io/slides-edu-frontend/lesson3.html#/2/6
    function create_xhr_object() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }

        if (window.ActiveXObject) {
            var names = [
                "Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0",
                "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"
            ];

            for(var i in names) {
                try {
                    return new ActiveXObject(names[i]);
                } catch (e) {}
            }
        }

        return null;
    }

    xhr = create_xhr_object();
    xhr.open('GET', [ gif, queryString ].join('?'));
    xhr.send();
})(window, document);
