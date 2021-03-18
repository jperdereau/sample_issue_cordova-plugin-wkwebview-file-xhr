/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

/**
 * @param {object} data
 * @return {string}
 */
function getTheRawUA(data) {
	var res = data || [];
	var userAgent = res[0] || {};
	var ua = userAgent.ua || {};
	return ua.rawUa || '';
}

function onDeviceReady() {
	// Cordova is now initialized. Have fun!

	console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
	document.getElementById('deviceready').classList.add('ready');

	// Fetch part

	window
		.fetch('https://www.whatsmyua.info/api/v1/ua')
		.then(function parseJSON(response) {
			return response.json();
		})
		.then(function (data) {
			document.getElementById('fetch').innerText = 'From window.fetch: ' + getTheRawUA(data);
		})
		.catch(function (err) {
			console.error(err);
		});

	// XHR part

	var xhr = new window.XMLHttpRequest();
	var uri = 'https://www.whatsmyua.info/api/v1/ua';

	function onreadystatechange() {
		if (this.readyState === 4) {
			if (this.status < 200 || this.status >= 300) {
				console.error('Error status ' + this.status + ' ' + this.responseText || this.response);
				return;
			}
			var res = [];
			try {
				res = JSON.parse(this.response);
			} catch (err) {
				console.error(err);
			}
			document.getElementById('xhr').innerText = 'From XHR: ' + getTheRawUA(res);
		}
	}

	xhr.onreadystatechange = onreadystatechange;
	xhr.open('GET', uri, true);
	xhr.send();
}
