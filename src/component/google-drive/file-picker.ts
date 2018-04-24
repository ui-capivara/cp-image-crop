declare let gapi, google;

export class FilePicker {

    private apiKey;
    private clientId;
    private onSelect;
    private picker;

    constructor(options) {
        // Config
        this.apiKey = options.apiKey;
        this.clientId = options.clientId;
        // Events
        this.onSelect = options.onSelect;
        // Load the drive API
        gapi.client.setApiKey(this.apiKey);
        gapi.client.load('drive', 'v2', this._driveApiLoaded.bind(this));
        google.load('picker', '1', { callback: this._pickerApiLoaded.bind(this) });
    }

    /**
     * Open the file picker.
     */
    public open() {
        // Check if the user has already authenticated
        const token = gapi.auth.getToken();
        if (token) {
            this._showPicker();
        } else {
            // The user has not yet authenticated with Google
            // We need to do the authentication before displaying the Drive picker.
            this._doAuth(false, function () { this._showPicker(); }.bind(this));
        }
    }

    /**
     * Show the file picker once authentication has been done.
     * @private
     */
    public _showPicker() {
        try {
            const accessToken = gapi.auth.getToken().access_token;
            this.picker = new google.picker.PickerBuilder()
                .addView(google.picker.ViewId.DOCS_IMAGES)
                .setAppId(this.clientId)
                .setOAuthToken(accessToken)
                .setCallback(this._pickerCallback.bind(this))
                .build()
                .setVisible(true);
        } catch (e) { }
    }
    /**
     * Called when a file has been selected in the Google Drive file picker.
     * @private
     */
    public _pickerCallback(data) {
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
                const file = data[google.picker.Response.DOCUMENTS][0],
                id = file[google.picker.Document.ID],
                request = gapi.client.drive.files.get({
                    fileId: id
                });
                request.execute(this._fileGetCallback.bind(this));
        }
    }

    /**
     * Called when file details have been retrieved from Google Drive.
     * @private
     */
    public _fileGetCallback(file) {
        if (this.onSelect) {
            const accessToken = gapi.auth.getToken().access_token;
            file.downloadUrl += '&access_token=' + accessToken; 
            this.onSelect(file);
        }
    }

    /**
     * Called when the Google Drive file picker API has finished loading.
     * @private
     */
    public _pickerApiLoaded() {
    }

    /**
     * Called when the Google Drive API has finished loading.
     * @private
     */
    _driveApiLoaded() {
        this._doAuth(true);
    }

    /**
     * Authenticate with Google Drive via the Google JavaScript API.
     * @private
     */
    _doAuth(immediate, callback?) {
        gapi.auth.authorize({
            client_id: this.clientId,
            scope: 'https://www.googleapis.com/auth/photos https://www.googleapis.com/auth/drive.readonly',
            immediate: immediate
        }, callback);
    }

}