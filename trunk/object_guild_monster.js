
////////////////////////////////////////////////////////////////////
//                          guild_monster OBJECT
// this is the main object for dealing with guild monsters
/////////////////////////////////////////////////////////////////////

guild_monster = {
    records: [],

    record: function () {
        this.data = {
            name        : '',
            guildId     : '',
            slot        : 0,
            ticker      : '',
            minions     : [],
            damage      : 0,
            reviewed    : 0,
            state       : '',
            enemyHealth : 0,
            guildHealth : 0,
            conditions  : ''
        };
    },

/*
    minion: function () {
        this.data = {
            attacking_position : 0,
            target_id          : 0,
            name               : '',
            level              : 0,
            mclass             : '',
            healthNum          : 0,
            healthMax          : 0,
            status             : '',
            percent            : 0
        };
    },
*/

    me: function () {
        this.data = {
            name               : '',
            level              : 0,
            mclass             : '',
            healthNum          : 0,
            healthMax          : 0,
            status             : '',
            percent            : 0
        };
    },

    load: function () {
        try {
            if (gm.getItem('guild_monster.records', 'default') === 'default' || !$.isArray(gm.getItem('guild_monster.records', 'default'))) {
                gm.setItem('guild_monster.records', this.records);
            } else {
                this.records = gm.getItem('guild_monster.records', this.records);
            }

            state.setItem("GuildMonsterDashUpdate", true);
            utility.log(3, "guild_monster.load", this.records);
            return true;
        } catch (err) {
            utility.error("ERROR in guild_monster.load: " + err);
            return false;
        }
    },

    save: function () {
        try {
            gm.setItem('guild_monster.records', this.records);
            state.setItem("GuildMonsterDashUpdate", true);
            utility.log(3, "guild_monster.save", this.records);
            return true;
        } catch (err) {
            utility.error("ERROR in guild_monster.save: " + err);
            return false;
        }
    },

    getItem: function (slot) {
        try {
            var it        = 0,
                len       = 0,
                success   = false,
                newRecord = {};

            if (typeof slot !== 'number') {
                utility.warn("slot", slot);
                throw "Invalid identifying slot!";
            }

            if (slot === '') {
                return '';
            }

            for (it = 0, len = this.records.length; it < len; it += 1) {
                if (this.records[it].slot === slot) {
                    success = true;
                    break;
                }
            }

            if (success) {
                utility.log(3, "Got guild_monster record", slot, this.records[it]);
                return this.records[it];
            } else {
                newRecord = new this.record();
                newRecord.data.slot = slot;
                utility.log(3, "New guild_monster record", slot, newRecord.data);
                return newRecord.data;
            }
        } catch (err) {
            utility.error("ERROR in guild_monster.getItem: " + err, arguments.callee.caller);
            return false;
        }
    },

    setItem: function (record) {
        try {
            if (!record || !$.isPlainObject(record)) {
                throw "Not passed a record";
            }

            if (typeof record.slot !== 'number' || record.slot <= 0) {
                utility.warn("slot", record.slot);
                throw "Invalid identifying slot!";
            }

            var it      = 0,
                len     = 0,
                success = false;

            for (it = 0, len = this.records.length; it < len; it += 1) {
                if (this.records[it].slot === record.slot) {
                    success = true;
                    break;
                }
            }

            if (success) {
                this.records[it] = record;
                utility.log(3, "Updated guild_monster record", record, this.records);
            } else {
                this.records.push(record);
                utility.log(3, "Added guild_monster record", record, this.records);
            }

            this.save();
            return true;
        } catch (err) {
            utility.error("ERROR in guild_monster.setItem: " + err);
            return false;
        }
    },

    deleteItem: function (slot) {
        try {
            var it        = 0,
                len       = 0,
                success   = false;

            if (typeof slot !== 'number' || slot <= 0) {
                utility.warn("slot", slot);
                throw "Invalid identifying slot!";
            }

            for (it = 0, len = this.records.length; it < len; it += 1) {
                if (this.records[it].slot === slot) {
                    success = true;
                    break;
                }
            }

            if (success) {
                this.records.splice(it, 1);
                this.save();
                utility.log(3, "Deleted guild_monster record", slot, this.records);
                return true;
            } else {
                utility.warn("Unable to delete guild_monster record", slot, this.records);
                return false;
            }
        } catch (err) {
            utility.error("ERROR in guild_monster.deleteItem: " + err);
            return false;
        }
    },

    clear: function () {
        try {
            utility.log(1, "guild_monster.clear");
            this.records = gm.setItem("guild_monster.records", []);
            state.setItem("GuildMonsterDashUpdate", true);
            return true;
        } catch (err) {
            utility.error("ERROR in guild_monster.clear: " + err);
            return false;
        }
    },

    navigate_to_main: function () {
        return utility.NavigateTo('guild', 'tab_guild_main_on.gif');
    },

    navigate_to_battles_refresh: function () {
        var button = utility.CheckForImage("guild_monster_tab_on.jpg");
        if (button) {
            utility.Click(button);
        }

        state.setItem('guildMonsterBattlesRefresh', false);
        return button ? true : false;
    },

    navigate_to_battles: function () {
        return utility.NavigateTo('guild,guild_current_monster_battles', 'guild_monster_tab_on.jpg');
    },

    populate: function () {
        try {
            var buttons = $("input[src*='dragon_list_btn_']"),
                slotArr = [],
                it      = 0;

            if (buttons && buttons.length) {
                buttons.each(function () {
                    var button        = $(this),
                        form          = null,
                        currentRecord = {},
                        imageName     = '',
                        slot          = 0,
                        name          = '',
                        guildId       = '',
                        passed        = true;

                    form = button.parents("form:first");
                    if (form && form.length) {
                        slot = parseInt(form.find("input[name='slot']:first").attr("value"), 10);
                        if (typeof slot === 'number' && slot > 0 && slot <= 5) {
                            utility.log(3, "slot", slot);
                            slotArr.push(slot);
                            currentRecord = guild_monster.getItem(slot);
                            name = $.trim(button.parents().eq(4).text());
                            if (name) {
                                if (currentRecord.name !== name) {
                                    utility.log(1, "Updated name", currentRecord.name, name);
                                    currentRecord.name = name;
                                }
                            } else {
                                utility.warn("name error", name);
                                passed = false;
                            }

                            guildId = form.find("input[name='guild_id']:first").attr("value");
                            if (caap.stats.guild.id && guildId === caap.stats.guild.id) {
                                if (currentRecord.guildId !== guildId) {
                                    utility.log(2, "Updated guildId", currentRecord.guildId, guildId);
                                    currentRecord.guildId = guildId;
                                }
                            } else {
                                utility.warn("guildId error", guildId, caap.stats.guild.id);
                                passed = false;
                            }

                            imageName = utility.getHTMLPredicate(button.attr("src"));
                            if (imageName) {
                                switch (imageName) {
                                case "dragon_list_btn_2.jpg":
                                    if (currentRecord.state !== "Completed") {
                                        utility.log(2, "Updated state", currentRecord.state, "Collect");
                                        currentRecord.state = "Collect";
                                    }

                                    break;
                                case "dragon_list_btn_3.jpg":
                                    currentRecord.state = "Alive";
                                    break;
                                default:
                                    currentRecord.state = "Error";
                                    utility.warn("state error", imageName);
                                    passed = false;
                                }
                            } else {
                                utility.warn("imageName error", button.attr("src"), imageName);
                                passed = false;
                            }
                        } else {
                            utility.warn("slot error", slot);
                            passed = false;
                        }
                    } else {
                        utility.warn("form error", button);
                        passed = false;
                    }

                    if (passed) {
                        utility.log(2, "currentRecord/button", currentRecord, button);
                        guild_monster.setItem(currentRecord);
                    } else {
                        utility.warn("populate record failed", currentRecord, button);
                    }
                });

                for (it = this.records.length - 1; it >= 0; it -= 1) {
                    if (slotArr.indexOf(this.records[it].slot) < 0) {
                        this.deleteItem(this.records[it].slot);
                    }
                }
            } else {
                utility.log(1, "No buttons found");
                this.clear();
            }

            caap.UpdateDashboard(true);
            return true;
        } catch (err) {
            utility.error("ERROR in guild_monster.populate: " + err);
            return false;
        }
    },

    onMonster: function () {
        try {
            var gates         = null,
                health        = null,
                myStatsTxt    = '',
                myStatsArr    = [],
                slot          = 0,
                currentRecord = {},
                minionRegEx   = new RegExp("(.*) Level (\\d+) Class: (.*) Health: (.+)/(.+) Status: (.*)");

            //utility.log(1, "name", $.trim($("#app46755028429_enemy_guild_member_list_1").children().eq(0).children().eq(1).children().eq(0).text()));
            //utility.log(1, "guidId", $("input[name='guild_id']:first").attr("value"));
            slot = parseInt($("input[name='slot']:first").attr("value"), 10);
            myStatsTxt = $.trim($("#app46755028429_guild_battle_banner_section").children().eq(1).children().eq(0).children().eq(1).text()).replace(/\s+/g, ' ');
            if (typeof slot === 'number' && slot > 0 && slot <= 5) {
                utility.log(3, "slot", slot);
                currentRecord = this.getItem(slot);
                currentRecord.minions = [];
                currentRecord.ticker = '';
                currentRecord.guildHealth = 0;
                currentRecord.enemyHealth = 0;

                if (!$("#app46755028429_guild_battle_banner_section").attr("style").match(/monster_dead/)) {
                    currentRecord.ticker = $.trim($("#app46755028429_monsterTicker").text());
                    if (myStatsTxt) {
                        utility.log(2, "myStatsTxt", myStatsTxt);
                        myStatsArr = myStatsTxt.match(new RegExp("(.+) Level: (\\d+) Class: (.+) Health: (\\d+)/(\\d+).+Status: (.+) Battle Damage: (\\d+)"));
                        if (myStatsArr && myStatsArr.length === 8) {
                            utility.log(2, "myStatsArr", myStatsArr);
                            currentRecord.damage = parseInt(myStatsArr[7], 10);
                        } else {
                            utility.warn("myStatsArr error", myStatsArr, myStatsTxt);
                        }
                    }

                    health = $("#app46755028429_guild_battle_health");
                    if (health && health.length) {
                        if ($().jquery >= "1.4.3") {
                            currentRecord.guildHealth = 100 - utility.NumberOnly(health.find("div[style*='guild_battle_bar_you.gif']").attr("style").match(new RegExp("width:\\s*([\\d\\.]+)%", "i"))[1]);
                            currentRecord.enemyHealth = 100 - utility.NumberOnly(health.find("div[style*='guild_battle_bar_enemy.gif']").attr("style").match(new RegExp("width:\\s*([\\d\\.]+)%", "i"))[1]);
                        } else {
                            currentRecord.guildHealth = utility.NumberOnly(health.find("div[style*='guild_battle_bar_you.gif']").css("width"));
                            currentRecord.enemyHealth = utility.NumberOnly(health.find("div[style*='guild_battle_bar_enemy.gif']").css("width"));
                        }
                    } else {
                        utility.warn("guild_battle_health error");
                    }

                    gates = $("div[id*='app46755028429_enemy_guild_member_list_']");
                    if (!gates || !gates.length) {
                        utility.warn("No gates found");
                    } else if (gates && gates.length !== 4) {
                        utility.warn("Not enough gates found");
                    } else {
                        gates.each(function (gIndex) {
                            var memberDivs = $(this).children();
                            if (!memberDivs || !memberDivs.length) {
                                utility.warn("No members found");
                            } else if (memberDivs && memberDivs.length !== 25) {
                                utility.warn("Not enough members found", memberDivs);
                            } else {
                                memberDivs.each(function (mIndex) {
                                    var member       = $(this),
                                        memberText   = '',
                                        memberArr    = [],
                                        //memberRecord = new guild_monster.minion().data,
                                        memberRecord = {
                                            attacking_position : 0,
                                            target_id          : 0,
                                            name               : '',
                                            level              : 0,
                                            mclass             : '',
                                            healthNum          : 0,
                                            healthMax          : 0,
                                            status             : '',
                                            percent            : 0
                                        };

                                    memberRecord.attacking_position = (gIndex + 1);
                                    memberRecord.target_id = (gIndex * 25) + (mIndex + 1);
                                    memberText = $.trim(member.children().eq(1).text()).replace(/\s+/g, ' ');
                                    memberArr = memberText.match(minionRegEx);
                                    if (memberArr && memberArr.length === 7) {
                                        memberRecord.name = memberArr[1];
                                        memberRecord.level = parseInt(memberArr[2], 10);
                                        memberRecord.mclass = memberArr[3];
                                        memberRecord.healthNum = parseInt(memberArr[4], 10);
                                        memberRecord.healthMax = parseInt(memberArr[5], 10);
                                        memberRecord.status = memberArr[6];
                                    }

                                    currentRecord.minions.push(memberRecord);
                                });
                            }
                        });
                    }
                } else {
                    if ($("input[src*='collect_reward_button2.jpg']").length) {
                        utility.log(1, "Monster is dead and ready to collect");
                        currentRecord.state = 'Collect';
                    } else {
                        utility.log(1, "Monster is completed");
                        currentRecord.state = 'Completed';
                    }
                }

                currentRecord.reviewed = new Date().getTime();
                utility.log(2, "currentRecord", currentRecord);
                this.setItem(currentRecord);
            } else {
                if (caap.stats.guild.name && myStatsTxt === caap.stats.guild.name) {
                    utility.warn("slot error", slot);
                } else {
                    utility.log(1, "On another guild's monster", myStatsTxt);
                }
            }

            return true;
        } catch (err) {
            utility.error("ERROR in guild_monster.onMonster: " + err);
            return false;
        }
    },

    getReview: function () {
        try {
            var it     = 0,
                len    = 0,
                record = {};

            for (it = 0, len = this.records.length; it < len; it += 1) {
                if (this.records[it].state === 'Completed') {
                    continue;
                }

                if (!schedule.since(this.records[it].reviewed, 60)) {
                    continue;
                }

                record = this.records[it];
                break;
            }

            return record;
        } catch (err) {
            utility.error("ERROR in guild_monster.getReview: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    checkPage: function (record) {
        try {
            if (!record || !$.isPlainObject(record)) {
                throw "Not passed a record";
            }

            var slot = 0;

            //utility.log(1, "name", $.trim($("#app46755028429_enemy_guild_member_list_1").children().eq(0).children().eq(1).children().eq(0).text()));
            //utility.log(1, "guidId", $("input[name='guild_id']:first").attr("value"));
            slot = parseInt($("input[name='slot']:first").attr("value"), 10);
            return (record.slot === slot);
        } catch (err) {
            utility.error("ERROR in guild_monster.checkPage: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    getTargetMonster: function () {
        try {
            var it     = 0,
                len    = 0,
                record = {};

            for (it = 0, len = this.records.length; it < len; it += 1) {
                if (this.records[it].state !== 'Alive') {
                    continue;
                }

                record = this.records[it];
                break;
            }

            return record;
        } catch (err) {
            utility.error("ERROR in guild_monster.getTargetMonster: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    getTargetMinion: function (record) {
        try {
            var it     = 0,
                minion = {};

            if (!record || !$.isPlainObject(record)) {
                throw "Not passed a record";
            }

            for (it = record.minions.length - 1; it >= 0; it -= 1) {
                if (record.minions[it].status === 'Stunned') {
                    continue;
                }

                minion = record.minions[it];
                break;
            }

            return minion;
        } catch (err) {
            utility.error("ERROR in guild_monster.getTargetMinion: " + err, arguments.callee.caller);
            return undefined;
        }
    },

    select: function (force) {
        try {
            var it              = 0,
                ol              = 0,
                len             = 0,
                len1            = 0,
                record          = {},
                attackOrderList = [],
                conditions      = '';

            if (!(force || utility.oneMinuteUpdate('selectGuildMonster'))) {
                return false;
            }

            state.setItem('targetGuildMonster', '');
            for (it = this.records.length - 1; it >= 0; it -= 1) {
                this.records[it].conditions = 'none';
            }

            attackOrderList = utility.TextToArray(config.getItem('orderGuildMonster', ''));
            for (ol = 0, len1 = attackOrderList.length; ol < len1; ol += 1) {
                conditions = $.trim(attackOrderList[ol].replace(new RegExp("^[^:]+"), '').toString());
                for (it = 0, len = this.records.length ; it < len; it += 1) {
                    if (this.records[it].state !== 'Alive') {
                        continue;
                    }

                    if (this.records[it].conditions !== 'none') {
                        continue;
                    }

                    if ((this.records[it].slot + " " + this.records[it].name.toLowerCase()).indexOf($.trim(attackOrderList[ol].match(new RegExp("^[^:]+")).toString()).toLowerCase()) < 0) {
                        continue;
                    }

                    this.records[it].conditions = conditions;
                }
            }

            return true;
        } catch (err) {
            utility.error("ERROR in guild_monster.select: " + err, arguments.callee.caller);
            return undefined;
        }
    }
};