
    ////////////////////////////////////////////////////////////////////
    //                          army OBJECT
    // this is the main object for dealing with Army
    /////////////////////////////////////////////////////////////////////

    army = {
        records: [],

        recordsTemp: [],

        perPage: 25,

        pageDone: true,

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        record: function () {
            this.data = {
                'user'   : '',
                'name'   : '',
                'userId' : '',
                'lvl'    : 0,
                'last'   : 0,
                'change' : 0,
                'elite'  : false
            };
        },
        /*jslint sub: false */

        hbest: 3,

        load: function () {
            try {
                army.records = gm.getItem('army.records', 'default');
                if (army.records === 'default' || !$j.isArray(army.records)) {
                    army.records = gm.setItem('army.records', []);
                }

                army.hbest = army.hbest === false ? JSON.hbest(army.records) : army.hbest;
                $u.log(3, "army.load Hbest", army.hbest);
                state.setItem("ArmyDashUpdate", true);
                $u.log(3, "army.load", army.records);
                return true;
            } catch (err) {
                $u.error("ERROR in army.load: " + err);
                return false;
            }
        },

        save: function () {
            try {
                var compress = false;
                gm.setItem('army.records', army.records, army.hbest, compress);
                state.setItem("ArmyDashUpdate", true);
                $u.log(3, "army.save", army.records);
                return true;
            } catch (err) {
                $u.error("ERROR in army.save: " + err);
                return false;
            }
        },

        loadTemp: function () {
            try {
                army.recordsTemp = ss.getItem('army.recordsTemp', 'default', true);
                if (army.recordsTemp === 'default' || !$j.isArray(army.recordsTemp)) {
                    army.recordsTemp = ss.setItem('army.recordsTemp', []);
                }

                $u.log(3, "army.loadTemp", army.recordsTemp);
                return true;
            } catch (err) {
                $u.error("ERROR in army.loadTemp: " + err);
                return false;
            }
        },

        saveTemp: function () {
            try {
                ss.setItem('army.recordsTemp', army.recordsTemp);
                $u.log(3, "army.saveTemp", army.recordsTemp);
                return true;
            } catch (err) {
                $u.error("ERROR in army.saveTemp: " + err);
                return false;
            }
        },

        deleteTemp: function () {
            try {
                ss.deleteItem('army.recordsTemp');
                ss.deleteItem('army.currentPage');
                army.recordsTemp = [];
                $u.log(3, "army.deleteTemp deleted");
                return true;
            } catch (err) {
                $u.error("ERROR in army.saveTemp: " + err);
                return false;
            }
        },

        init: function () {
            army.loadTemp();
            army.load();
            army.eliteFriendCheck();
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        setItem: function (record) {
            try {
                var it    = 0,
                    len   = 0,
                    found = false;

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if (army.records[it]['userId'] === record['userId']) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    army.records[it] = record;
                    $u.log(3, "Updated record");
                } else {
                    army.records.push(record);
                    $u.log(3, "Added record");
                }

                army.save();
                return record;
            } catch (err) {
                $u.error("ERROR in army.setItem: " + err);
                return undefined;
            }
        },

        getItem: function (userId) {
            try {
                var it    = 0,
                    len   = 0,
                    found = false;

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if (army.records[it]['userId'] === userId) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    $u.log(3, "Unable to find 'userId'", userId);
                }

                return found ? army.records[it] : {};
            } catch (err) {
                $u.error("ERROR in army.getItem: " + err);
                return undefined;
            }
        },

        deleteItem: function (userId) {
            try {
                var it    = 0,
                    len   = 0,
                    found = false;

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if (army.records[it]['userId'] === userId) {
                        army.records[it].splice(it, 1);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    $u.log(3, "Unable to find 'userId'", userId);
                } else {
                    army.save();
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.setItem: " + err);
                return false;
            }
        },

        page: function () {
            try {
                if (!army.pageDone) {
                    var pages  = $j(),
                        search = $j(),
                        record = {},
                        tStr   = '',
                        tNum   = 0,
                        pCount = 0,
                        it     = 0,
                        len    = 0,
                        number = ss.getItem("army.currentPage", 1, true);

                    if (number === 1) {
                        pages = $j("a[href*='army_member.php?page=']", caap.globalContainer).last();
                        tStr = $u.hasContent(pages) ? pages.attr("href") : '';
                        tNum = $u.hasContent(tStr) ? tStr.regex(/page=(\d+)/) : null;
                        pCount = $u.setContent(tNum, 1);
                        state.setItem("ArmyPageCount", pCount);
                    } else {
                        pCount = state.getItem("ArmyPageCount", 1);
                    }

                    search = $j("a[href*='comments.php?casuser=']", caap.globalContainer);
                    search.each(function () {
                        var el = $j(this);
                        record = new army.record();
                        record.data['userId'] = $u.setContent($u.setContent(el.attr("href"), '').regex(/casuser=(\d+)/), 0);
                        tStr = $u.setContent(el.parents("tr").eq(0).text(), '').trim().innerTrim();
                        record.data['user'] = $u.setContent(tStr.regex(new RegExp('(.+)\\s+"')), '').toString();
                        record.data['name'] = $u.setContent(tStr.regex(new RegExp('"(.+)"')), '').toString();
                        record.data['lvl'] = $u.setContent(tStr.regex(/Level\s+(\d+)/), 0);
                        record.data['last'] = new Date().getTime();
                        if ($u.hasContent(record.data['userId']) && record.data['userId'] > 0) {
                            army.recordsTemp.push(record.data);
                        } else {
                            $u.warn("army.page skipping record", record.data);
                        }
                    });

                    if (number === pCount) {
                        search = $j("a[href*='oracle.php']", $j("img[src*='bonus_member.jpg']", caap.appBodyDiv).parent().parent());
                        if ($u.hasContent(search)) {
                            len = $u.setContent($u.setContent(search.text(), '').regex(/Extra members x(\d+)/), 0);
                            for (it = 1; it <= len; it += 1) {
                                record = new army.record();
                                record.data['userId'] = 0 - it;
                                record.data['name'] = "Extra member " + it;
                                record.data['lvl'] = 0;
                                record.data['last'] = new Date().getTime();
                                army.recordsTemp.push(record.data);
                            }
                        }
                    }

                    ss.setItem("army.currentPage", army.saveTemp() ? number + 1 : number);
                    $u.log(2, "army.page", number, pCount, army.recordsTemp.length);
                    army.pageDone = true;
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.page: " + err);
                army.pageDone = true;
                caap.waitingForDomLoad = false;
                return false;
            }
        },

        run: function () {
            try {
                var expectedPageCount = 0,
                    currentPage       = 0,
                    scanDays          = $u.setContent(config.getItem("ArmyScanDays", 7), 7);

                currentPage = ss.getItem("army.currentPage", 1, true);
                expectedPageCount = state.getItem("ArmyPageCount", 0);
                if (!expectedPageCount) {
                    expectedPageCount = Math.ceil((caap.stats['army']['actual'] - 1) / army.perPage);
                    expectedPageCount = expectedPageCount ? expectedPageCount : 0;
                }

                if (currentPage > expectedPageCount) {
                    army.pageDone = false;
                    $u.log(3, "army.run", expectedPageCount);
                    if (caap.stats['army']['actual'] - 1 !== army.recordsTemp.length) {
                        $u.log(2, "Army size mismatch. Next schedule set 30 mins.", caap.stats['army']['actual'] - 1, army.recordsTemp.length);
                        schedule.setItem("army_member", 1800, 300);
                    } else {
                        army.merge();
                        schedule.setItem("army_member", scanDays * 86400, 300);
                        $u.log(2, "Army merge complete. Next schedule set " + scanDays + " days.", army.records);
                    }

                    army.deleteTemp();
                    return false;
                } else if (army.pageDone) {
                    army.pageDone = false;
                    caap.clickAjaxLinkSend("army_member.php?page=" + currentPage);
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.run: " + err);
                return false;
            }
        },

        merge: function () {
            try {
                var it     = 0,
                    len    = 0,
                    record = {};

                for (it = 0, len = army.recordsTemp.length; it < len; it += 1) {
                    record = army.getItem(army.recordsTemp[it]['userId']);
                    if ($u.hasContent(record)) {
                        army.recordsTemp[it]['elite'] = $u.setContent(record['elite'], false);
                        if (army.recordsTemp[it]['lvl'] > record['lvl']) {
                            army.recordsTemp[it]['change'] = army.recordsTemp[it]['last'];
                        } else {
                            if ($u.hasContent(record['change']) && record['change'] > 0) {
                                army.recordsTemp[it]['change'] = record['change'];
                            } else {
                                army.recordsTemp[it]['change'] = army.recordsTemp[it]['last'];
                            }
                        }

                        if (!$u.hasContent(army.recordsTemp[it]['name']) && $u.hasContent(record['name'])) {
                            army.recordsTemp[it]['name'] = record['name'];
                        }

                        if ($u.hasContent(army.recordsTemp[it]['name']) && $u.hasContent(record['name']) && army.recordsTemp[it]['user'] !== record['user']) {
                            army.recordsTemp[it]['name'] = record['name'];
                        }

                        if (!$u.hasContent(army.recordsTemp[it]['user']) && $u.hasContent(record['user'])) {
                            army.recordsTemp[it]['user'] = record['user'];
                        }

                        if ($u.hasContent(army.recordsTemp[it]['user']) && $u.hasContent(record['user']) && army.recordsTemp[it]['user'] !== record['user']) {
                            army.recordsTemp[it]['user'] = record['user'];
                        }

                        if (!$u.hasContent(army.recordsTemp[it]['lvl']) && $u.hasContent(record['lvl'])) {
                            army.recordsTemp[it]['lvl'] = record['lvl'];
                        }

                        if (!$u.hasContent(army.recordsTemp[it]['elite']) && $u.hasContent(record['elite'])) {
                            army.recordsTemp[it]['elite'] = record['elite'];
                        }
                    } else {
                        army.recordsTemp[it]['change'] = army.recordsTemp[it]['last'];
                    }
                }

                army.records = army.recordsTemp.slice();
                army.save();
                return true;
            } catch (err) {
                $u.error("ERROR in army.merge: " + err);
                return false;
            }
        },

        getIdList: function () {
            try {
                var it   = 0,
                    len  = 0,
                    list = [];

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if ($u.hasContent(army.records[it]['userId']) && army.records[it]['userId'] > 0) {
                        list.push(army.records[it]['userId']);
                    }
                }

                return list;
            } catch (err) {
                $u.error("ERROR in army.getIdList: " + err);
                return undefined;
            }
        },

        getEliteList: function () {
            try {
                var it   = 0,
                    len  = 0,
                    list = [];

                for (it = 0, len = army.records.length; it < len; it += 1) {
                    if ($u.hasContent(army.records[it]['userId']) && army.records[it]['userId'] > 0 && army.records[it]['elite']) {
                        list.push(army.records[it]['userId']);
                    }
                }

                return list;
            } catch (err) {
                $u.error("ERROR in army.getEliteList: " + err);
                return [];
            }
        },
        /*jslint sub: false */

        eliteCheckImg: function () {
            try {
                // Check for Elite Guard Add image
                if (config.getItem("EnableArmy", true) && config.getItem('AutoElite', true) && !config.getItem('AutoEliteIgnore', false) && caap.hasImage('elite_guard_add')) {
                    schedule.setItem('AutoEliteGetList', 0);
                    if (!state.getItem('AutoEliteFew', false)) {
                        state.setItem('AutoEliteEnd', '');
                    }

                    $u.log(1, "Detected spaces in Elite Guard: Scheduling");
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.eliteCheckImg: " + err);
                return false;
            }
        },

        eliteFull: function () {
            try {
                var eliteList = state.getItem('MyEliteTodo', []);
                schedule.setItem('AutoEliteGetList', 21600, 300);
                state.setItem('AutoEliteEnd', 'Full');
                state.setItem('AutoEliteListFilled', false);
                state.setItem('MyEliteTodo', army.eliteMerge(eliteList));
                return true;
            } catch (err) {
                $u.error("ERROR in army.eliteFull: " + err);
                return false;
            }
        },

        eliteResult: function () {
            try {
                if (/YOUR Elite Guard is FULL/i.test(caap.resultsText)) {
                    army.eliteFull();
                    $u.log(1, "Your Elite Guard is full");
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.eliteResult: " + err);
                return false;
            }
        },

        eliteMerge: function () {
            try {
                var theList = [];
                if ($u.hasContent(eliteArmyList)) {
                    var eliteArmyList = config.getList('EliteArmyList', '').concat(army.getEliteList());
                    eliteArmyList.concat(army.getIdList().filter(function (x) {
                        return !eliteArmyList.hasIndexOf(x);
                    }));

                    theList = state.setItem('MyEliteTodo', eliteArmyList);
                } else {
                    theList = state.setItem('MyEliteTodo', army.getIdList());
                }

                return theList;
            } catch (err) {
                $u.error("ERROR in army.eliteMerge: " + err);
                return undefined;
            }
        },

        eliteFriendCheck: function () {
            try {
                if (caap.stats['army']['actual'] < 11 || army.getIdList().length < 10) {
                    $u.log(1, 'Not enough friends to fill Elite Guard');
                    state.setItem('AutoEliteFew', true);
                } else {
                    state.setItem('AutoEliteFew', false);
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.eliteFriendCheck: " + err);
                return false;
            }
        },

        elite: function () {
            try {
                var eliteList = state.getItem('MyEliteTodo', []),
                    user      = 0;

                if (state.getItem('AutoEliteEnd', 'Full') !== 'Full') {
                    state.getItem('AutoEliteEnd', '');
                }

                if (!$j.isArray(eliteList) || !$u.hasContent(eliteList) || (state.getItem('AutoEliteFew', false) && !state.getItem('AutoEliteListFilled', false) && state.getItem('AutoEliteEnd', 'NoArmy') !== 'NoArmy')) {
                    $u.log(1, 'Reset list');
                    eliteList = army.eliteMerge();
                    state.setItem('AutoEliteEnd', '');
                    state.setItem('AutoEliteListFilled', true);
                }

                if (state.getItem('AutoEliteFew', false) && state.getItem('AutoEliteEnd', '') === 'NoArmy') {
                    $u.log(1, "Elite Full");
                    army.eliteFull();
                    return false;
                }

                if ($j.isArray(eliteList) && $u.hasContent(eliteList)) {
                    user = eliteList.shift();
                    $u.log(1, 'Add Elite Guard ID: ', user);
                    state.setItem('MyEliteTodo', eliteList);
                    if (!$u.hasContent(eliteList)) {
                        $u.log(2, 'Army list exhausted');
                        state.setItem('AutoEliteEnd', 'NoArmy');
                    }

                    caap.clickAjaxLinkSend('party.php?twt=jneg&jneg=true&user=' + user);
                    $u.log(1, "Return true");
                    return true;
                }

                $u.log(1, "Return false");
                return false;
            } catch (err) {
                $u.error("ERROR in army.elite: " + err);
                return undefined;
            }
        },

        menu: function () {
            try {
                var armyInstructions            = "Enable or disable the Army functions. Required when using CA's alternative URL.",
                    armyScanInstructions        = "Scan the army pages every X days.",
                    autoEliteInstructions       = "Enable or disable Auto Elite function. If running on web3 url then you must enable Army Functions also.",
                    autoEliteIgnoreInstructions = "Use this option if you have a small army and are unable to fill all 10 Elite positions. This prevents " +
                        "the script from checking for any empty places and will cause Auto Elite to run on its timer only.",
                    htmlCode = '';

                htmlCode += caap.startToggle('Army', 'ARMY OPTIONS');
                htmlCode += caap.makeCheckTR('Enable Army Functions', 'EnableArmy', true, armyInstructions);
                htmlCode += caap.startCheckHide('EnableArmy');
                htmlCode += caap.makeCheckTR('Auto Elite Army', 'AutoElite', false, autoEliteInstructions);
                htmlCode += caap.startCheckHide('AutoElite');
                htmlCode += caap.makeCheckTR('Timed Only', 'AutoEliteIgnore', false, autoEliteIgnoreInstructions);
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD("<input type='button' id='caap_resetElite' value='Do Now' style='padding: 0; font-size: 10px; height: 18px' />");
                htmlCode += caap.endTR;
                htmlCode += caap.startTR();
                htmlCode += caap.makeTD(caap.makeTextBox('EliteArmyList', "Try these UserIDs first. Use ',' between each UserID", '', ''));
                htmlCode += caap.endTR;
                htmlCode += caap.endCheckHide('AutoElite');
                htmlCode += caap.makeNumberFormTR("Scan Every (days)", 'ArmyScanDays', armyScanInstructions, 7, '', '');
                htmlCode += caap.makeCheckTR('Change Indicators', 'ArmyIndicators', false, '');
                htmlCode += caap.startCheckHide('ArmyIndicators');
                htmlCode += caap.makeNumberFormTR("Recent", 'ArmyAgeDaysColor0', '', '#008000', '', 'color', false, false, 50);
                htmlCode += caap.makeNumberFormTR("Warn 1 (days)", 'ArmyAgeDays1', '', 7, '', '');
                htmlCode += caap.makeNumberFormTR("Warn 2", 'ArmyAgeDaysColor1', '', '#ADFF2F', '', 'color', false, false, 50);
                htmlCode += caap.makeNumberFormTR("Warn 2 (days)", 'ArmyAgeDays2', '', 14, '', '');
                htmlCode += caap.makeNumberFormTR("Warn 3", 'ArmyAgeDaysColor2', '', '#FFD700', '', 'color', false, false, 50);
                htmlCode += caap.makeNumberFormTR("Warn 3 (days)", 'ArmyAgeDays3', '', 21, '', '');
                htmlCode += caap.makeNumberFormTR("Warn 4", 'ArmyAgeDaysColor3', '', '#FF8C00', '', 'color', false, false, 50);
                htmlCode += caap.makeNumberFormTR("Warn 4 (days)", 'ArmyAgeDays4', '', 28, '', '');
                htmlCode += caap.makeNumberFormTR("Warn 4", 'ArmyAgeDaysColor4', '', '#FF0000', '', 'color', false, false, 50);
                htmlCode += caap.endCheckHide('ArmyIndicators');
                htmlCode += caap.endCheckHide('EnableArmy');
                htmlCode += caap.endToggle;
                return htmlCode;
            } catch (err) {
                $u.error("ERROR in army.menu: " + err);
                return '';
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        dashboard: function () {
            try {
                /*-------------------------------------------------------------------------------------\
                Next we build the HTML to be included into the 'caap_army' div. We set our
                table and then build the header row.
                \-------------------------------------------------------------------------------------*/
                if (config.getItem('DBDisplay', '') === 'Army' && state.getItem("ArmyDashUpdate", true)) {
                    var headers                  = ['UserId', 'User', 'Name', 'Level', 'Change', 'Elite', '&nbsp;'],
                        values                   = ['userId', 'user', 'name', 'lvl',   'change'],
                        color                    = '',
                        pp                       = 0,
                        i                        = 0,
                        userIdLink               = '',
                        userIdLinkInstructions   = '',
                        removeLinkInstructions   = '',
                        len                      = 0,
                        len1                     = 0,
                        str                      = '',
                        header                   = {text: '', color: '', bgcolor: '', id: '', title: '', width: ''},
                        data                     = {text: '', color: '', bgcolor: '', id: '', title: ''},
                        handler                  = null,
                        head                     = '',
                        body                     = '',
                        row                      = '';

                    for (pp = 0; pp < headers.length; pp += 1) {
                        header = {
                            text    : headers[pp],
                            color   : '',
                            bgcolor : '',
                            id      : '',
                            title   : '',
                            width   : ''
                        };

                        switch (headers[pp]) {
                        case 'UserId':
                            header.width = '18%';
                            break;
                        case 'User':
                            header.width = '27%';
                            break;
                        case 'Name':
                            header.width = '30%';
                            break;
                        case 'Level':
                            header.width = '7%';
                            break;
                        case 'Change':
                            header.width = '10%';
                            break;
                        case 'Elite':
                            header.width = '7%';
                            break;
                        case '&nbsp;':
                            header.width = '1%';
                            break;
                        default:
                        }

                        head += caap.makeTh(header);
                    }

                    head = caap.makeTr(head);
                    for (i = 0, len = army.records.length; i < len; i += 1) {
                        if (army.records[i]["userId"] <= 0) {
                            continue;
                        }

                        row = "";
                        if (schedule.since(army.records[i]['change'], config.getItem("ArmyAgeDays4", 28) * 86400)) {
                            color = config.getItem("ArmyAgeDaysColor4", 'red');
                        } else if (schedule.since(army.records[i]['change'], config.getItem("ArmyAgeDays3", 21) * 86400)) {
                            color = config.getItem("ArmyAgeDaysColor3", 'darkorange');
                        } else if (schedule.since(army.records[i]['change'], config.getItem("ArmyAgeDays2", 14) * 86400)) {
                            color = config.getItem("ArmyAgeDaysColor2", 'gold');
                        } else if (schedule.since(army.records[i]['change'], config.getItem("ArmyAgeDays1", 7) * 86400)) {
                            color = config.getItem("ArmyAgeDaysColor1", 'greenyellow');
                        } else {
                            color = config.getItem("ArmyAgeDaysColor0", 'green');
                        }

                        for (pp = 0, len1 = values.length; pp < len1; pp += 1) {
                            if (values[pp] === "change") {
                                row += caap.makeTd({
                                    text    : $u.hasContent(army.records[i][values[pp]]) && ($u.isString(army.records[i][values[pp]]) || army.records[i][values[pp]] > 0) ? $u.makeTime(army.records[i][values[pp]], "d-m-Y") : '',
                                    bgcolor : color,
                                    color   : $u.bestTextColor(color),
                                    id      : '',
                                    title   : ''
                                });
                            } else if (values[pp] === "userId") {
                                str = $u.setContent(army.records[i][values[pp]], '');
                                userIdLinkInstructions = "Clicking this link will take you to the user keep of " + str;
                                userIdLink = caap.domain.link + "/keep.php?casuser=" + str;
                                data = {
                                    text  : '<span id="caap_targetarmy_' + i + '" title="' + userIdLinkInstructions + '" rlink="' + userIdLink +
                                            '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + str + '</span>',
                                    color : 'blue',
                                    id    : '',
                                    title : ''
                                };

                                row += caap.makeTd(data);
                            } else {
                                row += caap.makeTd({
                                    text  : $u.hasContent(army.records[i][values[pp]]) && ($u.isString(army.records[i][values[pp]]) || army.records[i][values[pp]] > 0) ? army.records[i][values[pp]] : '',
                                    color : '',
                                    id    : '',
                                    title : ''
                                });
                            }
                        }

                        data = {
                            text  : '<input id="caap_elitearmy_' + i + '" type="checkbox" title="Use to fill elite guard first" userid="' + army.records[i]['userId'] + '" cstate="' + (army.records[i]['elite'] ? 'true' : 'false') + '" ' + (army.records[i]['elite'] ? ' checked' : '') + ' />',
                            color : 'blue',
                            id    : '',
                            title : ''
                        };

                        row += caap.makeTd(data);

                        removeLinkInstructions = "Clicking this link will remove " + army.records[i]['user'].escapeHTML() + " from your army!";
                        data = {
                            text  : '<span id="caap_removearmy_' + i + '" title="' + removeLinkInstructions + '" userid="' + army.records[i]['userId'] + '" mname="' + army.records[i]['user'].escapeHTML() +
                                    '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';" class="ui-icon ui-icon-circle-close">X</span>',
                            color : 'blue',
                            id    : '',
                            title : ''
                        };

                        row += caap.makeTd(data);
                        body += caap.makeTr(row);
                    }

                    $j("#caap_army", caap.caapTopObject).html(
                        $j(caap.makeTable("army", head, body)).dataTable({
                            "bAutoWidth"    : false,
                            "bFilter"       : false,
                            "bJQueryUI"     : false,
                            "bInfo"         : false,
                            "bLengthChange" : false,
                            "bPaginate"     : false,
                            "bProcessing"   : false,
                            "bStateSave"    : true,
                            "bSortClasses"  : false,
                            "aoColumnDefs"  : [
                                {
                                    "bSortable" : false,
                                    "aTargets"  : [6]
                                },
                                {
                                    "sSortDataType" : "dom-checkbox",
                                    "aTargets"      : [5]
                                },
                                {
                                    "sSortDataType" : "scan-date",
                                    "aTargets"      : [4]
                                }
                            ]
                        })
                    );

                    handler = function (e) {
                        var visitUserIdLink = {
                                rlink     : '',
                                arlink    : ''
                            },
                            i   = 0,
                            len = 0;

                        for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                            if (e.target.attributes[i].nodeName === 'rlink') {
                                visitUserIdLink.rlink = e.target.attributes[i].nodeValue;
                                visitUserIdLink.arlink = visitUserIdLink.rlink.replace(caap.domain.link + "/", "");
                            }
                        }

                        caap.clickAjaxLinkSend(visitUserIdLink.arlink);
                    };

                    $j("span[id*='caap_targetarmy_']", caap.caapTopObject).unbind('click', handler).click(handler);

                    handler = function (e) {
                        var userid = 0,
                            cstate = false,
                            i      = 0,
                            len    = 0,
                            record = {};

                        for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                            if (e.target.attributes[i].nodeName === 'userid') {
                                userid = e.target.attributes[i].nodeValue.parseInt();
                            } else if (e.target.attributes[i].nodeName === 'cstate') {
                                cstate = e.target.attributes[i].nodeValue === 'true' ? true : false;
                            }
                        }

                        if ($u.hasContent(userid) && userid > 0) {
                            record = army.getItem(userid);
                            record['elite'] = !cstate;
                            army.setItem(record);
                            state.setItem("ArmyDashUpdate", true);
                            caap.updateDashboard(true);
                        }
                    };

                    $j("input[id*='caap_elitearmy_']", caap.caapTopObject).unbind('change', handler).change(handler);

                    handler = function (e) {
                        var mname  = '',
                            userid = '',
                            i      = 0,
                            len    = 0,
                            resp   = false;

                        for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                            if (e.target.attributes[i].nodeName === 'userid') {
                                userid = e.target.attributes[i].nodeValue.parseInt();
                            } else if (e.target.attributes[i].nodeName === 'mname') {
                                mname = e.target.attributes[i].nodeValue;
                            }
                        }

                        resp = confirm("Are you sure you want to remove " + mname + " from your army?");
                        if (resp === true) {
                            caap.clickAjaxLinkSend("army_member.php?action=delete&player_id=" + userid);
                            army.deleteItem(userid);
                            state.setItem("ArmyDashUpdate", true);
                            caap.updateDashboard(true);
                        }
                    };

                    $j("span[id*='caap_removearmy_']", caap.caapTopObject).unbind('click', handler).click(handler);

                    state.setItem("ArmyDashUpdate", false);
                }

                return true;
            } catch (err) {
                $u.error("ERROR in army.dashboard: " + err);
                return false;
            }
        }
        /*jslint sub: false */
    };
