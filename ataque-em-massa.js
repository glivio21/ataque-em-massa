/**
 * Script: Ataque em Massa - Tribuna Tribal Wars
 * Autor: Giovanni Livio (@tribunatw)
 * Versão: 1.0
 * Executa somente na tela combined.
 */

(function () {
    // Verifica se está na tela combined
    if (!window.location.href.includes('screen=combined')) {
        alert("Execute o script na tela 'combined' do Tribal Wars.");
        return;
    }

    if (typeof window.game_data === 'undefined' || typeof window.$ === 'undefined') {
        alert("Script deve ser executado dentro do Tribal Wars!");
        return;
    }

    // --------- INÍCIO DO SCRIPT ORIGINAL SEM PERMISSÃO ---------

    var Aldeia = function(_coord, _id, _alvoId, _alvoC, _data, _time) {
        this.coord = _coord;
        this.id = _id;
        this.alvoId = _alvoId;
        this.alvoC = _alvoC;
        this.data = _data;
        this.time = _time;
    };

    var aldeias = [];
    var aldeiasAux = [];
    var aldeiasLength = 0;
    var deuError = 0;

    function setParam(name, value) {
        localStorage.setItem(name, value);
    }

    function getParam(name) {
        return localStorage.getItem(name);
    }

    function usefullVillages() {
        $('.quickedit-vn').each(function(index) {
            aldeias[index] = new Aldeia(
                $(this).find('a span').text().match(/\d{3}[|]\d{3}/g)[0],
                $(this).data('id'),
                0,
                0,
                {},
                ""
            );
        });
    }

    function getAlvos(alvos) {
        var infoAlvos = {},
            infoAlvosLen;
        if (!alvos || alvos == -1)
            alvos = $("textarea[name='coords']").val().split(',');
        else
            alvos = alvos.split(',');
        infoAlvosLen = alvos.length;
        infoAlvos.id = [];
        infoAlvos.coord = [];
        for (var k = 0; k < infoAlvosLen; k++) {
            alvos[k] = alvos[k].split('&');
            infoAlvos.id[k] = alvos[k][0];
            infoAlvos.coord[k] = alvos[k][1];
        }
        return infoAlvos;
    }

    function sortCoords() {
        var len = aldeias.length,
            lenAlvos,
            x,
            y,
            prim,
            seg,
            coord = [],
            id,
            string = "",
            objAlvo = getAlvos(getParam('coordsRes'));
        lenAlvos = objAlvo.coord.length;
        if (lenAlvos <= 0) {
            objAlvo = getAlvos(getParam('coords'));
            lenAlvos = objAlvo.coord.length;
        }
        for (var i = 0; i < len; i++) {
            if (!lenAlvos) {
                objAlvo = getAlvos(null);
                lenAlvos = objAlvo.coord.length;
            }
            x = aldeias[i].coord.split('|');
            for (var j = 0; j < lenAlvos; j++) {
                y = objAlvo.coord[j].split('|');
                if (!j) prim = Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2));
                seg = Math.sqrt(Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2));
                if (prim >= seg) {
                    prim = seg;
                    coord = y;
                    id = objAlvo.id[j];
                }
            }
            prim = objAlvo.coord.indexOf(coord.join('|'));
            objAlvo.coord.splice(prim, 1);
            objAlvo.id.splice(prim, 1);
            lenAlvos--;
            aldeias[i].alvoC = coord.join('|');
            aldeias[i].alvoId = id;
        }
        seg = objAlvo.coord.length;
        for (var m = 0; m < seg; m++) {
            string += objAlvo.id[m] + '&' + objAlvo.coord[m];
            if (m < (seg - 1)) string += ',';
        }
        setParam('coordsRes', string);
        $("#combined_table tbody tr:eq(0) th:eq(0)").html("<b>Alvos Restantes: " + lenAlvos + "</b>");
    }

    function removeVillage(id) {
        var len = aldeias.length;
        while (len && len--) {
            if (aldeias[len].id == id) {
                aldeias.splice(len, 1);
                return;
            }
        }
    }

    function removeVillageAux(id) {
        var len = aldeiasAux.length;
        while (len--) {
            if (aldeiasAux[len].id == id) {
                aldeiasAux.splice(len, 1);
                return;
            }
        }
    }

    function firstRequest() {
        var comando = $('#comando').val();
        var spear = getParam('spear'),
            sword = getParam('sword'),
            axe = getParam('axe'),
            archer = getParam('archer'),
            spy = getParam('spy'),
            light = getParam('light'),
            heavy = getParam('heavy'),
            marcher = getParam('marcher'),
            ram = getParam('ram'),
            catapult = getParam('catapult'),
            snob = getParam('snob'),
            count = 0,
            i = 0;
        aldeiasLength = aldeias.length;
        for (let aldeia of aldeias) {
            setTimeout(function() {
                $.ajax({
                    type: "GET",
                    url: "/game.php?village=" + aldeia.id + "&screen=place&ajax=command&target=" + aldeia.alvoId + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: {},
                    dataType: "json",
                    headers: { "TribalWars-Ajax": 1 },
                    success: function(data) {
                        var string, len, tropas = {},
                            spearN, swordN, axeN, archerN, spyN, marcherN, lightN, heavyN, ramN, catapultN, snobN, first;
                        if (!data.error) {
                            data = $(data.response.dialog);
                            string = data.serialize().split('&');
                            len = string.length;
                            spearN = jQuery('#unit_input_spear', data).data('all-count');
                            swordN = jQuery('#unit_input_sword', data).data('all-count');
                            axeN = jQuery('#unit_input_axe', data).data('all-count');
                            archerN = jQuery('#unit_input_archer', data).data('all-count');
                            spyN = jQuery('#unit_input_spy', data).data('all-count');
                            marcherN = jQuery('#unit_input_marcher', data).data('all-count');
                            lightN = jQuery('#unit_input_light', data).data('all-count');
                            heavyN = jQuery('#unit_input_heavy', data).data('all-count');
                            ramN = jQuery('#unit_input_ram', data).data('all-count');
                            catapultN = jQuery('#unit_input_catapult', data).data('all-count');
                            snobN = jQuery('#unit_input_snob', data).data('all-count');
                            for (var l = 0; l < len; l++) {
                                tropas[string[l].split('=')[0]] = string[l].split('=')[1];
                            }
                            first = aldeia.alvoC.split('|');
                            tropas.x = first[0];
                            tropas.y = first[1];
                            tropas.spear = (spearN > parseInt(spear)) ? spear : spearN;
                            tropas.sword = (swordN > parseInt(sword)) ? sword : swordN;
                            tropas.axe = (axeN > parseInt(axe)) ? axe : axeN;
                            tropas.archer = (archerN > parseInt(archer)) ? archer : archerN;
                            tropas.spy = (spyN > parseInt(spy)) ? spy : spyN;
                            tropas.marcher = (marcherN > parseInt(marcher)) ? marcher : marcherN;
                            tropas.light = (lightN > parseInt(light)) ? light : lightN;
                            tropas.heavy = (parseInt(heavy) < heavyN) ? parseInt(heavy) : heavyN;
                            tropas.ram = (ramN > parseInt(ram)) ? ram : ramN;
                            tropas.catapult = (catapultN > parseInt(catapult)) ? catapult : catapultN;
                            tropas.snob = (parseInt(snob) && parseInt(snobN)) ? 1 : 0;
                            tropas["string"] = "";
                            if (snobN > 1 && parseInt(snob) > 1) {
                                tropas.light = tropas.light ? tropas.light - (25 * parseInt(snob)) : 0;
                                for (var k = 2; k <= snob && k <= snobN; k++) {
                                    tropas["string"] += "train[" + k + "][axe]=0&";
                                    tropas["string"] += "train[" + k + "][marcher]=0&";
                                    tropas["string"] += "train[" + k + "][light]=" + (tropas.light ? 25 : 0) + "&";
                                    tropas["string"] += "train[" + k + "][snob]=1";
                                    if (k < snobN) {
                                        tropas["string"] += "&";
                                    }
                                }
                            }
                            if (comando == "attack") {
                                tropas.attack = 'l';
                            } else if (comando == "support") {
                                tropas.support = 'l';
                            } else {
                                UI.ErrorMessage("Tipo de comando não especificado!");
                                throw error;
                            }
                            aldeia.data = tropas;
                            i++;
                        } else {
                            removeVillage(aldeia.id);
                            console.log("First Request: " + data.error);
                        }
                        if (i == aldeias.length) {
                            secondRequest();
                        }
                    },
                    error: function(data) {
                        console.log("Error First Request: " + data.status + " { " + data.error + " }");
                        if (data.status == 429 || data.status == 405) {
                            console.log(data.status);
                            removeVillage(aldeia.id);
                            aldeiasAux.push(aldeia);
                            aldeiasLength--;
                        } else {
                            alert("Programa caiu, erro inesperado: { " + data.error + " }");
                            throw error;
                        }
                        if (i == aldeias.length) {
                            secondRequest();
                        }
                    }
                });
            }, random(200, 220) + (random(200, 220) * count));
            count++;
        }
    }

    function secondRequest() {
        let count = 0,
            i = 0;
        if (deuError) {
            $('#combined_table tbody tr').remove();
            $('#combined_table tbody').append('<tr id="listCommands"><td style="text-align:center;color: rgb(70, 39, 7);background-color: burlywood;font-size: x-large;">Aldeias Próprias</td><td style="text-align:center;color: rgb(70, 39, 7);background-color: burlywood;font-size: x-large;">Aldeias Alvos</td><td style="text-align:center;color: rgb(70, 39, 7);background-color: burlywood;font-size: x-large;">Duração</td><td style="text-align:center;color: rgb(70, 39, 7);background-color: burlywood;font-size: x-large;">Status</td></tr>');
        }
        for (let aldeia of aldeias) {
            console.log(aldeia.data);
            setTimeout(function() {
                $.ajax({
                    type: "POST",
                    url: "/game.php?village=" + aldeia.id + "&screen=place&ajax=confirm&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: aldeia.data,
                    dataType: "json",
                    headers: { "TribalWars-Ajax": 1 },
                    success: function(data) {
                        if (!data.error) {
                            string = aldeia.data["string"];
                            aldeia.data = $(data.response.dialog).serialize() + ((string.length) ? ("&" + string) : "");
                            aldeia.time = jQuery('table.vis:eq(0) tr:eq(3) td:eq(1)', data.response.dialog).text();
                            $('#combined_table tbody').append('<tr><td style="text-align:center"><a href="/game.php?village=' + aldeia.id + '">' + aldeia.coord + '</a></td><td style="text-align:center"><a href="/game.php?village=' + game_data.village.id + '&screen=info_village&id=' + aldeia.alvoId + '">' + aldeia.alvoC + '</a></td><td style="text-align:center;">' + aldeia.time + '</td><td id="status"></td></tr>');
                            i++;
                        } else {
                            console.log("Second Request: " + data.error + " coord: " + aldeia.coord);
                            removeVillage(aldeia.id);
                            aldeiasLength--;
                        }
                        if (i == aldeias.length) {
                            $('td#status').text("All Done");
                            $('#listCommands').append('<td><input id="Enviar" class="btn" name="x" type="submit" value="Enviar"></td>');
                            $('#listCommands').before('<p>Engatilhados ' + ($('td#status').length) + ' de ' + aldeiasLength + '</p>');
                            if (!deuError) {
                                $('input#Enviar').click(function(e) {
                                    e.preventDefault();
                                    thirdRequest();
                                });
                            } else {
                                deuError = 0;
                                thirdRequest();
                            }
                        }
                    },
                    error: function(data) {
                        console.log("Error Second Request: " + data.status + " { " + data.error + " }");
                        if (data.status == 429 || data.status == 405) {
                            removeVillage(aldeia.id);
                            removeVillageAux(aldeia.id);
                            aldeiasAux.push(aldeia);
                            aldeiasLength--;
                        } else {
                            alert("Programa caiu, erro inesperado: { " + data.error + " }");
                            throw error;
                        }
                        if (i == aldeias.length) {
                            $('td#status').text("All Done");
                            $('#listCommands').append('<td><input id="Enviar" class="btn" name="x" type="submit" value="Enviar"></td>');
                            $('#listCommands').before('<p>Engatilhados ' + ($('td#status').length) + ' de ' + aldeiasLength + '</p>');
                            if (!deuError) {
                                $('input#Enviar').click(function(e) {
                                    e.preventDefault();
                                    thirdRequest();
                                });
                            } else {
                                deuError = 0;
                                thirdRequest();
                            }
                        }
                    }
                });
            }, random(200, 220) + (random(200, 220) * count));
            count++;
        }
    }

    function thirdRequest() {
        let count = 0,
            i = 0,
            aux = 1;
        for (let aldeia of aldeias) {
            setTimeout(function() {
                $.ajax({
                    url: "/game.php?village=" + aldeia.id + "&screen=place&ajaxaction=popup_command&h=" + csrf_token + "&client_time=" + Math.round(Timing.getCurrentServerTime() / 1e3),
                    data: aldeia.data,
                    type: "POST",
                    dataType: "json",
                    headers: { "TribalWars-Ajax": 1 },
                    success: function(data) {
                        if (!data.error) {
                            $('#combined_table tbody tr:eq(' + aux + ') td:eq(3)').text('ENVIADO!').css("text-align", "center").css("background-color", "#adff2f");
                            removeVillage(aldeia.id);
                        } else if (data.error != _("9a07c3a91c3f2b7a6a8bc675d1bcb913")) {
                            $('#combined_table tbody tr:eq(' + aux + ') td:eq(3)').text('Erorr!').css("text-align", "center").css("background-color", "#ff1313");
                            removeVillage(aldeia.id);
                            console.log("Third Request: " + data.error);
                        } else {
                            $('#combined_table tbody tr:eq(' + aux + ') td:eq(3)').text('ERROR 5 COMMANDS!').css("text-align", "center").css("background-color", "#ff1313");
                            console.log("Third Request 2: " + data.error);
                        }
                        i++;
                        aux++;
                        if (!aldeias.length) {
                            alert('Todos os comandos foram enviados!');
                        } else if (aldeiasLength == i) {
                            aldeias = $.merge(aldeias, aldeiasAux);
                            deuError = 1;
                            firstRequest();
                        }
                    },
                    error: function(data) {
                        console.log("Error Third Request: " + data.status + " { " + data.error + " }");
                        if (data.status == 429 || data.status == 405) {
                            removeVillage(aldeia.id);
                            removeVillageAux(aldeia.id);
                            aldeiasAux.push(aldeia);
                            aldeiasLength--;
                        } else {
                            alert("Programa caiu, erro inesperado: { " + data.error + " }");
                            throw error;
                        }
                        if (!aldeias.length) {
                            alert('Todos os comandos foram enviados!');
                        } else if (aldeiasLength == i) {
                            aldeias = $.merge(aldeias, aldeiasAux);
                            deuError = 1;
                            firstRequest();
                        }
                    }
                });
            }, random(200, 220) + (random(200, 220) * count));
            count++;
        }
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function main() {
        usefullVillages();
        sortCoords();
        firstRequest();
    }

    main();

})();
