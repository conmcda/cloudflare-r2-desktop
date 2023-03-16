eel.expose(fetchobjs)
function fetchobjs() {
  eel.fetchobjects()(function(objs){ //populates the html table with objects, then uses datatable for sorting, pagination etc.
    const res = JSON.parse(objs);
    for (const key in res){

        document.getElementsByTagName("tbody")[0].innerHTML+= '<tr><td class="obj-sel"></td><td class="tg-0lax obj-name"><a data-objectname="'+key+'" class="filename" onclick="eel.openurl(\''+key+'\') ">'+key+'</a></td><td class="tg-0lax obj-size">'+res[key]['size']+'</td><td class="tg-0lax obj-mod">'+res[key]['last_modified']+'</td><td class="tg-0lax obj-dl"><i onclick="eel.objdl(\''+key+'\')(function(filepath){filesavenoti(filepath);});" class="gg-software-download"></i></td><td class="tg-0lax obj-url"><i onclick="eel.objcopylink(\''+key+'\')(function(url){setClipboard(url);});" class="gg-link"></i></td></tr>';
    }
    table = $('#objtable').DataTable({
      "paging" : true,
      "ordering" : true,
      "scrollCollapse" : true,
      "searching" : true,
      "responsive": true,
      "columnDefs" : [
        {
          "targets":"obj-mod",
          "type":"date-eu"
        },
        {
          "orderable": false,
          "className": 'select-checkbox',
          "targets":   0
        }
      ],
      "bInfo": true,
      "select": {
        "style":    'multi',
        "selector": 'td:first-child'
      }
    });
    table.order( [ 3, 'desc' ] ); // sorts table by date (most recent first)
    table.draw();
  });
}

function refreshtable() { // refreshes table with fresh list of objects from cloudflare api
  eel.fetchobjects()(function(objs){ // calls fetchobjects python function          

    document.getElementById("objtable_wrapper").remove(); // removes the data table and line below recreates table
    document.getElementById("files").innerHTML = '<table id="objtable" class="tg"><thead><tr><th class="obj-sel"></th><th class="tg-0lax obj-name">Objects</th><th class="tg-0lax obj-size">Size</th><th class="tg-0lax obj-mod">Modified</th><th class="tg-0lax obj-dl"></th><th class="tg-0lax obj-url"></th></tr></thead><tbody></tbody></table>';

    const res = JSON.parse(objs);
    for (const key in res){

        document.getElementsByTagName("tbody")[0].innerHTML+= '<tr><td class="obj-sel"></td><td class="tg-0lax obj-name"><a data-objectname="'+key+'" class="filename" onclick="eel.openurl(\''+key+'\') ">'+key+'</a></td><td class="tg-0lax obj-size">'+res[key]['size']+'</td><td class="tg-0lax obj-mod">'+res[key]['last_modified']+'</td><td class="tg-0lax obj-dl"><i onclick="eel.objdl(\''+key+'\')(function(filepath){filesavenoti(filepath);});" class="gg-software-download"></i></td><td class="tg-0lax obj-url"><i onclick="eel.objcopylink(\''+key+'\')(function(url){setClipboard(url);});" class="gg-link"></i></td></tr>';
    }
    table = $('#objtable').DataTable({
      "paging" : true,
      "ordering" : true,
      "scrollCollapse" : true,
      "searching" : true,
      "responsive": true,
      "columnDefs" : [
        {
          "targets":"obj-mod",
          "type":"date-eu"
        },
        {
          "orderable": false,
          "className": 'select-checkbox',
          "targets":   0
        }
      ],
      "bInfo": true,
      "select": {
        "style":    'multi',
        "selector": 'td:first-child'
      }
    });
    table.order( [ 3, 'desc' ] );
    table.draw();
  });
}


window.addEventListener('load', (event) => {
    fetchobjs();
    eel.fetchbucketname()( // calls python fetchbucketname function
      function(bucketname) {
        document.getElementById("bucketname").innerHTML = bucketname; // populates the title with bucket name 
      });
});

eel.expose(setClipboard)
function setClipboard(text) {
  window.ipcRender.setclip(text); // sends clipboard url over ipc to main.js (ready to copy to clipboard with electron's clipboard.writeText)
  Toastify({ // display green toast notification saying "URL Copied to clipboard."
    text: "URL Copied to clipboard.",
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    gravity: "bottom",
    position: "right",
  }).showToast();
}

function filesavenoti(filepath) {
  if (filepath == 1) {
    return;
  }
  Toastify({ // display green toast notification on file save
    text: "Successfully saved file to " + filepath,
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    gravity: "bottom",
    position: "right",
  }).showToast();
}
function objuploadnoti(file_count) {
  if (file_count == 0) {
    return;
  }
  Toastify({ // display green toast notification on file save
    text: "Successfully uploaded " + file_count + " objects.",
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    gravity: "bottom",
    position: "right",
  }).showToast();
}
function refreshnoti() {
  Toastify({ // display green toast notification on file save
    text: "Refreshed objects list",
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    gravity: "bottom",
    position: "right",
  }).showToast();
}

function objdeletenoti(filecount) {
  Toastify({ // display green toast notification on object deletion
    text: "Successfully deleted " + filecount + " objects.",
    className: "info",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    gravity: "bottom",
    position: "right",
  }).showToast();
}

function objdeleteemptynoti() {
  Toastify({ // display red toast notification when no objects selected for deletion
    text: "Error: no objects selected to delete.",
    className: "info",
    style: {
      background: "linear-gradient(to right, #b00000, #c93d3d)",
    },
    gravity: "bottom",
    position: "right",
  }).showToast();
}

document.getElementById('btnupload').addEventListener('click', () => {
  eel.objupload()(function(file_count){refreshtable();objuploadnoti(file_count);}); // calls objupload python function, then refreshes the table to display new object uploaded
})

document.getElementById('btnrefresh').addEventListener('click', () => { // handles the refresh button, to display any new objects from cloudflare bucket
  refreshtable();
  refreshnoti();
})

document.getElementById('btndelete').addEventListener('click', () => { // handles the delete button, to delete objects from a bucket
  deleteobjects();
})

function deleteobjects(){ 
  table = $('#objtable').DataTable({
    "retrieve": true
  }); 

  i = 0;
  table.rows('.selected').every( function() { // loop through all selected objects and fetch data-objectname from html got from table
    i++;
    var selectedobj = String(this.data()[1]);
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = selectedobj;    
    
    var objname = tmpDiv.querySelector('a').getAttribute('data-objectname');
    //console.log(objname);

    eel.objdelete(objname)() // calls objdelete python function with object's name as paramater and deletes each selected object
   });

   if(i == 0) {
    objdeleteemptynoti();
    return
   }
   objdeletenoti(i);
   refreshtable();
   
}
