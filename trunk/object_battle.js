////////////////////////////////////////////////////////////////////
//                          battle OBJECT
// this is the main object for dealing with battles
/////////////////////////////////////////////////////////////////////

battle = {
    records : [],

    record: function () {
        this.data = {
            userId          : 0,
            nameStr         : '',
            rankStr         : '',
            rankNum         : 0,
            warRankStr      : '',
            warRankNum      : 0,
            levelNum        : 0,
            armyNum         : 0,
            deityNum        : 0,
            deityStr        : '',
            invadewinsNum   : 0,
            invadelossesNum : 0,
            duelwinsNum     : 0,
            duellossesNum   : 0,
            warwinsNum      : 0,
            warlossesNum    : 0,
            defendwinsNum   : 0,
            defendlossesNum : 0,
            statswinsNum    : 0,
            statslossesNum  : 0,
            goldNum         : 0,
            chainCount      : 0,
            invadeLostTime  : new Date(2009, 0, 1).getTime(),
            duelLostTime    : new Date(2009, 0, 1).getTime(),
            warLostTime     : new Date(2009, 0, 1).getTime(),
            deadTime        : new Date(2009, 0, 1).getTime(),
            chainTime       : new Date(2009, 0, 1).getTime(),
            ignoreTime      : new Date(2009, 0, 1).getTime(),
            aliveTime       : new Date(2009, 0, 1).getTime(),
            attackTime      : new Date(2009, 0, 1).getTime(),
            selectTime      : new Date(2009, 0, 1).getTime()
        };
    },

    battleRankTable: {
        0  : 'Acolyte',
        1  : 'Scout',
        2  : 'Soldier',
        3  : 'Elite Soldier',
        4  : 'Squire',
        5  : 'Knight',
        6  : 'First Knight',
        7  : 'Legionnaire',
        8  : 'Centurion',
        9  : 'Champion',
        10 : 'Lieutenant Commander',
        11 : 'Commander',
        12 : 'High Commander',
        13 : 'Lieutenant General',
        14 : 'General',
        15 : 'High General',
        16 : 'Baron',
        17 : 'Earl',
        18 : 'Duke',
        19 : 'Prince',
        20 : 'King',
        21 : 'High King'
    },

    warRankTable: {
        0  : 'No Rank',
        1  : 'Reserve',
        2  : 'Footman',
        3  : 'Corporal',
        4  : 'Lieutenant',
        5  : 'Captain',
        6  : 'First Captain',
        7  : 'Blackguard',
        8  : 'Warguard',
        9  : 'Master Warguard',
        10 : 'Lieutenant Colonel',
        11 : 'Colonel',
        12 : 'First Colonel'
    },

    log: function (level, text) {
        try {
            var snapshot = [];
            if (utility.logLevel >= level) {
                $.merge(snapshot, this.records);
                utility.log(level, text, snapshot);
            }

            return true;
        } catch (err) {
            utility.error("ERROR in battle.log: " + err);
            return false;
        }
    },

    load: function () {
        try {
            if (gm.getItem('battle.records', 'default') === 'default' || !$.isArray(gm.getItem('battle.records', 'default'))) {
                gm.setItem('battle.records', this.records);
            } else {
                this.records = gm.getItem('battle.records', this.records);
            }

            state.setItem("BattleDashUpdate", true);
            this.log(2, "battle.load");
            return true;
        } catch (err) {
            utility.error("ERROR in battle.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            gm.setItem('battle.records', this.records);
            state.setItem("BattleDashUpdate", true);
            this.log(2, "battle.save");
            return true;
        } catch (err) {
            utility.error("ERROR in battle.save: " + err);
            return false;
        }
    },

    clear: function () {
        try {
            this.records = gm.setItem("battle.records", []);
            state.setItem("BattleDashUpdate", true);
            return true;
        } catch (err) {
            utility.error("ERROR in battle.clear: " + err);
            return false;
        }
    },

    getItem: function (userId) {
        try {
            var it        = 0,
                success   = false,
                newRecord = null;

            if (!utility.isNum(userId) || userId < 1) {
                utility.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            for (it = 0; it < this.records.length; it += 1) {
                if (this.records[it].userId === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                utility.log(2, "Got battle record", userId, this.records[it]);
                return this.records[it];
            } else {
                newRecord = new this.record();
                newRecord.data.userId = userId;
                utility.log(2, "New battle record", userId, newRecord.data);
                return newRecord.data;
            }
        } catch (err) {
            utility.error("ERROR in battle.getItem: " + err, arguments.callee.caller);
            return false;
        }
    },

    setItem: function (record) {
        try {
            if (!record || utility.typeOf(record) !== 'object') {
                throw "Not passed a record";
            }

            if (!utility.isNum(record.userId) || record.userId < 1) {
                utility.warn("userId", record.userId);
                throw "Invalid identifying userId!";
            }

            var it      = 0,
                success = false;

            for (it = 0; it < this.records.length; it += 1) {
                if (this.records[it].userId === record.userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                this.records[it] = record;
                utility.log(2, "Updated battle record", record, this.records);
            } else {
                this.records.push(record);
                utility.log(2, "Added battle record", record, this.records);
            }

            this.save();
            return true;
        } catch (err) {
            utility.error("ERROR in battle.setItem: " + err, record);
            return false;
        }
    },

    deleteItem: function (userId) {
        try {
            var it        = 0,
                success   = false;

            if (!utility.isNum(userId) || userId < 1) {
                utility.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            for (it = 0; it < this.records.length; it += 1) {
                if (this.records[it].userId === userId) {
                    success = true;
                    break;
                }
            }

            if (success) {
                this.records.splice(it, 1);
                this.save();
                utility.log(2, "Deleted battle record", userId, this.records);
                return true;
            } else {
                utility.warn("Unable to delete battle record", userId, this.records);
                return false;
            }
        } catch (err) {
            utility.error("ERROR in battle.deleteItem: " + err);
            return false;
        }
    },

    hashCheck: function (userId) {
        try {
            var hash = '',
                hashes = ["f503b318ea6e780c03f39ed9fdc0dd47a688729c"];

            if (!hashes.length || !gm.getItem('AllowProtected', true, hiddenVar)) {
                return false;
            }

            if (!utility.isNum(userId) || userId < 1) {
                utility.warn("userId", userId);
                throw "Invalid identifying userId!";
            }

            hash = utility.SHA1(userId.toString());
            return (hashes.indexOf(hash) >= 0);
        } catch (err) {
            utility.error("ERROR in battle.hashCheck: " + err);
            return false;
        }
    },

    flagResult: false,

    getResult: function () {
        try {
            var resultsDiv    = null,
                tempDiv       = null,
                tempText      = '',
                tempArr       = [],
                battleRecord  = {},
                warWinLoseImg = '',
                result        = {
                    userId     : 0,
                    userName   : '',
                    battleType : '',
                    points     : 0,
                    gold       : 0,
                    win        : false,
                    hiding     : false
                };

            if ($("#app46755028429_results_main_wrapper img[src*='battle_victory.gif']").length) {
                warWinLoseImg = 'war_win_left.jpg';
                result.win = true;
            } else if ($("#app46755028429_results_main_wrapper img[src*='battle_defeat.gif']").length) {
                warWinLoseImg = 'war_lose_left.jpg';
            } else {
                resultsDiv = $("#app46755028429_results_main_wrapper span[class='result_body']");
                if (resultsDiv && resultsDiv.length) {
                    tempText = $.trim(resultsDiv.text());
                    if (tempText && tempText.match(/Your opponent is hiding, please try again/)) {
                        result.hiding = true;
                        utility.log(1, "Your opponent is hiding");
                        return result;
                    } else {
                        throw "Unable to determine won, lost or hiding!";
                    }
                } else {
                    throw "Unable to determine won or lost!";
                }
            }

            if ($("#app46755028429_results_main_wrapper img[src*='war_button_war_council.gif']").length) {
                result.battleType = 'War';
                resultsDiv = $("#app46755028429_results_main_wrapper div[class='result']");
                if (resultsDiv && resultsDiv.length) {
                    tempDiv = resultsDiv.find("img[src*='war_rank_small_icon']:first");
                    if (tempDiv && tempDiv.length) {
                        tempText = $.trim(tempDiv.parent().text());
                        if (tempText) {
                            result.points = ((/\d+\s+War Points/i.test(tempText)) ? utility.NumberOnly(tempText.match(/\d+\s+War Points/i)) : 0);
                        } else {
                            utility.warn("Unable to find war points text in", tempDiv.parent());
                        }
                    } else {
                        utility.log(2, "Unable to find war_rank_small_icon in", resultsDiv);
                    }

                    tempDiv = resultsDiv.find("b[class*='gold']:first");
                    if (tempDiv && tempDiv.length) {
                        tempText = $.trim(tempDiv.text());
                        if (tempText) {
                            result.gold = utility.NumberOnly(tempText);
                        } else {
                            utility.warn("Unable to find gold text in", tempDiv);
                        }
                    } else {
                        utility.warn("Unable to find gold element in", resultsDiv);
                    }

                    tempDiv = resultsDiv.find("input[name='target_id']:first");
                    if (tempDiv && tempDiv.length) {
                        tempText = tempDiv.attr("value");
                        if (tempText) {
                            result.userId = parseInt(tempText, 10);
                        } else {
                            utility.warn("No value in", tempDiv);
                            throw "Unable to get userId!";
                        }
                    } else {
                        utility.warn("Unable to find target_id in", resultsDiv);
                        throw "Unable to get userId!";
                    }

                    tempDiv = $("div[style*='" + warWinLoseImg + "']");
                    if (tempDiv && tempDiv.length) {
                        tempText = $.trim(tempDiv.text());
                        if (tempText) {
                            result.userName = tempText.replace("'s Defense", '');
                        } else {
                            utility.warn("Unable to match user's name in", tempText);
                        }
                    } else {
                        utility.warn("Unable to find ", warWinLoseImg);
                    }
                } else {
                    utility.warn("Unable to find result div");
                    throw "Unable to get userId!";
                }
            } else {
                if ($("#app46755028429_results_main_wrapper input[src*='battle_invade_again.gif']").length) {
                    result.battleType = 'Invade';
                } else if ($("#app46755028429_results_main_wrapper input[src*='battle_duel_again.gif']").length) {
                    result.battleType = 'Duel';
                } else {
                    if ($("#app46755028429_results_main_wrapper img[src*='icon_weapon.gif']").length) {
                        result.battleType = 'Duel';
                    } else if ($("#app46755028429_results_main_wrapper div[class='full_invade_results']").length) {
                        result.battleType = 'Invade';
                    }
                }

                if (result.battleType) {
                    resultsDiv = $("#app46755028429_results_main_wrapper div[class='result']");
                    if (resultsDiv && resultsDiv.length) {
                        tempDiv = resultsDiv.find("img[src*='battle_rank_small_icon']:first");
                        if (tempDiv && tempDiv.length) {
                            tempText = $.trim(tempDiv.parent().text());
                            if (tempText) {
                                result.points = ((/\d+\s+Battle Points/i.test(tempText)) ? utility.NumberOnly(tempText.match(/\d+\s+Battle Points/i)) : 0);
                            } else {
                                utility.warn("Unable to find battle points text in", tempDiv.parent());
                            }
                        } else {
                            utility.log(2, "Unable to find battle_rank_small_icon in", resultsDiv);
                        }

                        tempDiv = resultsDiv.find("b[class*='gold']:first");
                        if (tempDiv && tempDiv.length) {
                            tempText = $.trim(tempDiv.text());
                            if (tempText) {
                                result.gold = utility.NumberOnly(tempText);
                            } else {
                                utility.warn("Unable to find gold text in", tempDiv);
                            }
                        } else {
                            utility.warn("Unable to find gold element in", resultsDiv);
                        }

                        tempDiv = resultsDiv.find("a[href*='keep.php?casuser=']:first");
                        if (tempDiv && tempDiv.length) {
                            tempText = tempDiv.attr("href");
                            if (tempText) {
                                tempArr = tempText.match(/user=(\d+)/i);
                                if (tempArr && tempArr.length === 2) {
                                    result.userId = parseInt(tempArr[1], 10);
                                } else {
                                    utility.warn("Unable to match user's id in", tempText);
                                    throw "Unable to get userId!";
                                }

                                tempText = $.trim(tempDiv.text());
                                if (tempText) {
                                    result.userName = tempText;
                                } else {
                                    utility.warn("Unable to match user's name in", tempText);
                                }
                            } else {
                                utility.warn("No href text in", tempDiv);
                                throw "Unable to get userId!";
                            }
                        } else {
                            utility.warn("Unable to find keep.php?casuser= in", resultsDiv);
                            throw "Unable to get userId!";
                        }
                    } else {
                        utility.warn("Unable to find result div");
                        throw "Unable to get userId!";
                    }
                } else {
                    utility.warn("Unable to determine battle type");
                    throw "Unable to get userId!";
                }
            }

            battleRecord = this.getItem(result.userId);
            battleRecord.attackTime = new Date().getTime();
            if (result.userName && result.userName !== battleRecord.nameStr) {
                utility.log(1, "Updating battle record user name, from/to", battleRecord.nameStr, result.userName);
                battleRecord.nameStr = result.userName;
            }

            if (result.win) {
                battleRecord.statswinsNum += 1;
            } else {
                battleRecord.statslossesNum += 1;
            }

            switch (result.battleType) {
            case 'Invade' :
                if (result.win) {
                    battleRecord.invadewinsNum += 1;
                } else {
                    battleRecord.invadelossesNum += 1;
                    battleRecord.invadeLostTime = new Date().getTime();
                }

                break;
            case 'Duel' :
                if (result.win) {
                    battleRecord.duelwinsNum += 1;
                } else {
                    battleRecord.duellossesNum += 1;
                    battleRecord.duelLostTime = new Date().getTime();
                }

                break;
            case 'War' :
                if (result.win) {
                    battleRecord.warwinsNum += 1;
                } else {
                    battleRecord.warlossesNum += 1;
                    battleRecord.warLostTime = new Date().getTime();
                }

                break;
            default :
                utility.warn("Battle type unknown!", result.battleType);
            }

            this.setItem(battleRecord);
            return result;
        } catch (err) {
            utility.error("ERROR in battle.getResult: " + err);
            return false;
        }
    },

    deadCheck: function () {
        try {
            var resultsDiv   = null,
                resultsText  = '',
                battleRecord = {},
                dead         = false;

            resultsDiv = $("div[class='results']");
            if (resultsDiv && resultsDiv.length) {
                resultsText = $.trim(resultsDiv.text());
                if (resultsText) {
                    if (resultsText.match(/Your opponent is dead or too weak to battle/)) {
                        utility.log(1, "This opponent is dead or hiding: ", state.getItem("lastBattleID", 0));
                        if (state.getItem("lastBattleID", 0)) {
                            battleRecord = battle.getItem(state.getItem("lastBattleID", 0));
                            battleRecord.deadTime = new Date().getTime();
                            battle.setItem(battleRecord);
                        }

                        dead = true;
                    }
                } else {
                    utility.warn("Unable to find results text in", resultsDiv);
                    throw "Unable to determine if user is dead!";
                }
            } else {
                throw "Unable to find any results!";
            }

            return dead;
        } catch (err) {
            utility.error("ERROR in battle.deadCheck: " + err);
            return undefined;
        }
    },

    checkResults: function () {
        try {
            var battleRecord = {},
                tempTime     = 0,
                chainBP      = 0,
                chainGold    = 0,
                maxChains    = 0,
                result       = {
                    userId     : 0,
                    userName   : '',
                    battleType : '',
                    points     : 0,
                    gold       : 0,
                    win        : false,
                    hiding     : false
                };

            if (this.deadCheck() !== false) {
                return true;
            }

            result = this.getResult();
            if (!result || result.hiding === true) {
                return true;
            }

            battleRecord = this.getItem(result.userId);
            if (result.win) {
                utility.log(1, "We Defeated ", result.userName);
                //Test if we should chain this guy
                state.setItem("BattleChainId", 0);
                tempTime = battleRecord.chainTime ? battleRecord.chainTime : 0;
                chainBP = config.getItem('ChainBP', '');
                chainGold = config.getItem('ChainGold', '');
                if (schedule.since(tempTime, 86400) && ((utility.isNum(chainBP) && chainBP >= 0) || (utility.isNum(chainGold) && chainGold >= 0))) {
                    if (utility.isNum(chainBP) && chainBP >= 0) {
                        if (result.points >= chainBP) {
                            state.setItem("BattleChainId", result.userId);
                            utility.log(1, "Chain Attack: " + result.userId + ((result.battleType === "War") ? "  War Points: " : "  Battle Points: ") + result.points);
                        } else {
                            battleRecord.ignoreTime = new Date().getTime();
                        }
                    }

                    if (utility.isNum(chainGold) && chainGold >= 0) {
                        if (result.gold >= chainGold) {
                            state.setItem("BattleChainId", result.userId);
                            utility.log(1, "Chain Attack: " + result.userId + " Gold: " + result.goldnum);
                        } else {
                            battleRecord.ignoreTime = new Date().getTime();
                        }
                    }
                }

                battleRecord.chainCount = battleRecord.chainCount ? battleRecord.chainCount += 1 : 1;
                maxChains = config.getItem('MaxChains', 4);
                if (!utility.isNum(maxChains) || maxChains < 0) {
                    maxChains = 4;
                }

                if (battleRecord.chainCount >= maxChains) {
                    utility.log(1, "Lets give this guy a break. Chained", battleRecord.chainCount);
                    battleRecord.chainTime = new Date().getTime();
                    battleRecord.chainCount = 0;
                }
            } else {
                utility.log(1, "We Were Defeated By ", result.userName);
                battleRecord.chainCount = 0;
                battleRecord.chainTime = 0;
            }

            this.setItem(battleRecord);
            return true;
        } catch (err) {
            utility.error("ERROR in battle.checkResults: " + err);
            return false;
        }
    },

    nextTarget: function () {
        state.setItem('BattleTargetUpto', state.getItem('BattleTargetUpto', 0) + 1);
    },

    getTarget: function (mode) {
        try {
            var target     = '',
                targets    = [],
                battleUpto = '',
                targetType = '',
                targetRaid = '';

            targetType = config.getItem('TargetType', 'Freshmeat');
            targetRaid = state.getItem('targetFromraid', '');
            if (mode === 'DemiPoints') {
                if (targetRaid && targetType === 'Raid') {
                    return 'Raid';
                }

                return 'Freshmeat';
            }

            if (targetType === 'Raid') {
                if (targetRaid) {
                    return 'Raid';
                }

                caap.SetDivContent('battle_mess', 'No Raid To Attack');
                return 'NoRaid';
            }

            if (targetType === 'Freshmeat') {
                return 'Freshmeat';
            }

            target = state.getItem('BattleChainId', 0);
            if (target) {
                return target;
            }

            targets = utility.TextToArray(config.getItem('BattleTargets', ''));
            if (!targets.length) {
                return false;
            }

            battleUpto = state.getItem('BattleTargetUpto', 0);
            if (battleUpto > targets.length - 1) {
                battleUpto = 0;
                state.setItem('BattleTargetUpto', 0);
            }

            if (!targets[battleUpto]) {
                this.nextTarget();
                return false;
            }

            caap.SetDivContent('battle_mess', 'Battling User ' + battleUpto + '/' + targets.length + ' ' + targets[battleUpto]);
            if ((!utility.isNum(targets[battleUpto]) ? targets[battleUpto].toLowerCase() : targets[battleUpto]) === 'raid') {
                if (targetRaid) {
                    return 'Raid';
                }

                caap.SetDivContent('battle_mess', 'No Raid To Attack');
                this.nextTarget();
                return false;
            }

            return targets[battleUpto];
        } catch (err) {
            utility.error("ERROR in battle.getTarget: " + err);
            return false;
        }
    },

    click: function (battleButton) {
        try {
            state.setItem('ReleaseControl', true);
            this.flagResult = true;
            utility.Click(battleButton);
            return true;
        } catch (err) {
            utility.error("ERROR in battle.click: " + err);
            return false;
        }
    },

    battles: {
        Raid : {
            Invade   : 'raid_attack_button.gif',
            Duel     : 'raid_attack_button2.gif',
            regex1   : new RegExp('[0-9]+\\. (.+)\\s*Rank: ([0-9]+) ([^0-9]+) ([0-9]+) ([^0-9]+) ([0-9]+)', 'i'),
            refresh  : 'raid',
            image    : 'tab_raid_on.gif'
        },
        Freshmeat : {
            Invade   : 'battle_01.gif',
            Duel     : 'battle_02.gif',
            War      : 'war_button_duel.gif',
            regex1   : new RegExp('(.+)\\s*\\(Level ([0-9]+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*War: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*([0-9]+)', 'i'),
            regex2   : new RegExp('(.+)\\s*\\(Level ([0-9]+)\\)\\s*Battle: ([A-Za-z ]+) \\(Rank ([0-9]+)\\)\\s*([0-9]+)', 'i'),
            warLevel : true,
            refresh  : 'battle_on.gif',
            image    : 'battle_on.gif'
        }
    },

    selectedDemisDone: function (force) {
        try {
            var demiPointsDone = true,
                it = 0;

            for (it = 0; it < 5; it += 1) {
                if (force || config.getItem('DemiPoint' + it, true)) {
                    if (caap.demi[caap.demiTable[it]].daily.dif > 0) {
                        demiPointsDone = false;
                        break;
                    }
                }
            }

            return demiPointsDone;
        } catch (err) {
            utility.error("ERROR in battle.selectedDemisDone: " + err);
            return undefined;
        }
    },

    freshmeat: function (type) {
        try {
            var inputDiv        = null,
                plusOneSafe     = false,
                safeTargets     = [],
                chainId         = '',
                chainAttack     = false,
                inp             = null,
                txt             = '',
                levelm          = [],
                minRank         = 0,
                maxLevel        = 0,
                ARBase          = 0,
                ARMax           = 0,
                ARMin           = 0,
                levelMultiplier = 0,
                armyRatio       = 0,
                tempRecord      = {},
                battleRecord    = {},
                tempTime        = 0,
                it              = 0,
                tr              = null,
                form            = null,
                firstId         = '',
                lastBattleID    = 0,
                engageButton    = null;

            utility.log(2, 'target img', this.battles[type][config.getItem('BattleType', 'Invade')]);
            inputDiv = $("input[src*='" + this.battles[type][config.getItem('BattleType', 'Invade')] + "']");
            if (!inputDiv || !inputDiv.length) {
                utility.warn('Not on battlepage');
                return false;
            }

            chainId = state.getItem('BattleChainId', 0);
            state.setItem('BattleChainId', '');
            // Lets get our Freshmeat user settings
            minRank = config.getItem("FreshMeatMinRank", 99);
            utility.log(2, "FreshMeatMinRank", minRank);
            if (!utility.isNum(minRank)) {
                if (minRank !== '') {
                    utility.warn("FreshMeatMinRank is NaN, using default", 99);
                }

                minRank = 99;
            }

            maxLevel = gm.getItem("FreshMeatMaxLevel", 99999, hiddenVar);
            utility.log(2, "FreshMeatMaxLevel", maxLevel);
            if (!utility.isNum(maxLevel)) {
                maxLevel = 99999;
                utility.warn("FreshMeatMaxLevel is NaN, using default", maxLevel);
            }

            ARBase = config.getItem("FreshMeatARBase", 0.5);
            utility.log(2, "FreshMeatARBase", ARBase);
            if (!utility.isNum(ARBase)) {
                ARBase = 0.5;
                utility.warn("FreshMeatARBase is NaN, using default", ARBase);
            }

            ARMax = gm.getItem("FreshMeatARMax", 99999, hiddenVar);
            utility.log(2, "FreshMeatARMax", ARMax);
            if (!utility.isNum(ARMax)) {
                ARMax = 99999;
                utility.warn("FreshMeatARMax is NaN, using default", ARMax);
            }

            ARMin = gm.getItem("FreshMeatARMin", 0, hiddenVar);
            utility.log(2, "FreshMeatARMin", ARMin);
            if (!utility.isNum(ARMin)) {
                ARMin = 0;
                utility.warn("FreshMeatARMin is NaN, using default", ARMin);
            }

            for (it = 0; it < inputDiv.length; it += 1) {
                tr = null;
                levelm = [];
                txt = '';
                tempTime = new Date(2009, 0, 1).getTime();
                tempRecord = {};
                tempRecord.button = inputDiv.eq(it);
                if (type === 'Raid') {
                    tr = tempRecord.button.parents().eq(4);
                    txt = $.trim(tr.children().eq(1).text());
                    levelm = this.battles.Raid.regex1.exec(txt);
                    if (!levelm || !levelm.length) {
                        utility.warn("Can't match Raid regex in ", txt);
                        continue;
                    }

                    tempRecord.nameStr = levelm[1];
                    tempRecord.rankNum = parseInt(levelm[2], 10);
                    tempRecord.rankStr = battle.battleRankTable[tempRecord.rankNum];
                    tempRecord.levelNum = parseInt(levelm[4], 10);
                    tempRecord.armyNum = parseInt(levelm[6], 10);
                } else {
                    tr = tempRecord.button;
                    while (tr.attr("tagName").toLowerCase() !== "tr") {
                        tr = tr.parent();
                    }

                    tempRecord.deityNum = utility.NumberOnly(tr.find("img[src*='symbol_']").attr("src").match(/\d+\.jpg/i)) - 1;
                    tempRecord.deityStr = caap.demiTable[tempRecord.deityNum];
                    utility.log(2, "DemiPointsDone", state.getItem('DemiPointsDone', true));
                    // If looking for demi points, and already full, continue
                    if (config.getItem('DemiPointsFirst', false) && !state.getItem('DemiPointsDone', true) && (config.getItem('WhenMonster', 'Never') !== 'Never')) {
                        utility.log(9, "Demi Points First", tempRecord.deityNum, tempRecord.deityStr, caap.demi[tempRecord.deityStr], config.getItem('DemiPoint' + tempRecord.deityNum, true));
                        if (caap.demi[tempRecord.deityStr].daily.dif <= 0 || !config.getItem('DemiPoint' + tempRecord.deityNum, true)) {
                            utility.log(1, "Daily Demi Points done for", tempRecord.deityStr);
                            continue;
                        }
                    } else if (config.getItem('WhenBattle', 'Never') === "Demi Points Only") {
                        if (caap.demi[tempRecord.deityStr].daily.dif <= 0) {
                            utility.log(1, "Daily Demi Points done for", tempRecord.deityStr);
                            continue;
                        }
                    }

                    txt = $.trim(tr.text());
                    if (!txt.length) {
                        utility.warn("Can't find txt in tr");
                        continue;
                    }

                    if (this.battles.Freshmeat.warLevel) {
                        levelm = this.battles.Freshmeat.regex1.exec(txt);
                        if (!levelm) {
                            levelm = this.battles.Freshmeat.regex2.exec(txt);
                            this.battles.Freshmeat.warLevel = false;
                        }
                    } else {
                        levelm = this.battles.Freshmeat.regex2.exec(txt);
                        if (!levelm) {
                            levelm = this.battles.Freshmeat.regex1.exec(txt);
                            this.battles.Freshmeat.warLevel = true;
                        }
                    }

                    if (!levelm) {
                        utility.warn("Can't match Freshmeat regex in ", txt);
                        continue;
                    }

                    tempRecord.nameStr = levelm[1];
                    tempRecord.levelNum = parseInt(levelm[2], 10);
                    tempRecord.rankStr = levelm[3];
                    tempRecord.rankNum = parseInt(levelm[4], 10);
                    if (this.battles.Freshmeat.warLevel) {
                        tempRecord.warRankStr = levelm[5];
                        tempRecord.warRankNum = parseInt(levelm[6], 10);
                    }

                    if (this.battles.Freshmeat.warLevel) {
                        tempRecord.armyNum = parseInt(levelm[7], 10);
                    } else {
                        tempRecord.armyNum = parseInt(levelm[5], 10);
                    }
                }

                inp = tr.find("input[name='target_id']");
                if (!inp || !inp.length) {
                    utility.warn("Could not find 'target_id' input");
                    continue;
                }

                tempRecord.userId = parseInt(inp.attr("value"), 10);
                if (battle.hashCheck(tempRecord.userId)) {
                    continue;
                }

                levelMultiplier = caap.stats.level / tempRecord.levelNum;
                armyRatio = ARBase * levelMultiplier;
                armyRatio = Math.min(armyRatio, ARMax);
                armyRatio = Math.max(armyRatio, ARMin);
                if (armyRatio <= 0) {
                    utility.warn("Bad ratio", armyRatio, ARBase, ARMin, ARMax, levelMultiplier);
                    continue;
                }

                utility.log(2, "Army Ratio: " + armyRatio + " Level: " + tempRecord.levelNum + " Rank: " + tempRecord.rankNum + " Army: " + tempRecord.armyNum);
                if (tempRecord.levelNum - caap.stats.level > maxLevel) {
                    utility.log(2, "Greater than maxLevel", maxLevel);
                    continue;
                }

                if (config.getItem("BattleType", 'Invade') === "War" && this.battles.Freshmeat.warLevel) {
                    if (caap.stats.rank.war && (caap.stats.rank.war - tempRecord.warRankNum > minRank)) {
                        utility.log(2, "Greater than minRank", minRank);
                        continue;
                    }
                } else {
                    if (caap.stats.rank.battle && (caap.stats.rank.battle - tempRecord.rankNum > minRank)) {
                        utility.log(2, "Greater than minRank", minRank);
                        continue;
                    }
                }

                // if we know our army size, and this one is larger than armyRatio, don't battle
                if (caap.stats.army.capped && (tempRecord.armyNum > (caap.stats.army.capped * armyRatio))) {
                    utility.log(2, "Greater than armyRatio", armyRatio);
                    continue;
                }

                if (config.getItem("BattleType", 'Invade') === "War" && this.battles.Freshmeat.warLevel) {
                    utility.log(1, "ID: " + utility.rpad(tempRecord.userId.toString(), " ", 15) +
                                " Level: " + utility.rpad(tempRecord.levelNum.toString(), " ", 4) +
                                " War Rank: " + utility.rpad(tempRecord.warRankNum.toString(), " ", 2) +
                                " Army: " + tempRecord.armyNum);
                } else {
                    utility.log(1, "ID: " + utility.rpad(tempRecord.userId.toString(), " ", 15) +
                                " Level: " + utility.rpad(tempRecord.levelNum.toString(), " ", 4) +
                                " Battle Rank: " + utility.rpad(tempRecord.rankNum.toString(), " ", 2) +
                                " Army: " + tempRecord.armyNum);
                }

                // don't battle people we lost to in the last week
                battleRecord = battle.getItem(tempRecord.userId);
                if (!config.getItem("IgnoreBattleLoss", false)) {
                    switch (config.getItem("BattleType", 'Invade')) {
                    case 'Invade' :
                        tempTime = battleRecord.invadeLostTime  ? battleRecord.invadeLostTime : new Date(2009, 0, 1).getTime();
                        break;
                    case 'Duel' :
                        tempTime = battleRecord.duelLostTime ? battleRecord.duelLostTime : new Date(2009, 0, 1).getTime();
                        break;
                    case 'War' :
                        tempTime = battleRecord.warlostTime ? battleRecord.warlostTime : new Date(2009, 0, 1).getTime();
                        break;
                    default :
                        utility.warn("Battle type unknown!", config.getItem("BattleType", 'Invade'));
                    }

                    if (battleRecord && battleRecord.nameStr !== '' && !schedule.since(tempTime, 604800)) {
                        utility.log(1, "We lost " + config.getItem("BattleType", 'Invade') + " to this id this week: ", tempRecord.userId);
                        continue;
                    }
                }

                // don't battle people that were dead or hiding in the last hour
                tempTime = battleRecord.deadTime ? battleRecord.deadTime : new Date(2009, 0, 1).getTime();
                if (battleRecord && battleRecord.nameStr !== '' && !schedule.since(tempTime, 3600)) {
                    utility.log(1, "User was dead in the last hour: ", tempRecord.userId);
                    continue;
                }

                // don't battle people we've already chained to max in the last 2 days
                tempTime = battleRecord.chainTime ? battleRecord.chainTime : new Date(2009, 0, 1).getTime();
                if (battleRecord && battleRecord.nameStr !== '' && !schedule.since(tempTime, 86400)) {
                    utility.log(1, "We chained user within 2 days: ", tempRecord.userId);
                    continue;
                }

                // don't battle people that didn't meet chain gold or chain points in the last week
                tempTime = battleRecord.ignoreTime ? battleRecord.ignoreTime : new Date(2009, 0, 1).getTime();
                if (battleRecord && battleRecord.nameStr !== '' && !schedule.since(tempTime, 604800)) {
                    utility.log(1, "User didn't meet chain requirements this week: ", tempRecord.userId);
                    continue;
                }

                tempRecord.score = (type === 'Raid' ? 0 : tempRecord.rankNum) - (tempRecord.armyNum / levelMultiplier / caap.stats.army.capped);
                if (tempRecord.userId === chainId) {
                    chainAttack = true;
                }

                tempRecord.targetNumber = it + 1;
                utility.log(2, "tempRecord/levelm", tempRecord, levelm);
                safeTargets.push(tempRecord);
                if (it === 0 && type === 'Raid') {
                    plusOneSafe = true;
                }
            }

            safeTargets.sort(sort.score);
            utility.log(2, "safeTargets", safeTargets);
            if (safeTargets && safeTargets.length) {
                if (chainAttack) {
                    form = inputDiv.eq(0).parent().parent();
                    inp = form.find("input[name='target_id']");
                    if (inp && inp.length) {
                        inp.attr("value", chainId);
                        utility.log(1, "Chain attacking: ", chainId);
                        battle.click(inputDiv.eq(0).get(0));
                        state.setItem("lastBattleID", chainId);
                        caap.SetDivContent('battle_mess', 'Attacked: ' + state.getItem("lastBattleID", 0));
                        state.setItem("notSafeCount", 0);
                        return true;
                    }

                    utility.warn("Could not find 'target_id' input");
                } else if (config.getItem('PlusOneKills', false) && type === 'Raid') {
                    if (plusOneSafe) {
                        form = inputDiv.eq(0).parent().parent();
                        inp = form.find("input[name='target_id']");
                        if (inp && inp.length) {
                            firstId = parseInt(inp.attr("value"), 10);
                            inp.attr("value", '200000000000001');
                            utility.log(1, "Target ID Overriden For +1 Kill. Expected Defender: ", firstId);
                            battle.click(inputDiv.eq(0).get(0));
                            state.setItem("lastBattleID", firstId);
                            caap.SetDivContent('battle_mess', 'Attacked: ' + state.getItem("lastBattleID", 0));
                            state.setItem("notSafeCount", 0);
                            return true;
                        }

                        utility.warn("Could not find 'target_id' input");
                    } else {
                        utility.log(1, "Not safe for +1 kill.");
                    }
                } else {
                    lastBattleID = state.getItem("lastBattleID", 0);
                    for (it = 0; it < safeTargets.length; it += 1) {
                        if (!lastBattleID && lastBattleID === safeTargets[it].id) {
                            continue;
                        }

                        if (safeTargets[it].button !== null || safeTargets[it].button !== undefined) {
                            utility.log(1, 'Found Target score: ' + safeTargets[it].score.toFixed(2) + ' id: ' + safeTargets[it].userId + ' Number: ' + safeTargets[it].targetNumber);
                            battle.click(safeTargets[it].button.get(0));
                            delete safeTargets[it].score;
                            delete safeTargets[it].targetNumber;
                            delete safeTargets[it].button;
                            state.setItem("lastBattleID", safeTargets[it].userId);
                            safeTargets[it].aliveTime = new Date().getTime();
                            battleRecord = battle.getItem(safeTargets[it].userId);
                            $.extend(true, battleRecord, safeTargets[it]);
                            utility.log(2, "battleRecord", battleRecord);
                            battle.setItem(battleRecord);
                            caap.SetDivContent('battle_mess', 'Attacked: ' + lastBattleID);
                            state.setItem("notSafeCount", 0);
                            return true;
                        }

                        utility.warn('Attack button is null');
                    }
                }
            }

            state.setItem("notSafeCount", state.getItem("notSafeCount", 0) + 1);
            // add a schedule here for 5 mins or so
            if (state.getItem("notSafeCount", 0) > 100) {
                caap.SetDivContent('battle_mess', 'Leaving Battle. Will Return Soon.');
                utility.log(1, 'No safe targets limit reached. Releasing control for other processes: ', state.getItem("notSafeCount", 0));
                state.setItem("notSafeCount", 0);
                return false;
            }

            caap.SetDivContent('battle_mess', 'No targets matching criteria');
            utility.log(1, 'No safe targets: ', state.getItem("notSafeCount", 0));

            if (type === 'Raid') {
                engageButton = monster.engageButtons[state.getItem('targetFromraid', '')];
                if (state.getItem("page", '') === 'raid' && engageButton) {
                    utility.Click(engageButton);
                } else {
                    schedule.setItem("RaidNoTargetDelay", gm.getItem("RaidNoTargetDelay", 45, hiddenVar));
                    utility.NavigateTo(caap.battlePage + ',raid');
                }
            } else {
                utility.NavigateTo(caap.battlePage + ',battle_on.gif');
            }

            return true;
        } catch (err) {
            utility.error("ERROR in battle.freshmeat: " + err);
            return false;
        }
    }
};
