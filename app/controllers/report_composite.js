function L(key)
{
    return require('L')(key);
}

var args = arguments[0] || {};
var reportCategory    = args.reportCategory || null;
var reportsCollection = Alloy.Collections.piwikReports;
var reportDate        = require('session').getReportDate();

function registerEvents()
{
    Alloy.Collections.piwikReports.on('reset', hideLoadingIndicator);

    var session = require('session');
    session.on('websiteChanged', onWebsiteChanged);
    session.on('reportDateChanged', onDateChanged);
}

function unregisterEvents()
{
    Alloy.Collections.piwikReports.off('reset', hideLoadingIndicator);
    
    var session = require('session');
    session.off('websiteChanged', onWebsiteChanged);
    session.off('reportDateChanged', onDateChanged);
}

function onClose()
{
    unregisterEvents();

    $.destroy();
}

function hideLoadingIndicator()
{
    $.loadingIndicator.hide();
}

function showLoadingIndicator()
{
    $.loadingIndicator.show();
}

function toggleReportChooserVisibility(event)
{
    require('report/chooser').toggleVisibility();
}

var accountModel = require('session').getAccount();

function accountDidNotChange()
{
    var currentAccount = require('session').getAccount();

    return currentAccount === accountModel;
}

function onWebsiteChanged()
{
    if (accountDidNotChange()) {
        renderListOfReports();
    } else {
        // let reportChooser to the refresh
    }
}

function onDateChanged() 
{
    if (accountDidNotChange()) {
        renderListOfReports();
    } else {
        // let reportChooser to the refresh
    }
}

function filterReports(collection)
{
    if (!reportCategory && collection.at(2)) {
        // TODO remove hardcoded value 2
        reportCategory = collection.at(2).get('category');
    }

    $.index.title = reportCategory;

    return collection.where({category: reportCategory});
}

function isDataAlreadyFetched()
{
    return !!reportsCollection.length;
}

function open()
{
    registerEvents();
    require('layout').open($.index);

    if (isDataAlreadyFetched()) {
        console.log('Fetched');
        hideLoadingIndicator();
        renderListOfReports();
    } else {
        console.log('there');
        showLoadingIndicator();
    }
}

function close()
{
    require('layout').close($.index);
}

exports.close = close;
exports.open  = open;