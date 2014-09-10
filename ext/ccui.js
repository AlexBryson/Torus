new Torus.classes.Extension('ccui', -3);
Torus.ext.ccui.text = 'CCUI';

Torus.ext.ccui.checking = false;

Torus.ext.ccui.render = function() {
	var top = document.createElement('div');
		var info = document.createElement('div');
			info.id = 'torus-ext-ccui-domain';
			Torus.ui.ids['ext-ccui-domain'] = info;
			info.className = 'torus-ext-ccui-info';
			//info.textContent = 'Current domain: ' + Torus.local.domain + '. ';
			var log = document.createElement('a');
				log.href = '/wiki/Special:Log/chatconnect';
				log.title = 'Special:Log/chatconnect';
				log.textContent = 'S:L/chatconnect';
			info.appendChild(log);
		top.appendChild(info);
		var label = document.createElement('label');
			label.setAttribute('for', 'torus-ext-ccui-input');
			label.textContent = 'User or IP:';
		top.appendChild(label);
		top.appendChild(document.createTextNode(' '));
		var input = document.createElement('input');
			input.id = 'torus-ext-ccui-input';
			Torus.ui.ids['ext-ccui-input'] = input;
			input.type = 'text';
			input.addEventListener('keyup', Torus.ext.ccui.input_keyup);
		top.appendChild(input);
		var button = document.createElement('input');
			button.id = 'torus-ext-ccui-button';
			Torus.ui.ids['ext-ccui-button'] = button;
			button.type = 'submit';
			button.value = 'Find';
			button.addEventListener('click', Torus.ext.ccui.button_click);
		top.appendChild(button);
		top.appendChild(document.createTextNode(' '));
		var label = document.createElement('label');
			label.setAttribute('for', 'torus-ext-ccui-limit');
			label.textContent = 'Search last';
		top.appendChild(label);
		top.appendChild(document.createTextNode(' '));
		var limit = document.createElement('input');
			limit.id = 'torus-ext-ccui-limit';
			Torus.ui.ids['ext-ccui-limit'] = limit;
			limit.type = 'number';
			limit.value = '500';
		top.appendChild(limit);
		top.appendChild(document.createTextNode(' '));
		var label = document.createElement('label');
			label.setAttribute('for', 'torus-ext-ccui-limit');
			label.textContent = 'connections';
		top.appendChild(label);
		top.appendChild(document.createTextNode(' '));
		var wait = document.createElement('img');
			wait.id = 'torus-ext-ccui-wait';
			Torus.ui.ids['ext-ccui-wait'] = wait;
			wait.src = 'http://slot1.images.wikia.nocookie.net/__cb1410215834/common/skins/common/images/ajax.gif';
			wait.style.display = 'none';
		top.appendChild(wait);
	Torus.ui.ids['window'].appendChild(top);

	var tables = ['ips', 'exact', 'close', 'far'];
	for(var i = 0; i < tables.length; i++) {
		var div = document.createElement('div');
			div.id = 'torus-ext-ccui-' + tables[i];
			Torus.ui.ids['ext-ccui-' + tables[i]] = div;
			div.className = 'torus-ext-ccui-table';
			var info = document.createElement('div');
				info.id = 'torus-ext-ccui-' + tables[i] + '-info';
				Torus.ui.ids['ext-ccui-' + tables[i] + '-info'] = info;
				info.className = 'torus-ext-ccui-info';
				info.appendChild(document.createTextNode(' '));
				var span = document.createElement('span');
					span.id = 'torus-ext-ccui-' + tables[i] + '-num';
					Torus.ui.ids['ext-ccui-' + tables[i] + '-num'] = span;
					span.textContent = '0';
				info.appendChild(span);
			div.appendChild(info);
			var table = document.createElement('div');
				table.id = 'torus-ext-ccui-' + tables[i] + '-table';
				Torus.ui.ids['ext-ccui-' + tables[i] + '-table'] = table;
				var time = document.createElement('ul');
					time.id = 'torus-ext-ccui-' + tables[i] + '-time';
					Torus.ui.ids['ext-ccui-' + tables[i] + '-time'] = time;
				table.appendChild(time);
				var users = document.createElement('ul');
					users.id = 'torus-ext-ccui-' + tables[i] + '-users';
					Torus.ui.ids['ext-ccui-' + tables[i] + '-users'] = users;
				table.appendChild(users);
				var ips = document.createElement('ul');
					ips.id = 'torus-ext-ccui-' + tables[i] + '-ips';
					Torus.ui.ids['ext-ccui-' + tables[i] + '-ips'] = ips;
				table.appendChild(ips);
			div.appendChild(table);
		Torus.ui.ids['window'].appendChild(div);
	}
	Torus.ui.ids['ext-ccui-ips-info'].firstChild.textContent = 'User\'s IPs: ';
	Torus.ui.ids['ext-ccui-exact-info'].firstChild.textContent = 'Exact matches: ';
	Torus.ui.ids['ext-ccui-close-info'].firstChild.textContent = '/24 matches: ';
	Torus.ui.ids['ext-ccui-far-info'].firstChild.textContent = '/16 matches: ';
}

Torus.ext.ccui.fill = function(user, limit) {
	if(Torus.ui.active != Torus.ext.ccui || Torus.ext.ccui.checking) {return;}

	Torus.ui.ids['ext-ccui-wait'].style.display = 'inline';
	Torus.ext.ccui.clear();
	Torus.ext.ccui.checking = true;

	if(Torus.util.ip_to_int(user) == 0) {var func = Torus.ext.ccui.check_user;} //is a username
	else {var func = Torus.ext.ccui.check_ip;} //is an IP

	func(user, limit, function(matches) {
		if(Torus.ui.active != Torus.ext.ccui) {return;}

		for(var i in matches) {
			Torus.ui.ids['ext-ccui-' + i + '-num'].textContent = matches[i].length;

			var even = true;
			for(var j = 0; j < matches[i].length; j++) {
				var time = document.createElement('li');
					time.textContent = Torus.util.print_mwdate(matches[i][j].timestamp);
					time.className = 'torus-ext-ccui-timestamp';
					if(even) {time.className += ' torus-ext-ccui-li-even';}
					else {time.className += ' torus-ext-ccui-li-odd';}
				Torus.ui.ids['ext-ccui-' + i + '-time'].appendChild(time);

				var user = document.createElement('li');
					user.textContent = matches[i][j].user;
					user.className = 'torus-ext-ccui-user';
					if(even) {user.className += ' torus-ext-ccui-li-even';}
					else {user.className += ' torus-ext-ccui-li-odd';}
				Torus.ui.ids['ext-ccui-' + i + '-users'].appendChild(user);

				var ip = document.createElement('li');
					ip.textContent = matches[i][j].ip;
					ip.className = 'torus-ext-ccui-ip';
					if(even) {ip.className += ' torus-ext-ccui-li-even';}
					else {ip.className += ' torus-ext-ccui-li-odd';}
				Torus.ui.ids['ext-ccui-' + i + '-ips'].appendChild(ip);

				if(even) {even = false;}
				else {even = true;}
			}
		}

		Torus.ui.ids['ext-ccui-wait'].style.display = 'none';
		Torus.ext.ccui.checking = false;
	});
}

Torus.ext.ccui.clear = function() {
	if(Torus.ui.active != Torus.ext.ccui) {return;}

	var ul = Torus.ui.ids['window'].getElementsByTagName('ul');
	for(var i = 0; i < ul.length; i++) {Torus.util.empty(ul[i]);}

	Torus.ui.ids['ext-ccui-ips-num'].textContent = '0';
	Torus.ui.ids['ext-ccui-exact-num'].textContent = '0';
	Torus.ui.ids['ext-ccui-close-num'].textContent = '0';
	Torus.ui.ids['ext-ccui-far-num'].textContent = '0';
}

Torus.ext.ccui.check_user = function(user, limit, callback) {
	Torus.ext.ccui.batch(['', user], limit, function(data) {
		if(typeof callback != 'function') {return;}

		var matches = {
			ips: [],
			exact: [],
			close: [],
			far: []
		};

		//first, get all the ips `user` has connected from
		for(var i = 0; i < data[user].length; i++) {
			//don't add duplicates - these come to us sorted newest first, and we want the newest entries anyway
			var add = true;
			for(var j = 0; j < matches.ips.length; j++) {
				if(data[user][i].ip == matches.ips[j].ip) {add = false; break;}
			}
			if(add) {matches.ips.push(data[user][i]);}
		}

		//now figure out what they match
		for(var i = 0; i < data[''].length; i++) {
			if(data[''][i].user == user) {continue;}

			var best = '';
			for(var j = 0; j < matches.ips.length; j++) {
				if(data[''][i].ip == matches.ips[j].ip) {best = 'exact'; break;}
				else if(Torus.util.match_ip24(data[''][i].ip, matches.ips[j].ip)) {best = 'close';}
				else if(Torus.util.match_ip16(data[''][i].ip, matches.ips[j].ip) && best == '') {best = 'far';}
			}
			if(best) {matches[best].push(data[''][i]);}
		}

		callback.call(Torus, matches);
	});
}

Torus.ext.ccui.check_ip = function(ip, limit, callback) {
	Torus.ext.ccui.fetch('', limit, function(data) {
		if(typeof callback != 'function') {return;}
		if(typeof ip == 'number') {ip = Torus.util.int_to_ip(ip);}

		var matches = {
			ips: [],
			exact: [],
			close: [],
			far: []
		};

		//this is easier than checking a user, because we already have the only IP
		for(var i = 0; i < data.length; i++) {
			if(data[i].ip == ip) {matches.exact.push(data[i]);}
			else if(Torus.util.match_ip24(data[i].ip, ip)) {matches.close.push(data[i]);}
			else if(Torus.util.match_ip16(data[i].ip, ip)) {matches.far.push(data[i]);}
		}
		
		callback.call(Torus, matches);
	});
}

Torus.ext.ccui.compare_users = function(users, limit, callback) {
	Torus.ext.ccui.batch(users, limit, function(data) {
		if(typeof callback != 'function') {return;}

		var matches = {
			ips: {},
			users: {}
		};

		for(var user in data) {
			matches.users[user] = {
				ips: [],
				exact: [],
				close: [],
				far: []
			};
			for(var j = 0; j < data[user].length; j++) {
				var entry = data[user][j];

				//don't add duplicates - these come to us sorted newest first, and we want the newest entries anyway
				var add = true;
				for(var k = 0; k < matches.users[user].ips.length; k++) { //yo dawg, i herd u leik for loops
					if(entry.ip == matches.users[user].ips[k].ip) {add = false; break;}
				}
				if(add) {matches.users[user].ips.push(entry);}

				if(!matches.ips[entry.ip]) {
					matches.ips[entry.ip] = {
						ips: [], //not that we ever use this
						exact: [],
						close: [],
						far: []
					};
				}
			}
		}

		//now we have everyone's IPs
		//fill matches.ips first
		for(var ip in matches.ips) {
			for(var user in data) {
				for(var j = 0; j < data[user].length; j++) {
					var entry = data[user][j];
					if(ip == entry.ip) {matches.ips[ip].exact.push(entry);}
					else if(Torus.util.match_ip24(ip, entry.ip)) {matches.ips[ip].close.push(entry);}
					else if(Torus.util.match_ip16(ip, entry.ip)) {matches.ips[ip].far.push(entry);}
				}
			}
		}

		//now we know every match for every ip
		//we can do the merge half of merge sort to fill the user matches in sorted order now
		for(var i in matches.users) {
			var ips = [];
			var pointers = [];
			for(var j = 0; j < matches.users[i].ips.length; j++) {
				ips.push(matches.ips[matches.users[i].ips[j].ip]);
				pointers.push(0);
			}
			if(ips.length == 0) {continue;} //this will probably never happen but if it did it would probably be bad
			var empty = 0;

			var arrs = ['exact', 'close', 'far'];
			for(var j = 0; j < arrs.length; j++) {
				while(empty < ips.length) {
					var max_i = 0;
					var max_time = 0;
					for(var k = 0; k < ips.length; k++) {
						if(pointers[k] == ips[k][arrs[j]].length) {continue;}
						var t = ips[k][arrs[j]][pointers[k]].timestamp.getTime();
						if(t > max_time) {
							max_i = k;
							max_time = t;
						}
					}
					if(max_time == 0) {break;} //everything is empty

					var max = ips[max_i][arrs[j]][pointers[max_i]];
					if( //filter duplicates:
						max.user != i //this is an entry from the user we're looking at, it doesn't count
						&& matches.users[i].exact.indexOf(max) == -1 //we add these closest first
						&& matches.users[i].close.indexOf(max) == -1 //so if it hits any of these,
						&& matches.users[i].far.indexOf(max) == -1 //we've already added it in a closer list
					) {matches.users[i][arrs[j]].push(max);}

					pointers[max_i]++;
					if(pointers[max_i] == ips[max_i].length) {empty++;}
				}
				empty = 0;
				for(var k = 0; k < ips.length; k++) {pointers[k] = 0;}
			}
		}

		callback.call(Torus, matches);
	});
}

Torus.ext.ccui.fetch = function(user, limit, callback) {
	if(!user) {user = '';} //rather than &user=undefined or &user=false or something
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/wiki/Special:Log/chatconnect?user=' + user + '&limit=' + limit + '&useskin=monobook', true);
	xhr.responseType = 'document';
	xhr.onreadystatechange = function() {
		if(this.readyState == 4) {
			this.onreadystatechange = null;
			if(this.status == 200 && typeof callback == 'function') {
				var li = this.response.getElementById('mw-content-text').getElementsByTagName('ul')[0].getElementsByTagName('li');
				var data = [];
				for(var i = 0; i < li.length; i++) {
					data.push({
						timestamp: Torus.util.parse_mwdate(li[i].firstChild.textContent.trim()),
						//timestamp: li[i].firstChild.textContent.trim(),
						user: li[i].getElementsByTagName('a')[0].textContent,
						ip: li[i].lastChild.textContent.trim().substring(li[i].lastChild.textContent.trim().lastIndexOf(' ') + 1),
					});
				}
				callback.call(Torus, data, user);
			}
		}
	}
	xhr.send();
}

Torus.ext.ccui.batch = function(users, limit, callback) { //suddenly B3 functions are useful
	var group = {};
	var waiting = users.length;
	for(var i = 0; i < users.length; i++) {
		Torus.ext.ccui.fetch(users[i], limit, function(data, user) {
			group[user] = data;
			waiting--;
			if(waiting == 0 && typeof callback == 'function') {callback.call(Torus, group);}
		});
	}
	return group;
}

Torus.ext.ccui.button_click = function(event) {
	if(Torus.ui.ids['ext-ccui-input'].value) {Torus.ext.ccui.fill(Torus.ui.ids['ext-ccui-input'].value, Torus.ui.ids['ext-ccui-limit'].value);}
}

Torus.ext.ccui.input_keyup = function(event) {
	if(event.keyCode == 13 && this.value) {Torus.ext.ccui.fill(this.value, Torus.ui.ids['ext-ccui-limit'].value);}
}

//parses dates of the form HH:mm, Month D, YYYY
//eg 22:46, September 7, 2014
//MW dumps these out on log pages
Torus.util.parse_mwdate = function(date) {
	var spl = date.split(',');
	for(var i = 0; i < spl.length; i++) {spl[i] = spl[i].trim().toLowerCase();}

	var hours = spl[0].substring(0, spl[0].indexOf(':')) * 1;
	var minutes = spl[0].substring(spl[0].indexOf(':') + 1) * 1;

	switch(spl[1].substring(0, spl[1].indexOf(' '))) {
		case 'january':   var month = 0; break;
		case 'february':  var month = 1; break;
		case 'march':     var month = 2; break;
		case 'april':     var month = 3; break;
		case 'may':       var month = 4; break;
		case 'june':      var month = 5; break;
		case 'july':      var month = 6; break;
		case 'august':    var month = 7; break;
		case 'september': var month = 8; break;
		case 'october':   var month = 9; break;
		case 'november':  var month = 10; break;
		case 'december':  var month = 11; break;
	}
	var day = spl[1].substring(spl[1].indexOf(' ') + 1) * 1;

	var year = spl[2] * 1;

	return new Date(Date.UTC(year, month, day, hours, minutes));
}

//inverse of util.parse_mwdate
Torus.util.print_mwdate = function(date) {
	var hours = date.getUTCHours();
	if(hours < 10) {hours = '0' + hours;}
	var minutes = date.getUTCMinutes();
	if(minutes < 10) {minutes = '0' + minutes;}

	switch(date.getUTCMonth()) {
		case 0: var month = 'January'; break;
		case 1: var month = 'February'; break;
		case 2: var month = 'March'; break;
		case 3: var month = 'April'; break;
		case 4: var month = 'May'; break;
		case 5: var month = 'June'; break;
		case 6: var month = 'July'; break;
		case 7: var month = 'August'; break;
		case 8: var month = 'September'; break;
		case 9: var month = 'October'; break;
		case 10: var month = 'November'; break;
		case 11: var month = 'December'; break;
	}
	var day = date.getUTCDate();

	var year = date.getUTCFullYear();

	return hours + ':' + minutes + ', ' + month + ' ' + day + ', ' + year;
}

Torus.util.ip_to_int = function(ip) {
	var spl = ip.split('.');
	if(spl.length != 4) {return 0;}
	var num = 0;
	for(var i = spl.length - 1; i >= 0; i--) {num += spl[spl.length - i - 1] * Math.pow(256, i);}
	return num;
}

Torus.util.int_to_ip = function(num) {
	var ip = '';
	for(var i = 3; i >= 0; i--) {
		var block = Math.floor(num / Math.pow(256, i));
		ip += block + '.';
		num -= block * Math.pow(256, i);
	}
	return ip.substring(0, ip.length - 1);
}

//check if two ips are in the same block
Torus.util.match_ip = function(ip1, ip2, block) {
	if(block < 0) {throw new Error('Bad call to util.match_ip');}
	if(block >= 32) {block %= 32;}
	if(typeof ip1 == 'string') {ip1 = Torus.util.ip_to_int(ip1);}
	if(typeof ip2 == 'string') {ip2 = Torus.util.ip_to_int(ip2);}

	var mask = 0;
	for(var i = 0; i < block; i++) {mask += 1 << (31 - block);}
	return (ip1 & mask) == (ip2 & mask);
}

//check if two ips are in the same /24 block
Torus.util.match_ip24 = function(ip1, ip2) {
	//FIXME: we could just convert them to ints and not care
	if(typeof ip1 == 'string') {
		if(typeof ip2 == 'number') {ip2 = Torus.util.int_to_ip(ip2);}
		return ip1.substring(0, ip1.lastIndexOf('.') + 1) == ip2.substring(0, ip2.lastIndexOf('.') + 1);
	}
	else if(typeof ip1 == 'number') {
		if(typeof ip2 == 'string') {ip2 = Torus.util.ip_to_int(ip2);}
		return (ip1 & 0xffffff00) == (ip2 & 0xffffff00);
	}
	else {throw new Error('Bad call to util.match_ip24');}
}

//check if two ips are in the same /16 block
Torus.util.match_ip16 = function(ip1, ip2) {
	//FIXME: we could just convert them to ints and not care
	if(typeof ip1 == 'string') {
		if(typeof ip2 == 'number') {ip2 = Torus.util.int_to_ip(ip2);}
		return ip1.substring(0, ip1.indexOf('.', ip1.indexOf('.') + 1) + 1) == ip2.substring(0, ip2.indexOf('.', ip2.indexOf('.') + 1) + 1);
	}
	else if(typeof ip1 == 'number') {
		if(typeof ip2 == 'string') {ip2 = Torus.util.ip_to_int(ip2);}
		return (ip1 & 0xffff0000) == (ip2 & 0xffff0000);
	}
	else {throw new Error('Bad call to util.match_ip24');}
}

Torus.ext.ccui.add_listener('ui', 'activate', Torus.ext.ccui.render);
Torus.ext.ccui.add_listener('ui', 'deactivate', Torus.util.null); //FIXME: i'm sure something important is supposed to go here
