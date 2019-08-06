var graduationDate = new Date("may 31, 2020 18:00:00").getTime();

var calc = setInterval(function() {
	var cur = new Date().getTime();
	var t = graduationDate - cur;
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	var months = Math.round(days/31);
	var hours = Math.floor((t % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
	var minutes = Math.floor((t % (1000 * 60 * 60))/(1000 * 60));
	var seconds = Math.floor((t % (1000 * 60))/1000);
	var text = {
		day: ' days, ',
		hour: ' hours, ',
		minute: ' minutes, ',
		second: ' seconds',
		months: ' months',
	};
	if(days === 1) {
		text.day = ' day ';
	} else {
		text.day = ' days ';
	}
	if(months === 1) {
		text.months = ' month),';
	} else {
		text.months = ' months),';
	}
	if(hours === 1) {
		text.hour = ' hour, ';
	} else {
		text.hour = ' hours, ';
	}
	if(minutes === 1) {
		text.minute = ' minute, ';
	} else {
		text.minute = ' minutes, ';
	}
	if(seconds === 1) {
		text.second = ' second';
	} else {
		text.second = ' seconds';
	}
	document.getElementById('count').innerHTML = days + text.day + '(' + months + text.months + ' ' + hours + text.hour + minutes + text.minute + seconds + text.second + "<br>UNTIL GRADUATION";
}, 1000);
