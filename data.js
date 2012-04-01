var talks = [
    {
        "title" : "10 практических советов о том, как нанять лучшего IT-специалиста",
        "author" : "Алена Владимирская, PRUFFI",
        "start" : 1333366200000,
        "end" : 1333368900000,
        "room" : 1,
        "type" : "management"
    },
    {
        "title" : "Распределенные кэши: подводные камни",
        "author" : "Иван Головач",
        "start" : 1333366200000,
        "end" : 1333368900000,
        "room" : 2,
        "type" : "server-side"
    },
    {
        "title" : "Быстрый удар точно в цель",
        "author" : "Артемий Ломов",
        "start" : 1333366200000,
        "end" : 1333368000000,
        "room" : 3,
        "type" : "client-side"
    },
    {
        "title" : "HR для не HR менеджеров",
        "author" : "Александр Зиза, Алетейя-Бизнес",
        "start" : 1333368900000,
        "end" : 1333371600000,
        "room" : 1,
        "type" : "management"
    },
    {
        "title" : "JavaScript на сервере, 1ms на трансформацию",
        "author" : "Андрей Сумин, Mail.ru",
        "start" : 1333368900000,
        "end" : 1333371600000,
        "room" : 2,
        "type" : "server-side"
    },
    {
        "title" : "Эффекты OpenType в современной веб-типографике",
        "author" : "Ростислав Чебыкин",
        "start" : 1333367100000,
        "end" : 1333369800000,
        "room" : 3,
        "type" : "client-side"
    },
    {
        "title" : "Зачем переписывать то, что и так работает",
        "author" : "Сергей Константинов, Яндекс",
        "start" : 1333369800000,
        "end" : 1333371600000,
        "room" : 3,
        "type" : "client-side"
    }


];
    //{
        //"title" : "",
        //"author" : "",
        //"start" : ,
        //"end" : ,
        //"room" : 1,
        //"type" : ""
    //}
    //{
        //"title" : "",
        //"author" : "",
        //"start" : ,
        //"end" : ,
        //"room" : 1,
        //"type" : ""
    //}

    //{
        //"title" : "",
        //"author" : "",
        //"start" : ,
        //"end" : ,
        //"room" : 1,
        //"type" : ""
    //}

inArray = Array.prototype.indexOf ?
    function (arr, val) {
        return arr.indexOf(val) != -1;
    } :
    function (arr, val) {
        var i = arr.length;
        while (i--) {
            if (a[i] === val) {
                return true;
            }
        }
        return false;
    };

var app = {
    debug : false,
    timeline : '',
    fav: '',
    favList : [],
    timeStep : 900000,
    rooms : [ [], [], [] ],
    roomTitles : ['Главный зал', 'Зал 2', 'Зал 3'],

    init : function (data) {
        data = this.prepareData(data);
        this.buildRooms(data);

        this.initFavNav();
        if(location.hash === '#favorites') {
            this.showFav();
            return;
        }

        this.buildTimeline();
        this.drawTimeline();
        this.setFavsCheckboxes();
    },

    showTimeline : function () {
        this.favList = [];
        this.buildTimeline();
        this.drawTimeline();
        this.setFavsCheckboxes();
        return false;
    },

    showFav : function () {
        var fav = this.getCookie('favorites');
        this.favList = [];
        if (fav) {
            this.fav = '<ul class="fav">';
            if (fav.indexOf(',') !== -1) {
                fav = fav.split(',');
               for (var i=0; i < fav.length; i++) {
                   this.collectFavItem(fav[i]);
               }
            } else {
                this.collectFavItem(fav);
            }
            this.favList.sort(function (a, b) {
                return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : 0);
            });
            this.buildFavItems();
            this.fav+= '</ul>';
            document.getElementById('content').innerHTML = this.fav;
        } else {
            //location.assign('index.html#');
        }
        return false;
    },

    collectFavItem : function (fav) {
       for (var n = 0, l = talks.length; n < l; n++) {
           if (talks[n].id === fav) {
               this.favList[this.favList.length] = talks[n];
           }
       }
    },

    buildFavItems : function () {
        for (var i = 0, fl = this.favList.length; i < fl; i++) {
            for (var n = 0, l = talks.length; n < l; n++) {
                if (talks[n].id === this.favList[i].id) {
                    var talk = talks[n],
                    dtStart = new Date(talk.start),
                    time = dtStart.getHours() + ':' + dtStart.getMinutes();
                    this.fav += '' +
                        '<li>' +
                        '<span class="time">' + time + '</span>, ' +
                        '<span class="room">' + this.roomTitles[talk.room -1] + '</span>: ' +
                        '<span class="title">' + talk.title + '</span> ' +
                        '<span class="author">' + talk.author + '</span>' +
                        '</li>';
                }
            }
       }
    },

    buildRooms : function (data) {
        for (var d = data.length, i = 0; d > i; i++) {
            var n = data[i].room - 1,
                talk = this.buildTalk(data[i]),
                rs = this.getRowspan(data[i]) - 1;
            this.rooms[n][this.rooms[n].length] = talk;
            // добавляем отступы, которые нужны для строительства table/tr
            while (rs > 0) {
                this.rooms[n].push('');
                rs--;
            }
        }
    },

    setFavsCheckboxes : function() {
        var fav = this.getCookie('favorites');
        if (fav) {
            if (fav.indexOf(',')) {
                fav = fav.split(',');
            }
            if (Object.prototype.toString.call(fav) == '[object Array]') {
                for (var k = 0, l = fav.length; l > k; k++) {
                    document.getElementById(fav[k]).checked = true;
                }
            } else {
                var f = document.getElementById(fav);
                if (f) {
                    f.checked = true;
                }
            }
        } else {
            var tip = document.getElementById('tip');
            tip.className = 'show';
            tip.innerHTML = 'Это неофициальная легкая, мобильная версия программы конференции РИТ++. Отметьте доклады, которые вам интересны и следуйте по соответствующим залам.';
        }
    },

    // На данный момент добавляет в JSON свойства id.
    prepareData : function (data) {
        var ret = data;
        for (var i=0; i < ret.length; i++) {
            ret[i].id = 'id_' + ret[i].start + '_' + ret[i].end + '_' + ret[i].room;
        }
        return ret;
    },

    getRowspan : function (talk) {
        return (talk.end - talk.start) / this.timeStep;
    },

    buildTalk : function (talk) {
        var rowspan = this.getRowspan(talk),
            id = talk.id,
            dtStart = new Date(talk.start),
            time = dtStart.getHours() + ':' + dtStart.getMinutes(),
            ret = '<td class="talk room_' + talk.room + ' type_' + talk.type + '" rowspan="' + rowspan + '">' +
                        '<input type="checkbox" name="' + id + '" id="' + id + '" onchange="app.refreshFavorites(this.id)">' +
                        '<label for="' + id + '">' +
                            '<span class="time">' + time + '</span> ' +
                           '<span class="title">' + talk.title + '</span>' +
                           '<span class="author">' + talk.author + '</span>' +
                       '</label>' +
                    '</td>';
        return ret;
    },

    buildTimeline : function () {
        this.timeline = this.buildTimelineHeader();
        for (var l = this.rooms[0].length, i = 0; l > i; i++) {
            this.timeline += '<tr>';
            for (var k = this.rooms.length, n = 0; k > n; n++) {
                this.timeline += this.rooms[n][i] || '';
            }
            this.timeline += '</tr>';
        }
        return this.timeline;
    },

    buildTimelineHeader : function () {
        var h = '';
        for (var l = this.rooms.length, i = 0; l > i; i++) {
            h += '<th>' + this.roomTitles[i] + '</th>';
        }
        return '<thead><tr>' + h + '</tr></thead>';
    },

    drawTimeline : function () {
        var t = document.createElement('table');
        t.id = 'timeline';
        t.className = 'timeline';
        t.innerHTML = this.timeline;
        document.getElementById('content').innerHTML = '';
        document.getElementById('content').appendChild(t);
    },

    logTime : function () {
        var fDayStart = new Date('Mon Apr 02 2012 10:00:00 GMT+0400 (MSK)').getTime(),
            fDayEnd = new Date('Mon Apr 02 2012 19:00:00 GMT+0400 (MSK)').getTime();
        console.log('Rit starts at 2 apr, 10:00: ', fDayStart);
        for (var time = fDayStart; fDayEnd >= time; time += this.timeStep) {
            var t = new Date(time),
            m = t.getMinutes() || '00';
            console.log(t.getHours() + ':' + m, time);
        }
    },

    setCookie : function (name, val, exdays) {
        var exdate = new Date(),
            c_val;
        exdate.setDate(exdate.getDate() + exdays);
        c_val = escape(val) + ((exdays === null) ? "" : "; expires = " + exdate.toUTCString());
        document.cookie = name + '=' + c_val;
    },

    getCookie : function (name) {
        var i, x, y, ARRcookies = document.cookie.split(';');
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
            x= x.replace(/^\s+|\s+$/g,'');
            if (x === name) {
                return unescape(y);
            }
        }
        return;
    },

    addFavorites : function (id) {
        var fav = this.getCookie('favorites');
        if (fav) {
            // если уже есть такой ключ в куках то ничего не делаем
            if (inArray(fav.split(','), id)) { return false; }
            fav += ',';
        } else {
            fav = '';
        }
        fav += id;
        this.setCookie('favorites', fav, 10);

        if (fav !== '') {
            document.getElementById('modes').className = '';
        }
    },

    removeFavorites : function (id) {
        if (this.isFavorite(id)) {
            var fav = this.getCookie('favorites');
            if (fav.indexOf(id + ',') !== -1) {
                id = id + ',';
            } else if (fav.indexOf(',' + id) !== -1) {
                id = ',' + id;
            }
            fav = fav.replace(id, '');
            this.setCookie('favorites', fav, 10);

            if (fav === '') {
                document.getElementById('modes').className = 'modes_hidden';
            }
        }
    },

    isFavorite : function (id) {
        var ret = false,
            fav = this.getCookie('favorites'),
            arr = fav.split(',');
        if (fav && inArray(arr, id)) {
            ret = true;
        }
        return ret;
    },

    refreshFavorites : function (id) {
        if (document.getElementById(id).checked) {
            this.addFavorites(id);
        } else {
            this.removeFavorites(id);
        }
    },

    initFavNav : function () {
        var fav = this.getCookie('favorites');
        if (fav) {
            document.getElementById('modes').className = '';
        }
    //},

    //listen : function (evnt, elem, func) {
        //if (elem.addEventListener)  // W3C DOM
            //elem.addEventListener(evnt,func,false);
        //else if (elem.attachEvent) { // IE DOM
             //var r = elem.attachEvent("on"+evnt, func);
        //return r;
        //}
        //else {
            //console.error('ups');
        //}
    }
};

//app.logTime(); // unixtime generator
app.init(talks);
