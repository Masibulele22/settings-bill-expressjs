module.exports = function SettingsBill() {

    var smsCost;
    var callCost;
    var warningLevel;
    var criticalLevel;

    var actionList = [];

    function setSettings(settings) {
        smsCost = Number(settings.smsCost),
            callCost = Number(settings.callCost),
            warningLevel = Number(settings.warningLevel),
            criticalLevel = Number(settings.criticalLevel)
    }

    function getSettings() {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {

        let cost = 0;
        if (stopAdding()) {
            if (action === 'sms') {
                cost = smsCost;

                actionList.push({
                    type: action,
                    cost,
                    timestamp: new Date(),
                });
            }
            
            if (action === 'call') {
                cost = callCost;
                actionList.push({
                    type: action,
                    cost,
                    timestamp: new Date(),

                });
            }
            
        }
    }

    function actions() {
        return actionList;
    }

    function actionsFor(type) {
        const filteredActions = [];
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // add the action to the list
                filteredActions.push(action);
            }
        }

        return filteredActions;
    }

    function getTotal(type) {
        let total = 0;
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // if it is add the total to the list
                total += action.cost;
            }
        }
        return total;
    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms').toFixed(2)
        let callTotal = getTotal('call').toFixed(2)

        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal().toFixed(2)
        }
    }

    function stopAdding() {
        return (grandTotal() <= criticalLevel)
    }

    function levelIndicators() {
        if (grandTotal() >= warningLevel && grandTotal() < criticalLevel) {
            return "warning"
        }
        else if (grandTotal() >= criticalLevel) {
            return "danger"
        }

    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        actionsFor,
        totals,
        stopAdding,
        levelIndicators
    }
}