function restoreMostRecent(sessions)
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

const Cmds = browser.commands.getAll();
Cmds.then(function(cmds) {
    for(let cmd of cmds)
    {
        console.log("Registered command " + cmd.name);
    }
});


browser.commands.onCommand.addListener(function(command) {
    if(command == "undo-close-session")
    {
        console.log("Command triggered: " + command);

        var Sessions = browser.sessions.getRecentlyClosed({maxResults: 1});
        Sessions.then(restoreMostRecent, onError);
    }
});
