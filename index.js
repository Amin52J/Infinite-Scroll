/**
 * @desc infinite scroll initializer
 * @param config {object}
 *** @param container {dom-node}
 *** @param scrollTarget {dom-node}
 *** @param url {string}
 *** @param request {object}
 ***** @param data {object} | {string}
 ***** @param method {string}
 *** @param loading {HTML-string}
 *** @param mode {string}
 *** @param moreButton {dom-node}
 *** @param margin {number}
 *** @param onLoad {function}
 **/
var InfiniteScroll = (function (config) {
    var ajax = function () {
        var arg = arguments,
            config = {
                async: arg[0].async || true,
                beforeSend: arg[0].beforeSend || function () {
                },
                complete: arg[0].complete || function () {
                },
                contentType: arg[0].contentType || 'application/x-www-form-urlencoded; charset=UTF-8',
                data: arg[0].data || '',
                dataType: arg[0].dataType || 'text',
                error: arg[0].error || function () {
                },
                fail: arg[0].fail || function () {
                },
                headers: arg[0].headers || {},
                method: arg[0].method || 'POST',
                stringify: arg[0].stringify || false,
                success: arg[0].success || function () {
                },
                timeout: arg[0].timeout || 0,
                url: arg[0].url || '/'
            };

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                var response = xmlhttp.responseText;
                if (config.dataType === 'json') {
                    try {
                        response = JSON.parse(xmlhttp.responseText);
                    }
                    catch (err) {
                        response = response;
                    }
                }
                config.complete(response);
                if (xmlhttp.status == 200) {
                    config.success(response);
                } else if (xmlhttp.status == 400) {
                    config.error(xmlhttp, xmlhttp.status, xmlhttp.responseText);
                } else {
                    config.fail(xmlhttp, xmlhttp.status, xmlhttp.responseText);
                }
            }
        };

        var data = '',
            key;
        if (config.stringify && config.method === 'POST') {
            for (key in config.data) {
                data += String(key) + '=' + JSON.stringify(config.data[key]) + '&';
            }
            config.data = data;
        } else {
            for (key in config.data) {
                data += String(key) + '=' + config.data[key] + '&';
            }
            config.data = data;
        }

        if (config.method === 'POST') {
            xmlhttp.open(config.method, config.url, config.async);
        } else {
            xmlhttp.open(config.method, config.url + '?' + config.data, config.async);
        }
        xmlhttp.responseType = '';
        xmlhttp.timeout = config.timeout;
        xmlhttp.setRequestHeader('Content-Type', config.contentType);
        if (config.headers.length !== undefined) {
            for (key in config.headers) {
                xmlhttp.setRequestHeader(key, config.headers[key]);
            }
        }
        config.beforeSend();
        if (config.method === 'POST') {
            xmlhttp.send(config.data);
        } else {
            xmlhttp.send();
        }
    };
    var infiniteScroll = function () {
        this.infiniteScrolling = true;
        if (typeof this.loadingElement === 'string') {
            this.container.insertAdjacentHTML('beforeend', this.loadingElement);
        }
        else {
            this.container.appendChild(this.loadingElement);
        }
        ajax({
            url: this.url,
            data: this.request.data,
            method: this.request.method,
            complete: (function () {
                this.infiniteScrolling = false;
                this.container.querySelector('.infinite-scroll__loading').parentNode.removeChild(this.container.querySelector('.infinite-scroll__loading'));
            }).bind(this),
            success: (function (resp) {
                this.onLoad.call(this.container, resp);
            }).bind(this)
        });
    };
    var constructor = (function (config) {
        if (!config) {
            config = {};
        }
        this.container = config.container || document.body;
        this.scrollTarget = config.scrollTarget || this.container;
        this.url = config.url || this.container.getAttribute('data-url');
        this.request = {
            data: '',
            method: 'GET'
        };
        this.request.data = config.request && config.request.data ? config.request.data : this.request.data;
        this.request.method = config.request && config.request.method ? config.request.method : this.container.getAttribute('data-method') || this.request.method;
        this.loading = false;
        this.loadingElement = config.loading || '<div class="infinite-scroll__loading">Loading...</div>';
        this.mode = config.mode || this.container.getAttribute('data-mode');
        this.moreButton = config.moreButton;
        this.infiniteScrolling = false;
        this.allItemsLoaded = false;
        this.margin = config.margin || 300 || parseInt(this.container.getAttribute('data-margin'));
        this.onLoad = config.onLoad || function (resp) {
            console.log(resp);
        };
        this.moreButtonClickFunction = (function () {
            if (!this.infiniteScrolling && !this.allItemsLoaded) {
                infiniteScroll.call(this);
            }
        }).bind(this);
        this.scrollEventTarget = this.scrollTarget.tagName.toLowerCase() === 'body' ? window : this.scrollTarget;
        this.scrollFunction = (function () {
            if (this.container.scrollTop > (this.container.scrollHeight - (this.scrollTarget.tagName.toLowerCase() === 'body' ? window : this.scrollTarget).innerHeight) - this.margin && !this.infiniteScrolling && !this.allItemsLoaded) {
                infiniteScroll.call(this);
            }
        }).bind(this);

        if (this.mode === 'button') {
            if (this.moreButton) {
                this.moreButton.addEventListener('click', this.moreButtonClickFunction);
            }
            else {
                console.error('Please specify a moreButton inside the config or remove the button mode.');
            }
        }
        else {
            this.scrollEventTarget.addEventListener('scroll', this.scrollFunction);
        }
    });

    constructor.prototype.allDataLoaded = function (val) {
        this.allItemsLoaded = !!val;
        return this;
    };

    constructor.prototype.unbind = function () {
        if (this.mode === 'button' && this.moreButton) {
            this.moreButton.removeEventListener('click', this.moreButtonClickFunction);
        }
        else {
            this.scrollEventTarget.removeEventListener('scroll', this.scrollFunction);
        }
    };

    return new constructor(config);
});
