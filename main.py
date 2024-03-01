import json
import os
import subprocess
import sys

import eel
import boto3

import tkinter as tk
from tkinter import filedialog
from tkinter import messagebox

import requests
import urllib.parse

####################################################################################################
## Cloudflare R2 Explorer/Desktop app
## developed by aznoc https://github.com/azn0c
## modified by rahmap https://github.com/rahmap add directory to config.json
####################################################################################################


try:
    with open('config.json', 'r') as f:
        config = json.load(f)
except:
    messagebox.showerror("Error",
                         "error loading config.json, make sure it's in the same directory as cloudflare-r2-desktop")

eel.init('web')

s3 = boto3.resource('s3',
                    endpoint_url="https://%s.r2.cloudflarestorage.com" % (config['account_id']),
                    aws_access_key_id=config['access_key_id'],
                    aws_secret_access_key=config['secret_access_key']
                    )


@eel.expose  # fetching objects from bucket, bucket name is stored in config
def fetchobjects():
    bucket = s3.Bucket(config['bucket_name'])
    objs = {}
    for item in bucket.objects.all():
        objs[item.key] = {}
        objs[item.key]['last_modified'] = str(item.last_modified.strftime("%Y-%m-%d %H:%M:%S"))
        objs[item.key]['size'] = str(item.size)
    print("fetched objects from cloudflare API")
    return (json.dumps(objs))


@eel.expose
def fetchbucketname():  # function used to populate the page title
    return (config['bucket_name'] + ' bucket')


@eel.expose
def objupload():  # handle file uploads to the bucket
    root = tk.Tk()
    root.withdraw()

    file_paths = filedialog.askopenfilenames()
    if not file_paths:
        return 0

    files = list(file_paths)
    i = 0
    for file_path in files:
        print('uploading file %s (%s)' % (i, file_path))
        i += 1
        with open(file_path, "rb") as f:
            file_name = os.path.basename(file_path)
            directory = config.get('directory', '')  # Get directory or an empty string if not present
            directory = directory + '/' if directory else ''  # Add '/' if directory is present
            object_key = directory + file_name

            bucket = s3.Bucket(config['bucket_name'])
            res = bucket.Object(object_key).put(Body=f.read())

    return i


@eel.expose
def objdelete(objectname):  # handle file uploads to the bucket
    bucket = s3.Bucket(config['bucket_name'])
    bucket.Object(objectname).delete()
    return


@eel.expose
def objcopylink(objectname):  # returns url ready for copying to clipboard by electron code
    url = "https://" + config['domain'] + "/" + urllib.parse.quote(objectname, safe='/')
    return url


@eel.expose
def objdl(
        objectname):  # function trigged by clicking the download button next to an object, downloads object over http and saves where user selects

    url = "https://" + config['domain'] + "/" + objectname

    root = tk.Tk()
    root.withdraw()
    root.directory = filedialog.askdirectory(title="Select where to save {}".format(objectname))

    if not root.directory:
        return 1

    file_name = os.path.join(root.directory + '/' + objectname)

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'}

    req = requests.get(url, headers=headers, timeout=10)

    r = requests.get(url)
    with open(file_name, 'wb') as f:
        f.write(req.content)

    return file_name


@eel.expose
def openurl(
        objectname):  # this function is triggered by clicking on an object's name, which opens it in the user's browser
    url = "https://" + config['domain'] + "/" + objectname
    if sys.platform in ['win32', 'win64']:
        os.startfile(url)
    elif sys.platform == 'darwin':
        subprocess.Popen(['open', url])
    else:
        try:
            subprocess.Popen(['xdg-open', url])
        except OSError:
            print('Please open a browser on: ' + url)


if sys.platform in ['win32', 'win64']:  # if OS is windows then set eel path to location of electron.exe
    eel.browsers.set_path('electron', 'node_modules/electron/dist/electron.exe')

eel.start("index.html", mode="electron")
