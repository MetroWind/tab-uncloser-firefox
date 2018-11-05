const CmdUndoSession = 'undo-close-session';
let IconOk = document.getElementById("IconOk");
let IconNotOk = document.getElementById("IconNotOk");

/**
 * Update the UI: set the value of the shortcut textbox.
 */
async function updateUI()
{
    let commands = await browser.commands.getAll();
    for(command of commands)
    {
        if(command.name === CmdUndoSession)
        {
            document.querySelector('#shortcut').value = command.shortcut;
        }
    }
}

async function updateShortcut()
{
    try
    {
        await browser.commands.update({
            name: CmdUndoSession,
            shortcut: document.querySelector('#shortcut').value
        });
        console.log("Shortcut changed.");
        IconNotOk.style.display = "none";
        IconOk.style.display = "inline-block";
    }
    catch(Error)
    {
        console.error(Error);
        IconOk.style.display = "none";
        IconNotOk.style.display = "inline-block";
    }
}

/**
 * Reset the shortcut and update the textbox.
 */
async function resetShortcut()
{
    await browser.commands.reset(CmdUndoSession);
    updateUI();
}

/**
 * Update the UI when the page loads.
 */
document.addEventListener('DOMContentLoaded', updateUI);

/**
 * Handle update and reset button clicks
 */
// document.querySelector('#update').addEventListener('click', updateShortcut)
document.querySelector('#shortcut').addEventListener('input', updateShortcut)
document.querySelector('#reset').addEventListener('click', resetShortcut)
