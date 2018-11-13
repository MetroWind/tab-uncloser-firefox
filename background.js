function restoreMostRecentFrom(sessions)
{
    if(!sessions.length)
    {
        console.log("No sessions found")
        return;
    }

    let session = sessions[0];
    if(session.tab)
    {
        browser.sessions.restore(session.tab.sessionId);
    }
    else
    {
        browser.sessions.restore(session.window.sessionId);
    }
}

function onError(error)
{
    console.error(error);
}

function restoreMostRecent()
{
    var Sessions = browser.sessions.getRecentlyClosed({maxResults: 1});
    Sessions.then(restoreMostRecentFrom, onError);
}

const Cmds = browser.commands.getAll();
Cmds.then(function(cmds) {
    for(let cmd of cmds)
    {
        console.debug("Registered command " + cmd.name);
    }
});


browser.commands.onCommand.addListener(function(command) {
    if(command == "undo-close-session")
    {
        console.debug("Command triggered: " + command);
        restoreMostRecent();
    }
});

// Context menu
function createContextMenuItem()
{
    browser.menus.create({
        id: "UndoTabClose",
        title: "Reopen Last Tab",
        contexts: ["all"]
    }, null);

}

function removeContextMenuItem()
{
    browser.menus.remove("UndoTabClose");
}

browser.menus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId)
    {
        case "UndoTabClose":
        console.debug("Menu clicked: " + info.menuItemId);
        restoreMostRecent();
        break;

        default:
        console.error("Unknown menu ID: " + info.menuItemId);
    }
});

var ContextMenu = browser.storage.sync.get('InContextMenu');
ContextMenu.then(function(Result){
    if(Result.hasOwnProperty("InContextMenu"))
    {
        if(Result.InContextMenu == true)
        {
            createContextMenuItem();
        }
        else
        {
            removeContextMenuItem();
        }
    }
    else
    {
        createContextMenuItem();
    }
});
