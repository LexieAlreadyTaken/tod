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

var eventCount = 0;
var finishedCount = 0;

function updateCounts(){
  $("eventCount").innerHTML = "You have "+ eventCount+" item"+autoPlural(eventCount)+" to do!"
}

function syncCookie(name, finished){
  document.cookie = "name="+name+"; finished="+finished+"; expires=Thu, 18 Dec 2043 12:00:00 GMT"
}

function readCookie(){
  var ck = document.cookie.split(";")
  console.log(ck)
}

function toggleFinish(ev){
  console.log(ev)
  var el = ev.srcElement
  if(el.parentElement.getAttribute("class").includes("unfinished")){
    el.innerHTML="√"
    el.parentElement.setAttribute("class","finished")
    updateCounts(--eventCount)
    finishedCount++
    //syncCookie(el.parentElement.chil)
  }
  else{
    el.innerHTML="○"
    el.parentElement.setAttribute("class","unfinished")
    updateCounts(++eventCount)
    finishedCount--
  }
}

function addTodo(){
  var text = document.getElementById("eventName").value
  if(!text){
    alert("An event must have a name!")
    return
  }
  var node=document.createElement("li")
  node.innerHTML="<span>"+text+"</span><span class='toggler unfinished'>○</span>"
  node.setAttribute("class","unfinished")
  $("eventList").appendChild(node)
  $("eventName").value=""
  updateCounts(++eventCount)
  syncCookie(text,"0")

  var a = $all("toggler")
  a[a.length-1].addEventListener("click", function(){toggleFinish(event)})
}

$("eventName").addEventListener("keyup",function(event){
  if(event.keyCode==13){
    addTodo()
  }
})
