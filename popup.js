// var targetWindow = null;
// var tabCount = 0;
// function start(tab) {
//     chrome.windows.getCurrent(getWindows);
// }
// function getWindows(win) {
//     targetWindow = win;
//     chrome.tabs.getAllInWindow(targetWindow.id, getTabs);
// }
// function getTabs(tabs) {
//     tabCount = tabs.length;
//     // We require all the tab information to be populated.
//     chrome.windows.getAll({"populate" : true}, moveTabs);
// }
// function moveTabs(windows) {
//     var numWindows = windows.length;
//     var tabPosition = tabCount;
//     for (var i = 0; i < numWindows; i++) {
//         var win = windows[i];
//         if (targetWindow.id == win.id) {
//             var numTabs = win.tabs.length;
//             for (var j = 0; j < numTabs; j++) {
//                 var tab = win.tabs[j];
//                 // Move the tab into the window that triggered the browser action.
//                 // chrome.tabs.move(tab.id,
//                 //     {"windowId": targetWindow.id, "index": tabPosition});
//                 // tabPosition++;
//                 console.log("abs");
//             }
//         }
//     }
// }
// // Set up a click handler so that we can merge all the windows.
// chrome.browserAction.onClicked.addListener(start);

var tabs = null;
var oldBooks = null;

document.addEventListener("DOMContentLoaded", function(){
    var nameInput = document.getElementById("saveName");
    var saveSubmit = document.getElementById("saveBut");
    var list = document.getElementById("loadList");
    var helperText = document.getElementById("helperText");
    var loadSubmit = document.getElementById("loadBut");
    var deleteSubmit = document.getElementById("deleteBut");
    var instr = document.getElementById("instructions");


    chrome.storage.sync.get(function(result){
        //console.log(result);
        console.log("RESULT");
        oldBooks = result;
        console.log(oldBooks);
        for(var key in oldBooks){
            var option = document.createElement('option');
            option.text = key;
            option.value = key;
            list.add(option);
        }
    });
    saveSubmit.addEventListener("click", function(){
        chrome.windows.getCurrent({"populate" : true}, function(curWin){
            // Checking for input
            var storeName = nameInput.value;
            if(storeName in oldBooks){
                console.log("detected!")
                helperText.textContent = "ERROR : Group already exists!";
                helperText.style.color = "red";
            }
            else{
                console.log(storeName);

                tabs = curWin["tabs"];
                console.log(tabs);
                var storeObj = tabs.map(function(el){
                    return el["url"]
                });

                chrome.storage.sync.set({[storeName]: storeObj}, function(){
                    var option = document.createElement('option');
                    option.text = storeName;
                    option.value = storeName;
                    list.add(option);
                    console.log("done");
                });

                helperText.textContent = "Saved!";
                helperText.style.color = "green";
            }
            });
    });


    // Pressing enter in input field should trigger saveSubmit
    nameInput.addEventListener("keypress", function(ev){
        if(ev.keyCode == 13){
            saveSubmit.click();
        }
    });

    deleteSubmit.addEventListener("click",function(){
        //delete oldBooks[value]
        var key = list.value;
        console.log("selected - "+ key);
        delete oldBooks[key];
        console.log(oldBooks);
        chrome.storage.sync.remove(key,function(updated){
            console.log("updated");
            console.log(updated);
        });

        list.remove(list.selectedIndex);
        
        instr.textContent = "Removed the group "+key+" !";
        instr.style.color = "green";
        
    });

    loadSubmit.addEventListener("click", function(){
        var key = list.value;
        console.log(typeof oldBooks[key]);
        chrome.windows.create({url:oldBooks[key],state:"maximized"});
        /*for(var i in oldBooks[key]){
            var link = oldBooks[key][i];
            console.log(oldBooks[key][i]);
            chrome.windows.create({url:link});
        }*/
        console.log("LOaded");
    });
});

