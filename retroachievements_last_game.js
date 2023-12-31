// Replace these with your actual username and API key
let USER = 'PUT-USERNAME-HERE';
let API_KEY = 'PUT-API-KEY-HERE';

let URL_BASE = 'https://retroachievements.org';

let userProfile = await getUserProfile();

let lastGame = await getGameById(userProfile['LastGameID']);

if (config.runsInWidget) {
    let widget = await createWidget(lastGame)

    Script.setWidget(widget)

} else if (config.runsWithSiri) {
    let table = await createTable(lastGame)

    await QuickLook.present(table)
} else {
    let table = await createTable(lastGame)

    await QuickLook.present(table)
}

Script.complete()

async function createWidget(game) {
    let widget = new ListWidget();

    // Add an image to the widget
    let imageUrl = URL_BASE + game['ImageTitle']
    let image = await getImageByUrl(imageUrl);
    let imageItem = widget.addImage(image);
    imageItem.leftAlignImage();

    // Add a spacer between the image and text
    widget.addSpacer();

    // Add text to the widget
    let gameTitle = game['Title'];
    let textItem = widget.addText(gameTitle);
    textItem.rightAlignText();

    // Set widget layout
    //widget.layoutHorizontally();

    widget.refreshAfterDate = getNextDateToRefresh();

    return widget;
}

async function createTable(game) {
    // Create a new UI element
    let view = new UITable();

    // Add an image row
    let imageRow = new UITableRow();
    let imageUrl = URL_BASE + game['ImageTitle']
    let image = await getImageByUrl(imageUrl);
    let imageCell = UITableCell.image(image);
    imageRow.addCell(imageCell);

    // Add text cell
    let gameTitle = game['Title'];
    let textCell = UITableCell.text(gameTitle);
    imageRow.addCell(textCell);

    // Add the row to the view
    view.addRow(imageRow);

    // Present the view
    await view.present();
}

async function getUserProfile() {
    let url = URL_BASE + '/API/API_GetUserProfile.php?u=' + USER + '&y=' + API_KEY;
    let req = new Request(url);
    let json = await req.loadJSON();

    return json;
}

async function getGameById(id) {
    let url = URL_BASE + '/API/API_GetGame.php?i=' + id + '&y=' + API_KEY;
    let req = new Request(url);
    let json = await req.loadJSON();

    return json;
}

async function getImageByUrl(imageUrl) {
    let req = new Request(imageUrl);
    let image = await req.loadImage();

    return image;
}

function getNextDateToRefresh() {
    let date = new Date();
    let nextDay = date.getDate() + 1;

    date.setDate(nextDay);

    return date;
}