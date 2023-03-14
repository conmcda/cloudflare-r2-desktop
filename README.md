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

Be sure to edit the config.py with your Cloudflare API details:

```python
account_id = ''
access_key_id = ''
secret_access_key = ''

domain = 'custom.domain.here or r2.dev domain' # make sure no slashes
bucket_name = "files" # your bucket name here
```

Run the following commands in the root folder:

```bash
pip install -r requirements.txt
npm update
python main.py
```

If you like this app please be sure to leave a star on my github repo, thanks.
