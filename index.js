const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
const settingsBills = require('./SettingsBill');
const settingsBillz = settingsBills()

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});



app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



app.get('/', function(req, res){
    //console.log(settingsBillz.getSettings());

    res.render('index', {
       settings: settingsBillz.getSettings(),
       totals: settingsBillz.totals(),
       color: settingsBillz.levelIndicators()
    });
});

app.post('/settings', function(req, res){
    //  console.log(settingsBill)
    settingsBillz.setSettings(req.body);
    // console.log(settingsBillz.getSettings());

    res.redirect('/');
});

// app.post('/settings', function(req, res){
//     //  console.log(settingsBill)
//     settingsBillz.setSettings(req.body.smsCost);
//     settingsBillz.setSettings(req.body.callCost);
//     settingsBillz.setSettings(req.body.warningLevel);
//     settingsBillz.setSettings(req.body.criticalLevel);    
//    // console.log(settingsBillz.getSettings());

//     res.redirect('/');
// });

// app.post('/settings', function(req, res){
//     let smsCost = req.body.smsCost;
//     let callCost = req.body.callCost;
//     let warningLevel = req.body.warningLevel;
//     let criticalLevel = req.body.criticalLevel;

//     var settings = {
//       smsCost,
//       callCost,
//       warningLevel,
//       criticalLevel
//     };

//     // process data
//     globalSetings = settings;

//     // note that data can be sent to the template
//     res.render('home', {settings})
// });

app.post('/action', function(req, res){
    
    //console.log(req.body.actionType);
    settingsBillz.recordAction(req.body.actionType);

    res.redirect('/');
});

app.get('/actions', function(req, res) {
    
    const recordedAction =  settingsBillz.actions();
    // console.log(recordedAction);
    for(i = 0; i < recordedAction.length; i++) {
        var newRecordedAction = recordedAction[i];
        recordedAction[i].timeAgo = moment(newRecordedAction.timestamp).fromNow();
    };
    
        console.log({recordedAction});

    // var Action = moment().fromNow();

    res.render('actions', {actions: recordedAction});
    
});

app.get('/actions/:type', function(req, res){
    const actionType = req.params.type;
    res.render('actions', {totals: settingsBillz.actions(actionType)});
});

let PORT = process.env.PORT || 4004;


app.listen(PORT, function(){
    console.log('App is starting Port on:', PORT);
});
