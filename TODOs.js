function $(q){
  return document.getElementById(q)
}
function $all(q){
  return document.getElementsByClassName(q)
}
function autoPlural(num){
  if(num>1)
    return "s"
  return ""
}

var eventCount = 0
var finishedCount = 0
var todos = new Object()
var lang = false //0:English; 1:Chinese
var orig = ""

function updateCounts(){
  delete todos[NaN]
  eventCount = todos.length
  finishedCount = Object.values(todos).filter((a)=>a==0).length
  if(lang){
    $("eventCount").innerHTML = "您还有"+finishedCount+"件事要做！"
  }
  else{
    $("eventCount").innerHTML = "You have "+ finishedCount+" item"+autoPlural(finishedCount)+" to do!"
  }
}

function syncCookie(){
  clearAllCookie()
  for(todo in todos){
    document.cookie = todo+"="+todos[todo]+"; expires=Thu, 18 Dec 2043 12:00:00 GMT"
  }
}

//清除所有cookie函数
function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if(keys) {
    for(var i = keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}

function reSyncData(){
  var ck = document.cookie.split("; ")
  //console.log(ck)
  var ia = []
  $("eventList").innerHTML=""
  for(var i=0; i<ck.length; i++){
    (ck[i])
    if(ck[i]!="NaN"){
      ia = ck[i].split('=')
      todos[ia[0]]=parseInt(ia[1])
      var node=document.createElement("li")
      node.innerHTML="<span>"+ia[0]+"</span><span class='toggler'>"+(parseInt(ia[1])?"√":"○")+"</span>"+
        "<div class='deleting'></div>"
      node.setAttribute("class",parseInt(ia[1])?"finished":"unfinished")
      $("eventList").appendChild(node)
    }
  }
  var a = $all("toggler")
  for(i=0;i<a.length;i++){
    a[i].addEventListener("click", function(){toggleFinish(event)})
  }
  a = $("eventList").children
  for(i=0;i<Object.values(a).length;i++){
    initSwipe(a[i])
    initModify(a[i])
  }

  updateCounts()
}

function initSwipe(x){
  x.addEventListener("touchstart",function(){
    var ds = $all("deleting")
    for(i=0;i<ds.length;i++){
      ds[i].setAttribute("style","width:0;")
      ds[i].innerHTML=""
    }
  })
  x.addEventListener("touchmove", function (e){
    e.stopPropagation();
    if(e.target.lastChild.localName==="div"){
      var x = e.touches[0].clientX
      if(e.target.clientWidth>275-x && x<275){
        var node = e.target.lastChild
        node.setAttribute("style","width:"+(275-x)+"px;")
        node.innerHTML="×"
      }
      else if(e.target.clientWidth<=275-x){
        var node = e.target.lastChild
        node.setAttribute("style","width:0;")
        node.innerHTML=""
        delete todos[String(e.target.firstChild.innerHTML)]
        e.target.remove()
        syncCookie()
        updateCounts()
      }
    }
  })
}

function initModify(x){
  x.firstChild.addEventListener("click",function(e){
    var par = e.target.parentElement
    console.log(par.getAttribute("class"))
    var oriv = par.getAttribute("class").includes("unfinished")
    orig = par.firstChild.innerHTML
    par.removeChild(par.firstChild)
    var node = document.createElement("input")
    node.setAttribute("type","text")
    node.setAttribute("class","altera")
    node.setAttribute("value",orig)
    if(!oriv){
      node.setAttribute("class","altera finished")
    }
    if(lang){
      node.setAttribute("placeholder","改改？")
    }
    else{
      node.setAttribute("placeholder","Any change?")
    }
    par.prepend(node)
    par.firstChild.addEventListener("blur",function(e){   
      var par = e.target.parentElement
      var val = par.firstChild.value
      var node = document.createElement("span")
      node.innerHTML = val
      par.prepend(node)
      todos[val]=todos[orig]
      if(val!==orig){
        delete todos[orig]
      }
      par.removeChild(par.children[1])
      initModify(par)
      updateCounts()
      syncCookie()
    })
    par.firstChild.addEventListener("keyup",function(e){
      if(e.keyCode==13){
        e.target.blur()
      }
    })
  })
}

function toggleFinish(ev){
  var el = ev.srcElement
  if(el.parentElement.getAttribute("class").includes("unfinished")){
    el.innerHTML="√"
    el.parentElement.setAttribute("class","finished")
    todos[el.offsetParent.childNodes[0].innerHTML]=1
    updateCounts()
    syncCookie()
  }
  else{
    el.innerHTML="○"
    el.parentElement.setAttribute("class","unfinished")
    todos[el.offsetParent.childNodes[0].innerHTML]=0
    updateCounts()
    syncCookie()
  }
}

function hideUnfinished(){
  var a = $all("unfinished")
  for(var i=0; i<a.length; i++){
    a[i].setAttribute("style","display:none;")
  }
}
function hideFinished(){
  var a = $all("finished")
  for(var i=0; i<a.length; i++){
    if(a[i].getAttribute("class")==="finished"){
      a[i].setAttribute("style","display:none;")
    }
  }
}
function showAll(){
  console.log("blur")
  var a = $("eventList").children
  for(var i=0; i<a.length; i++){
    console.log(a[i])
    a[i].setAttribute("style","display:auto")
  }
}

function addTodo(){
  var text = document.getElementById("eventName").value
  if(!text){
    alert("An event must have a name!")
    return
  }
  var node=document.createElement("li")
  node.innerHTML="<span>"+text+"</span><span class='toggler'>○</span><div class='deleting'></div>"
  node.setAttribute("class","unfinished")
  $("eventList").appendChild(node)
  var ita = $("eventList").lastChild
  initSwipe(ita)
  initModify(ita)
  $("eventName").value=""
  todos[text] = 0
  updateCounts()
  syncCookie()

  var a = $all("toggler")
  a[a.length-1].addEventListener("click", function(){toggleFinish(event)})
}

$("eventName").addEventListener("keyup",function(event){
  if(event.keyCode==13){
    addTodo()
  }
})


window.onload = function(){
  reSyncData()

  $("removeFinished").addEventListener("click",function(){
    for(todo in todos){
      console.log(todos[todo])
      if(todos[todo]==1){
        delete todos[todo]
      }
    }
    syncCookie()
    reSyncData()
  })

  $("onlyFinished").addEventListener("click",hideUnfinished)
  $("onlyUnfinished").addEventListener("click",hideFinished)
  $("showAll").addEventListener("click",showAll)
  
  document.cookie = "default_unit_second=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "NaN=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "1;expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

document.addEventListener("click",function(){
  var ds = $all("deleting")
  for(i=0;i<ds.length;i++){
    ds[i].setAttribute("style","width:0;")
    ds[i].innerHTML=""
  }
})

$("langswc").addEventListener("click",function(){
  lang = !lang
  if(lang){
    $("theH1").innerHTML="待办"
    $("langswc").innerHTML="English"
    $("eventName").setAttribute("placeholder","想做什么？")
    if(Object.keys(todos).length===0){
      $("eventCount").innerHTML="恭喜！您还有0件事要做！"
    }
    else{
      updateCounts()
    }
  }
  else{
    $("theH1").innerHTML="TODOs"
    $("langswc").innerHTML="中文"
    $("eventName").setAttribute("placeholder","Planning what?")
    if(Object.keys(todos).length===0){
      $("eventCount").innerHTML="You have 0 item to do! Congratulations!"
    }
    else{
      updateCounts()
    }
  }
})
