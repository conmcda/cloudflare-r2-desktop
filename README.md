# A simple Cloudflare R2 Desktop App

![Alt text](screenshot.png?raw=true "App Screenshot")

This app is a simple and easy-to-configure explorer for Cloudflare R2 buckets. The app is developed in python with python eel (similar to electron). It has simple features such as:

- Uploading a file to a bucket

- Listing objects in a bucket

- Searching by object name

- Sorting objects by name

- Sorting objects by date

- Sorting objects by file size

## Installing/running the app

Be sure to edit the config.json with your Cloudflare API details, domain and bucket name:

```json
{
	"account_id": "",
	"access_key_id": "",
	"secret_access_key": "",
	"domain": "custom.domain.here or r2.dev domain",
	"bucket_name": "your bucket name here"
}
```

**Make sure domain doesn't contain any slashes.**



Run the following commands in the root folder:

```bash
pip install -r requirements.txt
npm update
python main.py
```

If you like this app please be sure to leave a star on my github repo, thanks.
