Date.prototype.add = function (sInterval, iNum) {
    var dTemp = this;
    if (!sInterval || iNum == 0) return dTemp;
    switch (sInterval.toLowerCase()) {
        case "ms":
            dTemp.setMilliseconds(dTemp.getMilliseconds() + iNum);
            break;
        case "s":
            dTemp.setSeconds(dTemp.getSeconds() + iNum);
            break;
        case "mi":
            dTemp.setMinutes(dTemp.getMinutes() + iNum);
            break;
        case "h":
            dTemp.setHours(dTemp.getHours() + iNum);
            break;
        case "d":
            dTemp.setDate(dTemp.getDate() + iNum);
            break;
        case "mo":
            dTemp.setMonth(dTemp.getMonth() + iNum);
            break;
        case "y":
            dTemp.setFullYear(dTemp.getFullYear() + iNum);
            break;
    }
    return dTemp;
};

String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    var str, i = -1, _token;
    if ((str = this.toString()) && typeof token === "string") {
        _token = ignoreCase === true ? token.toLowerCase() : undefined;
        while ((i = (
            _token !== undefined ?
                str.toLowerCase().indexOf(
                            _token,
                            i >= 0 ? i + newToken.length : 0
                ) : str.indexOf(
                            token,
                            i >= 0 ? i + newToken.length : 0
                )
        )) !== -1) {
            str = str.substring(0, i)
                    .concat(newToken)
                    .concat(str.substring(i + token.length));
        }
    }
    return str;
};

var parseMsDate = function (key, value) {
    var dateRegex, dateValue, newVal;
    dateRegex = new RegExp("\\/Date\\((-?[0-9]+)\\)\\/", "g");
    if (value && typeof value === 'string' && value.indexOf("/Date") > -1) {
        newValue = value.replace(dateRegex, "$1");
        dateValue = new Date(parseInt(newValue, 10));
        if (!isNaN(dateValue)) {
            return dateValue;
        }
    }
    return value;
}

$(document).keyup(function (args) {
    if (args.keyCode == 13 && args.target.nodeName.toLowerCase() != "textarea") {
        if ($(".defaultButton").size() == 1) {
            window.location = $(".defaultButton").attr('href');
        }
        else {
            if ($(".button.right").size() == 1) {
                $(".button.right").click();
                //window.location = $(".button.right").attr('href');
            }
        }
    }
});



function supportsSvg() {
    return document.implementation.hasFeature("org.w3c.svg", "1.0")
}

function isDate(txtDate) {
    var separator = "/";
    var aoDate,           // needed for creating array and object
        ms,               // date in milliseconds
        month, day, year; // (integer) month, day and year
    // if separator is not defined then set '/'
    if (separator === undefined) {
        separator = '/';
    }
    // split input date to month, day and year
    aoDate = txtDate.split(separator);
    // array length should be exactly 3 (no more no less)
    if (aoDate.length !== 3) {
        return false;
    }
    // define month, day and year from array (expected format is m/d/yyyy)
    // subtraction will cast variables to integer implicitly
    month = aoDate[0] - 1; // because months in JS start from 0
    day = aoDate[1] - 0;
    year = aoDate[2] - 0;
    // test year range
    if (year < 1000 || year > 3000) {
        return false;
    }
    // convert input date to milliseconds
    ms = (new Date(year, month, day)).getTime();
    // initialize Date() object from milliseconds (reuse aoDate variable)
    aoDate = new Date();
    aoDate.setTime(ms);
    // compare input date and parts from Date() object
    // if difference exists then input date is not valid
    if (aoDate.getFullYear() !== year ||
        aoDate.getMonth() !== month ||
        aoDate.getDate() !== day) {
        return false;
    }
    // date is OK, return true
    return true;
}

$(document).ready(function () {
    try {
        $(".datebox").datepicker();
        $(".phonebox").mask("999-999-9999");
        setInterval(keepSessionAlive, 60000);

    } catch (ex) {

    }
    if ($.colorbox) {
        $(document).bind("cbox_open", function () {
            $("#cboxClose").css("bottom", "");
            $("#cboxClose").css("top", 0);
        });
    }
});

function keepSessionAlive() {
    loadAjax("/Account/KeepSessionAlive", null, function (results) {
        if (!results) {
            //possibly need to warn the user their session has timed out.
        };
    }, function () {
        this.alertDialog("Cannot connect to the web server.  Please check your network connection", "Connection Error");
        //There is an error connecting to the server.  May need to warn the user.
    });
}

var newid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

if (!Array.prototype.indexOf) {

    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {


        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0)
            return -1;

        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n !== n)
                n = 0;
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }

        if (n >= len)
            return -1;

        var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);

        for (; k < len; k++) {
            if (k in t && t[k] === searchElement)
                return k;
        }
        return -1;
    };

}


function reportErrors(results) {
    var errors = "";
    for (var i = 0; i < results.Errors.length; i++) {
        errors += results.Errors[i] + "\r\n";
    }
    alert(errors);
}

function updateJqueryUI() {
    try {
        $("button").button();
        $(".buttonSet").buttonset();
        $(".datebox").datepicker();
        $(".print-button").button({
            icons: {
                primary: "ui-icon-print"
            }
        });
        $(".cancel-button").button({
            icons: {
                primary: "ui-icon-cancel"
            }
        });
        $(".save-button").button({
            icons: {
                primary: "ui-icon-disk"
            }
        });
        $(".gear-button").button({
            icons: {
                primary: "ui-icon-gear"
            }
        });
        $(".return-button").button({
            icons: {
                primary: "ui-icon-arrowreturnthick-1-w"
            }
        });
        $(".search-button").button({
            icons: {
                primary: "ui-icon-search"
            }
        });

    } catch (e) { }
}

function loadAjax(url, data, results, errorHandler) {
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/json',

        success: function (data) {
            results(data);
            updateJqueryUI();
        },
        error: function (e, b, c) {
            if (errorHandler && typeof (errorHandler) == "function") {
                errorHandler();
            }
            else
                alert("Call failed to the server");
        },
        converters: {
            "text json": function (data) {
                var msg;
                try {
                    msg = JSON.parse(data, parseMsDate);
                    return msg;
                } catch (e) {
                    return null;
                }
            }
        }
    });
}



function alertDialog(message, title, closedCallback) {
    $("#alertDialogTitle").text(title);
    $("#alertDialogBody").html(message);

    $("#alertDialog").unbind("on");
    $("#alertDialog").on("hidden.bs.modal", function () {
        if (closedCallback)
            closedCallback();
    });

    $("#alertDialog").modal();
}

function showAlert(message, title) {
    $("#dialogTitle").html(title);
    $("#dialogText").html(message);

    $.mobile.changePage("#messageBoxPopup", { transition: "slidedown", role: "dialog" });
}

function confirmDialog(message, title, confirmAction) {
    $("#confirmationDialogTitle").text(title);
    $("#confirmDialogBody").html(message);
    $("#confirmationDialogYesButton").unbind("click");
    $("#confirmationDialogYesButton").click(function () {
        confirmAction();
        $("#confirmationDialog").modal("hide");
    });

    $("#confirmationDialog").modal();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

ko.bindingHandlers.dataGridForEach = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).jqGrid("clearGridData");
        if (valueUnwrapped != null) {
            for (var i = 0; i < valueUnwrapped.length; i++) {
                $(element).jqGrid('addRowData', i + 1, valueUnwrapped[i]);
            }
        }
    }
};

ko.bindingHandlers.emailAnchor = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).text(valueUnwrapped);
        element.href = "mailto:" + valueUnwrapped;
    }
};

ko.bindingHandlers.datePicker = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        if (valueUnwrapped)
            $(element).datepicker();
    }
};

ko.bindingHandlers.hidden = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        if (!valueUnwrapped)
            $(element).show();
        else
            $(element).hide();
    }
};

ko.bindingHandlers.phoneAnchor = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).text(valueUnwrapped);
        element.href = "tel:+" + valueUnwrapped;
    }
};


ko.bindingHandlers.fadeToVisible = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        if (valueUnwrapped)
            $(element).fadeIn("slow");
        else
            $(element).hide();
    }
};

ko.bindingHandlers.enterAction = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).unbind("keyup");

        $(element).keyup(function (event) {
            if (event.which == 13) {
                valueUnwrapped();
            }
        });
    }
};

ko.bindingHandlers.formatCurrency = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).text($().number_format(valueUnwrapped, { symbol: '$' }));
    }
};

ko.bindingHandlers.formatNumber = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).text($().number_format(valueUnwrapped, { symbol: '' }));
    }
};

ko.bindingHandlers.formatDate = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).text(formatDate(valueUnwrapped));
    }
};

function formatDate(date) {
    if (!date)
        return null;
    date = new Date(date);
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

ko.bindingHandlers.formatPercent = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        $(element).text($().number_format(valueUnwrapped * 100, { symbol: '', numberOfDecimals: 1 }) + "%");
    }
};

function formatTime(date) {
    if (!date)
        return null;

    var ampm = "AM";
    var hour = dt.getHours();
    if (hour > 12) {
        hour -= 12;
        ampm = "PM";
    }

    return hour + ":" + date.getMinutes() + " " + ampm;
}

jQuery.fn.extend({ //indica que est� sendo criado um plugin

    number_format: function (numero, params) //indica o nome do plugin que ser� criado com os parametros a serem informados
    {
        //parametros default
        var sDefaults =
			{
			    numberOfDecimals: 2,
			    decimalSeparator: '.',
			    thousandSeparator: ',',
			    symbol: ''
			}

        //fun��o do jquery que substitui os parametros que n�o foram informados pelos defaults
        var options = jQuery.extend(sDefaults, params);

        //CORPO DO PLUGIN
        var number = numero;
        var decimals = options.numberOfDecimals;
        var dec_point = options.decimalSeparator;
        var thousands_sep = options.thousandSeparator;
        var currencySymbol = options.symbol;

        var exponent = "";
        var numberstr = number.toString();
        var eindex = numberstr.indexOf("e");
        if (eindex > -1) {
            exponent = numberstr.substring(eindex);
            number = parseFloat(numberstr.substring(0, eindex));
        }

        if (decimals != null) {
            var temp = Math.pow(10, decimals);
            number = Math.round(number * temp) / temp;
        }
        var sign = number < 0 ? "-" : "";
        var integer = (number > 0 ?
		  Math.floor(number) : Math.abs(Math.ceil(number))).toString();

        var fractional = number.toString().substring(integer.length + sign.length);
        dec_point = dec_point != null ? dec_point : ".";
        fractional = decimals != null && decimals > 0 || fractional.length > 1 ?
				   (dec_point + fractional.substring(1)) : "";
        if (decimals != null && decimals > 0) {
            for (i = fractional.length - 1, z = decimals; i < z; ++i)
                fractional += "0";
        }

        thousands_sep = (thousands_sep != dec_point || fractional.length == 0) ?
            thousands_sep : null;
        if (thousands_sep != null && thousands_sep != "") {
            for (i = integer.length - 3; i > 0; i -= 3)
                integer = integer.substring(0, i) + thousands_sep + integer.substring(i);
        }

        if (options.symbol == '') {
            return sign + integer + fractional + exponent;
        }
        else {
            return currencySymbol + ' ' + sign + integer + fractional + exponent;
        }
        //FIM DO CORPO DO PLUGIN	

    }
});

ko.bindingHandlers.bindchart = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);

        if (!valueUnwrapped)
            return;

        var chartType = $(element).attr("data-chart-type");
        if (!chartType)
            chartType = "Bar2D.swf";

        var id = $(element).attr("id");

        if (!id) {
            id = newid();

            $(element).attr("id", id);
        }

        var chartWidth = $(element).attr("data-chart-width");
        if (!chartWidth)
            chartWidth = 200;

        var chartHeight = $(element).attr("data-chart-height");
        if (!chartHeight)
            chartHeight = 200;


        var goalChart = new FusionCharts(chartType, newid(), chartWidth, chartHeight, "0");
        var json = JSON.stringify(valueUnwrapped);
        goalChart.setJSONData(json);
        //goalChart.setJSONData(valueUnwrapped);
        goalChart.render(id);
    }
};

function setCookie(c_name, value) {
    var exdays = 1000;
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}
function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}